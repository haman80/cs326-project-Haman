import { MovieBuddy } from "./moviebuddy.js";
const app = new MovieBuddy();
// Handling watched controls
const watched_add_button = document.getElementById("add-watched-button");
const watched_del_button = document.getElementById("delete-watched-button");
const watched_up_button = document.getElementById("update-watched-button");
// Handling wish controls
const wish_add_button = document.getElementById("add-wish-button");
const wish_del_button = document.getElementById("delete-wish-button");

// Handling Recom controls
const recom_add_button = document.getElementById("recom-button");

// Setting up event handlers for watched
watched_add_button.addEventListener("click", function(event){
    app.add_watched(document.getElementById("adding-watched-movie").value);
    app.render(document.getElementsByClassName("table"));
});
watched_del_button.addEventListener("click", function(event){
    app.del_watched(document.getElementById("delete-watched-movie").value);
    app.render(document.getElementsByClassName("table"));
});
watched_up_button.addEventListener("click", function(event){
    app.up_watched(document.getElementById("update-watched-movie").value);
    app.render(document.getElementsByClassName("table"));
});

// Setting up event handlers for wish
wish_add_button.addEventListener("click", function(event){
    app.add_watched(document.getElementById("adding-wish-movie").value);
    app.render(document.getElementsByClassName("table"));
});
wish_del_button.addEventListener("click", function(event){
    app.del_watched(document.getElementById("delete-wish-movie").value);
    app.render(document.getElementsByClassName("table"));
});


// Setting up event handlers for recom
recom_add_button.addEventListener("click", function(event){
    app.up_recom();
    app.render(document.getElementsByClassName("table"));
});
