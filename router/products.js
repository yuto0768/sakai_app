const router = require("express").Router();
var multer = require('multer');
var upload = multer({ dest: ' uploads/' });
const db = require("../data/MyDatabase")
const { Product, Purchase, User, Cart, Option, sequelize } = require("../data/MyDatabase")


async function getProducts(req, res) {
    let rows = await Product.findAll()
    res.render("products/products.ejs", { layout: "layout_login.ejs", rows });
}

async function getProduct(req, res, id) {
    let product = await Product.findOne({
        where: { id: id },
        include: [{ model: Option, required: false }]
    })
    res.render("products/details.ejs", { layout: "layout_login.ejs", product });
}




router.get("/", (req, res) => {
    getProducts(req, res)
        // Product.findAll()
        //     .then((rows) => {
        //         res.render("products_page.ejs", { layout: "layout_login.ejs", rows }); //使用する変数を第２引数としてかく
        //     })
});

router.get("/:id/purchase", async(req, res) => {
    // let user = await User.findOne({ where: { id: req.session.user.id } })
    // let product = await Product.findOne({ where: { id: req.params.id } })
    // await user.addCart(product)
    let cart = await Cart.findOne({ where: { userId: req.session.user.id, productId: req.params.id } })
    if (cart) {
        cart.count += 1;
        await cart.save();
    } else {
        await Cart.create({ userId: req.session.user.id, productId: req.params.id }) //30~32行目と同じ内容
    }
    res.redirect("/cart/");
});

router.post("/:id/purchase", (req, res) => {
    purchaseProduct(req, res)
});

router.get("/:id", (req, res) => {
    getProduct(req, res, req.params.id)
});

module.exports = router;