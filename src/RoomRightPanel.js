import React, { Component } from 'react';
import {Collapse, Panel, Well, Table, Glyphicon, ListGroupItem, ListGroup} from 'react-bootstrap';

export default class RoomRightPanel extends Component {
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

  onUSerClicked = (ev) => {
    this.props.onTabSelected(2, ev.target.textContent);
  }


  render() {
    const bsStyle = 'primary';
    const title = 'Room';
    const open = this.props.data ? true : false;
    const users = [];
    for (const user in this.props.data['Users']['simplifiedData'] ) {
      if ({}.hasOwnProperty.call(this.props.data['Users']['simplifiedData'], user)) {
        users.push(<ListGroupItem
          key={user}
          onClick={this.onUSerClicked}>
          { this.props.data['Users']['simplifiedData'][user] }
        </ListGroupItem>);
      }
    }
    return (
      <div>
        <Collapse in={open} dimension='width' timeout={0}>
          <div>

            <Panel bsStyle={bsStyle} className='rightPanel'>
              <Panel.Heading>
                <Panel.Title componentClass='h3'>
                  { title } : { this.props.data['Room Id']['simplifiedData'] }
                  <Glyphicon glyph="remove" className='dismissRight' onClick={this.onClose} />
                </Panel.Title>
              </Panel.Heading>

              <div className='pannelContainer'>
                <Well>
                  <Table>
                    <tbody>
                      <tr>
                        <td className='labelText'>Name:</td>
                        <td className='infoText'>{ this.props.data['Name']['simplifiedData'] }</td>
                      </tr>
                      <tr>
                        <td className='labelText'>Creator:</td>
                        <td className='infoText'>{ this.props.data['Creator']['simplifiedData'] }</td>
                      </tr>
                      <tr>
                        <td className='labelText'>Active:</td>
                        <td className='infoText'>{ this.props.data['Active']['simplifiedData'].toString() }</td>
                      </tr>
                    </tbody>
                  </Table>
                </Well>
                <Panel id="collapsible-panel-example-3">
                  <Panel.Heading>
                    <Panel.Title>{ this.props.data['Users']['simplifiedData'].length } users in this room</Panel.Title>
                    <Panel.Toggle componentClass="a">Show users</Panel.Toggle>
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
