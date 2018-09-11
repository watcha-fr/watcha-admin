import React, { Component } from 'react';
import {Collapse, Panel, Button, Well, Table, Glyphicon} from 'react-bootstrap';

export default class CollapsableRightPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: true,
      editEmail: false,
      isEmail: false,
      emailValue: '',
    };
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

  onEmailValidate = () => {

  }

  componentWillReceiveProps(nextProps) {
    this.setState({emailValue: ''});
  }

  render() {
    let upgradePartner;
    let isPartner;
    let editEmail;
    let bsStyle;
    let title;
    bsStyle = 'primary';
    title = 'User';
    const open = this.props.data ? true : false;
    if (this.props.data['partner']=== 'true') {
      isPartner = true;
    }
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
                <Panel.Title componentClass='h3'>{ title } : { this.props.data['userId'] }</Panel.Title>
              </Panel.Heading>

              <div className='pannelContainer'>
                <Well>
                  <Table>
                    <tbody>
                      <tr>
                        <td className='labelText'>Creation:</td>
                        <td className='infoText'>{ this.props.data['creationTs'] }</td>
                      </tr>
                      <tr>
                        <td className='labelText'>Last Connection:</td>
                        <td className='infoText'>{ this.props.data['last_connection'] }</td>
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
