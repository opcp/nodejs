module.exports= app =>{
    app.get('/admin1/:p1?/:p2?',(req,response)=>{
        response.json(req.params)
    })
}