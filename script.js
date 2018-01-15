

$().ready(function() {
    var event;
    // CST
    // ph = plage horaire
        const ph = $('#ph');
    // cte = choix type evenement
        const cte = $('#cte');
    // cv = choix ville
        const cv = $('#cv');
    // cs = choix salle
        const cs = $('#cs');

    // DIV
    // type-event-ext = txt even externe
        const tee = $('#type-event-ext');
    // speakers = checkbox speakers sfeir (oui/non)
        const speakers = $('#speakers');
    // liens = checkbox lien dispo (oui/non)
        const liens = $('#liens');
    // postForm = soumission du formulaire
        const post = $('#postForm');

    // TXT
        var paris = '<option value="Salle Accueil">Salle Accueil</option><option value="Grande salle RdC">Grande salle RdC</option><option value="Salle 1er étage">Salle 1er étage</option><option value="Salle 4ème étage">Salle 4ème étage</option>';
        var lille = '<option value="Salle 1">Salle Lille</option>';
        var lux = '<option value="Salle 1">Salle Luxembourg</option>';
        var est = '<option value="Salle Metro">Metro</option><option value="Denali">Salle Denali</option><option value="Rosario">Salle Rosario</option>';
        var matin = '<option value="Matin">Toute la matinée</option><option value="8">8h - 9h</option><option value="9">9h - 10h</option><option value="10">10h - 11h</option><option value="11">11h - 12h</option>';
        var aprem = '<option value="Après-midi">Toute l après-midi</option><option value="12">12h - 13h</option><option value="13">13h - 14h</option><option value="14">14h - 15h</option><option value="15">15h - 16h</option><option value="16">16h - 17h</option><option value="17">17h - 18h</option>';

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

    cte.val('na');
    cte.addClass("selnotok");
    cv.addClass("selnotok");
    cs.addClass("selnotok");
    ph.addClass("selnotok");

    // CHOIX TYPE EVENEMENT (id #cte)
    cte.change(function() {
        /*
        for(var i=0;i<=rbtn.length;i++){
            clearRadiobtn(rbtn[i]);
        } */

        showDiv('ville');

        if($(this).val() !== "na"){
            $(this).addClass("selok").removeClass("selnotok");
        }else{
            $(this).addClass("selnotok").removeClass("selok");
        }

        if($(this).val() === "Autre"){
            showDiv('type-event2');
            tee.prop('disabled', false);
        }else{
            hideDiv('type-event2');
            tee.prop('disabled', true);
        }
    });

    // CHOIX DE LA VILLE (id #cv)
    cv.change(function () {
        clearRadiobtn(0);

        hideInfo(2);

        ph.val("na");
        cs.val("na");
        resetValue('dd');
        resetValue('df');

        showDiv('jours');

        if($(this).val() !== "na"){
            $(this).addClass("selok").removeClass("selnotok");
        }else{
            $(this).addClass("selnotok").removeClass("selok");
            hideDiv('jours');
        }

        if ($(this).val() === "Autre") {
            showDiv('ville2');
            event = true;
        }else{
            hideDiv('ville2');
            event = false;

            cs.children("option").remove();
            cs.append('<option value="na">Choisir une salle</option>');
            if ($(this).val() === "Paris") {cs.append(paris);}
            if ($(this).val() === "Lille") {cs.append(lille);}
            if ($(this).val() === "Luxembourg") {cs.append(lux);}
            if ($(this).val() === "Strasbourg") {cs.append(est);}
        }

    });

    // EST-CE SUR PLUSIEURS JOURS ? (id #jours)
    $('#jours').change(function() {
        clearRadiobtn(1);
        hideInfo(4);

        ph.val("na");
        cs.val("na");
        resetValue('dd');
        resetValue('df');

        showDiv('date-debut');

        if($('#jour1').is(':checked')){
            event = true;
            showDiv('date-fin');
        }else{
            event = false;
            hideDiv('date-fin');
        }
    });

    // CHOIX DATE DEBUT (id #dd)
    $('#dd').change(function(){
        clearRadiobtn(2);
        hideInfo(8);

        cs.val("na");

        if ($('#jour1').is(':checked')){
            hideDiv('tranches')
        }else{
            showDiv('tranches');
        }
    });

    // CHOIX DATE FIN (id #df)
    $('#df').change(function(){
        clearRadiobtn(2);
        hideInfo(8);

        ph.val("na");
        cs.val("na");

        showDiv('locaux');


    });

    // CHOIX TRANCHES HORAIRE (id #tranches)
    $('#tranches').change(function() {
        clearRadiobtn(2);
        hideInfo(8);

        cs.val("na");

        ph.children("option").remove();
        ph.append('<option value="na">Choisir une plage horaire</option>');
        if($('#tranche1').is(':checked') || $('#tranche2').is(':checked')){
            event = false;
            hideDiv('locaux');
            showDiv('plage');
            if($('#tranche1').is(':checked')){
                ph.append(matin);
            }else{
                ph.append(aprem);
            }
        }else{
            event = true;
            hideDiv('plage');
            showDiv('locaux');
            if($('#tranche3').is(':checked')){
                ph.append('<option value="Toute la journée">Toute la journée</option>').val("Toute la journée");
            }else{
                ph.append('<option value="Soir">Soir</option>').val("Soir");
            }
        }
    });

    // PLAGE HORAIRE (id #plage)
    $('#plage').change(function(){
        showDiv('locaux');
        hideInfo(8);
    });

    // CHOIX PLAGE HORAIRE (id #ph)
    ph.change(function(){
        if($(this).val() !== "na"){
            $(this).addClass("selok");
            $(this).removeClass("selnotok");
        }else{
            $(this).addClass("selnotok");
            $(this).removeClass("selok");
        }

        clearRadiobtn(2);
        hideInfo(8);

        cs.val("na");

        showDiv('locaux');
    });

    // LOCAUX SFEIR OU NON ? (id #locaux)
    $('#locaux').change(function () {

        hideInfo(8);

        if($('#local1').is(':checked')){
            showDiv('salle');
        }else{
            event = true;
            showInfo(event);
            hideDiv('salle');
            cs.val("na");
        }
    });

    // CHOIX SALLE (id #cs)
    cs.change(function() {

        if ($(this).val() !== "na") {
            $(this).addClass("selok");
            $(this).removeClass("selnotok");
        } else {
            $(this).addClass("selnotok");
            $(this).removeClass("selok");
        }

        if ($('#tranche4').is(':checked')) {
            nightEvent();
        }else if ($('#jour1').is(':checked')) {
            multipleDaysEvent();
        }else{
            singleDayEvent();
        }
    });

    // Y A T-IL DES SPEAKERS ? (id #jours)
    speakers.change(function(){
        liens.removeClass('hidden');
        if ($('#speaker1').is(':checked')) {
            showDiv('speaker');
        }else{
            hideDiv('speaker');
        }
    });

    liens.change(function() {
        post.prop('disabled', false);
        if ($('#lien1').is(':checked')) {
            showDiv('lien');
        }else{
            hideDiv('lien');
        }
    });

    // SOUMISSION DU FORMULAIRE (btn id #postForm)
    post.click(function(){
        if(ph.val() === "Autre"){
            cte.append('<option value="' + tee.val() + '"></option>');
            cte.val(tee.val());
        }
        if(cv.val() === "Autre"){
            cv.append('<option value="' + $('#ville-ext').val() + '"></option>');
            cv.val($('#ville-ext').val());
            cs.append('<option value="Pas chez SFEIR">Pas chez SFEIR</option>');
            cs.val("Pas chez SFEIR");
        }
        if($('#local2').is(':checked')) {
            cs.append('<option value="Pas chez SFEIR">Pas chez SFEIR</option>');
            cs.val("Pas chez SFEIR");
        }
        if($('#jour2').is(':checked')){
            $("#df").val($("#dd").val());
        }else{
            ph.append('<option value="Plusieurs jours"></option>').val("Plusieurs jours");
        }
        if ($('#speaker2').is(':checked')) {
            $("#speaker-i").val("Pas de speaker");
        }
        if ($('#lien2').is(':checked')) {
            $("#lien-i").val("Aucun lien disponible");
        }
    });

});

