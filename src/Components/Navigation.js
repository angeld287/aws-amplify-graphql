import React from "react";
import { NavLink } from 'react-router-dom'; 
import { Navbar, Nav } from 'react-bootstrap'; 

const Navigation = () => {
  return (
    <div>
        <Navbar>
            <Navbar.Header>
                <Navbar.Brand>
                    <NavLink to="/">Home</NavLink>
                </Navbar.Brand>
            </Navbar.Header>
            <Nav>
                <NavLink to="/AddPhoto">AddPhoto</NavLink>
                <NavLink to="/AllPhotos">AllPhotos</NavLink>
            </Nav>
        </Navbar>
    </div>
  );
};

export default Navigation;

/* npm install --save react react-dom | npm install --save react-bootstrap */