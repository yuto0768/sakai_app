const router = require("express").Router();
const db = require("../data/MyDatabase")
const { Product } = require("../data/MyDatabase")


async function getProducts(req, res) {
    let rows = await Product.findAll()
    res.render("products/products.ejs", { layout: "layout_login.ejs", rows });
}


router.get("/", (req, res) => {
    getProducts(req, res)
        // Product.findAll()
        //     .then((rows) => {
        //         res.render("products_page.ejs", { layout: "layout_login.ejs", rows }); //使用する変数を第２引数としてかく
        //     })
});

router.get("/details", (req, res) => {
    res.render("products/details.ejs"); //使用する変数を第２引数としてかく
});

router.get("/details/purchase", (req, res) => {
    res.render("products/purchase.ejs", { layout: "layout_login.ejs" }); //使用する変数を第２引数としてかく
});

router.get("/details/purchase/confirm", (req, res) => {
    res.render("confirm.ejs", { layout: "layout_login.ejs" }); //使用する変数を第２引数としてかく
});

module.exports = router;