import Map from "../Map.js";
import {
    Maf
} from "../../../lib/Maf.js"



/// set the range
var minRange = 25000;
var maxRange = 75000;
var globalOpacity = 0;
var globalWidth = 1;



Map.onReady.push(function () {
    update();

    Map.camera.changed.addEventListener(() => {
        update();
    });
});



function update() {
    let r = Maf.clamp(Map.range, minRange, maxRange);
    globalOpacity = Maf.inverseLerp(maxRange, minRange, r);
    globalWidth = Maf.inverseLerp(maxRange * 2, minRange, r);
};





function getPropertiesFromCategory(category) {
    let properties = {
        clampToGround: true,
        width: 5,
        outlineWidth: 2,
        opacity: 1,
        color: new Cesium.Cartesian3(1, 1, 1),
        outlineColor: new Cesium.Cartesian3(0, 0, 0),
        show: true,
    };

    if (category) {

        /* for mobile */
        if (WURFL.is_mobile) {
            properties.show = false;
        };

        
        switch (category) {

            case "TRACK":
                properties.width = 5;
                properties.outlineWidth = 2;
                properties.color = new Cesium.Cartesian3(0.26, 0.52, 0.96);
                properties.opacity = 1;
                break;

            case "ROUTE":
                properties.width = 5;
                properties.outlineWidth = 2;
                properties.color = new Cesium.Cartesian3(0.26, 0.52, 0.96);
                properties.opacity = 0.5;
                break;

            case "TRANSPARENT":
                properties.opacity = 0;
                properties.width = 25;
                properties.outlineWidth = 0;
                break;
        }
    }
    return properties;
}





export default class Polyline {

    /// DRAW
    static draw(positions, category = null, collection = null,
        onOverFunc = null, onExitFunc = null, onClickFunc = null) {

        const properties = getPropertiesFromCategory(category);

        const entity = Map.viewer.entities.add({
            opacity: properties.opacity, /// change this value to set the opacity individually
            color: properties.color,
            outlineColor: properties.outlineColor,
            width: properties.width,
            category: category,
            selectable: false,
            polyline: {
                positions: positions,
                clampToGround: properties.clampToGround,
                // width: properties.width,
                width: 5,

                //// tooo slow.....
                // width: new Cesium.CallbackProperty(function () {
                //     return entity.width * globalWidth;
                // }, false),

                material: new Cesium.PolylineOutlineMaterialProperty({
                    color: new Cesium.CallbackProperty(function () {
                        return new Cesium.Color(0, 1, 0, entity.opacity * globalOpacity)
                    }),
                    outlineWidth: properties.outlineWidth,
                    outlineColor: new Cesium.CallbackProperty(function () {
                        return new Cesium.Color(entity.outlineColor.x, entity.outlineColor.y, entity.outlineColor.z, entity.opacity * globalOpacity)
                    }),
                }),
                // show: properties.show,
                show: true,
            }
        });

        if (collection) collection.push(entity);
        if (onOverFunc) Map.onOverEntity.push(onOverFunc);
        if (onExitFunc) Map.onExitEntity.push(onExitFunc);
        if (onClickFunc) Map.onClickEntity.push(onClickFunc);

        return entity;
    }
};