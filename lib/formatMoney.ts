const formatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
});

export default function formatMoney(pennies: number) {
  const pounds = pennies / 100;
  return formatter.format(pounds);
}
