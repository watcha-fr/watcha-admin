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
    const HOME_SERVER = this.props.server;
    const ACCESS_TOKEN = this.props.token;

    try {
      const STATS_REQUEST = await fetch(HOME_SERVER+ '_matrix/client/r0/watcha_admin_stats', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer '+ACCESS_TOKEN,
        },
      });

      statsData = JSON.parse(await STATS_REQUEST.text());
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
    const HOME_SERVER = this.props.server;
    const ACCESS_TOKEN = this.props.token;

    try {
      const SERVER_REPORT_REQUET = await fetch(HOME_SERVER+ '_matrix/client/r0/watcha_server_state', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer '+ACCESS_TOKEN,
        },
      });

      serverReport = JSON.parse(await SERVER_REPORT_REQUET.text());
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
    let Admin;
    const USER_LINES = [];
    const ROOM_LINES = [];
    if (this.state.stats) {
      membersData = this.state.stats['users']['local'];
      partnersData = this.state.stats['users']['partners'];
      bigRoomsData = this.state.stats['rooms']['one_one_rooms_count'];
      oneOnOneData = this.state.stats['rooms']['big_rooms_count'];
      activeRooms = this.state.stats['rooms']['big_rooms_count_active'];
      Admin = this.state.stats['admins'];
      USER_LINES.push( {label: 'Members', data: membersData},
          {label: 'Partners', data: partnersData}, {label: 'Admin', data: Admin});
      ROOM_LINES.push( {label: 'Active rooms', data: activeRooms},
          {label: 'Personal conversation', data: oneOnOneData},
          {label: 'Inactive Rooms', data: bigRoomsData-activeRooms});
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
          <CardStats lines={USER_LINES} title='Users' onTabSelected={this.props.onTabSelected} />
          <CardStats lines={ROOM_LINES} title='Rooms' onTabSelected={this.props.onTabSelected} />
        </div>
        { buttonReport }
      </div>
    );
  }
}
