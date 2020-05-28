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
        allowNull: true,
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

const Product = sequelize.define('products', {
    //これは通し番号です
    id: {
        type: Sequelize.INTEGER, //型名
        autoIncrement: true,
        primaryKey: true,
    },
    // 以下、各列に対応します
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    color: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    size: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    info: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    image: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    price: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: true　 //行作成日時更新日時自動追加
});

const Purchase = sequelize.define('purchase', {
    //これは通し番号です
    id: {
        type: Sequelize.INTEGER, //型名
        autoIncrement: true,
        primaryKey: true,
    },
    // 以下、各列に対応します
    name: {
        type: Sequelize.STRING,
        allowNull: true,
    },

    hurigana: {
        type: Sequelize.STRING,
        allowNull: true,
    },

    zipcode: {
        type: Sequelize.STRING,
        allowNull: true,
    },

    address: {
        type: Sequelize.STRING,
        allowNull: true,
    },

    phone: {
        type: Sequelize.STRING,
        allowNull: true,
    },

    mail: {
        type: Sequelize.STRING,
        allowNull: true,
    },

    payment: {
        type: Sequelize.STRING,
        allowNull: true,
    },
}, {
    timestamps: true　 //行作成日時更新日時自動追加
});

const Cart = sequelize.define('cart', {
    count: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
    }

}, {
    timestamps: false
});

const PurchaseProduct = sequelize.define('purchaseproduct', {
    count: {
        type: Sequelize.STRING,
        defaultValue: 1,
    }

}, {
    timestamps: false
});

//PurchaseとProductを1:n(purchase:product)で関連付ける
//これにより、productテーブルにUserId列が追加されます
//PurchaseはUserに所属する（Userは複数のPurchaseを保持できる）という意味です
Purchase.belongsTo(User);
//Userは複数のPurchaseを保持するという意味です。上記とセットになります
User.hasMany(Purchase);

//PurchaseとProductをn:1(purchase:product)で関連付けます
//これにより、PurchaseテーブルにproductId列が追加されます
//1件の購入履歴に複数の製品を関連付ける場合は、n:nの関連付けにします。
//n:n関連付けについては、1:1関連付けでの購入履歴ができてから、説明します。
Purchase.belongsToMany(Product, { through: PurchaseProduct });
Cart.belongsTo(User);
Cart.belongsTo(Product);

User.belongsToMany(Product, { through: Cart, as: "carts" })
Product.belongsToMany(User, { through: Cart })

async function setup() {　　 //force:trueでデータ全削除
    await sequelize.sync({ force: true }) //await:promiseの短縮(then実行で次へ)
        // テスト用のユーザーを1件登録
    let tanaka = await User.create({ name: "tanaka", idType: IdType.Mail, mail: "abc@gmail.com", password: "pass" })
    let converse = await Product.create({ name: "Converse", color: "RED,WHITE,BLACK", size: "24.5cm,25.0cm,25.5cm,26.0cm,26.5cm,27.0cm", info: "aabcde", image: "32060180.jpg", price: "8800" })
    let converse1 = await Product.create({ name: "Converse1", color: "WHITE", size: "25.0cm", info: "aabcde", image: "32060180.jpg", price: "8800" })
    await Product.create({ name: "Converse2", color: "BLACK", size: "25.5cm", info: "aabcde", image: "32060180.jpg", price: "8800" })
    await Product.create({ name: "Converse3", color: "BLACK", size: "26.0cm", info: "aabcde", image: "32060180.jpg", price: "8800" })
    await Product.create({ name: "Converse4", color: "BLACK", size: "26.5cm", info: "aabcde", image: "32060180.jpg", price: "8800" })
    await Product.create({ name: "Converse5", color: "BLACK", size: "27.0cm", info: "aabcde", image: "32060180.jpg", price: "8800" })



    await tanaka.addCart(converse)
    await tanaka.addCart(converse1, { through: { count: 10 } })
    let cart = await tanaka.getCarts()
        //sample display cart lis
    cart.forEach(c => console.log(`cart:${c.name}, count:${c.cart.count}`))


    //関連付けのサンプルコード
    //田中さんがConverseを買ったというデータになります
    await Purchase.create({ userId: tanaka.id, productId: converse.id })

    //PurchaseとProduct、Userをjoinして、結果を表示します。
    let purchases = await Purchase.findAll({
        include: [
            { model: User, required: true },
            { model: Product, required: true }
        ],
        where: { userId: tanaka.id }
    })
    console.log(`田中さんの購入履歴は${purchases.length}件あります`)
    for (p of purchases) {
        console.log(`購入者:${p.user.name} 品名:${p.product.name}`)
    }
}

test();
setup();

module.exports = {
    User,
    Product,
    Purchase,
    Cart,
    PurchaseProduct,
    sequelize
}