function route(handle, url, response){
	console.log("About to route a request for " + url.pathname);
	if (typeof handle[url.pathname] === 'function'){
		handle[url.pathname](response, url);
	} else {
		handle["else"](response, url);
	} 
}

exports.route = route; 