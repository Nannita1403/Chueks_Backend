const Order = require("../models/order");
const Product = require("../models/products");

const LOW_STOCK_THRESHOLD = 3;

const getAdminDashboard = async (req, res) => {
  try {
    const products = await Product.find({});
    let lowStockProducts = [];

    products.forEach(prod => {
    const lowColors = prod.colors?.filter(c => c.stock <= LOW_STOCK_THRESHOLD);
    if (lowColors?.length) {
        console.log("🚨 Producto con bajo stock:", prod.name, lowColors);
        lowStockProducts.push({
          _id: prod._id,
          name: prod.name,
          code: prod.code,
          colors: lowColors.map(c => ({ name: c.name, stock: c.stock })),
        });
      }
    });

    const pendingOrders = await Order.find({ status: "pending" })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name");

    res.status(200).json({/*      lowStockCount: lowStockProducts.length,
      lowStockProducts,
      pendingOrdersCount: pendingOrders.length,
      recentPendingOrders: pendingOrders,
    });*/
  lowStockCount: 2,
  lowStockProducts: [
    {
      _id: "123",
      name: "Remera Chueks",
      code: "CHU-01",
      colors: [{ name: "Rojo", stock: 2 }]
    }
  ],
  pendingOrdersCount: 1,
  recentPendingOrders: [
    { _id: "456", createdAt: new Date(), user: { name: "Juan Pérez" } }
  ]
});

  } catch (err) {
    console.error("❌ Error en dashboard:", err);
    res.status(500).json({ message: "Error al cargar el dashboard" });
  }
};

module.exports = { getAdminDashboard };
