class MovieBuddy {
    constructor() {
      // Initialize the bag.
      this.watched = [];
      this.wish = [];
      this.recom = [];
    }
    async restore(){
        this.watched = await this.readWatchList();
        this.wish = await this.readWishList();
    }
  
    render(tables) {
        //Render watched
        const watched_table = tables[0];
        let old_tbody = document.getElementById("watched_table_body");
        let new_tbody = document.createElement('tbody');
        new_tbody.setAttribute('id', 'watched_table_body');
        old_tbody.parentNode.replaceChild(new_tbody, old_tbody);   
        for (const movie of this.watched){
            let new_row = watched_table.getElementsByTagName('tbody')[0].insertRow();
            let new_name = new_row.insertCell();
            let new_year = new_row.insertCell();
            let new_rating = new_row.insertCell();
            new_name.appendChild(document.createTextNode(movie.name));
            new_year.appendChild(document.createTextNode(movie.year));
            new_rating.appendChild(document.createTextNode(movie.rating));
        }
        //Render wish
        const wish_table = tables[1];
        old_tbody = document.getElementById("wish_table_body");
        new_tbody = document.createElement('tbody');
        new_tbody.setAttribute('id', 'wish_table_body');
        old_tbody.parentNode.replaceChild(new_tbody, old_tbody);   
        for (const movie of this.wish){
            let new_row = wish_table.getElementsByTagName('tbody')[0].insertRow();
            let new_name = new_row.insertCell();
            let new_year = new_row.insertCell();
            new_name.appendChild(document.createTextNode(movie.name));
            new_year.appendChild(document.createTextNode(movie.year));
        }

        //Render recom
        const recom_table = tables[2];
        old_tbody = document.getElementById("recom_table_body");
        new_tbody = document.createElement('tbody');
        new_tbody.setAttribute('id', 'recom_table_body');
        old_tbody.parentNode.replaceChild(new_tbody, old_tbody);   
        for (const movie of this.recom){
            let new_row = recom_table.getElementsByTagName('tbody')[0].insertRow();
            let new_name = new_row.insertCell();
            let new_year = new_row.insertCell();
            new_name.appendChild(document.createTextNode(movie.name));
            new_year.appendChild(document.createTextNode(movie.year));
        }

    }

    // Controsl for modifying watched list
    async addWatchList(name, year, rating) {
        const my_data = {name,year,rating};
        this.watched.push(my_data);
        await fetch(`/addWatched`, {
          method: 'POST',
          body: JSON.stringify(my_data),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        });
    }
    async delWatchList(name, year) {
        const my_data = {name: name,year: year,rating: undefined};
        //Removing from array
        let index = null;
        this.watched.forEach((elem, i)=> {
            if (elem.name === name && elem.year === year){
                index = i;
            }
        });
        this.watched.splice(index,1);;
        //Send fetch request
        await fetch(`/deleteWatched`, {
          method: 'DELETE',
          body: JSON.stringify(my_data),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        });
    }
    async updateWatchList(name, year, rating) {
        //Updating element in array
        const my_data = {name,year,rating};
        let index = null;
        this.watched.forEach((elem, i)=> {
            if (elem.name === name && elem.year === year){
                index = i;
            }
        });
        this.watched.splice(index,1);;
        this.watched.push(my_data);
        // Sending fetch request
        await fetch(`/updateWatched`, {
          method: 'POST',
          body: JSON.stringify(my_data),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        });
    }
    async readWatchList(){
        //Send fetch request
        const response = await fetch(`/readWatched`, {
          method: 'GET',
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        });
        const my_data = await response.json();
        return my_data;
    }

    // Controsl for modifying Wish list
    async addWishList(name, year, rating) {
        const my_data = {name,year,rating};
        this.wish.push(my_data);
        await fetch(`/addWish`, {
          method: 'POST',
          body: JSON.stringify(my_data),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        });
    }
    async delWishList(name, year) {
        const my_data = {name: name,year: year};
        //Removing from array
        let index = null;
        this.wish.forEach((elem, i)=> {
            if (elem.name === name && elem.year === year){
                index = i;
            }
        });
        this.wish.splice(index,1);;
        //Send fetch request
        await fetch(`/deleteWish`, {
          method: 'DELETE',
          body: JSON.stringify(my_data),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        });
    }
    async readWishList(){
        //Send fetch request
        const response = await fetch(`/readWish`, {
          method: 'GET',
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        });
        const my_data = await response.json();
        return my_data;
    }
    

  }
  
  export const movieBuddy = new MovieBuddy();