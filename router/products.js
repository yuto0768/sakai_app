const router = require("express").Router();


router.get("/", (req, res) => {
    res.render("products_page.ejs", { layout: "layout_login.ejs" }); //使用する変数を第２引数としてかく
});

router.get("/details", (req, res) => {
    res.render("details_page.ejs"); //使用する変数を第２引数としてかく
});

router.get("/details/purchase", (req, res) => {
    res.render("purchase.ejs", { layout: "layout_login.ejs" }); //使用する変数を第２引数としてかく
});

router.get("/details/purchase/confirm", (req, res) => {
    res.render("confirm.ejs", { layout: "layout_login.ejs" }); //使用する変数を第２引数としてかく
});

module.exports = router;