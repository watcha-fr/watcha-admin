import React, { Component } from 'react';
import {Tab, Tabs} from 'react-bootstrap';
import DataToTable from './DataToTable';
import StatsTab from './StatsTab';


export default class AdminHome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      refresh: true,
      key: 1.,
    };
  }

  componentDidMount = () =>{

  }
  onTabSelected = (tabKey, data) =>{
    this.setState({
      key: tabKey,
      data: data,
    });
  }

  onClose = () => {
    this.setState({
      rightPanel: false,
    });
  }

  handleSelect = (key) => {
    this.setState({ key: key });
  }

  render() {
    const KEY= this.state.key? this.state.key : 1;
    const SELECTED= this.state.data? this.state.data : false;

    const STATSTAB = <StatsTab
      token={this.props.token}
      server={this.props.server}
      onTabSelected={this.onTabSelected}
    />;

    return (

      <div className='AdminHomeContainer'>
        <Tabs activeKey={KEY} className='tabsContainer' id='tabs' onSelect={this.handleSelect}>
          <Tab eventKey={1} title="Stats">
            { STATSTAB }
          </Tab>

          <Tab eventKey={2} title="Users">
            <DataToTable tableName='user'
              token={this.props.token}
              server={this.props.server}
              setRightPanel={this.setRightPanel}
              onClose = {this.onClose}
              value = {SELECTED}
              onTabSelected={this.onTabSelected} />
          </Tab>

          <Tab eventKey={3} title="Rooms">
            <DataToTable tableName='room'
              token={this.props.token}
              server={this.props.server}
              setRightPanel={this.setRightPanel}
              onClose = {this.onClose}
              stats={this.state.statsData}
              value = {SELECTED}
              onTabSelected={this.onTabSelected} />
          </Tab>
        </Tabs>

      </div>
    );
  }
}
