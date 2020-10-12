let states = {
    PRELOADER: 'preloader',
    JOURNAL: 'journal',
    IDLE: 'idle',
}

let state = states.PRELOADER;


window.dispatcher.receiveMessage("videoAssetClicked", function(asset) {

    /// load and append external html
    $("#journal").empty();

    if (asset.journal_url) {
        let htmlToLoad = asset.journal_url;

        $("#journal").append($('<div>').load("../data/html/" + htmlToLoad, function(responseTxt, statusTxt, xhr) {
            if (statusTxt !== "success") {
                console.error("Something was wrong loading html...")
            } else {

                if (state === states.PRELOADER)
                    $(".preloader").hide();

                state = states.JOURNAL;
                $("#journal").show();
            }
        }));
    }
});



window.dispatcher.receiveMessage("rootAssetClicked", function() {

    /// hide journal or preloader
    switch (state) {
        case states.PRELOADER:
            $(".preloader").hide();
        case states.JOURNAL:
            $("#journal").hide();
    }
    state = states.IDLE;
});

// window.dispatcher.receiveMessage("showGuideWarningForNoTrack", function() {
//     // console.warn("--> showGuideWarningForNoTrack")
//     showWarn();
// });