const express = require("express");


const router = express.Router();

// Log a user out
router.get("/", (req, res) => {
  req.user.setLoginStatus(false);
  res.redirect("/");
});


module.exports = router;