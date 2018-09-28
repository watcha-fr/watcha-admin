import React, { Component } from 'react';
import Datatorow from './DataToRow';
import {Table} from 'react-bootstrap';
import CollapsableRightPanel from './CollapsableRightPanel';

const tableType = {
  'user': {'primaryKey': 'User Id', 'apiAdress': '_matrix/client/r0/watchauserlist',
    'header': {'User Id': 'name', 'date of creation': 'creation_ts',
      'Admin': 'admin', 'Partner': 'is_partner', 'Email': 'email', 'Devices': 'display_name'} },
  'room': {'primaryKey': 'Room Id', 'apiAdress': '_matrix/client/r0/watcharoomlist',
    'header': {'Room Id': 'room_id', 'Creator': 'creator'} },
  'stats': {},
};


export default class UserTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false,
      rightPanel: false,
      arrayOfdata: [],
      dataToRow: [],
      type: tableType[this.props.tableName],
    };
  }

  componentDidMount = () => {
    document.addEventListener('keydown', this.escFunction, false);
    this.setState({header: this.getHeader(this.state.type)});
    this.getData();
    this.setState({finished: true });
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.escFunction, false);
  }

  onUserSelected = (data) => {
    this.setState({ selected: data });
  };

  escFunction = (event) => {
    if (event.keyCode === 27) {
      this.setState({selected: false});
    }
  }

  closeRightPanel = () => {
    this.setState({
      selected: false,
    });
  }

  getHeader = (type) => {
    const header = [];
    for (const elem in type['header']) {
      if ({}.hasOwnProperty.call(type['header'], elem)) {
        header.push(<th key={elem}> { elem } </th>);
      }
    }


    return header;
  }

  getUserData = async () => {
    let userData;
    const homeServer = this.props.server;
    const accessToken = this.props.token;

    try {
      const userRequest = await fetch(homeServer+ this.state.type['apiAdress'], {
        method: 'GET',
        headers: {
          'Authorization': 'bearer '+accessToken,
        },
      });

      userData = JSON.parse(await userRequest.text());
    } catch (e) {
      console.log('error: ' + e);
      return;
    }

    for (const user in userData) {
      if ({}.hasOwnProperty.call(userData, user)) {
        const dataObject={};
        for (const columnHeader in this.state.type['header']) {
          if ({}.hasOwnProperty.call(this.state.type['header'], columnHeader)) {
            for (const property in userData[user]) {
              if ({}.hasOwnProperty.call(userData[user], property)) {
                if (property === this.state.type['header'][columnHeader]) {
                  dataObject[columnHeader] = userData[user][property];
                }
              }
            }
          }
        }

        this.state.arrayOfdata.push(dataObject);
      }
    }


    this.setState({finish: true});
  }
  getData = () => {
    let data;
    switch (this.props.tableName) {
      case 'room':
        data = this.getUserData();
        break;
      case 'user':
        data = this.getUserData();
        break;
      default:
        data = '';
    }
    return data;
  }

  render() {
    const dataToRow=[];

    for (const row in this.state.arrayOfdata) {
      if ({}.hasOwnProperty.call( this.state.arrayOfdata, row)) {
        dataToRow.push(
            <Datatorow data={this.state.arrayOfdata[row]} onUserSelected={this.onUserSelected} selected={this.state.selected} primaryKey={this.state.type['primaryKey']} key={row} />,
        );
      }
    }

    return (

      <div className='userTable'>
        <Table striped bordered condensed hover responsive>
          <thead>
            <tr>
              { this.state.header }
            </tr>
          </thead>
          <tbody>
            { dataToRow }
          </tbody>
        </Table>
        <CollapsableRightPanel className='collapsedRightPanel' data={this.state.selected} close={this.closeRightPanel} tableName={this.props.tableName} />
      </div>
    );
  }
}
