const express = require('express')
const router = express.Router()
router.get('/admin2/:c1?/:c2?',(req,response)=>{
    response.json(req.params)
})
module.exports=router