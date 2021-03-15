const ports = require("./port.js");;
const fs = require("fs");
const Express = require('express');
const app = Express();

app.use(Express.static('public'));

app.get("/", (req, res) => {
	fs.readFile("index.html", (error, data) => {
		res.writeHead(200, {"Content-Type": "text/html"})
		res.write(data);
		res.end();
	});
})

app.get('/favicon.ico', (req, res) => {
	fs.readFile("favicon.ico", (error, data) => {
		res.writeHead(200, {'Content-Type': 'image/x-icon'})
		res.write(data);
		res.end();
	});
})

exports.launch = function() {
	return app.listen(ports.http, () => {
		
	})
}