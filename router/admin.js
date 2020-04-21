const router = require("express").Router();
var multer = require('multer');
const path = require('path');
const multerStorage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, './uploads/product');
    },
    filename(req, file, cb) {
        const hex = getSecureRandom();
        const ext = path.extname(file.originalname);
        cb(null, hex + ext);
    }
});

const fileFilter = function (req, file, cb) {
    const allowExt = [".jpg", ".jpeg", ".png"]
    const ext = path.extname(file.originalname);
    //if (ext != '.jpg' && ext != '.jpeg' && ext != '.png') {
    if (allowExt.includes(ext)) {
        cb(null, true)
    } else {
        //エラーの時、req.body.fileはundefinedになる
        cb(null, false)
    }
}

var upload = multer({ storage: multerStorage, fileFilter }).single("photo");
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
    let error = {}
    res.render("admin/edit.ejs", { row, error }); //ejsで使う変数を｛｝の中に書く
}

async function updateProduct(req, res, id) { //formで送られてきた情報はreqに入る
    upload(req, res, async (err) => {
        let row = await Product.findOne({ where: { id: id } })
        row.name = req.body.name;
        row.info = req.body.info;
        row.size = req.body.size;
        row.color = req.body.color;
        row.price = req.body.price;
        row.image = req.file.filename;
        if (!row.name) {
            error.name = "名前を入力してください。"
        }
        if (!row.info) {
            error.info = "情報を入力してください。"
        }
        if (!row.size) {
            error.size = "サイズを入力してください。"
        }
        if (!row.color) {
            error.color = "カラーを入力してください。"
        }
        if (!row.price || isNaN(row.price)) { //isNaN=数字の時FALSEで数字以外がTRUE
            error.price = "価格を入力してください。"
        }
        if (req.file) {
            data.image = req.file.filename
        } else {
            error.image = "写真を設定してください。"
        }
        if (Object.keys(error).length) {
            error.message = "未入力の項目があります。"
            res.render("admin/edit.ejs", { row, error });
        } else {
            await row.save();
            res.redirect("/admin");
        }
    })
}

async function addProduct(req, res) { //formで送られてきた情報はreqに入る
    upload(req, res, async (err) => {
        let data = new Product()
        let error = {}
        data.name = req.body.name;
        data.info = req.body.info;
        data.size = req.body.size;
        data.color = req.body.color;
        data.price = req.body.price;
        data.image = req.body.image;
        if (!data.name) {
            error.name = "名前を入力してください。"
        }
        if (!data.info) {
            error.info = "情報を入力してください。"
        }
        if (!data.size) {
            error.size = "サイズを入力してください。"
        }
        if (!data.color) {
            error.color = "カラーを入力してください。"
        }
        if (!data.price || isNaN(data.price)) { //isNaN=数字の時FALSEで数字以外がTRUE
            error.price = "価格を入力してください。"
        }
        if (req.file) {
            data.image = req.file.filename
        } else if(!data.image){
            error.image = "写真を設定してください。"
        }
        if (Object.keys(error).length) {
            error.message = "未入力の項目があります。"
            res.render("admin/add.ejs", { data, error });
        } else {
            await data.save();
            res.redirect("/admin");
        }
    });
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
    res.render("admin/add.ejs", { data, error: {} }); //使用する変数を第２引数としてかく
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