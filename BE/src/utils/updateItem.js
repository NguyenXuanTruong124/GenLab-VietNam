const updateItem = async (Model, id, data, res) => {
  try {
    const [updated] = await Model.update(data, { where: { [Object.keys(Model.primaryKeys)[0]]: id } });
    if (updated === 0) {
      return res.status(404).json({ message: "Không tìm thấy để cập nhật" });
    }

    const updatedItem = await Model.findByPk(id);
    res.json({ message: "Cập nhật thành công", data: updatedItem });
  } catch (error) {
    console.error("Lỗi cập nhật:", error);
    res.status(500).json({ error: "Cập nhật thất bại", details: error.message });
  }
};

module.exports = updateItem;
