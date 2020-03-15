const Sequelize = require('sequelize');
//://user_id:password@URL/DB
const sequelize = new Sequelize("postgres://sakai0768:p9y9TXCY@samurai-test.cl5rilsmm17j.ap-northeast-1.rds.amazonaws.com:5432/postgres")
const Op = Sequelize.Op;

const IdType = {
    Mail: 1,
    Facebook: 2,
    twitter: 3
}

function test() {
    sequelize.authenticate()
        .then(() => {
            console.log('Connection has been established successfully.');
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });
}
//User:class名　　　　　　　　　　//user:テーブル名
const User = sequelize.define('user', {
    //これは通し番号です
    id: {
        type: Sequelize.INTEGER, //型名
        autoIncrement: true,
        primaryKey: true,
    },
    // 以下、各列に対応します
    mail: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    password: {
        type: Sequelize.STRING(128),
        allowNull: true,
    },
    idType: {
        type: Sequelize.INTEGER(1),
        allowNull: false,
    },
    uid: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    address: {
        type: Sequelize.STRING,
        allowNull: true,
    },
}, {
    timestamps: true　 //行作成日時更新日時自動追加
});

async function setup() {　　 //force:trueでデータ全削除
    await sequelize.sync({ force: true }) //await:promiseの短縮(then実行で次へ)
        // テスト用のユーザーを1件登録
    let tanaka = await User.create({ name: "tanaka", idType: IdType.Mail, password: "pass" })
}

test()
setup()

module.exports = {
    User
}