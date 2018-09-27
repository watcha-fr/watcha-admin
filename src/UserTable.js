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
const arrayOfdata = [];
let type;
let header;
let dataToRow = [];

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
    type = tableType[this.props.tableName];
    header = this.getHeader(type);
    this.getData();
    this.setState({finished: true });
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.escFunction, false);
  }

  onUserSelected = (data) => {
    this.setState({ selected: data });
    console.log(this.state.selected + ' selected')
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
    for (const elems in type['header']) {
      header.push(<th key={elems}> { elems } </th>);
    }


    return header;
  }

  getUserData = async () => {
    let userData;
    const homeServer = this.props.server;
    const accessToken = this.props.token;
    const primaryKey = type['primaryKey'];

    try {
      const userRequest = await fetch(homeServer+ type['apiAdress'], {
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

    for (let user in userData) {
      const dataObject={};
      for (const columnHeader in type['header']) {
        for (const property in userData[user]) {
          if (property === type['header'][columnHeader]) {
            dataObject[columnHeader] = userData[user][property];
          }
        }
      }

      arrayOfdata.push(dataObject);
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
    dataToRow=[]
    for (let row in arrayOfdata) {
      dataToRow.push(
          <Datatorow data={arrayOfdata[row]} onUserSelected={this.onUserSelected} selected={this.state.selected} primaryKey={type['primaryKey']} key={row} />,
      );
    }
    return (

      <div className='userTable'>
        <Table striped bordered condensed hover responsive>
          <thead>
            <tr>
              { header }
            </tr>
          </thead>
          <tbody>
            { dataToRow }
          </tbody>
        </Table>
        <CollapsableRightPanel className='collapsedRightPanel' data={this.state.selected} close={this.closeRightPanel}></CollapsableRightPanel>
      </div>
    );
  }
}
