
var examsDir;

var str = '{"title":"historia","totalQA":"4","p1":"cuando llego colon a america?","a1":"el 12 de octubre","p2":"cuando fue la revolucion esa importante?","a2":"hace un par de aÃ±os","p3":"de que colo era el caballo blanco de colon?","a3":"no tenia caballo","p4":"como ganamos la guerra?","a4":"no la ganamos"}';

var exams = [];
var User = {
    name: 'user',
    id: '',
    email: '',
    exams: []
}


var Question = function(ques, ans, num) {
    this.question = ques;
    this.answer = ans;
    this.hint = '';
    this.num = num;
}
Question.prototype.reverse = function () {
    this.hint = this.answer.split("").reverse().join("");
}
Question.prototype.takeOut = function () {
    this.hint = this.answer.replace(/[aeiou]/ig,' ');
}
Question.prototype.editAnswer = function (newAns) {
    this.answer = newAns;
}

var Exam = function(exam) {
    this.title = exam.title || 'untitled';
    this.total = exam.totalQA;
    this.questions = [];
    this.setQuestions = function() {
        if (this.questions.length == 0) {
            for (i = 1; i <= this.total; i++) {
                this.addQuestion(exam['p'+i],exam['a'+i]);
            }
            return true;
        } else {
            return false;
        }
    }
    this.setQuestions();
    console.log('created');
}

Exam.prototype.addQuestion = function (question, answer) {
    var queans = new Question(question, answer, this.questions.length + 1);
    this.questions.push(queans);
}
Exam.prototype.upload = function() {
    console.log('gonna upload the shit later');
}

//page obj
var $page = {
    current : '',
    header : '',
    content : '',
    footer : '',
    navLog : [],
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
            if(!back) $page.navLog.push(navObj);
        }
        $page.current = id;
        $page.buildPage($page.current);
        $($page.current).show();
        if ($page.current === '#home') $page.navLog = [];
    },
    
    goBack : function () {
        if(($page.navLog.length - 1) === -1) {
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
            var backTo = $page.navLog[($page.navLog.length) - 1];
            $page.navLog.pop();
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
    $($page.content).append('User.exams: ' + JSON.stringify(User.exams));
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
    console.log('error: ' + error);
    navigator.notification.alert('error');
}

/**
 * get list of user exams stored on device
 */
function getUserExams() {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
        fileSystem.root.getDirectory('exams', {create: true}, function (dirEntry) {
            var dirReader = dirEntry.createReader();
            dirReader.readEntries(function (data) {
                User.exams = data;
                console.log('Exams: ' + exams);
            }, fileSystemFail);
        }, fileSystemFail);
    }, fileSystemFail);
}
/**
 * creates json file exam and store localy;
 * @param {JSON object} exam the exam string converted submited $('bla')
 * @returns {undefined} null
 */
function createExam(newExam) {

    var referenceTitle = newExam.title;

    referenceTitle = referenceTitle.replace(/[^a-zA-Z0-9\s]/g,"");
    referenceTitle = referenceTitle.toLowerCase();
    referenceTitle = referenceTitle.replace(/\s/g,'_');

    User.exams[referenceTitle] = new Exam(newExam);

    //window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
      //  fileSystem.root.getDirectory('exams')
    //}, fail)
    navigator.notification.confirm(
        i18n.t('dialogs.gotoExam'),
        function(index) {
            console.log('boton: ' + index);
        },
        i18n.t('dialogs.examCreated'),
        [i18n.t('dialogs.btnYes'),i18n.t('dialogs.btnNo')]
    );
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

        if (!checkConnection()) {
            data = $(this).serialize();
            $.post($(this).attr('action'), data, function(response){
                console.log(response);
                newExam = response.exam;
                createExam(newExam);
            },'json');
        } else {
            data = $(this).serializeArray();
            console.log('no hay internet');
            var txt = '{';
            for (i = 0; i < data.length; i++) {
                txt += '"' + data[i].name + '":"' + data[i].value + '"';
                if (i < data.length -1) txt += ',';
            }
            txt += '}';
            newExam = JSON.parse(txt);
            createExam(newExam);
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
