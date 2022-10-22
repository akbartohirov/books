const express = require("express");
const router = express.Router();

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  res.status(200).json({
    data: {
      username,
      password,
    },
  });
});

router.post("/register", (req, res) => {
  const { username, email, password } = req.body;

  res.status(200).json({
    data: {
      username,
      email,
      password,
    },
  });
});

module.exports = router;
