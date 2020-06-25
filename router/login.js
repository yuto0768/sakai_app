const router = require("express").Router();
var { User } = require("../data/MyDatabase");
router.get("/", (req, res) => {
    //res.render("login_page.ejs"); //使用する変数を第２引数としてかく
    res.render("login/login_page.ejs", { layout: "footer_space.ejs", error: null });
});

router.get("/logout", (req, res) => {
    //res.render("login_page.ejs"); //使用する変数を第２引数としてかく
    req.session.destroy();
    res.redirect("/");
});

router.post("/login", async(req, res) => {
    let data = await User.findOne({ where: { mail: req.body.mail, password: req.body.password } })
    let error = {}
    if (!data) {
        error.message = "メールアドレス又はパスワードが間違っています。"
        res.render("login/login_page.ejs", { layout: "footer_space.ejs", error })
    } else {
        req.session.user = data;
        res.redirect("/");
    }
})
module.exports = router;