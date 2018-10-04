import React, { Component } from 'react';
import {Tab, Tabs} from 'react-bootstrap';
import DataToTable from './DataToTable';
import RefreshButton from './Buttons/RefreshButton.js';


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
  render() {
    return (

      <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
        <RefreshButton onClick={this.onRefresh} />
        <Tab eventKey={1} title="Users">
          <DataToTable tableName='user' token={this.props.token} server={this.props.server} key={this.state.refresh} />
        </Tab>
        <Tab eventKey={2} title="Rooms">
          <DataToTable tableName='room' token={this.props.token} server={this.props.server} key={this.state.refresh} />
        </Tab>
        <Tab eventKey={3} title="Stats">
          Tab 3 content
        </Tab>
      </Tabs>
    );
  }
}
