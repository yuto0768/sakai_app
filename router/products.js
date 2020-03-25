const router = require("express").Router();
const db = require("../data/MyDatabase")
const { Product, Purchase } = require("../data/MyDatabase")


async function getProducts(req, res) {
    let rows = await Product.findAll()
    res.render("products/products.ejs", { layout: "layout_login.ejs", rows });
}

async function getProduct(req, res, id) {
    let product = await Product.findOne({ where: { id: id } })
    res.render("products/details.ejs", { layout: "layout_login.ejs", product });
}

async function purchaseProduct(req, res) {
    let purchase = await Purchase.create({
        name: `${req.body.name1}:${req.body.name2}`,
        hurigana: `${req.body.kana1}:${req.body.kana2}`,
        zipcode: req.body.zipcode,
        address: req.body.pref,
        phone: `${req.body.tel1}:${req.body.tel2}:${req.body.tel3}`,
        mail: req.body.email,
        payment: req.body.payment
    })
    res.redirect("/products/confirm");
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

router.post("/:id/purchase", (req, res) => {
    purchaseProduct(req, res)
});

router.get("/confirm", (req, res) => {
    res.render("products/confirm.ejs", { layout: "layout_login.ejs" }); //使用する変数を第２引数としてかく
});

router.get("/:id", (req, res) => {
    getProduct(req, res, req.params.id)
});

module.exports = router;