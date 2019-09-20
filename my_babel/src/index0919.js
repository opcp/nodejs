const http = require('http')
const fs = require('fs')
const server = http.createServer((request,response)=>{
    fs.writeFile(__dirname+'/header01.json', 
    JSON.stringify(request.headers),
    error=>{
        console.log('save')
    });

    response.writeHead(200,{
        'content-type':'text/html'
    });
    response.end(`<h1> hello sam ${request.url} </h1>`);
})

server.listen(3000);