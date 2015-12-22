import React, { Component } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';


class TopNavbar extends Component {
  render() {
    return (
      <Navbar inverse>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#">React</a>
          </Navbar.Brand>
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavItem eventKey={1} href="#">Docs</NavItem>
          </Nav>
          <Nav pullRight>
            <NavItem eventKey={1} href="#">GitHub</NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

/**
 * This simple app consists of a navbar and multiple pages.
 */
export default class App extends Component {
  render() {
    return (
      <div>
        <TopNavbar />
        {this.props.children}
      </div>
    );
  }
}

