import React, { useState } from "react";
import "./BlackBox.css";

const BlackBox = ({ position, dimensions, multiplier, onPositionChange, onDimensionsChange }) => {
    const [dragging, setDragging] = useState(false);
    const [boxPosition, setBoxPosition] = useState(position);
    const [boxDimensions, setBoxDimensions] = useState(dimensions);

    const handleMouseDown = (event) => {
        setDragging(true);
    };

    const handleMouseUp = (event) => {
        setDragging(false);
        onPositionChange(boxPosition, multiplier);
    };

    const handleMouseMove = (event) => {
        if (dragging) {
            const newBoxPosition = {
                x: boxPosition.x + event.movementX,
                y: boxPosition.y + event.movementY
            };
            setBoxPosition(newBoxPosition);
        }
    };

    const handleResize = (event) => {
        const newBoxDimensions = {
            width: event.target.offsetWidth,
            height: event.target.offsetHeight
        };
        setBoxDimensions(newBoxDimensions);
        onDimensionsChange(newBoxDimensions);
    };

    return (
        <div
            className="blackbox"
            style={{ left: boxPosition.x, top: boxPosition.y, width: boxDimensions.width * multiplier, height: boxDimensions.height * multiplier}}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setDragging(false)}
            onResize={handleResize}
        ></div>
    );
};

export default BlackBox;
