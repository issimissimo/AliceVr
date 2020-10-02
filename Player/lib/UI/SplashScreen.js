

function slideShowCycle() {
    var $active = $('#videoPlayer-slideshow .active');
    var $next = ($active.next().length > 0) ? $active.next() : $('#videoPlayer-slideshow img:first');
    $next.css('z-index', 1002);//move the next image up the pile
    $active.fadeOut(1500, function () {//fade out the top image
        $active.css('z-index', 1001).show().removeClass('active');//reset the z-index and unhide the image
        $next.css('z-index', 1003).addClass('active');//make the next image the top one
    });
};



let created = false;
let cycle = null;
let rootAsset;
let divs = [];

export default class SplashScreen {

    static show(_rootAsset) {

        rootAsset = _rootAsset;

        SplashScreen.enabled = true;

        $("#videoPlayer-SplashScreen").fadeIn();

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

                if (i === 0) {
                    $('.active').attr('src', $url);
                    divs.push(e);
                }
                else {
                    $("#videoPlayer-slideshow").append("<img src='" + $url + "'></img>");
                    var f = e.clone().insertAfter(e);
                    divs.push(f);
                }

                divs[i].data({ id: id });
                divs[i].find('.splashScreen-poster').attr('src', $url);
                divs[i].find('.splashScreen-title').text(title);
                divs[i].find('.splashScreen-description').text(description);
                divs[i].hover(
                    function () {
                        divs[i].css('background-color', 'rgba(26, 27, 33, 1');

                        /* send message */
                        window.dispatcher.sendMessage("splashScreenOver", divs[i].data().id);
                    },
                    function () {
                        divs[i].css('background-color', 'rgba(26, 27, 33, 0.4');

                        /* send message */
                        window.dispatcher.sendMessage("splashScreenExit", divs[i].data().id);
                    });
                divs[i].click(
                    function () {

                        /* send message */
                        window.dispatcher.sendMessage("splashScreenClicked", divs[i].data().id);
                    },
                )

            }


            // for (let i = 0; i < rootAsset.children.length; i++) {
            //     if (rootAsset.children[i].asset.constructor.name === "Video") {
            //         images[i] = posterFolder + rootAsset.children[i].asset.poster_url;
            //         var $url = images[i];
            //         var title = rootAsset.children[i].asset.title;
            //         var description = rootAsset.children[i].asset.description;
            //         var id = rootAsset.children[i].asset.id;

            //         if (i === 0) {
            //             $('.active').attr('src', $url);
            //             divs.push(e);
            //         }
            //         else {
            //             $("#videoPlayer-slideshow").append("<img src='" + $url + "'></img>");
            //             var f = e.clone().insertAfter(e);
            //             divs.push(f);
            //         }

            //         divs[i].data({ id: id });
            //         divs[i].find('.splashScreen-poster').attr('src', $url);
            //         divs[i].find('.splashScreen-title').text(title);
            //         divs[i].find('.splashScreen-description').text(description);
            //         divs[i].hover(
            //             function () {
            //                 divs[i].css('background-color', 'rgba(26, 27, 33, 1');

            //                 /* send message */
            //                 window.dispatcher.sendMessage("splashScreenOver", divs[i].data().id);
            //             },
            //             function () {
            //                 divs[i].css('background-color', 'rgba(26, 27, 33, 0.4');

            //                 /* send message */
            //                 window.dispatcher.sendMessage("splashScreenExit", divs[i].data().id);
            //             });
            //         divs[i].click(
            //             function () {

            //                 /* send message */
            //                 window.dispatcher.sendMessage("splashScreenClicked", divs[i].data().id);
            //             },
            //         )
            //     }
            // }

            $("#videoPlayer-preloader").fadeOut();
        }


        /* start cycle */
        cycle = setInterval(function () {
            slideShowCycle();
        }, 4000);

    };



    static hide() {
        if (cycle) {
            clearInterval(cycle);
            cycle = null;
        };
        $("#videoPlayer-SplashScreen").fadeOut();
    }
}

SplashScreen.enabled = false;



/********************************************
Receive messages
********************************************/
let selectedDiv = null;
window.dispatcher.receiveMessage("videoAssetOver", function (asset) {
    let index;
    for (let i = 0; i < rootAsset.length; i++) {
        if (asset.title === rootAsset[i].title) {
            index = i;
            break;
        }
    }
    selectedDiv = divs[index];
    selectedDiv.css('background-color', 'rgba(0,0,0,1');
});

window.dispatcher.receiveMessage("videoAssetExit", function () {
    if (selectedDiv){
        selectedDiv.css('background-color', 'rgba(0,0,0,0.4');
    }
});







