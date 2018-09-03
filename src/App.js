import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {Bootstrap,Button,FormGroup,ControlLabel,FormControl,HelpBlock,Col,Checkbox,Form} from 'react-bootstrap';



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
  
  self.setState({accessToken: loginData['access_token']});

  console.log('login successful: ' + loginData);

  return this.state.accessToken;

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
    return (
      <Form horizontal>
    <FormGroup controlId="formHorizontalName">
      <Col componentClass={ControlLabel} sm={2}>
        Name
      </Col>
      <Col sm={10}>
        <FormControl type="text" placeholder="Name" onChange={evt => this.setState({userName: evt.target.value})}/>
      </Col>
    </FormGroup>

    <FormGroup controlId="formHorizontalPassword">
      <Col componentClass={ControlLabel} sm={2}>
        Password
      </Col>
      <Col sm={10}>
        <FormControl type="password" placeholder="Password" onChange={evt => this.setState({password: evt.target.value})}/>
      </Col>
    </FormGroup>
    <FormGroup>
      <Col smOffset={2} sm={10}>
        <Button bsStyle="primary" onClick={(event) => this.onConnection(event,this)}>Sign in</Button>
      </Col>
    </FormGroup>
  </Form>
    );
  }
}

export default App;
