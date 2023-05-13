const apiUrl = "https://app.ticketmaster.com/discovery/v2"
const apiKey = "7lJGVPGW3rX8GgR7sYZnrgDpbWTFFfQA";

const idSegmentMusic = "KZFzniwnSyZfZ7v7nJ";
const idSegmentSport = "KZFzniwnSyZfZ7v7nE";
const idSegmentArt = "KZFzniwnSyZfZ7v7na";
const idSegmentAttractions = "KZFzniwnSyZfZ7v7n1";
const idSegmentFilms = "KZFzniwnSyZfZ7v7nn";

function monApi2(idSegments){
  fetch(`${apiUrl}/classifications?apikey=${apiKey}?countryCode=be`)
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error("Erreur lors de la récupération des données :", error); 
  });
}


monApi2();

const {createApp} = Vue;

createApp({
  data(){
    return{
      genres: [],
      segment: [],
      mobileNavClass : "",
      burgerNavClass : "",
      isMobile: false,
    }
  },
  created() {
    // Vérifie la résolution de l'écran et définit la propriété isMobile
    const mediaQuery = window.matchMedia('(max-width: 1300px)')
    this.isMobile = mediaQuery.matches

    // Ajoute un écouteur pour mettre à jour isMobile si la résolution de l'écran change
    mediaQuery.addEventListener('change', () => {
      this.isMobile = mediaQuery.matches
    })
  },
  methods : {
    getGenres(idSegments){
      fetch(`${apiUrl}/classifications/segments/${idSegments}?apikey=${apiKey}`)
      .then(response => response.json())
      .then(data => {
        console.log(data.name);
        this.genres = [];
        this.segment = [];
        for(i=0; i < 21; i++){
          let genre = data._embedded.genres[i];
          if(genre && genre.name && genre.id && genre.name != "Undefined"){
            this.genres.push({name: genre.name, id: genre.id});
          }
        };
        if(data.name && data.id){
          this.segment.push({name: data.name, id: data.id});
        }
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des données :", error); 
      });
      if(this.isMobile){
        this.mobileNavClass = "";
        this.burgerNavClass = "";
      }
    },
    closeNav(){
      this.genres = [];
    },
    openMobileMenu(){
      if(this.mobileNavClass == "openMobile"){
        this.mobileNavClass = "";
        this.burgerNavClass = "";
      } else {
        this.mobileNavClass = "openMobile";
        this.burgerNavClass = "open";
      }
    },
    listAppLaunch(){
      this.genres = [];
    }
  },
  mounted(){
    // this.getGenres();
  }
}).mount("#byfApp")