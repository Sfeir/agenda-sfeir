$().ready(function() {

    // postForm = soumission du formulaire
    const post = $('#postForm');
    $('#contact-form').bootstrapValidator({
        //submitButtons: '#postForm',
        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            Feedback: {
                message: 'Description incorrecte !',
                validators: {
                    notEmpty: {
                        message: 'Une description de l\'évènement est nécessaire !'
                    },
                }
            },

        }
    })
        .on('success.form.bv', function (e) {
            // Prevent form submission
            e.preventDefault();

            // Get the form instance
            var $form = $(e.target);

            // Get the BootstrapValidator instance
            var bv = $form.data('bootstrapValidator');

            // Use Ajax to submit form data
            var url = 'https://script.google.com/a/sfeir.com/macros/s/AKfycbzOo4zuSNetTkIwbYFsy3M7EmhWq2rCNrF1VrV_Pb4ou4E6kOOf/exec';
            var redirectUrl = 'congrats.html';
            // show the loading
            post.prepend($('<span></span>').addClass('glyphicon glyphicon-refresh glyphicon-refresh-animate'));
            var jqxhr = $.post(url, $form.serialize(), function (data) {
                console.log("Success! Data: " + data.statusText);
                $(location).attr('href', redirectUrl);
            })
                .fail(function (data) {
                    console.warn("Error! Data: " + data.statusText);
                    // HACK - check if browser is Safari - and redirect even if fail b/c we know the form submits.
                    if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
                        //alert("Browser is Safari -- we get an error, but the form still submits -- continue.");
                        $(location).attr('href', redirectUrl);
                    }
                });
        });

    $('#feedback').click(function() {
        $('#feedback').addClass('hidden');
        $('#contact-form').removeClass('hidden');
        getEventName();
    });

    post.click(function(){
        $('#eid').append('<option value="' + getUrlParameter('id') + '"></option>');
    });

});

function getEventName(){
    var idEvent = getUrlParameter('id');
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '1wlT_4W24gLMY9wXsEmfAU-O7diaegVcEhOX6XDWuVf4',
        range: 'Sheet1',
    }).then(function (response) {
        var range = response.result;
        if (range.values.length > 0) {
            for (i = 0; i < range.values.length; i++) {
                var row = range.values[i];

                if(row[3] === idEvent){
                    $("#nomEvent").append(row[2]);
                    break;
                }
            }
        } else {
            appendPre('No data found.');
        }
    }, function (response) {
        appendPre('Error: ' + response.result.error.message);
    });
}

function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

// ID CLIENT + CLE API (DEV. CONSOLE)
var CLIENT_ID = '610580318952-gbttqu242bfi93erapqcvcqtb8ot0l3n.apps.googleusercontent.com';
var API_KEY = 'AIzaSyAZJHOwagBVkC6GXSFqn2G9jN6D2sIGNRE';

// DISCOVERY DOCS UTILISES PAR L'API LORS DU QUICKSTART
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// AUTORISATION (= scope) NECESSAIRE A L'API
var SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

// CHARGE LA BIBLIOTHEQUE AUTH2/CLIENT API
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

 // INITIALISE LA BIBLIOTHEQUE DE L'API CLIENT ET ETABLIT LE STATUS DE CONNECTION
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        if(!gapi.auth2.getAuthInstance().isSignedIn.get()){
            gapi.auth2.getAuthInstance().signIn();
            $('#login').removeClass('hidden');
        }else{
            $('#login').addClass('hidden');
        }
    });
}