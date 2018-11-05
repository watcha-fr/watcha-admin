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
      'Last seen': {
        'name': 'MAX(last_seen)',
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
    for ( const DATA in this.state.arrayOfdata) {
      if (this.state.arrayOfdata[DATA][this.state.type['primaryKey']]['data'] === value) {
        this.onUserSelected(this.state.arrayOfdata[DATA]);
      }
    }
  }

  onTabsSelected = (data) => {
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
    const HEADER = [];
    const {t} = this.props;
    for (const ELEM in type['header']) {
      if ({}.hasOwnProperty.call(type['header'], ELEM)) {
        HEADER.push(<th key={ELEM}> { t(ELEM) } </th>);
      }
    }


    return HEADER;
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
    for (const ROW in jsonData) { //handle the main table by iterating on the users list we get from request;
      if ({}.hasOwnProperty.call(jsonData, ROW)) {
        const DATAOBJECT={};
        for (const COLUMNHEADER in HEADERS) { // for each header we declare in the tabletype
          if ({}.hasOwnProperty.call(HEADERS, COLUMNHEADER)) {
            if (HEADERS[COLUMNHEADER]['type']==='list') {// in case we want one cell to handle multiple values useful for JOIN_TABLES
              DATAOBJECT[COLUMNHEADER] = [];
            }
            if (HEADERS[COLUMNHEADER]['type']==='merge') {//in case we want one header for multiple boolean tabl columns
              DATAOBJECT[COLUMNHEADER] = {
                'data': this.mergeRow(HEADERS[COLUMNHEADER],
                    jsonData[ROW]), 'simplifiedData': this.mergeRow(HEADERS[COLUMNHEADER],
                    jsonData[ROW]), 'type': 'merge'};
            }
            for (const PROPERTY in jsonData[ROW]) { // for each fields that belong to a ROW
              if ({}.hasOwnProperty.call(jsonData[ROW], PROPERTY)) {
                if (PROPERTY === HEADERS[COLUMNHEADER]['name']) { // we check if the field name match the name excepted by the header
                  DATAOBJECT[COLUMNHEADER] =
                    {simplifiedData: this.convertRawData(jsonData[ROW][PROPERTY],
                        HEADERS[COLUMNHEADER]['type'],
                        HEADERS[COLUMNHEADER]['simplify']),
                    data: this.convertRawData(jsonData[ROW][PROPERTY],
                        HEADERS[COLUMNHEADER]['type'], false),
                    type: HEADERS[COLUMNHEADER]['type']};//we convert the data from the sql table to more revelant type for javascript
                }
              }
            }
          }
        }

        this.state.arrayOfdata.push(DATAOBJECT);
      }
    }
    for (const TABLE in JOIN_TABLES) {// handle extra tables
      if ({}.hasOwnProperty.call(JOIN_TABLES, TABLE)) {
        const MAINKEY= JOIN_TABLES[TABLE]['matchingKey'].mainTable;
        const SECONDARYKEY= JOIN_TABLES[TABLE]['matchingKey'].secondaryTable;
        const APIADRESS = JOIN_TABLES[TABLE]['APIADRESS'];
        const COLUMN = JOIN_TABLES[TABLE]['COLUMN'];
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

        for (const DATAOBJECT in this.state.arrayOfdata) {
          if ({}.hasOwnProperty.call(this.state.arrayOfdata, DATAOBJECT)) {
            for (const DATA in JoinTablesData ) {
              if ({}.hasOwnProperty.call(JoinTablesData, DATA)) {
                if (this.state.arrayOfdata[DATAOBJECT][MAINKEY]['data'] === JoinTablesData[DATA][SECONDARYKEY] ||
                   this.simplifiedUserId(this.state.arrayOfdata[DATAOBJECT][MAINKEY]['data']) ===
                   this.simplifiedUserId(JoinTablesData[DATA][SECONDARYKEY]) ) {
                  for (const COLUMN_HEADER in this.state.type['header']) {
                    if ({}.hasOwnProperty.call(this.state.type['header'], COLUMN_HEADER)) {
                      if (TABLE === this.state.type['header'][COLUMN_HEADER]['name']) {
                        this.state.arrayOfdata[DATAOBJECT][COLUMN_HEADER]={
                          'data': JoinTablesData[DATA][COLUMN],
                          'simplifiedData': this.convertRawData(JoinTablesData[DATA][COLUMN],
                              HEADERS[COLUMN_HEADER]['type'],
                              HEADERS[COLUMN_HEADER]['simplify'])};
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
    const OPTIONS = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
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
        if (rawData) {
          ts=new Date(rawData*1000);
          data=ts.toLocaleDateString('en-En', OPTIONS);
        } else {
          data='';
        }
        break;
      case 'shortDate':
        if (rawData) {
          ts=new Date(rawData);
          data=ts.toLocaleDateString('en-En', OPTIONS);
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
    for (const COLUMN_TO_MERGE in columns ) {
      if (data[columns[COLUMN_TO_MERGE]['name']]===1) {
        value=COLUMN_TO_MERGE;
      }
    }

    return value;
  }

  isEmailAvailable = (mail) => {
    let emailAvailable = true;
    for (const USER in this.state.arrayOfdata) {
      if (this.state.arrayOfdata[USER]['Email']['data'] === mail) {
        emailAvailable = false;
      }
    }
    return emailAvailable;
  }

  filterData = (arrayOfdata) => {
    const FILTERED_DATA = {};
    Object.assign(FILTERED_DATA, arrayOfdata);
    for (const row in FILTERED_DATA) {
      if ({}.hasOwnProperty.call(FILTERED_DATA, row)) {
        let hideRow = false;
        if (this.state.filter['hideOneToOne']) {
          if (FILTERED_DATA[row]['Type']['data'] === 'One to one') {
            hideRow = true;
          }
        }
        if (this.state.filter['hideInactive']) {
          if (!FILTERED_DATA[row]['Active']['data']) {
            hideRow = true;
          }
        }
        if (this.state.filter['hideMembers']) {
          if (FILTERED_DATA[row]['Status']['data'] === 'Member' || FILTERED_DATA[row]['Status']['data'] === 'Admin') {
            hideRow = true;
          }
        }
        if (this.state.filter['hidePartners']) {
          if (FILTERED_DATA[row]['Status']['data'] === 'Partner') {
            hideRow = true;
          }
        }
        if (hideRow) {
          delete FILTERED_DATA[row];
        }
      }
    }
    for (const ROW in FILTERED_DATA) {
      if ({}.hasOwnProperty.call(FILTERED_DATA, ROW)) {
        let dismissrow;
        if (this.state.filter['textFilter']) {
          dismissrow = true;
          for (const property in FILTERED_DATA[ROW]) {
            if ({}.hasOwnProperty.call(FILTERED_DATA[ROW], property)) {
              const data = FILTERED_DATA[ROW][property]['data'];
              if (FILTERED_DATA[ROW][property] && data) {
                if (data.toString().toLowerCase().includes(this.state.filter['textFilter'].toLowerCase())) {
                  dismissrow = false;
                }
              }
            }
          }
        }
        if (dismissrow) {
          delete FILTERED_DATA[ROW];
        }
      }
    }
    return FILTERED_DATA;
  }

  handleFilter = (event) => {
    const TARGET = event.target;
    const NAME = TARGET.name;
    const VALUE = TARGET.type === 'checkbox' ? TARGET.checked : TARGET.value;
    const ARRAY_OF_FILTERS = this.state.filter;
    ARRAY_OF_FILTERS[NAME] = VALUE;
    this.setState({
      filter: ARRAY_OF_FILTERS,
    });
  }

  render() {
    const DATA_TO_ROW=[];
    const FILTERED_DATA = this.filterData(this.state.arrayOfdata);
    for (const ROW in FILTERED_DATA) {
      if ({}.hasOwnProperty.call( this.state.arrayOfdata, ROW)) {
        DATA_TO_ROW.push(
            <Datatorow
              data={this.state.arrayOfdata[ROW]}
              onUserSelected={this.onUserSelected}
              selected={this.state.selected}
              primaryKey={this.state.type['primaryKey']} key={ROW} />,
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
              { DATA_TO_ROW }
            </tbody>
          </Table>
          { panel }
        </div>

      </div>
    );
  }
}
export default withNamespaces('common')(DataToTable);
