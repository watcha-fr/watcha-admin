import React, { Component } from 'react';
import {Tab, Tabs} from 'react-bootstrap';
import DataToTable from './DataToTable';
import TableToolBar from './TableToolBar';
import CollapsableRightPanel from './CollapsableRightPanel';


export default class AdminHome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      refresh: true,
    };
  }
  onRefresh = () => {
    this.setState({refresh: !this.state.refresh});
  }

  onClose = () => {
    this.setState({
      rightPanel: false,
    });
  }

  setRightPanel = (panel) =>{
    this.setState({
      rightPanel: panel,
    });
  }
  render() {
    let panel;
    if (this.state.rightPanel) {
      panel = <CollapsableRightPanel
        panelType={this.state.rightPanel['type']} data={this.state.rightPanel['data']} onClose={this.onClose} />;
    }
    return (

      <div className='AdminHomeContainer'>
        <Tabs defaultActiveKey={1} className='tabsContainer' id='tabs'>
          <TableToolBar refresh={this.onRefresh} setRightPanel={this.setRightPanel} onClose = {this.onClose}></TableToolBar>
          <Tab eventKey={1} title="Users">
            <DataToTable tableName='user' token={this.props.token} server={this.props.server} key={this.state.refresh} setRightPanel={this.setRightPanel} onClose = {this.onClose} />
          </Tab>
          <Tab eventKey={2} title="Rooms">
            <DataToTable tableName='room' token={this.props.token} server={this.props.server} key={this.state.refresh} setRightPanel={this.setRightPanel} onClose = {this.onClose} />
          </Tab>
          <Tab eventKey={3} title="Stats">
          Tab 3 content
          </Tab>
        </Tabs>
        { panel }
      </div>
    );
  }
}
