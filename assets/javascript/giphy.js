// List of topics
var topics = ["dog", "cat", "rabbit", "hamster", "skunk", "goldfish", "bird", "ferret", "turtle", "golden glider", "chinchilla", "hedgehog", "crab", "goat", "chicken", "pig", "frog", "salamander"];

// query URL base part
var queryURL = "https://api.giphy.com/v1/gifs/search?";

// Object to hold query parameters
var queryParams = { "api_key": apiKey};

// Number of pictures to get at one time
var picNum = 10;

/*
 * Function: to initialize global variables and place initial buttons in the page.
 */
function init() {

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
    var col, img;

    queryParams.q = btnValue;
    queryParams.limit = picNum;

    console.log(queryURL + $.param(queryParams));
    
    // Get the gifs from Giphy
    $.ajax({
        url: queryURL + $.param(queryParams),
        method: "GET"
      }).then(function(response) {
        console.log(response);

        for (var i=0; i<picNum; i++) {

            // Compose a div to hold the image
            col = $("<div>");
            col.attr("class", "col-xs-12 col-sm-4");

            // Compose the image element
            img = $("<img>");
            img.attr("alt", btnValue + " picture from Giphy");
            img.attr("src", response.data[i].images.fixed_width_still.url);
            img.attr("class", "gif");
            
            // Add the image to the div
            col.append(img);

            // Add the div to the image area
            $("#show").append(col);

        }

    });
}

/* 
 * Function: to add new topic when Submit button is clicked
 */
function addNewTopic(newTopic) {

}

/*
 * Function: to toggle between moving and still pictures when a picture is clicked
 */
function togglePic(picture) {

}

$(document).ready(function() {

    // Initialize
    init();

    // Gifs button listener
    $(document).on("click", ".topicBtn", function() {   
        getGifs($(this).attr("value"));
    });

    // Input Submit button listener

    // Gif listener

});
