import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs, faArrowDown, faReply } from '@fortawesome/free-solid-svg-icons';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';



export default function Home() {

  return (<div className="container mt-4">
    <h1 className="text-primary">Demo of Intelligent Process Automation
      <small className="text-muted">&nbsp;v0.1</small>
    </h1>
    <p>Send your documents, receive your Accident Statement completed <br/> 
    </p>
    <br/>
    <Row>
      <Col xs={6} className="mb-3 p-4">
        <Image style={{zIndex: 0, transform: 'rotate(10deg)', position: 'absolute', maxHeight: '80%', maxWidth: '80%'}} 
          fluid src="ID.png"  />
        <Image style={{ transform: 'translate(50px, 0) rotate(-45deg)', position: 'absolute', maxHeight: '80%', maxWidth: '80%'}}
          fluid src="DriversLicense.png" />
      </Col>
      <Col xs={6} className="p-4 text-right" >
        <Image fluid src="AccidentImage.jpg" />
      </Col>
    </Row>
    <Row>
    <Col xs={4} >
        <div className="text-center">
          <h3 className=" text-primary">Data Extraction</h3>  
          <div  className="text-secondary"> 
            <div>Extraction of personal information</div>
            <div className="mt-3 text-left">
              The Optical Character Recognition API is powered by :
              <ul>
                <li>Azure Form Recognizer</li>
                <li>Azure Cognitive service</li>
              </ul>
            </div>
          </div>
        </div>
      </Col>
      <Col xs={4}>
        <div className="text-center text-primary">
          <FontAwesomeIcon icon={faCogs} size="4x"></FontAwesomeIcon>
        </div>
      </Col>
      <Col xs={4} >
        <div className="text-center">
          <h3 className=" text-primary">Image classification</h3>  
          <div className="text-secondary">
            <div>Detection of the vehicule and the severity of the damages. </div>
            <div className="mt-3 text-left">
              The image classification API is powered by :
              <ul>
                <li>Flask</li>
                <li>Tensor Flow</li>
                <li>Keras</li>
              </ul>
            </div>

          </div>
        </div>
      </Col>

    </Row>
    <Row>
      <Col xs={4} className="d-flex">
        <div className="m-auto text-center text-primary"><FontAwesomeIcon icon={faReply} rotation={180} size="3x"/></div>
        
      </Col>
      <Col xs={8} className="my-4">
        <div className="text-left">
          <h3 className=" text-primary">Robotic Process Automation</h3>  
          <div className="text-secondary">
            <p className="mb-2">From descriptive data, to <strong>Accident Statement completed</strong> and sent to your insurer</p>
          </div>
        </div>
      </Col>
    </Row>
    <Row className="justify-content-md-center">
      <Col xs={2}>
      </Col>
      <Col className="text-center" xs={8}>
      <Image style={{}}
          fluid src="AccidentStatement.jpg" />
      </Col>
    </Row>

  </div>);
}
