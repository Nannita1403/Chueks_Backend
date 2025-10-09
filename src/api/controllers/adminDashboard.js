const Order = require("../models/order");
const Product = require("../models/products");

const LOW_STOCK_THRESHOLD = 3;

const getAdminDashboard = async (req, res) => {
  try {
    const products = await Product.find({});
    let lowStockProducts = [];
    const categoryCounts = {};

    // Procesar productos
    products.forEach(prod => {
      // Conteo por categoría
      if (prod.category) {
        prod.category.forEach(cat => {
          categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        });
      }

      // Filtrar colores con stock bajo
      const lowColors = prod.colors?.filter(c => c.stock <= LOW_STOCK_THRESHOLD);
      if (lowColors?.length) {
        lowStockProducts.push({
          _id: prod._id,
          name: prod.name,
          code: prod.code,
          colors: lowColors.map(c => ({
            name: c.name,
            stock: c.stock,
            hex: c.hex
          })),
        });
      }
    });

    // 🔸 Contar pedidos pendientes
    const pendingOrdersCount = await Order.countDocuments({ status: "pending" });

    // 🔹 Traer últimos 5 pedidos (sin filtrar por estado)
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name")
      .populate("items.product", "name category");

    // Respuesta
    res.status(200).json({
      lowStockCount: lowStockProducts.length,
      lowStockProducts,
      pendingOrdersCount,
      recentOrders,
      categoryCounts,
    });

  } catch (err) {
    console.error("❌ Error en dashboard:", err);
    res.status(500).json({ message: "Error al cargar el dashboard" });
  }
};

module.exports = { getAdminDashboard };
