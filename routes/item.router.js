var express = require("express");
const router = express.Router();

const {
  addItem,
  deleteSingle,
  getAll,
  getSum,
  getInvestment,
  transaction,
} = require("../controllers/items.controller");

router.post("/addItem", addItem);
router.delete("/:id", deleteSingle);
router.get("/", getAll);
router.get("/getSum/:id", getSum);
router.get("/getInvestment", getInvestment);
router.post("/transaction/:id", transaction);

module.exports = router;
