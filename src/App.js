import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import AdminHome from './AdminHome.js'
import {Button,FormGroup,FormControl,Col,Form,Grid,Row} from 'react-bootstrap';



class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      userName:'',
      password: '',
      token:'',
      connected:false,
    };
  }

  async onConnection() {
    let self = this;
    let homeserver = this.getServerName();
    let userName = this.state.userName;
    let password = this.state.password;

    try {


      // XHR POST to login
      const loginRequest = await fetch( homeserver + '_matrix/client/r0/login', {
        method: 'POST',
        body: JSON.stringify({
          "initial_device_display_name": "Web setup account",
          "user": userName,
          "password": password,
          "type": "m.login.password",
        }),
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      });
      const loginData = JSON.parse(await loginRequest.text());
      if(loginData['access_token'])
      {
      self.setState({accessToken: loginData['access_token']});
      console.log('login successful: ' + loginData);

      return this.state.accessToken;}

    } catch(e) {
      console.log('error: ' + e);

      return;
    }

  }

  getServerName() {
    let currentLocation = window.location.hostname;
    console.log(currentLocation);
    return "https://localhost:8448/"
  }

  render() {
    this.getServerName();
    if (this.state.accessToken){
      return (<AdminHome></AdminHome>)
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
                <FormControl type="text" placeholder="Name" onChange={evt => this.setState({userName: evt.target.value})}/>
              </FormGroup>
              <FormGroup controlId="formHorizontalPassword">
                <FormControl type="password" placeholder="Password" onChange={evt => this.setState({password: evt.target.value})}/>
              </FormGroup>
            </Form>
            </Col>
          </Row>
            <Button bsStyle="primary" className='SubmitButton' onClick={(event) => this.onConnection(event,this)}>Sign in</Button>
        </Grid>
      </div>
    );
  }
}

export default App;
