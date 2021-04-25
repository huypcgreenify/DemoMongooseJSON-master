var express = require('express');
var router = express.Router();
const path = require("path");
var dbConnect = 'mongodb+srv://admin:admin@cluster0.4zl2i.mongodb.net/tinder';
// getting-started.js
const mongoose = require('mongoose');
var path1 = 'assets/img/portfolio/';
mongoose.connect(dbConnect, {useNewUrlParser: true, useUnifiedTopology: true});
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path1);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
})

var upload = multer({
    dest: 'assets/img/portfolio/'
    , storage: storage,
    limits: {
        fileSize: 1 * 1024 * 1024, // gioi han file size <= 1M;

    },
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if (ext !== '.png') {
            callback(null, false);
            return callback(new Error("Chỉ chọn ảnh đuôi JPG"));
        } else {
            callback(null, true);
        }
    },
}).array('avatar', 3);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log('connected')
});

var forall = new mongoose.Schema({
    avatar: {type: [String]},
    maSach: String,
    tenSach: String,
    giaSach: String,
    loaiSach: String,
})
/* GET home page. */

router.get('/', function (req, res, next) {

    var userConnect = db.model('testnodes', forall);

    userConnect.find({}, function (error, testnodes) {
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
            res.send(testnodes)
        } else {

            res.render('index', {title: 'Quản lý danh sách', testnodes: testnodes});
        }
    }).sort({'maSach': 1});

});
//Tìm kiếm
router.post('/find', (req, res, error) => {
    console.log(req.body)
    var io = req.body.maCar;
    var userConnect = db.model('testnodes', forall);
    userConnect.find({maSach: {$regex: `${req.body.maSach}`}}).then(data => {
        // console.log(data.map(obj => obj.toJSON(obj)._id));
        res.render('find', {userConnect: data});
        console.log(data)
    })
})


//Thêm
router.post('/insertUser', function (req, res) {
    upload(req, res, function (error) {
            if (error instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                res.send("Ảnh phải dưới 1MB")
            } else if (error) {
                // An unknown error occurred when uploading.
                res.send("Chỉ chọn ảnh đuôi .png")
            } else {
                // var checkLength = req.file.originalname.split(".", 1);
                // var checkmaSach = req.body.maSach.toString();
                // var checkNhanHieu = req.body.tenSach().toString();
                // var checkGiaSach = req.body.giaSach().toString();
                // var checkGiaBan = req.body.loaiSach().toString();

                // if (checkmaSach == "") {
                //     res.send('Error: Bạn phải nhập mã sách');
                // } else if (checkNhanHieu == "") {
                //     res.send('Error: Bạn phải nhập tên sách');
                // } else if (checkGiaGoc == "") {
                //     res.send('Error: Bạn phải nhập giá sách');
                // } else if (checkGiaBan == "") {
                //     res.send('Error: Bạn phải nhập loại sách');
                // } else if (parseFloat(checkGiaGoc) > parseFloat(checkGiaBan)) {
                //     res.send('Error: Bạn phải nhập giá bán lớn hơn giá gốc')
                // } else {
                // if (isFloat() == checkGiaSach){
                var arr = [];
                if (req.files) {
                    for (let index = 0; index < req.files.length; index++) {
                        arr.push(path1 + req.files[index].originalname);
                    }
                }
                var userConnect = db.model('testnode', forall);
                userConnect({
                    avatar: arr,
                    maSach: req.body.maSach,
                    tenSach: req.body.tenSach,
                    giaSach: req.body.giaSach,
                    loaiSach: req.body.loaiSach,
                }).save(function (error) {
                    if (error) {
                        res.render('index', {title: 'Express : Error!!!!'});
                    } else {
                        // res.render('index', {title: 'Express : Success!!!!'});
                        res.redirect('/');
                        // res.send(req.file.filename
                    }
                })
                // }else {
                //     res.send("Bạn phải nhập dạng float");
                // }


                // }

            }

        }
    );


})
//Sửa
router.get('/:id', function (req, res) {
    var userConnect = db.model('testnode', forall);
    userConnect.findOneAndUpdate({_id: req.params.id}, res.body, {new: true}, (error, docs) => {
        if (error) {
            res.render('qlu', {title: 'Express : Error!!!!'});
        } else {
            res.render('edit', {userConnect: docs});
        }
    })
})

router.post('/edit/:id', function (req, res) {
    upload(req, res, function (error) {
            if (error instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                res.send("Ảnh phải dưới 1MB")
            } else if (error) {
                // An unknown error occurred when uploading.
                res.send("Chỉ chọn ảnh đuôi .jpg")
            } else {
                // var checkLength = req.file.originalname.split(".", 1);
                //
                //
                // if (checkLength.toString().length >= 20) {
                //     res.send('Error: Tên file phải nhỏ hơn 10');
                //
                // } else if (req.body.maCar.toString() == "") {
                //     res.send('Error: Bạn phải nhập mã ô tô');
                // } else {
                var userConnect = db.model('testnode', forall);
                userConnect.findByIdAndUpdate({_id: req.params.id},
                    {
                        avatar: path1 + req.file.originalname,
                        maSach: req.body.maSach,
                        tenSach: req.body.tenSach,
                        giaSach: req.body.giaSach,
                        loaiSach: req.body.loaiSach,
                    }).update(function (error) {
                    if (error) {
                        console.log("Sửa thất bại")
                    } else {
                        console.log("Sửa thành công")
                        // res.render('edit', {userConnect: docs});
                        res.redirect('/')
                    }
                })

                // }

            }

        }
    );


})
//Xóa
router.post('/:id', function (req, res) {
    var userConnect = db.model('testnode', forall);
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
