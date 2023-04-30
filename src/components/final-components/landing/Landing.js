import React, {useState} from "react";
import "./Landing.css";
import ClipVideo from "../clip-video/ClipVideo";

function Landing() {
    const [loaded, setLoading] = useState(false);

    return (
        <div className={'landing'}>
            <h1 className={"landing-text"}>SHADOW CUT</h1>
            <button className={"landing-button"} onClick={() => {setLoading(true)}}>
                Begin
            </button>
            {loaded ? <div className={'landing-overlay'}>
                <div className={"landing-main-content"}>
                    <ClipVideo />
                </div>
            </div> : <></>}
        </div>
    )
}

export default Landing;