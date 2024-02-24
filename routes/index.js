const router = require("express").Router();

router.use("/inventory", require("./item.router"));
module.exports = router;
