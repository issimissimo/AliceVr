import Map from "../Map.js";
import Label from "../entities/Label.js";
import coveredMap from "../utils/coveredMap.js"



let isServerAvailable = true; /// does the webserver can accept a new request?
const serverRequestTimeout = 1000; /// time to wait from each request to the webserver
let cities = [];
let bigArea; /// the area that have been covered for big cities
let mediumArea; /// the area that have been covered for small cities
let smallArea; /// the area that have been covered for small cities
let wait = null; /// the setTimeout to process the request
let started = false;






///////////////////////////////////////
/// load cities by population
///////////////////////////////////////
export function loadCitiesByPopulation(minPopulation, position = null, radius = null, callback = null) {
    loadCities(minPopulation, position, radius, callback);
}




///////////////////////////////////////
/// load big cities 
///////////////////////////////////////
export function loadBigCities(position, range, callback = null) {
    loadCities(500000, position, range, function () {
        loadCities(100000, position, range, function () {
            loadCities(50000, position, range, function () {
                if (callback) callback();
            });
        });
    });
};





////////////////////////////////////////////
/// start to a specified position / range,
/// next automate the loading as camera move
////////////////////////////////////////////
export function init(position = null, range = null) {

    if (!started) {
        started = true;

        bigArea = new coveredMap("bigArea");
        mediumArea = new coveredMap("mediumArea");
        smallArea = new coveredMap("smallArea");

        onCameraChanged(position, range);

        /// add listener
        Map.onReady.push(function () {
            Map.camera.changed.addEventListener(() => {
                onCameraChanged();
            });
        })

    } else {
        console.warn("cities already started");
    }
};




function onCameraChanged(position = null, range = null) {

    let _range = range ? range : Map.range;


    bigArea.check()
        .then((response) => {
            if (!response.isInside) {
                console.log("> load big cities <");
                loadBigCities(response.position ? response.position : position,
                    response.range ? response.range : range, () => {

                        ///Load medium and small cities
                        if (_range <= 100000) {
                            mediumArea.check()
                                .then((response) => {
                                    if (!response.isInside) {
                                        console.log("> load small cities <");
                                        loadCities(10000, response.position ? response.position : position,
                                            response.range ? response.range : range,
                                            () => {
                                                if (_range <= 55000) {
                                                    smallArea.check()
                                                        .then((response) => {
                                                            if (!response.isInside) {
                                                                console.log("> load very small cities <");
                                                                loadCities(1000, response.position ? response.position : position,
                                                                    response.range ? response.range : range);
                                                            }
                                                        });
                                                }
                                            });
                                    } else {
                                        if (_range <= 55000) {
                                            smallArea.check()
                                                .then((response) => {
                                                    if (!response.isInside) {
                                                        console.log("> load very small cities <");
                                                        loadCities(1000, response.position ? response.position : position,
                                                            response.range ? response.range : range);
                                                    }
                                                });
                                        }
                                    }
                                });
                        }


                    });
            }
            else {

                ///Load medium and small cities
                if (_range <= 100000) {
                    mediumArea.check()
                        .then((response) => {
                            if (!response.isInside) {
                                console.log("> load small cities <");
                                loadCities(10000, response.position ? response.position : position,
                                    response.range ? response.range : range,
                                    () => {
                                        if (_range <= 55000) {
                                            smallArea.check()
                                                .then((response) => {
                                                    if (!response.isInside) {
                                                        console.log("> load very small cities <");
                                                        loadCities(1000, response.position ? response.position : position,
                                                            response.range ? response.range : range);
                                                    }
                                                });
                                        }
                                    });
                            } else {
                                if (_range <= 55000) {
                                    smallArea.check()
                                        .then((response) => {
                                            if (!response.isInside) {
                                                console.log("> load very small cities <");
                                                loadCities(1000, response.position ? response.position : position,
                                                    response.range ? response.range : range);
                                            }
                                        });
                                }
                            }
                        });
                }


            }
        });




    // if (_range <= 100000) {
    //     mediumArea.check()
    //         .then((response) => {
    //             if (!response.isInside) {
    //                 console.log("> load small cities <");
    //                 loadCities(10000, response.position ? response.position : position,
    //                     response.range ? response.range : range,
    //                     () => {
    //                         if (_range <= 55000) {
    //                             smallArea.check()
    //                                 .then((response) => {
    //                                     if (!response.isInside) {
    //                                         console.log("> load very small cities <");
    //                                         loadCities(1000, response.position ? response.position : position,
    //                                             response.range ? response.range : range);
    //                                     }
    //                                 });
    //                         }
    //                     });
    //             } else {
    //                 if (_range <= 55000) {
    //                     smallArea.check()
    //                         .then((response) => {
    //                             if (!response.isInside) {
    //                                 console.log("> load very small cities <");
    //                                 loadCities(1000, response.position ? response.position : position,
    //                                     response.range ? response.range : range);
    //                             }
    //                         });
    //                 }
    //             }
    //         });
    // }
}





