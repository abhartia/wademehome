import type { Metadata } from "next";
import {
  HobokenApartmentsUnderPriceContent,
  buildMetadata,
} from "../_apartments-under-page";

export const metadata: Metadata = buildMetadata(2500);

export default async function Page() {
  return await HobokenApartmentsUnderPriceContent({ priceNum: 2500 });
}
