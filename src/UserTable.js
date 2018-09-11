import React, { Component } from 'react';
import User from './User';
import {Table} from 'react-bootstrap';
import CollapsableRightPanel from './CollapsableRightPanel';


export default class UserTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false,
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

  render() {
    const dataJoe =
    {userId: '@joe', creationTs: '12 avril 2018', admin: 'true', partner: 'false',
      email: 'joe@mail.com', device: 'mozilla', last_connection: '10 octobre 2018'};
    const dataJeanne =
    {userId: '@jeanne', creationTs: '11 avril 2013', admin: 'false', partner: 'true',
      email: 'jeanne@mailcom', device: 'safari, IOS', last_connection: '10 octobre 2018'};
    return (

      <div className='userTable'>
        <Table striped bordered condensed hover responsive>
          <thead>
            <tr>
              <th>User Id</th>
              <th>Creation ts</th>
              <th>Admin</th>
              <th>Partner</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            <User data={dataJoe} onUserSelected={this.onUserSelected} selected={this.state.selected} />
            <User data={dataJeanne} onUserSelected={this.onUserSelected} selected={this.state.selected} />
          </tbody>
        </Table>
        <CollapsableRightPanel className='collapsedRightPanel' data={this.state.selected}></CollapsableRightPanel>
      </div>
    );
  }
}
