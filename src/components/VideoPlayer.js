import React, {useState} from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import "./VideoPlayer.css";

export const VideoPlayer = ({options, onReady, setCurrentTime}) => {
    const videoRef = React.useRef(null);
    const playerRef = React.useRef(null);

    React.useEffect(() => {

        // Make sure Video.js player is only initialized once
        if (!playerRef.current) {
            // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
            const videoElement = document.createElement("video-js");

            videoElement.classList.add('vjs-big-play-centered');
            videoElement.classList.add('vjs-layout-large');
            videoRef.current.appendChild(videoElement);

            const player = playerRef.current = videojs(videoElement, options, () => {
                videojs.log('player is ready');

                onReady && onReady(player);
            });
            player.responsive(false);

            player.on("loadedmetadata", function() {
                player.width(player.videoWidth());
            });

            player.on("timeupdate", function() {
                console.log("Current time: ", player.currentTime());
            });

        } else {
            const player = playerRef.current;
            player.autoplay(options.autoplay);
            player.src(options.sources);
            player.on("loadedmetadata", function() {
                player.width(player.videoWidth());
            });

            player.on("timeupdate", function() {
                setCurrentTime(player.currentTime());
                console.log("Current time: ", player.currentTime());
            });

        }
    }, [options, videoRef]);


    return (
        <div data-vjs-player style={{maxHeight: "500px", height: "60vh"}}>
            <div ref={videoRef} style={{height: '60vh'}} className={"video-wrapper"}/>
        </div>
    );
}

export default VideoPlayer;