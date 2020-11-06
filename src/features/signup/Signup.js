import React, { useState, useEffect } from 'react';
import { useHistory, Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import Fade  from 'react-bootstrap/Fade';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { signup, reset } from './signupSlice';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDoorOpen } from '@fortawesome/free-solid-svg-icons';


export default function Signup() {

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [validated, setValidated] = useState(false);

    const dispatch = useDispatch();
    const history = useHistory();
    const {success, error, user} = useSelector(state => state.signup);

    const handleOnSumbmit = event => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget;
        if (form.checkValidity()) {
            dispatch(signup({login, password}));
        }
        setValidated(true);
    }

    useEffect(() => {   
        if(success){
            //If user account is confirmed by the admin: user.role = 'user', otherwise user.role = 'pre'
            if(user.role === "pre"){
                history.push(`/signin/as/${user.local.login}`);
                dispatch(reset());
            }
        }
    });



    return (<div className="d-flex vh-100">
        <div className="m-auto">
            <h4 className="text-primary text-center mb-4">Sign up for Demo App</h4>
            <div className="d-flex">
                <Form className="m-auto" 
                    style={{width: "280px"}}
                    noValidate 
                    validated={validated && !error}  
                    onSubmit={handleOnSumbmit}>
                    <div className="text-primary text-center m-3">
                        <FontAwesomeIcon size="3x" icon={faDoorOpen}/>
                    </div>
                    <Form.Group>
                        <Form.Label className="d-none" htmlFor="inputLogin">Login</Form.Label>
                        <Form.Control placeholder="Login" type="text" name="login" id="inputLogin" aria-describedby="login" value={login} onChange={ e => setLogin(e.target.value)} required/>
                        <Form.Control.Feedback type="invalid">Please choose a username.</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label className="d-none" htmlFor="inputPassword">Password</Form.Label>
                        <Form.Control placeholder="Password" type="password" name="password" id="inputPassword" value={password} onChange={ e => setPassword(e.target.value)} required/>
                        <Form.Control.Feedback type="invalid">Please choose a password.</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                        <Form.Control type="hidden" isInvalid={error}/>
                        <Form.Control.Feedback type="invalid">
                            { error && 
                            <span className="text-capitalize">{error.data?error.data.errmsg:'an error occured' }</span>}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Button type="submit" variant="primary" className="w-100">Sign up</Button>
                </Form>
            </div>
            <div className="w-100 text-center mt-2"><small><Link  to="/signin">Already have an account?<br/>Sign in Demo App</Link></small></div>
        </div>
    </div>);

}
