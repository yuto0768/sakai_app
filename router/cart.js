const router = require("express").Router();
var { Product, Purchase, User } = require("../data/MyDatabase");

router.get("/", (req, res) => {
    res.render("cart/cart.ejs");
});

router.post("/delete", (req, res) => {
    res.redirect("cart/cart.ejs");
});

router.post("/purchase", (req, res) => {
    res.redirect("cart/cart.ejs");
});

module.exports = router;