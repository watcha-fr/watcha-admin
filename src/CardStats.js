import React, { Component } from 'react';
import {Panel, Glyphicon} from 'react-bootstrap';


export default class CardStats extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }
  getPanelContent = () => {
    const panelContent = [];
    for (const line in this.props.lines) {
      if ({}.hasOwnProperty.call(this.props.lines, line)) {
        panelContent.push(
            <div key={this.props.lines[line].label}>{ this.props.lines[line].label+': '+this.props.lines[line].data }</div>,
        );
      }
    }
    return panelContent;
  }

  render() {
    const panelContent = this.getPanelContent();
    return (
      <Panel bsStyle="primary" className='statsPanel'>
        <Panel.Heading>
          <Panel.Title componentClass="h3">{ this.props.title }</Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          <div className='statsPanelContent'>
            <div>
              { panelContent }
            </div>
            <Glyphicon glyph={this.props.icon} bsStyle='large' />
          </div>
        </Panel.Body>
      </Panel>
    );
  }
}
