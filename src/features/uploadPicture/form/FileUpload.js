import React, {useState} from 'react';

import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup'; 
import Button from 'react-bootstrap/Button'; 
import Card from 'react-bootstrap/Card'; 
import FormControl from 'react-bootstrap/FormControl'; 
import Image from 'react-bootstrap/Image';
import './FileUpload.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faCheck, faTimes, faImage  } from '@fortawesome/free-solid-svg-icons';

export default function FileUpload({ onChange }) {

    const [file, setFile] = useState("");
    const [previewUrl, setPreviewUrl] = useState("");

    const handleFileChange = (e) =>{
        e.persist();
        const _file = e.target.files[0];
        setFile(_file);
        const reader = new FileReader();
        const url = reader.readAsDataURL(_file);
        reader.onloadend = (e) => setPreviewUrl(e.target.result)
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
                <picture className="text-center" style={{ minHeight: "180px" }}>
                    <source className="img-fluid" srcSet={previewUrl}/>
                    <Image style={{opacity: '0.4'}} fluid={true} thumbnail={true} src="..." alt="" />
                </picture>
            } />
            <Card.ImgOverlay className={`${!previewUrl && 'bg-light'}`}>
                <Card.Title className="text-center font-weight-bold">{previewUrl?'Image Preview':'Export an Image'}</Card.Title>
                <Card.Text className={`text-center ${previewUrl && 'd-none'}`}>
                    <FontAwesomeIcon icon={faImage} size="5x"/>
                </Card.Text>
                <Card.Text className={`${previewUrl && 'd-none'}`}><small>Images can be stored up to N days</small></Card.Text>
            </Card.ImgOverlay>
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