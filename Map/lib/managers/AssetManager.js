import Map from "../Map.js";
import Loader from "./Loader.js";
import Player from "./Player.js"

<<<<<<< HEAD
let range = null;
let selectedAsset = null;
let hoverAsset = null;
let navigatorButtonEnabled = true;
let overlayLabelVisible = false;
let rootForPlayer = [];
let flyDuration = 8; //default

=======
>>>>>>> main

export default class AssetManager {

    static states = {
        IDLE: "idle",
        ROOT_SELECTED: 'root',
        VIDEO_SELECTED: 'videoSelected',
        VIDEO_PLAY: "videoPlay"
    }
    static state = states.IDLE;
    static OnChangeStateHandlers = [];






    /////////////////////////////////////
    /// INIT
    /////////////////////////////////////
    static init(_range) {

        range = _range;

        /* create root asset to send with postmessage to the Player */
        for (let i = 0; i < Loader.root.asset.children.length; i++) {
            if (Loader.root.asset.children[i].asset.constructor.name == "Video") {
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
            console.log("- single video in root")
            navigatorButtonEnabled = false;

<<<<<<< HEAD

            selectedAsset = Loader.root.asset;
            flyDuration = 0;
            AssetManager.OnClick_Video();

            // /// wait for map ready
            // (function waitForMapReady() {
            //     if (Map._ready) {
            //         selectedAsset = Loader.root.asset;
            //         flyDuration = 0;
            //         AssetManager.OnClick_Video();
            //     } else {
            //         console.log(".....")
            //         setTimeout(waitForMapReady, 200);
            //     }
            // })();
=======
            selectedAsset = Loader.root.asset;
            flyDuration = 0;
            this.OnClick_Video(selectedAsset);
>>>>>>> main
        }

        /* or, send message for root asset */
        else {
            window.dispatcher.sendMessage("rootAssetClicked", rootForPlayer);
            zoomToAll();
            this.state = this.states.ROOT_SELECTED;
            callbackOnStateChange();
        }
    }


    /////////////////////////////////////
    /// ON CLICK ON VIDEO
    /////////////////////////////////////
    static OnClick_Video(asset) {
        console.log("OnClickVideo")

        this.state = this.states.VIDEO_SELECTED;
        callbackOnStateChange();

<<<<<<< HEAD
    static OnClick_Video() {
        console.log("=> OnClickVideo")

        if (selectedAsset.entity && selectedAsset.entityOver) {
            console.log("- there's entity on selected asset")
            selectedAsset.entity.utils.setOpacity(0.01);
            selectedAsset.entityOver.utils.setOpacity(1);
            selectedAsset.entityOver.utils.setScale(1.2);
            selectedAsset.entityOver.utils.fade(0.01, null, 1000);
            selectedAsset.entityOver.utils.zoom(2, null, 1000);
        } else {
            console.log("!- there's no entity on selected asset!!")
        }


        /* initialize Player */
        Player.init(selectedAsset);

=======
        console.log(asset)

        /* initialize Player */
        Player.init(asset);
>>>>>>> main

        /* fly there */
        Map.camera.flyToBoundingSphere(asset.boundingSphere, {
            offset: new Cesium.HeadingPitchRange(0, -0.5, asset.boundingSphere.radius * 2.5),
            complete: function() {
                console.log("- flying complete");

                Player.showStartPoints();

                Map.fixCamera(asset.boundingSphere.center);
                startCameraRotation();
            },
            duration: flyDuration,
            easingFunction: Cesium.EasingFunction.QUADRACTIC_IN_OUT,
        });

        /* send message */
        const assetForPlayer = {
            title: asset.title,
            description: asset.description,
            poster_url: asset.poster_url,
            video_url1: asset.video_url1,
            video_url2: asset.video_url2,
            video_url3: asset.video_url3,
            subtitles_url: asset.subtitles_url,
            journal_url: asset.journal_url,
            location: asset.location,
        }
        window.dispatcher.sendMessage("videoAssetClicked", assetForPlayer);
    };
};


let range = null;
let selectedAsset = null;
let hoverAsset = null;
let navigatorButtonEnabled = true;
let overlayLabelVisible = false;
let rootForPlayer = [];
let flyDuration = 8; //default



function callbackOnStateChange() {
    console.log("callbackOnStateChange")
    for (let i = 0; i < AssetManager.OnChangeStateHandlers.length; i++) {
        AssetManager.OnChangeStateHandlers[i]();
    }
}


function reset(callback = null) {
    // AssetManager.OnExit(selectedAsset, true);
    stopCameraRotation();

    Player.reset(() => {
        if (callback) callback();
    });
}


function zoomToAll(slow) {

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

        },
        duration: 8,
        easingFunction: Cesium.EasingFunction.QUADRACTIC_IN_OUT,
    });
});



window.dispatcher.receiveMessage("homeButtonClicked", () => {
    console.log("HOMEBUTTONCLICKED")

    if (AssetManager.state != AssetManager.states.ROOT_SELECTED) {

        AssetManager.state = AssetManager.states.ROOT_SELECTED;
        callbackOnStateChange();

        reset(() => {
            selectedAsset = null;
            zoomToAll(true);
        })
        window.dispatcher.sendMessage("rootAssetClicked", rootForPlayer);
    }
});