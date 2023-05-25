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

// Z698xZG2Zau1t


function test(){
  fetch(`https://app.ticketmaster.com/discovery/v2/events?locale=fr-be&page=1&size=20&apikey=${apiKey}`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des données :", error); 
      });
}
// test()

////////////////////App Vue////////////////////////
const {createApp} = Vue;
createApp({
  data(){
    return{
      navLinks : [
        { name: "Musique", id: idSegmentMusic },
        { name: "Arts et théâtre", id: idSegmentArt },
        { name: "Films", id: idSegmentFilms },
        { name: "Sports", id: idSegmentSport },
        { name: "Divers", id: idSegmentAttractions }
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
      querieNextPage: "",
      queriePrevPage: "",
      showPaginationNext: false,
      showPaginationPrev: false,
      resultsNumber: "",
      hpDatasQuerie: [],
      hpDatasUpcoming: [],
      hpDatasMusic: [],
      hpDatasArt: [],
      hpDatasSport: [],
      hpDatasSuggest: [],
      urlImgHeader: "",
      titleHeader: "",
      urlHeader: "",
      searchQuery: "",
      searchResults: [],
      searchAllResults: [],
      modalOpen : false,
      modalDatas : null,
      overlay : false,
      language: "fr",
      showButton: false,
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
    /////////////////Close navs & modal window/////////////////
    closeNav(){
      this.genres = [];
      this.mobileNavClass = "";
      this.burgerNavClass = "";
      document.body.classList.remove('no-scroll');
      this.searchResults = [];
      this.searchQuery = [];
    },
    closeModal(){
      this.modalAnimClass = "";
      this.modalOpen = false;
      this.modalDatas = null;
      this.overlay = false;
      document.body.classList.remove('no-scroll');
    },
    /////////////////Mobile menu/////////////////
    openMobileMenu(){
      if(this.mobileNavClass == "openMobile"){
        this.mobileNavClass = "";
        this.burgerNavClass = "";
        this.overlay = false;
        document.body.classList.remove('no-scroll');
      } else {
        this.mobileNavClass = "openMobile";
        this.burgerNavClass = "open";
        document.body.classList.add('no-scroll');
        this.modalDatas = null;
        this.overlay = true;
      }
    },
    /////////////////Querie demand sub nav/////////////////
    listAppLaunch(){
      this.genres = [];
      this.isQuerie = true;
      const querieSection = this.$refs.item;
      querieSection.scrollIntoView({behavior: 'smooth'});

      
    },
    /////////////////Querie demand modal/////////////////
    modalLaunch(id,type){
      this.overlay = true;
      this.modalDatas = null;
      document.body.classList.add('no-scroll');
      this.searchQuery = "";
      this.searchResults = [];

        fetch(`${apiUrl}/events/${id}?apikey=${apiKey}&locale=fr`)
        .then(response => response.json())
        .then(data => {
          this.modalDatas = data;

          // Date
          const dateParts = this.modalDatas.dates.start.localDate.split('-');
          const day = dateParts[2];
          const month = dateParts[1];
          const year = dateParts[0];
          this.modalDatas.filteredDate = `${day}-${month}-${year}`;

          // Image
          const filteredImage = this.modalDatas.images.filter(image => image.width >= 1024);
          this.modalDatas.filteredImage = filteredImage[0];

          // Hour
          if(this.modalDatas.dates.start.localTime != undefined){
            var heureAPI = this.modalDatas.dates.start.localTime; 
            var partiesHeure = heureAPI.split(":");
            var heures = partiesHeure[0];
            var minutes = partiesHeure[1];
            var heureFormattee = heures + "h" + minutes;
            this.modalDatas.filteredTime = heureFormattee;
          }

          // Status
          if (this.language === 'fr') {
            // Traduire les statuts en français
            const statusTranslations = {
              "onsale": "En vente",
              "offsale": "Hors vente",
              "canceled": "Annulé",
              "postponed": "Reporté",
              "rescheduled": "Reprogrammé"
            };
    
            this.modalDatas.dates.status.code = statusTranslations[this.modalDatas.dates.status.code] || this.modalDatas.dates.status.code;
          }

      })
      .catch(error => {
        console.error("Erreur lors de la récupération des données :", error); 
      });
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
    ////////////////Get segments & genres for footer nav Mobile////////////////////
    subnavQuerie(){

    },
    ////////////////Close Queries////////////////////
    closeQueries(){
      this.isQuerie = false;
    },
    queriePagination(prevOrNext){
      
      const filteredEvents = [];
      if(prevOrNext === "next"){
        fetch(`https://app.ticketmaster.com${this.querieNextPage}&apikey=${apiKey}`)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          if(data._links.next && data._links.next.href !== undefined){
            this.querieNextPage = data._links.next.href;
            this.showPaginationNext = true
          } else {
            this.showPaginationNext = false
            this.querieNextPage = "";
          }
          if(data._links.prev && data._links.prev.href !== undefined){
            this.queriePrevPage = data._links.prev.href;
            this.showPaginationPrev = true
            } else{
              this.showPaginationPrev = false
              this.queriePrevPage = "";
            }
  
          for (const event of data._embedded.events) {
            const filteredImages = event.images.filter(image => image.width >= 1024);
            event.filteredImage = filteredImages[0];
            const dateParts = event.dates.start.localDate.split('-');
            const day = dateParts[2];
            const month = dateParts[1];
            const year = dateParts[0];
            event.filteredDate = `${day}-${month}-${year}`;

            // Hour
            if(event.dates.start.localTime){
              var heureAPI = event.dates.start.localTime; 
              var partiesHeure = heureAPI.split(":");
              var heures = partiesHeure[0];
              var minutes = partiesHeure[1];
              var heureFormattee = heures + "h" + minutes;
              event.filteredTime = heureFormattee;
            }
            filteredEvents.push(event);
          }
          
          this.hpDatasQuerie = filteredEvents;
          // console.log(this.hpDatasQuerie)
          })
          .catch(error => {
            console.error("Erreur lors de la récupération des données :", error); 
          });
      } else {
        fetch(`https://app.ticketmaster.com${this.queriePrevPage}&apikey=${apiKey}`)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          if(data._links.next && data._links.next.href !== undefined){
            this.querieNextPage = data._links.next.href;
            this.showPaginationNext = true
          } else {
            this.showPaginationNext = false
            this.querieNextPage = "";
          }
          if(data._links.prev && data._links.prev.href !== undefined){
            this.queriePrevPage = data._links.prev.href;
            this.showPaginationPrev = true
            } else{
              this.showPaginationPrev = false
              this.queriePrevPage = "";
            }
  
          for (const event of data._embedded.events) {
            const filteredImages = event.images.filter(image => image.width >= 1024);
            event.filteredImage = filteredImages[0];
            const dateParts = event.dates.start.localDate.split('-');
            const day = dateParts[2];
            const month = dateParts[1];
            const year = dateParts[0];
            event.filteredDate = `${day}-${month}-${year}`;

            // Hour
            if(event.dates.start.localTime){
              var heureAPI = event.dates.start.localTime; 
              var partiesHeure = heureAPI.split(":");
              var heures = partiesHeure[0];
              var minutes = partiesHeure[1];
              var heureFormattee = heures + "h" + minutes;
              event.filteredTime = heureFormattee;
            }
            filteredEvents.push(event);
          }
          
          this.hpDatasQuerie = filteredEvents;
          console.log(this.hpDatasQuerie)
          })
          .catch(error => {
            console.error("Erreur lors de la récupération des données :", error); 
          });
      }
      
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
          const filteredImages = event.images.filter(image => image.width >= 1024);
          if (!eventNames.has(event.name) && filteredImages.length > 0) {
            event.filteredImage = filteredImages[0];
            filteredEvents.push(event);
            eventNames.add(event.name);
            const dateParts = event.dates.start.localDate.split('-');
            const day = dateParts[2];
            const month = dateParts[1];
            const year = dateParts[0];
            event.filteredDate = `${day}-${month}-${year}`;
          }
          
          // Sortir de la boucle lorsque 4 événements ont été récupérés
          if (filteredEvents.length === 3) {
            break;
          }
        }

        if(section == "this.hpDatasMusic"){
          this.hpDatasMusic = filteredEvents;
        } 
        if(section == "this.hpDatasArt"){
          this.hpDatasArt = filteredEvents;
        } 
        if(section == "this.hpDatasSport"){
          this.hpDatasSport = filteredEvents;
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
          const filteredImages = event.images.filter(image => image.width >= 1024);
          if (!eventNames.has(event.name) && filteredImages.length > 0) {
            event.filteredImage = filteredImages[0];
            filteredEvents.push(event);
            eventNames.add(event.name);
          }

          // Sortir de la boucle lorsque 4 événements ont été récupérés
          if (filteredEvents.length === 4) {
            break;
          }
        }
        this.hpDatasUpcoming = filteredEvents;
        // console.log(this.hpDatasUpcoming)
        this.urlImgHeader = this.hpDatasUpcoming[0].filteredImage.url;
        this.titleHeader = this.hpDatasUpcoming[0].name;
        this.urlHeader = this.hpDatasUpcoming[0].url;
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des données :", error); 
      });

      //  Films
      fetch(`${apiUrl}/events?apikey=${apiKey}&classificationId=KZFzniwnSyZfZ7v7nn&countryCode=${pays}&sort=random&size=5&locale=${langue}`)
      .then(response => response.json())
      .then(data => {
        // console.log(data)
        const filteredEvents = [];
        const eventNames = new Set(); // Utiliser un Set pour stocker les noms uniques
        for (const event of data._embedded.events) {
          const filteredImages = event.images.filter(image => image.width >= 1024);
          if (!eventNames.has(event.name) && filteredImages.length > 0) {
            event.filteredImage = filteredImages[0];
            filteredEvents.push(event);
            eventNames.add(event.name);
          }
        }
        this.hpDatasSuggest = filteredEvents;
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
              console.log(data)
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
    },
    ////////////////Search ////////////////////
    searchWord(){
      const querieSection = this.$refs.item;
      querieSection.scrollIntoView({behavior: 'smooth'});
      this.isQuerie = true;
      this.searchResults = [];
      this.hpDatasQuerie = [];

      const filteredEvents = [];
      fetch(`${apiUrl}/events?apikey=${apiKey}&keyword=${this.searchQuery}&size=5&locale=fr-be`)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        if(data._links.next && data._links.next.href !== undefined){
          this.querieNextPage = data._links.next.href;
          this.showPaginationNext = true
        } else {
          this.showPaginationNext = false
        }
        if(data._links.prev && data._links.prev.href !== undefined){
          this.queriePrevPage = data._links.prev.href;
          this.showPaginationPrev = true
          } else{
            this.showPaginationPrev = false
          }

        for (const event of data._embedded.events) {
          const filteredImages = event.images.filter(image => image.width >= 1024);
          event.filteredImage = filteredImages[0];
          const dateParts = event.dates.start.localDate.split('-');
          const day = dateParts[2];
          const month = dateParts[1];
          const year = dateParts[0];
          event.filteredDate = `${day}-${month}-${year}`;

          // Hour
          if(event.dates.start.localTime){
            var heureAPI = event.dates.start.localTime; 
            var partiesHeure = heureAPI.split(":");
            var heures = partiesHeure[0];
            var minutes = partiesHeure[1];
            var heureFormattee = heures + "h" + minutes;
            event.filteredTime = heureFormattee;
          }
          filteredEvents.push(event);
        }
        
        this.hpDatasQuerie = filteredEvents;
        this.resultsNumber = data.page.totalElements;

        console.log(this.hpDatasQuerie)
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des données :", error); 
      });
      this.searchResults = [];
      this.searchQuery = "";
      
    },
    /////////////Disable overlay when mobile menu open and resize////////////////
    handleResize(){
      if(this.isMobile && !this.modalDatas){
        this.overlay= false;
        document.body.classList.remove('no-scroll');
      }
    },
    /////////////To the top button////////////////
    handleScroll() {
      const scrollPosition = window.scrollY || window.pageYOffset;
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const scrollThreshold = windowHeight * 0.3; // 30% of window height

      this.showButton = scrollPosition > scrollThreshold;
    },
    toTheTop(){
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  },
  mounted(){
    window.addEventListener("scroll", this.handleScroll);
    // Timeout because of limit of 5 calls/sec of API
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
    // }, 400);

    // Disable overlay when mobile menu open and resize
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },
  watch: {
    isQuerie(value) {
      if (value) {
        this.$nextTick(() => {
          const querieSection = this.$refs.item;
          querieSection.scrollIntoView({ behavior: 'smooth' });
        });
      }
    }
  }
}).mount("#byfApp")