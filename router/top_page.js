const router = require("express").Router();
const db = require("../data/MyDatabase")
const { User } = require("../data/MyDatabase")


async function getProducts(req, res) {
    let rows = await Product.findAll()
    res.render("top_page.ejs", { layout: "layout_login.ejs", rows });
}