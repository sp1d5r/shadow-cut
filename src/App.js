import React, { useState, useRef } from "react";
import BlackBox from "./components/BlackBox";
import Controls from "./components/Controls";
import VideoPlayer from "./components/VideoPlayer";
import videojs from "video.js";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

function App() {
  const [videoUrl, setVideoUrl] = useState("");
  const [boxPosition, setBoxPosition] = useState({ x: 0, y: 0 });
  const [boxDimensions, setBoxDimensions] = useState({ width: 150, height: 300 });
  const [boxPositions, setBoxPositions] = useState({});
  const [currentTime, setCurrentTime] = useState("0");
  const [refresh, setRefresh] = useState(false);

  const boxPositionsMapping = {"1.447912":{"boxPosition":{"x":144,"y":10},"boxDimensions":{"width":150,"height":300}},"5.155378":{"boxPosition":{"x":439,"y":13},"boxDimensions":{"width":150,"height":300}},"8.787629":{"boxPosition":{"x":321,"y":7},"boxDimensions":{"width":150,"height":300}},"16.718198":{"boxPosition":{"x":421,"y":11},"boxDimensions":{"width":150,"height":300}},"21.806105":{"boxPosition":{"x":286,"y":7},"boxDimensions":{"width":150,"height":300}},"28.166964":{"boxPosition":{"x":180,"y":-8},"boxDimensions":{"width":150,"height":300}},"35.066662":{"boxPosition":{"x":79,"y":8},"boxDimensions":{"width":150,"height":300}}}

    const outputVideoRef = useRef(null);
    const ffmpeg = createFFmpeg({ log: true });
    const [videoFile, setVideoFile] = useState(null);

  const [multiplier, setMultiplier] = useState(1);
  const playerRef = React.useRef(null);

    const [videoJsOptions, setVideoJsOption] = useState({
        autoplay: true,
        controls: true,
        responsive: true,
        sources: [{

        }]
    })

  const handleVideoChange = (event) => {
        const file = event.target.files[0];
        setVideoFile(file);
        setVideoUrl(URL.createObjectURL(file));
      setVideoJsOption({
          autoplay: true,
          controls: true,
          responsive: true,
          sources: [{
              src: URL.createObjectURL(file),
              type: file.type
          }]
      })
  };

  const handleBoxPositionChange = (position) => {

    setBoxPosition(position);
      const _boxPositions = {...boxPositions};
      _boxPositions[currentTime] = {boxPosition : position, boxDimensions: boxDimensions};
      setBoxPositions(_boxPositions);
      setRefresh(!refresh);
  };

  const handleBoxDimensionsChange = (dimensions, multiplier) => {
      console.log('box-dimensions', dimensions)
      const _dimensions = {width: dimensions.width*multiplier, height: dimensions.height*multiplier}
    setBoxDimensions(_dimensions);
      setMultiplier(multiplier);
    const _boxPositions = {...boxPositions};
    _boxPositions[currentTime] = {boxPosition : boxPosition, boxDimensions: _dimensions};
    setBoxPositions(_boxPositions);
      setRefresh(!refresh);
  };


  const handlePlayerReady = (player) => {
        playerRef.current = player;

        // You can handle player events here, for example:
        player.on('waiting', () => {
            videojs.log('player is waiting');
        });

        player.on('dispose', () => {
            videojs.log('player will dispose');
        });
    };

    const clipVideo = async (videoFile) => {
        await ffmpeg.load();

        ffmpeg.FS("writeFile", "input.mp4", await fetchFile(videoFile));

        let filterString = "";
        const boxPositionsMappingEntries = Object.entries(boxPositionsMapping);

        boxPositionsMappingEntries.forEach(([timestamp, data], index, array) => {
            const nextTimestamp = index < array.length - 1 ? array[index + 1][0] : null;
            const { x, y } = data.boxPosition;
            const {width, height} = data.boxDimensions;

            if (typeof x === "undefined" || typeof y === "undefined" || typeof width === "undefined" || typeof height === "undefined") {
                console.error(`Invalid boxDimensions at timestamp ${timestamp}, x:${x}, y:${y}, width:${width}, height:${height}`);
                return;
            }
            console.log('filter s:', filterString)
            filterString += `[0:v]trim=start=${timestamp}${nextTimestamp ? `:end=${nextTimestamp}` : ""},crop=${width}:${height}:${x}:${y}[clip${index}];`;
        });

        const concatFilters = boxPositionsMappingEntries
            .map((_, index) => `[clip${index}]`)
            .join("");

        filterString += `${concatFilters}concat=n=${boxPositionsMappingEntries.length}:v=1:a=0[out]`;

        console.log("Filter string:", filterString);

        await ffmpeg.run("-i", "input.mp4", "-filter_complex", filterString, "-map", "[out]", "output.mp4");
        console.log("Made it here");
        const data = ffmpeg.FS("readFile", "output.mp4");

        const videoURL = URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }));
        outputVideoRef.current.src = videoURL;
    };


  return (
      <div className="App">
        <input type="file" onChange={handleVideoChange} />
          <div style={{width: "80vw", position: "relative"}}>
              <VideoPlayer options={videoJsOptions} onReady={handlePlayerReady} setCurrentTime={setCurrentTime}/>
              <BlackBox
                  position={boxPosition}
                  dimensions={boxDimensions}
                  onPositionChange={handleBoxPositionChange}
                  onDimensionsChange={handleBoxDimensionsChange}
                  multiplier={multiplier}
              />
          </div>
          <input type="range" id="volume" name="volume"
                 min="0" max="2" step={"0.1"} value={multiplier}
                onChange={(e) => {
                    handleBoxDimensionsChange(boxDimensions, (parseFloat(e.target.value)))
                }}
          />

          {JSON.stringify(boxPositions)}
        <Controls videoFile={videoFile} onCrop={() => {clipVideo(videoFile)}}/>
          <video ref={outputVideoRef} controls />
      </div>
  );
}

export default App;
