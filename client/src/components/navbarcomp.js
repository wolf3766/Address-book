import React, { Component } from 'react'
import { Navbar, Container , Nav } from 'react-bootstrap'

export default class Navbarcomp extends Component {
  render() {
    return (
      <div>
        <Navbar bg="light" expand="lg">
  <Container>
    <Navbar.Brand>Address Book</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="me-auto">

      <Nav.Link href="/login">Login</Nav.Link>  
      <Nav.Link href="/register">Register</Nav.Link>
        <Nav.Link href="/add">New Contact</Nav.Link>
        <Nav.Link href="/contact">All</Nav.Link>
        
      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>

      </div>
    )
  }
}