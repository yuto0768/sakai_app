var http = require("http");
var express = require("express");
var app = express();

//app.get('/', (req, res) => res.send('Hello World!'))
app.use("/public", express.static("./public"));
app.set("view engine", "ejs")

app.get("/", (req, res) => {
  res.render("top_page.ejs");//使用する変数を第２引数としてかく
});

app.get("/touroku", (req, res) => {
  res.render("touroku_page.ejs");//使用する変数を第２引数としてかく
});


app.get("/login", (req, res) => {
  res.render("login_page.ejs");//使用する変数を第２引数としてかく
});

app.use(require("express-ejs-layouts"))

app.get("/products", (req, res) => {
  res.render("products_page.ejs", { layout: "layout_login.ejs" });//使用する変数を第２引数としてかく
});

app.get("/products/details", (req, res) => {
  res.render("details_page.ejs");//使用する変数を第２引数としてかく
});

app.get("/products/details/purchase", (req, res) => {
  res.render("purchase.ejs", { layout: "layout_login.ejs" });//使用する変数を第２引数としてかく
});



app.listen(80, () => console.log('Example app listening on port 80!'))

