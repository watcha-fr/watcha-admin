import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {Bootstrap, Grid, Row, Col, Button,FormGroup,ControlLabel,FormControl,HelpBlock} from 'react-bootstrap';



class App extends Component {
  constructor(props, context) {
  super(props, context);

  this.handleChange = this.handleChange.bind(this);

  this.state = {
    value: ''
  };
}

  getValidationState() {
  const length = this.state.value.length;
  if (length > 10) return 'success';
  else if (length > 5) return 'warning';
  else if (length > 0) return 'error';
  return null;
}

handleChange(e) {
  this.setState({ value: e.target.value });
}
  render() {
    return (
      <form>
             <FormGroup
               controlId="formBasicText"
               validationState={this.getValidationState()}
             >
               <ControlLabel>Working example with validation</ControlLabel>
               <FormControl
                 type="text"
                 value={this.state.value}
                 placeholder="Enter text"
                 onChange={this.handleChange}
               />
               <FormControl.Feedback />
               <HelpBlock>Validation is based on string length.</HelpBlock>
             </FormGroup>
           </form>

    );
  }
}

export default App;
