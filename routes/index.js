var express = require('express');
var router = express.Router();

var dbConnect = 'mongodb+srv://admin:admin@cluster0.4zl2i.mongodb.net/tinder';
// getting-started.js
const mongoose = require('mongoose');
mongoose.connect(dbConnect, {useNewUrlParser: true, useUnifiedTopology: true});

var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'assets/img/portfolio/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
})

var upload = multer({
    dest: 'assets/img/portfolio/'
    , storage: storage
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log('connected')
});

var user = new mongoose.Schema({
    avatar: String,
    username: String,
    password: String,
    name: String,
    address: String,
    number_phone: String,
})
/* GET home page. */

router.get('/', upload.single('avatar'), function (req, res, next) {

    var userConnect = db.model('users', user);

    userConnect.find({}, function (error, users) {
        var type = 'home';
        try {
            type = req.query.type;
        } catch (e) {
        }
        if (error) {
            res.render('index', {title: 'Express : ' + error});
            return
        }
        if (type == 'json') {
            res.send(users)
        } else {
            res.render('index', {title: 'Quản lý User', users: users});
        }
    });

});

//Thêm
router.post('/insertUser', upload.single('avatar'), function (req, res) {
    var userConnect = db.model('users', user);
    userConnect({
        avatar: req.file.originalname,
        username: req.body.username,
        password: req.body.password,
        name: req.body.name,
        address: req.body.address,
        number_phone: req.body.number_phone,

    }).save(function (error) {
        if (error) {
            res.render('index', {title: 'Express : Error!!!!'});
        } else {
            // res.render('index', {title: 'Express : Success!!!!'});
            res.redirect('/');
            // res.send(req.file.filename)

        }
    })
})
//Sửa
router.get('/edit/:id', function (req, res) {
    var userConnect = db.model('users', user);
    userConnect.findOneAndUpdate({_id: req.params.id}, res.body, {new: true}, (error, docs) => {
        if (error) {
            res.render('qlu', {title: 'Express : Error!!!!'});
        } else {
            res.render('edit', {userConnect: docs});

        }
    })
})

router.post('/edit/:id', upload.single('avatar'), function (req, res) {
    var userConnect = db.model('users', user);
    userConnect.findByIdAndUpdate({_id: req.params.id},
        {
            avatar: req.file.filename,
            username: req.body.username,
            password: req.body.password,
            name: req.body.name,
            address: req.body.address,
            number_phone: req.body.number_phone
        }).update(function (error) {
        if (error) {
            console.log("Sửa thất bại")
        } else {
            console.log("Sửa thành công")
            // res.render('edit', {userConnect: docs});
            res.redirect('/')
        }
    })
})
//Xóa
router.post('/:id', function (req, res) {
    var userConnect = db.model('users', user);
    var id = req.params.id;
    userConnect.remove({_id: id}, function (error) {
        if (error) {
            res.render('index', {title: 'Express : Error!!!!'});
        } else {
            console.log("Xóa thành công")
            res.redirect('/')

        }
    })

})

module.exports = router;
