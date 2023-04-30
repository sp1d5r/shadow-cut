import React from "react";

const Controls = ({ onPlay, onPause, onCrop }) => {
    return (
        <div className="Controls">
            <button onClick={onPlay}>Play</button>
            <button onClick={onPause}>Pause</button>
            <button onClick={onCrop}>Crop</button>
        </div>
    );
};

export default Controls;
