var navLog = [];

//page obj
var $page = {
    current : '',
    header : '',
    content : '',
    footer : '',
    /**
     * 
     * @param {string} page asign current page elementes
     * @returns {void}
     */
    buildPage : function (page) {
        this.header = page + ' .doc-header';
        this.content = page + ' .doc-content';
        this.footer = page + ' .doc-footer';
    },
    /**
    * 
    * @param {string} id the id of the page to navigate to
    * @param {string} animation tween, fade and that stuff
    * @returns {void}
    */
    toPage : function (id, animation, back) {
        if ($page.current !== '') {
            $($page.current).hide();
            var navObj = {
                pageId : $page.current,
                tween : animation
            };
            if(!back) navLog.push(navObj);
        }
        $page.current = id;
        $page.buildPage($page.current);
        $($page.current).show();
        console.log(navLog);
        if ($page.current === '#home') navLog = [];
    },
    
    goBack : function () {
        if((navLog.length - 1) === -1) {
            navigator.notification.confirm(
                i18n.t('dialogs.exitDialogMsg'),
                function (index) {
                    if (index === 1) navigator.app.exitApp();
                    else return false;
                },
                i18n.t('dialogs.exitDialogTitle'),
                [i18n.t('dialogs.btnYes'),i18n.t('dialogs.btnNo')]
            );
        } else {
            var backTo = navLog[(navLog.length) - 1];
            navLog.pop();
            console.log(navLog);
            this.toPage(backTo.pageId, backTo.tween, true);
        }
        
    }
};


//---------------------------------------------------------------------

/**
 * main function after laguage has been loaded
 * @returns void
 */
function init() {
    $page.toPage('#home', '');
    
}

/**
 * set language based on device lang
 */
function setLanguage() {
    var nav_lang = navigator.language.split('-');
    var lang = nav_lang[0];
    
    i18n.init({ lng: lang, debug: true }, function() {
        $(".app").i18n();
        // some timeout for fake loading... lel
        setTimeout(function() {
            $('#start-page').hide();
            init();
        }, 2000);
  });
}
/**
 * get list of user exams stored on device
 */
function getUserExams() {
    
}
/**
 * creates json file exam and store localy;
 * @param {type} form the form submited $('bla')
 * @returns {undefined} null
 */
function createExamQA(form) {
    
    newTitle = newTitle.replace(/[^a-zA-Z0-9\s]/g,"");
    newTitle = newTitle.toLowerCase();
    newTitle = newTitle.replace(/\s/g,'-');
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
        document.addEventListener('backbutton', function (e) {
            e.preventDefault;
            $page.goBack();
        }, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        setLanguage();
        
    }
};
