import { movieBuddy } from "./moviebuddy.js";
//Restore and render the lists
await movieBuddy.restore();
const userID = await movieBuddy.getCurrentUser();
movieBuddy.render(document.getElementsByClassName("table"));
//Helper function
function parse_movie(movie){
    let info = movie.split(/[, ]+/);
    return info;
}

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
watched_add_button.addEventListener("click", async function(event){
    const info = parse_movie(document.getElementById("adding-watched-movie").value);
    await movieBuddy.addWatchList(info[0],info[1],info[2], userID);
    movieBuddy.render(document.getElementsByClassName("table"));
});
watched_del_button.addEventListener("click", async function(event){
    const info = parse_movie(document.getElementById("delete-watched-movie").value);
    await movieBuddy.delWatchList(info[0],info[1], userID);
    movieBuddy.render(document.getElementsByClassName("table"));
});
watched_up_button.addEventListener("click", async function(event){
    const info = parse_movie(document.getElementById("update-watched-movie").value);
    await movieBuddy.updateWatchList(info[0],info[1],info[2], userID);
    movieBuddy.render(document.getElementsByClassName("table"));
});

// Setting up event handlers for wish
wish_add_button.addEventListener("click", async function(event){
    const info = parse_movie(document.getElementById("adding-wish-movie").value);
    await movieBuddy.addWishList(info[0],info[1], userID);
    movieBuddy.render(document.getElementsByClassName("table"));
});
wish_del_button.addEventListener("click", async function(event){
    const info = parse_movie(document.getElementById("delete-wish-movie").value);
    await movieBuddy.delWishList(info[0],info[1], userID);
    movieBuddy.render(document.getElementsByClassName("table"));
});


// Setting up event handlers for recom
recom_add_button.addEventListener('click', async () => {
    // await movieBuddy.recom();
    await movieBuddy.recomlist(550);
    movieBuddy.render(document.getElementsByClassName("table"));
  });
