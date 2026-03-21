from listings.market_snapshot import build_market_snapshot_sql, normalize_us_zip_query


def test_normalize_us_zip_query() -> None:
    assert normalize_us_zip_query("78701") == "78701"
    assert normalize_us_zip_query("78701-1234") == "78701"
    assert normalize_us_zip_query("") is None


def test_build_market_snapshot_sql_zip_filter_uses_column() -> None:
    cols = {"zipcode", "min_rent", "max_rent", "bedrooms"}
    out = build_market_snapshot_sql('"listings"', cols, zip_code="78701")
    assert out is not None
    sql, params = out
    assert "zipcode" in sql.lower()
    assert params["zip5"] == "78701"


def test_build_market_snapshot_sql_city_state_filter() -> None:
    cols = {"city", "state", "monthly_rent", "bedrooms"}
    out = build_market_snapshot_sql('"listings"', cols, city="Austin", state="TX")
    assert out is not None
    sql, params = out
    assert "city" in sql.lower()
    assert "state" in sql.lower()
    assert params["city_q"] == "Austin"
    assert params["state_q"] == "TX"
