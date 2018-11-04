import React, { Component } from 'react';
import {Collapse, Panel, Glyphicon, Well, Table, Button, Alert } from 'react-bootstrap';

export default class CreateUserRightPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      infoMessage: false,
      editUserId: false,
      emailValue: ' ',
      lastNameValue: '',
      firstNameValue: '',
      suggestedUserId: '',
    };
  }
  createUser = async () =>{
    const HOME_SERVER = this.props.server;
    const ACCESS_TOKEN = this.props.token;
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
    } else if (!this.state.userIdValue && !this.state.suggestedUserId) {
      this.setState({
        message: {type: 'danger', title: 'User id required',
          body: 'enter a valid user id' },
      });
      this.displayInfoMessage();
    } else {
      try {
        const USER_ID = this.state.userIdValue ? this.state.userIdValue : this.state.suggestedUserId;
        const USER_REQUEST = await fetch(HOME_SERVER+ '_matrix/client/r0/watcha_register', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer '+ ACCESS_TOKEN,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(
              {user: USER_ID, full_name: this.state.firstNameValue+' '+this.state.lastNameValue,
                email: this.state.emailValue, admin: false},
          ),
        });
        const RESPONSE = JSON.parse(await USER_REQUEST.text());
        if (USER_REQUEST.ok) {
          this.setState({
            message: {type: 'success', title: 'User Created', body: USER_ID+' has been added to watcha'},
          });
          this.displayInfoMessage();
        } else {
          this.setState({
            message: {type: 'danger', title: 'User Creation Failed', body: RESPONSE['error'] },
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

  generateSuggestedUserId = (value, firstName) =>{
    if (firstName) {
      this.setState({
        suggestedUserId: value.toLowerCase()+'.'+this.state.lastNameValue.toLowerCase(),
      });
    } else {
      this.setState({
        suggestedUserId: this.state.firstNameValue.toLocaleLowerCase()+'.'+value.toLowerCase(),
      });
    }
  }

  onEmailChange = (ev) => {
    this.setState({emailValue: ev.target.value});
    this.setState({isEmail: false});
    if (this.isEmail(ev.target.value)) {
      this.setState({isEmail: true});
    }
  }

  onFirstNameChange = (ev) => {
    const FIRST_NAME = ev.target.value;
    this.setState({firstNameValue: FIRST_NAME});
    this.generateSuggestedUserId(FIRST_NAME, true);
    this.setState({isFirstName: false});
    if (this.isName(ev.target.value)) {
      this.setState({isFirstName: true});
    }
  }

  onLastNameChange = (ev) => {
    const NAME = ev.target.value;
    this.setState({lastNameValue: NAME});
    this.generateSuggestedUserId(NAME, false);
    this.setState({isLastName: false});
    if (this.isName(NAME)) {
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
onUserIdEdit = () =>{
  this.setState({editUserId: !this.state.editUserId});
}

render() {
  let bottomWell;
  let editUserId;
  editUserId=
     <td >
       <input
         value={this.state.suggestedUserId}
         className='inputValue disabled'
         readOnly
       />
       <Button
         onClick={this.onUserIdEdit}
         bsStyle='primary'
         className='editButton'>
         <Glyphicon glyph="pencil" />
       </Button>
     </td>;
  if (this.state.editUserId) {
    editUserId=
    <td >
      <input
        placeholder={this.state.suggestedUserId}
        className='inputValue'
        onChange={this.onUserIdChange}
      />
      <Button
        onClick={this.onUserIdEdit}
        bsStyle='danger'
        className='editButton'>
        <Glyphicon glyph="remove" />
      </Button>
    </td>;
  }

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
          <Panel className='rightPanel'>
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
                      { editUserId }

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
