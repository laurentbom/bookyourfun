//////////////////////////////////////////////////////
// BookYourFun - Student work with ticketmaster API
// Laurent Bomal 2023
// Vue.js
// 
// - Responsive Treshold
// - Get segments & genres for main nav
// - Mobile menu
// - Get segments & genres for footer nav
//////////////////////////////////////////////////////

const apiUrl = "https://app.ticketmaster.com/discovery/v2"
const apiKey = "7lJGVPGW3rX8GgR7sYZnrgDpbWTFFfQA";

const idSegmentMusic = "KZFzniwnSyZfZ7v7nJ";
const idSegmentSport = "KZFzniwnSyZfZ7v7nE";
const idSegmentArt = "KZFzniwnSyZfZ7v7na";
const idSegmentAttractions = "KZFzniwnSyZfZ7v7n1";
const idSegmentFilms = "KZFzniwnSyZfZ7v7nn";


function monApi2(idSegments){
  fetch(`${apiUrl}/classifications?apikey=${apiKey}&countryCode=be`)
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error("Erreur lors de la récupération des données :", error); 
  });
}


// monApi2();

////////////////////App Vue////////////////////////
const {createApp} = Vue;

createApp({
  data(){
    return{
      navLinks : [
        {
          name : "Music",
          id : idSegmentMusic,
        },
        {
          name : "Arts and Theater",
          id : idSegmentArt,
        },
        {
          name : "Films",
          id : idSegmentFilms,
        },
        {
          name : "Sports",
          id : idSegmentSport,
        },
        {
          name : "Miscellaneous",
          id : idSegmentAttractions,
        }
      ],
      genres: [],
      genresFooter: [],
      genresFooterDesktop: [],
      segment: [],
      mobileNavClass : "",
      burgerNavClass : "",
      isMobile: false,
      navIsHover: {},
      showDropdown: false,
      activeLinkId: "",
      isQuerie: true,
    }
  },

  ///////////////////Responsive threshold////////////////////////
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

    ////////////////Get segments & genres for main nav////////////////////
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
      // if(this.isMobile){
      //   this.mobileNavClass = "";
      //   this.burgerNavClass = "";
      // }
    },
    /////////////////Close navs/////////////////
    closeNav(){
      this.genres = [];
      this.mobileNavClass = "";
      this.burgerNavClass = "";
      document.body.classList.remove('no-scroll');
    },
    /////////////////Mobile menu/////////////////
    openMobileMenu(){
      if(this.mobileNavClass == "openMobile"){
        this.mobileNavClass = "";
        this.burgerNavClass = "";
        document.body.classList.remove('no-scroll');
      } else {
        this.mobileNavClass = "openMobile";
        this.burgerNavClass = "open";
        document.body.classList.add('no-scroll');
      }
    },
    listAppLaunch(){
      this.genres = [];
    },
    ////////////////Get segments & genres for footer nav////////////////////
    getGenresFooterMobile(idSegments) {
      // Si le lien cliqué est le même que la navLink active, on ferme tous les sous-menus
      if (this.activeLinkId === idSegments) {
        this.showDropdown = false;
        this.activeLinkId = "";
      }
      // Sinon on met à jour l'activeLink
      else {
        this.showDropdown = true;
        this.activeLinkId = idSegments;
      }

      fetch(`${apiUrl}/classifications/segments/${idSegments}?apikey=${apiKey}`)
      .then(response => response.json())
      .then(data => {
        console.log(data.name);
        this.genresFooter = [];
        for(i=0; i < 6; i++){
          let genreFooter = data._embedded.genres[i];
          if(genreFooter && genreFooter.name && genreFooter.id && genreFooter.name != "Undefined"){
            this.genresFooter.push({name: genreFooter.name, id: genreFooter.id});
          }
        };
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des données :", error); 
      });
    },
    ////////////////Get segments & genres for footer nav////////////////////
    getGenresFooterDesktop(idSegments) {
      fetch(`${apiUrl}/classifications/segments/${idSegments}?apikey=${apiKey}&locale=fr`)
      .then(response => response.json())
      .then(data => {
        this.genresFooterDesktop = [];
        for(i=0; i < 20; i++){
          let genreFooterDesktop = data._embedded.genres[i];
          if(genreFooterDesktop && genreFooterDesktop.name && genreFooterDesktop.id && genreFooterDesktop.name != "Undefined"){
            this.genresFooterDesktop.push({name: genreFooterDesktop.name, id: genreFooterDesktop.id});
          }
        };
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des données :", error); 
      });
    },
    closeQueries(){
      this.isQuerie = false;
      console.log(isQuerie)
    },
  },
  mounted(){
    this.getGenresFooterDesktop(idSegmentSport);
  },
}).mount("#byfApp")