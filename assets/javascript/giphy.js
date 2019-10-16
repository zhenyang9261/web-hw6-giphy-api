// List of topics
var topics = ["dog", "cat", "rabbit", "hamster", "skunk", "goldfish", "bird", "ferret", "turtle", "chinchilla", "hedgehog", "crab", "goat", "chicken", "pig", "frog", "salamander"];

// Object to keep favorite gifs
var favorites = {};

// query URL base part
var queryURL = "https://api.giphy.com/v1/gifs/search?";

// Object to hold query parameters
var queryParams = { "api_key": apiKey};

// Number of pictures to get at one time
var picNum = 10;

/*
 * Function: called when the page is loaded
 */
function init() {

    // Get favorite gifs from localstorage
    favorites = JSON.parse(localStorage.getItem("favGifs"));

    // If not set yet, define as an empty object
    if (favorites == null)
        favorites = {};

    // Place the buttons
    renderBtns();
}
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
    var gifStill, gifAnimate, gifTitle, gifRating, gifId;

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
            gifId = response.data[i].id;

            // Put in an object 
            var favObj = {};
            favObj[gifId] = {"gifStill" : gifStill,
                          "gifAnimate" : gifAnimate,
                          "gifTitle" : gifTitle,
                          "gifRating" : gifRating};
//console.log(favObj);
//console.log(JSON.stringify(favObj));

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
            if (gifId in favorites) 
                fav.attr("src", "assets/images/heart.png");
            else
                fav.attr("src", "assets/images/heart-hollow.png");
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
function addToFavorite(elem) {

    var attr = elem.attr("data-gif-attr");
    var attrObj = JSON.parse(attr);
    var key = Object.keys(attrObj)[0];

console.log(attr);
//console.log(attrObj);
//console.log(Object.keys(attrObj)[0]);
//console.log(attrObj[key]);

    if (key in favorites) {
        // If already in favorite gifs, do nothing
//console.log("fav exists");
        return;
    }
    else {
        
        // Add the gif object in the favorite gif object
        favorites[key] = {"gifStill": attrObj[key].gifStill,
                          "gifAnimate": attrObj[key].gifAnimate,
                          "gifTitle": attrObj[key].gifTitle,
                          "gifRating": attrObj[key].gifRating};

//console.log(favorites);

        // Update localstorage
        localStorage.setItem("favGifs", JSON.stringify(favorites));

        // Change the favorite picture to solid heart
        elem.attr("src", "assets/images/heart.png");
    }
}

/* 
 * Function: to display user selected favorite gifs
 */
function displayFav() {

    // local variables
    var col, img, info, fav;
    var keys = Object.keys(favorites);

    // Clean up show area
    $("#show").empty();

    for (var i = 0; i<keys.length; i++) {

         // Compose a div to hold the image and the information
         col = $("<div>");
         col.attr("class", "col-xs-12 col-sm-4 img-container");

         // Compose the image element
         img = $("<img>");
         img.attr("alt", "Favorite Gif");
         img.attr("src", favorites[keys[i]].gifStill);
         img.attr("class", "gif img-fluid");
         img.attr("data-still", favorites[keys[i]].gifStill);
         img.attr("data-animate", favorites[keys[i]].gifAnimate);
         img.attr("data-state", "still");
         img.attr("id", "gif-" + i);

         // Compose a div to hold information
         info = $("<div>");
         var title = $("<div>");
         var rating = $("<div>");
         title.text(favorites[keys[i]].gifTitle.length==0? "No Title" : favorites[keys[i]].gifTitle);
         rating.text("Rating: " + favorites[keys[i]].gifRating);
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
    init();

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
        addToFavorite($(this));
    });
    
    // Favorite GIFs button listener
    $("#favoriteGifBtn").on("click", function() {
        displayFav();
    });

});
