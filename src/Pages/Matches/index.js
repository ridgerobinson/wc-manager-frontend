import React from 'react';
import { connect } from 'react-redux';
import history from '../../history';
import { DeleteMatch, GetCompetitions, GetEvents, GetLocations, GetMatches, GetMatchStatuses, GetMatchTypes, GetSeasons, GetTeams, InsertEditMatch } from '../../Services/Actions';

import Calendar from '../../Components/Calendar';

import { DataGrid } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';

import AddIcon from '@mui/icons-material/LibraryAdd';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ListIcon from '@mui/icons-material/List';

dayjs.extend(utc);
dayjs.extend(timezone);

const TIMEZONE = 'America/New_York';

const pastMatchesColumns = [
    // { field: 'matchid', headerName: 'Id', width: 70 },
    { field: 'eventname', headerName: 'Event', flex: 3 },
    { field: 'matchdate', headerName: 'Match Date', flex: 2,
        valueFormatter: params => {
            // Check if value is valid to avoid errors
            if (!params.value) return '';
            return dayjs(params.value).tz(TIMEZONE).format('ddd MMM D, YYYY h:mm A');
        }
    },
    { field: 'opponentname', headerName: 'Opponent', flex: 1 },
    // { field: 'homeawayname', headerName: 'Home/Away', flex: 1 },
    { field: 'locationname', headerName: 'Location', flex: 1 },
    // { field: 'matchstatusname', headerName: 'Match Status', flex: 1 },
    // { field: 'matchtypename', headerName: 'Match Type', flex: 1 },
    { field: 'score', headerName: 'Score', flex: 1 },
    { field: 'matchresult', headerName: 'Result', flex: 1 },
    { field: 'hasroster', headerName: 'Roster'
        // valueFormatter: params => {
        //     if (!params.value) return 0;
        // }
    },
    { field: 'hasstats', headerName: 'Stats' }
];

const futureMatchesColumns = [
    { field: 'eventname', headerName: 'Event', flex: 3 },
    { field: 'matchdate', headerName: 'Match Date', flex: 1,
        valueFormatter: params => {
            // Check if value is valid to avoid errors
            if (!params.value) return '';
            return dayjs(params.value).tz(TIMEZONE).format('ddd MMM D, YYYY h:mm A');
        }
    },
    { field: 'opponentname', headerName: 'Opponent', flex: 1 },
    { field: 'locationname', headerName: 'Location', flex: 1 }
];

const postponedMatchesColumns = [
    { field: 'eventname', headerName: 'Event', flex: 3 },
    { field: 'matchdate', headerName: 'Original Date', flex: 2,
        valueFormatter: params => {
            // Check if value is valid to avoid errors
            if (!params.value) return '';
            return dayjs(params.value).tz(TIMEZONE).format('ddd MMM D, YYYY h:mm A');
        }
    },
    { field: 'opponentname', headerName: 'Opponent', flex: 1 },
    { field: 'locationname', headerName: 'Location', flex: 1 }
];

const ShowEditPopup_Data_Init = { matchid: 0, eventid: 0, eventname: '', matchdate: dayjs(), opponentid: 0, opponentname: '', homeawayid: 0, homeawayname: '', locationid: 0, locationname: '', matchtypeid: 0, matchtypename: '', matchstatusid: 0, matchstatusname: '', teamscore: '', opponentscore: '', trackstarts: 0, delete_warning: false, last_added_match_id: 0 };
const FILTERS_INIT = { Competitions: [], EndDate: dayjs().endOf('month').endOf('week').tz(TIMEZONE).format('YYYY-MM-DD'), Events: [], Seasons: [], StartDate: dayjs().startOf('month').startOf('week').tz(TIMEZONE).format('YYYY-MM-DD'), TeamsOpponents: [], Teams: [] };

