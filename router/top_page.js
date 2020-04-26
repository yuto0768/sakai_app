const router = require("express").Router();

router.get("/", (req, res) => {
    res.render("top_page.ejs", { user: req.session.user }); //使用する変数を第２引数としてかく
});

module.exports = router;