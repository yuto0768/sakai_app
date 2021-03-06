const router = require("express").Router();
var { Product, Purchase, User, Cart, OptionPurchase, sequelize, Option } = require("../data/MyDatabase");

var format = require('date-format');
const paginate = require('express-paginate');

router.get("/", paginate.middleware(1, 50), async(req, res) => {
    let rows = await Cart.findAll({
        include: [
            { model: User, required: true },
            { model: Product, required: true },
            { model: Option, required: true }
        ],
        where: {
            userId: req.session.user.id
        },
    })
    let sumprice = 0;
    for (row of rows) {
        sumprice += row.product.price * row.count;
    }
    res.render("cart/cart.ejs", { layout: "layout_second.ejs", rows, format, paginate, sumprice })
});

router.get("/:id/delete", async(req, res) => {
    await Cart.destroy({ where: { userId: req.session.user.id, productId: req.params.id } })
    res.redirect("/cart/");
});

router.post("/:id/purchase", (req, res) => {
    purchaseProduct(req, res)
});

router.post("/delete", (req, res) => {
    res.redirect("cart/cart.ejs");
});

router.get("/inputinfo", async(req, res) => {
    let rows = await Cart.findAll({
        include: [
            { model: User, required: true },
            { model: Product, required: true },
            { model: Option, required: false }
        ],
        where: {
            userId: req.session.user.id
        },
    })

    res.render("cart/inputinfo.ejs", { layout: "layout_second.ejs", rows, format, paginate });
});


router.post("/:id/update", async(req, res) => {
    try {
        let cart = await Cart.findOne({
            where: {
                userId: req.session.user.id,
                productId: req.params.id
            }
        })
        if (cart) {
            cart.count = req.body.count
            await cart.save()
        }
        res.redirect("/cart/");
    } catch (error) {
        res.redirect("/cart/");
    }
});

router.post("/purchase", async(req, res) => {
    let t = await sequelize.transaction();
    try {
        let purchase = await Purchase.create({
            userId: req.session.user.id,
            size: req.body.size,
            color: req.body.color,
            name: `${req.body.name1}:${req.body.name2}`,
            hurigana: `${req.body.kana1}:${req.body.kana2}`,
            zipcode: req.body.zipcode,
            address: req.body.pref,
            phone: `${req.body.tel1}:${req.body.tel2}:${req.body.tel3}`,
            mail: req.body.email,
            payment: req.body.payment
        }, { transaction: t });
        let carts = await Cart.findAll({
            include: [
                { model: Product, required: true }
            ],
            where: {
                userId: req.session.user.id
            },
        });
        for (c of carts) {
            await OptionPurchase.create({
                purchaseId: purchase.id,
                optionId: c.optionId,
                count: c.count
            }, { transaction: t });
            c.product.count -= c.count;
            await c.product.save({ transaction: t });
        }
        await Cart.destroy({ where: { userId: req.session.user.id }, transaction: t });
        await t.commit()
        res.redirect("/cart/confirm");
    } catch (error) {
        await t.rollback();
        console.log(error);
    }
});

router.get("/confirm", (req, res) => {
    res.render("cart/confirm.ejs", { layout: "layout_second.ejs" });
});

module.exports = router;