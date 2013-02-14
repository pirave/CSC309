//Execute on page load
$(document).ready(
	function(){
		//Load posts saved on server
		$.getJSON("./posts",
			{
				format: "json",
			},
			function (data) { 
				var posts = [];
				sortPoints(data.posts); //Sort posts
				$.each(data.posts, function (i, post) {
					posts.push(createPost(post)); //Create post from stored info
				});
				//$("<ul/>", {html: posts.join("")}).appendTo("#posts-wrapper");
				$("#posts-wrapper").append(posts.join(""));
	}); // END GETJSON
}); // END DOCUMENT READY

//"sort posts" button clicked 
$("#btnSort").click(

	function () {
	$(".post").slideUp(function(){$(this).remove()});	//Remove all posts
	$.getJSON("./posts",
			{
				format: "json",
			},
			function (data) { 
				var posts = [];
				sortPoints(data.posts); //Sort posts

				//Recreate and append each post to page
				$.each(data.posts, function (i, post) {
					posts.push(createPost(post)); 
				});
				$("#posts-wrapper").append(posts.join(""));
	}); //END GETJSON
	
	})

//"Post" button clicked
$("#btnPost").click(
	function () {
		//Ensure inputs are valid
		if ($("#txtPost").val() == "" && $("#txtURL").val() == ""){
			alert("Please enter your Topic and a valid URL");
			return ;
		} if($("#txtPost").val() == ""){
			alert("Please enter your Topic");
			return ;
		} if ($("#txtURL").val() == ""){
			alert("Please enter a valid URL");
			return ;
		}
		
		//Send new post info to server
		$.getJSON("./newpost",
			{
				format: "json",
				topic: $("#txtPost").val(), 
				url: $("#txtURL").val(),
			},
			//Append new post to page
			function (post) { 
				$("#posts-wrapper").append(createPost(post));
			});
		$("#txtPost").val('');
		$("#txtURL").val('');
	});

//Help button clicked to toggle instruction display on/off
$("#btnHelp").click(
	function () {
		$("#about").slideToggle(function(){$("#btnHelp").html($(this).is(':visible') ? "I'm good :)" : "I need help :(");});
	});

//Toggles comments on/off for post
$("#posts-wrapper").on('click', '.display-comments',
	function (){
		var parent = $(this).parent().parent().attr('id');
		var id = "#" + parent+"r";
		//getjson with parameter:?parentid=parent
		if ($(id).exists()){
			$(id).slideUp(function(){$(this).remove()});
		} else {
			//Post replies for parent
			$.getJSON("./replies",
				{
					format: "json",
					post: parent,
				},
				function (data) { 
					var replies = [];
					sortPoints(data.replies);
					replies.push("<div class='replies' id='" + parent + "r' style='display:none'>");			
					replies.push(createReply(data.replies));
					replies.push("</div>");
					$("#" + parent).append(replies.join(""));
					$(id).slideDown();
				});
		}
	});

//Reply to a post
$("#posts-wrapper").on('click',  '.btnReply',

	//Ensure two reply windows aren't open concurrently
	function(){
		if ($("#comment").exists()){
			$("#comment").remove();
		}
		var parent = $(this).attr('id').replace("btn", "");
		var div = '<div id="comment" style="display:none">' +
			'<textarea id= "txtComment" type="text" placeholder="Enter Text" maxlength="144"></textarea>'+
			'<button class="btnComment">add comment</button>' +
			'<button class="btnCancel">Cancel</button>' +
			'</div>';

		//Append or push comment
		if($("#" + parent).children(".title").exists())
			$("#" + parent).children(".title").append(div);
		else
			$("#" + parent).children(".reply-content").after(div);
		$("#comment").slideDown();
	});

//Remove open comment window
$("#posts-wrapper").on('click', '.btnCancel',
	function(){
		$(this).parent().slideUp(function(){$(this).remove()});		
	});

