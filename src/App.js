import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {Bootstrap,Button,FormGroup,ControlLabel,FormControl,HelpBlock,Col,Checkbox,Form} from 'react-bootstrap';



class App extends Component {
  constructor(props, context) {
  super(props, context);

  this.handleChange = this.handleChange.bind(this);

  this.state = {
    userName:'',
    password: ''
  };
}

  onConnection() {

}

handleChange(e) {
  this.setState({ value: e.target.value });
}
  render() {
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
        <FormControl type="password" placeholder="Password" onChange={evt => this.setState({userName: evt.target.value})}/>
      </Col>
    </FormGroup>
    <FormGroup>
      <Col smOffset={2} sm={10}>
        <Button type="submit" onClick={(event) => this.onConnection(event,this)}>Sign in</Button>
      </Col>
    </FormGroup>
  </Form>
    );
  }
}

export default App;
