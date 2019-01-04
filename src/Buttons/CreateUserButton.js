import React, { Component } from 'react';
import {Button} from 'react-bootstrap';
import { withNamespaces } from 'react-i18next';
class CreateUserButton extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    return (
      <Button onClick = {this.props.onClick} bsStyle={this.props.bsStyle}>{ this.props.t('Create user') }</Button>
    );
  }
}
export default withNamespaces('common')(CreateUserButton);
