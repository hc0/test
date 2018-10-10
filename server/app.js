var express = require('express');
var formidable = require("formidable");
var path = require("path");
var app = express();
var gm = require("gm");
var fs = require("fs");
var mongoose = require("mongoose");
// 链接数据库 ershouche
mongoose.connect("localhost/cunchu");
// mongoose 的model文件
var Bucket = require("./models/Bucket.js");
const bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

app.use( function(req, res, next) {
    var origin = req.headers.origin;

    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

app.use(express.static("buckets"));
// 初始化获取所有的 存储对象
app.get("/getAllBucketInfo",function(req,res){
    Bucket.find().exec(function(err,docs){
        if(err){
            console.log(err);
            return;
        };
        res.json({
            "results":docs
        })
    })
})
// 创建 储存对象
app.post("/createbucket",function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req,function(err,fields,files){
        var MaxId = null;
        Bucket.find().exec(function(err,docs){
            MaxId = docs.reduce(function(a,b){
                return a > b.id ? a : b.id
            },0) + 1;

            Bucket.create({
                "id":MaxId,
                "description":fields.description,
                "modifier":fields.modifier,
                "title":fields.title
            },function(err,{id,description,modifier,title,files,pics}){
                if(err){
                    console.log(err);
                    return;
                }
                res.json({
                    "result":[
                        {
                            id,
                            description,
                            modifier,
                            title,
                            files,
                            pics
                        }
                    ]
                })
            })
        })

    })
})
var urlbase = path.resolve(__dirname,"./buckets");

// 递归创建目录 异步方法
function mkdirs(dirname, callback) {
    fs.exists(dirname, function (exists) {
        if (exists) {
            callback();
        } else {
            // console.log(path.dirname(dirname));
            mkdirs(path.dirname(dirname), function () {
                fs.mkdir(dirname, callback);
                console.log('在' + path.dirname(dirname) + '目录创建好' + dirname  +'目录');
            });
        }
    });
}
var bucketName = null;
var bucketId = null;
var pathName = null;
// 接收储存对象名称和要上传的路径
app.post("/sendSaveInfo",function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req,function(err,fields,files){
        bucketId = fields.choosebuckets.id;
        bucketName = fields.choosebuckets.title;
        pathName = fields.chooseurl;
        res.json({
            "result":1
        })
    })
})
// 上传的所有文件
var AllFile = [];
var realUrl = path.resolve(__dirname,"./buckets");
//文件遍历方法,需要遍历的文件路径
function fileDisplay(filePath){
    //根据文件路径读取文件，返回文件列表
    fs.readdir(filePath,function(err,files){
        if(err){
            console.warn(err)
        }else{
            //遍历读取到的文件列表
            files.forEach(function(filename){
                //获取当前文件的绝对路径
                var filedir = path.join(filePath,filename);
                //根据文件路径获取文件信息，返回一个fs.Stats对象
                fs.stat(filedir,function(eror,stats){
                    if(eror){
                        console.warn('获取文件stats失败');
                    }else{

                        var isFile = stats.isFile();//是文件
                        var isDir = stats.isDirectory();//是文件夹
                        if(isFile){
                            AllFile.push({"fileSize":stats.size,"fileUrl":filedir,"createTime":stats.ctimeMs})
                        }
                        if(isDir){
                            fileDisplay(filedir);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
                        }
                    }
                })
            });
        }
    });
};
// 上传的图片文件
app.post("/uploadcarimages",function(req,res){

        var form = new formidable.IncomingForm();
        // 递归创建文件夹
        mkdirs("buckets/"+pathName,() => {
            // 上传文件夹
            form.uploadDir = path.resolve(__dirname,"./buckets/"+pathName);
            //保留文件的拓展名
            form.keepExtensions = true;
            form.parse(req,function(err,fields,files){
                // 得到图片上传之后的文件名，因为上传后文件的名字改变了
                var base = path.parse(files.viewpics.path).base;
                var realpicext = path.parse(files.viewpics.path).ext;
                var realpicdir = path.parse(files.viewpics.path).dir;
                var realpicsize = files.viewpics.size;
                // // 我们现在得到图片的真实的宽度和高度和真实名字
                gm(path.resolve(__dirname,"./buckets/"+pathName+"/"+base)).size(function(err,size){
                    // 写入数组
                    fileDisplay(realUrl);
                    // 写入数据库
                    Bucket.update({"id":bucketId},{'$push':{pics:{base,size,realpicext,realpicdir,realpicsize}}}).exec(function(err,docs){
                        console.log("成功将图片信息写入数据库");
                    })
                    // 发出
                    res.json({
                        base,
                        size,
                        base
                    })
                });
        })
    })
});
// 图片裁切
app.post("/docut",function(req,res){
    var form = new formidable.IncomingForm();

     form.parse(req,function(err,{w,h,l,t,picurl},files){
        // 命令gm裁切 ，crop 表示裁切 write 表示写
        gm(path.resolve(__dirname,"./buckets/"+pathName+"/"+picurl))
        .crop(w,h,l,t)
        .resize(160,160)
        .write(path.resolve(__dirname,"./buckets/modified/"+picurl),function(){
             res.json({"result":1})
        })
     })
});
// 上传文件接口
app.post("/uploadcarfiles",function(req,res){
    var form = new formidable.IncomingForm();
    // 递归创建文件夹
    mkdirs("buckets/"+pathName,() => {
        // 上传文件夹
        form.uploadDir = path.resolve(__dirname,"./buckets/"+pathName);
        //保留文件的拓展名
        form.keepExtensions = true;
        form.parse(req,function(err,fields,files){
            var realfilebase = path.parse(files.carfiles.path).base;
            var realfileext = path.parse(files.carfiles.path).ext;
            var realfiledir = path.parse(files.carfiles.path).dir;
            var realfilesize = files.carfiles.size;
            // 写入数组
            fileDisplay(realUrl);
            // 写入数据库
            Bucket.update({"id":bucketId},{'$push':{files:{realfilebase,realfileext,realfiledir,realfilesize}}}).exec(function(err,docs){
                console.log("成功将文件信息写入数据库");
            })
            // 发出
            res.json({
                "result":1,
                "base":path.parse(files.carfiles.path).base,
                "ext":path.parse(files.carfiles.path).ext
            })
        })
    })
})
// 将所有的数据持久到数据库，并返回数据
app.get("/getALldata",function(req,res){
    // 读所有数据
    Bucket.find().exec(function (err,docs){

        if(err){
            console.log(err);
            return
        };
        res.json({
            results:docs
        })

    })
})

app.listen(3000,function(){
    console.log("服务器已经运行在3000端口上了");
});