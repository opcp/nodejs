const express = require('express')
const url = require('url')
const body_parser = require('body-parser')
const app = express()
const multer =require('multer')
const upload = multer({dest:'tmp_upload/'})
const fs = require('fs');
const session = require('express-session')
const moment = require('moment-timezone')
const mysql = require('mysql')
const bluebird = require('bluebird')
const cors =require('cors')
const db = mysql.createConnection({
    host:'localhost',
    user:'opcp',
    password:'opcp2428',
    database:'mytest'
})
db.connect();
bluebird.promisifyAll(db)
// const urlencodeparser=body_parser.urlencoded({extended:false});

app.use(body_parser.urlencoded({extended:false}))
app.use(body_parser.json())
app.use(cors())

app.use(session({
    saveUninitialized:false,
    resave:false,
    secret:'dsagdfasf',
    cookie:{
        maxAge:1200000,
    }
}))

app.set('view engine','ejs')

app.use(express.static('public'))

app.get('/',(req,response)=>{
    response.render('home',{name:"shan"})
})

app.get('/member',(req,response)=>{
    const member = require('./../data/member');
    response.render('member',{
        member:member
    })
})

app.get('/try_qs',(req,response)=>{
        const urlparts = url.parse(req.url,true)
        console.log(urlparts)
        response.render('try_qs',{
            query: urlparts.query
        })
})

app.get('/try_post_form',(req,response)=>{
    response.render('try_post_form')
})

app.post('/try_post_form',(req,response)=>{
    response.render('try_post_form',req.body)
    // response.send(JSON.stringify(req.body))
})

app.get('/try_post_form2', (req, response)=>{
    response.send('get: try-post-form2');
});
app.post('/try_post_form2', (req, response)=>{
    response.json(req.body);

    //res.send(JSON.stringify(req.body));
});
app.put('/try_post_form2', (req, response)=>{
    response.send("PUT: try-post-form2");
});

app.post('/try_upload',upload.single('avatar'),(req, response)=>{
    if(req.file.originalname && req.file){
        console.log(req.file)

        switch(req.file.mimetype){
            case 'image/png' :
            case 'image/jpeg' :
                fs.createReadStream(req.file.path)
                    .pipe(
                        fs.createWriteStream('public/img' + req.file.originalname)
                    );
                    response.send('ok')
                    break;
            default:
               return response.send('not filetype')
        }
    }
    else{
        response.send('上傳失敗')
    }
})

app.get('/my_params1/:action?/:id', (req, response)=>{
    response.json(req.params);
});

app.get('/my_params2/*?/*', (req, response)=>{
    response.json(req.params);
});

app.get(/^\/09\d{2}\d{3}\d{3}$/,(req, response)=>{
    let str = req.url.slice(1,11);
    str = str.split('-').join('');
    response.send(`手機: ${str}`)
});

const admin1 = require(__dirname + '/admin/admin1')
admin1(app)

app.use(require(__dirname + '/admin/admin2'));
app.use('/admin3',require(__dirname + '/admin/admin3'))

app.use('/try_session',(req,response)=>{
    req.session.my_views = req.session.my_views || 0
    req.session.my_views++
    
    response.json({
        name:'peter',
        'times':req.session.my_views
    })
})

app.use('/try_moment',(req,response)=>{
    const fm = 'YYYY-MM-DD HH:mm:ss'
    const mo1 = moment(req.session.cookie.expires)
    const mo2 = moment(new Date())

    response.contentType('text/plain');
    response.write(req.session.cookie.expires + "\n")
    response.write('台北'+mo1.format(fm)+"\n")
    response.write('倫敦'+mo1.tz('Europe/London').format(fm) + "\n")
    response.write(mo2.format(fm)+"\n")
    response.end(JSON.stringify(req.session))
})

app.get('/try_mysql',(req,response)=>{
    const sql = "SELECT * FROM `test` WHERE `name` LIKE ? "
    db.query(sql,["%shan%"],(error,results,fields)=>{
        response.render('try_db',{
            rows:results
        })
    })
})

app.get('/try_promise/:page?',(req,response)=>{
    let page = req.params.page || 1
    let perPage = 10
    let output = {}

    db.queryAsync("SELECT COUNT(1) total FROM `test`")
    .then(results=>{
        output.total = results[0].total
        return db.queryAsync(`SELECT * FROM test LIMIT ${(page-1)*perPage},${perPage}`)
    })
    .then(results=>{
        output.rows = results
        response.json(output)
    })
    .catch(error=>{
        console.log(error)
        response.send(error)
    })
})

app.get('/try_session',(req,response)=>{
    req.session.my_views = req.session.my_views || 0;
    req.session.my_views++

    response.json({
        aa:'hello',
        'my_views':req.session.my_views
    })
})

app.use((req,response)=>{
    response.type('text/plain')
    response.status(404);
    response.send(`404 找不到頁面喔`)
})

app.listen(3000,()=>{
    console.log('3000 連結成功')
})