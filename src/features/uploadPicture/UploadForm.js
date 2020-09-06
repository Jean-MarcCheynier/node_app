import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import {uploadImage, downloadImage} from './imageSlice';

import Camera from './form/Camera';
import FileUpload from './form/FileUpload'




export default function UploadForm() {

    const [cameraMode, setCameraMode] = useState(false);
    const [src, setSrc] = useState("");
    const {srcMap} = useSelector(state => state.image)
    const dispatch = useDispatch()

    const handlePictureChange = image => {
        const formData = new FormData();
        formData.append("imageUpload", image);
        dispatch(uploadImage(formData))
    }

    const handleFileChange = image => {
        const formData = new FormData();
        formData.append("imageUpload", image);
        dispatch(uploadImage(formData))
    }

    const handleOnClick = imageId => {
        dispatch(downloadImage("5f53dd1779ac8a52fcec8562"))
    }

    useEffect(() => {
        dispatch(downloadImage("5f53dd1779ac8a52fcec8562"))
    }, [])

    return (<>
    <Form className="m-auto" style={{maxWidth: "720px"}}>
        <Form.Check 
            type="switch"
            id="custom-switch"
            value={cameraMode}
            onChange={e => setCameraMode(!cameraMode)}
            label={<label className={`${cameraMode && 'text-primary'}`}>{`Camera mode ${cameraMode?'on':'off'}`}</label>}
        />
        {cameraMode?
        <Camera onChange={handlePictureChange}/>
        :
        <FileUpload onChange={handleFileChange}/>}
    </Form>
    <img className="img-fluid" src={srcMap["5f53dd1779ac8a52fcec8562"]} alt="other"/>
    <Button onClick={handleOnClick}>Test</Button>
    </>
    )
}