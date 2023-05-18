//////////////////////////////////////////////////////
// BookYourFun - Student work with ticketmaster API
// Laurent Bomal 2023
// Vue.js
// 
// - Responsive Treshold & delay request API
// - Get segments & genres for main nav
// - Mobile menu
// - Get segments & genres for footer nav Desktop
// - Get segments & genres for footer nav Mobile
// - Get Homepage Data
// 
//////////////////////////////////////////////////////

const apiUrl = "https://app.ticketmaster.com/discovery/v2"
const apiKey = "7lJGVPGW3rX8GgR7sYZnrgDpbWTFFfQA";

const idSegmentMusic = "KZFzniwnSyZfZ7v7nJ";
const idSegmentSport = "KZFzniwnSyZfZ7v7nE";
const idSegmentArt = "KZFzniwnSyZfZ7v7na";
const idSegmentAttractions = "KZFzniwnSyZfZ7v7n1";
const idSegmentFilms = "KZFzniwnSyZfZ7v7nn";

////////////////////App Vue////////////////////////
const {createApp} = Vue;

createApp({
  data(){
    return{
      navLinks : [
        {
          name : "Musique",
          id : idSegmentMusic,
        },
        {
          name : "Arts et théâtre",
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
          name : "Divers",
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
      isQuerie: false,
      hpDatasUpcoming: [],
      hpDatasMusic: [],
      hpDatasArt: [],
      hpDatasSport: [],
      hpDatasSuggest: [],
      urlImgHeader: "",
      titleHeader: "",
      searchQuery: "",
      searchResults: [],
      searchAllResults: [],
    }
  },

  ///////////////////Responsive threshold & delay request API////////////////////////
  created() {
    // Vérifie la résolution de l'écran et définit la propriété isMobile
    const mediaQuery = window.matchMedia('(max-width: 1300px)')
    this.isMobile = mediaQuery.matches

    // Ajoute un écouteur pour mettre à jour isMobile si la résolution de l'écran change
    mediaQuery.addEventListener('change', () => {
      this.isMobile = mediaQuery.matches
    })
    setTimeout(() => {
      this.getGenresFooterDesktop(idSegmentMusic);
    }, 3000);

    setTimeout(() => {
    this.getHomepageDatas("this.hpDatasMusic", idSegmentMusic, 'be', 'fr');
    }, 1000);
  
    setTimeout(() => {
      this.getHomepageDatas("this.hpDatasArt", idSegmentArt, 'be', 'fr');
    }, 1500);
  
    setTimeout(() => {
      this.getHomepageDatas("this.hpDatasSport", idSegmentSport, 'be', 'fr');
    }, 2000);
  
    // setTimeout(() => {
      this.getHomepageDatas2('be', 'fr');
    // }, 500);
  },
  methods : {
    ////////////////Get segments & genres for main nav////////////////////
    getGenres(idSegments){
      fetch(`${apiUrl}/classifications/segments/${idSegments}?apikey=${apiKey}&locale=fr`)
      .then(response => response.json())
      .then(data => {
        // console.log(data);
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
    },
    /////////////////Close navs/////////////////
    closeNav(){
      this.genres = [];
      this.mobileNavClass = "";
      this.burgerNavClass = "";
      document.body.classList.remove('no-scroll');
      this.searchResults = [];
      this.searchQuery = [];
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
      this.isQuerie = true;
    },
    ////////////////Get segments & genres for footer nav Desktop////////////////////
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

      fetch(`${apiUrl}/classifications/segments/${idSegments}?apikey=${apiKey}&locale=fr`)
      .then(response => response.json())
      .then(data => {
        // console.log(data);
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
    ////////////////Get segments & genres for footer nav Mobile////////////////////
    getGenresFooterDesktop(idSegments) {
      fetch(`${apiUrl}/classifications/segments/${idSegments}?apikey=${apiKey}&locale=fr`)
      .then(response => response.json())
      .then(data => {
        this.genresFooterDesktop = [];
        for(i=0; i < 19; i++){
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
    ////////////////Close Queries////////////////////
    closeQueries(){
      this.isQuerie = false;
    },
    ////////////////Get Homepage Datas////////////////////
    getHomepageDatas(section,segment,pays,langue){
      fetch(`${apiUrl}/events?apikey=${apiKey}&classificationId=${segment}&countryCode=${pays}&sort=random&locale=${langue}`)
      .then(response => response.json())
      .then(data => {
        // console.log(data)
        const filteredEvents = [];

        // Filtrer les événements avec des noms différents
        const eventNames = new Set(); // Utiliser un Set pour stocker les noms uniques
        for (const event of data._embedded.events) {
          if (!eventNames.has(event.name)) {
            filteredEvents.push(event);
            eventNames.add(event.name);
          }
          // Sortir de la boucle lorsque 4 événements ont été récupérés
          if (filteredEvents.length === 3) {
            break;
          }
        }

        if(section == "this.hpDatasMusic"){
          this.hpDatasMusic = filteredEvents;
          // console.log(this.hpDatasMusic);
        } 
        if(section == "this.hpDatasArt"){
          this.hpDatasArt = filteredEvents;
          // console.log(this.hpDatasArt);
        } 
        if(section == "this.hpDatasSport"){
          this.hpDatasSport = filteredEvents;
          // console.log(this.hpDatasSport);
        }
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des données :", error); 
      });
    },
    getHomepageDatas2(pays,langue){
      fetch(`${apiUrl}/events?apikey=${apiKey}&countryCode=${pays}&sort=date,asc&locale=${langue}`)
      .then(response => response.json())
      .then(data => {
        // console.log(data)
        const filteredEvents = [];

        // Filtrer les événements avec des noms différents
        const eventNames = new Set(); // Utiliser un Set pour stocker les noms uniques
        for (const event of data._embedded.events) {
          if (!eventNames.has(event.name)) {
            filteredEvents.push(event);
            eventNames.add(event.name);
          }

          // Sortir de la boucle lorsque 4 événements ont été récupérés
          if (filteredEvents.length === 4) {
            break;
          }
        }
        this.hpDatasUpcoming = filteredEvents; // Stocker les événements filtrés dans le tableau Vue
        // console.log(this.hpDatasUpcoming[0].images[5].url);
        this.urlImgHeader = this.hpDatasUpcoming[0].images[5].url;
        this.titleHeader = this.hpDatasUpcoming[0].name;
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des données :", error); 
      });
      fetch(`${apiUrl}/suggest?apikey=${apiKey}&resource=events&countryCode=${pays}&locale=${langue}`)
      .then(response => response.json())
      .then(data => {
        this.hpDatasSuggest = data._embedded.events;
        // console.log(this.hpDatasSuggest)
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des données :", error); 
      });
    },
    ////////////////Search suggestions////////////////////
    performSearch() {
      clearTimeout(this.debounceTimer); // Annuler le délai précédent

      if (this.searchQuery.length >= 2) {
        // Définir un nouveau délai de 300 millisecondes avant d'effectuer la requête API
        this.debounceTimer = setTimeout(() => {
          fetch(`${apiUrl}/events?apikey=${apiKey}&keyword=${this.searchQuery}&includeSpellcheck=yes&countryCode=be&locale=fr`)
            .then(response => response.json())
            .then(data => {
              if (data._embedded.events != undefined) {
                this.searchAllResults = data._embedded.events;

                // Filtrer les événements par nom unique
                const uniqueNames = new Set();
                this.searchResults = this.searchAllResults.filter(event => {
                  const lowercaseName = event.name.toLowerCase();
                  if (!uniqueNames.has(lowercaseName)) {
                    uniqueNames.add(lowercaseName);
                    return true;
                  }
                  return false;
                });
              }
            })
            .catch(error => {
              console.error('Erreur lors de la recherche:', error);
              this.searchResults = []; // Réinitialiser les résultats en cas d'erreur
            });
        }, 400); // Délai de latence de 300 millisecondes
      } else {
        this.searchResults = []; // Réinitialiser les résultats si la requête est trop courte
      }
    }
  },
  mounted(){
  },
}).mount("#byfApp")