import React, { Component } from 'react';

import { Alert } from 'react-bootstrap';
class Monitoring extends Component {
  constructor(props) {
    super(props);


    this.state = {
    };
  }
    componentDidMount = () => {
      this.getLogs();
      this.getServerState();
    }
    getServerState = async () => {
      let serverReport;
      const HOME_SERVER = this.props.server;
      const ACCESS_TOKEN = this.props.token;

      try {
        const SERVER_REPORT_REQUET = await fetch(HOME_SERVER+ '_matrix/client/r0/watcha_server_state', {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer '+ACCESS_TOKEN,
          },
        });

        serverReport = JSON.parse(await SERVER_REPORT_REQUET.text());
      } catch (e) {
        console.log('error: ' + e);
        return;
      }
      this.setState({
        serverReport: serverReport,
      });
    }
      getLogs = async () => {
        let logData;
        const HOME_SERVER = this.props.server;
        const ACCESS_TOKEN = this.props.token;

        try {
          const LOG_REQUEST = await fetch(HOME_SERVER+ '_matrix/client/r0/watcha_log', {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer '+ACCESS_TOKEN,
            },
          });

          logData = JSON.parse(await LOG_REQUEST.text());
        } catch (e) {
          console.log('error: ' + e);
          return;
        }
        this.setState({
          log: logData,
        });
        this.displayLogs();
      }

      displayLogs = () =>{
        const list = [];
        const LOG = this.state.log;
        let i;
        for ( i=0; i<10000; i++) {
          if (LOG[i]['type'] === ' INFO ') {
            list.push(<Alert bsStyle='info' key={i}>{ LOG[i]['date'] + ' '+ LOG[i]['type'] +' '+ LOG[i]['text'] }</Alert>);
          } else if (LOG[i]['type'] === ' ERROR ') {
            console.log('error');
            list.push(<Alert bsStyle='danger' key={i}>{ LOG[i]['date'] + ' '+ LOG[i]['text'] }</Alert>);
          } else if (LOG[i]['type'] === ' WARNING ') {
            list.push(<Alert bsStyle='warning' key={i}>{ LOG[i]['date'] + ' '+ LOG[i]['text'] } </Alert>);
          }
        }
        this.setState({
          list: list,
        });
      }

      render() {
        let log;
        if (this.state.list) {
          log =this.state.list;
        }
        return (
          <div>
            { log }
          </div>
        );
      }
}

export default Monitoring;
