const createItem = async (Model, data, res) => {
  try {
    const result = await Model.create(data);
    res.status(201).json({ message: "Thêm thành công", data: result });
  } catch (error) {
    console.error("Lỗi thêm:", error);
    res.status(500).json({ error: "Thêm thất bại", details: error.message });
  }
};

module.exports = createItem;
