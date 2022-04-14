const express = require('express');
const { insertObject, checkUserRole, search, searchOne, deleteObjectById, updateObject, remove, getCurrentUserSession,
    ORDER_TABLE, ORDERDETAIL_TABLE, PRODUCT_TABLE} = require('../databaseHandler')
const {ObjectID} = require("mongodb");

const router = express.Router()

router.get('/cart', async (req, res) => {
    const curUser = getCurrentUserSession(req,res);
    if (!curUser){
        res.render('test', {message: 'please login first!'});
        return;
    }

    let ObjectID = require('mongodb').ObjectID;
    const condition = { "userId": curUser.userId };
    const orderDetailList = await search(condition, ORDERDETAIL_TABLE);
    let subTotal = 0;
    for (let i = 0; i < orderDetailList.length; i++) {
        subTotal += orderDetailList[i].total;
    }

    let dict = {}
    for (let i = 0; i < orderDetailList.length; i++) {
            let key = orderDetailList[i].product.name;
            let value = {
                quantity: orderDetailList[i].quantity,
                total: orderDetailList[i].total
            }
            console.log(key)
            dict[key] = value;
        }
        req.session["cart"] = dict;
        console.log("cartSes", req.session.cart)

    res.render('order/cart', { orderList: orderDetailList, subTotal: subTotal });
})

router.get('/delete', async (req, res) => {
    const id = req.query.id;
    await deleteObjectById(ORDERDETAIL_TABLE, id);
    res.redirect("/orderDetail/cart")
})

router.get('/edit', async (req, res) => {
    const id = req.query.id;
    let action = req.query.action;

    let ObjectID = require('mongodb').ObjectID;
    const condition = { "_id": ObjectID(id) };
    let item = await searchOne(condition, ORDERDETAIL_TABLE);
    let qt = 0;
    if (action == 'plus') {
        qt = parseInt(item.quantity) + 1;
    } else {
        qt = parseInt(item.quantity) - 1;
    }

    let total = qt * parseInt(item.product.price)
    let newData = {
        $set: { quantity: qt, total: total }
    };

    await updateObject(condition, ORDERDETAIL_TABLE, newData);
    res.redirect('/orderDetail/cart')
})

router.get('/addToCart', async (req, res) => {
    const ObjectID = require('mongodb').ObjectID;
    const curUser = getCurrentUserSession(req,res);

    console.log('add to cart: user:', curUser)

    const id = req.query.id;
    let inputQuantity = req.query.qt;

    const condition = { "_id": ObjectID(id) };
    let product = await searchOne(condition, PRODUCT_TABLE);
    let productId = product._id;

    const itemCondition = { "product": Object(product) };
    let item = await searchOne(itemCondition, ORDERDETAIL_TABLE);

    let qt;
    let total = parseInt(product.price) * parseInt(inputQuantity);
    if (item != null) {
        qt = parseInt(item.quantity) + parseInt(inputQuantity);
        total = product.price * qt;
        let editData = {
            $set: { quantity: qt, total: total }
        };
        await updateObject({ "_id": ObjectID(item._id) }, ORDERDETAIL_TABLE, editData);
        res.redirect('/orderDetail/cart')
    } else {
        let object = {
            userId: curUser.userId,
            productId: productId,
            product: product,
            quantity: inputQuantity,
            total: total
        }

        await insertObject(ORDERDETAIL_TABLE, object);
        res.redirect('/orderDetail/cart')
    }
})

router.get('/remove', async (req, res) => {
    await remove(ORDERDETAIL_TABLE);
    res.redirect("/orderDetail/cart")
})

module.exports = router;