import React, { Component } from 'react';
import CardStats from './CardStats';
import { PageHeader} from 'react-bootstrap';


export default class StatsTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }
componentDidMount = () => {
  this.getStats();
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
  let membersData;
  let partnersData;
  let bigRoomsData;
  let oneOnOneData;
  let activeRooms;
  const usersLines=[];
  const roomsLines=[];
  if (this.state.statsData) {
    membersData = this.state.statsData['users']['local'];
    partnersData = this.state.statsData['users']['partners'];
    bigRoomsData = this.state.statsData['rooms']['one_one_rooms_count'];
    oneOnOneData = this.state.statsData['rooms']['big_rooms_count'];
    activeRooms = this.state.statsData['rooms']['big_rooms_count_active'];
    usersLines.push( {label: 'members', data: membersData}, {label: 'partners', data: partnersData});
    roomsLines.push( {label: 'Active', data: activeRooms}, {label: 'One on One', data: oneOnOneData}, {label: 'Inactive', data: bigRoomsData-activeRooms});
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
    </div>
  );
}
}
