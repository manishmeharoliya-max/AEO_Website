// Prices are authoritative on the server; never accept a checkout price from the browser.
module.exports = {
  starter: { name: 'Starter', amount: 199, billing: 'one-time' },
  growth: { name: 'Growth', amount: 499, billing: 'monthly' },
  authority: { name: 'Authority', amount: 999, billing: 'monthly' },
}
