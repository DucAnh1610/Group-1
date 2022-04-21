const express = require('express')
const async = require('hbs/lib/async')
const router = express.Router()
const { insertObject, getUser, USERTABLE } = require('../databaseHandler')

///////////Login
router.get('/login', (req, res) => {
    res.render('login', {layout: 'layout_signin'})
})
router.post('/login', async (req, res) => {
    const username = req.body.txtName;
    const password = req.body.txtPassword;

    const user = await getUser(username, password);
    if (user == -1) {
        res.end('login invalid!');
    } else {
        req.session["User"] = {
            userpass: password,
            username: username,
            role: customer
        }
        res.redirect('/')
    }
})
/////////

/////////////Register
router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/register', async (req, res) => {
    const name = req.body.txtName;
    const password = req.body.txtPassword;
    const role = req.body.role;

    const objectToInsert = {
        username: name,
        password: password,
        role: role
    }

    insertObject(USERTABLE, objectToInsert)
    res.redirect('/authen/login')
});
////////////////////
module.exports = router;