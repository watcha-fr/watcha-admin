import React, { Component } from 'react';
import {PageHeader, Panel} from 'react-bootstrap';


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
  let usersData;
  if (this.state.statsData) {
    usersData=this.state.statsData['users']['local'];
  }
  return (
    <div>
      <PageHeader>
        Statistics for Watcha server { this.props.server.replace('https://', '').replace('/', '') }
      </PageHeader>
      <Panel bsStyle="primary">
        <Panel.Heading>
          <Panel.Title componentClass="h3">Users</Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          <div>Members Users: { usersData }</div>
        </Panel.Body>
      </Panel>
    </div>
  );
}
}
