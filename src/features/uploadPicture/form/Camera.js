import React, {useState, useEffect, useRef} from 'react';
import Button from 'react-bootstrap/Button';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faCheck, faTimes, faSpinner, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

import "./Camera.scss";

export default function Camera({onChange, onError, success, pending}) {


    const sUsrAg = navigator.userAgent;
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const [userMedia, setUserMedia] = useState(false);
    const [mediaStream, setMediaStream] = useState(false);   
    const [upload, setUpload] = useState(false);
    const [capture, setCapture] = useState("");
    const [blob, setBlob] = useState("");
    const [pendingCamera, setPendingCamera] = useState(true);
    const [error, setError] = useState(false);
    const constraints = { video: true };

    useEffect(() => {   
        if(!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)){
            //setUserMedia(true);
            navigator.mediaDevices.getUserMedia(constraints)
            .then(_mediaStream => {
                setMediaStream(_mediaStream)
                videoRef.current.srcObject = _mediaStream;
                setPendingCamera(false);
            })
            .catch(e => {
                console.error(e);
                setError(true)
            });
        }else{
            setError(true);
        }
        return function cleanup() {
            try{
                const stream = videoRef.current.srcObject;
                const tracks = stream.getTracks();
                tracks.forEach(function(track) {
                    track.stop();
                });
                videoRef.current.srcObject =  null; 
            }catch(e) {
                console.error("Failed to cleanup camera form");
            }  
        };
    }, []);

    useEffect(() => {
        if(onError){
            onError(error);
        }
    }, [error, onError])

    //Reset form after upload success
    useEffect(() => {
        if(success){
            cancel();
        }
    }, [success])

    const captureScreen = () => {
        let _video = videoRef.current;
        _video.pause();
        let _canvas = canvasRef.current;
        _canvas.height = _video.videoHeight;
        _canvas.width = _video.videoWidth;
        _canvas.getContext('2d').drawImage(_video, 0, 0);
        _canvas.toBlob(blob => setBlob(blob));
        setCapture(_canvas.toDataURL('image/png', 0.4));
    }

    const cancel = () => {
        let _video = videoRef.current;
        _video.play();
        setCapture("");
    }

    const validate = () => {
        if(onChange){
            console.log(capture)
            return onChange(blob);
        }
    }

return (<div className="container mt-4">
    { (error || upload)? 
    <div className="">Load</div>
    : <>
    <div className="card bg-dark text-white">
        <video className="card-img" id="test" ref={videoRef}  autoPlay alt=""/>
        <div className="card-img-overlay d-flex">
            { pending &&
            <div className="m-auto text-white text-center">
                <FontAwesomeIcon icon={faSpinner} spin size="6x"/>
            </div>}
            { success && <div className={`m-auto text-white text-center demo-fade-out`}>
                <FontAwesomeIcon icon={faCheckCircle} size="6x"/>
            </div>}
        </div>
        <div className={`card-img-overlay ${(pendingCamera || pending) && 'd-none'}`}>
            <h5 className="card-title text-center">Send a picture of your document</h5>
            <div className="position-absolute w-100 text-center" 
                style={{ bottom: '10px', left: '0px'}}>
                {capture ? <>
                    <Button id="validate" variant="primary" size="lg" className="rounded-circle mx-1" onClick={validate}>
                        <FontAwesomeIcon icon={faCheck}/>
                    </Button>
                    <Button variant="secondary" size="lg" className="rounded-circle mx-1" onClick={cancel}>
                        <FontAwesomeIcon icon={faTimes}/>
                    </Button>
                </>:
                <Button id="capture" size="lg" className="rounded-circle" onClick={captureScreen}>
                    <FontAwesomeIcon icon={faCamera}/>
                </Button>}
            </div>
        </div>
    </div>
    <img className="d-none img-fluid" src={capture} alt="capture"/>
    <canvas className="d-none" ref={canvasRef} ></canvas>
    </>}

</div>);
}
