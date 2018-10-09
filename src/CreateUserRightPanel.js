import React, { Component } from 'react';
import {Collapse, Panel, Glyphicon, Well, Table, Button, Alert } from 'react-bootstrap';

export default class CreateUserRightPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      infoMessage: false,
    };
  }
  createUser = async () =>{
    const homeServer = this.props.server;
    const accessToken = this.props.token;
    if (!this.state.isEmail) {
      this.setState({
        message: {type: 'danger', title: 'Invalid Email',
          body: 'this email adress seems to be incorrect please enter a valid email adress '},
      });
      this.displayInfoMessage();
    } else if (!this.state.isFirstName) {
      this.setState({
        message: {type: 'danger', title: 'Invalid First Name',
          body: 'First Name must contain at least two characters '},
      });
      this.displayInfoMessage();
    } else if (!this.state.isLastName) {
      this.setState({
        message: {type: 'danger', title: 'Invalid Last Name',
          body: 'Last Name must contain at least two characters '},
      });
      this.displayInfoMessage();
    } else if (!this.props.isEmailAvailable(this.state.emailValue)) {
      this.setState({
        message: {type: 'danger', title: 'Email already in use',
          body: this.state.emailValue+ ' is already in use enter a new email '},
      });
      this.displayInfoMessage();
    } else {
      try {
        const userRequest = await fetch(homeServer+ '_matrix/client/r0/watcha_register', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer '+ accessToken,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(
              {user: this.state.userIdValue, full_name: this.state.firstNameValue+' '+this.state.lastNameValue,
                email: this.state.emailValue, admin: false},
          ),
        });
        const response = JSON.parse(await userRequest.text());
        if (userRequest.ok) {
          this.setState({
            message: {type: 'success', title: 'User Created', body: this.state.userIdValue+' has been added to watcha'},
          });
          this.displayInfoMessage();
        } else {
          this.setState({
            message: {type: 'danger', title: 'User Creation Failed', body: response['error'] },
          });
          this.displayInfoMessage();
        }
      } catch (e) {
        console.log('error: ' + e);
        return;
      }
    }
  }

  isEmail = (query) => {
    return query.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
  }
  isName = (query) => {
    return query.length>1;
  }
  isFirstName = (query) => {
    return query.length>1;
  }

  onClose = () => {
    this.props.onClose();
  }

  onEmailChange = (ev) => {
    this.setState({emailValue: ev.target.value});
    this.setState({isEmail: false});
    if (this.isEmail(ev.target.value)) {
      this.setState({isEmail: true});
    }
  }
  onFirstNameChange = (ev) => {
    this.setState({firstNameValue: ev.target.value});
    this.setState({isFirstName: false});
    if (this.isName(ev.target.value)) {
      this.setState({isFirstName: true});
    }
  }
  onLastNameChange = (ev) => {
    this.setState({lastNameValue: ev.target.value});
    this.setState({isLastName: false});
    if (this.isName(ev.target.value)) {
      this.setState({isLastName: true});
    }
  }
  onUserIdChange = (ev) => {
    this.setState({userIdValue: ev.target.value});
  }

  displayInfoMessage = () => {
    this.setState({
      infoMessage: true,
    });
  }

  dismissInfoMessage = () => {
    this.setState({
      infoMessage: false,
    });
  }

  render() {
    let bottomWell;
    if (this.state.infoMessage) {
      bottomWell =
      <Alert onDismiss={this.dismissInfoMessage} bsStyle={this.state.message.type}>
        <h4>{ this.state.message.title }</h4>
        <p>
          { this.state.message.body }
        </p>
        <p>
          <Button bsStyle={this.state.message.type} onClick={this.dismissInfoMessage}>Ok</Button>
        </p>
      </Alert>;
    } else {
      bottomWell=<div className='bottomButton'>
        <Button bsStyle='primary' onClick={this.createUser}>Create User</Button>
      </div>;
    }
    return (
      <div>
        <Collapse in={true} dimension='width' timeout={0}>
          <div>
            <Panel className='panel'>
              <Panel.Heading>
                <Panel.Title componentClass='h3'>
                  Create User
                  <Glyphicon glyph="remove" className='dismissRight' onClick={this.onClose}></Glyphicon>
                </Panel.Title>
              </Panel.Heading>

              <div className='pannelContainer'>
                <Well>
                  <Table>
                    <tbody>
                      <tr>
                        <td className='labelText'>First Name:</td>
                        <td>
                          <input onChange={this.onFirstNameChange} />
                        </td>
                      </tr>
                      <tr>
                        <td className='labelText'>Last Name:</td>
                        <td>
                          <input onChange={this.onLastNameChange} />
                        </td>
                      </tr>
                      <tr>
                        <td className='labelText'>Email:</td>
                        <td >
                          <input onChange={this.onEmailChange} />
                        </td>
                      </tr>
                      <tr>
                        <td className='labelText' >User Id:</td>
                        <td >
                          <input onChange={this.onUserIdChange} />
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Well>
                { bottomWell }

              </div>
            </Panel>

          </div>
        </Collapse>
      </div>
    );
  }
}
