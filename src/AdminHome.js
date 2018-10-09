import React, { Component } from 'react';
import {Tab, Tabs} from 'react-bootstrap';
import DataToTable from './DataToTable';


export default class AdminHome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      refresh: true,
    };
  }
  onRefresh = () => {
    this.setState({refresh: !this.state.refresh});
  }

  onClose = () => {
    this.setState({
      rightPanel: false,
    });
  }


  render() {
    return (

      <div className='AdminHomeContainer'>
        <Tabs defaultActiveKey={1} className='tabsContainer' id='tabs'>
          <Tab eventKey={1} title="Users">
            <DataToTable tableName='user' token={this.props.token} server={this.props.server} key={this.state.refresh} setRightPanel={this.setRightPanel} onClose = {this.onClose} />
          </Tab>
          <Tab eventKey={2} title="Rooms">
            <DataToTable tableName='room' token={this.props.token} server={this.props.server} key={this.state.refresh} setRightPanel={this.setRightPanel} onClose = {this.onClose} />
          </Tab>
          <Tab eventKey={3} title="Stats">
          Tab 3 content
          </Tab>
        </Tabs>

      </div>
    );
  }
}
