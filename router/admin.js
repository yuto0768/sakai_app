const router = require("express").Router();
var { Product } = require("../data/MyDatabase");

router.get("/", (req, res) => {
    res.render("admin/list.ejs"); //使用する変数を第２引数としてかく
});

router.get("/add", (req, res) => {
    res.render("admin/add.ejs"); //使用する変数を第２引数としてかく
});

router.get("/:id", (req, res) => {
    res.render("admin/edit.ejs"); //使用する変数を第２引数としてかく
});

router.post("/:id/delete", (req, res) => {
    res.redirect("/admin");
});

module.exports = router;