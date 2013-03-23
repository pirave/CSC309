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

	if(indexA==-1){
	
		site = null;

	} else {
	
		//Splice string "tweet" from http
		var substr = tweet.slice(indexA,tweet.length);

		//Get index of empty space
		console.log("A: " + tweet);
		console.log("B:" + substr.indexOf(" "));
		console.log("C:" + substr.indexOf("\\"));

		//Problem: Cannot grab newline character in tweet from SarahPrevette
		//If you can grab it, you must still ensure it isn't -1 before taking min

//		var indexB = Math.min(substr.indexOf(" "),substr.indexOf("\\"));
		var indexB = substr.indexOf(" ");

		if(indexB==-1){
			site = substr;
		} else {
			site = substr.slice(0,indexB);
		}
	}

	return site;
}