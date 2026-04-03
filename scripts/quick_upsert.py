"""Quick upsert script using direct psycopg2 (no SQLAlchemy pool overhead)."""
import sys, os, json
import pandas as pd
import psycopg2
from psycopg2.extras import execute_values

def main():
    parquet_path = sys.argv[1]
    print(f"Reading {parquet_path}...")
    df = pd.read_parquet(parquet_path)
    print(f"  {len(df)} rows, {len(df.columns)} columns")

    if df.empty:
        print("No rows to load.")
        return

    # Connect directly with psycopg2
    conn = psycopg2.connect(
        host='wademehome-pg.postgres.database.azure.com',
        port=5432,
        user='postgres',
        password='BYVT&A*YBU(Na',
        dbname='postgres',
        sslmode='require',
        connect_timeout=15
    )
    print("Connected to PostgreSQL")

    # Get DB columns
    cur = conn.cursor()
    cur.execute("""SELECT column_name FROM information_schema.columns
                   WHERE table_schema='public' AND table_name='listings'""")
    db_cols = {r[0].lower() for r in cur.fetchall()}
    print(f"  DB has {len(db_cols)} columns")

    # Drop extra parquet columns
    extra = set(c.lower() for c in df.columns) - db_cols
    if extra:
        print(f"  Dropping {len(extra)} extra columns: {sorted(extra)}")
        df = df.drop(columns=[c for c in df.columns if c.lower() in extra])

    # Dedup on listing_id
    if "listing_id" not in df.columns:
        print("ERROR: no listing_id column")
        return
    df = df.dropna(subset=["listing_id"]).drop_duplicates(subset=["listing_id"], keep="last")

    # Drop rows with nulls in NOT NULL columns
    NOT_NULL_COLS = ["address", "city", "state", "zipcode", "latitude", "longitude"]
    present_nn = [c for c in NOT_NULL_COLS if c in df.columns]
    before = len(df)
    df = df.dropna(subset=present_nn)
    dropped = before - len(df)
    if dropped:
        print(f"  Dropped {dropped} rows with null required fields ({present_nn})")
    print(f"  {len(df)} rows after dedup + NOT NULL filter")

    # Build upsert SQL
    cols = list(df.columns)
    cols_sql = ", ".join(f'"{c}"' for c in cols)
    update_cols = [c for c in cols if c != "listing_id"]
    set_sql = ", ".join(f'"{c}" = EXCLUDED."{c}"' for c in update_cols)
    insert_sql = (
        f'INSERT INTO "listings" ({cols_sql}) VALUES %s '
        f'ON CONFLICT ("listing_id") DO UPDATE SET {set_sql}'
    )

    # Convert dataframe to tuples
    import numpy as np
    def clean(v):
        if v is None or (isinstance(v, float) and np.isnan(v)):
            return None
        try:
            if pd.isna(v):
                return None
        except (ValueError, TypeError):
            pass
        if isinstance(v, (np.integer,)):
            return int(v)
        if isinstance(v, (np.floating,)):
            return float(v)
        if isinstance(v, np.bool_):
            return bool(v)
        if isinstance(v, (dict, list)):
            return json.dumps(v, default=str)
        return v

    rows = [tuple(clean(v) for v in row) for row in df.itertuples(index=False, name=None)]
    print(f"Upserting {len(rows)} rows...")

    execute_values(cur, insert_sql, rows, page_size=min(len(rows), 500))
    conn.commit()
    cur.close()
    conn.close()
    print(f"Done! Upserted {len(rows)} rows.")

if __name__ == "__main__":
    main()
