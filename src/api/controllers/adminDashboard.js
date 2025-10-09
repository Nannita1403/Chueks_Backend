const Order = require("../models/order");
const Product = require("../models/products");

const LOW_STOCK_THRESHOLD = 3;

const getAdminDashboard = async (req, res) => {
  try {
    const products = await Product.find({});
    let lowStockProducts = [];
    const categoryCounts = {};

    console.log("📦 Total productos:", products.length);

    products.forEach(prod => {
      // 🔸 Conteo por categoría
      if (prod.category) {
        if (categoryCounts[prod.category]) {
          categoryCounts[prod.category]++;
        } else {
          categoryCounts[prod.category] = 1;
        }
      }

      // 🔸 Bajo stock
      const lowColors = prod.colors?.filter(c => c.stock <= LOW_STOCK_THRESHOLD);
      if (lowColors?.length) {
        console.log(`🔻 Bajo stock: ${prod.name} - Colores:`, lowColors);
        lowStockProducts.push({
          _id: prod._id,
          name: prod.name,
          code: prod.code,
          colors: lowColors.map(c => ({ name: c.name, stock: c.stock, hex: c.hex })),
        });
      }
    });

    const pendingOrders = await Order.find({ status: "pending" })
  .sort({ createdAt: -1 })
  .limit(5)
  .populate("user", "name")
  .populate("items.product", "name category"); 
    res.status(200).json({
      lowStockCount: lowStockProducts.length,
      lowStockProducts,
      pendingOrdersCount: pendingOrders.length,
      recentOrders: pendingOrders, // <- renombrado para frontend
      categoryCounts, // <- 💥 esto es lo nuevo
    });
  } catch (err) {
    console.error("❌ Error en dashboard:", err);
    res.status(500).json({ message: "Error al cargar el dashboard" });
  }
};


module.exports = { getAdminDashboard };