// function onCameraChanged(position = null, range = null) {

//     let _range = range ? range : Map.range;

//     if (!bigArea.isCovered()) {
//         console.log("> load big cities <")
//         loadBigCities(position, range);
//     }

//     if (_range <= 100000) {

//         if (!mediumArea.isCovered()) {
//             console.log("> load small cities <")
//             loadCities(10000, position, range, function () {

//                 // if (range <= 55000 && !smallArea.isCovered()) {
//                 //     console.log("> load very small cities <")
//                 //     // loadCitiesByPopulation(1000);
//                 // }
//             });
//         } else {
//             if (_range <= 55000 && !smallArea.isCovered()) {
//                 console.log("> load very small cities <")
//                 loadCities(1000, position, range);
//             }
//         }

//     }
// }


const queueManager = (minPopulation, position, range, callback) => {
    let waitForRequest = function () {
        setTimeout(() => {
            if (wait) {
                waitForRequest();
            }
            else {
                console.warn("! --> cities request resumed from queue");
                loadCities(minPopulation, position, range, callback);
            }
        }, 200);
    }
    waitForRequest();
};



/// main function
function loadCities(minPopulation, position = null, range = null, callback = null) {

    // return;

    /// if there's a previous request...
    if (wait) {
        console.warn("! --> cities request not allowed because there's another one in queue");
        queueManager(minPopulation, position, range, callback);
    } else {
        wait = function () {
            if (!isServerAvailable) setTimeout(wait, 100);

            else {
                wait = null;

                let radius = range ? range / 2000 : Map.range / 2000;
                /// if the radius is < 1km don't request
                if (radius <= 1) {
                    console.warn("camera too near to terrain, don't request cities");
                } else {
                    /// get the coordinates in the center of the window
                    let _position = position ? position : Map.getPointFromCamera();

                    let cartographic = Cesium.Cartographic.fromCartesian(_position);
                    let longitude = Cesium.Math.toDegrees(cartographic.longitude);
                    let latitude = Cesium.Math.toDegrees(cartographic.latitude);
                    console.info("? - looking for cities with min population = " + minPopulation);

                    getDataFromWebServer(minPopulation, latitude, longitude, radius, callback);
                }
            }
        }
        wait();
    }
}




/// actually get data from https://rapidapi.com/wirefreethought/api/geodb-cities/details
function getDataFromWebServer(minPopulation, latitude, longitude, radius, callback) {

    let data = null;
    let xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            let allObj = JSON.parse(this.responseText);
            let data = allObj.data;

            /// handle the error from webserver
            if (data === undefined) {
                console.error("error loading cities from webserver");
                isServerAvailable = true;
                return;
            }
            if (data.length === 0) {
                console.info("! -- no cities with " + minPopulation + " people in this area");
            }


            /// create labels of the cities
            for (let i = 0; i < data.length; i++) {
                let result = data[i];

                if (result.type === "CITY") {

                    /// check if this city is already loaded
                    if (!cities.includes(result.city)) {
                        cities.push(result.city);

                        let category;
                        if (minPopulation >= 500000) category = "A1";
                        if (minPopulation >= 100000 && minPopulation < 500000) category = "A2";
                        if (minPopulation >= 50000 && minPopulation < 100000) category = "A3";
                        if (minPopulation >= 10000 && minPopulation < 50000) category = "A4";
                        if (minPopulation < 10000) category = "A5";

                        let position = Cesium.Cartesian3.fromDegrees(result.longitude, result.latitude);

                        /// draw the label!
                        /// TEMPORARY DISABLE A1 CATEGORY!!!
                        if (category !== "A1")
                            Label.draw(position, result.city, category)

                        console.info("--- new city: " + result.city);
                    }
                    // else {
                    //     console.info("refused city: " + result.city);
                    // }
                }
            }

            /// wait serverRequestDelay for the callback
            setTimeout(function () {
                isServerAvailable = true;
                if (callback) callback();
            }, serverRequestTimeout);
        }
    });


    xhr.open("GET", "https://wft-geo-db.p.rapidapi.com/v1/geo/locations/%2B" + latitude + "%2B" +
        longitude + "/nearbyCities?limit=10&languageCode=it&minPopulation=" + minPopulation + "&radius=" + radius + "&types=CITY");
    xhr.setRequestHeader("x-rapidapi-host", "wft-geo-db.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "ce699b059emshab8963e751a141dp1fb327jsn457d60aff686");
    xhr.send(data);
    isServerAvailable = false;
}