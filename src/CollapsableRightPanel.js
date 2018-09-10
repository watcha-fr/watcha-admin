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
    return (
      <div>
        <Collapse in={this.props.open}>
         <div>
           <Well>
             Anim pariatur cliche reprehenderit, enim eiusmod high life
             accusamus terry richardson ad squid. Nihil anim keffiyeh
             helvetica, craft beer labore wes anderson cred nesciunt sapiente
             ea proident.
           </Well>
         </div>
       </Collapse>
      </div>
    );
  }

}
