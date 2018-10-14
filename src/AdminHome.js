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
    this.getStats();
  }

  onClose = () => {
    this.setState({
      rightPanel: false,
    });
  }

  getStats = async () =>{
    let statsData;
    const homeServer = this.props.server;
    //const accessToken = this.props.token;

    try {
      const statsRequest = await fetch(homeServer+ '_matrix/client/r0/stats', {
        method: 'GET',
        headers: {
        },
      });

      statsData = JSON.parse(await statsRequest.text());
    } catch (e) {
      console.log('error: ' + e);
      return;
    }
    this.setState({
      statsData: statsData,
    });
  }


  render() {
    let statsTab;
    if (this.state.statsData) {
      statsTab=<StatsTab
        token={this.props.token}
        server={this.props.server}
        stats={this.state.statsData} />;
    }
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
