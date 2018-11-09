import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';
import { withNamespaces } from 'react-i18next';

class CardStats extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }
  getPanelContent = () => {
    const { t } = this.props;
    const panelContent = [];
    for (const LINE in this.props.lines) {
      if ({}.hasOwnProperty.call(this.props.lines, LINE)) {
        if (this.props.lines[LINE].label === t('Admin')) {
          const admins =[];
          for (const data in this.props.lines[LINE].data) {
            if (this.props.lines[LINE].data.hasOwnProperty(data)) {
              admins.push(
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
          panelContent.push(<div key={this.props.lines[LINE].label}> { t('Admins') }: { admins } </div>);
        } else {
          panelContent.push(
              <div key={this.props.lines[LINE].label}>{ this.props.lines[LINE].label+': '+this.props.lines[LINE].data }</div>);
        }
      }
    }
    return panelContent;
  }

  onCardClicked = () => {
    const { t } = this.props;
    if (this.props.title===t('Users')) {
      this.props.onTabSelected(2, false);
    } else if (this.props.title === t('Rooms')) {
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

export default withNamespaces('common')(CardStats);
