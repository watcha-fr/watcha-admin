import React, { Component } from 'react';
import logo from './images/logo.svg';
import './App.css';
import AdminHome from './AdminHome.js';
import {Button, FormGroup, FormControl, Col, Form, Grid, Row} from 'react-bootstrap';


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
   const self = this;
   const userName = this.state.userName;
   const password = this.state.password;

   try {
     await this.getserverName();
     // XHR POST to login
     const loginRequest = await fetch( this.state.homeserver + '_matrix/client/r0/login', {
       method: 'POST',
       body: JSON.stringify({
         'initial_device_display_name': 'Web setup account',
         'user': userName,
         'password': password,
         'type': 'm.login.password',
       }),
       headers: {
         'Content-Type': 'application/json',
         'Accept': 'application/json',
       },
     });
     const loginData = JSON.parse(await loginRequest.text());
     if (loginData['access_token']) {
       self.setState({accessToken: loginData['access_token']});
       return this.state.accessToken;
     }
   } catch (e) {
     console.log('error: ' + e);

     return;
   }
 }

 getserverName = async () => {
   let coreUrl = '';
   const currentpage = window.location.protocol+'//'+window.location.hostname+'/';
   try {
     const configRequest = await fetch(currentpage+'/config.json');
     const configData = JSON.parse(await configRequest.text());
     coreUrl = configData['default_hs_url'];
     if (!coreUrl) throw new Error('could not get coreUrl');
   } catch (e) {
     console.log('error: ' + e);
     return;
   }
   console.log(coreUrl);
   this.setState({homeserver: coreUrl+'/'});
 }
  onNameChange = (evt) => {
    this.setState({userName: evt.target.value});
  }

  onPasswordChange = (evt) => {
    this.setState({password: evt.target.value});
  }

  render() {
    if (this.state.accessToken) {
      return (<AdminHome token={this.state.accessToken} server={this.state.homeserver}></AdminHome>);
    }
    return (
      <div>
        <Grid className="container">
          <Row className="logoRow">
            <Col lg={4} sm={12} md={4} xs={12} mdOffset={4} smOffset={0} xsOffset={0}>
              <img alt="logo "src={logo} className="logo" />
            </Col>
          </Row>
          <Row className="show-grid">
            <Col lg={6} sm={12} md={6} xs={12} mdOffset={3} smOffset={0} xsOffset={0}>
              <Form className='loginInput'>
                <FormGroup controlId="formHorizontalName">
                  <FormControl type="text" placeholder="Name" onChange={this.onNameChange} />
                </FormGroup>
                <FormGroup controlId="formHorizontalPassword">
                  <FormControl type="password" placeholder="Password" onChange={this.onPasswordChange} />
                </FormGroup>
              </Form>
            </Col>
          </Row>
          <Button bsStyle="primary" className='SubmitButton' onClick={this.onConnection}>Sign in</Button>
        </Grid>
      </div>
    );
  }
}

export default App;
