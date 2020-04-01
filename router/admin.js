const router = require("express").Router();
var { Product } = require("../data/MyDatabase");

async function getProducts(req, res) {
    let rows = await Product.findAll()
    res.render("admin/list.ejs", { rows });
}

router.get("/", (req, res) => {
    getProducts(req, res)
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