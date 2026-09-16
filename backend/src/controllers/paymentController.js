function paymentUnavailable(req, res) {
  return res.status(503).json({
    message: 'Online payments are not configured. Orders remain pending until payment is confirmed through an enabled payment provider.',
  });
}
module.exports = {
  createPaymentIntent: paymentUnavailable,
  confirmPayment: paymentUnavailable,
};
