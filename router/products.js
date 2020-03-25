const router = require("express").Router();
const db = require("../data/MyDatabase")
const { Product } = require("../data/MyDatabase")


async function getProducts(req, res) {
    let rows = await Product.findAll()
    res.render("products/products.ejs", { layout: "layout_login.ejs", rows });
}

async function getProduct(req, res, id) {
    let product = await Product.findOne({ where: { id: id } })
    res.render("products/details.ejs", { layout: "layout_login.ejs", product });
}

router.get("/", (req, res) => {
    getProducts(req, res)
        // Product.findAll()
        //     .then((rows) => {
        //         res.render("products_page.ejs", { layout: "layout_login.ejs", rows }); //使用する変数を第２引数としてかく
        //     })
});

router.get("/:id/purchase", (req, res) => {
    res.render("products/purchase.ejs", { layout: "layout_login.ejs" }); //使用する変数を第２引数としてかく
});

router.post("/:id/save", (req, res) => {
    res.redirect("/products/confirm")
});

router.get("/confirm", (req, res) => {
    res.render("products/confirm.ejs", { layout: "layout_login.ejs" }); //使用する変数を第２引数としてかく
});

router.get("/:id", (req, res) => {
    getProduct(req, res, req.params.id)
});

module.exports = router;