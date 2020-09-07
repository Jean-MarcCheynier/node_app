import React, {useState, useEffect} from 'react';

import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup'; 
import Button from 'react-bootstrap/Button'; 
import Card from 'react-bootstrap/Card'; 
import FormControl from 'react-bootstrap/FormControl'; 
import Image from 'react-bootstrap/Image';
import './FileUpload.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faCheck, faTimes, faImage, faSpinner, faCheckCircle  } from '@fortawesome/free-solid-svg-icons';

export default function FileUpload({ onChange, success, pending }) {

    const [file, setFile] = useState("");
    const [previewUrl, setPreviewUrl] = useState("");

    //Reset form after upload success
    useEffect(() => {
        if(success){
            handleCancel();
        }
    }, [success])

    const handleFileChange = (e) =>{
        e.persist();
        const _file = e.target.files[0];
        setFile(_file);
        const reader = new FileReader();
        reader.onloadend = () => setPreviewUrl(reader.result);
        reader.readAsDataURL(_file);

    }

    const handleValidate = () => {
        onChange(file);
    }

    const handleCancel = () => {
        setFile("");
        setPreviewUrl("");
    }

    return (<Form.Group>
        <Card id="card-preview" className={`text-primary mb-2`}>
            <Card.Img src={previewUrl} alt="Card image" as={() =>
                <picture className="text-center" style={{ height: '40vh' }}>
                    <source className="img-fluid" srcSet={previewUrl}/>
                    <Image style={{maxHeight: '40vh', opacity: '0.5'}} fluid={true} thumbnail={true} src="..." alt="" />
                </picture>
            } />
            <Card.ImgOverlay className="d-flex text-primary text-center" style={{zIndex: '1'}}>
                <>
                { pending &&
                <div className="m-auto">
                    <FontAwesomeIcon icon={faSpinner} spin size="6x"/>
                </div>}
                { success &&  <div className={`m-auto text-success demo-fade-out`}>
                    <FontAwesomeIcon icon={faCheckCircle} size="6x"/>
                </div>}
                </>
            </Card.ImgOverlay>
            <Card.ImgOverlay className={`${!previewUrl && 'bg-light'}`}>
                <Card.Title className="text-center font-weight-bold">{previewUrl?'Image Preview':'Export an Image'}</Card.Title>
                <Card.Text className={`text-center ${previewUrl && 'd-none'}`}>
                    <FontAwesomeIcon icon={faImage} size="5x"/>
                </Card.Text>
            </Card.ImgOverlay>
            <Card.Footer style={{zIndex: '2'}}><small>Disclaimer : Blablabla... Images can be stored up to N days</small></Card.Footer>
        </Card>
        <InputGroup className="mb-3">
            {file?<>
            <InputGroup.Prepend>
                <Button variant="outline-primary" onClick={handleCancel}>
                    <FontAwesomeIcon icon={faTimes}/>
                </Button>
            </InputGroup.Prepend>
            <FormControl disabled value={file.name}/>
            <InputGroup.Append>
                <Button variant="primary" onClick={handleValidate}>
                    <FontAwesomeIcon icon={faCheck}/>
                </Button>
            </InputGroup.Append>
            </>:
            <Form.File 
                variant="outline-secondary"
                id="custom-file"
                label={"Choose a file"}
                data-browse="Browse"
                feedback="Feedback"
                name="file"
                onChange={handleFileChange}
                custom>
            </Form.File>}

        </InputGroup>
    </Form.Group>)
}