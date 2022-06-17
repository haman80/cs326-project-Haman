export class MovieBuddy {
    constructor() {
      // Initialize the bag.
      this.watched = [];
      this.wish = [];
      this.recom = [];
    }
   
    _saveState() {
    }
  
    _restoreState() {

    }
    _clearState() {
      
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
    add_watched(movie){
        const info = movie.split(",");
        this.watched.push({name:info[0] , year:info[1] , rating:info[2] });
        console.log(this.watched);
    }
    del_watched(name){
        this.watched = this.watched.filter((elem) => {
            if (elem.name==name){ return false;}
            else{ return true;}
        })
    }
    up_watched(movie){
        const info = movie.split(",");
        this.watched.forEach((elem) => {
            if (elem.name==info[0]){ 
                elem.rating = info[1];
            }
        });
  
    }
    // Controsl for modifying wish list
    add_wish(movie){
        const info = movie.split(",");
        this.wish.push({name:info[0] , year:info[1] , rating:undefined });
    }
    del_wish(name){
        this.wish = this.wish.filter((elem) => {
            if (elem.name==name){ return false;}
            else{ return true;}
        })
    }
    // Controsl for modifying recom list
    up_recom(){

    }

  }
  