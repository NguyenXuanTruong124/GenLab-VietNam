const getAllItems = async (Model, res) => {
  try {
    const items = await Model.findAll();
    res.json(items);
  } catch (error) {
    console.error("Lỗi lấy danh sách:", error);
    res.status(500).json({ error: "Lỗi server", details: error.message });
  }
};

module.exports = getAllItems;
