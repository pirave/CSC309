/* Global Variables */
var tweetsData = new Array();
var pgsize = 5;

$( document ).on('pageinit', function(){
    //
});

/*                                  HOME Page                                *\
\*===========================================================================*/

$( "#home" ).on('pageinit', function(){ 

/*****************************************************************************
  Main Menu Popup
 *****************************************************************************/
    
    $( "#popupMenu" ).on({
        popupbeforeposition: function() {
            var h = $( window ).height();
            $( "#popupMenu" ).css( "height", h );
        }
    });

/*****************************************************************************
  Get Tweets
 *****************************************************************************/

    function tweet(data){
        this.date = data.created_at;
        this.id = data.id;
        this.text = data.text;
        this.source = data.source;
        this.replyTo = data.in_reply_to_screen_name;
        this.user = {
            name: data.user.screen_name,
            fullname: data.user.name,
            info: data.user.description,
            location: data.user.location,
            followers: data.user.followers_count,
            photo: data.user.profile_image_url.replace("normal","bigger")
        };
        this.retweets = data.retweet_count;
        this.favourites = data.favourite_count;
        this.urls = data.entities.urls;
        this.user_mentions = data.entities.user_mentions;
        this.hashtags = data.entities.hashtags;
        this.link = exists(this.urls[0], 0) ? this.urls[0].url : '#';
    }

    $.getJSON("favs-more.json",function (data) {
        tweetsData = new Array();
        $.each(data, function(i, tw){
            tweetsData[i] = new tweet(tw);
        });
    });
});

$( "#home" ).on('pagebeforeshow', function(){ 

/*****************************************************************************
  Orientation Change 
 *****************************************************************************/
     
    /* 
      Bind an event to window.orientationchange that, when the device is turned, 
      gets the orientation and displays it to on screen.
     */
    $( window ).on( 'orientationchange', orientationChangeHandler );

    function orientationChangeHandler( event ) {
        if(event.orientation == 'portrait') 
            $( "#imgBird" ).css( "width", "100%" );
        else 
            $( "#imgBird" ).css( "width", "50%" );
    }
    
    // Force event on load.
    $( window ).orientationchange();
});

/*                                  FAVS PAGE                                *\
\*===========================================================================*/

$( "#favs" ).on('pageinit', function(){

/*****************************************************************************
  Slider
 *****************************************************************************/

    $("#footer" ).bind('mouseup touchend',function() {
        PageNO = $("#slider").val();
        GetTweets(PageNO)
    }); alert("set footer");
});

$( "#favs" ).on('pagebeforeshow', function(){
    //alert("beforeshow");
	SetSliderRange();
	pgsize = Math.ceil(($(window).height())/ 100);
    GetTweets(1);
});


/*                                  HOW TO PAGE                              *\
\*===========================================================================*/

/*                                  ABOUT US PAGE                            *\
\*===========================================================================*/


/*****************************************************************************
  Helper Functions
 *****************************************************************************/

function GetTweets( pg ){
    var tweets = tweetsData.slice( (pg - 1) * pgsize, (pg - 1) * pgsize + pgsize );

    // ******* REMOVE!!!!! AFTER PAGINATION !!! **********
    //var tweets = tweetsData;

    if ( tweets ) {
        // Get the page we are going to dump our content into.
        var $page = $( '#favs' ),
            $header = $page.children( ":jqmData(role=header)" ),
            $content = $page.children( ":jqmData(role=content)" ),
            $ul = $( '#tweetlist' ),
            markupLI = "",
            markupPOPUP = "";

        // Generate a list item for each tweet in the range
        // and add it to our markup.
        $.each( tweets, function ( i, tweet ){
            markupLI += 
                "<li id='" + tweet.id + "'>"+
                    "<a href='#'>" + 
                    "<img class='profilePic' src=" + tweet.user.photo + ">" +
                    "<h2>@" + tweet.user.name + "</h2>" +
                    "<p>" + styleText(tweet) + "</p>" +
                    "<a href='#info-" + tweet.id + "' data-rel='popup' data-position-to='window' " + 
                        "data-transition='pop' data-rel='back' class='tweetInfo'>More Info" + 
                    "</a>" + 
                "</li>";

            markupPOPUP += 
                "<div data-role='popup' id='info-" + tweet.id + "' data-theme='d' data-overlay-theme='a' class='ui-content' style='max-width:340px; padding-bottom:2em;' data-rel='back'>" +
                    "<a href='#' data-rel='back' data-role='button' data-theme='a' data-icon='delete' data-iconpos='notext' class='ui-btn-right'>Close</a>" + 
                    "<p>" +
                        "<span class='spnPopupUserName'>" + tweet.user.fullname + "</span>" +
                        "<span class='spnPopupUserHandle'> @" + tweet.user.name + "</span>" +
                        "<span class='spnPopupUserFls'> | " +  tweet.user.followers + " followers</span>" +
                    "</p>" +
                    "<p class='popupTweet'>" + styleText(tweet) + "</p>" +
                    "<span class='spnPopupTime'>" +  parseDate(tweet.date) + "</span>" + 
                        "<div class='divPopupFooter'>" +
                            "<span class='spnPopupStats'>" +
                                "<strong>" + tweet.retweets + "</strong> RETWEETS &nbsp;" +
                                "<strong>"+ exists(tweet.favourites, 1) + "</strong> FAVOURITES" +
                            "</span>";
            if (tweet.link != '#')
                markupPOPUP +=
                            "<span class='spnPopupOpen'>" +
                                "<a class='btnOpen' data-role='button' data-theme='c' data-icon='forward' data-mini='true' data-inline='true' href='" + this.link + "' target='_blank'>open</a>" +
                            "</span>";
                        
            markupPOPUP += "</div></div>";
        });

        // Find the h1 element in our header and inject the name of"
        // the category into it.
        $header.find( "h1" ).html( "Page " + pg );

        // Inject the category items markup into the content element.
        $ul.html( markupLI ).listview("refresh");

        // Inject the popup
        $content.append(markupPOPUP).trigger("create");

        // Enhance Page
        $page.page();

        // Enhance the listview we just injected.
        $ul.listview();

        // Enchance the popup we just injected.
        $content.find( ":jqmData(role=popup)" ).popup();
    }
}

function styleText(tweet){
    var indices = new Array(),
        text = tweet.text,
        links = tweet.urls.concat(tweet.user_mentions, tweet.hashtags);
    $.each(links, function(i, url){
        indices.push(url.indices)
    });
    indices.sort(function(a,b){return b[1]-a[1]});
    $.each(indices, function(i, index){
        text = text.wrapSpan(index[0],index[1]);
    });
    return text;
}

String.prototype.wrapSpan = function (x, y) {
    if (x >= 0)
        return this.substring(0, x) + '<span class="spnLight">' + this.substring(x, y) + '</span>' + this.substring(y, this.length);
    else
        return this;
};

function exists( obj, def ){
    if (typeof obj === "undefined") 
       return def;
   return obj;
};

function parseDate(twitter_date){      
    var date = new Date(Date.parse(twitter_date)).toString().substr(0, 21);

    // format time
    var HH = date.substr(-5, 2);
    var time = (HH<12 ? HH : HH-12) + date.substr(-3) + (HH<12 ? ' AM' : ' PM');

    // formate day
    day = date.substr(8, 2) + ' ' + date.substr(4, 3) + ' ' + date.substr(13, 2);

    return time + ' - ' + day;
}

function SetSliderRange(){ 
	numPages = Math.ceil(tweetsData.length/pgsize);
	$('#slider').attr('max', numPages); 
}