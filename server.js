var http = require("http");
var express = require("express");
var app = express();
var db = require("./data/MyDatabase")
var { User } = db


//app.get('/', (req, res) => res.send('Hello World!'))
app.use("/public", express.static("./public"));
app.set("view engine", "ejs")
    //フォーム機能を使用するために必要
app.use(express.json())
app.use(express.urlencoded({ extended: true }))



app.get("/touroku", (req, res) => {
    res.render("touroku_page.ejs"); //使用する変数を第２引数としてかく
});

async function showUser(req, res, id) { //*await必須　await使用時はasync必須
    let user = await User.findOne({ id: id }); //serectをして一致したものを変数に格納
    console.log(user.name);
    res.render("login_page.ejs"); //使用する変数を第２引数としてかく
}


app.get("/login", (req, res) => {
    //res.render("login_page.ejs"); //使用する変数を第２引数としてかく
    showUser(req, res, 1);
});

app.use(require("express-ejs-layouts"))

app.use("/products", require("./router/products"));

app.use("/admin", require("./router/admin"));

app.use("/", require("./router/top_page"));


app.listen(80, () => console.log('Example app listening on port 80!'))