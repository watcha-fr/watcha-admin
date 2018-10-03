import React, { Component } from 'react';
import {Collapse, Panel, Button, Well, Table, Glyphicon} from 'react-bootstrap';

export default class UserRightPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: true,
      editEmail: false,
      isEmail: false,
      emailValue: ' ',
    };
  }

  componentDidUpdate(prevProps) {
  // Typical usage (don't forget to compare props):
    if (this.props.data !== prevProps.data) {
      if (this.props.data['Email']) {
        this.setState({emailValue: this.props.data['Email']});
      } else {
        this.setState({emailValue: ' '});
      }
    }
  }

  onEmailEdit = () => {
    this.setState({editEmail: !this.state.editEmail});
  }

  isEmail = (query) => {
    return query.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
  }

  onCancelEdit = () => {
    this.setState({emailValue: ''});
    this.setState({editEmail: false});
  }


  onEmailChange = (ev) => {
    this.setState({emailValue: ev.target.value});
    this.setState({isEmail: false});
    if (this.isEmail(ev.target.value)) {
      this.setState({isEmail: true});
    }
  }

  onClose = () => {
    this.props.close();
  }

  onEmailValidate = () => {

  }

  render() {
    let upgradePartner;
    let editEmail;
    let bsStyle;
    let title;
    bsStyle = 'primary';
    title = 'User';
    const open = this.props.data ? true : false;

    const isPartner = this.props.data['Partner'];

    if (isPartner) {
      upgradePartner=<Button bsStyle='primary'>Upgrade to member</Button>;
      bsStyle='warning';
      title='Partner';
    }
    editEmail=
    <td>
      <input className='infoText' value={this.state.emailValue} readOnly type="email" placeholder={this.props.data['email']} />
      <Button onClick={this.onEmailEdit}>
        <Glyphicon glyph="pencil"></Glyphicon>
      </Button>
    </td>;
    if (this.state.editEmail) {
      if (this.state.isEmail) {
        editEmail =
        <td>
          <input className='infoText' value={this.state.emailValue} type="email" placeholder={this.props.data['email']} onChange={this.onEmailChange} ref='emailInput' />
          <Button onClick={this.onEmailValidate}>
            <Glyphicon glyph="ok"></Glyphicon>
          </Button>
        </td>;
      } else {
        editEmail=
        <td>
          <input className='infoText' value={this.state.emailValue} type="email" placeholder={this.props.data['email']} onChange={this.onEmailChange} />
          <Button onClick={this.onCancelEdit}>
            <Glyphicon glyph="remove"></Glyphicon>
          </Button>
        </td>;
      }
    }

    return (
      <div>
        <Collapse in={open} dimension='width' timeout={0}>
          <div>

            <Panel bsStyle={bsStyle} className='panel'>
              <Panel.Heading>
                <Panel.Title componentClass='h3'>
                  { title } : { this.props.data['User Id'] }
                  <Glyphicon glyph="remove" className='dismissRight' onClick={this.onClose}></Glyphicon>
                </Panel.Title>
              </Panel.Heading>

              <div className='pannelContainer'>
                <Well>
                  <Table>
                    <tbody>
                      <tr>
                        <td className='labelText'>Creation:</td>
                        <td className='infoText'>{ this.props.data['date of creation'] }</td>
                      </tr>
                      <tr>
                        <td className='labelText'>Last Connection:</td>
                        <td className='infoText'>{ this.props.data['last connection'] }</td>
                      </tr>
                      <tr>
                        <td className='labelText'>Devices:</td>
                        <td className='infoText'>{ this.props.data.device }</td>
                      </tr>
                      <tr>
                        <td className='labelText'>Email :</td>
                        { editEmail }
                      </tr>
                    </tbody>
                  </Table>
                </Well>
                <div className='bottomButton'>
                  { upgradePartner }
                  <Button bsStyle='primary'>Reset Password</Button></div>
              </div>
            </Panel>
          </div>
        </Collapse>
      </div>
    );
  }
}
