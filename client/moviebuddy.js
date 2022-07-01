class MovieBuddy {
    constructor() {
      this.user = null;
      this.watched = [];
      this.wish = [];
      this.recom = [];
      
    }
    async restore(){
      this.user = await this.getCurrentUser();
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
        const my_data = {name,year,rating, userID: this.user};
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
        const my_data = {name: name,year: year,rating: undefined,userID: this.user};
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
        const my_data = {name,year,rating, userID: this.user};
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
          }
        });
        const my_data = await response.json();
        return my_data;
    }

    // Controsl for modifying Wish list
    async addWishList(name, year, rating) {
        const my_data = {name,year,rating,userID: this.user};
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
        const my_data = {name: name,year: year, userID: this.user};
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
    async recomlist(movie_id){
      const id = movie_id.toString();
      const my_url = `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=7495dc507c163252ad3dd25d443d4f0d&language=en-US&page=1`;
      const response = await fetch(my_url);
      const data = await response.json();
      let final_list = [];
      data.results.forEach((elem)=>{
        final_list.push({name:elem.original_title, year: elem.release_date.split("-")[0]});
      });
      console.log(final_list);
      return final_list;
    }
    async get_movie_id(movie){
      const name = movie.name;
      const my_url = `https://api.themoviedb.org/3/search/movie?api_key=7495dc507c163252ad3dd25d443d4f0d&query=${name}&page=1`;
      const response = await fetch(my_url);
      const data = await response.json();
      return data.results[0].id;
    }
    async update_recom(){
      if (this.watched.length>0){
        const randomMovie = this.watched[Math.floor(Math.random() * this.watched.length)];
        const id = await this.get_movie_id(randomMovie);
        //Modify this.recom
        this.recom = await recomlist(id);
      }
    }
    async getCurrentUser(){
      const response = await fetch(`/getUser`, {
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