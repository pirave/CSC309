var http = require("http");
var url = require("url");

function start(route, handle){
	//Start server on incoming request
	function onRequest(request, response){

		request.on('error', function(err) {
			console.log('problem with request: ' + err.message);
			console.error(err);
			response.writeHead(500, {"Content-Type": "text/plain"});
    		response.end('500 Error: Internal server error');
			});

		//Decispher incoming request
		var URL = url.parse(request.url, true);
		console.log("Request for " + URL.href + " recieved.");
		route(handle, URL, response);
	};
	
	//Create server
	var port = process.env.PORT || 5000
	http.createServer(onRequest).listen(port);
};

exports.start = start;
