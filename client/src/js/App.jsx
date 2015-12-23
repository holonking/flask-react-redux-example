import React, { Component } from 'react';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { Grid, Row, Navbar, Nav, NavItem } from 'react-bootstrap';

import logo from '../img/logo.svg';


var GitHubPage = 'https://github.com/kawing-chiu/flask-react-redux-example'

class Logo extends Component {
  render() {
    return (
      <div className="App--TopNavBar-Logo">
        <img src={logo} width="36" height="36" />
        Flask-react-redux-example
      </div>
    );
  }
}

class TopNavbar extends Component {
  render() {
    return (
      <Navbar inverse>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">
                <Logo />
              </Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <LinkContainer to="/docs">
                <NavItem>Docs</NavItem>
              </LinkContainer>
              <LinkContainer to="/d3">
                <NavItem>D3</NavItem>
              </LinkContainer>
            </Nav>
            <Nav pullRight>
              <NavItem href={GitHubPage}>GitHub</NavItem>
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
        <Grid>
          {this.props.children}
        </Grid>
      </div>
    );
  }
}

