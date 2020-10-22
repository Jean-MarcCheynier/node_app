import React, {useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { map } from 'lodash';

import Form from 'react-bootstrap/Form';

import {uploadImage, reset} from './imageSlice';

import Camera from './form/Camera';
import FileUpload from './form/FileUpload';
import ImageCarousel from './ImageCarousel';

export default function UploadForm({documentType}) {

    const [cameraMode, setCameraMode] = useState(false);
    const {srcMap, uploadSuccess, uploadPending} = useSelector(state => state.image)
    const dispatch = useDispatch()


    const handleFileChange = imageFile => {
        dispatch(uploadImage(imageFile, documentType));
    }

    const handleCameraSwitch = e => {
        dispatch(reset());
        setCameraMode(!cameraMode);
    }

    return (<>
        <Form className="mx-auto mb-3" style={{maxWidth: "720px"}}>
            <Form.Check 
                className="text-center"
                type="switch"
                id="custom-switch"
                value={cameraMode}
                onChange={handleCameraSwitch}
                label={<label className={`${cameraMode && 'text-primary'}`}>{`Camera mode ${cameraMode?'on':'off'}`}</label>}
            />
            {cameraMode?
            <Camera success={uploadSuccess} pending={uploadPending} onChange={handleFileChange}/>
            :
            <FileUpload success={uploadSuccess} pending={uploadPending}  onChange={handleFileChange}/>}
        </Form>
        <ImageCarousel imageArray={map(srcMap, image => image).reverse()}/>
    </>
    )
}