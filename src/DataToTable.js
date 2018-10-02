import React, { Component } from 'react';
import Datatorow from './DataToRow';
import {Table} from 'react-bootstrap';
import CollapsableRightPanel from './CollapsableRightPanel';

const tableType = {
  'user': {'primaryKey': 'User Id', 'apiAdress': '_matrix/client/r0/watchauserlist',
    //'JoinTables':
    //{'matchingKey': {}},
    'header':
      {'User Id': {'name': 'name', 'type': 'string'},
        'date of creation': {'name': 'creation_ts', 'type': 'date'},
        'Admin': {'name': 'admin', 'type': 'boolean'},
        'Partner': {'name': 'is_partner', 'type': 'boolean'},
        'Email': {'name': 'email', 'type': 'string'},
        'Devices': {'name': 'display_name', 'type': 'string'}} },
  'room': {
    'primaryKey': 'Room Id', 'apiAdress': '_matrix/client/r0/watcharoomlist',
    'JoinTables':
        {'watcharoomname': {'matchingKey':
          { 'mainTable': 'Room Id', 'secondaryTable': 'room_id'},
        'apiAdress': '_matrix/client/r0/watcharoomname', 'column': 'name'} },
    'header': {'Room Id': {'name': 'room_id', 'type': 'string'},
      'Name': {'name': 'watcharoomname', 'type': 'list'},
      'Creator': {'name': 'creator', 'type': 'string'},
    },
  },
  'stats': {},
};


export default class DataToTable extends Component {
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
    let JoinTablesData;
    const homeServer = this.props.server;
    const accessToken = this.props.token;
    const JoinTables = this.state.type['JoinTables'];
    console.log(accessToken);

    try {
      const userRequest = await fetch(homeServer+ this.state.type['apiAdress'], {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer '+accessToken,
        },
      });

      userData = JSON.parse(await userRequest.text());
    } catch (e) {
      console.log('error: ' + e);
      return;
    }

    for (const user in userData) { //handle the main table;
      if ({}.hasOwnProperty.call(userData, user)) {
        const dataObject={};
        for (const columnHeader in this.state.type['header']) {
          if ({}.hasOwnProperty.call(this.state.type['header'], columnHeader)) {
            for (const property in userData[user]) {
              if ({}.hasOwnProperty.call(userData[user], property)) {
                if (property === this.state.type['header'][columnHeader]['name']) {
                  dataObject[columnHeader] =
                    this.convertRawData(userData[user][property], this.state.type['header'][columnHeader]['type']);
                }
                if (this.state.type['header'][columnHeader]['type']==='list') {
                  dataObject[columnHeader] = [];
                }
              }
            }
          }
        }

        this.state.arrayOfdata.push(dataObject);
      }
    }
    for (const table in JoinTables) {
      if ({}.hasOwnProperty.call(JoinTables, table)) {
        const mainKey= JoinTables[table]['matchingKey'].mainTable;
        const secondaryKey= JoinTables[table]['matchingKey'].secondaryTable;
        const apiAdress = JoinTables[table]['apiAdress'];
        const column = JoinTables[table]['column'];
        try {
          const userRequest = await fetch(homeServer+ apiAdress, {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer '+accessToken,
            },
          });

          JoinTablesData = JSON.parse(await userRequest.text());
        } catch (e) {
          console.log('error: ' + e);
        }

        for (const dataObject in this.state.arrayOfdata) {
          if ({}.hasOwnProperty.call(this.state.arrayOfdata, dataObject)) {
            for (const data in JoinTablesData ) {
              if ({}.hasOwnProperty.call(JoinTablesData, data)) {
                if (this.state.arrayOfdata[dataObject][mainKey] === JoinTablesData[data][secondaryKey]) {
                  for (const columnHeader in this.state.type['header']) {
                    if ({}.hasOwnProperty.call(this.state.type['header'], columnHeader)) {
                      if (table === this.state.type['header'][columnHeader]['name']) {
                        this.state.arrayOfdata[dataObject][columnHeader]=JoinTablesData[data][column];
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }


    this.setState({finish: true});
  }

  convertRawData = (rawData, type) => {
    let data;
    switch (type) {
      case 'string':
        data = rawData;
        break;
      case 'boolean':
        if (rawData === 0) {
          data = false;
        } else {
          data = true;
        }
        break;
      case 'date':
        data=rawData;
        break;
      default:
        data = '';
    }
    return data;
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

      <div className='DataToTable'>
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
