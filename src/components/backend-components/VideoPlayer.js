import React, {useEffect, useState} from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import "./VideoPlayer.css";

export const VideoPlayer = ({boxMapping, updateBoxPosition, setBoxMapping, options, onReady, setCurrentTime}) => {
    const videoRef = React.useRef(null);
    const playerRef = React.useRef(null);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(1);

    const handleProgress = (player) => {
        const duration = player.duration();
        const currentTime = player.currentTime();
        setCurrentTime(videoRef.current.currentTime);
        const progress = (currentTime / duration) * 100;

        /* Shuffle through all the mappings */
        let currentMapping;
        const positions = Object.keys(boxMapping);
        for (let pos in positions){
            currentMapping = positions[pos];
            const _pos = parseFloat(currentMapping);
            if (_pos > currentTime) {
                console.log("time", _pos)
                currentMapping = positions[Math.max(0, pos-1)]
                break;
            }
        }
        if (currentMapping) updateBoxPosition({... boxMapping[currentMapping]["boxPosition"]})
        setProgress(progress);
    };

    const getPosition = (time) => {
        const _time = parseFloat(time);
        console.log((_time / duration) * 100)
        return (_time / duration) * 100;
    }

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
                handleProgress(player)
                setDuration(player.duration());
                player.width(player.videoWidth());
            });

            player.on("timeupdate", function() {
                console.log("Current time: ", player.currentTime());
                setDuration(player.duration());
            });

        } else {
            const player = playerRef.current;

            player.src(options.sources);
            player.on("loadedmetadata", function() {
                player.width(player.videoWidth());
                setDuration(player.duration());
            });

            player.on("timeupdate", function() {
                handleProgress(player)
                setCurrentTime(player.currentTime());
                console.log("Current time: ", player.currentTime());
            });

        }
    }, [options, videoRef]);

    useEffect(()=> {
        console.log("updated box pos")
    }, [boxMapping])

    return (
        <>
        <div data-vjs-player style={{maxHeight: "500px", height: "60vh"}}>
            <div ref={videoRef} style={{height: '60vh'}} className={"video-wrapper"}/>
        </div>
        <div style={{width: "60vw", height: 20, position: "relative"}}>
            <progress value={progress} style={{position: "absolute", zIndex: -1, width: "100%"}} max="100"/>
            {
                Object.keys(boxMapping).map((elem) => {
                    return <div
                        style={{position: "absolute", height: 5, width: 5, background: "blue", left:`${getPosition(elem)}%`, borderRadius: 5}}
                        onClick={() => {
                            const copyBoxElems= {...boxMapping}
                            delete copyBoxElems[elem]
                            setBoxMapping({...copyBoxElems})
                        }
                        }
                    >
                    </div>
                })
            }
        </div>
        </>
    );
}

export default VideoPlayer;