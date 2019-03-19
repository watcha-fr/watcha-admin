import React, { Component } from 'react';
import logo from './images/logo.svg';
import './App.css';
import AdminHome from './AdminHome.js';
import { Button, FormGroup, FormControl, Col, Form, Grid, Row } from 'react-bootstrap';
import { withNamespaces } from 'react-i18next';


class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      userName: '',
      password: '',
      accessToken: null, // TODO: to test (was '' before)
      homeserver: '',
    };
  }

  componentWillMount = () => {
    let accessToken = null;
    const search =  window.location.search;
    if (search.includes("=")) {
      // Retrieving the token passed from Riot
      // see riot-web.git/src/components/structures/WatchaAdmin.js
      const key = search.split("=")[1];
      const value = localStorage.getItem('watcha-' + key);
      if (value !== null) {
        localStorage.removeItem(key);

        i18n.changeLanguage(value.split('-')[0]);
        accessToken = value.split('-')[1];
      }
      else {
        // if the token was incorrect, or was already retrieved,
        // then redirect to Riot for security
        window.location = window.location.protocol + '//' + window.location.host;
        return;
      }
    }

    fetch('/config.json').then(response => response.json())
        .then((data) =>
          this.setState(
              { homeserver: data['default_hs_url'] + '/',
                // TODO: to test (was a { } instead of { accessToken: null })
                accessToken: accessToken }))
  }

  componentDidMount = () => {
    document.addEventListener('keydown', this.onEnterPressed, false);
  }

  componentWillUnmount = () => {
    document.removeEventListener('keydown', this.onEnterPressed, false);
  }

  onEnterPressed = (event) => {
    if(event.keyCode === 13) {
        this.onConnection();
    }
  }

  onConnection = async () => {
    const self = this;

    try {
      const path =  this.state.homeserver + '_matrix/client/r0/login';

      const loginRequest = await fetch(path, {
        method: 'POST',
        body: JSON.stringify({
          'initial_device_display_name': 'Web setup account',
          'user': self.state.userName,
          'password': self.state.password,
          'type': 'm.login.password',
        }),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      const loginData = JSON.parse(await loginRequest.text());
      if (loginData['access_token']) {
        self.setState({ accessToken: loginData['access_token'] });
        return this.state.accessToken;
      } else {
        // TODO: to test
        console.log('error: no access token');
        return;
      }
    } catch (e) {
        // TODO: is this useful ??
      console.log('error: ' + e);

      return;
    }
  }

  onNameChange = (evt) => {
    this.setState({ userName: evt.target.value });
  }

  onPasswordChange = (evt) => {
    this.setState({ password: evt.target.value });
  }

  onLanguageChange =(evt) => {
    const { i18n } = this.props;
    i18n.changeLanguage(evt.target.id);
  }

  render() {
    if (this.state.accessToken) {
      return (<AdminHome
        token={this.state.accessToken}
        server={this.state.homeserver}
        className='AdminHome'
        onLanguageChange={this.onLanguageChange}>
      </AdminHome>);
    }
    return (
      <div>
        <Grid className="container">
          <Row className="logoRow">
            <Col lg={4} sm={12} md={4} xs={12} mdOffset={4} smOffset={0} xsOffset={0}>
<img alt="logo " src={logo} className="logo" />
            </Col>
          </Row>
          <Row className="show-grid">
            <Col lg={6} sm={12} md={6} xs={12} mdOffset={3} smOffset={0} xsOffset={0}>
              <Form className='loginInput'>
                <FormGroup controlId="formHorizontalName">
                  <FormControl type="text" placeholder={this.props.t('Name')} onChange={this.onNameChange} />
                </FormGroup>
                <FormGroup controlId="formHorizontalPassword">
                  <FormControl type="password" placeholder="Password" onChange={this.onPasswordChange} />
                </FormGroup>
              </Form>
            </Col>
          </Row>
          <Button bsStyle="primary" className='SubmitButton' onClick={this.onConnection}>{ this.props.t('Sign in') }</Button>
        </Grid>
      </div>
    );
  }
}

export default withNamespaces('common')(App);
