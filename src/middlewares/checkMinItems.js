module.exports = function checkMinItems(min = 10) {
  return (req, res, next) => {
    const cart = req.cart || req.body.cart || { items: [] }; 
    const count = (cart.items || []).reduce((a, it) => a + (it.quantity || 0), 0);
    if (count < min) {
      return res.status(400).json({
        ok: false,
        message: `La compra mínima es de ${min} productos. Te faltan ${min - count}.`,
      });
    }
    next();
  };
};