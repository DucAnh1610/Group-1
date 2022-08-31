const express = require('express')
const expressHbs = require('express-handlebars')
const session = require('express-session')
const path = require('path')
const app = express()


app.engine('hbs', expressHbs.engine({
    extname: '.hbs'
}))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname + '/resources/views'));


app.use(express.static(path.join(__dirname + '/resources/public')));

app.use(express.urlencoded({
    extended: true
}))


app.use(session({
    secret: 'nhom 1 0902',
    cookie: {maxAge: 60 * 60 * 24 * 1000},
    saveUninitialized: false,
    resave: false
}))

////////////admin
const adminController = require('./controllers/adminController')
//tat ca dia chi chua /admin  => goi controller admin
app.use('/admin', adminController, express.static(path.join(__dirname, '/resources/public')));
///////////////////

const userController = require('./controllers/userController')
app.use('/user', userController, express.static(path.join(__dirname, '/resources/public')));


////////////Authentication
const authenController = require('./controllers/authenController')
//tat ca dia chi chua /authen  => goi controller authen
app.use('/authen', authenController, express.static(path.join(__dirname, '/resources/public')));
///////////////////

////////////Product
const productController = require('./controllers/productController')
//tat ca dia chi chua /product  => goi controller productController
app.use('/product', productController, express.static(path.join(__dirname, '/resources/public')));
///////////////////

////////////Category
const categoryController = require('./controllers/categoryController')
//tat ca dia chi chua /category  => goi controller categoryController
app.use('/category', categoryController, express.static(path.join(__dirname, '/resources/public')));
///////////////////

////////////OrderDetail
const orderDetailController = require('./controllers/orderDetailController')
//tat ca dia chi chua /ỏrderDetail  => goi controller orderDetailController
app.use('/orderDetail', orderDetailController, express.static(path.join(__dirname, '/resources/public')));
///////////////////

////////////Order
const orderController = require('./controllers/orderController')
app.use('/order', orderController, express.static(path.join(__dirname, '/resources/public')));
///////////////////

////////////Feedback
const feedbackController = require('./controllers/feedbackController')
const { getUser, getProductById, updateObject, updateDocument } = require('./databaseHandler')
app.use('/feedback', feedbackController, express.static(path.join(__dirname, '/resources/public')));
///////////////////


app.get('/', (req, res) => {
    let user = req.session.User;
    res.redirect('/product/shop');
    //res.render('index', {user:user})
})

app.get('/error', (req, res) => {
    let message = req.session.message;
    let err = req.session.error;
    let user = req.session.User;
    console.log("erro:", err);
    res.render('erroPage', {message:message, error:err,User:user})
})

app.get('/test', (req, res) => {
    const appUser = req.session.User;

    let id = appUser.userId;
    let name = appUser.username;
    let role = appUser.role

    let user = {
        id: id,
        username: name,
        role: role
    }
    res.render('test', {user: user})
})

const PORT = process.env.PORT || 3000;
app.listen(PORT)
// console.log('Server is running at ' + PORT)
