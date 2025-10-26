import { BalanceOverview } from "./components/balance-overview";
import { TransactionHistory } from "./components/transaction-history";
import { ExchangeRates } from "./components/exchange-rates";
import { generateMeta } from "@/lib/utils";

export async function generateMetadata() {
  return generateMeta({
    title: "Payment Admin Dashboard",
    description:
      "Professional payment admin dashboard for tracking, managing and monitoring payments and transactions. Built with Hypelive, Tailwind CSS, Next.js and React.",
    canonical: "/payment"
  });
}

export default function Page() {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <BalanceOverview />
        <TransactionHistory />
      </div>
      <div className="space-y-4">
        <ExchangeRates />
      </div>
    </div>
  );
}
