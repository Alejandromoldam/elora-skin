import { moneyCode, moneyNumber } from "@/lib/money";

// Precio con el código de moneda en pequeño al lado: "$27 USD".
export default function Money({ amount, currency = "USD" }: { amount: number | string; currency?: string }) {
  return (
    <>
      {moneyNumber(amount, currency)}
      <span className="usd">{moneyCode(currency)}</span>
    </>
  );
}
