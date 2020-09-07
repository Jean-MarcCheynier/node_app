import React from 'react';

import Card from 'react-bootstrap/Card';

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
                            bg="primary" 
                            className={`text-primary mx-1`}>
                            <Card.Img className="w-auto h-auto" 
                                src={image.src} alt="Card image"
                                style={{maxHeight: '150px'}}/>
                        </Card>)}
                </div>
            </div>
        </div>}


    </>
}