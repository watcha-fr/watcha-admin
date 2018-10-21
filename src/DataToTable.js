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

    'primaryKey': 'User Id', 'apiAdress': '_matrix/client/r0/watcha_user_list',

    /*if the table we want to display need data from more than one table we add JoinTables property to our dataObject
    matchingKey are the value that should match between the main table and the joining table, apiAdress
    is the synapse api adress for the joining table, column is the name of the column containing the value we are
    want to retrieve in the joining table*/

    /*each header objects represent the title of a column in the table we display name being the name of te equivalent
    column in the db and type the type of data
    every JoinTables and only JoinTables must be of type list since we could have multiple value for a cell
    Merge is a special type who handle multiple boolean data from db displayed in one single column*/
    'header': {
      'User Id': {
        'name': 'name',
        'type': 'string',
        'simplify': true,
      },
      'Display Name': {
        'name': 'displayname',
        'type': 'string',
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
      'Deactivated': {
        'name': 'is_deactivated',
        'type': 'boolean',
      },
    },
  },
  'room': {
    'primaryKey': 'Room Id',
    'apiAdress': '_matrix/client/r0/watcha_extend_room_list',
    'header': {
      'Room Id': {
        'name': 'room_id',
        'type': 'string',
        'simplify': true,
      },
      'Name': {
        'name': 'name', 'type': 'list',
      },
      'Creator': {
        'name': 'creator',
        'type': 'string',
        'simplify': true,
      },
      'Active': {
        'name': 'active',
        'type': 'boolean',
      },
      'Type': {
        'name': 'type',
        'type': 'string',
      },
      'Users': {
        'name': 'members',
        'type': 'enumerate',
      },
    },
  },
  'stats': {},
};


export default class DataToTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false, //the selected row
      rightPanel: false, // right panel is hidden at start
      arrayOfdata: [], // an array with the data collected from server
      type: tableType[this.props.tableName], // the name of the table
      filter: {}, //filters to apply to the table
    };
  }

  componentDidMount = () => {
    document.addEventListener('keydown', this.escFunction, false); //allow esc to close right panel
    this.setState({header: this.getHeader(this.state.type)}); //initialize header
    this.getData(); //get the data from server
    this.setState({finished: true }); //refresh render
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
      this.onClose();
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
    let jsonData;
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

      jsonData = JSON.parse(await userRequest.text());
    } catch (e) {
      console.log('error: ' + e);
      return;
    }

    for (const row in jsonData) { //handle the main table by iterating on the users list we get from request;
      if ({}.hasOwnProperty.call(jsonData, row)) {
        const dataObject={};
        for (const columnHeader in Headers) { // for each header we declare in the tabletype
          if ({}.hasOwnProperty.call(Headers, columnHeader)) {
            if (Headers[columnHeader]['type']==='list') {// in case we want one cell to handle multiple values useful for JoinTables
              dataObject[columnHeader] = [];
            }
            if (Headers[columnHeader]['type']==='merge') {//in case we want one header for multiple boolean tabl columns
              dataObject[columnHeader] = {
                'data': this.mergeRow(Headers[columnHeader],
                    jsonData[row]), 'simplifiedData': this.mergeRow(Headers[columnHeader],
                    jsonData[row]), 'type': 'merge'};
            }
            for (const property in jsonData[row]) { // for each fields that belong to a row
              if ({}.hasOwnProperty.call(jsonData[row], property)) {
                if (property === Headers[columnHeader]['name']) { // we check if the field name match the name excepted by the header
                  dataObject[columnHeader] =
                    {simplifiedData: this.convertRawData(jsonData[row][property],
                        Headers[columnHeader]['type'],
                        Headers[columnHeader]['simplify']),
                    data: this.convertRawData(jsonData[row][property],
                        Headers[columnHeader]['type'], false),
                    type: Headers[columnHeader]['type']};//we convert the data from the sql table to more revelant type for javascript
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
                if (this.state.arrayOfdata[dataObject][mainKey]['data'] === JoinTablesData[data][secondaryKey] ||
                   this.simplifiedUserId(this.state.arrayOfdata[dataObject][mainKey]['data']) ===
                   this.simplifiedUserId(JoinTablesData[data][secondaryKey]) ) {
                  for (const columnHeader in this.state.type['header']) {
                    if ({}.hasOwnProperty.call(this.state.type['header'], columnHeader)) {
                      if (table === this.state.type['header'][columnHeader]['name']) {
                        this.state.arrayOfdata[dataObject][columnHeader]={
                          'data': JoinTablesData[data][column],
                          'simplifiedData': this.convertRawData(JoinTablesData[data][column],
                              Headers[columnHeader]['type'],
                              Headers[columnHeader]['simplify'])};
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
  convertRawData = (rawData, type, simplify) => {
    let simplifiedRawData;
    let data;
    let ts;
    simplifiedRawData = rawData;
    if (simplify) {
      simplifiedRawData=this.simplifiedUserId(rawData);
    }
    switch (type) {
      case 'string':
        data = simplifiedRawData;
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
      case 'enumerate':
        data=rawData;
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
      if (this.state.arrayOfdata[user]['Email']['data'] === mail) {
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
          if (filteredData[row]['Type']['data'] === 'One to one') {
            hideRow = true;
          }
        }
        if (this.state.filter['hideInactive']) {
          if (!filteredData[row]['Active']['data']) {
            hideRow = true;
          }
        }
        if (this.state.filter['hideMembers']) {
          if (filteredData[row]['Status']['data'] === 'Member') {
            hideRow = true;
          }
        }
        if (this.state.filter['hidePartners']) {
          if (filteredData[row]['Status']['data'] === 'Partner') {
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
              const data = filteredData[row][property]['data'];
              if (filteredData[row][property] && data) {
                if (data.toString().toLowerCase().includes(this.state.filter['textFilter'].toLowerCase())) {
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
            <Datatorow
              data={this.state.arrayOfdata[row]}
              onUserSelected={this.onUserSelected}
              selected={this.state.selected}
              primaryKey={this.state.type['primaryKey']} key={row} />,
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
        refresh ={this.onRefresh}
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
