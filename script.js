$().ready(function() {
    handleAuthClick();
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
                    stringLength: {
                        min: 2,
                        max: 30,
                        message: 'Le nom de l\'évènement doit au minimum comporter 2 lettres (maximum: 30)'
                    },
                }
            },
            Organisateurs: {
                message: 'Organisateur incorrect !',
                validators: {
                    notEmpty: {
                        message: 'Un organisateur est nécessaire !'
                    },
                    stringLength: {
                        min: 2,
                        max: 30,
                        message: 'Le nom de l\'organisateur doit au minimum comporter 2 lettres (maximum: 30)'
                    },
                }
            },
            Speaker: {
                message: 'Nom incorrect !',
                validators: {
                    notEmpty: {
                        message: 'Un nom de speaker est nécessaire !'
                    },
                    stringLength: {
                        min: 2,
                        max: 30,
                        message: 'Le nom du speaker doit au minimum comporter 2 lettres (maximum: 30)'
                    },
                    regexp: {
                        regexp: /^[A-z-áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]+$/,
                        message: 'Le nom du speaker ne peut comporter que des lettres  !'
                    },
                }
            },
            Description: {
                message: 'Description incorrecte !',
                validators: {
                    notEmpty: {
                        message: 'Une description de l\'évènement est nécessaire !'
                    },
                }
            },
            Lien: {
                message: 'Lien incorrect !',
                validators: {
                    notEmpty: {
                        message: 'Un lien vers l\'évènement est nécessaire !'
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
            $('#postForm').prepend($('<span></span>').addClass('glyphicon glyphicon-refresh glyphicon-refresh-animate'));
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

    $('#cv').change(function () {
        hideInfo();
        $('#jours').addClass('hidden');
        $('#plage').addClass('hidden');
        $('#date-debut').addClass('hidden');
        $("#dd").val("");
        $('#date-fin').addClass('hidden');
        if ($(this).val() === "Autre") {
            $('#ville2').removeClass('hidden');
            $('#salle').addClass('hidden');
        }else{
            $('#ville2').addClass('hidden');
            $('#salle').removeClass('hidden');
            $("#cs").children("option").remove();
            $("#cs").append('<option value="na">Choisir une salle</option>');
            if ($(this).val() === "Paris") {
                $("#cs").append('<option value="Salle Accueil">Salle Accueil</option>');
                $("#cs").append('<option value="Grande salle RdC">Grande salle RdC</option>');
                $("#cs").append('<option value="Salle 1er étage">Salle 1er étage</option>');
                $("#cs").append('<option value="Salle 4ème étage">Salle 4ème étage</option>');
            }
            if ($(this).val() === "Lille") {
                $("#cs").append('<option value="Salle1">Salle 1 Lille</option>');
                $("#cs").append('<option value="Salle2">Salle 2 Lille</option>');
            }
            if ($(this).val() === "Luxembourg") {
                $("#cs").append('<option value="Salle1">Salle 1 Luxembourg</option>');
                $("#cs").append('<option value="Salle2">Salle 2 Luxembourg</option>');
            }
            if ($(this).val() === "Strasbourg") {
                $("#cs").append('<option value="Salle1">Salle 1 Strasbourg</option>');
                $("#cs").append('<option value="Salle2">Salle 2 Strasbourg</option>');
            }
        }

    });

    $('#cte').change(function() {
        if($(this).val() === "Autre"){
            $('#type-event2').removeClass('hidden');
            $('#ville').removeClass('hidden');
            $('#type-event-ext').prop('disabled', false);
        }else{
            $('#type-event-ext').prop('disabled', true);
            $('#ville').removeClass('hidden');
            $('#type-event2').addClass('hidden');
        }
    });

    $('#cs').change(function() {
        $('#jours').removeClass('hidden');
        $('#plage').addClass('hidden');
        $('#date-debut').addClass('hidden');
        $("#dd").val("");
        $('input[name=jour]').attr('checked',false);
        hideInfo();
    });

    $('#jours').change(function() {
        $("#dd").val("");
        $('#date-debut').removeClass('hidden');
        if($('#jour1').is(':checked')){
            $('#date-fin').removeClass('hidden');
            $('#plage').addClass('hidden');
        }
        else{
            $('#date-fin').addClass('hidden');
            $('#plage').removeClass('hidden');
        }

    });

    $('#cbh').change(function() {
        if($(this).is(':checked')){
            $('#horaire-fin').css( "display", "inline" );
            $('#hf').prop('disabled', false);
        }else{
            $('#hf').prop('disabled', true);
            $('#horaire-fin').css( "display", "none" );
        }
    });

    $("#postForm").click(function(){
        if($('#cte').val() === "Autre"){
            $("#cte").append('<option value="' + $('#type-event-ext').val() + '"></option>');
            $("#cte").val($('#type-event-ext').val());
        }
        if($('#cv').val() === "Autre"){
            $("#cv").append('<option value="' + $('#ville-ext').val() + '"></option>');
            $("#cv").val($('#ville-ext').val());
        }
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        if($('#df').val()){
            $('#ph').val("Plusieurs jours");
        }
    });

    $('#jours').change(function(){
        hideInfo();
    });

    $('#plage').change(function(){
        hideInfo();
    });

    $('#dd').change(function(){
        gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: '1wlT_4W24gLMY9wXsEmfAU-O7diaegVcEhOX6XDWuVf4',
            range: 'Sheet1',
        }).then(function(response) {
            var range = response.result;
            if (range.values.length > 0) {
                for (i = 0; i < range.values.length; i++) {
                    var row = range.values[i];

                    //if($('#cv').val() !== "Autre" && $('#jour2').is(':checked')){

                        if($('#ph').val() !== "Soir" && $('#jour2').is(':checked') && row[4] === $('#cs').val()){
                            var from = Date.parse(row[6]);
                            var to   = Date.parse(row[7]);
                            var check = Date.parse($('#dd').val());

                            if(check <= to && check >= from){
                                $('#invalide1').removeClass('hidden');
                                hideInfo();
                                break;
                            }else{
                                $('#invalide1').addClass('hidden');
                                showInfo();
                            }}//else*/
                         if(row[6] === $('#dd').val() && row[4] === $('#cs').val()){
                            if($('#ph').val() === "Matin"){
                                if(row[5] === "Toute la journée" || row[5] === "Matin"){
                                    $('#invalide1').removeClass('hidden');
                                    hideInfo();
                                    break;
                                }
                            }
                            else if($('#ph').val() === "Après-midi"){
                                if(row[5] === "Toute la journée" || row[5] === "Après-midi"){
                                    $('#invalide1').removeClass('hidden');
                                    hideInfo();
                                    break;
                                }
                            }
                            else if($('#ph').val() === "Toute la journée"){
                                if(row[5] === "Toute la journée" || row[5] === "Après-midi" || row[5] === "Matin"){
                                    $('#invalide1').removeClass('hidden');
                                    hideInfo();
                                    break;
                                }
                            }
                            else if($('#ph').val() === "Soir" && row[5] === "Soir"){
                                    $('#invalide1').removeClass('hidden');
                                    hideInfo();
                                    break;
                            }
                        }else{
                            $('#invalide1').addClass('hidden');
                            showInfo();
                        }
                    //}
                }
            } else {
                appendPre('No data found.');
            }
        }, function(response) {
            appendPre('Error: ' + response.result.error.message);
        });

    });

    $('#df').change(function(){
        gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: '1wlT_4W24gLMY9wXsEmfAU-O7diaegVcEhOX6XDWuVf4',
            range: 'Sheet1',
        }).then(function(response) {
            var range = response.result;
            if (range.values.length > 0) {
                for (i = 0; i < range.values.length; i++) {
                    var row = range.values[i];

                    if(row[6] >= $('#dd').val() && row[6] <= $('#df').val()){
                        if(row[5] !== "Soir"){
                            $('#invalide2').removeClass('hidden');
                            hideInfo();
                            break;
                        }
                    }else{
                        $('#invalide2').addClass('hidden');
                        showInfo();
                    }
                }
            } else {
                appendPre('No data found.');
            }
        }, function(response) {
            appendPre('Error: ' + response.result.error.message);
        });

    });

});

function showInfo(){
    $('#organisateur').removeClass('hidden');
    $('#speaker').removeClass('hidden');
    $('#description').removeClass('hidden');
    $('#lien').removeClass('hidden');
    $('#email').removeClass('hidden');
    $('#postForm').prop('disabled', false);
}

function hideInfo(){
    $('#organisateur').addClass('hidden');
    $('#speaker').addClass('hidden');
    $('#description').addClass('hidden');
    $('#lien').addClass('hidden');
    $('#email').addClass('hidden');
    $('#postForm').prop('disabled', true);

}

// Client ID and API key from the Developer Console
var CLIENT_ID = '610580318952-gbttqu242bfi93erapqcvcqtb8ot0l3n.apps.googleusercontent.com';
var API_KEY = 'AIzaSyAZJHOwagBVkC6GXSFqn2G9jN6D2sIGNRE';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

var authorizeButton = document.getElementById('authorize-button');
var signoutButton = document.getElementById('signout-button');

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        //listMajors();
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick() {
    gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}
