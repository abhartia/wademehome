import type { Metadata } from "next";
import {
  HobokenApartmentsUnderPriceContent,
  buildMetadata,
} from "../_apartments-under-page";

export const metadata: Metadata = buildMetadata(3000);

export default function Page() {
  return <HobokenApartmentsUnderPriceContent priceNum={3000} />;
}
