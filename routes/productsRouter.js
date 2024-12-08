const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("hey it's workting");
});

module.exports = router;
