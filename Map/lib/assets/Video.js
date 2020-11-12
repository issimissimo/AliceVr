import Asset from "./Asset.js";
import Billboard from "../entities/Billboard.js";
import * as jsUtils from "../../../lib/jsUtils.js";
import * as entityUtils from "../utils/entity_utils.js";
import AssetManager from "../managers/AssetManager.js";
import Map from "../Map.js";


export default class Video extends Asset {
    constructor(id, xml, parent = null) {
        super(id, parent);
        this.entity = null;
        this.entityOver = null;
        this.entityClicked = null;
        this.markers = [];
        this.setup(xml);
    };

    setup(xml) {

        const keys = ["owner", "title", "description", "date", "video_url1", "video_url2", "video_url3",
            "location", "poster_url", "markers_url", "subtitles_url", "journal_url"
        ];

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i]
            this[key] = null;
            if (xml.getElementsByTagName(key).length > 0) {
                if (xml.getElementsByTagName(key)[0].childNodes.length > 0) {
                    this[key] = xml.getElementsByTagName(key)[0].childNodes[0].nodeValue;
                }
            }
        };

        /* load markers */
        if (this.markers_url) {
            Asset.boundingSphereLoading++;
            // console.log(Asset.boundingSphereLoading)

            const coordForBoundigSphere = [];
            const keys = ["longitude", "latitude", "title", "gpxTime", "timecode", "trackToFollow"];

            jsUtils.loadXml(`../data/xml/${this.markers_url}`)
                .then((xml) => {

                    /* create marker */
                    let xmlElem = xml.getElementsByTagName("marker");
                    for (let i = 0; i < xmlElem.length; i++) {
                        let elem = {};
                        for (let ii = 0; ii < keys.length; ii++) {
                            let key = keys[ii]
                            elem[key] = null;
                            if (xmlElem[i].getElementsByTagName(key).length > 0) {
                                if (xmlElem[i].getElementsByTagName(key)[0].childNodes.length > 0) {
                                    elem[key] = xmlElem[i].getElementsByTagName(key)[0].childNodes[0].nodeValue;
                                };
                            };
                        };
                        if (elem.timecode) elem.timecode = jsUtils.convertTimeCodeToSeconds(elem.timecode);
                        if (elem.gpxTime) elem.gpxTime = new Date(Date.parse(elem.gpxTime)).getTime();
                        if (elem.trackToFollow) elem.trackToFollow = parseInt(elem.trackToFollow) - 1;

                        this.markers[i] = elem;

                        /* get coordinates for this video
                        boundingSphere from longitude-latitude
                        (it means that this video has no tracks) */
                        if (elem.longitude && elem.latitude && !elem.gpxTime) {
                            coordForBoundigSphere.push(elem.longitude, elem.latitude)
                        };
                    };

                    if (coordForBoundigSphere.length > 0) {
                        let positions = Cesium.Cartesian3.fromDegreesArray(coordForBoundigSphere);
                        let boundingSphere = new Cesium.BoundingSphere.fromPoints(positions);
                        Asset.boundingSphereLoading--;

                        this.addBoundingSphere(boundingSphere);

                    } else Asset.boundingSphereLoading--;
                });
        };
    };

    /* extend default */
    addBoundingSphere(bdReceived) {
        super.addBoundingSphere(bdReceived);

        /* create billboard */
        const asset = { id: this.id };
        if (!this.entity) {
            this.entity = Billboard.draw(this.boundingSphere.center, "PLACEHOLDER-VIDEO");
            this.entity.asset = asset;
            this.entity.utils = new entityUtils.Utils(this.entity);

            /// on over
            Map.onOverEntity.push((entity) => {
                if (entity.id.asset.id == this.id) {
                    this.entity.billboard.image = "images/billboards/icon_placeholder-video_on.svg";

                    /// send message for Player.html
                    window.dispatcher.sendMessage("videoAssetOver", this.id);
                }
            });

            /// on exit
            Map.onExitEntity.push((entity) => {
                if (entity.id.asset.id == this.id) {
                    this.entity.billboard.image = "images/billboards/icon_placeholder-video_off.svg";

                    /// send message for Player.html
                    window.dispatcher.sendMessage("videoAssetExit");
                }
            });

            /// on click
            Map.onClickEntity.push((entity) => {
                if (entity.id.asset.id == this.id) {
                    AssetManager.OnClick_Video(this);
                }
            });

            /// on change state
            AssetManager.OnChangeStateHandlers.push(() => {

                console.log("OnChangeStateHandlers")

                if (AssetManager.state == AssetManager.states.ROOT_SELECTED) {
                    console.log("----1")
                    this.entity.billboard.image = "images/billboards/icon_placeholder-video_off.svg";
                    this.entity.utils.fade(1);

                } else if (AssetManager.state == AssetManager.states.VIDEO_SELECTED) {
                    this.entity.utils.fade(0.01);
                }
            });

            /// receive message from Player.html - on over
            window.dispatcher.receiveMessage("splashScreenOver", (id) => {
                if (id == this.id) {
                    this.entity.billboard.image = "images/billboards/icon_placeholder-video_on.svg";
                }
            });

            /// receive message from Player.html - on exit
            window.dispatcher.receiveMessage("splashScreenExit", (id) => {
                if (id == this.id) {
                    this.entity.billboard.image = "images/billboards/icon_placeholder-video_off.svg";
                }
            });

            /// receive message from Player.html - on clicked
            window.dispatcher.receiveMessage("splashScreenClicked", (id) => {
                if (id == this.id) {
                    AssetManager.OnClick_Video(this);
                }
            });




            /// check init
            if (AssetManager.state != AssetManager.states.IDLE) {
                if (AssetManager.state == AssetManager.states.VIDEO_SELECTED) {
                    this.entity.utils.fade(0.01);
                }
            }



        } else {
            this.entity.position = this.boundingSphere.center;
        }
    };
}