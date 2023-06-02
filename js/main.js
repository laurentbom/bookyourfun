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

// rZ7SnyZ1AdbP0S

function test(){
  fetch(`${apiUrl}/events/rZ7SnyZ1AdbNCA?apikey=${apiKey}&locale=en`)
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
      segment: [],
      mobileNavClass : "",
      burgerNavClass : "",
      isMobile: false,
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
      language: localStorage.getItem('language') || 'fr',
      country: localStorage.getItem('country') || 'be',
      showButton: false,
      barWidth : 0,
    }
  },

  ///////////////////Responsive threshold & delay request API////////////////////////
  created() {
    // // Vérifie la résolution de l'écran et définit la propriété isMobile
    const mediaQuery = window.matchMedia('(max-width: 1300px)')
    this.isMobile = mediaQuery.matches

    // // Ajoute un écouteur pour mettre à jour isMobile si la résolution de l'écran change
    mediaQuery.addEventListener('change', () => {
      this.isMobile = mediaQuery.matches
    })
  },
  methods : {
    /////////////////Close navs & modal window/////////////////
    closeNav(){
      // this.genres = [];
      this.mobileNavClass = "";
      this.burgerNavClass = "";
      document.body.classList.remove('no-scroll');
      this.overlay = false;
      this.searchResults = [];
      this.searchQuery = [];
    },
    closeModal(){
      // this.modalAnimClass = "";
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
    ////////////////Get Homepage Datas////////////////////
    async getHomepageDatas(section, segment) {
      let url = `${apiUrl}/events?apikey=${apiKey}&classificationId=${segment}&countryCode=${this.country}&sort=random&locale=${this.language}`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Erreur lors de l\'appel de l\'API');
        }
        const data = await response.json();
        const filteredEvents = [];
    
        // Filtrer les événements avec des noms différents
        const eventNames = new Set(); // Utiliser un Set pour stocker les noms uniques
        for (const event of data._embedded.events) {
          const filteredImages = event.images.filter(image => image.width >= 1024);
          if (!eventNames.has(event.name) && filteredImages.length > 0) {
            event.filteredImage = filteredImages[0];
            filteredEvents.push(event);
            eventNames.add(event.name);
            event.filteredDate = this.formatDate(event.dates.start.localDate);
          }
          
          // Sortir de la boucle lorsque 4 événements ont été récupérés
          if (filteredEvents.length === 3) {
            break;
          }
        }
    
        if (section === "this.hpDatasMusic") {
          this.hpDatasMusic = filteredEvents;
        } 
        if (section === "this.hpDatasArt") {
          this.hpDatasArt = filteredEvents;
        } 
        if (section === "this.hpDatasSport") {
          this.hpDatasSport = filteredEvents;
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error); 
      }
    },
    async getHomepageDatas2(){
      fetch(`${apiUrl}/events?apikey=${apiKey}&countryCode=${this.country}&sort=date,asc&locale=${this.language}`)
      .then(response => response.json())
      .then(data => {
        let count = 0;
        const filteredEvents = [];
        const filteredEventsAside = [];
        const eventNames = new Set(); // Utiliser un Set pour stocker les noms uniques

        // Filtrer les événements avec des noms différents
        for (const event of data._embedded.events) {
          const filteredImages = event.images.filter(image => image.width >= 1024);
          if (!eventNames.has(event.name) && filteredImages.length > 0) {
            event.filteredImage = filteredImages[0];
            eventNames.add(event.name);
            if(count < 4){
              filteredEvents.push(event);
            }
            if (count >= 4) {
              filteredEventsAside.push(event);
            }
            count++;
          }

          if (count === 9) {
            break;
          }
        }
        this.hpDatasSuggest = filteredEventsAside;
        this.hpDatasUpcoming = filteredEvents;
        // console.log(this.hpDatasUpcoming)
        this.urlImgHeader = this.hpDatasUpcoming[0].filteredImage.url;
        this.titleHeader = this.hpDatasUpcoming[0].name;
        this.urlHeader = this.hpDatasUpcoming[0].url;
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des données :", error); 
      });

      //  Aside
      // fetch(`${apiUrl}/events?apikey=${apiKey}&classificationId=KZFzniwnSyZfZ7v7nn&countryCode=${this.country}&sort=random&size=5&locale=${this.language}`)
      // .then(response => response.json())
      // .then(data => {
      //   // console.log(data)
      //   const filteredEvents = [];
      //   const eventNames = new Set(); // Utiliser un Set pour stocker les noms uniques
      //   for (const event of data._embedded.events) {
      //     const filteredImages = event.images.filter(image => image.width >= 1024);
      //     if (!eventNames.has(event.name) && filteredImages.length > 0) {
      //       event.filteredImage = filteredImages[0];
      //       filteredEvents.push(event);
      //       eventNames.add(event.name);
      //     }
      //   }
      //   this.hpDatasSuggest = filteredEvents;
      //   // console.log(this.hpDatasSuggest)
      // })
      // .catch(error => {
      //   console.error("Erreur lors de la récupération des données :", error); 
      // });
    },
    /////////////////Datas form/////////////////
    // Date
    formatDate(date) {
      const dateParts = date.split('-');
      const day = dateParts[2];
      const month = dateParts[1];
      const year = dateParts[0];
      return `${day}-${month}-${year}`;
    },
    // Hour
    formatTime(time) {
      if (time !== undefined) {
        const partiesHeure = time.split(":");
        const heures = partiesHeure[0];
        const minutes = partiesHeure[1];
        return heures + "h" + minutes;
      }
      return "";
    },
    /////////////////Querie modal/////////////////
    modalLaunch(id){
      this.modalDatas = null;
      this.searchQuery = "";
      this.searchResults = [];

        fetch(`${apiUrl}/events/${id}?apikey=${apiKey}&locale=${this.language}`)
        .then(response => response.json())
        .then(data => {
          // console.log(data)
          this.modalDatas = data;
          // Date
          this.modalDatas.filteredDate = this.formatDate(this.modalDatas.dates.start.localDate);

          // Image
          const filteredImage = this.modalDatas.images.filter(image => image.width >= 1024);
          this.modalDatas.filteredImage = filteredImage[0];

          // Hour
          this.modalDatas.filteredTime = this.formatTime(this.modalDatas.dates.start.localTime);

          // Status
          if (this.language === 'fr') {
            // Traduire les statuts en français
            const statusTranslations = {
              "onsale": "En vente",
              "offsale": "Hors vente",
              "cancelled": "Annulé",
              "postponed": "Reporté",
              "rescheduled": "Reprogrammé"
            };
    
            this.modalDatas.dates.status.code = statusTranslations[this.modalDatas.dates.status.code] || this.modalDatas.dates.status.code;
          }
          this.overlay = true;
          document.body.classList.add('no-scroll');
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des données :", error); 
      });
    },
    ////////////////////////////////////
    subnavQuerie(id,typeQuerie){
      // this.genres = [];
      this.hpDatasQuerie = [];
      this.closeNav();
      let url = ""
      const filteredEvents = [];
      
      url = `https://app.ticketmaster.com/discovery/v2/events?apikey=${apiKey}&size=5&countryCode=${this.country}&classificationId=${id}&locale=${this.language}`;

      fetch(`${url}`)
        .then(response => response.json())
        .then(data => {
          // console.log(data);
          this.isQuerie = true;

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
            // Date
            event.filteredDate = this.formatDate(event.dates.start.localDate);
            // Hour
            event.filteredTime = this.formatTime(event.dates.start.localTime);
            filteredEvents.push(event);
          }
          
          this.hpDatasQuerie = filteredEvents;
          this.resultsNumber = data.page.totalElements;
          const querieSection = this.$refs.item;
          querieSection.scrollIntoView({behavior: 'smooth'});
          // console.log(this.hpDatasQuerie)
        })
        .catch(error => {
          console.error("Erreur lors de la récupération des donnéess :", error); 
          this.hpDatasQuerie = [];
          this.isQuerie = false;
        });
      
    },
    ////////////////Close & pagination Queries////////////////////
    closeQueries(){
      this.isQuerie = false;
    },
    queriePagination(prevOrNext){
      let url = "";
      const filteredEvents = [];
      if(prevOrNext === "next"){
        url = this.querieNextPage;
      } else {
        url = this.queriePrevPage;
      }
        fetch(`https://app.ticketmaster.com${url}&apikey=${apiKey}`)
        .then(response => response.json())
        .then(data => {
          // console.log(data);
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
            // Image
            const filteredImages = event.images.filter(image => image.width >= 1024);
            event.filteredImage = filteredImages[0];
            // Date
            event.filteredDate = this.formatDate(event.dates.start.localDate);
            // Hour
            if(event.dates.start.localTime){
              event.filteredTime = this.formatTime(event.dates.start.localTime);
            }
            filteredEvents.push(event);
          }
          
          this.hpDatasQuerie = filteredEvents;
          // console.log(this.hpDatasQuerie)
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
          fetch(`${apiUrl}/events?apikey=${apiKey}&keyword=${this.searchQuery}&includeSpellcheck=yes&countryCode=${this.country}&locale=${this.language}`)
            .then(response => response.json())
            .then(data => {
              // console.log(data)
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

      fetch(`${apiUrl}/events?apikey=${apiKey}&keyword=${this.searchQuery}&size=5&sort=date,asc&countryCode=${this.country}&locale=${this.language}`)
      .then(response => response.json())
      .then(data => {
        // console.log(data)
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
          // Image
          const filteredImages = event.images.filter(image => image.width >= 1024);
          event.filteredImage = filteredImages[0];
          // Date
          event.filteredDate = this.formatDate(event.dates.start.localDate);
          // Hour
          if(event.dates.start.localTime){
            event.filteredTime = this.formatTime(event.dates.start.localTime);
          }
          filteredEvents.push(event);
        }
        
        this.hpDatasQuerie = filteredEvents;
        this.resultsNumber = data.page.totalElements;

        // console.log(this.hpDatasQuerie)
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
        this.closeNav();
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
    },
    /////////////Change language////////////////
    changeLanguage() {
      this.hpDatasQuerie = [];
      this.isQuerie = false;
      if (this.language === 'fr' && this.country != "fr") {
        this.language = 'en'
        this.navLinks.forEach(link => {
          switch (link.name) {
            case "Musique":
              link.name = "Music";
              break;
            case "Arts et théâtre":
              link.name = "Arts and Theatre";
              break;
            case "Films":
              link.name = "Movies";
              break;
            case "Sports":
              link.name = "Sports";
              break;
            case "Divers":
              link.name = "Miscellaneous";
              break;
          }
        });
        this.fetchData();
      } else if (this.language === 'en') {
        this.language = 'fr'
        this.navLinks.forEach(link => {
          switch (link.name) {
            case "Music":
              link.name = "Musique";
              break;
            case "Arts and Theatre":
              link.name = "Arts et théâtre";
              break;
            case "Movies":
              link.name = "Films";
              break;
            case "Sports":
              link.name = "Sports";
              break;
            case "Miscellaneous":
              link.name = "Divers";
              break;
          }
        });
        this.fetchData();
      }
    },
    /////////////Change Country////////////////
    changeCountry(pays){
      this.closeNav();
      this.hpDatasQuerie = [];
      this.isQuerie = false;
      this.country = pays;
      if(this.country === "fr"){
        this.language = "fr";
        this.navLinks.forEach(link => {
          switch (link.name) {
            case "Music":
              link.name = "Musique";
              break;
            case "Arts and Theatre":
              link.name = "Arts et théâtre";
              break;
            case "Movies":
              link.name = "Films";
              break;
            case "Sports":
              link.name = "Sports";
              break;
            case "Miscellaneous":
              link.name = "Divers";
              break;
          }
        });
      }
      this.fetchData();
    },
    /////////////get datas on launch////////////////
    async fetchData(){
      try {
        const response1 = await this.getHomepageDatas2();
        await this.delay(500);
        const response2 = await this.getHomepageDatas("this.hpDatasMusic", idSegmentMusic);
        await this.delay(1000);
        const response3 = await this.getHomepageDatas("this.hpDatasArt", idSegmentArt);
        await this.delay(1500);
        const response4 = await this.getHomepageDatas("this.hpDatasSport", idSegmentSport);
      } catch (error) {
        // Gérez les erreurs ici
      }
    },
    async delay(ms){
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    // Scroll bar
    updateScrollBarWidth() {
      const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      this.barWidth = scrollPercentage;
    },
  },
  mounted(){
    const storedLanguage = localStorage.getItem('language');
    const storedCountry = localStorage.getItem('country');
    if(storedCountry){
      this.country = storedCountry;
    }
    if (storedLanguage) {
      this.language = storedLanguage;

      // Mettre à jour les noms dans navLinks en fonction de la langue
      switch (storedLanguage) {
        case 'fr':
          // Utilisez les noms par défaut
          break;
        case 'en':
          // Mettez à jour les noms en anglais
          this.navLinks.forEach(link => {
            switch (link.name) {
              case "Musique":
                link.name = "Music";
                break;
              case "Arts et théâtre":
                link.name = "Arts and Theatre";
                break;
              case "Films":
                link.name = "Movies";
                break;
              case "Sports":
                link.name = "Sports";
                break;
              case "Divers":
                link.name = "Miscellaneous";
                break;
              // Ajoutez d'autres cas pour les autres noms
            }
          });
          break;
      }
    }

    window.addEventListener("scroll", this.handleScroll);
    this.fetchData();
    // Disable overlay when mobile menu open and resize
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
    window.addEventListener('scroll', this.updateScrollBarWidth);
  },
  watch: {
    isQuerie(value) {
      if (value) {
        this.$nextTick(() => {
          const querieSection = this.$refs.item;
          querieSection.scrollIntoView({ behavior: 'smooth' });
        });
      }
    },
    language(newLanguage) {
      localStorage.setItem('language', newLanguage); 
    },
    country(newCountry) {
      localStorage.setItem('country', newCountry); 
    },
  },
  // beforeDestroy() {
  //   // Nettoie la valeur de 'language' dans le localStorage lorsque le composant est détruit
  //   localStorage.removeItem('language');
  // }
}).mount("#byfApp")