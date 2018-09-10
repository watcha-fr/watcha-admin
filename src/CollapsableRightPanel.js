import React, { Component } from 'react';
import {Collapse,Well} from 'react-bootstrap';

export default class CollapsableRightPanel extends Component {

  constructor(props) {
    super(props);

    this.state = {
      open: true
    };
  }

  render() {
    let open = this.props.data ? true : false;
    return (
      <div>
        <Collapse in={open}>
         <div>
           <Well>
             {this.props.data['userId']}
           </Well>
         </div>
       </Collapse>
      </div>
    );
  }

}
