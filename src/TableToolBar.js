import React, { Component } from 'react';
import RefreshButton from './Buttons/RefreshButton';
import CreateUserButton from './Buttons/CreateUserButton';
import { withNamespaces } from 'react-i18next';
class TableToolBar extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }
  createUser = () =>{
    const PANEL = {'type': 'createUser'};
    this.props.setRightPanel(PANEL);
  }


  render() {
    const { t } = this.props;
    let filtersOption;
    if (this.props.tab === 'user') {
      filtersOption = <div className='filtersOption'>
        <RefreshButton onClick={this.props.refresh} bsStyle='primary' />
        <CreateUserButton onClick={this.createUser} bsStyle='success' />
        <div className='checkboxfilter'>
          <label>{ t('Hide members') }</label>
          <input type="checkbox" name="hideMembers" onChange = {this.props.handleFilter} />
        </div>
        <div className='checkboxfilter'>
          <label>{ t('Hide partners') }</label>
          <input type="checkbox" name="hidePartners" onChange = {this.props.handleFilter} />
        </div>
        <div className='textFilter'>
          <input type="text" name="textFilter" placeholder={t('Search in this Table')} onChange={this.props.handleFilter} />
        </div>
      </div>;
    }
    if (this.props.tab === 'room') {
      filtersOption =
      <div className='filtersOption'>
        <RefreshButton onClick={this.props.refresh} bsStyle='primary' />
        <div className='checkboxfilter'>
          <label>{ t('Hide Personals conversations') }</label>
          <input type="checkbox" name={t('hideOneToOne')} onChange = {this.props.handleFilter} />
        </div>
        <div className='checkboxfilter'>
          <label>{ t('Hide inactive') }</label>
          <input type="checkbox" name={t('hideInactive')} onChange = {this.props.handleFilter} />
        </div>
        <div className='textFilter'>
          <input type="text" name="textFilter" placeholder={t('Search in this Table')} onChange = {this.props.handleFilter} />
        </div>
      </div>;
    }
    return (
      <div className='TableToolBar'>
        { filtersOption }
      </div>
    );
  }
}

export default withNamespaces('common')(TableToolBar);
