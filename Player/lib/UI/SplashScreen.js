let created = false;
let preloaderVisible = true;
let rootAsset;
let divs = [];


export default class SplashScreen {

    static show(_rootAsset) {

        rootAsset = _rootAsset;

        SplashScreen.enabled = true;

        $("#Clappr-container").hide();
        $("#videoPlayer-SplashScreen").show();
        $("#topBar").show();


        /* populate */
        if (!created) {
            created = true;
            const posterFolder = "../data/poster/";
            let images = [];
            var e = $('#splashScreen-div');


            for (let i = 0; i < rootAsset.length; i++) {

                images[i] = posterFolder + rootAsset[i].poster_url;
                var $url = images[i];
                var title = rootAsset[i].title;
                var description = rootAsset[i].description;
                var id = rootAsset[i].id;
                var location = rootAsset[i].location;

                if (i === 0) {
                    divs.push(e);
                } else {
                    var f = e.clone().insertAfter(e);
                    divs.push(f);
                }

                divs[i].data({ id: id });

                divs[i].find('.splashScreen-poster').attr('src', $url);
                divs[i].find('.splashScreen-title').text(title);
                divs[i].find('.splashScreen-location').text(location);
                divs[i].find('.splashScreen-description').text(description);



                divs[i].hover(
                    function() {
                        /* send message */
                        window.dispatcher.sendMessage("splashScreenOver", divs[i].data().id);
                    },
                    function() {
                        /* send message */
                        window.dispatcher.sendMessage("splashScreenExit", divs[i].data().id);
                    });
                divs[i].click(
                    function() {
                        setTimeout(() => {
                            /* send message */
                            window.dispatcher.sendMessage("splashScreenClicked", divs[i].data().id);
                        }, 200)
                    },
                )
            };


            /// use readmore HERE!
            var fontSize = $('.splashScreen-description').css('font-size');
            var lineHeight = Math.floor(parseInt(fontSize.replace('px', '')) * 1.5);
            var numberOfLines = 2;

            new Readmore('.splashScreen-description', {
                speed: 200,
                // lessLink: '<a href="#">Read less</a>',
                collapsedHeight: lineHeight * numberOfLines,
                moreLink: '<button style="width:80px; height:30px; background-color: transparent; border-radius: 5px; border: 1px solid rgb(130, 130, 130); color: rgb(130, 130, 130); text-align: center; text-decoration: none; display: inline-block; font-size: 11px; cursor: pointer;">Mostra altro</button>',
                lessLink: '<button style="width:80px; height:30px; background-color: transparent; border-radius: 5px; border: 1px solid rgb(130, 130, 130); color: rgb(130, 130, 130); text-align: center; text-decoration: none; display: inline-block; font-size: 11px; cursor: pointer;">Mostra meno</button>',
            });

            $(".preloader").fadeOut();
            preloaderVisible = false;
        }
    };



    static hide() {
        // console.log("HIDE...")
        $("#videoPlayer-SplashScreen").hide();
        $("#Clappr-container").show();
    }

    static hideForSingleVideo() {
        if (preloaderVisible) {
            $("#homeButton").hide();
            $("#videoPlayer-SplashScreen").hide();
            $("#Clappr-container").show();
            // $(".preloader").fadeOut();
            preloaderVisible = false;
        }
    }
}

SplashScreen.enabled = false;



/********************************************
Receive messages
********************************************/
let selectedDiv = null;


/// turn on tumbnail
window.dispatcher.receiveMessage("videoAssetOver", (id) => {

    let index;
    for (let i = 0; i < rootAsset.length; i++) {
        if (id == rootAsset[i].id) {
            index = i;
            break;
        }
    }
    selectedDiv = divs[index];
    window.setDivOver(selectedDiv);
});


/// turn off thumbnail
window.dispatcher.receiveMessage("videoAssetExit", () => {
    if (selectedDiv) {
        window.setDivOff(selectedDiv);
    }
});