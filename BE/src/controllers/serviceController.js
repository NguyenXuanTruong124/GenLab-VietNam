const Service = require("../models/Service");
const Category = require("../models/Category");
const Service_Category = require("../models/Service_Category");

// === KHAI BÁO MỐI QUAN HỆ (quan trọng để sau này mở rộng) ===
Service.belongsToMany(Category, {
  through: Service_Category,
  foreignKey: "Service_ID",
});
Category.belongsToMany(Service, {
  through: Service_Category,
  foreignKey: "Category_ID",
});

// Lấy tất cả dịch vụ (cả ON và OFF để admin/manager xem)
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.findAll({
      order: [["Service_ID", "ASC"]],
    });
    res.json(services);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Lỗi khi lấy danh sách dịch vụ.",
        error: error.message,
      });
  }
};

// Lấy thông tin chi tiết của một dịch vụ bằng ID
exports.getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findByPk(id);
    if (!service) {
      return res.status(404).json({ message: "Không tìm thấy dịch vụ." });
    }
    res.json(service);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Lỗi khi lấy thông tin dịch vụ.",
        error: error.message,
      });
  }
};

// === FIX: Thêm đầy đủ các trường dữ liệu ===
// Thêm một dịch vụ mới
exports.addService = async (req, res) => {
  try {
    const {
      Service_name,
      Description,
      Price,
      Status = "ON",
      Sample_Method,
      Estimated_Time,
    } = req.body;

    if (!Service_name || !Price) {
      return res
        .status(400)
        .json({ message: "Tên dịch vụ và Giá là bắt buộc." });
    }

    const newService = await Service.create({
      Service_name,
      Description,
      Sample_Method,
      Estimated_Time,
      Price,
      Status,
    });
    res
      .status(201)
      .json({ message: "Thêm dịch vụ thành công!", service: newService });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi thêm dịch vụ.", error: error.message });
  }
};

// Cập nhật thông tin một dịch vụ
exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      Service_name,
      Description,
      Price,
      Status,
      Sample_Method,
      Estimated_Time,
    } = req.body;

    const service = await Service.findByPk(id);
    if (!service) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy dịch vụ để cập nhật." });
    }

    const updateData = {
      Service_name,
      Description,
      Sample_Method,
      Estimated_Time,
      Price,
      Status,
    };

    await service.update(updateData);
    res.json({ message: "Cập nhật dịch vụ thành công!", service: service });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi cập nhật dịch vụ.", error: error.message });
  }
};

// Vô hiệu hóa một dịch vụ (Soft Delete)
exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findByPk(id);
    if (!service) {
      return res.status(404).json({ message: "Không tìm thấy dịch vụ." });
    }
    await service.update({ Status: "OFF" });
    res.json({ message: "Đã vô hiệu hóa dịch vụ thành công." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi vô hiệu hóa dịch vụ.", error: error.message });
  }
};
