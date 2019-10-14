// List of topics
var topics = ["dog", "cat", "rabbit", "hamster", "skunk", "goldfish", "bird", "ferret", "turtle", "chinchilla", "hedgehog", "crab", "goat", "chicken", "pig", "frog", "salamander"];

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
        btn.attr("class", "btn btn-primary btn-lg topicBtn");

        $("#giphyBtn").append(btn);
    }   
}

/*
 * Function: to get gifs when a button is clicked.
 */
function getGifs(btnValue) {

    // local variables
    var col, img, info;

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

            // Compose a div to hold the image and the information
            col = $("<div>");
            col.attr("class", "col-xs-12 col-sm-4");

            // Compose the image element
            img = $("<img>");
            img.attr("alt", btnValue + " picture from Giphy");
            img.attr("src", response.data[i].images.fixed_height_still.url);
            img.attr("class", "gif img-fluid");
            img.attr("data-still", response.data[i].images.fixed_height_still.url);
            img.attr("data-animate", response.data[i].images.fixed_height.url);
            img.attr("data-state", "still");
            img.attr("id", "gif-" + i);
            
            // Compose a div to hold information
            info = $("<div>");
            var title = $("<div>");
            var rating = $("<div>");
            title.text(response.data[i].title);
            rating.text("Rating: " + response.data[i].rating);
            info.append(title);
            info.append(rating);

            // Add the image and info to the div
            col.append(img);
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
        rendertns();
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

$(document).ready(function() {

    // Initialize
    renderBtns();

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

});
