import React from 'react';
import { Route, Redirect } from "react-router-dom";
import { useSelector } from 'react-redux';


const GuardedRoute = ({ component: Component, meta, ...rest }) => {

    const user = useSelector(state => state.signin.user);

    let allowAccess = false;
    if(meta.auth){
        allowAccess = !!user;
    }

    if(meta.roles){
        allowAccess = meta.roles.includes(user.role)
    }
    return (<Route {...rest} render={(props) => (
        allowAccess === true
            ? <Component {...props} />
            : <Redirect to={(meta.redirect)?meta.redirect:'/'}/>
    )} />)
}

export default GuardedRoute;