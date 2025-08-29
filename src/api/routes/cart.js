const express = require("express");
const router = express.Router();

const cart = require("../../controllers/cart");
const { authMiddleware } = require("../../middlewares/auth");

router.use((req, _res, next) => {
  console.log("[CART]", req.method, req.originalUrl);
  next();
});
router.use(authMiddleware);

// ⚠️ PRIMERO por línea
router.patch("/line/:lineId", cart.patchQtyByLine);
router.delete("/line/:lineId", cart.removeItemByLine);

// Luego el resto
router.get("/", cart.getCart);
router.post("/add", cart.addItem);
router.patch("/:productId", cart.patchQty);
router.delete("/:productId", cart.removeItem);
router.post("/checkout", cart.checkout);

module.exports = router;

