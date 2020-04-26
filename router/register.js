const router = require("express").Router();

var { User } = require("../data/MyDatabase");

async function addmember(req, res) { //formで送られてきた情報はreqに入る
    let data = new User()
    let error = {}
    data.name = req.body.name;
    data.mail = req.body.mail;
    data.password = req.body.password;
    if (!data.name) {
        error.name = "名前を入力してください。"
    }
    if (!data.mail) {
        error.mail = "メールアドレスを入力してください。"
    }
    if (!data.password) {
        error.password = "パスワードを入力してください。"
    }
    if (Object.keys(error).length) {
        error.message = "未入力の項目があります。"
        res.render("touroku_page.ejs", { data, error });
    } else {
        await data.save();
        req.session.user = data;
        res.redirect("/");
    }
}

router.get("/touroku", (req, res) => {
    let data = new User()
    res.render("touroku_page.ejs", { data, error: {} }); //使用する変数を第２引数としてかく
});

router.post("/touroku", (req, res) => {
    addmember(req, res)
});

module.exports = router;