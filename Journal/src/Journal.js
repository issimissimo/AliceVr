/********************************************
Receive messages
********************************************/
window.dispatcher.receiveMessage("videoAssetClicked", function(asset) {
    init(asset);
});

window.dispatcher.receiveMessage("rootAssetClicked", function() {
    hide();
});

window.dispatcher.receiveMessage("showGuideWarningForNoTrack", function() {
    // console.warn("--> showGuideWarningForNoTrack")
    showWarn();
});



/********************************************
constants
********************************************/
const folder = "../data/html/";
const id = "#journal";



/********************************************
functions
********************************************/
function init(asset) {
    $(id).empty();

    if (asset.journal_url) {

        let htmlToLoad = asset.journal_url;

        /// load and append external html
        $(id).append($('<div>').load(folder + htmlToLoad, function(responseTxt, statusTxt, xhr) {
            if (statusTxt !== "success") {
                console.error("Something was wrong loading html...")
            } else {
                $(".preloader").hide();
            }
        }));
    }
};

function hide() {
    $(id).empty();
}

function showWarn() {
    $('#warnMsg').show();
    setTimeout(function() {
        $('#warnMsg').fadeOut();
    }, 5000);
}