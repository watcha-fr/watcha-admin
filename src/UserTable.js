import React, { Component } from 'react';
import User from './User';
import {Table} from 'react-bootstrap';
import CollapsableRightPanel from './CollapsableRightPanel'



export default class UserTable extends Component {
  static propTypes = {

  };

  constructor(props) {
    super(props);
    this.state = {
      selected:false
    };
  }

  componentDidMount(){
  document.addEventListener("keydown", this.escFunction, false);
}
componentWillUnmount(){
  document.removeEventListener("keydown", this.escFunction, false);
}

  onUserSelected = (data) => {
    this.setState({ selected: data });

  };

  escFunction = (event) => {
    if (event.keyCode === 27){
      this.setState({selected:false})
    }
  }

  render() {
    let dataJoe = {userId:'@joe', creationTs:'12 avril 2018', admin:'true', partner:'false', email:'joe@mailcom'}
    let dataJeanne = {userId:'@jeanne', creationTs:'11 avril 2013', admin:'false', partner:'false', email:'joe@mailcom'}
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
            <User data={dataJoe} onUserSelected={this.onUserSelected} selected={this.state.selected}/>
            <User data={dataJeanne} onUserSelected={this.onUserSelected} selected={this.state.selected}/>
          </tbody>
        </Table>
        <CollapsableRightPanel className='collapsedRightPanel' data={this.state.selected}></CollapsableRightPanel>
      </div>
    );
  }

}
