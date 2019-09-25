const express = require('express')
const router = express.Router()

router.route('/basic/edit/:id')
    .all((req,response,next)=>{
        response.locals.Data={
            name:'peter',
            id:req.params.id
        }
        next()
    })
    .get((req,response)=>{
        response.send('GET: ' + JSON.stringify(response.locals))
    })

    .post((req,response)=>{
        response.send('POST: ' + JSON.stringify(response.locals))
    })
    module.exports=router


// router.get('/admin3/:v1?/:v2?',(req,response)=>{
//     const result = {
//         params:req.params,
//         url:req.url,
//         baseUrl:req.baseUrl
//     };
//     response.json(result)
// })
