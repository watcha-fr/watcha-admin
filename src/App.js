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
      token: '',
      connected: false,
    };
  }

  onConnection = async () => {
    const SELF = this;
    const USERNAME = this.state.userName;
    const PASSWORD = this.state.password;

    try {
      const PATH = await this.getserverName() + '_matrix/client/r0/login';
      // XHR POST to login
      const LOGIN_REQUEST = await fetch(PATH, {
        method: 'POST',
        body: JSON.stringify({
          'initial_device_display_name': 'Web setup account',
          'user': USERNAME,
          'password': PASSWORD,
          'type': 'm.login.password',
        }),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      const LOGIN_DATA = JSON.parse(await LOGIN_REQUEST.text());
      if (LOGIN_DATA['access_token']) {
        SELF.setState({ accessToken: LOGIN_DATA['access_token'] });
        return this.state.accessToken;
      } else {
        throw new Error('no access token');
      }
    } catch (e) {
      console.log('error: ' + e);

      return;
    }
  }

  getserverName = async () => {
    let coreUrl = '';
    try {
      const configRequest = await fetch('/config.json');
      const configData = JSON.parse(await configRequest.text());
      coreUrl = configData['default_hs_url'];
      if (!coreUrl) throw new Error('could not get coreUrl');
    } catch (e) {
      console.log('coreUrl error = ' + e);
      return;
    }
    console.log('coreURL = ' + coreUrl);
    this.setState({ homeserver: coreUrl + '/' });
    return coreUrl + '/';
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
