// import {
//     dispatcher
// } from "../../lib/dispatcherNew.js";
// import Map from "../lib/Map.js";
// import * as cities from "../lib/add-on/cities.js";
// import Loader from "../lib/managers/Loader.js"
// import AssetManager from "../lib/managers/AssetManager.js"
// import Preloader from "../lib/UI/Preloader.js";


console.log("FFFFFFFF")
console.log(window.AAA)
window.BBB();
window.CCC.test();
setTimeout(function(){
    window.dispatcher.sendMessage("mapReady");
}, 2000)


/*******************************************
*********** ON MAP STARTED
*******************************************/
Map.onStarted.push(() => {


    /* get URL parameters from Map.html (derived from index.html) */
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const idToLoad = urlParams.get('id')
    // console.log(idToLoad);





    /* init preloader DIV */
    Preloader.init();

    /* load main asset */
    // const idToLoad = "1573827877573";
    // const idToLoad = "1579530506349";
    // const idToLoad = "1573827851085";
    // const idToLoad = "1570451964288";
    // const idToLoad = "main";

    Loader.load(idToLoad, () => {

        // console.log(Loader.root.asset)

        let range = Loader.root.asset.boundingSphere.radius * 3;
        // let range = 140000;

        AssetManager.init(range);

        // /// DEBUG : show circle
        // Ellipse.draw(Loader.root.asset.boundingSphere.center, "ORANGE", Loader.root.asset.boundingSphere.radius);
        // Ellipse.draw(Loader.root.asset.boundingSphere.center, "BLUE", 100);


        /* load cities from boundingsphere position - radius */
        cities.init(Loader.root.asset.boundingSphere.center, range);
    });
})



/*******************************************
*********** ON MAP READY
*******************************************/
Map.onReady.push(function () {

    console.log("map ready!")
    window.dispatcher.sendMessage("mapReady");

    /* change Map changed sensitivity */
    Map.camera.percentageChanged = 0.3; /// default 0.5
})







/*******************************************
*********** INIT
*******************************************/
Map.init();