// FONCTION POUR UN EVENT SUR 1 JOUR (matin/aprem/toute la journée)
function singleDayEvent(){

    // CST
    // ph = plage horaire
    const ph = $('#ph');
    // cte = choix type evenement
    const cte = $('#cte');
    // cv = choix ville
    const cv = $('#cv');
    // cs = choix salle
    const cs = $('#cs');


    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '1wlT_4W24gLMY9wXsEmfAU-O7diaegVcEhOX6XDWuVf4',
        range: 'Sheet1',
    }).then(function (response) {
        var range = response.result;
        if (range.values.length > 0) {
            for (i = 0; i < range.values.length; i++) {
                var row = range.values[i];

                if ((row[5] === "Toute la journée" && row[4] === cs.val()) || (row[5] === "Plusieurs jours" && row[4] === cs.val())) {
                    var from = Date.parse(row[6]);
                    var to = Date.parse(row[7]);
                    var check = Date.parse($('#dd').val());

                    if (check <= to && check >= from) {
                        showDiv('invalide');
                        hideInfo(9);
                        break;
                    }
                }

                if ((row[6] === $('#dd').val() && row[4] === cs.val()) && ($('#tranche1').is(':checked') || $('#tranche2').is(':checked'))) {
                    if (ph.val() === "8" && (row[5] === "Toute la journée" || row[5] === "Matin" || row[5] === "8")) {
                        showDiv('invalide');
                        hideInfo(9);
                        break;
                    }
                    else if (ph.val() === "9" && (row[5] === "Toute la journée" || row[5] === "Matin" || row[5] === "9")) {
                        showDiv('invalide');
                        hideInfo(9);
                        break;
                    }
                    else if (ph.val() === "10" && (row[5] === "Toute la journée" || row[5] === "Matin" || row[5] === "10")) {
                        showDiv('invalide');
                        hideInfo(9);
                        break;
                    }
                    else if (ph.val() === "11" && (row[5] === "Toute la journée" || row[5] === "Matin" || row[5] === "11")) {
                        showDiv('invalide');
                        hideInfo(9);
                        break;
                    }
                    else if (ph.val() === "12" && (row[5] === "Toute la journée" || row[5] === "Après-midi" || row[5] === "12")) {
                        showDiv('invalide');
                        hideInfo(9);
                        break;
                    }
                    else if (ph.val() === "13" && (row[5] === "Toute la journée" || row[5] === "Après-midi" || row[5] === "13")) {
                        showDiv('invalide');
                        hideInfo(9);
                        break;
                    }
                    else if (ph.val() === "14" && (row[5] === "Toute la journée" || row[5] === "Après-midi" || row[5] === "14")) {
                        showDiv('invalide');
                        hideInfo(9);
                        break;
                    }
                    else if (ph.val() === "15" && (row[5] === "Toute la journée" || row[5] === "Après-midi" || row[5] === "15")) {
                        showDiv('invalide');
                        hideInfo(9);
                        break;
                    }
                    else if (ph.val() === "16" && (row[5] === "Toute la journée" || row[5] === "Après-midi" || row[5] === "16")) {
                        showDiv('invalide');
                        hideInfo(9);
                        break;
                    }
                    else if (ph.val() === "17" && (row[5] === "Toute la journée" || row[5] === "Après-midi" || row[5] === "17")) {
                        showDiv('invalide');
                        hideInfo(9);
                        break;
                    } else if ((ph.val() === "Soir" && row[5] === "Soir") || (ph.val() === "Toute la journée" && row[5] === "Toute la journée")) {
                        showDiv('invalide');
                        hideInfo(9);
                        break;

                    }
                } else {
                    hideDiv('invalide');
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

// FONCTION POUR UN EVENT LE SOIR
function nightEvent(){
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '1wlT_4W24gLMY9wXsEmfAU-O7diaegVcEhOX6XDWuVf4',
        range: 'Sheet1',
    }).then(function (response) {
        var range = response.result;
        if (range.values.length > 0) {
            for (i = 0; i < range.values.length; i++) {
                var row = range.values[i];

                if (row[6] === $('#dd').val() && row[4] === cs.val() && row[5] === "Soir" && row[3] === cv.val()) {
                    showDiv('invalide');
                    hideInfo(9);
                    break;

                } else {
                    hideDiv('invalide');
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

// FONCTION POUR UN EVENT SUR PLUSIEURS JOURS
function multipleDaysEvent(){
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '1wlT_4W24gLMY9wXsEmfAU-O7diaegVcEhOX6XDWuVf4',
        range: 'Sheet1',
    }).then(function (response) {
        var range = response.result;
        if (range.values.length > 0) {
            for (i = 0; i < range.values.length; i++) {
                var row = range.values[i];

                if (row[6] >= $('#dd').val() && row[6] <= $('#df').val()) {
                    if (row[5] !== "Soir" && row[4] === cs.val()) {
                        showDiv('invalide');
                        hideInfo(9);
                        break;
                    }
                } else {
                    hideDiv('invalide');
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

// FONCTION QUI MONTRE INFO GENERALES MAIL + ORGA/SPEAKER/DESC/LIEN
function showInfo(x){
    // organisateur
    const organisateur = $('#organisateur');
    // speakers = checkbox speakers sfeir (oui/non)
    const speakers = $('#speakers');
    // description
    const description = $('#description');
    // email = txt email
    const email = $('#email');

    email.removeClass('hidden');
    if(x){
        organisateur.removeClass('hidden');
        speakers.removeClass('hidden');
        description.removeClass('hidden');
    }
}

// FONCTION QUI CACHE INFO GENERALES MAIL + ORGA/SPEAKER/DESC/LIEN
function hideInfo(start){
    const post = $('#postForm');
    var divs = ['ville','jours','date-debut','date-fin','tranches','plage','locaux','salle','salle','invalide','email','organisateur','description','speakers','speaker','liens','lien'];
    for(var i=start;i<=divs.length;i++){
        hideDiv(divs[i]);
    }
    post.prop('disabled', true);
}

// FONCTION QUI AJOUTE LA CLASS HIDDEN A UNE DIV (= la cache)
function hideDiv(x){
    $('#'+x).addClass('hidden');
}

// FONCTION QUI RETIRE LA CLASS HIDDEN A UNE DIV (= la montre)
function showDiv(x){
    $('#'+x).removeClass('hidden');
}

// FONCTION QUI DESELECTIONNE LES BTN RADIO
function clearRadiobtn(start){
    var rbtn = ['jour','tranche','local','speak','link'];
    for(var i=start;i<=rbtn.length;i++){
        $('input[name='+rbtn[i]+']').attr('checked',false);
    }
}

//FONCTION QUI RESET LA VALEUR D'UN CHAMP
function resetValue(x){
    $("#"+x).val("");
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