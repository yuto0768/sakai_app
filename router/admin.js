const router = require("express").Router();
var multer = require('multer');
const path = require('path');
const multerStorage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, './uploads/product');
    },
    filename(req, file, cb) {
        const hex = getSecureRandom();
        const extname = path.extname(file.originalname);
        cb(null, hex + extname);
    }
});
var upload = multer({ storage: multerStorage });
var { Product } = require("../data/MyDatabase");

const Crypto = require("crypto");

function getSecureRandom() {
    const buff = Crypto.randomBytes(8); // バイナリで8byteのランダムな値を生成
    const hex = buff.toString("hex"); // 16進数の文字列に変換

    return hex; // integerに変換して返却
}

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

async function addProduct(req, res, id) { //formで送られてきた情報はreqに入る
    let row = await Product.create()
        // let row = new Product()
    row.name = req.body.name;
    row.info = req.body.info;
    row.size = req.body.size;
    row.color = req.body.color;
    row.price = req.body.price;
    await row.save();
    res.redirect("/admin");
}

async function deleteProduct(req, res, id) {
    await Product.destroy({ where: { id: id } })
    res.redirect("/admin");
}

router.get("/", (req, res) => {
    getProducts(req, res)
});

router.get("/add", (req, res) => {
    res.render("admin/add.ejs"); //使用する変数を第２引数としてかく
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

router.post("/add", upload.single('avatar'), (req, res) => {
    addProduct(req, res)
});


module.exports = router;