var server = require("./js/server");
var router = require("./js/router");
var requestHandlers = require("./js/requestHandlers");

//Create array of URI handles
var handle = {}
handle["/"] = requestHandlers.start;
handle["/posts"] = requestHandlers.posts;
handle["/replies"] = requestHandlers.replies;
handle["/vote"] = requestHandlers.vote;
handle["/newpost"] = requestHandlers.newpost;
handle["/newreply"] = requestHandlers.newreply;
handle["else"] = requestHandlers.file;

//Initialize server
server.start(router.route, handle);
