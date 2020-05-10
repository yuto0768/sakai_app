const router = require("express").Router();
var { Product, Purchase, User } = require("../data/MyDatabase");

var format = require('date-format');
const paginate = require('express-paginate');

router.get("/", paginate.middleware(1, 50), async(req, res) => {
    let rows = await Purchase.findAll({
        include: [
            { model: User, required: true },
            { model: Product, required: true }
        ],
        where: {
            userId: req.session.user.id
        },
        limit: req.query.limit,
        offset: req.skip
    })
    res.render("user_history.ejs", { rows, format, paginate })
});

module.exports = router;