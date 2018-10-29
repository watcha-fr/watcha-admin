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
    const key= this.state.key? this.state.key : 1;
    const selected= this.state.data? this.state.data : false;

    const statsTab = <StatsTab
      token={this.props.token}
      server={this.props.server}
      onTabSelected={this.onTabSelected}
    />;

    return (

      <div className='AdminHomeContainer'>
        <Tabs activeKey={key} className='tabsContainer' id='tabs' onSelect={this.handleSelect}>
          <Tab eventKey={1} title="Stats">
            { statsTab }
          </Tab>

          <Tab eventKey={2} title="Users">
            <DataToTable tableName='user'
              token={this.props.token}
              server={this.props.server}
              setRightPanel={this.setRightPanel}
              onClose = {this.onClose}
              value = {selected}
              onTabSelected={this.onTabSelected} />
          </Tab>

          <Tab eventKey={3} title="Rooms">
            <DataToTable tableName='room'
              token={this.props.token}
              server={this.props.server}
              setRightPanel={this.setRightPanel}
              onClose = {this.onClose}
              stats={this.state.statsData}
              value = {selected}
              onTabSelected={this.onTabSelected} />
          </Tab>
        </Tabs>

      </div>
    );
  }
}
