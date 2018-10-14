import React, { Component } from 'react';
import Datatorow from './DataToRow';
import {Table} from 'react-bootstrap';
import TableToolBar from './TableToolBar';
import CollapsableRightPanel from './CollapsableRightPanel';
/*

 */
const tableType = // here we declare all the type of table we wish to display
{
  'user': //the name of the table
  {
    /* the primary key is the primary key corresponding to the sql db equivalent of our table,
     api is the synapse api which the table as json object*/

    'primaryKey': 'User Id', 'apiAdress': '_matrix/client/r0/watchauserlist',

    /*if the table we want to display need data from more than one table we add JoinTables property to our dataObject
    matchingKey are the value that should match between the main table and the joining table, apiAdress
    is the synapse api adress for the joining table, column is the name of the column containing the value we are
    want to retrieve in the joining table*/
    'JoinTables': {

      'watchadisplayname': {
        'matchingKey': {
          'mainTable': 'User Id',
          'secondaryTable': 'user_id',
        },
        'apiAdress': '_matrix/client/r0/watchadisplayname',
        'column': 'displayname',
      },
    },
    /*each header objects represent the title of a column in the table we display name being the name of te equivalent
    column in the db and type the type of data
    every JoinTables and only JoinTables must be of type list since we could have multiple value for a cell
    Merge is a special type who handle multiple boolean data from db displayed in one single column*/
    'header': {
      'User Id': {
        'name': 'name',
        'type': 'string',
      },
      'Display Name': {
        'name': 'watchadisplayname',
        'type': 'list',
      },
      'Email': {
        'name': 'email',
        'type': 'string',
      },
      'Date of creation': {
        'name': 'creation_ts',
        'type': 'date',
      },
      'Status': {
        'Admin': {
          'name': 'admin',
          'type': 'boolean',
        },
        'Partner':
        {'name': 'is_partner',
          'type': 'boolean',
        },
        'type': 'merge',
        'Default': 'Member',
      },
    },
  },
  'room': {
    'primaryKey': 'Room Id',
    'apiAdress': '_matrix/client/r0/watchaextendroomlist',
    'JoinTables': {
      'watcharoomname': {
        'matchingKey': {
          'mainTable': 'Room Id',
          'secondaryTable': 'room_id',
        },
        'apiAdress': '_matrix/client/r0/watcharoomname',
        'column': 'name',
      },
    },
    'header': {
      'Room Id': {
        'name': 'room_id', 'type': 'string',
      },
      'Name': {
        'name': 'watcharoomname', 'type': 'list',
      },
      'Creator': {
        'name': 'creator', 'type': 'string',
      },
      'Active': {
        'name': 'active', 'type': 'boolean',
      },
      'Type': {
        'name': 'type', 'type': 'string',
      },
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
      filter: {},
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
    this.setState({
      rightPanel: {type: this.props.tableName, data: data},
    });
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

  onRefresh = () =>{
    this.setState({
      arrayOfdata: [],
    });
    this.getData();
  }

  onClose = () =>{
    this.setState({
      rightPanel: false,
    });
  }

  setRightPanel = (panel) =>{
    this.setState({
      rightPanel: panel,
    });
  }

  getData = async () => {
    let userData;
    let JoinTablesData;
    const homeServer = this.props.server;
    const accessToken = this.props.token;
    const JoinTables = this.state.type['JoinTables'];
    const Headers = this.state.type['header'];

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

    for (const user in userData) { //handle the main table by iterating on the users list we get from request;
      if ({}.hasOwnProperty.call(userData, user)) {
        const dataObject={};
        for (const columnHeader in Headers) { // for each header we declare in the tabletype
          if ({}.hasOwnProperty.call(Headers, columnHeader)) {
            if (Headers[columnHeader]['type']==='list') {// in case we want one cell to handle multiple values useful for JoinTables
              dataObject[columnHeader] = [];
            }
            if (Headers[columnHeader]['type']==='merge') {//in case we want one header for multiple boolean tabl columns
              dataObject[columnHeader] = this.mergeRow(Headers[columnHeader], userData[user]);
            }
            for (const property in userData[user]) { // for each fields that belong to a user
              if ({}.hasOwnProperty.call(userData[user], property)) {
                if (property === Headers[columnHeader]['name']) { // we check if the field name match the name excepted by the header
                  dataObject[columnHeader] =
                    this.convertRawData(userData[user][property], Headers[columnHeader]['type']);//we convert the data from the sql table to more revelant type for javascript
                }
              }
            }
          }
        }

        this.state.arrayOfdata.push(dataObject);
      }
    }
    for (const table in JoinTables) {// handle extra tables
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
                if (this.state.arrayOfdata[dataObject][mainKey] === JoinTablesData[data][secondaryKey] ||
                   this.simplifiedUserId(this.state.arrayOfdata[dataObject][mainKey]) ===
                   this.simplifiedUserId(JoinTablesData[data][secondaryKey]) ) {
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
  //function to convert a full user id to a simplified one since synapse use both forms
  simplifiedUserId = (fulluserId) =>{
    let simplifiedUserId = fulluserId.replace('@', '');
    simplifiedUserId = simplifiedUserId.split(':');
    simplifiedUserId = simplifiedUserId[0];
    return simplifiedUserId;
  }
  convertRawData = (rawData, type) => {
    let data;
    let ts;
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
        ts=new Date(rawData*1000);
        data=ts.toLocaleDateString('fr-Fr');
        break;
      default:
        data = rawData;
    }
    return data;
  }

  mergeRow = (columns, data) => {
    let value = columns['Default'];
    for (const columnToMerge in columns ) {
      if (data[columns[columnToMerge]['name']]===1) {
        value=columnToMerge;
      }
    }

    return value;
  }

  isEmailAvailable = (mail) => {
    let emailAvailable = true;
    for (const user in this.state.arrayOfdata) {
      if (this.state.arrayOfdata[user]['Email'] === mail) {
        emailAvailable = false;
      }
    }
    return emailAvailable;
  }

  filterData = (arrayOfdata) => {
    const filteredData = {};
    Object.assign(filteredData, arrayOfdata);
    for (const row in filteredData) {
      if ({}.hasOwnProperty.call(filteredData, row)) {
        let hideRow = false;
        if (this.state.filter['hideOneToOne']) {
          if (filteredData[row]['Type'] === 'discussion') {
            hideRow = true;
          }
        }
        if (this.state.filter['hideInactive']) {
          if (!filteredData[row]['Active']) {
            hideRow = true;
          }
        }
        if (this.state.filter['hideMembers']) {
          if (filteredData[row]['Status'] === 'Member') {
            hideRow = true;
          }
        }
        if (this.state.filter['hidePartners']) {
          if (filteredData[row]['Status'] === 'Partner') {
            hideRow = true;
          }
        }
        if (hideRow) {
          delete filteredData[row];
        }
      }
    }
    for (const row in filteredData) {
      if ({}.hasOwnProperty.call(filteredData, row)) {
        let dismissrow;
        if (this.state.filter['textFilter']) {
          dismissrow = true;
          for (const property in filteredData[row]) {
            if ({}.hasOwnProperty.call(filteredData[row], property)) {
              if (filteredData[row][property]) {
                if (filteredData[row][property].toString().toLowerCase().includes(this.state.filter['textFilter'])) {
                  dismissrow = false;
                }
              }
            }
          }
        }
        if (dismissrow) {
          delete filteredData[row];
        }
      }
    }
    return filteredData;
  }

  handleFilter = (event) => {
    const target = event.target;
    const name = target.name;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const arrayOfFilter = this.state.filter;
    arrayOfFilter[name] = value;
    this.setState({
      filter: arrayOfFilter,
    });
  }

  render() {
    const dataToRow=[];
    const filteredData = this.filterData(this.state.arrayOfdata);

    for (const row in filteredData) {
      if ({}.hasOwnProperty.call( this.state.arrayOfdata, row)) {
        dataToRow.push(
            <Datatorow data={this.state.arrayOfdata[row]} onUserSelected={this.onUserSelected} selected={this.state.selected} primaryKey={this.state.type['primaryKey']} key={row} />,
        );
      }
    }

    let panel;
    if (this.state.rightPanel) {
      panel = <CollapsableRightPanel
        panelType={this.state.rightPanel['type']}
        data={this.state.rightPanel['data']}
        onClose={this.onClose}
        token={this.props.token}
        server={this.props.server}
        isEmailAvailable = {this.isEmailAvailable}
      />;
    }

    return (

      <div className='DataToTable'>
        <TableToolBar refresh={this.onRefresh} setRightPanel={this.setRightPanel} onClose = {this.onClose} handleFilter={this.handleFilter} tab={this.props.tableName} />

        <div className='tableContainer'>
          <Table striped bordered condensed hover responsive className='tableBody'>
            <thead>
              <tr>
                { this.state.header }
              </tr>
            </thead>
            <tbody>
              { dataToRow }
            </tbody>
          </Table>
          { panel }
        </div>

      </div>
    );
  }
}
