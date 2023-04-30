import React, {useRef, useState} from "react";
import "./ClipVideo.css"
import Upload from "../../../assets/upload.svg";

function ClipVideo() {
    /* Handle Video File Upload */
    const fileInput = useRef(null);
    const [videoUrl, setVideoUrl] = useState("");
    const [videoUploaded, setVideoUploaded] = useState(false);
    const [videoFile, setVideoFile] = useState("");

    /* Handle Uploaded File Information */
    const videoTagRef = useRef(null);
    const [originalVideoHeight, setOriginalVideoHeight] = useState({width: 0, height: 0});
    const [clientVideoHeight, setClientVideoHeight] = useState({width: 0, height: 0});
    const [duration, setDuration] = useState(0);

    /* Handle Video Time Update */
    const [currentTime, setCurrentTime] = useState(0);
    const [boxPositions, setBoxPositions] = useState({"0": {"x": 0, "y":0}})
    const [boxDimensions, setBoxDimensions] = useState({"width": 150, "height": 300})
    const [boxMagnitude, setBoxMagnitude] = useState(1)

    /* Handle Capture Block Movements */
    const [currentBoxPosition, setCurrentBoxPosition] = useState({x: 0, y: 0})
    const [dragging, setDragging] = useState(false);


    const handleFileUpload = () => {
        fileInput.current.click();
    }

    const handleVideoChange = (event) => {
        const file = event.target.files[0];
        setVideoFile(file);
        setVideoUrl(URL.createObjectURL(file));
        setVideoUploaded(true);
    };

    const getOriginalVideoDimension = () => {
        const video = videoTagRef.current;
        console.log("Video tag info", video)
        const originalWidth = video ? video.videoWidth: 1;
        const originalHeight = video ? video.videoHeight : 1;
        const clientWidth = video ? video.clientWidth: 1;
        const clientHeight = video ? video.clientHeight: 1;
        setOriginalVideoHeight({width: originalWidth, height: originalHeight})
        setClientVideoHeight({width: clientWidth, height: clientHeight});
        setDuration(video.duration);
        console.log(`Video dimensions: ${originalWidth}x${originalHeight}`);
        console.log(`Video dimensions: ${clientWidth}x${clientHeight}`)
        console.log(`Video Duration: ${video.duration}`);
    };

    const updateProgressBar = (currentTime) => {

    }

    const handleTimeUpdate = (event) => {
        setCurrentTime(videoTagRef.current.currentTime)
    }

    /* Capture Block Functions */
    function handleMouseDown() {
        setDragging(true)
    }

    function handleMouseUp() {
        setDragging(false);
    }

    function handleMouseMove(event) {
        if (dragging) {
            const newBoxPosition = {
                x: currentBoxPosition.x + event.movementX,
                y: currentBoxPosition.y + event.movementY
            };
            const _clonedBoxPositions = { ... boxPositions}
            _clonedBoxPositions[currentTime] = newBoxPosition;
            setBoxPositions(_clonedBoxPositions);
            setCurrentBoxPosition(newBoxPosition)
        }
    }

    const getPositionOfBoxElem = (elem) => {
        const res = parseFloat(elem);
        return (res / duration) * 100;
    }

    return <>
    <div className={"clip-video-main"}>
        <div className={"video-player"} onClick={videoUploaded ? () => {} : handleFileUpload}>
            {
                videoUploaded ?
                    <>
                        <div className={"clip-video-container"}>
                            <video
                                className={"clip-video-content"}
                                key={videoUrl}
                                controls
                                ref={videoTagRef}
                                onLoadedData={getOriginalVideoDimension}
                                onTimeUpdate={handleTimeUpdate}
                            >
                                <source src={videoUrl} type={videoFile.type} />
                            </video>
                            <div
                                className={"capture-block"}
                                onMouseDown={handleMouseDown}
                                onMouseUp={handleMouseUp}
                                onMouseMove={handleMouseMove}
                                onMouseLeave={() => setDragging(false)}
                                style={{left: currentBoxPosition.x, top:currentBoxPosition.y}}
                            >

                            </div>
                        </div>
                    </> :
                    <>
                        <input type="file" ref={fileInput} style={{display: 'none'}} onChange={handleVideoChange}/>
                        <img src={Upload} alt={"upload"} className={"upload-video-img"}/>
                        <p className={"clip-video-text"}>Select your file here</p>
                        <p className={"clip-video-normal"}>Don’t worry, all processing occurs in browser. Your data is secure.</p>
                    </>
            }
        </div>
        {
            videoUploaded ?
                <>
                    <div className={"video-progress-bar"}>
                        <div className={"video-progress-bar-blue"} style={{width: `${(currentTime / duration) * 100}%`}}>
                        </div>
                        {
                            Object.keys(boxPositions).map((elem) => {
                                return <div className={"position-button"} style={{left: `${getPositionOfBoxElem(elem)}%`}} />
                            })
                        }
                    </div>

                </> :
                <>

                </>
        }
        {
            videoUploaded ?
                <button className={"crop-video-button"} onClick={() => {
                    console.log("crop video")
                }}>
                    Crop Video
                </button> :
                <></>
        }
    </div>
    </>
}

export default ClipVideo;