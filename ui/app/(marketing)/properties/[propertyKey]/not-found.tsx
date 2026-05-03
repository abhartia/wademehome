import Link from "next/link";

export default function PropertyNotFound() {
  return (
    <main className="mx-auto max-w-3xl space-y-4 px-4 py-10 sm:px-6 sm:py-16 text-center">
      <h1 className="text-2xl font-semibold">Listing no longer available</h1>
      <p className="text-sm text-muted-foreground">
        This rental listing is no longer on Wade Me Home — it may have been
        rented, removed, or had its URL changed. Browse current inventory in
        the same neighborhood:
      </p>
      <ul className="mx-auto inline-block space-y-2 text-left text-sm">
        <li>
          <Link
            href="/nyc-rent-by-neighborhood"
            className="text-primary underline underline-offset-2"
          >
            Browse NYC apartments by neighborhood
          </Link>
        </li>
        <li>
          <Link
            href="/search"
            className="text-primary underline underline-offset-2"
          >
            Search active listings
          </Link>
        </li>
        <li>
          <Link
            href="/blog"
            className="text-primary underline underline-offset-2"
          >
            NYC renting guides
          </Link>
        </li>
      </ul>
    </main>
  );
}
