const deleteItem = async (Model, id, res) => {
  try {
    const deleted = await Model.destroy({ where: { [Object.keys(Model.primaryKeys)[0]]: id } });
    if (deleted === 0) {
      return res.status(404).json({ message: "Không tìm thấy để xóa" });
    }
    res.json({ message: "Xóa thành công" });
  } catch (error) {
    console.error("Lỗi xóa:", error);
    res.status(500).json({ error: "Xóa thất bại", details: error.message });
  }
};

module.exports = deleteItem;
