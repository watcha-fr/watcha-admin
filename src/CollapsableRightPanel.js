import React, { Component } from 'react';
import {Collapse,Panel,Label,Button,Well,FormControl,FormGroup,ControlLabel,Form,Table} from 'react-bootstrap';

export default class CollapsableRightPanel extends Component {

  constructor(props) {
    super(props);

    this.state = {
      open: true
    };
  }

  render() {
    let upgradePartner
    if(this.props.data['partner']=== 'true')
    {
      upgradePartner=<Button bsStyle='primary'>Upgrade to member</Button>
    }
    let open = this.props.data ? true : false;
    return (
      <div>
        <Collapse in={open} dimension='width' timeout={0}>
          <div>

            <Panel bsStyle='primary' className='panel'>
              <Panel.Heading>
                <Panel.Title componentClass='h3'>User : {this.props.data['userId']}</Panel.Title>
              </Panel.Heading>

              <div className='pannelContainer'>
                <Well>
                  <Table>
                    <tbody>
                      <tr>
                        <td className='labelText'>Creation:</td>
                        <td>{this.props.data['creationTs']}</td>
                      </tr>
                      <tr>
                        <td className='labelText'>Last Connection:</td>
                        <td>{this.props.data['creationTs']}</td>
                      </tr>
                      <tr>
                          <td><ControlLabel>Email :</ControlLabel>{' '}</td>
                          <td> <input type="email" placeholder={this.props.data['email']} readOnly/></td>
                    </tr>
                    </tbody>
                  </Table>
                </Well>
                {upgradePartner}
                <Button bsStyle='primary'>Reset Password</Button>
              </div>


            </Panel>
          </div>
        </Collapse>
      </div>
    );
  }

}
