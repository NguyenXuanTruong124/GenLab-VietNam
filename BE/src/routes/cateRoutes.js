const express = require("express");
const router = express.Router();
const cateController = require("../controllers/cateController");

router.get("/", cateController.getAll);
router.get("/:id", cateController.getById);
router.post("/", cateController.create);
router.put("/:id", cateController.update);
router.delete("/:id", cateController.remove);

module.exports = router;
