
// List of items
var items = ["dog", "cat", "rabbit", "hamster", "skunk", "goldfish", "bird", "ferret", "turtle", "golden glider", "chinchilla", "hedgehog", "crab", "goat", "chicken", "pig", "frog", "salamander"];

/*
 * Function: to initialize global variables and place initial buttons in the page.
 */
function init() {

    for (var i=0; i<items.length; i++) {
        var btn = $("<button>");

        btn.text(items[i]);
        btn.attr("value", "data-"+items[i]);
        btn.attr("class", "btn btn-primary btn-lg itemBtn");

        $("#giphyBtn").append(btn);
    }   
}

/*
 * Function: to get gifs when a button is clicked.
 */
function getGifs(btnValue) {
    
    // Compose query URL
    var queryURL = "https://api.giphy.com/v1/gifs/trending?api_key=" + apiKey;

    // Get the gifs from Giphy
    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {
        console.log(response);
    });
}

/* 
 * Function: to add new item when Submit button is clicked
 */
function addNewitem(newitem) {

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
    $(document).on("click", ".itemBtn", function() {   
        getGifs($(this).attr("value"));
    });

    // Input Submit button listener

    // Gif listener

});
