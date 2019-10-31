const express = require("express");


const router = express.Router();

// Home page
router.get("/", (req, res) => {
  res.render("index", {routename: "Main Page", userStatus: req.user.getLoginStatus(), email: req.email});
});


module.exports = router;