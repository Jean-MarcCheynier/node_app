import React from 'react';

import Card from 'react-bootstrap/Card';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faTimesCircle  } from '@fortawesome/free-solid-svg-icons';


export default function ImageCarousel({imageArray}) {
    return <>
        {imageArray.length !==0 &&
        <div className="carousel-wrapper">
            <label className="text-primary">Uploaded Images</label>
            <div className="d-flex overflow-auto">
                <div className="d-flex">
                    { imageArray.map( (image, index) =>

                        <Card 
                            key={index} 
                            border="primary" 
                            className={`text-primary mx-1`}>
                            <Card.Img className="w-auto h-auto" 
                                src={image.src} alt="Card image"
                                style={{maxHeight: '150px'}}/>
                            { image.classification ?
                            <Card.Footer style={{ zIndex: "2"}}>
                                <ul className="list-unstyled">
                                    <li><label>Damages detected:</label>{` ${image.classification[0]?"Yes":"No"}`}</li>
                                    <li><label>Position:</label>{` ${image.classification[1]}`}</li>
                                    <li><label>Criticity:</label>{` ${image.classification[2]}`}</li>
                                </ul>
                            </Card.Footer>
                            :
                            <>
                            <Card.ImgOverlay className="bg-danger d-flex text-white text-center" style= {{opacity: "0.5"}}>
                                <div className="m-auto">
                                    <FontAwesomeIcon icon={faTimesCircle} size="6x"/>
                                </div>
                            </Card.ImgOverlay>
                            <Card.Footer style={{ zIndex: "2"}}>
                                No car could be detected
                            </Card.Footer>
                            </>}
                            

                        </Card>)}
                </div>
            </div>
        </div>}


    </>
}