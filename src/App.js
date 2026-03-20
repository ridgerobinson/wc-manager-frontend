import React from 'react';
import { connect } from 'react-redux';
import { unstable_HistoryRouter as Router, Routes, Route } from 'react-router-dom';
import { CheckLogin } from './Services/Actions';

import history from '../src/history';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { ToastContainer } from 'react-toastify';

import Clubs from './Pages/Clubs';
import Competitions from './Pages/Competitions';
import Events from './Pages/Events';
import Locations from './Pages/Locations';
import MatchDetail from './Pages/MatchDetail';
import Matches from './Pages/Matches';
import Login from './Pages/Login';
import Logout from './Pages/Logout';
import PlayerDetail from './Pages/PlayerDetail';
import Players from './Pages/Players';
import Seasons from './Pages/Seasons';
import Statistics from './Pages/Statistics';
import Teams from './Pages/Teams';

import PageWithDrawer from './Components/PageWithDrawer';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-toastify/dist/ReactToastify.css';

const IGNORE_PATHS = [ '/logout' ];

class App extends React.Component {
    state = {
        CurrentPathname: window.location.pathname
    }

    componentDidMount() {
        if (IGNORE_PATHS.indexOf(window.location.pathname) === -1) {
            this.props.CheckLogin().then(() => {
                // Set Router To Watch Changes
                    this.unlisten = history.listen(({ location }) => {
                        this.onUpdateCurrentLocation(location.pathname);
                    });
            })
        }
    }

    onUpdateCurrentLocation = CurrentPathname => {
        this.setState({ CurrentPathname });
    }

    render() {
        var { IsLoggedIn } = this.props;

        return (
            <>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <ToastContainer 
                        position="bottom-right" 
                        autoClose={3000} 
                        hideProgressBar={false}
                    />

                    <Router history={history}>
                        {
                            !IsLoggedIn ?
                            <Routes>
                                <Route path="/login" exact element={<Login />} />

                                <Route path="/logout" exact element={<Logout />} />
                            </Routes>
                        :
                            
                            <PageWithDrawer CurrentPathname={this.state.CurrentPathname}>
                                <Routes>
                                    <Route path="/clubs" exact element={<Clubs />} />
                                    <Route path="/competitions" exact element={<Competitions />} />
                                    <Route path="/events" exact element={<Events />} />
                                    <Route path="/locations" exact element={<Locations />} />
                                    <Route path="/matches" exact element={<Matches />} />
                                    <Route path="/matches/:MatchId" exact element={<MatchDetail />} />
                                    <Route path="/players/:PlayerId" exact element={<PlayerDetail />} />
                                    <Route path="/players" exact element={<Players />} />
                                    <Route path="/seasons" exact element={<Seasons />} />
                                    <Route path="/statistics" exact element={<Statistics />} />
                                    <Route path="/teams" exact element={<Teams />} />

                                    <Route path="/logout" exact element={<Logout />} />
                                </Routes>
                            </PageWithDrawer>
                        }
                    </Router>
                </LocalizationProvider>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        IsLoggedIn: state.Auth.IsLoggedIn,
        UserDetails: state.Auth.UserDetails,

        TryingLoginUser: state.Auth.TryingLoginUser,
        TryingLoginUserError: state.Auth.TryingLoginUserError
    };
}

export default connect(mapStateToProps, { CheckLogin })(App);