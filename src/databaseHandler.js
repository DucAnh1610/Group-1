const async = require('hbs/lib/async');
const {MongoClient,ObjectId} = require('mongodb');

const URL = "mongodb+srv://ducanh1610:543694@cluster0.9rpbx.mongodb.net/test";
const DATABASE_NAME = "GCH0902-ApplicationDev"

async function getDB(){
        const client = await MongoClient.connect(URL);
        const dbo = client.db(DATABASE_NAME);
        return dbo;
}

async function insertObject(collectionName,objectToInsert){
    const dbo = await getDB();
    const newObject = await dbo.collection(collectionName).insertOne(objectToInsert);
    console.log("Gia tri id moi duoc insert la: ", newObject.insertedId.toHexString());
}

async function search(condition, collectionName) {
    const dbo = await getDB();
    //const searchCondition = new RegExp(condition, 'i')
    var results = await dbo.collection(collectionName).
    find(condition).toArray();
    return results;
}

async function getProduct(collectionName){
    let client = await MongoClient.connect(URL)
    let dbo = client.db(DATABASE_NAME)
    return await dbo.collection(collectionName).find({}).toArray()
}

async function searchOne(condition, collectionName) {
    const dbo = await getDB();
    //const searchCondition = new RegExp(condition, 'i')
    var results = await dbo.collection(collectionName).
    findOne(condition);
    return results;
}

async function getUser(username, password){
    const dbo = await getDB();
    const user = await dbo.collection(USERTABLE).findOne({username:username, password:password});
    if(user == null){
        return -1;
    }else{
        console.log(user);
        return user;
    }
}

async function deleteObjectById(collectionName,id){
    let client = await MongoClient.connect(URL)
    let dbo = client.db(DATABASE_NAME)
    await dbo.collection(collectionName).deleteOne({_id:ObjectId(id)});
    console.log("deleted id: ", id)
}

async function updateObject(condition, collectionName, item){
    let client = await MongoClient.connect(URL)
    let dbo = client.db(DATABASE_NAME)
    await dbo.collection(collectionName).updateOne(condition, item);
}

async function deleteProductById(collectionName,id){
    let client = await MongoClient.connect(URL)
    let dbo = client.db(DATABASE_NAME)
    await dbo.collection(collectionName).deleteOne({_id:ObjectId(id)})
}

async function getProductById(collectionName,id){
    let client = await MongoClient.connect(URL)
    let dbo = client.db(DATABASE_NAME)
    return await dbo.collection(collectionName).findOne({_id:ObjectId(id)})
}

async function checkUserRole(username, password){
    const dbo = await getDB();
    const user = await dbo.collection(USERTABLE).findOne({username:username, password:password});
    if(user == null){
        return -1;
    }else{
        console.log(user);
        return user;
    }
}

const USERTABLE = 'Users';
const CATEGORY_TABLE = 'Category';
const PRODUCT_TABLE = 'Product';
const ORDER_TABLE = 'Order';
const ORDERDETAIL_TABLE = 'OrderDetail';



module.exports = {insertObject, checkUserRole, getUser, search , getProduct , deleteProductById, deleteObjectById, updateObject,
     getProductById, searchOne, USERTABLE, CATEGORY_TABLE, PRODUCT_TABLE, ORDER_TABLE, ORDERDETAIL_TABLE};

