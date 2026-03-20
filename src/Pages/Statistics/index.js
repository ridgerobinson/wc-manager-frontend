import React from 'react';
import { connect } from 'react-redux';
import { GetCompetitions, GetEvents, GetOverallStats, GetSeasons, GetTeams } from '../../Services/Actions';

import { DataGrid } from '@mui/x-data-grid';

import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

const overallStatsColumns = [
    { field: 'gamesplayed', headerName: 'GP', flex: 1 },
    { field: 'wins', headerName: 'W', flex: 1 },
    { field: 'ties', headerName: 'T', flex: 1 },
    { field: 'losses', headerName: 'L', flex: 1 },
    { field: 'winningpercentage', headerName: '%', flex: 1 },
    { field: 'goalsfor', headerName: 'GF', flex: 1 },
    { field: 'goalsagainst', headerName: 'GA', flex: 1 },
    { field: 'goaldifference', headerName: 'GD', flex: 1 },
    { field: 'goalsforpg', headerName: 'GF PG', flex: 1 },
    { field: 'goalsagainstpg', headerName: 'GA PG', flex: 1 },
    { field: 'goaldifferencepg', headerName: 'GD PG', flex: 1 }
];

const playerStatsColumns = [
    {
        field: 'Rank',
        headerName: '#',
        width: 70,
        valueGetter: (params) => `${params.api.getRowIndex(params.id) + 1}`, // Row number
    },
    { field: 'playername', headerName: 'Player', flex: 2 },
    { field: 'gamesplayed', headerName: 'Games', flex: 1 },
    { field: 'goals', headerName: 'Goals', flex: 1 },
    { field: 'assists', headerName: 'Assists', flex: 1 },
    { field: 'goalcontributions', headerName: 'GC', flex: 1 },
    { field: 'goalcontributionspg', headerName: 'GC PG', flex: 1 },
    { field: 'moms', headerName: 'MOM', flex: 1 },
    { field: 'captains', headerName: 'Capt', flex: 1 }
];

const FILTERS_INIT = { Competitions: [], Events: [], HideFriendlies: true, Seasons: [], Teams: [], TeamsOpponents: [], StartDate: null, EndDate: null };

class Players extends React.Component {
    state = {
        OverallStats: [],
        PlayerStats: [],

        AutocompleteData_Competitions: {
            Competitions: [],
            IsOpen: false,
            Loading: false
        },
        AutocompleteData_Events: {
            Events: [],
            IsOpen: false,
            Loading: false
        },
        AutocompleteData_Seasons: {
            Seasons: [],
            IsOpen: false,
            Loading: false
        },
        AutocompleteData_MyTeams: {
            Teams: [],
            IsOpen: false,
            Loading: false
        },
        AutocompleteData_TeamsOpponents: {
            Teams: [],
            IsOpen: false,
            Loading: false
        },

        Filters: { ...FILTERS_INIT }
    }
    
    componentDidMount() {
        this.onLoadStatistics();
    }

    onChangeCompetitions = Competitions => {
        var Filters = { ...this.state.Filters };
        Filters.Competitions = [ ...Competitions.sort((a, b) => {
            if (a.competitionname < b.competitionname) return -1;
            if (a.competitionname > b.competitionname) return 1;
            return 0;
        }) ];

        this.setState({ Filters }, () => this.onLoadStatistics());
    }

    onChangeDatePicker = ({ event, FilterName }) => {
        var Filters = { ...this.state.Filters };
        Filters[FilterName] = event.target.value;

        this.setState({ Filters }, () => {
            if (this.state.Filters.StartDate && this.state.Filters.EndDate) this.onLoadStatistics();
        });
    }

    onChangeEvents = Events => {
        var Filters = { ...this.state.Filters };
        Filters.Events = [ ...Events.sort((a, b) => {
            if (a.eventname < b.eventname) return -1;
            if (a.eventname > b.eventname) return 1;
            return 0;
        }) ];

        this.setState({ Filters }, () => this.onLoadStatistics());
    }

    onChangeHideFriendlies = event => {
        var Filters = { ...this.state.Filters };
        Filters.HideFriendlies = event.target.checked;

        this.setState({ Filters }, () => this.onLoadStatistics());
    }

    onChangeSeasons = Seasons => {
        var Filters = { ...this.state.Filters };
        Filters.Seasons = [ ...Seasons.sort((a, b) => {
            if (a.seasonname < b.seasonname) return -1;
            if (a.seasonname > b.seasonname) return 1;
            return 0;
        }) ];

        this.setState({ Filters }, () => this.onLoadStatistics());
    }

