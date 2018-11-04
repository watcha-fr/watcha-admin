import React, { Component } from 'react';
import {Collapse, Panel, Button, Well, Table, Glyphicon, Alert } from 'react-bootstrap';

export default class UserRightPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: true,
      editEmail: false,
      isEmail: false,
      emailValue: ' ',
      busy: false,
    };
  }
  componentDidMount() {
    if (this.props.data['Email']['data']) {
      this.setState({emailValue: this.props.data['Email']['data']});
    } else {
      this.setState({emailValue: ' '});
    }
    this.getUsersAdvancedInfos();
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
      this.getUsersAdvancedInfos();
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

  getUsersAdvancedInfos = async () =>{
    const HOME_SERVER = this.props.server;
    const ACCESS_TOKEN = this.props.token;
    try {
      const SERVER_REQUEST
       = await fetch(HOME_SERVER+ '_matrix/client/r0/watcha_user_ip/'+
        encodeURIComponent(this.props.data['User name']['data']), {
         method: 'GET',
         headers: {
           'Authorization': 'Bearer '+ ACCESS_TOKEN,
           'Accept': 'application/json',
           'Content-Type': 'application/json',
         },
       });
      const RESPONSE = JSON.parse(await SERVER_REQUEST.text());
      if (!SERVER_REQUEST.ok) {
        this.setState({
          message: {type: 'danger', title: 'Failed to fetch info', body: RESPONSE['error'] },
        });
        this.displayInfoMessage();
      } else {
        this.setState({
          userInfos: RESPONSE,
        });
      }
    } catch (e) {
      console.log('error: ' + e);
      return;
    }
  }

  onEmailValidate = async () => {
    const HOME_SERVER = this.props.server;
    const ACCESS_TOKEN = this.props.token;
    try {
      const SERVER_REQUEST
       = await fetch(HOME_SERVER+ '_matrix/client/r0/watcha_update_email/'+
        encodeURIComponent(this.props.data['User name']['data']), {
         method: 'PUT',
         headers: {
           'Authorization': 'Bearer '+ ACCESS_TOKEN,
           'Accept': 'application/json',
           'Content-Type': 'application/json',
         },
         body: JSON.stringify(
             {new_email: this.state.new_email},
         ),
       });
      const RESPONSE = JSON.parse(await SERVER_REQUEST.text());
      if (SERVER_REQUEST.ok) {
        this.setState({
          message: {type: 'success', title: 'Email updated',
            body: this.props.data['User name']['data'] + ' email has been updated'},
        });
        this.props.refresh();
        this.displayInfoMessage();
        this.setState({
          editEmail: false,
        });
      } else {
        this.setState({
          message: {type: 'danger', title: 'Email update failed', body: RESPONSE['error'] },
        });
        this.displayInfoMessage();
      }
    } catch (e) {
      console.log('error: ' + e);
      return;
    }
  }
   upgradePartner = async () => {
     const HOME_SERVER = this.props.server;
     const ACCESS_TOKEN = this.props.token;
     try {
       const SERVER_REQUEST
       = await fetch(HOME_SERVER+ '_matrix/client/r0/watcha_update_partner_to_member/'+
        encodeURIComponent(this.props.data['User name']['data']), {
         method: 'PUT',
         headers: {
           'Authorization': 'Bearer '+ ACCESS_TOKEN,
           'Accept': 'application/json',
           'Content-Type': 'application/json',
         },
       });
       const RESPONSE = JSON.parse(await SERVER_REQUEST.text());
       if (SERVER_REQUEST.ok) {
         this.setState({
           message: {type: 'success', title: 'Status updated',
             body: this.props.data['User name']['data'] + ' account has been upgraded to member'},
         });
         this.props.refresh();
         this.displayInfoMessage();
       } else {
         this.setState({
           message: {type: 'danger', title: 'upgrade failed', body: RESPONSE['error'] },
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
    const HOME_SERVER = this.props.server;
    const ACCESS_TOKEN = this.props.token;
    try {
      const SERVER_REQUEST = await fetch(HOME_SERVER+'_matrix/client/r0/watcha_reset_password'+
        encodeURIComponent(this.props.data['User name']['data']), {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer '+ ACCESS_TOKEN,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {user: this.props.data['User name']['data']},
        ),
      });
      const RESPONSE = JSON.parse(await SERVER_REQUEST.text());
      if (SERVER_REQUEST.ok) {
        this.setState({
          message: {type: 'success', title: 'Password reseted',
            body: 'an email has been send to ' + this.props.data['User name']['data'] + ' with a new password'},
        });
        this.props.refresh();
        this.displayInfoMessage();
      } else {
        this.setState({
          message: {type: 'danger', title: 'Password reset failed', body: RESPONSE['error'] },
        });
        this.displayInfoMessage();
      }
    } catch (e) {
      console.log('error: ' + e);
      return;
    }
  }
  identifyUserAgent = (userAgent, elements) =>{
    const REGEXPS = {
      'Chrome': [/Chrome\/(\S+)/],
      'Firefox': [/Firefox\/(\S+)/],
      'MSIE': [/MSIE (\S+);/],
      'Opera': [
        /Opera\/.*?Version\/(\S+)/, /* Opera 10 */
        /Opera\/(\S+)/, /* Opera 9 and older */
      ],
      'Safari': [/Version\/(\S+).*?Safari\//],
    };
    let re; let m; let browser; let version;
    if (userAgent === undefined) {userAgent = navigator.userAgent;}
    if (elements === undefined) {elements = 2;} else if (elements === 0) {elements = 1337;}
    for (browser in REGEXPS) {
      if ({}.hasOwnProperty.call(REGEXPS, browser)) {
        while ((re = REGEXPS[browser].shift())) {
          if ((m = userAgent.match(re))) {
            version = (m[1].match(new RegExp('[^.]+(?:.[^.]+){0,' + --elements + '}')))[0];
            return browser + ' ' + version;
          }
        }
      }
    }

    return null;
  }
  deactivateAccount = async () => {
    const HOME_SERVER = this.props.server;
    const ACCESS_TOKEN = this.props.token;
    try {
      const SERVER_REQUEST =
      await fetch(HOME_SERVER+
        '_matrix/client/r0/admin/deactivate/'+encodeURIComponent(this.props.data['User name']['data']), {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer '+ ACCESS_TOKEN,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },

      });
      const RESPONSE = JSON.parse(await SERVER_REQUEST.text());
      if (SERVER_REQUEST.ok) {
        this.setState({
          message: {type: 'success', title: 'Account deactivated',
            body: this.props.data['User name']['data'] + ' account have been deactivated'},
        });
        this.props.refresh();
        this.displayInfoMessage();
      } else {
        this.setState({
          message: {type: 'danger', title: 'Deactivation failed', body: RESPONSE['error'] },
        });
        this.displayInfoMessage();
      }
    } catch (e) {
      console.log('error: ' + e);
      return;
    }
  }

  addZero = (number) => {
    if (number < 10) {
      number = '0' + number;
    }
    return number;
  }

  getDate = (date) => {
    const OPTIONS = { 'year': 'numeric', 'month': 'long', 'day': 'numeric' };
    const FORMATED_DATE=date.toLocaleDateString('en-En', OPTIONS) +
    ' '+this.addZero(date.getHours())+
    ':'
    +this.addZero(date.getMinutes());
    return FORMATED_DATE;
  }

  render() {
    let upgradePartner;
    let editEmail;
    let bsStyle;
    let title;
    bsStyle = 'primary';
    title = 'User';
    const OPEN = this.props.data ? true : false;
    const ISPARTNER = this.props.data['Status']['data']==='Partner';
    let emailPlaceholder='';
    if (this.props.data['email']) {
      emailPlaceholder = this.props.data['email']['data'];
    }

    if (ISPARTNER) {
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
    const ADVANCED_USER_INFOS = [];
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

    if (this.state.userInfos) {
      for (const CONNECTIONS in this.state.userInfos) {
        if ({}.hasOwnProperty.call(this.state.userInfos, CONNECTIONS)) {
          this.identifyUserAgent(this.state.userInfos[CONNECTIONS][1], 2);
          const DATE = new Date(this.state.userInfos[CONNECTIONS][2]);
          ADVANCED_USER_INFOS.push(
              <tr key = {CONNECTIONS}>
                <td>{ this.state.userInfos[CONNECTIONS][0] }</td>
                <td>{ this.identifyUserAgent(this.state.userInfos[CONNECTIONS][1]) }</td>
                <td>{ this.getDate(DATE) }</td>
              </tr>);
        }
      }
    }

    return (

      <div>
        <Collapse in={OPEN} dimension='width' timeout={0}>
          <div>

            <Panel bsStyle={bsStyle} className='rightPanel'>
              <Panel.Heading>
                <Panel.Title componentClass='h3'>
                  { title } : { this.props.data['User name']['data'] }
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
                  </Table >
                  <Panel id="collapsible-panel-users">
                    <Panel.Heading>
                      <Panel.Toggle componentClass="a">Show connection history</Panel.Toggle>
                    </Panel.Heading>
                    <Panel.Collapse>
                      <Panel.Body>
                        <div className='TableAdvanced'>
                          <Table striped bordered condensed hover>
                            <thead>
                              <tr>
                                <th>Ip</th>
                                <th>Device</th>
                                <th>Connected</th>
                              </tr>
                            </thead>
                            <tbody className='AdvancedUserBody'>
                              { ADVANCED_USER_INFOS }
                            </tbody>
                          </Table>
                        </div>
                      </Panel.Body>
                    </Panel.Collapse>
                  </Panel>
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
