const Sequelize = require('sequelize');
const sequelize = new Sequelize("postgres://postgres:samurai-db@database-1.c7jrdb3lf368.ap-northeast-1.rds.amazonaws.com:5432/postgres")
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

const User = sequelize.define('user', {
    //これは通し番号です
    id: {
        type: Sequelize.INTEGER,
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
    timestamps: true
});

async function setup() {
    await sequelize.sync({ force: true })
        // テスト用のユーザーを1件登録
    let tanaka = await User.create({ name: "tanaka", idType: IdType.Mail, password: "pass" })
}

test()
setup()

module.exports = {
    User
}