const getAdminDashboard = async (req, res) => {
  try {
    const products = await Product.find({});
    let lowStockProducts = [];

    console.log("📦 Total productos:", products.length);

    products.forEach(prod => {
      const lowColors = prod.colors?.filter(c => c.stock <= LOW_STOCK_THRESHOLD);

      if (lowColors?.length) {
        console.log(`🔻 Bajo stock: ${prod.name} - Colores:`, lowColors);
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

    res.status(200).json({
      lowStockCount: lowStockProducts.length,
      lowStockProducts,
      pendingOrdersCount: pendingOrders.length,
      recentPendingOrders: pendingOrders,
    });
  } catch (err) {
    console.error("❌ Error en dashboard:", err);
    res.status(500).json({ message: "Error al cargar el dashboard" });
  }
};
