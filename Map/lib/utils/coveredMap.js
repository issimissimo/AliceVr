import Map from "../Map.js";


export default class coveredMap {
    constructor(debugText = null, debugColor = null) {
        this.points = [];
        this.spheres = [];
        this.debugText = debugText;
        this.debugColor = debugColor;
    };

    check() {
        return new Promise((resolve) => {

            const response = {
                isInside: true,
                position: null,
                radius: null
            };


            /// if the request is too early wait for Map ready,
            /// then create bounding sphere
            if (!Map.ready) {
                let self = this;

                function t() {
                    if (!Map.ready) {
                        setTimeout(t, 200);
                    } else {
                        // response.isInside = false;
                        const pos = Map.getPointFromCamera();
                        const rad = Cesium.Cartesian3.distance(Map.camera.positionWC, pos) / 1.8
                        self.createBoundingSphere(pos, rad, self.debugColor);
                        // resolve(response);
                    }
                };
                t();
                response.isInside = false;
                resolve(response);
            }


            /// proceed
            else {
                // let isInside = true; /// default
                let outsidePoint;


                /// get 5 points from the camera
                let points = [];
                points.push(Map.getPointFromCamera()); /// center
                points.push(Map.getPointFromCamera(Map.canvas.clientWidth * 0.25, Map.canvas.clientHeight * 0.25))
                points.push(Map.getPointFromCamera(Map.canvas.clientWidth * 0.25, Map.canvas.clientHeight * 0.75))
                points.push(Map.getPointFromCamera(Map.canvas.clientWidth * 0.75, Map.canvas.clientHeight * 0.25))
                points.push(Map.getPointFromCamera(Map.canvas.clientWidth * 0.75, Map.canvas.clientHeight * 0.25))


                // if (this.spheres.length === 0) isInside = false;

                /// check if one of these points is outside ALL the spheres
                for (let i = 0; i < points.length; i++) {
                    let checked = 0;
                    for (let ii = 0; ii < this.spheres.length; ii++) {

                        /// handle error
                        if (typeof points[i] === "undefined" || points[i] === undefined) {
                            checked++;
                            break;
                        } else {
                            let dist = Cesium.Cartesian3.distance(points[i], this.spheres[ii].center)
                            if (dist < this.spheres[ii].radius) {
                                checked++;
                            }
                        }
                    }

                    if (checked === 0) {
                        response.isInside = false;
                        response.position = points[i];
                        break;
                    }
                }

                // /// DEBUG
                // if (this.debugText) {
                //     if (response.isInside) console.log("siamo dentro " + this.debugText);
                //     else console.warn("non siamo dentro " + this.debugText);
                // }


                if (!response.isInside) {
                    /// create a new bounding sphere from the outside point
                    response.radius = Cesium.Cartesian3.distance(Map.camera.positionWC, response.position) / 1.8
                    this.createBoundingSphere(response.position, response.radius, this.debugColor);
                }

                resolve(response);
            }
        });
    };


    createBoundingSphere(position, radius, debugColor = null) {

        this.spheres.push(new Cesium.BoundingSphere(position, radius));

        /// DEBUG
        if (debugColor) {

            /// draw debug ellipse
            Map.viewer.entities.add({
                position: position,
                ellipse: {
                    semiMinorAxis: radius,
                    semiMajorAxis: radius,
                    material: debugColor,
                }
            });


            /// draw debug point
            var debugPoint = Map.viewer.entities.add({
                position: position,
                point: {
                    pixelSize: 20,
                    color: Cesium.Color.WHITE
                }
            });

            /// clear point
            setTimeout(function () {
                Map.viewer.entities.remove(debugPoint);
            }, 4000)
        }
    };
};