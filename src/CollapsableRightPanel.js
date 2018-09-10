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
        <Collapse in={open} dimension='width' timeout={0}>
         <div>
           <div className='panel'>
             {this.props.data['userId']}
           </div>
         </div>
       </Collapse>
      </div>
    );
  }

}
