// Formato de precios de toda la tienda. Siempre en dólares y siempre con el
// código de moneda visible (USD), así nadie confunde $29 con otra moneda.
// Cualquier producto nuevo hereda esto sin tocar nada.

export function moneyNumber(amount: number | string, currency = "USD"): string {
  const value = Number(amount);
  if (Number.isNaN(value)) return String(amount);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function moneyCode(currency?: string): string {
  return (currency || "USD").toUpperCase();
}

/** "$27 USD" — para textos corridos, botones y opciones de lista. */
export function moneyWithCode(amount: number | string, currency = "USD"): string {
  return `${moneyNumber(amount, currency)} ${moneyCode(currency)}`;
}
