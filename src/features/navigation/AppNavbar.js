import React from 'react';
import {Link} from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import AppUpperMenu from './AppUpperMenu';


export default function AppNavbar() {

  return <Navbar sticky="top" bg="white" expand="sm">  
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Brand className="text-primary">Demo App</Navbar.Brand>
    <AppUpperMenu className="d-sm-none"/>
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="mr-auto" defaultActiveKey="/home">
        <Nav.Link href="/home" as={Link} to="/">Home</Nav.Link>
        <Nav.Link href="/demo" as={Link} to="/demo">Demo</Nav.Link>
      </Nav>
    </Navbar.Collapse>
    <AppUpperMenu className="d-none d-sm-inline"/>
  </Navbar>
}