class Matches extends React.Component {
    state = {
        CalendarType: localStorage.getItem('Matches_CalendarType') || 'Calendar',
        CalendarMatches: {
            Matches: [],
            TotalRecords: 0
        },
        FutureMatches: {
            Matches: [],
            IsMoreResults: null,
            PageNo: 0,
            PageSize: 10,
            TotalRecords: 0
        },
        PastMatches: {
            Matches: [],
            IsMoreResults: null,
            PageNo: 0,
            PageSize: 10,
            TotalRecords: 0
        },
        PostponedMatches: {
            Matches: [],
            IsMoreResults: null,
            PageNo: 0,
            PageSize: 10,
            TotalRecords: 0
        },

        ShowEditPopup: false,
        ShowEditPopup_Data: {},

        
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
        AutocompleteData_Filters_Events: {
            IsOpen: false
        },
        AutocompleteData_HomeAway: {
            HomeAway: [{ homeawayid: 1, homeawayname: 'Home' }, { homeawayid: 2, homeawayname: 'Away' }, { homeawayid: 3, homeawayname: 'Neutral' }],
            IsOpen: false,
            Loading: false
        },
        AutocompleteData_Locations: {
            Locations: [],
            IsOpen: false,
            Loading: false
        },
        AutocompleteData_MatchStatuses: {
            MatchStatuses: [],
            IsOpen: false,
            Loading: false
        },
        AutocompleteData_MatchTypes: {
            MatchTypes: [],
            IsOpen: false,
            Loading: false
        },
        AutocompleteData_MyTeams: {
            Teams: [],
            IsOpen: false,
            Loading: false
        },
        AutocompleteData_Opponents: {
            Opponents: [],
            IsOpen: false,
            Loading: false
        },
        AutocompleteData_Seasons: {
            Seasons: [],
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
        this.onLoadAllMatches({});
    }

    onChangeDates_Calendar = ({ end, start }) => {
        var Filters = { ...this.state.Filters };
        Filters.StartDate = start;
        Filters.EndDate = end;

        this.setState({ Filters }, () => {
            this.onLoadCalendarMatches()
        })
    }

    onChangeEvent = newValue => {
        var ShowEditPopup_Data = { ...this.state.ShowEditPopup_Data };

        ShowEditPopup_Data.eventid = !!newValue ? newValue.eventid : 0;
        ShowEditPopup_Data.eventname = !!newValue ? newValue.eventname : '';

        this.setState({ ShowEditPopup_Data });
    }

    onChangeFilters_Competitions = Competitions => {
        var Filters = { ...this.state.Filters };
        Filters.Competitions = [ ...Competitions.sort((a, b) => {
            if (a.competitionname < b.competitionname) return -1;
            if (a.competitionname > b.competitionname) return 1;
            return 0;
        }) ];

        this.setState({ Filters }, () => this.onLoadAllMatches());
    }

    onChangeFilters_Events = Events => {
        var Filters = { ...this.state.Filters };
        Filters.Events = [ ...Events.sort((a, b) => {
            if (a.eventname < b.eventname) return -1;
            if (a.eventname > b.eventname) return 1;
            return 0;
        }) ];

        this.setState({ Filters }, () => this.onLoadAllMatches());
    }

    onChangeFilters_MyTeams = Teams => {
        var Filters = { ...this.state.Filters };
        Filters.Teams = [ ...Teams.sort((a, b) => {
            if (a.teamname < b.teamname) return -1;
            if (a.teamname > b.teamname) return 1;
            return 0;
        }) ];

        this.setState({ Filters }, () => this.onLoadAllMatches());
    }

    onChangeFilters_Seasons = Seasons => {
        var Filters = { ...this.state.Filters };
        Filters.Seasons = [ ...Seasons.sort((a, b) => {
            if (a.seasonname < b.seasonname) return -1;
            if (a.seasonname > b.seasonname) return 1;
            return 0;
        }) ];

        this.setState({ Filters }, () => this.onLoadAllMatches());
    }

    onChangeFilters_TeamsOpponents = TeamsOpponents => {
        var Filters = { ...this.state.Filters };
        Filters.TeamsOpponents = [ ...TeamsOpponents.sort((a, b) => {
            if (a.teamname < b.teamname) return -1;
            if (a.teamname > b.teamname) return 1;
            return 0;
        }) ];

        this.setState({ Filters }, () => this.onLoadAllMatches());
    }

    onChangeHomeAway = newValue => {
        var ShowEditPopup_Data = { ...this.state.ShowEditPopup_Data };

        ShowEditPopup_Data.homeawayid = !!newValue ? newValue.homeawayid : 0;
        ShowEditPopup_Data.homeawayname = !!newValue ? newValue.homeawayname : '';

        this.setState({ ShowEditPopup_Data });
    }

    onChangeLocation = newValue => {
        var ShowEditPopup_Data = { ...this.state.ShowEditPopup_Data };

        ShowEditPopup_Data.locationid = !!newValue ? newValue.locationid : 0;
        ShowEditPopup_Data.locationname = !!newValue ? newValue.locationname : '';

        this.setState({ ShowEditPopup_Data });
    }

    onChangeMatchDate = newDateTime => {
        var ShowEditPopup_Data = { ...this.state.ShowEditPopup_Data };
        ShowEditPopup_Data.matchdate = newDateTime;
        this.setState({ ShowEditPopup_Data });
    }

    onChangeMatchStatus = newValue => {
        var ShowEditPopup_Data = { ...this.state.ShowEditPopup_Data };

        ShowEditPopup_Data.matchstatusid = !!newValue ? newValue.matchstatusid : 0;
        ShowEditPopup_Data.matchstatusname = !!newValue ? newValue.matchstatusname : '';

        this.setState({ ShowEditPopup_Data });
    }

    onChangeMatchType = newValue => {
        var ShowEditPopup_Data = { ...this.state.ShowEditPopup_Data };

        ShowEditPopup_Data.matchtypeid = !!newValue ? newValue.matchtypeid : 0;
        ShowEditPopup_Data.matchtypename = !!newValue ? newValue.matchtypename : '';

        this.setState({ ShowEditPopup_Data });
    }

    onChangeOpponent = newValue => {
        var ShowEditPopup_Data = { ...this.state.ShowEditPopup_Data };

        ShowEditPopup_Data.opponentid = !!newValue ? newValue.teamid : 0;
        ShowEditPopup_Data.opponentname = !!newValue ? newValue.teamname : '';

        this.setState({ ShowEditPopup_Data });
    }

    onChangeOpponentScore = event => {
        var ShowEditPopup_Data = { ...this.state.ShowEditPopup_Data };
        ShowEditPopup_Data.opponentscore = event.target.value;
        this.setState({ ShowEditPopup_Data });
    }

    onChangeTeamScore = event => {
        var ShowEditPopup_Data = { ...this.state.ShowEditPopup_Data };
        ShowEditPopup_Data.teamscore = event.target.value;
        this.setState({ ShowEditPopup_Data });
    }

    onChangeTrackStarts = event => {
        var ShowEditPopup_Data = { ...this.state.ShowEditPopup_Data };
        ShowEditPopup_Data.trackstarts = +event.target.checked;
        this.setState({ ShowEditPopup_Data });
    }

    onDeleteMatch = () => {
        this.props.DeleteMatch({ MatchId: this.state.ShowEditPopup_Data.matchid }).then(() => {
            this.onToggleShowEditPopup({});
            this.onLoadAllMatches({});
        });
    }

    onDeleteMatch_ShowWarning = () => {
        var ShowEditPopup_Data = { ...this.state.ShowEditPopup_Data };
        ShowEditPopup_Data.delete_warning = true;
        this.setState({ ShowEditPopup_Data });
    }

    onInsertEditMatch = event => {
        event.preventDefault();

        var { matchid: MatchId, eventid: EventId, matchdate: MatchDate, locationid: LocationId, opponentid: OpponentId, homeawayname: HomeAway, matchtypeid: MatchTypeId, matchstatusid: MatchStatusId, teamscore: TeamScore, opponentscore: OpponentScore, trackstarts: TrackStarts } = this.state.ShowEditPopup_Data;

        this.props.InsertEditMatch({ EventId, HomeAway, MatchDate, MatchId, MatchStatusId, MatchTypeId, LocationId, OpponentId, OpponentScore, TeamScore, TrackStarts }).then(({ Match }) => {
            if (this.state.CalendarType === 'Calendar') this.onToggleShowEditPopup({});
            else this.onResetMatch({ last_added_match_id: Match.id });

            this.onLoadAllMatches({});
        });
    }

    onLoadAllMatches = () => {
        if (this.state.CalendarType === 'Calendar') this.onLoadCalendarMatches();
        else {
            this.onLoadFutureMatches({});
            this.onLoadPastMatches({});
            this.onLoadPostponedMatches({});
        }
    }

    onLoadCalendarMatches = () => {
        var { Competitions, EndDate, Events, Seasons, StartDate, Teams } = this.state.Filters;

        var CompetitionIds = Competitions.map(({ competitionid }) => competitionid);
        var EventIds = Events.map(({ eventid }) => eventid);
        var SeasonIds = Seasons.map(({ seasonid }) => seasonid);
        var TeamIds = Teams.map(({ teamid }) => teamid);

        this.props.GetMatches({ CompetitionIds, EndDate, EventIds, GetAll: 1, SeasonIds, StartDate, TeamIds }).then(({ Matches, TotalRecords }) => {
            Matches = Matches.map(({ matchdate, matchend, ...rest }) => ({ ...rest, matchdate: new Date(matchdate), matchend: new Date(matchend) }));

            var CalendarMatches = { ...this.state.CalendarMatches, Matches, TotalRecords };
            this.setState({ CalendarMatches });
        });
    }

    onLoadFutureMatches = ({ page: PageNo, pageSize: PageSize }) => {
        PageNo = PageNo !== undefined ? PageNo : this.state.FutureMatches.PageNo;
        PageSize = PageSize !== undefined ? PageSize : this.state.FutureMatches.PageSize;

        var FutureMatches = { ...this.state.FutureMatches, PageNo, PageSize };

        // if (Increment) PageNo++;

        this.setState({ FutureMatches }, () => {
            var { Competitions, Events, Seasons, Teams, TeamsOpponents } = this.state.Filters;

            var CompetitionIds = Competitions.map(({ competitionid }) => competitionid);
            var EventIds = Events.map(({ eventid }) => eventid);
            var SeasonIds = Seasons.map(({ seasonid }) => seasonid);
            var TeamIds = Teams.map(({ teamid }) => teamid);
            var OpponentIds = TeamsOpponents.map(({ teamid }) => teamid);

            PageNo++;

            this.props.GetMatches({ CompetitionIds, DateRange: 'Future', EventIds, SeasonIds, OpponentIds, PageNo, PageSize, TeamIds }).then(({ Matches, IsMoreResults, TotalRecords }) => {
                FutureMatches = { ...this.state.FutureMatches, Matches, IsMoreResults, TotalRecords };
                this.setState({ FutureMatches });
            });
        });
    }
    
    onLoadPastMatches = ({ page: PageNo, pageSize: PageSize }) => {
        PageNo = PageNo !== undefined ? PageNo : this.state.PastMatches.PageNo;
        PageSize = PageSize !== undefined ? PageSize : this.state.PastMatches.PageSize;

        var PastMatches = { ...this.state.PastMatches, PageNo, PageSize };

        // if (Increment) PageNo++;

        this.setState({ PastMatches }, () => {
            var { Competitions, Events, Seasons, Teams, TeamsOpponents } = this.state.Filters;

            var CompetitionIds = Competitions.map(({ competitionid }) => competitionid);
            var EventIds = Events.map(({ eventid }) => eventid);
            var SeasonIds = Seasons.map(({ seasonid }) => seasonid);
            var TeamIds = Teams.map(({ teamid }) => teamid);
            var OpponentIds = TeamsOpponents.map(({ teamid }) => teamid);

            PageNo++;

            this.props.GetMatches({ CompetitionIds, DateRange: 'Past', EventIds, SeasonIds, OpponentIds, PageNo, PageSize, TeamIds }).then(({ Matches, IsMoreResults, TotalRecords }) => {
                PastMatches = { ...this.state.PastMatches, Matches, IsMoreResults, TotalRecords };
                this.setState({ PastMatches });
            });
        });
    }
    
    onLoadPostponedMatches = ({ page: PageNo, pageSize: PageSize }) => {
        PageNo = PageNo !== undefined ? PageNo : this.state.PostponedMatches.PageNo;
        PageSize = PageSize !== undefined ? PageSize : this.state.PostponedMatches.PageSize;

        var PostponedMatches = { ...this.state.PostponedMatches, PageNo, PageSize };

        // if (Increment) PageNo++;

        this.setState({ PostponedMatches }, () => {
            var { Competitions, Events, Seasons, Teams, TeamsOpponents } = this.state.Filters;

            var CompetitionIds = Competitions.map(({ competitionid }) => competitionid);
            var EventIds = Events.map(({ eventid }) => eventid);
            var SeasonIds = Seasons.map(({ seasonid }) => seasonid);
            var TeamIds = Teams.map(({ teamid }) => teamid);
            var OpponentIds = TeamsOpponents.map(({ teamid }) => teamid);

            PageNo++;

            this.props.GetMatches({ CompetitionIds, DateRange: 'Postponed', EventIds, SeasonIds, OpponentIds, PageNo, PageSize, TeamIds }).then(({ Matches, IsMoreResults, TotalRecords }) => {
                PostponedMatches = { ...this.state.PostponedMatches, Matches, IsMoreResults, TotalRecords };
                this.setState({ PostponedMatches });
            });
        });
    }

    onResetMatch = ({ last_added_match_id = 0 }) => {
        // var ShowEditPopup_Data = { ...ShowEditPopup_Data_Init, last_added_match_id };
        var ShowEditPopup_Data = { ...this.state.ShowEditPopup_Data, last_added_match_id };

        this.setState({ ShowEditPopup_Data });
    }

    onToggleMatchTypeSelection = (event, CalendarType) => {
        if (CalendarType !== null) this.setState({ CalendarType }, () => {
            localStorage.setItem('Matches_CalendarType', CalendarType);
            this.onLoadAllMatches();
        });
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

    onToggleShowAutocompleteList_Filters_Events = ShowAutocompleteList_Events => {
        var AutocompleteData_Events = { ...this.state.AutocompleteData_Events };
        var AutocompleteData_Filters_Events = { ...this.state.AutocompleteData_Filters_Events };

        var Events = AutocompleteData_Events.Events;
        AutocompleteData_Filters_Events.IsOpen = ShowAutocompleteList_Events;
        this.setState({ AutocompleteData_Filters_Events }, () => {
            if (!Events.length) {
                this.props.GetEvents({ GetAll: true }).then(({ Events }) => {
                    AutocompleteData_Events.Events = [ ...Events ];

                    this.setState({ AutocompleteData_Events });
                });
            }
        });    
    }

    onToggleShowAutocompleteList_HomeAway = ShowAutocompleteList_HomeAway => {
        var AutocompleteData_HomeAway = { ...this.state.AutocompleteData_HomeAway };
        AutocompleteData_HomeAway.IsOpen = ShowAutocompleteList_HomeAway;
        this.setState({ AutocompleteData_HomeAway });    
    }

    onToggleShowAutocompleteList_Locations = ShowAutocompleteList_Locations => {
        var AutocompleteData_Locations = { ...this.state.AutocompleteData_Locations };

        var Locations = AutocompleteData_Locations.Locations;
        AutocompleteData_Locations.IsOpen = ShowAutocompleteList_Locations;
        this.setState({ AutocompleteData_Locations }, () => {
            if (!Locations.length) {
                this.props.GetLocations({ GetAll: true }).then(({ Locations }) => {
                    AutocompleteData_Locations.Locations = [ ...Locations ];

                    this.setState({ AutocompleteData_Locations });
                });
            }
        });    
    }

    onToggleShowAutocompleteList_MatchStatuses = ShowAutocompleteList_MatchStatuses => {
        var AutocompleteData_MatchStatuses = { ...this.state.AutocompleteData_MatchStatuses };

        var MatchStatuses = AutocompleteData_MatchStatuses.MatchStatuses;
        AutocompleteData_MatchStatuses.IsOpen = ShowAutocompleteList_MatchStatuses;
        this.setState({ AutocompleteData_MatchStatuses }, () => {
            if (!MatchStatuses.length) {
                this.props.GetMatchStatuses({ GetAll: true }).then(({ MatchStatuses }) => {
                    AutocompleteData_MatchStatuses.MatchStatuses = [ ...MatchStatuses ];

                    this.setState({ AutocompleteData_MatchStatuses });
                });
            }
        });    
    }

    onToggleShowAutocompleteList_MatchTypes = ShowAutocompleteList_MatchTypes => {
        var AutocompleteData_MatchTypes = { ...this.state.AutocompleteData_MatchTypes };

        var MatchTypes = AutocompleteData_MatchTypes.MatchTypes;
        AutocompleteData_MatchTypes.IsOpen = ShowAutocompleteList_MatchTypes;
        this.setState({ AutocompleteData_MatchTypes }, () => {
            if (!MatchTypes.length) {
                this.props.GetMatchTypes({ GetAll: true }).then(({ MatchTypes }) => {
                    AutocompleteData_MatchTypes.MatchTypes = [ ...MatchTypes ];

                    this.setState({ AutocompleteData_MatchTypes });
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

    onToggleShowAutocompleteList_Opponents = ShowAutocompleteList_Opponents => {
        var AutocompleteData_Opponents = { ...this.state.AutocompleteData_Opponents };

        var Opponents = AutocompleteData_Opponents.Opponents;
        AutocompleteData_Opponents.IsOpen = ShowAutocompleteList_Opponents;
        this.setState({ AutocompleteData_Opponents }, () => {
            if (!Opponents.length) {
                this.props.GetTeams({ GetAll: true }).then(({ Teams }) => {
                    AutocompleteData_Opponents.Opponents = [ ...Teams ];

                    this.setState({ AutocompleteData_Opponents });
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

    onToggleShowEditPopup = ({ FromCalendar = null, ShowEditPopup = false, ShowEditPopup_Data = {} }) => {
        if (!!ShowEditPopup) {
            if (FromCalendar) {
                var { start } = ShowEditPopup_Data;
                var matchdate = dayjs(start).set('hour', 12).set('minute', 0).set('second', 0);
                ShowEditPopup_Data = { ...ShowEditPopup_Data_Init, matchdate };
            }
            else ShowEditPopup_Data = { ...ShowEditPopup_Data_Init, ...ShowEditPopup_Data };
        }

        this.setState({ ShowEditPopup, ShowEditPopup_Data });
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
                onChange={(event, newValue) => this.onChangeFilters_Competitions(newValue)}
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
        var { eventid, eventname } = this.state.ShowEditPopup_Data;
        var { Events, IsOpen, Loading } = this.state.AutocompleteData_Events;

        var value = { eventid, eventname };

        return (
            <Autocomplete
                sx={{ width: 300 }}
                open={IsOpen}
                onOpen={() => this.onToggleShowAutocompleteList_Events(true)}
                onClose={() => this.onToggleShowAutocompleteList_Events(false)}
                isOptionEqualToValue={(option, value) => option.eventid === value.eventid}
                getOptionLabel={option => option.eventname}
                options={Events}
                loading={Loading}
                value={value}
                onChange={(event, newValue) => this.onChangeEvent(newValue)}
                renderInput={params => (
                    <TextField
                        {...params}
                        label="Event"
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

    renderAutocompleteList_Filters_Events = () => {
        var { IsOpen } = this.state.AutocompleteData_Filters_Events;
        var { Events, Loading } = this.state.AutocompleteData_Events;

        return (
            <Autocomplete
                multiple
                sx={{ width: '100%' }}
                open={IsOpen}
                onOpen={() => this.onToggleShowAutocompleteList_Filters_Events(true)}
                onClose={() => this.onToggleShowAutocompleteList_Filters_Events(false)}
                isOptionEqualToValue={(option, value) => option.eventid === value.eventid}
                getOptionLabel={option => option.eventname}
                options={Events}
                loading={Loading}
                value={this.state.Filters.Events}
                disableCloseOnSelect
                onChange={(event, newValue) => this.onChangeFilters_Events(newValue)}
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

    renderAutocompleteList_HomeAway = () => {
        var { homeawayid, homeawayname } = this.state.ShowEditPopup_Data;
        var { HomeAway, IsOpen, Loading } = this.state.AutocompleteData_HomeAway;

        var value = { homeawayid, homeawayname };

        return (
            <Autocomplete
                sx={{ width: 300 }}
                open={IsOpen}
                onOpen={() => this.onToggleShowAutocompleteList_HomeAway(true)}
                onClose={() => this.onToggleShowAutocompleteList_HomeAway(false)}
                isOptionEqualToValue={(option, value) => option.homeawayid === value.homeawayid}
                getOptionLabel={option => option.homeawayname}
                options={HomeAway}
                loading={Loading}
                value={value}
                onChange={(event, newValue) => this.onChangeHomeAway(newValue)}
                renderInput={params => (
                    <TextField
                        {...params}
                        label="Home / Away"
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

    renderAutocompleteList_Locations = () => {
        var { locationid, locationname } = this.state.ShowEditPopup_Data;
        var { Locations, IsOpen, Loading } = this.state.AutocompleteData_Locations;

        var value = { locationid, locationname };

        return (
            <Autocomplete
                sx={{ width: 300 }}
                open={IsOpen}
                onOpen={() => this.onToggleShowAutocompleteList_Locations(true)}
                onClose={() => this.onToggleShowAutocompleteList_Locations(false)}
                isOptionEqualToValue={(option, value) => option.locationid === value.locationid}
                getOptionLabel={option => option.locationname}
                options={Locations}
                loading={Loading}
                value={value}
                onChange={(event, newValue) => this.onChangeLocation(newValue)}
                renderInput={params => (
                    <TextField
                        {...params}
                        label="Location"
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

    renderAutocompleteList_MatchStatuses = () => {
        var { matchstatusid, matchstatusname } = this.state.ShowEditPopup_Data;
        var { MatchStatuses, IsOpen, Loading } = this.state.AutocompleteData_MatchStatuses;

        var value = { matchstatusid, matchstatusname };

        return (
            <Autocomplete
                sx={{ width: 300 }}
                open={IsOpen}
                onOpen={() => this.onToggleShowAutocompleteList_MatchStatuses(true)}
                onClose={() => this.onToggleShowAutocompleteList_MatchStatuses(false)}
                isOptionEqualToValue={(option, value) => option.matchstatusid === value.matchstatusid}
                getOptionLabel={option => option.matchstatusname}
                options={MatchStatuses}
                loading={Loading}
                value={value}
                onChange={(event, newValue) => this.onChangeMatchStatus(newValue)}
                renderInput={params => (
                    <TextField
                        {...params}
                        label="Match status"
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

    renderAutocompleteList_MatchTypes = () => {
        var { matchtypeid, matchtypename } = this.state.ShowEditPopup_Data;
        var { MatchTypes, IsOpen, Loading } = this.state.AutocompleteData_MatchTypes;

        var value = { matchtypeid, matchtypename };

        return (
            <Autocomplete
                sx={{ width: 300 }}
                open={IsOpen}
                onOpen={() => this.onToggleShowAutocompleteList_MatchTypes(true)}
                onClose={() => this.onToggleShowAutocompleteList_MatchTypes(false)}
                isOptionEqualToValue={(option, value) => option.matchtypeid === value.matchtypeid}
                getOptionLabel={option => option.matchtypename}
                options={MatchTypes}
                loading={Loading}
                value={value}
                onChange={(event, newValue) => this.onChangeMatchType(newValue)}
                renderInput={params => (
                    <TextField
                        {...params}
                        label="Match type"
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
                onChange={(event, newValue) => this.onChangeFilters_MyTeams(newValue)}
                renderInput={params => (
                    <TextField
                        {...params}
                        label="My Teams"
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

    renderAutocompleteList_Opponents = () => {
        var { opponentid: teamid, opponentname: teamname } = this.state.ShowEditPopup_Data;
        var { Opponents, IsOpen, Loading } = this.state.AutocompleteData_Opponents;

        var value = { teamid, teamname };

        return (
            <Autocomplete
                sx={{ width: 300 }}
                open={IsOpen}
                onOpen={() => this.onToggleShowAutocompleteList_Opponents(true)}
                onClose={() => this.onToggleShowAutocompleteList_Opponents(false)}
                isOptionEqualToValue={(option, value) => option.teamid === value.teamid}
                getOptionLabel={option => option.teamname}
                options={Opponents}
                loading={Loading}
                value={value}
                onChange={(event, newValue) => this.onChangeOpponent(newValue)}
                renderInput={params => (
                    <TextField
                        {...params}
                        label="Opponent"
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
                onChange={(event, newValue) => this.onChangeFilters_Seasons(newValue)}
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
                onChange={(event, newValue) => this.onChangeFilters_TeamsOpponents(newValue)}
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

    renderEditPopup = () => {
        var { ShowEditPopup, ShowEditPopup_Data } = this.state;

        if (!ShowEditPopup) return null;

        if (!!ShowEditPopup_Data.delete_warning) {
            return (
                <React.Fragment>
                    <Dialog
                        maxWidth="md"
                        fullWidth={true}
                        open={ShowEditPopup}
                        onClose={this.onToggleShowEditPopup}
                    >
                        <DialogTitle>Delete match</DialogTitle>
    
                        <DialogContent>
                            <DialogContentText>Are you sure you want to delete the match? You will not be able to undo this</DialogContentText>
                        </DialogContent>
    
                        <DialogActions>
                            <Button onClick={this.onToggleShowEditPopup}>Cancel</Button>
                            <Button variant="outlined" color="error" type="delete" onClick={this.onDeleteMatch}>Delete</Button>
                        </DialogActions>
                    </Dialog>
                </React.Fragment>
            );
        }

        var IsEditing = !!+ShowEditPopup_Data.matchid;

        var Disabled = false; // !ShowEditPopup_Data.eventid || !ShowEditPopup_Data.locationid || !ShowEditPopup_Data.opponentid;

        return (
            <React.Fragment>
                <Dialog
                    maxWidth="md"
                    fullWidth={true}
                    open={ShowEditPopup}
                    onClose={this.onToggleShowEditPopup}
                    PaperProps={{
                        component: 'form',
                        onSubmit: this.onInsertEditMatch
                    }}
                >
                    <DialogTitle>{IsEditing ? 'Edit' : 'Insert'} Match</DialogTitle>

                    {
                        !!IsEditing &&
                        <Link
                            component="button"
                            variant="body2"
                            onClick={() => history.push(`/matches/${ShowEditPopup_Data.matchid}`)}
                        >
                            View match details
                        </Link>
                    }

                    {
                        !!IsEditing &&
                        <Link
                            component="button"
                            variant="body2"
                            onClick={() => window.open(`/matches/${ShowEditPopup_Data.matchid}`, '_blank').focus()}
                        >
                            View match details in new tab
                        </Link>
                    }

                    {
                        !IsEditing && !!ShowEditPopup_Data.last_added_match_id &&
                        <Link
                            component="button"
                            variant="body2"
                            onClick={() => history.push(`/matches/${ShowEditPopup_Data.last_added_match_id}`)}
                            >
                            View last added match details
                        </Link>
                    }

                    {
                        !IsEditing && !!ShowEditPopup_Data.last_added_match_id &&
                        <Link
                            component="button"
                            variant="body2"
                            onClick={() => window.open(`/matches/${ShowEditPopup_Data.last_added_match_id}`, '_blank').focus()}
                        >
                            View last added match details in new tab
                        </Link>
                    }

                    <DialogContent>
                        <DialogContentText>{IsEditing ? 'Edit' : 'Insert'} the match details here</DialogContentText>

                        <Box sx={{ height: 20 }} />

                        {this.renderAutocompleteList_Events()}

                        <Box sx={{ height: 20 }} />

                        <DateTimePicker
                            label="Match date"
                            timezone="America/New_York"
                            value={dayjs(ShowEditPopup_Data.matchdate)}
                            onChange={this.onChangeMatchDate}
                        />

                        <Box sx={{ height: 20 }} />

                        {this.renderAutocompleteList_Opponents()}

                        <Box sx={{ height: 20 }} />

                        {this.renderAutocompleteList_HomeAway()}

                        <Box sx={{ height: 20 }} />

                        {this.renderAutocompleteList_Locations()}

                        <Box sx={{ height: 20 }} />

                        {this.renderAutocompleteList_MatchStatuses()}

                        <Box sx={{ height: 20 }} />

                        {this.renderAutocompleteList_MatchTypes()}

                        <Box sx={{ height: 20 }} />

                        <DialogContentText>Track starts?</DialogContentText>
                        <Checkbox
                            checked={!!+ShowEditPopup_Data.trackstarts}
                            onChange={this.onChangeTrackStarts}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />

                        <TextField
                            margin="dense"
                            id="teamscore"
                            name="teamscore"
                            label="Team score"
                            type="number"
                            fullWidth
                            variant="standard"
                            onChange={this.onChangeTeamScore}
                            value={ShowEditPopup_Data.teamscore === null ? '' : ShowEditPopup_Data.teamscore}
                        />

                        <Box sx={{ height: 20 }} />

                        <TextField
                            margin="dense"
                            id="opponentscore"
                            name="opponentscore"
                            label="Opponent score"
                            type="number"
                            fullWidth
                            variant="standard"
                            onChange={this.onChangeOpponentScore}
                            value={ShowEditPopup_Data.opponentscore === null ? '' : ShowEditPopup_Data.opponentscore}
                        />

                        {
                            (ShowEditPopup_Data.teamscore !== '' && ShowEditPopup_Data.opponentscore !== '') && (ShowEditPopup_Data.teamscore !== null && ShowEditPopup_Data.opponentscore !== null) &&
                            <DialogContentText>Match result: {+ShowEditPopup_Data.teamscore > +ShowEditPopup_Data.opponentscore ? 'WIN' : +ShowEditPopup_Data.teamscore === +ShowEditPopup_Data.opponentscore ? 'TIE' : 'LOSS'}</DialogContentText>
                        }

                    </DialogContent>

                    <DialogActions>
                        <Button onClick={this.onToggleShowEditPopup}>Cancel</Button>
                        <Button variant="contained" color="primary" disabled={Disabled} type="submit">{IsEditing ? 'Edit' : 'Insert'}</Button>
                        {IsEditing && <Button variant="outlined" color="error" type="delete" onClick={this.onDeleteMatch_ShowWarning}>Delete match</Button>}
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        );
    }

    renderFutureMatchesTable = () => {
        var { Matches, PageNo, PageSize, TotalRecords } = this.state.FutureMatches;

        return (
            <DataGrid
                autoHeight
                rows={Matches}
                columns={futureMatchesColumns}
                getRowId={row => row.matchid}
                loading={this.props.TryingGetData}
                pagination
                paginationMode="server"
                rowCount={TotalRecords}

                pageSize={PageSize}
                rowsPerPageOptions={[ 10, 20 ]}
                page={PageNo}
                onPageChange={page => this.onLoadFutureMatches({ page })}
                onPageSizeChange={pageSize => this.onLoadFutureMatches({ pageSize })}

                onRowClick={({ row }) => this.onToggleShowEditPopup({ ShowEditPopup: true, ShowEditPopup_Data: row })}
            />
        );
    }

    renderPastMatchesTable = () => {
        var { Matches, PageNo, PageSize, TotalRecords } = this.state.PastMatches;

        return (
            <DataGrid
                autoHeight
                rows={Matches}
                columns={pastMatchesColumns}
                getRowId={row => row.matchid}
                loading={this.props.TryingGetData}
                pagination
                paginationMode="server"
                rowCount={TotalRecords}

                pageSize={PageSize}
                rowsPerPageOptions={[ 10, 20 ]}
                page={PageNo}
                onPageChange={page => this.onLoadPastMatches({ page })}
                onPageSizeChange={pageSize => this.onLoadPastMatches({ pageSize })}

                onRowClick={({ row }) => this.onToggleShowEditPopup({ ShowEditPopup: true, ShowEditPopup_Data: row })}
            />
        );
    }

    renderPostponedMatchesTable = () => {
        var { Matches, PageNo, PageSize, TotalRecords } = this.state.PostponedMatches;

        return (
            <DataGrid
                autoHeight
                rows={Matches}
                columns={postponedMatchesColumns}
                getRowId={row => row.matchid}
                loading={this.props.TryingGetData}
                pagination
                paginationMode="server"
                rowCount={TotalRecords}

                pageSize={PageSize}
                rowsPerPageOptions={[ 10, 20 ]}
                page={PageNo}
                onPageChange={page => this.onLoadPostponedMatches({ page })}
                onPageSizeChange={pageSize => this.onLoadPostponedMatches({ pageSize })}

                onRowClick={({ row }) => this.onToggleShowEditPopup({ ShowEditPopup: true, ShowEditPopup_Data: row })}
            />
        );
    }

    renderMatches = () => {
        var { CalendarMatches, CalendarType } = this.state;

        if (CalendarType === 'Calendar') {
            return (
                <Calendar
                    CalendarEvents={CalendarMatches.Matches}
                    OnRangeChange={this.onChangeDates_Calendar}
                    OnSelectEvent={event => this.onToggleShowEditPopup({ ShowEditPopup: true, ShowEditPopup_Data: event })}
                    OnSelectSlot={event => this.onToggleShowEditPopup({ FromCalendar: true, ShowEditPopup: true, ShowEditPopup_Data: event })}
                />
            );
        }

        return (
            <>
                <Typography variant="h5" gutterBottom>
                    Future Matches
                </Typography>

                {this.renderFutureMatchesTable()}

                <Box sx={{ height: 40 }} />

                <Typography variant="h5" gutterBottom>
                    Past Matches
                </Typography>

                {this.renderPastMatchesTable()}

                <Box sx={{ height: 40 }} />

                <Typography variant="h5" gutterBottom>
                    Postponed Matches
                </Typography>

                {this.renderPostponedMatchesTable()}
            </>
        );
    }

    renderMatchTypeToggle = () => {
        return (
            <ToggleButtonGroup
                value={this.state.CalendarType}
                exclusive
                onChange={this.onToggleMatchTypeSelection}
                aria-label="text alignment"
            >
                <ToggleButton value="Calendar" aria-label="left aligned">
                    <CalendarMonthIcon />
                </ToggleButton>
                <ToggleButton value="List" aria-label="centered">
                    <ListIcon />
                </ToggleButton>
            </ToggleButtonGroup>
        );
    }

    render() {
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
                            {this.renderAutocompleteList_Filters_Events()}
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
                    </Grid>
                </Grid>

                <Box sx={{ height: 60 }} />

                <Button
                    color="primary"
                    onClick={() => this.onToggleShowEditPopup({ ShowEditPopup: true })}
                    startIcon={<AddIcon />}
                    variant="contained"
                >
                    Add new match
                </Button>

                <Box sx={{ height: 20 }} />

                {this.renderMatchTypeToggle()}

                <Box sx={{ height: 20 }} />

                {this.renderMatches()}

                {this.renderEditPopup()}
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

export default connect(mapStateToProps, { DeleteMatch, GetCompetitions, GetEvents, GetLocations, GetMatches, GetMatchStatuses, GetMatchTypes, GetSeasons, GetTeams, InsertEditMatch })(Matches);