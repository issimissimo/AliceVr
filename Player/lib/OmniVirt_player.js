const OmniVirt_player = {

    isStarted: false,
    isPlaying: false,
    isPaused: false,
    isSeeking: false,

    duration: 0,
    _time: -1,
    _oldTime: -1,
    oldId: null,
    omniVirtIframe: null,
    asset: null,

    _angle: 180, /// must stay 180 because at start is 180° rotated!

    onReadyHandlers: [],
    onStartedHandlers: [],
    onPausedHandlers: [],
    onSeekedHandlers: [],
    onEndedHandlers: [],

    timeout: null,


    get time() {
        if (this._time < 0) return 0;
        else return this._time;
    },
    get angle() {
        return this._angle - 180;
    },
    play: function() {
        OmniVirt.api.sendMessage('play', null, this.omniVirtIframe);
        this.isPlaying = true;
        console.log("************************PLAY!!!!!!!!!!!!!!!!!!!")
        console.log(OmniVirt_player.isPlaying)
    },
    pause: function() {
        OmniVirt.api.sendMessage('pause', null, this.omniVirtIframe);
    },
    seek: function(time) {
        let percent = time / this.duration;
        OmniVirt.api.sendMessage('seek', percent, this.omniVirtIframe);
    },
    stop: function() {
        OmniVirt.api.sendMessage('pause', null, this.omniVirtIframe); /// non c'è lo STOP nelle API !!!!
        this.isPlaying = false;
        this.isPaused = false;
        this._oldTime = -1;
        console.log("video is stopped");
        OmniVirt.api.unbind(window);
    },

    load: function(asset, callback) {
        console.log("////////////////////// LOAD ////////////////////////")

        // OmniVirt.api.unbind(window);

        /// get the right URL
        let url = asset.video_url2;

        this.isStarted = false;
        this.isPlaying = false;
        this.isPaused = false;

        if (typeof url === "undefined" || url === "" || !url) {
            console.error("ERROR: video url is not defined!")
            alert("ERROR: Omnivirt video url is not defined!");
            return;
        }

        this.asset = asset;

        /// get id
        let id = 'ado-' + url;

        /// get previuos ID and change ID...
        let iframeId = this.oldId ? this.oldId : 'OmniVirt-container';
        this.omniVirtIframe = document.getElementById(iframeId);
        this.omniVirtIframe.id = id;

        this.oldId = id;

        document.getElementById(id).setAttribute("src",
            "//cdn.omnivirt.com/content/" + url + "?player=true&autoplay=false&referer=" + encodeURIComponent(
                window.location.href));


        /// register listeners



        OmniVirt.api.receiveMessage('loaded', (eventName, data, instance) => {
            for (let i in this.onReadyHandlers) this.onReadyHandlers[i]();
        });


        OmniVirt.api.receiveMessage('duration', (eventName, data, instance) => {
            console.log('------ video duration: ' + data + ' ------');
            this.duration = data;
        });


        OmniVirt.api.receiveMessage('started', (eventName, data, instance) => {
            this.isStarted = true;
            this.isPlaying = true;
            console.log('------ video is started ------')
            for (let i in this.onStartedHandlers) this.onStartedHandlers[i]();
        });


        OmniVirt.api.receiveMessage('paused', (eventName, data, instance) => {
            this.isPlaying = false;
            this.isPaused = true;
            console.log('------ video is paused ------')
            for (let i in this.onPausedHandlers) this.onPausedHandlers[i]();
        });


        OmniVirt.api.receiveMessage('ended', (eventName, data, instance) => {
            this.isStarted = false;
            this.isPlaying = false;
            console.log('------ video is ended ------')
            for (let i in this.onEndedHandlers) this.onEndedHandlers[i]();
        });


        OmniVirt.api.receiveMessage('seeked', (eventName, data, instance) => {
            this.isSeeking = true;
            console.log('------ video is seeked ------')

            if (this.timeout) clearTimeout(this.timeout);

            /// wait 500ms before to flag bool as false
            this.timeout = setTimeout(() => {
                this.isSeeking = false;
                this.timeout = null;
                for (let i in this.onSeekedHandlers) {
                    this.onSeekedHandlers[i]();
                }
                console.log('------ video seeking ended ------')
            }, 500)
        });



        OmniVirt.api.receiveMessage('progress', (eventName, data, instance) => {
            console.log(data)
            this._time = this.duration * data;
            // console.log("PROGRESS....." + this._time + " -- " + this._oldTime)
            /// if the progress is updated...
            // if (this._time !== this._oldTime && !this.isSeeking) {
            //     this.isPlaying = true;
            //     this._oldTime = this._time;
            // } else {
            //     this.isPlaying = false;
            // }
            // // console.log("**********************************")
            // console.log(instance)
            // console.log("************ isPlaying: " + this.isPlaying)
        });


        OmniVirt.api.receiveMessage('longitude', (eventName, data, instance) => {
            this._angle = data;
        });


        callback();
    },
};


export default OmniVirt_player;