    onChangeMyTeams = Teams => {
        var Filters = { ...this.state.Filters };
        Filters.Teams = [ ...Teams.sort((a, b) => {
            if (a.teamname < b.teamname) return -1;
            if (a.teamname > b.teamname) return 1;
            return 0;
        }) ];

        this.setState({ Filters }, () => this.onLoadStatistics());
    }

    onChangeTeamsOpponents = TeamsOpponents => {
        var Filters = { ...this.state.Filters };
        Filters.TeamsOpponents = [ ...TeamsOpponents.sort((a, b) => {
            if (a.teamname < b.teamname) return -1;
            if (a.teamname > b.teamname) return 1;
            return 0;
        }) ];

        this.setState({ Filters }, () => this.onLoadStatistics());
    }

    onLoadStatistics = () => {
        var { Competitions, EndDate, Events, HideFriendlies, Seasons, StartDate, Teams, TeamsOpponents } = this.state.Filters;

        var CompetitionIds = Competitions.map(({ competitionid }) => competitionid);
        var EventIds = Events.map(({ eventid }) => eventid);
        var OpponentIds = TeamsOpponents.map(({ teamid }) => teamid);
        var SeasonIds = Seasons.map(({ seasonid }) => seasonid);
        var TeamIds = Teams.map(({ teamid }) => teamid);

        this.props.GetOverallStats({ CompetitionIds, EndDate, EventIds, HideFriendlies, OpponentIds, SeasonIds, StartDate, TeamIds }).then(({ OverallStats, PlayerStats }) => {
            this.setState({ OverallStats, PlayerStats });
        });
    }

    onResetDatePicker = () => {
        var Filters = { ...this.state.Filters };
        Filters.StartDate = '';
        Filters.EndDate = '';

        this.setState({ Filters }, () => this.onLoadStatistics());
    }

    onToggleShowAutocompleteList_Competitions = ShowAutocompleteList_Competitions => {
        var AutocompleteData_Competitions = { ...this.state.AutocompleteData_Competitions };

        var Competitions = AutocompleteData_Competitions.Competitions;
        AutocompleteData_Competitions.IsOpen = ShowAutocompleteList_Competitions;
        this.setState({ AutocompleteData_Competitions }, () => {
            if (!Competitions.length) {
                this.props.GetCompetitions({ GetAll: true }).then(({ Competitions }) => {
                    AutocompleteData_Competitions.Competitions = [ ...Competitions ];

                    this.setState({ AutocompleteData_Competitions });
                });
            }
        });    
    }

    onToggleShowAutocompleteList_Events = ShowAutocompleteList_Events => {
        var AutocompleteData_Events = { ...this.state.AutocompleteData_Events };

        var Events = AutocompleteData_Events.Events;
        AutocompleteData_Events.IsOpen = ShowAutocompleteList_Events;
        this.setState({ AutocompleteData_Events }, () => {
            if (!Events.length) {
                this.props.GetEvents({ GetAll: true }).then(({ Events }) => {
                    AutocompleteData_Events.Events = [ ...Events ];

                    this.setState({ AutocompleteData_Events });
                });
            }
        });    
    }

    onToggleShowAutocompleteList_Seasons = ShowAutocompleteList_Seasons => {
        var AutocompleteData_Seasons = { ...this.state.AutocompleteData_Seasons };

        var Seasons = AutocompleteData_Seasons.Seasons;
        AutocompleteData_Seasons.IsOpen = ShowAutocompleteList_Seasons;
        this.setState({ AutocompleteData_Seasons }, () => {
            if (!Seasons.length) {
                this.props.GetSeasons({ GetAll: true }).then(({ Seasons }) => {
                    AutocompleteData_Seasons.Seasons = [ ...Seasons ];

                    this.setState({ AutocompleteData_Seasons });
                });
            }
        });    
    }

    onToggleShowAutocompleteList_MyTeams = ShowAutocompleteList_MyTeams => {
        var AutocompleteData_MyTeams = { ...this.state.AutocompleteData_MyTeams };

        var Teams = AutocompleteData_MyTeams.Teams;
        AutocompleteData_MyTeams.IsOpen = ShowAutocompleteList_MyTeams;
        this.setState({ AutocompleteData_MyTeams }, () => {
            if (!Teams.length) {
                this.props.GetTeams({ GetAll: true, MyClub: 1 }).then(({ Teams }) => {
                    AutocompleteData_MyTeams.Teams = [ ...Teams ];

                    this.setState({ AutocompleteData_MyTeams });
                });
            }
        });    
    }

