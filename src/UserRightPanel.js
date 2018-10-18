import React, { Component } from 'react';
import {Collapse, Panel, Button, Well, Table, Glyphicon, Alert} from 'react-bootstrap';

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
  componentDidMount() {
    if (this.props.data['Email']['data']) {
      this.setState({emailValue: this.props.data['Email']['data']});
    } else {
      this.setState({emailValue: ' '});
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.data !== prevProps.data) {
      if (this.props.data['Email']['data']) {
        this.setState({emailValue: this.props.data['Email']['data']});
        this.setState({editEmail: false});
        this.setState({
          infoMessage: false,
        });
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
    this.setState({emailValue: this.props.data['Email']['data']});
    this.setState({editEmail: false});
  }


  onEmailChange = (ev) => {
    this.setState({emailValue: ev.target.value});
    this.setState({isEmail: false});
    if (this.isEmail(ev.target.value)) {
      this.setState({isEmail: true});
      this.setState({new_email: ev.target.value});
    }
  }

  onClose = () => {
    this.props.onClose();
  }

  onEmailValidate = async () => {
    const homeServer = this.props.server;
    const accessToken = this.props.token;
    try {
      const userRequest
       = await fetch(homeServer+ '_matrix/client/r0/watchaupdatemail/'+
        encodeURIComponent(this.props.data['User Id']['data']), {
         method: 'POST',
         headers: {
           'Authorization': 'Bearer '+ accessToken,
           'Accept': 'application/json',
           'Content-Type': 'application/json',
         },
         body: JSON.stringify(
             {new_email: this.state.new_email},
         ),
       });
      const response = JSON.parse(await userRequest.text());
      if (userRequest.ok) {
        this.setState({
          message: {type: 'success', title: 'Email updated',
            body: this.props.data['User Id']['data'] + ' email has been updated'},
        });
        this.props.refresh();
        this.displayInfoMessage();
        this.setState({
          editEmail: false,
        });
      } else {
        this.setState({
          message: {type: 'danger', title: 'Email update failed', body: response['error'] },
        });
        this.displayInfoMessage();
      }
    } catch (e) {
      console.log('error: ' + e);
      return;
    }
  }
   upgradePartner = async () => {
     const homeServer = this.props.server;
     const accessToken = this.props.token;
     try {
       const userRequest
       = await fetch(homeServer+ '_matrix/client/r0/watchaupdatepartnertomember/'+
        encodeURIComponent(this.props.data['User Id']['data']), {
         method: 'PUT',
         headers: {
           'Authorization': 'Bearer '+ accessToken,
           'Accept': 'application/json',
           'Content-Type': 'application/json',
         },
       });
       const response = JSON.parse(await userRequest.text());
       if (userRequest.ok) {
         this.setState({
           message: {type: 'success', title: 'Status updated',
             body: this.props.data['User Id']['data'] + ' account has been upgraded to member'},
         });
         this.props.refresh();
         this.displayInfoMessage();
       } else {
         this.setState({
           message: {type: 'danger', title: 'upgrade failed', body: response['error'] },
         });
         this.displayInfoMessage();
       }
     } catch (e) {
       console.log('error: ' + e);
       return;
     }
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

  resetPassword = async () => {
    const homeServer = this.props.server;
    const accessToken = this.props.token;
    try {
      const userRequest = await fetch(homeServer+'_matrix/client/r0/watcha_reset_password'+
        encodeURIComponent(this.props.data['User Id']['data']), {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer '+ accessToken,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {user: this.props.data['User Id']['data']},
        ),
      });
      const response = JSON.parse(await userRequest.text());
      if (userRequest.ok) {
        this.setState({
          message: {type: 'success', title: 'Password reseted',
            body: 'an email has been send to ' + this.props.data['User Id']['data'] + ' with a new password'},
        });
        this.props.refresh();
        this.displayInfoMessage();
      } else {
        this.setState({
          message: {type: 'danger', title: 'Password reset failed', body: response['error'] },
        });
        this.displayInfoMessage();
      }
    } catch (e) {
      console.log('error: ' + e);
      return;
    }
  }
  deactivateAccount = async () => {
    const homeServer = this.props.server;
    const accessToken = this.props.token;
    try {
      const userRequest =
      await fetch(homeServer+
        '_matrix/client/r0/admin/deactivate/'+encodeURIComponent(this.props.data['User Id']['data']), {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer '+ accessToken,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },

      });
      const response = JSON.parse(await userRequest.text());
      if (userRequest.ok) {
        this.setState({
          message: {type: 'success', title: 'Account deactivated',
            body: this.props.data['User Id']['data'] + ' account have been deactivated'},
        });
        this.props.refresh();
        this.displayInfoMessage();
      } else {
        this.setState({
          message: {type: 'danger', title: 'Deactivation failed', body: response['error'] },
        });
        this.displayInfoMessage();
      }
    } catch (e) {
      console.log('error: ' + e);
      return;
    }
  }

  render() {
    let upgradePartner;
    let editEmail;
    let bsStyle;
    let title;
    bsStyle = 'primary';
    title = 'User';
    const open = this.props.data ? true : false;
    const isPartner = this.props.data['Status']['data']==='Partner';
    let emailPlaceholder='';

    if (this.props.data['email']) {
      emailPlaceholder = this.props.data['email']['data'];
    }

    if (isPartner) {
      upgradePartner=<Button bsStyle='primary' onClick={this.upgradePartner}>Upgrade to member</Button>;
      bsStyle='warning';
      title='Partner';
    }
    editEmail=
    <td>
      <input
        value={this.state.emailValue}
        readOnly
        type="email"
        placeholder={emailPlaceholder}
        className= 'inputValue disabled' />
      <Button
        onClick={this.onEmailEdit}
        bsStyle='primary'
        className='editButton'>
        <Glyphicon glyph="pencil" />
      </Button>
    </td>;
    if (this.state.editEmail) {
      if (this.state.isEmail) {
        editEmail =
        <td>
          <input
            value={this.state.emailValue}
            type="email" placeholder={emailPlaceholder}
            onChange={this.onEmailChange}
            ref='inputValue'
            className= 'inputValue' />
          <Button
            onClick={this.onEmailValidate}
            bsStyle='success'
            className='validateButton'>
            <Glyphicon glyph="ok" />
          </Button>
        </td>;
      } else {
        editEmail=
        <td>
          <input
            value={this.state.emailValue}
            type="email" placeholder={emailPlaceholder}
            onChange={this.onEmailChange}
            className= 'inputValue' />
          <Button
            onClick={this.onCancelEdit}
            bsStyle='danger'
            className='cancelButton'>
            <Glyphicon glyph="remove" />
          </Button>
        </td>;
      }
    }

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
      bottomWell=
      <div className='bottomButton'>
        { upgradePartner }
        <Button bsStyle='primary' onClick={this.resetPassword}>Reset Password</Button>
        <Button bsStyle='danger' onClick={this.deactivateAccount}>Deactivate Account</Button>
      </div>;
    }
    return (

      <div>
        <Collapse in={open} dimension='width' timeout={0}>
          <div>

            <Panel bsStyle={bsStyle} className='rightPanel'>
              <Panel.Heading>
                <Panel.Title componentClass='h3'>
                  { title } : { this.props.data['User Id']['data'] }
                  <Glyphicon glyph="remove" className='dismissRight' onClick={this.onClose}></Glyphicon>
                </Panel.Title>
              </Panel.Heading>

              <div className='pannelContainer'>
                <Well>
                  <Table>
                    <tbody>
                      <tr>
                        <td className='labelText'>Creation:</td>
                        <td className='infoText'>{ this.props.data['Date of creation']['data'] }</td>
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
                { bottomWell }
              </div>
            </Panel>
          </div>
        </Collapse>
      </div>
    );
  }
}
