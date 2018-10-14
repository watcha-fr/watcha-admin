import React, { Component } from 'react';
import CardStats from './CardStats';
import { PageHeader} from 'react-bootstrap';


export default class StatsTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }


  render() {
    let membersData;
    let partnersData;
    let bigRoomsData;
    let oneOnOneData;
    let activeRooms;
    const usersLines = [];
    const roomsLines = [];
    if (this.props.stats) {
      membersData = this.props.stats['users']['local'];
      partnersData = this.props.stats['users']['partners'];
      bigRoomsData = this.props.stats['rooms']['one_one_rooms_count'];
      oneOnOneData = this.props.stats['rooms']['big_rooms_count'];
      activeRooms = this.props.stats['rooms']['big_rooms_count_active'];
      usersLines.push( {label: 'members', data: membersData},
          {label: 'partners', data: partnersData});
      roomsLines.push( {label: 'Active', data: activeRooms},
          {label: 'One on One', data: oneOnOneData},
          {label: 'Inactive', data: bigRoomsData-activeRooms});
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
