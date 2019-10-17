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

// Boolean to show whether the current page is favorite page
var favPage = false;

// Offset
var offset = 0;

// Current topic
var currentTopic = "";

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
function getGifs() {

    // local variables
    var col, img, info, fav;
    var gifStill, gifAnimate, gifTitle, gifRating, gifId;

    queryParams.q = currentTopic;
    queryParams.limit = picNum;
    queryParams.offset = offset;

    console.log(queryURL + $.param(queryParams));
    
    // Get the gifs from Giphy
    $.ajax({
        url: queryURL + $.param(queryParams),
        method: "GET"
      }).then(function(response) {

        // Clean up show area
        if (offset === 1)
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

            // Compose a div to hold the image and the information
            col = $("<div>");
            col.attr("class", "col-xs-12 col-sm-4 img-container");

            // Compose the image element
            img = $("<img>");
            img.attr("alt", currentTopic + " picture from Giphy");
            img.attr("src", gifStill);
            img.attr("class", "gif img-fluid");
            img.attr("data-still", gifStill);
            img.attr("data-animate", gifAnimate);
            img.attr("data-state", "still");
            img.attr("id", "gif-" + offset + i);
            
            // Compose the favorite icon element
            fav = $("<img>");
            fav.attr("class", "favorite");
            if (gifId in favorites) {
                fav.attr("src", "assets/images/heart.png");
                fav.attr("title", "Remove from Favorites");
            }
            else {
                fav.attr("src", "assets/images/heart-hollow.png");
                fav.attr("title", "Add to Favorites");
            }
            fav.attr("data-toggle", "tooltip");
            fav.attr("data-placement", "top");
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
            $("#show").prepend(col);
        }
    });
}

/* 
 * Function: to add new topic when Submit button is clicked
 */
function addNewTopic() {
    
    // Get user input, trim and convert to all lowercase
    var topic = $("#newTopicVal").val().trim().toLowerCase();

    // If the topic is empty
    if (topic.length != 0) {
        
        // Execute this block only if the topic is not already in the topic array
        if (!topics.includes(topic)) {
            
            // Add the topic to the array
            topics.push(topic);

            // Refresh the button display
            renderBtns();
        }

        // Empty the field
        $("#newTopicVal").val('');
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
 * Function: to add or remove user's favorite gif
 */
function handleFavorite(elem) {

    var attr = elem.attr("data-gif-attr");
    var attrObj = JSON.parse(attr);
    var key = Object.keys(attrObj)[0];

    if (key in favorites) {
        
        // If already in favorite gifs, remove it
        delete favorites[key];

        // Update localstorage
        localStorage.setItem("favGifs", JSON.stringify(favorites));

        // Change the favorite picture to hollow heart
        elem.attr("src", "assets/images/heart-hollow.png");

        // Change tooltip title
        elem.attr("title", "Add to Favorites");

        // Remove the image if we are in the favorite page
        if (favPage)
            elem.closest('.img-container').remove();
    }
    else {
        
        // Add the gif object in the favorite gif object
        favorites[key] = {"gifStill": attrObj[key].gifStill,
                          "gifAnimate": attrObj[key].gifAnimate,
                          "gifTitle": attrObj[key].gifTitle,
                          "gifRating": attrObj[key].gifRating};

        // Update localstorage
        localStorage.setItem("favGifs", JSON.stringify(favorites));

        // Change the favorite picture to solid heart
        elem.attr("src", "assets/images/heart.png");

        // Change tooltip title
        elem.attr("title", "Remove from Favorites");
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
        
        var favObj = {};
        favObj[keys[i]] = favorites[keys[i]];

        // Compose the favorite icon element
        fav = $("<img>");
        fav.attr("class", "favorite");
        fav.attr("src", "assets/images/heart.png");
        fav.attr("title", "Remove from Favorites");
        fav.attr("data-toggle", "tooltip");
        fav.attr("data-placement", "top");
        fav.attr("data-gif-attr", JSON.stringify(favObj));

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
    //$('[data-toggle="tooltip"]').tooltip();  
    $("body").tooltip({
        selector: '[data-toggle="tooltip"]'
    });

    // Gifs button listener
    $(document).on("click", ".topicBtn", function() {   
        favPage = false;
        offset = 1;
        currentTopic = $(this).attr("value");
        $("#get-more-btn").attr("style", "display:inline-block");
        getGifs();
    });

    // Input Submit button listener
    $("#new-topic-btn").on("click", function() {
        event.preventDefault();
        addNewTopic();
    });

    // Gif listener
    $(document).on("click", ".gif", function() {   
        togglePicState($(this).attr("id"), $(this).attr("data-state"));
    });

    // Add to Favorite listener
    $(document).on("click", ".favorite", function() {   
        handleFavorite($(this));
    });
    
    // Favorite GIFs button listener
    $("#favorite-gif-btn").on("click", function() {
        favPage = true;
        $("#get-more-btn").attr("style", "display:none");
        displayFav();
    });

    // Get More GIFs button listener
    $("#get-more-btn").on("click", function() {
        offset += 10;
        getGifs();
    });
});
