import Map from "../Map.js";
import Loader from "./Loader.js";
import Player from "./Player.js"

let range = null;
let selectedAsset = null;
let hoverAsset = null;
let navigatorButtonEnabled = true;
let overlayLabelVisible = false;
let rootForPlayer = [];
let flyDuration = 8; //default

let interval;

export default class AssetManager {

    static init(_range) {

        range = _range;

        // console.log("init")
        // zoomToAll();

        ////////////////////////////////////////////////////////////////
        ///create root asset to send with postmessage to the Player!
        ////////////////////////////////////////////////////////////////

        for (let i = 0; i < Loader.root.asset.children.length; i++) {
            if (Loader.root.asset.children[i].asset.constructor.name == "Video") {
                // console.log(Loader.root.asset.children[i].asset)
                const rootAsset = {
                    id: Loader.root.asset.children[i].asset.id,
                    title: Loader.root.asset.children[i].asset.title,
                    description: Loader.root.asset.children[i].asset.description,
                    poster_url: Loader.root.asset.children[i].asset.poster_url,
                    location: Loader.root.asset.children[i].asset.location,

                };
                rootForPlayer.push(rootAsset);
            }
        };

        /* if there's only one video asset
        click it */
        if (Loader.root.asset.constructor.name == "Video") {
            console.log("ONLY 1 video")
            navigatorButtonEnabled = false;

            // interval = setInterval(() => {
            //     if (Map._ready) {
            //         clearInterval(interval);
            //         console.log("done")
            //         selectedAsset = Loader.root.asset;
            //         flyDuration = 0;
            //         AssetManager.OnClick_Video();
            //     } else {
            //         console.log(".....")
            //     }
            // }, 200);


            selectedAsset = Loader.root.asset;
            flyDuration = 0;
            AssetManager.OnClick_Video();



        }
        /* or, send message for root asset */
        else {
            window.dispatcher.sendMessage("rootAssetClicked", rootForPlayer);

            zoomToAll();
        }


        // /// set the listener for the map loading ready to receive data
        // setTimeout(() => {
        //     Map.checkForTileLoadProgressEvent = true;
        //     console.log("ADESSSOO...")
        // }, 200)


        /* HOME button
         ***************/
        // $('#homeButton').hover(
        //     function() {
        //         $(this).attr('src', 'images/icon_home_on.svg');
        //     },
        //     function() {
        //         $(this).attr('src', 'images/icon_home_off.svg');
        //     }
        // );


        // $('#homeButton').click(
        //     function() {
        //         console.log("HOME")
        //         $(this).fadeOut();
        //         // selectedAsset.entityClicked.utils.setOpacity(0.01);
        //         reset(() => {
        //             selectedAsset = null;
        //             hoverAsset = null;
        //             zoomToAll(true);
        //         })

        //         /* send message for root asset */
        //         window.dispatcher.sendMessage("rootAssetClicked", rootForPlayer);
        //     }
        // );


        if (!WURFL.is_mobile) {

            Map.onOverEntity.push((entity) => {

                if (entity.id.category === "PLACEHOLDER-VIDEO") {
                    // console.log("ENTER VIDEO")
                    const asset = Loader.root.getAssetById(entity.id.asset.id);
                    // console.log(asset)
                    AssetManager.OnOver(asset);
                }
            });

            Map.onExitEntity.push((entity) => {

                if (entity.id.category === "PLACEHOLDER-VIDEO" ||
                    entity.id.category === "PLACEHOLDER-VIDEO-OVER") {

                    // console.log("EXIT VIDEO")
                    const asset = typeof entity.asset === "undefined" ?
                        Loader.root.getAssetById(entity.id.asset.id) :
                        Loader.root.getAssetById(entity.asset.id);

                    AssetManager.OnExit(asset);
                }
            });
        }


        Map.onClickEntity.push((entity) => {

            if (entity.id.category === "PLACEHOLDER-VIDEO-OVER") {
                // console.log("CLICK VIDEO")
                $("#homeButton").fadeIn();


                if (overlayLabelVisible) {
                    $('#overlayLabel').fadeOut(1000);
                    overlayLabelVisible = false;
                }



                if (selectedAsset) {
                    // selectedAsset.entityClicked.utils.fade(0.01);

                    reset(() => {
                        selectedAsset = typeof entity.asset === "undefined" ?
                            Loader.root.getAssetById(entity.id.asset.id) :
                            Loader.root.getAssetById(entity.asset.id);

                        AssetManager.OnClick_Video();
                    });
                } else {
                    selectedAsset = typeof entity.asset === "undefined" ?
                        Loader.root.getAssetById(entity.id.asset.id) :
                        Loader.root.getAssetById(entity.asset.id);

                    AssetManager.OnClick_Video();
                }
            }





            if (entity.id.category === "PLACEHOLDER-VIDEO-CLICKED") {

                AssetManager.OnClick_Video_Play()
            }





        });
    }


