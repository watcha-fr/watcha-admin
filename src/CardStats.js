import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';


export default class CardStats extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }
  getPanelContent = () => {
    const PANEL_CONTENT = [];
    for (const LINE in this.props.lines) {
      if ({}.hasOwnProperty.call(this.props.lines, LINE)) {
        if (this.props.lines[LINE].label === 'Admin') {
          const ADMINS =[];
          for (const data in this.props.lines[LINE].data) {
            if (this.props.lines[LINE].data.hasOwnProperty(data)) {
              ADMINS.push(
                  <div key={this.props.lines[LINE].data[data]}>
                    <div
                      className='AdminName'
                      onClick={this.onUserClicked}>
                      { this.props.lines[LINE].data[data] }
                    </div>
                  </div>,
              );
            }
          }
          PANEL_CONTENT.push(<div key={this.props.lines[LINE].label}> Admins: { ADMINS } </div>);
        } else {
          PANEL_CONTENT.push(
              <div key={this.props.lines[LINE].label}>{ this.props.lines[LINE].label+': '+this.props.lines[LINE].data }</div>);
        }
      }
    }
    return PANEL_CONTENT;
  }

  onCardClicked = () => {
    if (this.props.title==='Users') {
      this.props.onTabSelected(2, false);
    } else if (this.props.title === 'Rooms') {
      this.props.onTabSelected(3, false);
    }
  }

  onUserClicked = (ev) => {
    this.props.onTabSelected(2, ev.target.textContent);
  }

  render() {
    const PANEL_CONTENT = this.getPanelContent();
    return (
      <Panel bsStyle="primary" className='statsPanel'>
        <Panel.Heading>
          <Panel.Title componentClass="h3" onClick={this.onCardClicked} className='StatsTitle'> { this.props.title } </Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          <div className='statsPanelContent'>
            <div>
              { PANEL_CONTENT }
            </div>
          </div>
        </Panel.Body>
      </Panel>
    );
  }
}
