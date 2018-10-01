import React, { Component } from 'react';
import {Collapse, Panel, Well, Table, Glyphicon} from 'react-bootstrap';

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
    this.props.close();
  }


  render() {
    const bsStyle = 'primary';
    const title = 'Room';
    const open = this.props.data ? true : false;

    return (
      <div>
        <Collapse in={open} dimension='width' timeout={0}>
          <div>

            <Panel bsStyle={bsStyle} className='panel'>
              <Panel.Heading>
                <Panel.Title componentClass='h3'>
                  { title } : { this.props.data['Room Id'] }
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
                    </tbody>
                  </Table>
                </Well>
              </div>
            </Panel>
          </div>
        </Collapse>
      </div>
    );
  }
}
