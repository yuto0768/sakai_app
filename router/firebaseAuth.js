const router = require("express").Router()
const util = require("../util/util")

//Firebase Authenticationで使用する
const admin = require('firebase-admin');
const serviceAccount = require("../data/prikey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://samurai-auth.firebaseio.com"
});

//ログインページの表示
router.get("/", util.redirectRouterTop, (req, res) => {
  res.render("auth/login.ejs")
})

//Ajaxでログインを実行する
router.post("/auth", (req, res) => {
  let token = req.body.token
  admin.auth().verifyIdToken(token)
    .then(function (decodedToken) {
      let uid = decodedToken.uid;
      console.log(`login with ${uid}:${decodedToken.firebase.sign_in_provider}`)
      //ここでDB上のユーザーと、Firebaseから取得したIDを紐付ける
      res.status(200).json({ status: "success" }).end()
    }).catch(function (error) {
      res.status(403).json({ status: "failed" }).end()
    });
})

module.exports = router