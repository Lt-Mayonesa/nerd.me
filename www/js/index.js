/**
 * set language based on device lang
 */
function setLanguage() {
    var nav_lang = navigator.language.split('-');
    var lang = nav_lang[0];
    console.log(lang);
    
    i18n.init({ lng: lang, debug: true }, function() {
        $(".app").i18n();
        // some timeout for fake loading... lel
        setTimeout(function() {
            $('#start-page').hide();
        }, 1000);
  });
}
/**
 * get list of user exams stored on device
 */
function getUserExams() {
    
}

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        setLanguage();
    }
};
