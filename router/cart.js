const router = require("express").Router();
var { Product, Purchase, User, Cart } = require("../data/MyDatabase");

var format = require('date-format');
const paginate = require('express-paginate');

async function productCart(req, res) {
    let cart = await Cart.create({
        userId: req.session.user.id,
        productId: req.body.productId,
        price: req.body.price,
    });
}


router.get("/", paginate.middleware(1, 50), async(req, res) => {
    let rows = await Cart.findAll({
        include: [
            { model: User, required: true },
            { model: Product, required: true }
        ],
        where: {
            userId: req.session.user.id
        },
    })
    res.render("cart/cart.ejs", { rows, format, paginate })
});

router.post("/delete", (req, res) => {
    res.redirect("cart/cart.ejs");
});

router.post("/purchase", (req, res) => {
    productCart(req, res)
    res.redirect("cart/cart.ejs");
});

module.exports = router;