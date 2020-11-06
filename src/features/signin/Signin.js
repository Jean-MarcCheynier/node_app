import React, { useState, useEffect } from 'react';
import { useHistory, Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { signin, clearForm } from './signinSlice';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDoorOpen } from '@fortawesome/free-solid-svg-icons';

export default function Signin() {

    const params = useParams();
    const initialLogin = params.login|| "";
    const [login, setLogin] = useState(initialLogin);
    const [password, setPassword] = useState("");
    const [validated, setValidated] = useState(false);

    const dispatch = useDispatch();
    const history = useHistory();
    const { success, error, user } = useSelector(state => state.signin);
    
    const handleOnSumbmit = event => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget;
        if (form.checkValidity()) {
            dispatch(signin({login, password}));
        }    
        setValidated(true);
    }

    useEffect(() => {   
        if(success && user ){
            dispatch(clearForm());
            history.push("/");
        }
    });

    return (<div className="d-flex vh-100">
        <div className="m-auto">
            <h4 className="text-primary text-center mb-4">Sign in Demo App</h4>
            <div className="d-flex">
                <Form className="m-auto" noValidate 
                    style={{width: "280px"}}
                    validated={validated && !error}  
                    onSubmit={handleOnSumbmit}>
                    <div className="text-primary text-center m-3">
                        <FontAwesomeIcon size="3x" icon={faDoorOpen}/>
                    </div>
                    <Form.Group>
                        <Form.Label className="d-none" htmlFor="inputLogin">Login</Form.Label>
                        <Form.Control placeholder="Login" type="text" required name="login" id="inputLogin" aria-describedby="login" value={login} onChange={ e => setLogin(e.target.value)}/>
                        <Form.Control.Feedback type="invalid">Please enter your username.</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label className="d-none" htmlFor="inputPassword">Password</Form.Label>
                        <Form.Control placeholder="Password" type="password" required name="password" id="inputPassword" value={password} onChange={ e => setPassword(e.target.value)}/>
                        <Form.Control.Feedback type="invalid">Please enter your password.</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                        <Form.Control type="hidden" isInvalid={error}/>
                        <Form.Control.Feedback type="invalid">
                            { error && 
                            <span>{error.data?error.data.msg:'an error occured' }</span>}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Button type="submit" variant="primary" className="w-100">Sign in</Button>
                </Form>
            </div>
            <div className="w-100 text-center mt-2"><small><Link  to="/signup">Don't have an account?<br/>Sign up for Demo App</Link></small></div>
        </div>
    </div>);
}