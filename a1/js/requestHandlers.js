var querystring = require("querystring"),
	fs = require("fs"),
	path = require("path");

var allPosts = [];	// Holds all of the posts in sorted order..

MIME_TYPES = {
	".html" : "text/html",
	".css" : "text/css",
	".js" : "text/javascript",
	".json" : "application/json",
	".txt" : "text/plain",
	".png" : "image/png",
	".ico" : "image/x-icon"
};
/* Object Declarations */

//Stamp new post with post-information
function Post (text, url) {
	this.id = "p" + (allPosts.length + 1);
	this.text = text;
	this.url = url;
	this.numComs = 0;
	this.points = 0;
	this.time = Math.floor(new Date().getTime()/1000);
	this.replies = [];
}

//Stamp new reply with post-information
function Reply (text, parent) {
	this.id = parent.id + "r" + (parent.replies.length + 1);
	this.text = text;
	this.points = 0;
	this.time = Math.floor(new Date().getTime()/1000);
	this.replies = [];
	//this.parent = parent; // @Vince this causes a circular
}

//Initialize server
function start(response, url){
	console.log("Request handler 'start' was called.");
	serveFile("./index.html", response); 	//Error handle done in serveFile
}

//Sort and return all posts
function posts(response, url){
	console.log("Request handler 'posts' was called.");
	//sortPoints(allPosts);
	writeJSON(response, {"posts": allPosts}); //write all posts&replies back to client
}

//Write all JSON replies
function replies(response, url){
	console.log("Request handler 'replies' was called on " + url.query.post);
	writeJSON(response, {"replies": findPost(url.query.post).replies});
}

//Increment vote for a particular reply
function vote(response, url){
	try {
		console.log("Vote for " + url.query.reply);
		var nested = url.query.reply.indexOf("r");
		var post;
		if (nested > -1)
			post = findPost(url.query.reply.substring(0, nested));
		else
			post = findPost(url.query.reply);
		//findPost(url.query.reply.substring(0,2)).points++; don't hardcode 2
		findReply(allPosts, url.query.reply).points++;
		post.points++;
		//sortPoints(allPosts);
	} catch(err) {
		//Return 404
		response.writeHead(404, {"Content-Type": "text/plain"});
    	response.end('404 Error: File not found');
		console.log("Error in vote, could not find post");
	}
	response.end();
}

//Create a new post
function newpost(response, url){
	try {
		if ((!url.query.topic) || (!url.query.url)){
			//Topic or URL not specified return 500
			sendError(response, 500)
		}
		else{
			console.log("here3")
			var post = new Post(url.query.topic, url.query.url);
			allPosts.push(post);
			writeJSON(response, post);
		}
	} catch (err) {
		//Return 500
		sendError(response, 500)
	}

}

//Create a new reply
function newreply(response, url){
	try {
		var parent = findReply(allPosts, url.query.parent)
		var reply = new Reply(url.query.reply, parent);
		parent.replies.push(reply);
		findPost(parent.id.substring(0,2)).numComs++; 
		writeJSON(response, reply);
	} catch (err) {
		//Return 500
		response.writeHead(500, {"Content-Type": "text/plain"});
    	response.end('500 Error: Internal server error');
		console.log(err.message + "Error: could not write reply");	
	}
}

function file(response, url){
	serveFile("." + url.pathname, response);
}

//Send file requested by URL to client
function serveFile(pathname, response){
	path.exists(pathname, function(exists) {
		if (!exists) { //bad path provided by client
			console.log("No file: " + pathname);
			response.writeHead(404, {"Content-Type": "text/plain"});
			response.end("404 Error: File not found");
			return;
		}
		
		fs.readFile(pathname, function(err, data){
			if (err){ //Problem reading file
				response.writeHead(500, {"Content-Type": "text/plain"});
				response.end("500 Error: Internal server error");
				console.error(err);
			}
			
			//File read successfully.  Proceed to write.
			var mimeType = MIME_TYPES[path.extname(pathname)];
			response.writeHead(200, {"Content-Type": mimeType ? mimeType : "text/html"});
			response.write(data);
			response.end();
		});
	});
}

function sortPoints(objs){
	if (objs == null) return;
	objs.sort(
		function(a, b){
			if (a.points == b.points)
				return b.time - a.time;
			return b.points - a.points;
		});
	for (var i=0; i < objs.length; i++) // had to change due to jquery ref
		sortPoints(objs[i].replies);
}

function findPost(id){
	var i = -1;
	while (allPosts[++i].id != id);
	return allPosts[i];
}

// depth first search
function findReply(replies, id){
	if (replies == null) return null;
	for (var i = 0; i < replies.length; i++){
		if (replies[i].id == id)
			return replies[i];
		var reply = findReply(replies[i].replies,id);
		if (reply != null)
			return reply;
	}
	return null;
}

function writeJSON(response, data){
	try {
		response.writeHead(200, {"Content-Type": "application/json"});
		response.write(JSON.stringify(data));
		response.end();
	} catch (err) {
		console.log("Error writing JSON file");
		response.writeHead(404, {"Content-Type": "text/plain"});
		response.end("404 Error: File not found");
	}
}

function sendError(response, code){
    response.writeHead(code, {"Content-Type": "text/plain"});
    response.end();
}

exports.start = start;
exports.file = file;
exports.posts = posts;
exports.replies = replies;
exports.vote = vote;
exports.newpost = newpost;
exports.newreply = newreply;

