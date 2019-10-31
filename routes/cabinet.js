const express = require("express");


const router = express.Router();

// Display the dashboard page
router.get("/", (req, res) => {
  if (req.user.getLoginStatus() == true) {
    res.render("cabinet", {routename: "Cabinet", userStatus: req.user.getLoginStatus(), email: req.email});
  } else {
    res.render("unauthenticated", {routename: "Cabinet", userStatus: req.user.getLoginStatus(), email: req.email});
  }
});


module.exports = router;