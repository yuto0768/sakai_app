const router = require("express").Router();
var { Product, Purchase, User } = require("../data/MyDatabase");

router.get("/user_history", async(req, res) => {
    let rows = await Purchase.findAll({
        include: [
            { model: User, required: true },
            { model: Product, required: true }
        ]
    })
    res.render("/user_history.ejs", { rows })
});

module.exports = router;