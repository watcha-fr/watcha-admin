import React, { Component } from 'react';
import {Collapse, Panel, Well, Table, Glyphicon, ListGroupItem, ListGroup} from 'react-bootstrap';
import { withNamespaces } from 'react-i18next';
import UserInRoom from './UserInRoom';

class RoomRightPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: true,
      editEmail: false,
      isEmail: false,
      emailValue: '',
    };
  }


  onClose = () => {
    this.props.onClose();
  }

  onUserClicked = (userName) => {
    this.props.onTabSelected(2, userName);
  }

  simplifiedUserId = (fulluserId) =>{
    let simplifiedUserId = fulluserId.replace('@', '');
    simplifiedUserId = simplifiedUserId.split(':');
    simplifiedUserId = simplifiedUserId[0];
    return simplifiedUserId;
  }


  render() {
    const {t} =this.props;
    const BSSTYLE = 'primary';
    const TITLE = 'Room';
    const OPEN = this.props.data ? true : false;
    const users = [];
    for (const user in this.props.data['Users']['simplifiedData'] ) {
      if ({}.hasOwnProperty.call(this.props.data['Users']['simplifiedData'], user)) {
        users.push(<ListGroupItem
          key={user}>
          <UserInRoom simplifiedName={this.simplifiedUserId(this.props.data['Users']['simplifiedData'][user])} onUserClicked={this.onUserClicked} userName={this.props.data['Users']['simplifiedData'][user]} />
        </ListGroupItem>);
      }
    }
    return (
      <div>
        <Collapse in={OPEN} dimension='width' timeout={0}>
          <div>

            <Panel bsStyle={BSSTYLE} className='rightPanel'>
              <Panel.Heading>
                <Panel.Title componentClass='h3'>
                  { t(TITLE) }: { this.props.data['Room Id']['simplifiedData'] }
                  <Glyphicon glyph="remove" className='dismissRight' onClick={this.onClose} />
                </Panel.Title>
              </Panel.Heading>

              <div className='pannelContainer'>
                <Well>
                  <Table>
                    <tbody>
                      <tr>
                        <td className='labelText'>{ t('Name') }:</td>
                        <td className='infoText'>{ this.props.data['Name']['simplifiedData'] }</td>
                      </tr>
                      <tr>
                        <td className='labelText'>{ t('Creator') }:</td>
                        <td className='infoText'>{ this.props.data['Creator']['simplifiedData'] }</td>
                      </tr>
                      <tr>
                        <td className='labelText'>{ t('Active') }:</td>
                        <td className='infoText'>{ this.props.data['Active']['simplifiedData'].toString() }</td>
                      </tr>
                    </tbody>
                  </Table>
                </Well>
                <Panel id="collapsible-panel-users">
                  <Panel.Heading>
                    <Panel.Title>{ this.props.data['Users']['simplifiedData'].length } { t('Users in this room') }</Panel.Title>
                    <Panel.Toggle componentClass="a">{ t('Show users') }</Panel.Toggle>
                  </Panel.Heading>
                  <Panel.Collapse>
                    <Panel.Body>
                      <ListGroup>
                        { users }
                      </ListGroup>
                    </Panel.Body>
                  </Panel.Collapse>
                </Panel>
              </div>
            </Panel>
          </div>
        </Collapse>
      </div>
    );
  }
}
export default withNamespaces('common')(RoomRightPanel);
