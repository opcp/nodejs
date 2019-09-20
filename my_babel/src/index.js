const express = require('express')
const url = require('url')
const body_parser = require('body-parser')
const app = express()

// const urlencodeparser=body_parser.urlencoded({extended:false});

app.use(body_parser.urlencoded({extended:false}))

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

app.use((require,response)=>{
    response.type('text/plain')
    response.status(404);
    response.send(`404 找不到頁面喔`)
})

app.listen(3000,()=>{
    console.log('3000 連結成功')
})