const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const bluebird = require('bluebird')
const db = mysql.createConnection({
    host: 'localhost',
    user: 'opcp',
    password: 'opcp2428',
    database: 'mytest'
})
bluebird.promisifyAll(db)

console.log(express.shan)

const perPage = 10
router.get('/:page?/:keyword?', (req, response) => {
    const output = {}
    output.params = req.params
    output.perPage = perPage
    let page = parseInt(req.params.page) || 1
    let keyword = req.params.keyword || ''
    let where = " WHERE 1"
    if(keyword){
        keyword = keyword.split("'").join("\\'")
        where += " AND `name` LIKE '%" + keyword + "%' " 
        output.keyword = keyword
    }
    // let sql = "SELECT * FROM `test` LIMIT " + (page - 1) * perPage + "," + perPage
    // db.query(sql, (error, results) => {
    //     output.rows = results
    //     response.json(output)
    // })

    let t_sql= "SELECT COUNT(1) 'total' FROM `test`" + where
    db.queryAsync(t_sql)
    .then(results=>{
        console.log(t_sql)
        output.totalRows = results[0]['total']
        output.totalPage = Math.ceil(output.totalRows/perPage)
        if(output.totalPage ==0){
            return;
        }
        if(page<1) page = 1
        if(page>output.totalPage) page = output.totalPage
        output.page = page;
        return db.queryAsync("SELECT * FROM `test` " + where + " LIMIT " + (page - 1) * perPage + "," + perPage)
    })
    .then(results=>{
        output.rows=results
        response.json(output)
    })
    .catch(error=>{
        console.log(error)
    })

})

module.exports = router;