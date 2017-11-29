$().ready(function() {
    var event;
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
            Organisateurs: {
                message: 'Organisateur incorrect !',
                validators: {
                    notEmpty: {
                        message: 'Un organisateur est nécessaire !'
                    },
                }
            },
            Speaker: {
                message: 'Nom incorrect !',
                validators: {
                    notEmpty: {
                        message: 'Un nom de speaker est nécessaire !'
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

    $('#cte').addClass("selnotok");
    $('#cv').addClass("selnotok");
    $('#cs').addClass("selnotok");
    $('#ph').addClass("selok");

    // CHOIX DE LA VILLE (id #cv)
    $('#cv').change(function () {
        clearRadiobtn("local");
        clearRadiobtn("soir");
        clearRadiobtn("jour");
        clearRadiobtn("tranche");

        hideDiv('jours');
        hideDiv('plage');
        hideDiv('tranches');
        hideDiv('soiree');
        hideDiv('date-debut');
        hideDiv('date-fin');

        hideInfo();

        $("#dd").val("");
        $("#df").val("");

        if($(this).val() !== "na"){
            $(this).addClass("selok");
            $(this).removeClass("selnotok");
        }else{
            $(this).addClass("selnotok");
            $(this).removeClass("selok");
        }



        $('#date-fin').addClass('hidden');
        if ($(this).val() === "Autre") {
            showDiv('ville2');
            showDiv('jours');
            hideDiv('salle');
            hideDiv('locaux');
            event = true;
        }else{
            showDiv('locaux');
            hideDiv('ville2');
            hideDiv('salle');
            event = false;

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

    // LOCAUX SFEIR OU NON ? (id #locaux)
    $('#locaux').change(function () {
        clearRadiobtn('soir');
        clearRadiobtn('jour');
        clearRadiobtn('tranche');

        hideDiv('soiree');
        hideDiv('jours');
        hideDiv('tranches');
        hideDiv('plage');
        hideDiv('date-debut');
        hideDiv('date-fin');

        hideInfo();

        $("#dd").val("");
        $("#df").val("");

        if($('#local1').is(':checked')){
            showDiv('salle');
        }else{
            showDiv('soiree');
            hideDiv('salle');
        }

    });

    // CHOIX TYPE EVENEMENT (id #cte)
    $('#cte').change(function() {
        clearRadiobtn('jour');
        showDiv('ville');

        if($(this).val() !== "na"){
            $(this).addClass("selok");
            $(this).removeClass("selnotok");
        }else{
            $(this).addClass("selnotok");
            $(this).removeClass("selok");
        }

        if($(this).val() === "Autre"){
            showDiv('type-event2');
            $('#type-event-ext').prop('disabled', false);
        }else{
            hideDiv('type-event2');
            $('#type-event-ext').prop('disabled', true);
        }
    });

    // CHOIX DE LA SALLE (id #cs)
    $('#cs').change(function() {
        clearRadiobtn('soir');
        clearRadiobtn('jour');

        hideDiv('plage');
        hideDiv('date-debut');
        hideDiv('date-fin');
        hideDiv('date-fin');
        hideInfo('invalide1');
        hideInfo();

        showDiv('soiree');

        $("#dd").val("");
        $("#df").val("");

        if($(this).val() !== "na"){
            $(this).addClass("selok");
            $(this).removeClass("selnotok");
        }else{
            $(this).addClass("selnotok");
            $(this).removeClass("selok");
        }
    });

    // EVENEMENT LE SOIR OU NON ? (id #soiree)
    $('#soiree').change(function() {
        clearRadiobtn('jour');
        hideDiv('date-fin');
        hideDiv('tranches');
        hideDiv('plage');
        hideInfo();

        $("#dd").val("");
        $("#ph").val("");

        if($('#soir1').is(':checked')){
            hideDiv('jours');
            showDiv('date-debut');
            $("#ph").append('<option value="Soir">Soir</option>');
            $("#ph").val("Soir");
            event = true;
        }
        else{
            event = false;
            hideDiv('date-debut');
            showDiv('jours');
        }
    });

    // EST-CE SUR PLUSIEURS JOURS ? (id #jours)
    $('#jours').change(function() {
        hideDiv('tranches');
        hideInfo();

        showDiv('date-debut');

        $("#dd").val("");

        if($('#jour1').is(':checked')){
            event = true;
            hideDiv('plage');
            hideDiv('invalide1');
            showDiv('date-fin');

            $("#ph").append('<option value="Soir">Soir</option>');
            $("#ph").val("Soir");
        }
        else{
            event = false;
            hideDiv('date-fin');
        }
    });

    // CHOIX TRANCHES HORAIRE (id #tranches)
    $('#tranches').change(function() {

        $("#ph").children("option").remove();
        $("#ph").append('<option value="na">Choisir une plage horaire</option>');
        if($('#tranche1').is(':checked')){
            event = false;
            showDiv('plage');
            hideInfo();
            $("#ph").append('<option value="Matin">Toute la matinée</option>');
            $("#ph").append('<option value="8">8h - 9h</option>');
            $("#ph").append('<option value="9">9h - 10h</option>');
            $("#ph").append('<option value="10">10h - 11h</option>');
            $("#ph").append('<option value="11">11h - 12h</option>');
        }
        else if($('#tranche2').is(':checked')){
            event = false;
            hideInfo();
            showDiv('plage');
            $("#ph").append('<option value="Après-midi">Toute l après-midi</option>');
            $("#ph").append('<option value="12">12h - 13h</option>');
            $("#ph").append('<option value="13">13h - 14h</option>');
            $("#ph").append('<option value="14">14h - 15h</option>');
            $("#ph").append('<option value="15">15h - 16h</option>');
            $("#ph").append('<option value="16">16h - 17h</option>');
            $("#ph").append('<option value="17">17h - 18h</option>');
        }else{
            $("#ph").append('<option value="Toute la journée">Toute la journée</option>');
            $("#ph").val("Toute la journée");
            event = true;
            showInfo(event);
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
            $("#cs").append('<option value="Pas chez SFEIR">Pas chez SFEIR</option>');
            $("#cs").val("Pas chez SFEIR");
        }
        if($('#local2').is(':checked')) {
            $("#cs").append('<option value="Pas chez SFEIR">Pas chez SFEIR</option>');
            $("#cs").val("Pas chez SFEIR");
        }
        if($('#jour1').is(':checked')){
            $("#ph").append('<option value="Plusieurs jours"></option>');
            $("#ph").val("Plusieurs jours");
        }else{
            $("#df").val($("#dd").val());
        }
    });


    $('#plage').change(function(){
        hideInfo();
    });

    $('#ph').change(function(){
        gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: '1wlT_4W24gLMY9wXsEmfAU-O7diaegVcEhOX6XDWuVf4',
            range: 'Sheet1',
        }).then(function(response) {
            var range = response.result;
            if (range.values.length > 0) {
                for (i = 0; i < range.values.length; i++) {
                    var row = range.values[i];


                        if(row[6] === $('#dd').val() && row[4] === $('#cs').val() && row[3] === $('#cv').val()){
                            if($('#tranche1').is(':checked')) {
                                if ($('#ph').val() === "8") {
                                    if (row[5] === "Toute la journée" || row[5] === "Matin" || row[5] === "8") {
                                        showDiv('invalide1');
                                        hideInfo();
                                        break;
                                    }
                                }
                                else if ($('#ph').val() === "9") {
                                    if (row[5] === "Toute la journée" || row[5] === "Matin" || row[5] === "9") {
                                        showDiv('invalide1');
                                        hideInfo();
                                        break;
                                    }
                                }
                                else if ($('#ph').val() === "10") {
                                    if (row[5] === "Toute la journée" || row[5] === "Matin" || row[5] === "10") {
                                        showDiv('invalide1');
                                        hideInfo();
                                        break;
                                    }
                                }
                                else if ($('#ph').val() === "11") {
                                    if (row[5] === "Toute la journée" || row[5] === "Matin" || row[5] === "11") {
                                        showDiv('invalide1');
                                        hideInfo();
                                        break;
                                    }
                                }
                            }else{
                                if ($('#ph').val() === "12") {
                                    if (row[5] === "Toute la journée" || row[5] === "Après-midi" || row[5] === "12") {
                                        showDiv('invalide1');
                                        hideInfo();
                                        break;
                                    }
                                }
                                else if ($('#ph').val() === "13") {
                                    if (row[5] === "Toute la journée" || row[5] === "Après-midi" || row[5] === "13") {
                                        showDiv('invalide1');
                                        hideInfo();
                                        break;
                                    }
                                }
                                else if ($('#ph').val() === "14") {
                                    if (row[5] === "Toute la journée" || row[5] === "Après-midi" || row[5] === "14") {
                                        showDiv('invalide1');
                                        hideInfo();
                                        break;
                                    }
                                }
                                else if ($('#ph').val() === "15") {
                                    if (row[5] === "Toute la journée" || row[5] === "Après-midi" || row[5] === "15") {
                                        showDiv('invalide1');
                                        hideInfo();
                                        break;
                                    }
                                }
                                else if ($('#ph').val() === "16") {
                                    if (row[5] === "Toute la journée" || row[5] === "Après-midi" || row[5] === "16") {
                                        showDiv('invalide1');
                                        hideInfo();
                                        break;
                                    }
                                }
                                else if ($('#ph').val() === "17") {
                                    if (row[5] === "Toute la journée" || row[5] === "Après-midi" || row[5] === "17") {
                                        showDiv('invalide1');
                                        hideInfo();
                                        break;
                                    }
                                }
                            }
                        }else{
                            hideDiv('invalide1');
                            showInfo(event);
                        }

                }
            } else {
                appendPre('No data found.');
            }
        }, function(response) {
            appendPre('Error: ' + response.result.error.message);
        });
    });

    $('#dd').change(function(){

        if ($('#soir1').is(':checked')) {

            gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: '1wlT_4W24gLMY9wXsEmfAU-O7diaegVcEhOX6XDWuVf4',
                range: 'Sheet1',
            }).then(function (response) {
                var range = response.result;
                if (range.values.length > 0) {
                    for (i = 0; i < range.values.length; i++) {
                        var row = range.values[i];

                            if (row[6] === $('#dd').val() && row[4] === $('#cs').val() && row[5] === "Soir" && row[3] === $('#cv').val()) {
                                showDiv('invalide1');
                                hideInfo();
                                break;

                            } else {
                                hideDiv('invalide1');
                                showInfo(event);
                            }
                    }
                } else {
                    appendPre('No data found.');
                }
            }, function (response) {
                appendPre('Error: ' + response.result.error.message);
            });
        }


        if ($('#jour2').is(':checked')) {
            hideDiv('plage');
            hideInfo();

            $('#ph').val('');

            gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: '1wlT_4W24gLMY9wXsEmfAU-O7diaegVcEhOX6XDWuVf4',
                range: 'Sheet1',
            }).then(function (response) {
                var range = response.result;
                if (range.values.length > 0) {
                    for (i = 0; i < range.values.length; i++) {
                        var row = range.values[i];

                        if (row[5] === "Toute la journée" || row[5] === "Plusieurs jours") {
                            if(row[4] === $('#cs').val()){
                                var from = Date.parse(row[6]);
                                var to = Date.parse(row[7]);
                                var check = Date.parse($('#dd').val());

                                if (check <= to && check >= from) {
                                    showDiv('invalide1');
                                    hideDiv('tranches');
                                    hideInfo();
                                    break;
                                }
                            }
                        }else {
                            hideDiv('invalide1');
                            showDiv('tranches');
                            //showInfo();
                        }

                    }
                } else {
                    appendPre('No data found.');
                }
            }, function (response) {
                appendPre('Error: ' + response.result.error.message);
            });

        }


            $('input[name=tranche]').attr('checked',false);

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
                        if(row[5] !== "Soir" && row[4] === $('#cs').val()){
                            showDiv('invalide2');
                            hideInfo();
                            break;
                        }
                    }else{
                        hideDiv('invalide2');
                        showInfo(event);
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

function showInfo(x){
    $('#email').removeClass('hidden');
    $('#postForm').prop('disabled', false);

    if(x){
        $('#organisateur').removeClass('hidden');
        $('#speaker').removeClass('hidden');
        $('#description').removeClass('hidden');
        $('#lien').removeClass('hidden');
    }
}

function hideInfo(){
    $('#organisateur').addClass('hidden');
    $('#speaker').addClass('hidden');
    $('#description').addClass('hidden');
    $('#lien').addClass('hidden');
    $('#email').addClass('hidden');
    $('#postForm').prop('disabled', true);
}

function hideDiv(x){
    $('#'+x).addClass('hidden');
}

function showDiv(x){
    $('#'+x).removeClass('hidden');
}

function clearRadiobtn(x){
    $('input[name='+x+']').attr('checked',false);
}


// Client ID and API key from the Developer Console
var CLIENT_ID = '610580318952-gbttqu242bfi93erapqcvcqtb8ot0l3n.apps.googleusercontent.com'; //wLrRqXofyXPVznT_nsG_7BhX
var API_KEY = 'AIzaSyAZJHOwagBVkC6GXSFqn2G9jN6D2sIGNRE';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

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
        if(!gapi.auth2.getAuthInstance().isSignedIn.get()){
            gapi.auth2.getAuthInstance().signIn();
            $('#login').removeClass('hidden');
        }else{
            $('#login').addClass('hidden');
        }
    });
}