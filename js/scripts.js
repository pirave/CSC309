/* Global variables*/
var PageNO = 0;
var showPerPage = 5;
number_of_pages = 0


$(document).ready(function(){
	$(function() {
	  /* 
		Bind an event to window.orientationchange that, when the device is turned, 
		gets the orientation and displays it to on screen.
	   */
	  $(window).on( 'orientationchange', orientationChangeHandler );
	 
	  function orientationChangeHandler( event ) {
		$( "#MSG" ).html( "This device is in " + event.orientation + " mode!" ); //Remove later

		if(event.orientation == 'portrait') {
			$("#main_content").attr({"class":"ui-grid-solo"});
			$("#A").attr({"class":"ui-block-a", "data-role":"content"});				
			$("#B").attr({"class":"ui-block-a", "data-role":"content"});				
		} else if(event.orientation == 'landscape') {
			$("#main_content").attr("class","ui-grid-a");
			$("#A").attr({"data-role":"content","class":"ui-block-a"});				
			$("#B").attr({"data-role":"content","class":"ui-block-b"});				
		}
	  }
	  // Force event on load.
	  $(window).orientationchange();
	}); 
});
/*
$("#btnLoad").click(function(){
	$.getJSON("favs.json",function (data) {

		var tweets = [];

		for(var i in data) {

			var ref_website = parseTweet(data[i].text);

			var user_info = parseUserInfo(data[i].user);

			tweets.push("<li>" + 
						"<a href='" + ref_website + "' data-icon='star' target='_blank' data-theme='a'>" +
						"<img src=" + data[i].user.profile_image_url_https + ">" +
						"<h3>" + data[i].user.name + "</h3>" +
						"<p>" +	data[i].text + "</p>" +
						"<p id='p" + i +"' style='display:none'>" + user_info + "</p></a>" +
						"<a id='b" + i + "' class='togglebtn' href='javascript:void(0)'></a></li>");
		}
		
	$("#tweetlist").append(tweets.join('')).listview('refresh');					
	});
});
*/
$("#btnLoad").click(function(){
	$.getJSON("favs.json",function (data) {
		var number_of_items = data.length;
		var tweets = [];
		tweets = GetTweets(data, PageNO, showPerPage)
	$("#tweetlist").append(tweets.join('')).listview('refresh');
	CreateNav(number_of_items);
	});
});

$('#page_navigation').on('click', '#btnNav', function () {
//$("#btnNav").click(function(){
	PageNO = $(this).attr("name");
	var limit = 5 + (5 * PageNO)
	$.getJSON("favs.json",function (data) {
	$(".test").remove();
	$("#tweetlist").append(GetTweets(data, PageNO, limit).join('')).listview('refresh');
	
	});
});

$('#page_navigation').on('click', '#btnPrev', function () {
	if (PageNO > 0) {
		$.getJSON("favs.json",function (data) {
			PageNO = PageNO -1
			var limit = 5 + (5 * PageNO)
			$(".test").remove();
			$("#tweetlist").append(GetTweets(data, PageNO, limit).join('')).listview('refresh')
		});
	}
});

$('#page_navigation').on('click', '#btnNext', function () {
	if (PageNO < number_of_pages -1 ) {
		$.getJSON("favs.json",function (data) {
			PageNO = PageNO +1
			var limit = 5 + (5 * PageNO)
			$(".test").remove();
			$("#tweetlist").append(GetTweets(data, PageNO, limit).join('')).listview('refresh')
		});
	}
});

$("#tweetlist").on('click', '.togglebtn', function(){

	var btnid = this.id;
	console.log(btnid);
	var pid = "#p" + btnid.slice(1,btnid.length);
	console.log(pid);

	$(pid).slideToggle();

});

function parseUserInfo(user) {

	return 	"<br>Bio: " + user.description +
			"<br><br>Location: " + user.location;

}

function parseTweet(tweet){

	var site;
	//Get index of "http:"
	var indexA = tweet.search("http:"); //Need to be http || https

	//The tweet contains a link
	if(indexA==-1){
	
		site = "#";

	//The tweet does not contain a link
	} else {
	
		//Splice string "tweet" from http onward
		var substr = tweet.slice(indexA,tweet.length);

		//Escape special characters
		var esc_substr = escape(substr);

		//Get index of empty space
		space_index = esc_substr.indexOf("%20");
		line_index = esc_substr.indexOf("%0A");

		//If there is nothing after the URL
		if(space_index==-1 && line_index==-1) {
			site = substr;

		//If there is no new line after the URL
		} else if (line_index==-1) {
			//Use space_index to splice
			site = unescape(esc_substr.slice(0,space_index));

		//If there is no blank space after the URL
		} else if (space_index==-1) {
			//Use line index to splice
			site = unescape(esc_substr.slice(0,line_index));

		//There is a new line and blank space after the URL
		} else {
			//Use the minimum index to slice string
			indexB = Math.min(space_index,line_index);
			site = unescape(esc_substr.slice(0,indexB));
		}
	}

	return site;
}


function GetTweets(data, PageNO, limit){
	var tweets = [];
	for(i = 5 * PageNO ; i < limit ;i++){
		var ref_website = parseTweet(data[i].text);
		var user_info = parseUserInfo(data[i].user);
		tweets.push("<li class='test'>" + 
		"<a href='" + ref_website + "' data-icon='star'  data-transition='pop' data-theme='a'>" +
		"<img src=" + data[i].user.profile_image_url_https + ">" +
		"<h3>" + data[i].user.name + "</h3>" +
		"<p>" +	data[i].text + "</p>" +
		"<p id='p" + i +"' style='display:none'>" + user_info + "</p></a>" +
		"<a id='b" + i + "' class='togglebtn' href='javascript:void(0)'></a></li>");
	}
	return tweets;
}
	
function CreateNav(NoItems){ 
	number_of_pages = Math.ceil(NoItems/showPerPage);
	var navigation_html = '<a id = "btnPrev" data-corners="false" data-role="button" data-theme="a" class="previous_link" data-icon="arrow-l">Prev</a>';  
	var current_link = 0;  
	while(number_of_pages > current_link){  
		navigation_html += '<a data-theme="a" id = "btnNav" data-corners="false" data-role="button" class="page_link" name="' + current_link +'">'+ (current_link + 1) +'</a>';  
		current_link++;  
	}  
	navigation_html += '<a id = "btnNext" data-corners="false" data-role="button" data-theme="a" ="next_link" data-icon="arrow-r">Next</a>';  
	//navigation_html = '<a href="index.html" data-role="button" data-icon="plus">Add</a>'
		  
	$('#page_navigation').append(navigation_html);  
			$("#page_navigation").trigger('create');
}