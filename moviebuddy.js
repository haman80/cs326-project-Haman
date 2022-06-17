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
  
    render(element) {
      element.innerHTML = '';
    }

    // Controsl for modifying watched list
    add_watched(movie){
        console.log(movie);
    }
    del_watched(movie){
        
    }
    up_watched(rating){

    }
    // Controsl for modifying wish list
    add_wish(movie){

    }
    del_wish(movie){
        
    }
    // Controsl for modifying recom list
    up_recom(movie){

    }

  }
  