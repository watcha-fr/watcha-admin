import React, { Component } from 'react';
import {Tab, Tabs} from 'react-bootstrap';
import DataToTable from './DataToTable';
import StatsTab from './StatsTab';
import { withNamespaces } from 'react-i18next';
import LoadingPage from './LoadingPage'
//import Monitoring from './Monitoring';

class AdminHome extends Component {
    constructor(props) {
        super(props);

        this.state = {
            refresh: true,
            key: 1.,
            loadingRooms: true,
            loadingStats: true,
            loadingUsers: true,
        };
    }

    componentDidMount = () =>{

    }
    onTabSelected = (tabKey, data) =>{
        this.setState({
            key: tabKey,
            data: data,
        });
    }

    onClose = () => {
        this.setState({
            rightPanel: false,
        });
    }

    finishLoadingStats = () =>{
      this.setState({loadingStats:false})
    }
    finishLoadingUsers = () =>{
      this.setState({loadingRooms:false})
    }
    finishLoadingRooms = () =>{
      this.setState({loadingUsers:false})
    }

    handleSelect = (key) => {
        this.setState({ key: key });
    }

    render() {
        let finishLoading=(this.state.loadingRooms&&this.state.loadingUsers&&this.state.loadingStats);
        const KEY= this.state.key? this.state.key : 1;
        const SELECTED= this.state.data? this.state.data : false;
        const {t}=this.props;
        const STATSTAB =
            <StatsTab
                token={this.props.token}
                server={this.props.server}
                onTabSelected={this.onTabSelected}
                loading={!finishLoading}
                finishLoading={this.finishLoadingStats}
            />;

        const USERSTAB =
           <DataToTable tableName='user'
                token={this.props.token}
                server={this.props.server}
                setRightPanel={this.setRightPanel}
                onClose = {this.onClose}
                value = {SELECTED}
                lang={t('lang')}
                loading={!finishLoading}
                finishLoading={this.finishLoadingUsers}
                onTabSelected={this.onTabSelected} />;

         const ROOMSTAB=
          <DataToTable tableName='room'
                token={this.props.token}
                server={this.props.server}
                setRightPanel={this.setRightPanel}
                onClose = {this.onClose}
                stats={this.state.statsData}
                value = {SELECTED}
                lang={t('lang')}
                loading={!finishLoading}
                finishLoading={this.finishLoadingRooms}
                onTabSelected={this.onTabSelected} />;

                console.log(finishLoading);


                if (finishLoading){
                    return (
                      <div>
                      <LoadingPage/>
                      {ROOMSTAB}
                      {USERSTAB}
                      {STATSTAB}
                      </div>
                    )
                }


        return (

            <div className='AdminHomeContainer'>
                <Tabs activeKey={KEY} className='tabsContainer' id='tabs' onSelect={this.handleSelect}>
                    <Tab eventKey={1} title={t('Stats')}>
                        { STATSTAB }
                    </Tab>

                    <Tab eventKey={2} title={t('Users')}>
                       { USERSTAB }
                        </Tab>

                        <Tab eventKey={3} title={t('Rooms')}>
                        { ROOMSTAB }
                          </Tab>
                            {/* not functional yet
                            <Tab eventKey={4} title={t('Monitoring')}
                                token={this.props.token}
                                server={this.props.server} >
                                <Monitoring
                                    token={this.props.token}
                                    server={this.props.server}
                                    onTabSelected={this.onTabSelected} />
                                </Tab>
                                */}
                                <button id='fr' onClick={this.props.onLanguageChange}>fr</button>
                                <button id='en' onClick={this.props.onLanguageChange}>en</button>
                            </Tabs>
                        </div>
        );
    }
}

export default withNamespaces('common')(AdminHome);
