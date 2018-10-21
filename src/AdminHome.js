import React, { Component } from 'react';
import {Tab, Tabs} from 'react-bootstrap';
import DataToTable from './DataToTable';
import StatsTab from './StatsTab';


export default class AdminHome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      refresh: true,
    };
  }

  componentDidMount = () =>{

  }

  onClose = () => {
    this.setState({
      rightPanel: false,
    });
  }

  render() {
    const statsTab = <StatsTab
      token={this.props.token}
      server={this.props.server} />;

    return (

      <div className='AdminHomeContainer'>
        <Tabs defaultActiveKey={1} className='tabsContainer' id='tabs'>
          <Tab eventKey={1} title="Stats">
            { statsTab }
          </Tab>
          <Tab eventKey={2} title="Rooms">
            <DataToTable tableName='room'
              token={this.props.token}
              server={this.props.server}
              setRightPanel={this.setRightPanel}
              onClose = {this.onClose}
              stats={this.state.statsData} />
          </Tab>
          <Tab eventKey={3} title="Users">
            <DataToTable tableName='user'
              token={this.props.token}
              server={this.props.server}
              setRightPanel={this.setRightPanel}
              onClose = {this.onClose} />
          </Tab>
        </Tabs>

      </div>
    );
  }
}
