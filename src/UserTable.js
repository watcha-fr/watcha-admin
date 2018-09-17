import React, { Component } from 'react';
import Datatorow from './DataToRow';
import {Table} from 'react-bootstrap';
import CollapsableRightPanel from './CollapsableRightPanel';

const tableType = {
  'user': {'primaryKey': 'userId', 'apiAdress': '',
    'header': ['User Id', 'date of creation', 'Admin', 'Partner', 'Email', 'Devices', 'Last connection'] },
  'room': {'primaryKey': 'roomId', 'apiAdress': ''},
  'stats': {},
};

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
    type['header'].forEach(function(column) {
      header.push(<th key={column}> { column } </th>);
    });
    return header;
  }

  getUserData = () => {
    const userData = [{userId: '@joe', creationTs: '12 avril 2018', admin: 'true', partner: 'false',
      email: 'joe@mail.com', device: 'mozilla', last_connection: '10 octobre 2018'},
    {userId: '@jeanne', creationTs: '11 avril 2013', admin: 'false', partner: 'true',
      email: 'jeanne@mailcom', device: 'safari, IOS', last_connection: '10 octobre 2018'}];
    return userData;
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
    const type = tableType[this.props.tableName];
    const header = this.getHeader(type);
    let data=[];
    const row = [];
    data = this.getData();
    const primaryKey = type['primaryKey'];
    console.log(primaryKey);
    const onUserSelected = this.onUserSelected;
    const selected = this.state.selected;

    data.forEach(function(element) {
      console.log(element[primaryKey]+'primaryKey');
      row.push(
          <Datatorow data={element} onUserSelected={onUserSelected} selected={selected} primaryKey={primaryKey} key={element[primaryKey]} />,
      );
    });
    return (

      <div className='userTable'>
        <Table striped bordered condensed hover responsive>
          <thead>
            <tr>
              { header }
            </tr>
          </thead>
          <tbody>
            { row }
          </tbody>
        </Table>
        <CollapsableRightPanel className='collapsedRightPanel' data={this.state.selected} close={this.closeRightPanel}></CollapsableRightPanel>
      </div>
    );
  }
}
