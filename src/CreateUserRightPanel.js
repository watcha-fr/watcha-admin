import React, { Component } from 'react';
import {Collapse, Panel, Glyphicon, Well, Table, Button} from 'react-bootstrap';

export default class CreateUserRightPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }
  createUser = async () =>{
    const homeServer = this.props.server;
    const accessToken = this.props.token;


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
    } catch (e) {
      console.log('error: ' + e);
      return;
    }
  }

  isEmail = (query) => {
    return query.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
  }
  isName = (query) => {
    return true;
  }
  isFirstName = (query) => {
    return true;
  }
  isUserId = (query) => {
    return true;
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
    this.setState({isUserId: false});
    if (this.isUserId(ev.target.value)) {
      this.setState({isUserId: true});
    }
  }
  render() {
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
                <div className='bottomButton'>
                  <Button bsStyle='primary' onClick={this.createUser}>Create User</Button></div>
              </div>
            </Panel>
          </div>
        </Collapse>
      </div>
    );
  }
}