    onToggleShowAutocompleteList_TeamsOpponents = ShowAutocompleteList_Teams => {
        var AutocompleteData_TeamsOpponents = { ...this.state.AutocompleteData_TeamsOpponents };

        var Teams = AutocompleteData_TeamsOpponents.Teams;
        AutocompleteData_TeamsOpponents.IsOpen = ShowAutocompleteList_Teams;
        this.setState({ AutocompleteData_TeamsOpponents }, () => {
            if (!Teams.length) {
                this.props.GetTeams({ GetAll: true }).then(({ Teams }) => {
                    AutocompleteData_TeamsOpponents.Teams = [ ...Teams ];

                    this.setState({ AutocompleteData_TeamsOpponents });
                });
            }
        });    
    }

    renderAutocompleteList_Competitions = () => {
        var { Competitions, IsOpen, Loading } = this.state.AutocompleteData_Competitions;

        return (
            <Autocomplete
                multiple
                sx={{ width: '100%' }}
                open={IsOpen}
                onOpen={() => this.onToggleShowAutocompleteList_Competitions(true)}
                onClose={() => this.onToggleShowAutocompleteList_Competitions(false)}
                isOptionEqualToValue={(option, value) => option.competitionid === value.competitionid}
                getOptionLabel={option => option.competitionname}
                options={Competitions}
                loading={Loading}
                value={this.state.Filters.Competitions}
                disableCloseOnSelect
                onChange={(event, newValue) => this.onChangeCompetitions(newValue)}
                renderInput={params => (
                    <TextField
                        {...params}
                        label="Competitions"
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <React.Fragment>
                                    {Loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </React.Fragment>
                            ),
                        }}
                    />
                )}
            />
        );
    }

    renderAutocompleteList_Events = () => {
        var { Events, IsOpen, Loading } = this.state.AutocompleteData_Events;

        return (
            <Autocomplete
                multiple
                sx={{ width: '100%' }}
                open={IsOpen}
                onOpen={() => this.onToggleShowAutocompleteList_Events(true)}
                onClose={() => this.onToggleShowAutocompleteList_Events(false)}
                isOptionEqualToValue={(option, value) => option.eventid === value.eventid}
                getOptionLabel={option => option.eventname}
                options={Events}
                loading={Loading}
                value={this.state.Filters.Events}
                disableCloseOnSelect
                onChange={(event, newValue) => this.onChangeEvents(newValue)}
                renderInput={params => (
                    <TextField
                        {...params}
                        label="Events"
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <React.Fragment>
                                    {Loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </React.Fragment>
                            ),
                        }}
                    />
                )}
            />
        );
    }

    renderAutocompleteList_Seasons = () => {
        var { Seasons, IsOpen, Loading } = this.state.AutocompleteData_Seasons;

        return (
            <Autocomplete
                multiple
                sx={{ width: '100%' }}
                open={IsOpen}
                onOpen={() => this.onToggleShowAutocompleteList_Seasons(true)}
                onClose={() => this.onToggleShowAutocompleteList_Seasons(false)}
                isOptionEqualToValue={(option, value) => option.seasonid === value.seasonid}
                getOptionLabel={option => option.seasonname}
                options={Seasons}
                loading={Loading}
                value={this.state.Filters.Seasons}
                disableCloseOnSelect
                onChange={(event, newValue) => this.onChangeSeasons(newValue)}
                renderInput={params => (
                    <TextField
                        {...params}
                        label="Seasons"
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <React.Fragment>
                                    {Loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </React.Fragment>
                            ),
                        }}
                    />
                )}
            />
        );
    }

    renderAutocompleteList_MyTeams = () => {
        var { Teams, IsOpen, Loading } = this.state.AutocompleteData_MyTeams;

        return (
            <Autocomplete
                multiple
                sx={{ width: '100%' }}
                open={IsOpen}
                onOpen={() => this.onToggleShowAutocompleteList_MyTeams(true)}
                onClose={() => this.onToggleShowAutocompleteList_MyTeams(false)}
                isOptionEqualToValue={(option, value) => option.teamid === value.teamid}
                getOptionLabel={option => option.teamname}
                options={Teams}
                loading={Loading}
                value={this.state.Filters.Teams}
                disableCloseOnSelect
                onChange={(event, newValue) => this.onChangeMyTeams(newValue)}
                renderInput={params => (
                    <TextField
                        {...params}
                        label="Teams"
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <React.Fragment>
                                    {Loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </React.Fragment>
                            ),
                        }}
                    />
                )}
            />
        );
    }

    renderAutocompleteList_TeamsOpponents = () => {
        var { Teams, IsOpen, Loading } = this.state.AutocompleteData_TeamsOpponents;

        return (
            <Autocomplete
                multiple
                sx={{ width: '100%' }}
                open={IsOpen}
                onOpen={() => this.onToggleShowAutocompleteList_TeamsOpponents(true)}
                onClose={() => this.onToggleShowAutocompleteList_TeamsOpponents(false)}
                isOptionEqualToValue={(option, value) => option.teamid === value.teamid}
                getOptionLabel={option => option.teamname}
                options={Teams}
                loading={Loading}
                value={this.state.Filters.TeamsOpponents}
                disableCloseOnSelect
                onChange={(event, newValue) => this.onChangeTeamsOpponents(newValue)}
                renderInput={params => (
                    <TextField
                        {...params}
                        label="Opponents"
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <React.Fragment>
                                    {Loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </React.Fragment>
                            ),
                        }}
                    />
                )}
            />
        );
    }

    renderStatisticsTable = () => {
        var { Filters, OverallStats, PlayerStats } = this.state;

        return (
            <>
                <Typography variant="h6" gutterBottom>
                    Filters
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Paper elevation={3} style={{ padding: 16 }}>
                            {this.renderAutocompleteList_Competitions()}
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Paper elevation={3} style={{ padding: 16 }}>
                            {this.renderAutocompleteList_Events()}
                        </Paper>
                    </Grid>
                </Grid>

                <Box sx={{ height: 20 }} />

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Paper elevation={3} style={{ padding: 16 }}>
                            {this.renderAutocompleteList_Seasons()}
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Paper elevation={3} style={{ padding: 16 }}>
                            {this.renderAutocompleteList_TeamsOpponents()}
                        </Paper>
                    </Grid>
                </Grid>

                <Box sx={{ height: 20 }} />

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Paper elevation={3} style={{ padding: 16 }}>
                            {this.renderAutocompleteList_MyTeams()}
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {/* <Paper elevation={3} style={{ padding: 16 }}>
                            {this.renderAutocompleteList_TeamsOpponents()}
                        </Paper> */}
                        <Paper elevation={3} style={{ padding: 16 }}>
                            <input type="date" value={Filters.StartDate} onChange={event => this.onChangeDatePicker({ event, FilterName: 'StartDate' })} />
                            <input type="date" value={Filters.EndDate} onChange={event => this.onChangeDatePicker({ event, FilterName: 'EndDate' })} />
                            <Typography onClick={this.onResetDatePicker}>Reset date?</Typography>
                        </Paper>
                    </Grid>
                </Grid>

                <Box sx={{ height: 20 }} />

                <FormControl component="fieldset" variant="standard">
                    <FormLabel component="legend">Hide friendlies?</FormLabel>
                    <FormGroup>
                        <FormControlLabel
                            control={<Switch checked={Filters.HideFriendlies} onChange={this.onChangeHideFriendlies} name="hide_friendlies" />}
                            label="ON"
                        />
                    </FormGroup>
                </FormControl>

                <Box sx={{ height: 60 }} />

                <Typography variant="h5" gutterBottom>
                    Overall Team Stats
                </Typography>

                <Box sx={{ height: 20 }} />

                <DataGrid
                    autoHeight
                    rows={OverallStats}
                    columns={overallStatsColumns}
                    getRowId={row => row.id}
                    loading={this.props.TryingGetData}
                    hideFooterPagination
                />

                <Box sx={{ height: 60 }} />

                <Typography variant="h5" gutterBottom>
                    Player Stats ({`${PlayerStats.length}`})
                </Typography>

                <Box sx={{ height: 20 }} />

                <DataGrid
                    autoHeight
                    rows={PlayerStats}
                    columns={playerStatsColumns}
                    getRowId={row => row.playerid}
                    loading={this.props.TryingGetData}
                    hideFooterPagination
                    onRowClick={({ row }) => window.open(`/players/${row.playerid}`, '_blank').focus()}
                />
            </>
        );
    }

    render() {
        return (
            <>
                {this.renderStatisticsTable()}
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        TryingGetData: state.Regular.TryingGetData,
        TryingGetDataError: state.Regular.TryingGetDataError
    }
}

export default connect(mapStateToProps, { GetCompetitions, GetEvents, GetOverallStats, GetSeasons, GetTeams })(Players);