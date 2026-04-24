import type { Metadata } from "next";
import {
  HobokenApartmentsUnderPriceContent,
  buildMetadata,
} from "../_apartments-under-page";

export const metadata: Metadata = buildMetadata(2000);

export default function Page() {
  return <HobokenApartmentsUnderPriceContent priceNum={2000} />;
}
