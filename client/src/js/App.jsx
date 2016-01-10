import React, { Component } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames/bind';

//import { LinkContainer } from 'react-router-bootstrap';
//import { Grid, Row, Navbar, Nav, NavItem } from 'react-bootstrap';

import logo from '../img/logo.svg';
import styles from './App.css';

var c = classNames.bind(styles);
var log = logger('App');

var GitHubPage = 'https://github.com/kawing-chiu/flask-react-redux-example'

class Logo extends Component {
  render() {
    return (
      <div className={styles.logo}>
        <img src={logo} width="36" height="36" />
        Flask-react-redux-example
      </div>
    );
  }
}

//class TopNavbar extends Component {
//  render() {
//    return (
//      <Navbar inverse>
//          <Navbar.Header>
//            <Navbar.Brand>
//              <Link to="/">
//                <Logo />
//              </Link>
//            </Navbar.Brand>
//            <Navbar.Toggle />
//          </Navbar.Header>
//          <Navbar.Collapse>
//            <Nav>
//              <LinkContainer to="/docs">
//                <NavItem>Docs</NavItem>
//              </LinkContainer>
//              <LinkContainer to="/d3">
//                <NavItem>D3</NavItem>
//              </LinkContainer>
//            </Nav>
//            <Nav pullRight>
//              <NavItem href={GitHubPage}>GitHub</NavItem>
//            </Nav>
//          </Navbar.Collapse>
//      </Navbar>
//    );
//  }
//}

/**
 * This simple app consists of a navbar and multiple pages.
 */
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMenu: false,
    }
  }
  toggleMenu() {
    log.debug('Toggling menu.');
    this.setState({
      showMenu: !this.state.showMenu
    });
  }
  render() {
    var showMenu = this.state.showMenu;
    return (
      <div className={c('layout', {active: this.state.showMenu})}>
        <a href="#" className={c('menuToggle')} onClick={this.toggleMenu.bind(this)}>
          <span></span>
        </a>

        <div className={c('menu', {active: this.state.showMenu})}>
          <div className="pure-menu">
            <Link to="/" className="pure-menu-heading">React</Link>
            <ul className="pure-menu-list">
              <li className="pure-menu-item">
                <Link to="/docs" className="pure-menu-link">Docs</Link>
              </li>
              <li className="pure-menu-item">
                <Link to="/d3" className="pure-menu-link">D3</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className={c('main')}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