    static OnOver(asset) {
        // const asset = Loader.root.getAssetById(entity.id.asset.id);
        if (asset !== hoverAsset && asset !== selectedAsset) {
            // console.log("OVERRRRRRRRRRRRR")
            asset.entity.utils.fade(0.01);
            asset.entity.utils.zoom(1.2);
            asset.entityOver.utils.fade(1.0);
            asset.entityOver.utils.zoom(1.2);
            hoverAsset = asset;


            var htmlOverlay = document.getElementById('overlayLabel');
            var scratch = new Cesium.Cartesian2();
            Map.viewer.scene.preRender.addEventListener(function() {
                var position = asset.entity.position._value;
                var canvasPosition = Map.viewer.scene.cartesianToCanvasCoordinates(position, scratch);
                if (Cesium.defined(canvasPosition)) {
                    htmlOverlay.style.top = (canvasPosition.y + 20) + 'px';
                    htmlOverlay.style.left = (canvasPosition.x + 20) + 'px';
                    $('#overlayLabel').find(".overlayLabel-bold").text(asset.title)
                    $('#overlayLabel').find(".overlayLabel-light").text(asset.location)
                }
            });

            $('#overlayLabel').show();
            overlayLabelVisible = true;


            // /* send message */
            // const assetForPlayer = {
            //         title: asset.title,
            //     }
            // window.dispatcher.sendMessage("videoAssetOver", assetForPlayer);
        }
    };


    static OnExit(asset, forced = false) {
        if (asset) {
            if (asset !== selectedAsset || forced) {
                // console.log("EXITTTTTTTTT")
                // console.log(asset)
                asset.entity.utils.fade(1);
                asset.entity.utils.zoom(1);
                asset.entityOver.utils.fade(0.1);
                asset.entityOver.utils.zoom(1, () => {
                    hoverAsset = null;
                });

                $('#overlayLabel').hide();
                overlayLabelVisible = false;

                /* send message */
                window.dispatcher.sendMessage("videoAssetExit");
            }
        }
    };


    static OnClick_Video() {
        console.log("OnClickVideo")
            // console.log(flyDuration)

        if (selectedAsset.entity && selectedAsset.entityOver) {
            selectedAsset.entity.utils.setOpacity(0.01);
            selectedAsset.entityOver.utils.setOpacity(1);
            selectedAsset.entityOver.utils.setScale(1.2);
            selectedAsset.entityOver.utils.fade(0.01, null, 1000);
            selectedAsset.entityOver.utils.zoom(2, null, 1000);
        }


        /* initialize Player */
        Player.init(selectedAsset);

        console.log(selectedAsset)

        /* fly there */
        Map.camera.flyToBoundingSphere(selectedAsset.boundingSphere, {
            offset: new Cesium.HeadingPitchRange(0, -0.5, selectedAsset.boundingSphere.radius * 2.5),
            complete: function() {
                console.log("FLYING COMPLETE");

                Player.showStartPoints();

                Map.fixCamera(selectedAsset.boundingSphere.center);
                startCameraRotation();

                // selectedAsset.entityClicked.utils.fade(1);
                // selectedAsset.entityClicked.utils.setScale(1);
            },
            duration: flyDuration,
            easingFunction: Cesium.EasingFunction.QUADRACTIC_IN_OUT,
        });

        /* send message */
        const assetForPlayer = {
            title: selectedAsset.title,
            description: selectedAsset.description,
            poster_url: selectedAsset.poster_url,
            video_url1: selectedAsset.video_url1,
            video_url2: selectedAsset.video_url2,
            video_url3: selectedAsset.video_url3,
            subtitles_url: selectedAsset.subtitles_url,
            journal_url: selectedAsset.journal_url,
            location: selectedAsset.location,
        }
        window.dispatcher.sendMessage("videoAssetClicked", assetForPlayer);
    };




