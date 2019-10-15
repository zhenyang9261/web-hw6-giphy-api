// List of topics
var topics = ["dog", "cat", "rabbit", "hamster", "skunk", "goldfish", "bird", "ferret", "turtle", "chinchilla", "hedgehog", "crab", "goat", "chicken", "pig", "frog", "salamander"];

// Array to keep favorite gifs
var favorites = [];

// query URL base part
var queryURL = "https://api.giphy.com/v1/gifs/search?";

// Object to hold query parameters
var queryParams = { "api_key": apiKey};

// Number of pictures to get at one time
var picNum = 10;

/*
 * Function: to display the topic buttons in the page.
 */
function renderBtns() {

    // Clean up the button area
    $("#giphyBtn").empty();

    for (var i=0; i<topics.length; i++) {
        var btn = $("<button>");

        btn.text(topics[i]);
        btn.attr("value", topics[i]);
        btn.attr("class", "btn btn-outline-info btn-lg topicBtn");

        $("#giphyBtn").append(btn);
    }   
}

/*
 * Function: to get gifs when a button is clicked.
 */
function getGifs(btnValue) {

    // local variables
    var col, img, info, fav;
    var gifStill, gifAnimate, gifTitle, gifRating;

    queryParams.q = btnValue;
    queryParams.limit = picNum;

    console.log(queryURL + $.param(queryParams));
    
    // Get the gifs from Giphy
    $.ajax({
        url: queryURL + $.param(queryParams),
        method: "GET"
      }).then(function(response) {
        console.log(response);

        // Clean up show area
        $("#show").empty();

        for (var i=0; i<picNum; i++) {

            // Extract info from response
            gifStill = response.data[i].images.fixed_height_still.url;
            gifAnimate = response.data[i].images.fixed_height.url;
            gifTitle = response.data[i].title;
            gifRating = response.data[i].rating;

            // Put in an object 
            var favObj = {"gifStill" : gifStill,
                          "gifAnimate" : gifAnimate,
                          "gifTitle" : gifTitle,
                          "gifRating" : gifRating};

            // Compose a div to hold the image and the information
            col = $("<div>");
            col.attr("class", "col-xs-12 col-sm-4 img-container");

            // Compose the image element
            img = $("<img>");
            img.attr("alt", btnValue + " picture from Giphy");
            img.attr("src", gifStill);
            img.attr("class", "gif img-fluid");
            img.attr("data-still", gifStill);
            img.attr("data-animate", gifAnimate);
            img.attr("data-state", "still");
            img.attr("id", "gif-" + i);
            
            // Compose the favorite icon element
            fav = $("<img>");
            fav.attr("class", "favorite");
            fav.attr("src", "assets/images/heart.png");
            fav.attr("data-toggle", "tooltip");
            fav.attr("data-placement", "top");
            fav.attr("title", "Add to Favorite");
            fav.attr("data-gif-attr", JSON.stringify(favObj));

            // Compose a div to hold information
            info = $("<div>");
            var title = $("<div>");
            var rating = $("<div>");
            title.text(gifTitle.length==0? "No Title" : gifTitle);
            rating.text("Rating: " + gifRating);
            info.append(title);
            info.append(rating);
            info.attr("class", "info");
            
            // Add the image and info to the div
            col.append(img);
            col.append(fav);
            col.append(info);

            // Add the div to the image area
            $("#show").append(col);
        }

    });
}

/* 
 * Function: to add new topic when Submit button is clicked
 */
function addNewTopic() {
    
    
    var topic = $("#newTopicVal").val().trim().toLowerCase();

    // If a topic is entered
    if (topic.length != 0) {
        
        // Add the topic to the array
        topics.push(topic);

        // Refresh the button display
        renderBtns();
    }

}

/*
 * Function: to toggle between moving and still pictures when a picture is clicked
 */
function togglePicState(picture, state) {


    if (state == "still") {
        var sourceAnimate = $("#"+picture).attr("data-animate");
        $("#"+picture).attr("src", sourceAnimate);
        $("#"+picture).attr("data-state", "animate");
      }
      else {
        var sourceStill = $("#"+picture).attr("data-still");
        $("#"+picture).attr("src", sourceStill);
        $("#"+picture).attr("data-state", "still");
    }

}

/*
 * Function: to store user's favorite gif
 */
function addToFavorite(gifAttr) {
    
    // Add the gif object in the favorite gif array
    favorites.push(JSON.parse(gifAttr));
}

/* 
 * Function: to display user selected favorite gifs
 */
function displayFav(favoriteGifs) {

    // local variables
    var col, img, info, fav;

    // Clean up show area
    $("#show").empty();

    for (var i = 0; i<favorites.length; i++) {

         // Compose a div to hold the image and the information
         col = $("<div>");
         col.attr("class", "col-xs-12 col-sm-4 img-container");

         // Compose the image element
         img = $("<img>");
         img.attr("alt", "Favorite Gif");
         img.attr("src", favorites[i].gifStill);
         img.attr("class", "gif img-fluid");
         img.attr("data-still", favorites[i].gifStill);
         img.attr("data-animate", favorites[i].gifAnimate);
         img.attr("data-state", "still");
         img.attr("id", "gif-" + i);

         // Compose a div to hold information
         info = $("<div>");
         var title = $("<div>");
         var rating = $("<div>");
         title.text(favorites[i].gifTitle.length==0? "No Title" : favorites[i].gifTitle);
         rating.text("Rating: " + favorites[i].gifRating);
         info.append(title);
         info.append(rating);
         info.attr("class", "info");
        
         // Add the image and info to the div
         col.append(img);
         col.append(fav);
         col.append(info);

         // Add the div to the image area
         $("#show").append(col);
    }
}

$(document).ready(function() {

    // Initialize
    renderBtns();

    // Ready to display tooltips
    $('[data-toggle="tooltip"]').tooltip();  

    // Gifs button listener
    $(document).on("click", ".topicBtn", function() {   
        getGifs($(this).attr("value"));
    });

    // Input Submit button listener
    $("#newTopicBtn").on("click", function() {
        event.preventDefault();
        addNewTopic();
    });

    // Gif listener
    $(document).on("click", ".gif", function() {   
        togglePicState($(this).attr("id"), $(this).attr("data-state"));
    });

    // Add to Favorite listener
    $(document).on("click", ".favorite", function() {   
        addToFavorite($(this).attr("data-gif-attr"));
    });
    
    // Favorite GIFs button listener
    $("#favoriteGifBtn").on("click", function() {
        displayFav();
    });

});
