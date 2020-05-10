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

app.use(require("express-ejs-layouts"))
app.use(function(req, res, next) {
    if (req.session.user) {
        res.locals.user = req.session.user
    } else {
        res.locals.user = null
    }
    next()
})

const login = function(req, res, next) {
    if (!req.session.user && req.originalUrl != "/" && req.originalUrl != "/login") {
        res.redirect("/login")
        next("route")
    } else {
        next()
    }
}

app.use("/products", login, require("./router/products"));

app.use("/admin", login, require("./router/admin"));

app.use("/", require("./router/top_page"));

app.use("/touroku", require("./router/register"));

app.use("/user_history", login, require("./router/user"));

app.use("/login", require("./router/login"));

app.use("/cart", require("./router/cart"));
app.listen(80, () => console.log('Example app listening on port 80!'));