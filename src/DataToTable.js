import React, { Component } from 'react';
import Datatorow from './DataToRow';
import {Table} from 'react-bootstrap';
import TableToolBar from './TableToolBar';
import CollapsableRightPanel from './CollapsableRightPanel';
import { withNamespaces } from 'react-i18next';
/*

 */
const TABLE_TYPE = // here we declare all the type of table we wish to display
{
  'user': //the name of the table
  {
    /* the primary key is the primary key corresponding to the sql db equivalent of our table,
     api is the synapse api which the table as json object*/

    'primaryKey': 'User name', 'apiAdress': '_matrix/client/r0/watcha_user_list',

    /*if the table we want to display need data from more than one table we add JoinTables property to our dataObject
    matchingKey are the value that should match between the main table and the joining table, apiAdress
    is the synapse api adress for the joining table, column is the name of the column containing the value we are
    want to retrieve in the joining table*/

    /*each header objects represent the title of a column in the table we display name being the name of te equivalent
    column in the db and type the type of data
    every JoinTables and only JoinTables must be of type list since we could have multiple value for a cell
    Merge is a special type who handle multiple boolean data from db displayed in one single column*/
    'header': {
      'User name': {
        'name': 'name',
        'type': 'string',
        'simplify': true,
      },
      'Last password reset': {
        'name': 'last_password_reset',
        'type': 'shortDate',
      },
      'Last seen': {
        'name': 'last_seen',
        'type': 'shortDate',
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
      'Active': {
        'name': 'is_active',
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


class DataToTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false, //the selected row
      update: false,
      rightPanel: false, // right panel is hidden at start
      arrayOfdata: [], // an array with the data collected from server
      type: TABLE_TYPE[this.props.tableName], // the name of the table
      filter: {}, //filters to apply to the table
    };
  }

  componentDidMount = () => {
    document.addEventListener('keydown', this.escFunction, false); //allow esc to close right panel
    this.setState({header: this.getHeader(this.state.type)}); //initialize header
    this.getData(); //get the data from server
    this.setState({finished: true }); //refresh render
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.value !== prevProps.value) {
      if (this.props.value) {
        this.findDataByPrimaryKey(this.props.value);
      }
    }
    if (this.props.lang !== prevProps.lang) {
	    this.onRefresh();
    }
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

  findDataByPrimaryKey = (value) => {
    for ( const data in this.state.arrayOfdata) {
      if (this.state.arrayOfdata[data][this.state.type['primaryKey']]['data'] === value) {
        this.onUserSelected(this.state.arrayOfdata[data]);
      }
    }
  }

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

refreshRightPanel = async (data) => {
  this.setState({
    update: data,
  });
  this.onRefresh();
}

  getHeader = (type) => {
    const header = [];
    const {t} = this.props;
    for (const elem in type['header']) {
      if ({}.hasOwnProperty.call(type['header'], elem)) {
        header.push(<th key={elem}> { t(elem) } </th>);
      }
    }
    return header;
  }

  onRefresh = () =>{
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
    const arrayData = [];
    const HOME_SERVER = this.props.server;
    const ACCESS_TOKEN = this.props.token;
    const JOIN_TABLES = this.state.type['JOIN_TABLES'];
    const HEADERS = this.state.type['header'];
    try {
      const TABLE_REQUEST = await fetch(HOME_SERVER+ this.state.type['apiAdress'], {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer '+ACCESS_TOKEN,
        },
      });
      jsonData = JSON.parse(await TABLE_REQUEST.text());
    } catch (e) {
      console.log('error: ' + e);
      return;
    }
    for (const row in jsonData) { //handle the main table by iterating on the users list we get from request;
      if ({}.hasOwnProperty.call(jsonData, row)) {
        const dataObject={};
        for (const ColumnHeader in HEADERS) { // for each header we declare in the tabletype
          if ({}.hasOwnProperty.call(HEADERS, ColumnHeader)) {
            if (HEADERS[ColumnHeader]['type']==='list') {// in case we want one cell to handle multiple values useful for JOIN_TABLES
              dataObject[ColumnHeader] = [];
            }
            if (HEADERS[ColumnHeader]['type']==='merge') {//in case we want one header for multiple boolean tabl columns
              dataObject[ColumnHeader] = {
                'data': this.mergeRow(HEADERS[ColumnHeader],
                    jsonData[row]), 'simplifiedData': this.mergeRow(HEADERS[ColumnHeader],
                    jsonData[row]), 'type': 'merge'};
            }
            for (const property in jsonData[row]) { // for each fields that belong to a row
              if ({}.hasOwnProperty.call(jsonData[row], property)) {
                if (property === HEADERS[ColumnHeader]['name']) { // we check if the field name match the name excepted by the header
                  dataObject[ColumnHeader] =
                    {simplifiedData: this.convertRawData(jsonData[row][property],
                        HEADERS[ColumnHeader]['type'],
                        HEADERS[ColumnHeader]['simplify']),
                    data: this.convertRawData(jsonData[row][property],
                        HEADERS[ColumnHeader]['type'], false),
                    type: HEADERS[ColumnHeader]['type']};//we convert the data from the sql table to more revelant type for javascript
                }
              }
            }
          }
        }
        arrayData.push(dataObject);
        this.setState({
          arrayOfdata: arrayData,
        });
      }
    }
    for (const table in JOIN_TABLES) {// handle extra tables
      if ({}.hasOwnProperty.call(JOIN_TABLES, table)) {
        const MAINKEY= JOIN_TABLES[table]['matchingKey'].mainTable;
        const SECONDARYKEY= JOIN_TABLES[table]['matchingKey'].secondaryTable;
        const APIADRESS = JOIN_TABLES[table]['APIADRESS'];
        const COLUMN = JOIN_TABLES[table]['COLUMN'];
        try {
          const TABLE_REQUEST = await fetch(HOME_SERVER+ APIADRESS, {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer '+ACCESS_TOKEN,
            },
          });

          JoinTablesData = JSON.parse(await TABLE_REQUEST.text());
        } catch (e) {
          console.log('error: ' + e);
        }

        for (const dataobject in this.state.arrayOfdata) {
          if ({}.hasOwnProperty.call(this.state.arrayOfdata, dataobject)) {
            for (const data in JoinTablesData ) {
              if ({}.hasOwnProperty.call(JoinTablesData, data)) {
                if (this.state.arrayOfdata[dataobject][MAINKEY]['data'] === JoinTablesData[data][SECONDARYKEY] ||
                   this.simplifiedUserId(this.state.arrayOfdata[dataobject][MAINKEY]['data']) ===
                   this.simplifiedUserId(JoinTablesData[data][SECONDARYKEY]) ) {
                  for (const columnHeader in this.state.type['header']) {
                    if ({}.hasOwnProperty.call(this.state.type['header'], columnHeader)) {
                      if (table === this.state.type['header'][columnHeader]['name']) {
                        this.state.arrayOfdata[dataobject][columnHeader]={
                          'data': JoinTablesData[data][COLUMN],
                          'simplifiedData': this.convertRawData(JoinTablesData[data][COLUMN],
                              HEADERS[columnHeader]['type'],
                              HEADERS[columnHeader]['simplify'])};
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

    if (this.state.update) {
      this.findDataByPrimaryKey(this.state.update);
      this.setState({
        update: false,
      });
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
    const lang = this.props.lang;
    const OPTIONS = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit', second:'2-digit'};
    simplifiedRawData = rawData;
    if (simplify) {
      simplifiedRawData=this.simplifiedUserId(rawData);
    }
    switch (type) {
      case 'string':
        data = simplifiedRawData;
        break;
      case 'boolean':
        data=rawData !==0;
        break;
      case 'date':
        if (rawData) {
          ts=new Date(rawData*1000);
          data=ts.toLocaleDateString(lang, OPTIONS);
        } else {
          data='';
        }
        break;
      case 'shortDate':
        if (rawData) {
          ts=new Date(rawData);
          data=ts.toLocaleDateString(lang, OPTIONS);
        } else {
          data='';
        }
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
          if (filteredData[row]['Status']['data'] === 'Member' || filteredData[row]['Status']['data'] === 'Admin') {
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
    const TARGET = event.target;
    const NAME = TARGET.name;
    const VALUE = TARGET.type === 'checkbox' ? TARGET.checked : TARGET.value;
    const arrayOfFilter = this.state.filter;
    arrayOfFilter[NAME] = VALUE;
    this.setState({
      filter: arrayOfFilter,
    });
  }

  render() {
    const dataToRow=[];
    const FILTERED_DATA = this.filterData(this.state.arrayOfdata);
    for (const row in FILTERED_DATA) {
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
        onTabSelected ={this.props.onTabSelected}
        refreshRightPanel={this.refreshRightPanel}
      />;
    }

    return (

      <div className='DataToTable'>
        <TableToolBar refresh={this.onRefresh}
          setRightPanel={this.setRightPanel}
          onClose = {this.onClose} handleFilter={this.handleFilter}
          tab={this.props.tableName} />

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
export default withNamespaces('common')(DataToTable);
