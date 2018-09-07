import React, { Component } from 'react';
import User from './User';
import {Table} from 'react-bootstrap';



export default class UserTable extends Component {

  static propTypes = {

  };

  constructor(props) {
    super(props);
    this.onUserSelected=this.onUserSelected.bind(this)
    this.state = {
      selected:false
    };
  }

  onUserSelected(userId){
    this.setState({ selected: userId });

  }

  render() {
    return (
      <div>
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
            <User userId='@joe' creationTs='12 avril 2018' admin='true' partner='false' email='joe@mailcom' onUserSelected={this.onUserSelected} selected={this.state.selected}/>
      <User userId='@jeanne@mail.com' creationTs='14 avril 2018' admin='false' partner='true' email='jeanne@mailcom' onUserSelected={this.onUserSelected} selected={this.state.selected}/>
          </tbody>
        </Table>

      </div>
    );
  }

}
