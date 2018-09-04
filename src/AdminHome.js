import React, { Component } from 'react';
import {Tab,Tabs} from 'react-bootstrap';
import UserTable from './UserTable';
import RoomTable from './RoomTable'


export default class AdminHome extends Component {

  render() {
    return (
      <Tabs defaultActiveKey={2} id="uncontrolled-tab-example">
        <Tab eventKey={1} title="Users">
          <UserTable/>
        </Tab>
        <Tab eventKey={2} title="Rooms">
          <RoomTable/>
        </Tab>
        <Tab eventKey={3} title="Stats">
          Tab 3 content
        </Tab>
      </Tabs>
    );
  }

}
