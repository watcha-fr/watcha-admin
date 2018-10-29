import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';


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
        if (this.props.lines[line].label === 'Admin') {
          const admins =[];
          for (const data in this.props.lines[line].data) {
            if (this.props.lines[line].data.hasOwnProperty(data)) {
              admins.push(
                  <div key={this.props.lines[line].data[data]}>
                    <div
                      className='AdminName'
                      onClick={this.onUserClicked}>
                      { this.props.lines[line].data[data] }
                    </div>
                  </div>,
              );
            }
          }
          panelContent.push(<div key={this.props.lines[line].label}> Admins: { admins } </div>);
        } else {
          panelContent.push(
              <div key={this.props.lines[line].label}>{ this.props.lines[line].label+': '+this.props.lines[line].data }</div>);
        }
      }
    }
    return panelContent;
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
    const panelContent = this.getPanelContent();
    return (
      <Panel bsStyle="primary" className='statsPanel'>
        <Panel.Heading>
          <Panel.Title componentClass="h3" onClick={this.onCardClicked} className='StatsTitle'> { this.props.title } </Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          <div className='statsPanelContent'>
            <div>
              { panelContent }
            </div>
          </div>
        </Panel.Body>
      </Panel>
    );
  }
}
