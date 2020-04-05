const router = require("express").Router();
var { Product } = require("../data/MyDatabase");

async function getProducts(req, res) {
    let rows = await Product.findAll()
    res.render("admin/list.ejs", { rows });
}

async function getProduct(req, res, id) {
    let row = await Product.findOne({ where: { id: id } })
    res.render("admin/edit.ejs", { row }); //ejsで使う変数を｛｝の中に書く
}

async function updateProduct(req, res, id) { //formで送られてきた情報はreqに入る
    let row = await Product.findOne({ where: { id: id } })
        // let row = new Product()
    row.name = req.body.name;
    row.info = req.body.info;
    row.size = req.body.size;
    row.color = req.body.color;
    row.price = req.body.price;
    await row.save();
    res.redirect("/admin");
}

async function addProduct(req, res) { //formで送られてきた情報はreqに入る
    let data = new Product()
        // let row = new Product()
    data.name = req.body.name;
    data.info = req.body.info;
    data.size = req.body.size;
    data.color = req.body.color;
    data.price = req.body.price;
    await data.save();
    res.redirect("/admin");
}

async function deleteProduct(req, res, id) {
    await Product.destroy({ where: { id: id } })
    res.redirect("/admin");
}

router.get("/", (req, res) => {
    if (!req.originalUrl.endsWith("/")) { //URLの最後が/で終わっていないとき４５行目へ
        res.redirect("/admin/")
        return
    }
    getProducts(req, res)
});

router.get("/add", (req, res) => {
    let data = new Product()
    res.render("admin/add.ejs", { data }); //使用する変数を第２引数としてかく
});

router.get("/:id", (req, res) => {
    getProduct(req, res, req.params.id)
});

router.post("/:id/delete", (req, res) => {
    deleteProduct(req, res, req.params.id)
});

router.post("/:id/update", (req, res) => {
    updateProduct(req, res, req.params.id)
});

router.post("/add", (req, res) => {
    addProduct(req, res)
});


module.exports = router;