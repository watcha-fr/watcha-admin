import React, { Component } from 'react';
import Datatorow from './DataToRow';
import {Table} from 'react-bootstrap';
import CollapsableRightPanel from './CollapsableRightPanel';

const tableType = {
  'user': {'primaryKey': 'name', 'apiAdress': '_matrix/client/r0/watchauserlist',
    'header': ['User Id', 'date of creation', 'Admin', 'Partner', 'Email', 'Devices'] },
  'room': {'primaryKey': 'roomId', 'apiAdress': ''},
  'stats': {},
};
const dataObject = {};
let type;


const dataToRow = [];

export default class UserTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false,
      rightPanel: false,
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.escFunction, false);
    type = tableType[this.props.tableName];
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

  getHeader = (nameType) => {
    const header = [];
    if (this.state.finished) {
      nameType['header'].forEach(function(column) {
        header.push(<th key={column}> { column } </th>);
      });
    }
    return header;
  }

  getUserData = async () => {
    const self=this;
    let userData;
    const row =[];
    console.log(type['apiAdress']+'type');
    const homeServer = this.props.server;
    const accessToken = this.props.token;
    const primaryKey = type['primaryKey'];
    const onUserSelected = this.onUserSelected;
    const selected = this.state.selected;

    try {
      const userRequest = await fetch(homeServer+ type['apiAdress'], {
        method: 'GET',
        headers: {
          'Authorization': 'bearer '+accessToken,
        },
      });

      userData = JSON.parse(await userRequest.text());
      for (const elements in userData) {
        console.log(userData[elements]);
        dataToRow.push(
            <Datatorow data={userData[elements]} onUserSelected={onUserSelected} selected={selected} primaryKey={primaryKey} key={elements[primaryKey]} />,
        );
        this.setState({finish: true});
      }
    } catch (e) {
      console.log('error: ' + e);
      return;
    }

    return row;
  }
  getData = () => {
    let data;
    switch (this.props.tableName) {
      case 'room':
        data = this.getRoomData;
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
    // /const type = tableType[this.props.tableName];
    const header = this.getHeader(type);
    /*
    data.forEach(function(element) {
      row.push(
          <Datatorow data={element} onUserSelected={onUserSelected} selected={selected} primaryKey={primaryKey} key={element[primaryKey]} />,
      );
    });
*/
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
