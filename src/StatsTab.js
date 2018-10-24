import React, { Component } from 'react';
import CardStats from './CardStats';

import { PageHeader, Button} from 'react-bootstrap';


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
    let serverReport;
    const homeServer = this.props.server;
    const accessToken = this.props.token;

    try {
      const serverReportRequest = await fetch(homeServer+ '_matrix/client/r0/watcha_server_state', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer '+accessToken,
        },
      });

      serverReport = JSON.parse(await serverReportRequest.text());
    } catch (e) {
      console.log('error: ' + e);
      return;
    }
    this.setState({
      serverReport: serverReport,
    });
  }


  render() {
    let membersData;
    let partnersData;
    let bigRoomsData;
    let oneOnOneData;
    let activeRooms;
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
    let buttonReport;
    if (this.state.serverReport) {
      buttonReport =
      <div>
        <Button>Generate report</Button>
      </div>;
    }
    return (
      <div>
        <PageHeader>
        Statistics for Watcha server
        </PageHeader>
        <div className='statsPanelsContainer'>
          <CardStats lines={usersLines} icon='user' title='Users' />
          <CardStats lines={roomsLines} icon='comment' title='Rooms' />
        </div>
        { buttonReport }
      </div>
    );
  }
}
