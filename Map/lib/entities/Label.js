import {
    stringDivider
} from "../../../lib/stringDivider.js";
import Map from "../Map.js";
import {
    Maf
} from "../../../lib/Maf.js"


const entityCollection = [];

Map.onReady.push(() => {
    for (let i = 0; i < entityCollection.length; i++) {
        updateOpacity(entityCollection[i]);
    }
});


function updateOpacity(entity) {
    if (Map.ready) {
        let minRange = Map.range;
        let maxRange = minRange * 4;
        let pos = entity.position._value;
        let dist = Cesium.Cartesian3.distance(Map.viewer.camera.positionWC,
            pos);

        /// get multiplier by min-max range
        let rangeMult = 1 - Maf.inverseLerp(minRange, maxRange,
            Cesium.Math.clamp(dist, minRange, maxRange));

        /// get multiplier by min-max distance
        let distMult = 1 - Maf.inverseLerp(entity.minDistance, entity
            .maxDistance,
            Cesium.Math.clamp(dist, entity.minDistance, entity.maxDistance));

        entity.opacity = rangeMult * distMult;
    } else {
        entity.opacity = 0;
    }
}




function getPropertiesFromCategory(category) {
    let properties = {
        font: "15px Helvetica",
        outlineWidth: 2,
        fillColor: new Cesium.Cartesian3(1, 1, 1),
        outlineColor: new Cesium.Cartesian3(0, 0, 0),
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
        pixelOffset: new Cesium.Cartesian2(0, -5),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        minDistance: 50000,
        maxDistance: 800000,
    };

    switch (category) {
        case "A1":
            properties.font = WURFL.is_mobile ? "16px Helvetica" : "18px Helvetica";
            properties.outlineWidth = 2;
            properties.minDistance = 800000;
            properties.maxDistance = 2000000;
            break;
        case "A2":
            properties.font = WURFL.is_mobile ? "14px Helvetica" : "16px Helvetica";
            properties.outlineWidth = 2;
            properties.minDistance = 170000;
            properties.maxDistance = 800000;
            break;
        case "A3":
            properties.font = WURFL.is_mobile ? "13px roboto-medium" : "15px roboto-medium";
            properties.outlineWidth = 2;
            properties.minDistance = 130000;
            properties.maxDistance = 500000;
            break;
        case "A4":
            properties.font = WURFL.is_mobile ? "10px Helvetica" : "13px Helvetica";
            properties.outlineWidth = 2;
            properties.minDistance = 50000;
            properties.maxDistance = 70000;
            break;
        case "A5":
            properties.font = WURFL.is_mobile ? "9px Helvetica" : "12px Helvetica";
            properties.outlineWidth = 2;
            properties.minDistance = 35000;
            properties.maxDistance = 45000;
            break;
        case "BIG_PARK":
            properties.font = WURFL.is_mobile ? "11px Helvetica" : "13px Helvetica";
            properties.outlineWidth = 2;
            properties.fillColor = new Cesium.Cartesian3(0.5, 1, 0.5);
            properties.minDistance = 50000;
            properties.maxDistance = 70000;
            break;
        case "BLUE":
            properties.font = WURFL.is_mobile ? "11px roboto-bold" : "13px roboto-bold";
            properties.outlineWidth = 2;
            properties.fillColor = new Cesium.Cartesian3(0.6, 0.8, 1);
            properties.minDistance = 130000;
            properties.maxDistance = 500000;
            break;
        case "GREEN":
            properties.font = WURFL.is_mobile ? "11px roboto-bold" : "13px roboto-bold";
            properties.outlineWidth = 2;
            properties.fillColor = new Cesium.Cartesian3(0.7, 1, 0.8);
            properties.minDistance = 130000;
            properties.maxDistance = 500000;
            break;
    }

    return properties;
};





export default class Label {

    /// DRAW
    static draw(position, text, category, collection = null) {

        const properties = getPropertiesFromCategory(category)

        if (text.length > 15) text = stringDivider(text, 15);

        // const entity = Map.viewer.entities.add({
        //     opacity: 0, /// default value at start
        //     minDistance: properties.minDistance,
        //     maxDistance: properties.maxDistance,
        //     fillColor: properties.fillColor,
        //     outlineColor: properties.outlineColor,
        //     position: position,
        //     category: category,
        //     selectable: false,
        //     label: {
        //         text: text,
        //         font: properties.font,
        //         fillColor: new Cesium.CallbackProperty(function() {
        //             return new Cesium.Color(entity.fillColor.x, entity.fillColor.y, entity.fillColor.z, entity.opacity)
        //         }, false),
        //         outlineColor: new Cesium.CallbackProperty(function() {
        //             return new Cesium.Color(entity.outlineColor.x, entity.outlineColor.y, entity.outlineColor.z, entity.opacity)
        //         }, false),
        //         outlineWidth: properties.outlineWidth,
        //         style: properties.style,
        //         verticalOrigin: properties.verticalOrigin,
        //         heightReference: properties.heightReference,
        //         pixelOffset: properties.pixelOffset,
        //         disableDepthTestDistance: properties.disableDepthTestDistance,
        //     }
        // });


        const entity = Map.viewer.entities.add({
            opacity: 0, /// default value at start
            minDistance: properties.minDistance,
            maxDistance: properties.maxDistance,
            fillColor: properties.fillColor,
            outlineColor: properties.outlineColor,
            position: position,
            category: category,
            selectable: false,
            label: {
                text: text,
                font: properties.font,
                fillColor: new Cesium.CallbackProperty(function() {
                    return new Cesium.Color(entity.fillColor.x, entity.fillColor.y, entity.fillColor.z, entity.opacity)
                }, false),
                outlineColor: new Cesium.CallbackProperty(function() {
                    return new Cesium.Color(entity.outlineColor.x, entity.outlineColor.y, entity.outlineColor.z, entity.opacity)
                }, false),
                outlineWidth: properties.outlineWidth,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                verticalOrigin: properties.verticalOrigin,
                heightReference: properties.heightReference,
                pixelOffset: properties.pixelOffset,
                // disableDepthTestDistance: properties.disableDepthTestDistance,
            },
        });




        if (collection) collection.push(entity);

        entityCollection.push(entity);

        /// register the listener to camerachanged, 
        /// to update this label opacity
        Map.camera.changed.addEventListener(() => {
            updateOpacity(entity);
        });

        /// update opacity immediately
        updateOpacity(entity);

        return entity;
    };


    /// REMOVE
    static remove(entity) {

        Map.viewer.entities.remove(entity);
    };
};