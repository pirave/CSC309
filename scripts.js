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
			tweets.push("<li>" +
						"<a href='http://www.imdb.com' data-icon='star' data-theme='a'>" + 
						"<img src=" + data[i].user.profile_image_url_https + ">" +
						"<div data-role='collapsible'>" +
						"<h3>" + data[i].user.name + "</h3>" +
						"<p>" +	data[i].text + "</p></div></a></li>");
			}
		
	$("#tweetlist").append(tweets.join('')).listview('refresh');					
	});
});