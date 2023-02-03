const express = require('express');
const ap = express();
var http = require('http');
var fs = require('fs');
var serv = http.createServer(function(request,response){
    var url = request.url;
    if(request.url == '/'){
      url = '/index.pug';
    }
    if(request.url == '/public/image/error_page.png'){
      response.writeHead(404);
      response.end();
      return;
    }
    response.writeHead(200);
    response.end(fs.readFileSync(__dirname + url));
 
});
serv.listen(8080);
ap.use(express.static('public'));