    static OnClick_Video_Play() {

        // selectedAsset.entityClicked.utils.fade(0.01, null, 1000);

        /* send message */
        window.dispatcher.sendMessage("videoPlayerPlay");



    };



};

// let range = null;
// let selectedAsset = null;
// let hoverAsset = null;
// let navigatorButtonEnabled = true;
// let overlayLabelVisible = false;



function reset(callback = null) {
    AssetManager.OnExit(selectedAsset, true);
    stopCameraRotation();

    Player.reset(() => {
        if (callback) callback();
    });
}


function zoomToAll(slow) {

    // console.log("zoom to all")

    stopCameraRotation();

    const duration = slow ? null : 0;
    // const range = 140000;
    Map.camera.flyToBoundingSphere(Loader.root.asset.boundingSphere, {
        offset: new Cesium.HeadingPitchRange(0, -1.47, range),
        duration: duration,
    });
};




let rotateInterval = null;

function startCameraRotation() {
    rotateInterval = setInterval(function() {
        Map.camera.rotateLeft(0.0015);
    }, 50);
};

function stopCameraRotation() {
    if (rotateInterval) {
        Map.unfixCamera();
        clearInterval(rotateInterval);
        rotateInterval = null;
    }
};


Map.onDown.push(function() {
    stopCameraRotation();
})



/*****************
messages receivers
******************/
window.dispatcher.receiveMessage("playerStarted", () => {
    // selectedAsset.entityClicked.utils.fade(0.01, null, 1000);
    // selectedAsset.entityClicked.utils.zoom(2, null, 1000);
    stopCameraRotation();
});

window.dispatcher.receiveMessage("playerEnded", () => {

    /* fly there */
    Map.camera.flyToBoundingSphere(selectedAsset.boundingSphere, {
        offset: new Cesium.HeadingPitchRange(0, -0.5, selectedAsset.boundingSphere.radius * 2),
        complete: function() {
            // console.log("FLYING COMPLETE");

            Player.showStartPoints();

            Map.fixCamera(selectedAsset.boundingSphere.center);
            startCameraRotation();

            // selectedAsset.entityClicked.utils.fade(1);
            // selectedAsset.entityClicked.utils.setScale(1);
        },
        duration: 8,
        easingFunction: Cesium.EasingFunction.QUADRACTIC_IN_OUT,
    });
});

window.dispatcher.receiveMessage("splashScreenOver", (id) => {
    const asset = Loader.root.getAssetById(id);
    AssetManager.OnOver(asset);

});

window.dispatcher.receiveMessage("splashScreenExit", (id) => {
    const asset = Loader.root.getAssetById(id);
    AssetManager.OnExit(asset);
});

window.dispatcher.receiveMessage("splashScreenClicked", (id) => {
    $("#homeButton").fadeIn();

    if (overlayLabelVisible) {
        $('#overlayLabel').fadeOut(1000);
        overlayLabelVisible = false;
    }

    if (selectedAsset) {
        // selectedAsset.entityClicked.utils.fade(0.01, null, 1000);
        // selectedAsset.entityClicked.utils.zoom(2, null, 1000);
        reset(() => {
            selectedAsset = Loader.root.getAssetById(id);
            AssetManager.OnClick_Video();
        });
    } else {
        selectedAsset = Loader.root.getAssetById(id);
        AssetManager.OnClick_Video();
    }
});

window.dispatcher.receiveMessage("homeButtonClicked", () => {
    console.log("HOMEBUTTONCLICKED")
    if (selectedAsset) {
        if (selectedAsset.entityClicked) {
            selectedAsset.entityClicked.utils.setOpacity(0.01);
        }

        reset(() => {
            selectedAsset = null;
            hoverAsset = null;
            zoomToAll(true);
        })
        window.dispatcher.sendMessage("rootAssetClicked", rootForPlayer);
    }

    // reset(() => {
    //     selectedAsset = null;
    //     hoverAsset = null;
    //     zoomToAll(true);
    // })
    // window.dispatcher.sendMessage("rootAssetClicked", rootForPlayer);
});