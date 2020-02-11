var http = require("http");
var express = require("express");
var app = express();
//app.get('/', (req, res) => res.send('Hello World!'))
app.use("/public", express.static("./public"));
app.get("/", (req, res)=>{
    res.render("index.ejs");//使用する変数を第２引数としてかく
  });
app.listen(80, () => console.log('Example app listening on port 80!'))