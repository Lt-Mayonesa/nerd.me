var navLog = [];
var examsDir;
var $user = {
    name: 'user',
    id: '',
    email: '',
    exams: []
}
var Exam = function(title) {
    this.title = title;
}

var examQA = {
    title : '',
    total : 0,
    questions : [],
    answers : []
}

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

function loading(show) {
    console.log('loading: ' + show);
}

function fileSystemFail(error) {
    console.log(error);
    navigator.notification.alert('error');
}

/**
 * get list of user exams stored on device
 */
function getUserExams() {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
        examsDir = fileSystem.root.getDirectory('exams', {create: true}, function (dirEntry) {
            var dirReader = dirEntry.createReader();
            dirReader.readEntries(function (data) {
                $user.exams = data;
                console.log('Exams: ' + $user.exams);
            }, fileSystemFail);
        }, fileSystemFail);
    }, fileSystemFail);
}
/**
 * creates json file exam and store localy;
 * @param {type} form the form submited $('bla')
 * @returns {undefined} null
 */
function createExamQA(jsonString) {
    console.log(jsonString);
    var examun = JSON.parse(jsonString);
    var newTitle = examun.title;
    newTitle = newTitle.replace(/[^a-zA-Z0-9\s]/g,"");
    newTitle = newTitle.toLowerCase();
    newTitle = newTitle.replace(/\s/g,'-');
    console.log(newTitle);
}
/**
* adds QA to exam
* @returns {void}
*/
function addQuestion() {
    var total = $('#formQA .q').length;
    total++;
    $('#questions').append(
        '<label for="p' + total + '">Pregunta ' + total + ':<label>\
        <input class="q" id="p' + total + '" type="text" name="p' + total + '" />\
        <label for="a' + total + '">Respuesta:</label>\
        <input id="a' + total + '" name="a' + total + '" type="text" />'
    );
    $('#p' + total).focus();
}

function checkConnection() {
    var con = navigator.connection.type;
    if (con == Connection.NONE) return false;
    return true;
}


function bindFormSubmits() {
    $('#formQA').submit(function (e) {
        e.preventDefault;
        var data;
        var newExam;
        var totalQuestions = ($('#questions').find('.q').length);

        $('#totalQA').attr('value', totalQuestions);

        var fakeInternet = false;
        if (fakeInternet) {
            data = $(this).serialize();
            $.post($(this).attr('action'), data, function(response){
                console.log(response);
                newExam = response.exam;
                createExamQA(newExam);
                navigator.notification.alert(i18n.t('dialogs.examCreated'));
            },'json');
        } else {
            data = $(this).serializeArray();
            console.log('no hay internet');
            var txt = '{';
            for (i = 0; i < data.length; i++) {
                txt += '"' + data[i].name + '":"' + data[i].value + '"';
                if (i < totalQuestions -1) txt += ',';
            }
            txt += '}';
            newExam = txt;
            createExamQA(newExam);
        }
        return false;
    });

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
        $(document).bind('ajaxError', fileSystemFail())
        .bind('ajaxStart', loading(true))
        .bind('ajaxComplete', loading(false));
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function(event) {
        getUserExams();
        setLanguage();
        bindFormSubmits();
    },
    receivedEvent: function(event) {
    }
};
