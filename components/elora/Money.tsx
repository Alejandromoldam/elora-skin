import { moneyCode, moneyNumber } from "@/lib/money";

// Precio con el código de moneda en pequeño al lado: "$27 USD".
// translate="no" evita que el traductor automático lo convierta en
// "27 dólares estadounidenses" y rompa el diseño.
export default function Money({ amount, currency = "USD" }: { amount: number | string; currency?: string }) {
  return (
    <span translate="no" className="notranslate money">
      {moneyNumber(amount, currency)}
      <span className="usd">{moneyCode(currency)}</span>
    </span>
  );
}