//"Add comment" in reply form
$("#posts-wrapper").on('click', '.btnComment',
	function () {
		var parent = $("#comment").parent();
		if (parent.attr('class') == "title")
			parent = parent.parent().attr('id');
		else
			parent = parent.attr('id');
		if($("#txtComment").val() == ""){
			alert("Please enter your reply");
			return ;
		}

		//Send reply data to server
		$.getJSON("./newreply",
			{
				format: "json",
				reply: $("#txtComment").val(),
				parent: parent
			},
			//Add reply to parent
			function (reply) { 
				if (parent.length > 2)
					$("#" + parent).append(createReply([reply]));
				else{
					if ($("#" + parent + "r").exists())
						$("#" + parent + "r").append(createReply([reply]));
					else
						$("#" + parent + " .display-comments").trigger("click");
				}
					
				$("#comment").slideUp("fast", function(){$(this).remove();});
				var coms = "#" + parent.substring(0,2) + "coms";
				$(coms).html(pluralize(parseInt($(coms).text().substring(0,$(coms).text().indexOf(" "))) + 1, "comment"));
			});
	});

//Increment point total for a reply
$("#posts-wrapper").on('click', '.vote-up',
	function(){
		$.post("./vote?reply=" + $(this).parent().attr('id'));
		var replyId = "#" + $(this).parent().attr('id') + "points";
		var postId = "#" + $(this).parent().attr('id').substring(0,2) + "points";
		$(replyId).html(incPoints(replyId));
		$(postId).html(incPoints(postId));
	});
	
$("input").focus(function(){
	$(this).css("background-color","#f1f1f1");
});
$("input").blur(function(){
	$(this).css("background-color","#ffffff");
});

function toggleVisibility($element){
	if ($element.is(':visible'))
		$element.hide();
	else
		$element.show();
}

function pluralize(num, str){
	if (num == 1)
		return num + " " + str
	else
		return num + " " + str + "s";
}

/* values retrieved online */
function elapsedTime(timestamp){
	var date = new Date(timestamp);
	var sec = Math.floor(((new Date().getTime()/1000) - date));
	var times = {
		"year" : 31536000,
		"month" : 2592000,
		"day" : 86400,
		"hour" : 3600,
		"minute" : 60,
		"second" : 1
	}
	var diff;
	$.each(times, function(word, val) {
		diff = Math.floor(sec / val);
		if (diff > 1){
			date = pluralize(diff, word) + " ago";
			return false;
		} date = "now"
	});
	return date;
}

jQuery.fn.exists = function() { 
	return this.length > 0; 
};

//Create HTML div for post
function createPost(post){
	var div = "";
	
	div +="<div class='post' id='" + post.id + "'>";
	div += "<div class='title'>"
	div += "<a href='http://" + post.url + "'>" + post.text + "</a>";			
	div += "<span class='topic-link'>(" + post.url + ")</span>";
	div += "<a class='display-comments' id='" + post.id +"coms'>" + pluralize(post.numComs,"comment") + "</a>";
	div += "<div class='post-info'>";
	div += "<span id='" + post.id + "time' class='time'>" + elapsedTime(post.time) + "</span>|";
	div += "<span id='" + post.id + "points' class='points'>" + pluralize(post.points, "point") + "</span>|";
	div += "<span class='points'><a class='btnReply' id='" + post.id + "btn'>reply</a></span>";
	div += "</div></div></div>";
	
	return div;
}

//Create HTML div for reply
function createReply(replies){
	if (replies == null) return "";
	var div = "";	
	
	$.each(replies, function (i, reply) {		
		div +="<div class='reply-wrapper' id='" + reply.id + "'>";
		div += "<a class='vote-up'>&#x25B2;</a>"
		div += "<span class='reply-info'>";
		div += "<span id='" + reply.id + "time' class='time'>" + elapsedTime(reply.time) + "</span>|";
		div += "<span id='" + reply.id + "points' class='points'>" + pluralize(reply.points, "point") + "</span>";					
		div += "</span>";
		div += "<div class='reply-content'>" + reply.text + "</div>"
		div += "<div> <a class='btnReply' id='" + reply.id + "btn'>reply</a></div>"
		div += createReply(reply.replies);
		div += "</div>";
	});
	
	return div
}

//Recursively sort the points of posts and replies
function sortPoints(objs){
	if (objs == null) return;
	objs.sort(
		function(a, b){
			if (a.points == b.points)
				return b.time - a.time;
			return b.points - a.points;
		});
	$.each(objs, function (i, obj){
		sortPoints(obj.replies);
	});
}

//Increment the number of points for a reply
function incPoints(id){
	var points = parseInt($(id).text().substring(0,$(id).text().indexOf(" "))) + 1;
	return pluralize(points, "point");
}