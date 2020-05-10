const router = require("express").Router();
var { Product, Purchase, User } = require("../data/MyDatabase");
var DateFormat = require('date-format-simple');

var format = require('date-format');

router.get("/", async(req, res) => {
    let rows = await Purchase.findAll({
        include: [
            { model: User, required: true },
            { model: Product, required: true }
        ],
        where: {
            userId: req.session.user.id
        }
    })
    res.render("user_history.ejs", { rows, format })
});

module.exports = router;