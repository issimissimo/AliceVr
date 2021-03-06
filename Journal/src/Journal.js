let states = {
    PRELOADER: 'preloader',
    JOURNAL: 'journal',
    IDLE: 'idle',
}

let state = states.PRELOADER;


window.dispatcher.receiveMessage("videoAssetClicked", (asset) => {

    // console.log("videoAssetClicked")

    /// load and append external html
    $("#journal").empty();

    if (asset.journal_url) {
        let htmlToLoad = asset.journal_url;

        $("#journal").append($('<div>').load("../data/html/" + htmlToLoad, function(responseTxt, statusTxt, xhr) {
            if (statusTxt !== "success") {
                console.error("Something was wrong loading html...")
            } else {

                // if (state === states.PRELOADER)
                //     $(".preloader").hide();

                state = states.JOURNAL;
                $("#journal").show();
            }
        }));
    }
});


///////////////////////////////
/////////////////////////////////
/////////// NEW!!!!!!!!!!!!!!
/////////////////////////////



window.dispatcher.receiveMessage("mapPreloaderFinished", function() {
    // console.log("HO RICEVUTO IL MESSAGGIO DALLA MAPPA CHE HA FINITO IL PRELOADING!")
    $(".preloader").fadeOut();
});



window.dispatcher.receiveMessage("rootAssetClicked", () => {

    console.log("rootAssetClicked")


    /// hide journal or preloader
    switch (state) {
        case states.PRELOADER:
            $(".preloader").hide();
        case states.JOURNAL:
            $("#journal").hide();
    }
    state = states.IDLE;
});