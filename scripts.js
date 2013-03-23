$(document).ready(function(){
	$(function() {
	  /* 
		Bind an event to window.orientationchange that, when the device is turned, 
		gets the orientation and displays it to on screen.
	   */
	  $(window).on( 'orientationchange', orientationChangeHandler );
	 
	  function orientationChangeHandler( event ) {
		$( "#MSG" ).html( "This device is in " + event.orientation + " mode!" );

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

$("#btn1").click(function(){
	$.getJSON("favs.json",function (data) {

		var tweets = [];

		for(var i in data) {

			var ref_website = parseTweet(data[i].text);
			console.log(ref_website);

			if(ref_website==null) {
				tweets.push("<li>" + 
							"<img src=" + data[i].user.profile_image_url_https + ">" +
							"<div data-role='collapsible'>" +
							"<h3>" + data[i].user.name + "</h3>" +
							"<p>" +	data[i].text + "</p></div></li>");
			} else {
				tweets.push("<li>" + 
							"<a href='" + ref_website + "' data-icon='star' target='_blank' data-theme='a'>" +
							"<img src=" + data[i].user.profile_image_url_https + ">" +
							"<div data-role='collapsible'>" +
							"<h3>" + data[i].user.name + "</h3>" +
							"<p>" +	data[i].text + "</p></div></a></li>");
			}

		}
		
	$("#tweetlist").append(tweets.join('')).listview('refresh');					
	});
});

function parseTweet(tweet){

	var site;
	//Get index of "http:"
	var indexA = tweet.search("http:"); //Need to be http || https

	//The tweet contains a link
	if(indexA==-1){
	
		site = null;

	//The tweet does not contain a link
	} else {
	
		//Splice string "tweet" from http onward
		var substr = tweet.slice(indexA,tweet.length);

		//Escape special characters
		var esc_substr = escape(substr);

		//Get index of empty space
		console.log("A: " + escape(substr));
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