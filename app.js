
const http = require('http');
const fs = require('fs');
var html;
fs.readFile('./index.html', (err, file) => {
	if (err){
		throw err;
	}
	html = file;
});

		
http.createServer(function(req, res){
	if (req.url.includes('/deez')){
		console.log(req);
	}
	console.log(req.url);
	res.writeHeader(200, {"Content-Type": "text/html"});
	res.write(html);
	res.end();
}).listen(3000);

console.log('listening on port 3000');
