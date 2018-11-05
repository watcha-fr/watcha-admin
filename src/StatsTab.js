import React, { Component } from 'react';
import CardStats from './CardStats';
import { withNamespaces } from 'react-i18next';
import { PageHeader, Button} from 'react-bootstrap';

class StatsTab extends Component {
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
    const { t } = this.props;
    const USER_LINES = [];
    const ROOM_LINES = [];
    if (this.state.stats) {
      membersData = this.state.stats['users']['local'];
      partnersData = this.state.stats['users']['partners'];
      bigRoomsData = this.state.stats['rooms']['one_one_rooms_count'];
      oneOnOneData = this.state.stats['rooms']['big_rooms_count'];
      activeRooms = this.state.stats['rooms']['big_rooms_count_active'];
      Admin = this.state.stats['admins'];
      USER_LINES.push( {label: t('Members'), data: membersData},
          {label: t('Partners'), data: partnersData}, {label: t('Admin'), data: Admin});
      ROOM_LINES.push( {label: t('Active rooms'), data: activeRooms},
          {label: t('Personal conversation'), data: oneOnOneData},
          {label: t('Inactive Rooms'), data: bigRoomsData-activeRooms});
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
          { t('Statistics for Watcha server') }
        </PageHeader>
        <div className='statsPanelsContainer'>
          <CardStats lines={USER_LINES} title={t('Users')} onTabSelected={this.props.onTabSelected} />
          <CardStats lines={ROOM_LINES} title={t('Rooms')} onTabSelected={this.props.onTabSelected} />
        </div>
        { buttonReport }
      </div>
    );
  }
}
export default withNamespaces('common')(StatsTab);
