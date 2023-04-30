import React, {useEffect, useState} from "react";
import "./BlackBox.css";

const BlackBox = ({ boxPosition, setBoxPosition, boxDimensions, setBoxDimensions, multiplier, onPositionChange, onDimensionsChange }) => {
    const [dragging, setDragging] = useState(false);
    const [left, setLeft] = useState(0);
    const [top, setTop] = useState(0);

    const handleMouseDown = (event) => {
        setDragging(true);
    };

    const handleMouseUp = (event) => {
        setDragging(false);
        onPositionChange(boxPosition, multiplier);
    };

    const handleMouseMove = (event) => {
        if (dragging) {
            console.log(boxPosition.x);
            const newBoxPosition = {
                x: boxPosition.x + event.movementX,
                y: boxPosition.y + event.movementY
            };
            console.log("here", newBoxPosition)
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

    useEffect(() => {
        setLeft(boxPosition.x);
        setTop(boxPosition.y)
    }, [boxPosition, boxDimensions])

    return (
        <div
            className="blackbox"
            style={{ left: left, top: top, width: boxDimensions.width * multiplier, height: boxDimensions.height * multiplier}}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setDragging(false)}
            onResize={handleResize}
        ></div>
    );
};

export default BlackBox;
