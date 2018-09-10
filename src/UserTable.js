import React, { Component } from 'react';
import User from './User';
import {Table} from 'react-bootstrap';
import CollapsableRightPanel from './CollapsableRightPanel'



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
    let dataJoe = {userId:'@joe', creationTs:'12 avril 2018', admin:'true', partner:'false', email:'joe@mailcom'}
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
            <User user={dataJoe} onUserSelected={this.onUserSelected} selected={this.state.selected}/>
          </tbody>
        </Table>
        <CollapsableRightPanel open={this.state.selected}></CollapsableRightPanel>
      </div>
    );
  }

}
