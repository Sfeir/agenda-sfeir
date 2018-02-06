

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
            Nom: {
                message: 'Nom incorrect !',
                validators: {
                    notEmpty: {
                        message: 'Un nom est nécessaire !'
                    },
                }
            },
            Description: {
                message: 'Description incorrecte !',
                validators: {
                    notEmpty: {
                        message: 'Le site de l\'évènement est nécessaire !'
                    },
                }
            },
            Lien: {
                message: 'Lien incorrect !',
                validators: {
                    notEmpty: {
                        message: 'Un lien vers le CFP est nécessaire !'
                    },
                }
            },
            Adresse: {
                message: 'Lien incorrect !',
                validators: {
                    notEmpty: {
                        message: 'Un lien vers l\'évènement Workplace est nécessaire !'
                    },
                }
            },
            Email: {
                validators: {
                    notEmpty: {
                        message: 'Une adresse mail est requise !'
                    },
                    emailAddress: {
                        message: 'Adresse mail invalide (format: nom@domain.fr)!'
                    }
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

    $('#nom-event-i').change(function() {
        post.prop('disabled', true);
    });

    $('#date-debut').change(function(){
        showDiv('date-fin');
    });
    $('#date-fin').change(function(){
        showDiv('email');
        showDiv('description');
        showDiv('lien');
        showDiv('adresse');
    });

});

// FONCTION QUI AJOUTE LA CLASS HIDDEN A UNE DIV (= la cache)
function hideDiv(x){
    $('#'+x).addClass('hidden');
}

// FONCTION QUI RETIRE LA CLASS HIDDEN A UNE DIV (= la montre)
function showDiv(x){
    $('#'+x).removeClass('hidden');
}

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