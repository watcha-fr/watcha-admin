import React, { Component } from 'react';
import CardStats from './CardStats';
import ServerBar from './serverBar';

import { PageHeader, Panel} from 'react-bootstrap';


export default class StatsTab extends Component {
  constructor(props) {
    super(props);


    this.state = {
    };
  }

  componentDidMount = () => {
    this.getStats();
    this.getServerState();
  }

  getStats = async () => {
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
      stats: statsData,
    });
  }

  getServerState = async () => {
    let serverState;
    const homeServer = this.props.server;
    const accessToken = this.props.token;

    try {
      const serverStateRequest = await fetch(homeServer+ '_matrix/client/r0/watcha_server_state', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer '+accessToken,
        },
      });

      serverState = JSON.parse(await serverStateRequest.text());
    } catch (e) {
      console.log('error: ' + e);
      return;
    }
    this.setState({
      serverState: serverState,
    });
  }


  render() {
    let membersData;
    let partnersData;
    let bigRoomsData;
    let oneOnOneData;
    let activeRooms;
    let serverState;
    const usersLines = [];
    const roomsLines = [];
    if (this.state.stats) {
      membersData = this.state.stats['users']['local'];
      partnersData = this.state.stats['users']['partners'];
      bigRoomsData = this.state.stats['rooms']['one_one_rooms_count'];
      oneOnOneData = this.state.stats['rooms']['big_rooms_count'];
      activeRooms = this.state.stats['rooms']['big_rooms_count_active'];
      usersLines.push( {label: 'members', data: membersData},
          {label: 'partners', data: partnersData});
      roomsLines.push( {label: 'Active', data: activeRooms},
          {label: 'One on One', data: oneOnOneData},
          {label: 'Inactive', data: bigRoomsData-activeRooms});
    }
    if (this.state.serverState) {
      serverState =
      <div>
        <ServerBar label='CPU Usage' percent={this.state.serverState['cpu']['average']} />
        <ServerBar label='Memory Usage' percent={this.state.serverState['memory']['memory']['percent']} />
        <ServerBar label='Disk Usage' percent={this.state.serverState['disk']['percent']} />
      </div>;
    }
    return (
      <div>
        <PageHeader>
        Statistics for Watcha server { this.props.server.replace('https://', '').replace('/', '') }
        </PageHeader>
        <div className='statsPanelsContainer'>
          <CardStats lines={usersLines} icon='user' title='Users' />
          <CardStats lines={roomsLines} icon='comment' title='Rooms' />
        </div>
        <div className='statsPanelsContainer'>
          <Panel bsStyle="primary" className='statsPanel'>
            <Panel.Heading>
              <Panel.Title componentClass="h3">Server State</Panel.Title>
            </Panel.Heading>
            <Panel.Body>
              { serverState }
            </Panel.Body>
          </Panel>

          <Panel bsStyle="primary" className="statsPanel">
            <Panel.Heading>
              <Panel.Title componentClass="h3">Server Log</Panel.Title>
            </Panel.Heading>
            <Panel.Body>
              log
            </Panel.Body>
          </Panel>
        </div>
      </div>
    );
  }
}
