const getItemById = async (Model, id, res) => {
  try {
    const item = await Model.findByPk(id);
    if (!item) return res.status(404).json({ message: "Không tìm thấy dữ liệu" });
    res.json(item);
  } catch (error) {
    console.error("Lỗi lấy theo ID:", error);
    res.status(500).json({ error: "Lỗi server", details: error.message });
  }
};

module.exports = getItemById;
