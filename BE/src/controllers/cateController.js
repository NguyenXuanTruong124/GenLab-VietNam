const Category = require("../models/Category");

// Lấy tất cả category
exports.getAll = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// Lấy category theo ID
exports.getById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: "Không tìm thấy loại quan hệ" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// Tạo mới category
exports.create = async (req, res) => {
  try {
    const { Category_ID, Cate_name, Status } = req.body;
    const category = await Category.create({ Category_ID, Cate_name, Status });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// Cập nhật category
exports.update = async (req, res) => {
  try {
    const { Cate_name, Status } = req.body;
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: "Không tìm thấy loại quan hệ" });
    await category.update({ Cate_name, Status });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// Xóa category
exports.remove = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: "Không tìm thấy loại quan hệ" });
    await category.destroy();
    res.json({ message: "Đã xóa thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};
