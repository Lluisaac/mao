var HTTP = require("http");

function treatClient(request, response)
{
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write("<html><head><title>MAO Online</title></head><body><h1>Comming Soon</h1></body></html>");
	response.end();
}

var server = HTTP.createServer();
server.on("request", treatClient);
server.listen(8080);
