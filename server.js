var http = require("http");
var express = require("express");
var app = express();
var db = require("./data/MyDatabase");
var { User } = db;
var session = require('express-session')

app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

//app.get('/', (req, res) => res.send('Hello World!'))
app.use("/public", express.static("./public"));
app.use("/photo/product", express.static("./uploads/product")); //一つ目の引数URLで2つめがファイルのありか
app.set("view engine", "ejs")
    //フォーム機能を使用するために必要
app.use(express.json())
app.use(express.urlencoded({ extended: true }));



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

app.use("/touroku", require("./router/register"));


app.listen(80, () => console.log('Example app listening on port 80!'));