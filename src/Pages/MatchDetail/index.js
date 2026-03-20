import React from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import history from '../../history';
import { DeleteMatch, DeleteMatchEvent, GetEvents, GetGoalTypes, GetLocations, GetMatchDetails, GetMatchEventTypes, GetMatchStatuses, GetMatchTypes, GetPlayers, GetTeams, InsertEditMatch, InsertEditMatchEvent, InsertEditMatchRoster } from '../../Services/Actions';

import Timeline from '../../Components/Timeline';

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
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { DataGrid } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import AddIcon from '@mui/icons-material/LibraryAdd';
import DeleteIcon from '@mui/icons-material/Delete';

dayjs.extend(utc);
dayjs.extend(timezone);

const TIMEZONE = 'America/New_York';

const MatchDetailsTable_columns = [
    // { field: 'matchid', headerName: 'Id', width: 70 },
    { field: 'eventname', headerName: 'Event', flex: 2 },
    { field: 'matchdate', headerName: 'Match Date', flex: 2,
        valueFormatter: params => {
            // Check if value is valid to avoid errors
            if (!params.value) return '';
            return dayjs(params.value).tz(TIMEZONE).format('YYYY/MM/DD hh:mm A');
        }
    },
    { field: 'opponentname', headerName: 'Opponent', flex: 2 },
    { field: 'homeawayname', headerName: 'Home/Away', flex: 1 },
    { field: 'locationname', headerName: 'Location', flex: 2 },
    { field: 'matchstatusname', headerName: 'Match Status', flex: 1 },
    { field: 'matchtypename', headerName: 'Match Type', flex: 1 },
    { field: 'score', headerName: 'Score', flex: 1 },
    { field: 'matchresult', headerName: 'Result', flex: 1 }
];

const MatchRosterTable_columns = [
    { id: 'PlayerName', label: 'Player Name', type: 'text', needsTrackStarts: 0 },
    { id: 'Start', label: 'Start', type: 'checkbox', needsTrackStarts: 1 },
    { id: 'Sub', label: 'Sub', type: 'checkbox', needsTrackStarts: 1 },
    { id: 'Mom', label: 'Man of Match', type: 'checkbox', needsTrackStarts: 0 },
    { id: 'Captain', label: 'Captain', type: 'checkbox', needsTrackStarts: 0 }
];

const ShowEditPopup_Data_Init = { matchid: 0, eventid: 0, eventname: '', matchdate: dayjs(), opponentid: 0, opponentname: '', homeawayid: 0, homeawayname: '', locationid: 0, locationname: '', matchtypeid: 0, matchtypename: '', matchstatusid: 0, matchstatusname: '', teamscore: '', opponentscore: '', trackstarts: 0, delete_warning: false };
const ShowEditMatchEvent_Data_Event_Init = { GoalTypeId: 0, GoalTypeName: '', MatchEventTypeId: 0, PlayerId: 0, PlayerName: '' };
const ShowEditMatchEvent_Data_Init = { Events: [{ ...ShowEditMatchEvent_Data_Event_Init }], MatchEventId: 0, ParentMatchEventTypeId: 0, ParentMatchEventTypeName: '', TimeOfGame: 0,  delete_warning: false };

function MatchDetailWrapper(props) {
    const params = useParams();
    return <MatchDetail MatchId={params.MatchId} {...props} />;
}

class MatchDetail extends React.Component {
    state = {
        Loading: true,

        AutocompleteData_GoalTypes: {
            GoalTypes: [],
            IsOpen: false,
            Loading: false
        },
        AutocompleteData_MatchEventTypes: {
            MatchEventTypes: [],
            IsOpen: false,
            Loading: false
        },
        AutocompleteData_Assisters: { IsOpen: false },
        AutocompleteData_GoalScorers: { IsOpen: false },
        AutocompleteData_Players: {
            Players: [],
            IsOpen: false,
            Loading: false
        },
        AutocompleteData_Roster: { IsOpen: false },

        MatchDetails: {},
        MatchRoster: [],
        MatchRoster_Original: '',
        MatchStats: [],

        ShowEditMatchEvent: false,
        ShowEditMatchEvent_Data: {},



        ShowEditPopup: false,
        ShowEditPopup_Data: {},
        AutocompleteData_Events: {
            Events: [],
            IsOpen: false,
            Loading: false
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
        AutocompleteData_Opponents: {
            Opponents: [],
            IsOpen: false,
            Loading: false
        }
    }
    
    componentDidMount() {
        var { MatchId } = this.props;
        MatchId = +MatchId;

        if (!MatchId) history.push('/matches');

        this.onLoadMatchDetails();
    }

    onAddAssister = () => {
        var ShowEditMatchEvent_Data = { ...this.state.ShowEditMatchEvent_Data };
        ShowEditMatchEvent_Data.Events = [ ...ShowEditMatchEvent_Data.Events, { ...ShowEditMatchEvent_Data_Event_Init, MatchEventTypeId: 5 } ]

        this.setState({ ShowEditMatchEvent_Data });
    }

    onChangeAssister = newValue => {
        var ShowEditMatchEvent_Data = { ...this.state.ShowEditMatchEvent_Data };
        ShowEditMatchEvent_Data.Events[1].PlayerId = !!newValue ? newValue.PlayerId : 0;
        ShowEditMatchEvent_Data.Events[1].PlayerName = !!newValue ? newValue.PlayerName : '';

        this.setState({ ShowEditMatchEvent_Data });
    }

    onChangeEvent = newValue => {
        var ShowEditPopup_Data = { ...this.state.ShowEditPopup_Data };

        ShowEditPopup_Data.eventid = !!newValue ? newValue.eventid : 0;
        ShowEditPopup_Data.eventname = !!newValue ? newValue.eventname : '';

        this.setState({ ShowEditPopup_Data });
    }

    onChangeGoalScorer = newValue => {
        var ShowEditMatchEvent_Data = { ...this.state.ShowEditMatchEvent_Data };
        ShowEditMatchEvent_Data.Events[0].PlayerId = !!newValue ? newValue.PlayerId : 0;
        ShowEditMatchEvent_Data.Events[0].PlayerName = !!newValue ? newValue.PlayerName : '';

        this.setState({ ShowEditMatchEvent_Data });
    }

    onChangeGoalType = newValue => {
        var ShowEditMatchEvent_Data = { ...this.state.ShowEditMatchEvent_Data };

        ShowEditMatchEvent_Data.Events[0].GoalTypeId = !!newValue ? newValue.GoalTypeId : 0;
        ShowEditMatchEvent_Data.Events[0].GoalTypeName = !!newValue ? newValue.GoalTypeName : '';

        this.setState({ ShowEditMatchEvent_Data });
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

    onChangeMatchEventType = newValue => {
        var ShowEditMatchEvent_Data = { ...this.state.ShowEditMatchEvent_Data };

        var OriginalParentMatchEventTypeId = this.state.ShowEditMatchEvent_Data.ParentMatchEventTypeId;

        ShowEditMatchEvent_Data.ParentMatchEventTypeId = !!newValue ? newValue.MatchEventTypeId : 0;
        ShowEditMatchEvent_Data.ParentMatchEventTypeName = !!newValue ? newValue.MatchEventTypeName : '';

        if (+OriginalParentMatchEventTypeId !== +ShowEditMatchEvent_Data.ParentMatchEventTypeId) {
            ShowEditMatchEvent_Data.Events = [];

            // Goal
                if (+ShowEditMatchEvent_Data.ParentMatchEventTypeId === 3) {
                    ShowEditMatchEvent_Data.Events.push({ ...ShowEditMatchEvent_Data_Event_Init, MatchEventTypeId: 3 });

                    // Default with assist
                    ShowEditMatchEvent_Data.Events.push({ ...ShowEditMatchEvent_Data_Event_Init, MatchEventTypeId: 5 });
                }
        }

        this.setState({ ShowEditMatchEvent_Data });
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

    onChangeRoster = MatchRoster => {
        var { MatchRoster_Original } = this.state;

        MatchRoster = [ ...MatchRoster.sort((a, b) => {
            if (a.PlayerName < b.PlayerName) return -1;
            if (a.PlayerName > b.PlayerName) return 1;
            return 0;
        }) ];

        this.setState({ MatchRoster }, () => {
            var UpdatedMatchRoster = MatchRoster.map(({ PlayerId }) => PlayerId).join(',');

            if (UpdatedMatchRoster !== MatchRoster_Original) {
                var { MatchId } = this.props;
                MatchId = +MatchId;

                this.setState({ MatchRoster_Original: UpdatedMatchRoster }, () => {
                    this.props.InsertEditMatchRoster({ MatchId, MatchRoster });
                });
            }
        });
    }

    onChangeRosterData = ({ event, DataType, PlayerIndex }) => {
        var MatchRoster = [ ...this.state.MatchRoster ];
        MatchRoster[PlayerIndex][DataType] = +event.target.checked;

        this.setState({ MatchRoster }, () => {
            var { MatchId } = this.props;
            MatchId = +MatchId;

            this.props.InsertEditMatchRoster({ MatchId, MatchRoster });
        });
    }

    onChangeTimeOfGame = event => {
        var ShowEditMatchEvent_Data = { ...this.state.ShowEditMatchEvent_Data };
        ShowEditMatchEvent_Data.TimeOfGame = event.target.value;
        this.setState({ ShowEditMatchEvent_Data });
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
            history.push('/matches');
        });
    }

    onDeleteMatch_ShowWarning = () => {
        var ShowEditPopup_Data = { ...this.state.ShowEditPopup_Data };
        ShowEditPopup_Data.delete_warning = true;
        this.setState({ ShowEditPopup_Data });
    }

    onDeleteMatchEvent = () => {
        this.props.DeleteMatchEvent({ MatchEventId: this.state.ShowEditMatchEvent_Data.MatchEventId }).then(() => {
            this.onToggleShowEditMatchEvent({});
            this.onLoadMatchDetails({});
        });
    }

    onDeleteMatchEvent_ShowWarning = () => {
        var ShowEditMatchEvent_Data = { ...this.state.ShowEditMatchEvent_Data };
        ShowEditMatchEvent_Data.delete_warning = true;
        this.setState({ ShowEditMatchEvent_Data });
    }

    onInsertEditMatch = event => {
        event.preventDefault();

        var { matchid: MatchId, eventid: EventId, matchdate: MatchDate, locationid: LocationId, opponentid: OpponentId, homeawayname: HomeAway, matchtypeid: MatchTypeId, matchstatusid: MatchStatusId, teamscore: TeamScore, opponentscore: OpponentScore, trackstarts: TrackStarts } = this.state.ShowEditPopup_Data;

        this.props.InsertEditMatch({ EventId, HomeAway, MatchDate, MatchId, MatchStatusId, MatchTypeId, LocationId, OpponentId, OpponentScore, TeamScore, TrackStarts }).then(() => {
            this.onToggleShowEditPopup({});
            this.onLoadMatchDetails({});
        });
    }

    onInsertEditMatchEvent = event => {
        event.preventDefault();

        var { MatchId } = this.props;
        MatchId = +MatchId;

        var { MatchEventId, Events: MatchEvents, ParentMatchEventTypeId: MatchEventTypeId, TimeOfGame } = this.state.ShowEditMatchEvent_Data;

        this.props.InsertEditMatchEvent({ MatchEventId, MatchEvents, MatchEventTypeId, MatchId, TimeOfGame }).then(() => {
            // this.onToggleShowEditMatchEvent({});
            this.onResetMatchEvent();
            this.onLoadMatchDetails({});
        });
    }

    onLoadMatchDetails = () => {
        var { MatchId } = this.props;
        MatchId = +MatchId;

        this.setState({ Loading: true }, () => {
            this.props.GetMatchDetails({ MatchId }).then(({ MatchDetails, MatchRoster, MatchStats }) => {
                var MatchRoster_Original = MatchRoster.map(({ PlayerId }) => PlayerId).sort((a, b) => a - b).join(',');
                this.setState({ Loading: false, MatchDetails, MatchRoster, MatchRoster_Original, MatchStats });
            });
        });
    }

    onRemoveAssister = () => {
        var ShowEditMatchEvent_Data = { ...this.state.ShowEditMatchEvent_Data };
        ShowEditMatchEvent_Data.Events = [ ...ShowEditMatchEvent_Data.Events.slice(0, -1) ]

        this.setState({ ShowEditMatchEvent_Data });
    }

    onResetMatchEvent = () => {
        var ShowEditMatchEvent_Data = { ...ShowEditMatchEvent_Data_Init };

        this.setState({ ShowEditMatchEvent_Data });
    }

    onToggleShowAutocompleteList_Assisters = ShowAutocompleteList_Players => {
        var AutocompleteData_Assisters = { ...this.state.AutocompleteData_Assisters };
        var AutocompleteData_Players = { ...this.state.AutocompleteData_Players };

        var Players = AutocompleteData_Players.Players;
        AutocompleteData_Assisters.IsOpen = ShowAutocompleteList_Players;
        this.setState({ AutocompleteData_Assisters, AutocompleteData_Players }, () => {
            if (!Players.length) {
                this.props.GetPlayers({ GetAll: 1 }).then(({ Players }) => {
                    AutocompleteData_Players.Players = [ ...Players.map(({ playerid: PlayerId, playername: PlayerName }) => ({ PlayerId, PlayerName, Start: 0, Sub: 0, Mom: 0, Captain: 0 })) ];

                    this.setState({ AutocompleteData_Players });
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

    onToggleShowAutocompleteList_GoalScorers = ShowAutocompleteList_Players => {
        var AutocompleteData_GoalScorers = { ...this.state.AutocompleteData_GoalScorers };
        var AutocompleteData_Players = { ...this.state.AutocompleteData_Players };

        var Players = AutocompleteData_Players.Players;
        AutocompleteData_GoalScorers.IsOpen = ShowAutocompleteList_Players;
        this.setState({ AutocompleteData_GoalScorers, AutocompleteData_Players }, () => {
            if (!Players.length) {
                this.props.GetPlayers({ GetAll: 1 }).then(({ Players }) => {
                    AutocompleteData_Players.Players = [ ...Players.map(({ playerid: PlayerId, playername: PlayerName }) => ({ PlayerId, PlayerName, Start: 0, Sub: 0, Mom: 0, Captain: 0 })) ];

                    this.setState({ AutocompleteData_Players });
                });
            }
        });    
    }

    onToggleShowAutocompleteList_GoalTypes = ShowAutocompleteList_GoalTypes => {
        var AutocompleteData_GoalTypes = { ...this.state.AutocompleteData_GoalTypes };

        var GoalTypes = AutocompleteData_GoalTypes.GoalTypes;
        AutocompleteData_GoalTypes.IsOpen = ShowAutocompleteList_GoalTypes;
        this.setState({ AutocompleteData_GoalTypes }, () => {
            if (!GoalTypes.length) {
                this.props.GetGoalTypes().then(({ GoalTypes }) => {
                    AutocompleteData_GoalTypes.GoalTypes = [ ...GoalTypes.map(({ goaltypeid: GoalTypeId, goaltypename: GoalTypeName }) => ({ GoalTypeId, GoalTypeName })) ];

                    this.setState({ AutocompleteData_GoalTypes });
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

    onToggleShowAutocompleteList_MatchEventTypes = ShowAutocompleteList_MatchEventTypes => {
        var AutocompleteData_MatchEventTypes = { ...this.state.AutocompleteData_MatchEventTypes };

        var MatchEventTypes = AutocompleteData_MatchEventTypes.MatchEventTypes;
        AutocompleteData_MatchEventTypes.IsOpen = ShowAutocompleteList_MatchEventTypes;
        this.setState({ AutocompleteData_MatchEventTypes }, () => {
            if (!MatchEventTypes.length) {
                this.props.GetMatchEventTypes().then(({ MatchEventTypes }) => {
                    AutocompleteData_MatchEventTypes.MatchEventTypes = [ ...MatchEventTypes.map(({ matcheventtypeid: MatchEventTypeId, matcheventtypename: MatchEventTypeName, selectable: Selectable }) => ({ MatchEventTypeId, MatchEventTypeName, Selectable })) ];

                    this.setState({ AutocompleteData_MatchEventTypes });
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

    onToggleShowAutocompleteList_Roster = ShowAutocompleteList_Players => {
        var AutocompleteData_Roster = { ...this.state.AutocompleteData_Roster };
        var AutocompleteData_Players = { ...this.state.AutocompleteData_Players };

        var Players = AutocompleteData_Players.Players;
        AutocompleteData_Roster.IsOpen = ShowAutocompleteList_Players;
        this.setState({ AutocompleteData_Roster, AutocompleteData_Players }, () => {
            if (!Players.length) {
                this.props.GetPlayers({ GetAll: 1 }).then(({ Players }) => {
                    AutocompleteData_Players.Players = [ ...Players.map(({ playerid: PlayerId, playername: PlayerName }) => ({ PlayerId, PlayerName, Start: 0, Sub: 0, Mom: 0, Captain: 0 })) ];

                    this.setState({ AutocompleteData_Players });
                });
            }
        });    
    }

    onToggleShowEditMatchEvent = ({ ShowEditMatchEvent = false, ShowEditMatchEvent_Data = {} }) => {
        if (!!ShowEditMatchEvent) ShowEditMatchEvent_Data = { ...ShowEditMatchEvent_Data_Init, ...ShowEditMatchEvent_Data };

        this.setState({ ShowEditMatchEvent, ShowEditMatchEvent_Data });
    }

    onToggleShowEditPopup = ({ ShowEditPopup = false, ShowEditPopup_Data = {} }) => {
        if (!!ShowEditPopup) ShowEditPopup_Data = { ...ShowEditPopup_Data_Init, ...ShowEditPopup_Data };

        this.setState({ ShowEditPopup, ShowEditPopup_Data });
    }

    renderAutocompleteList_Assister = () => {
        var { PlayerId, PlayerName } = this.state.ShowEditMatchEvent_Data.Events[1];
        var { IsOpen } = this.state.AutocompleteData_Assisters;
        var { Players, Loading } = this.state.AutocompleteData_Players;

        var value = { PlayerId, PlayerName };

        return (
            <Autocomplete
                sx={{ width: 300 }}
                open={IsOpen}
                onOpen={() => this.onToggleShowAutocompleteList_Assisters(true)}
                onClose={() => this.onToggleShowAutocompleteList_Assisters(false)}
                isOptionEqualToValue={(option, value) => option.PlayerId === value.PlayerId}
                getOptionLabel={option => option.PlayerName}
                options={Players}
                loading={Loading}
                value={value}
                onChange={(event, newValue) => this.onChangeAssister(newValue)}
                renderInput={params => (
                    <TextField
                        {...params}
                        label="Assister"
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

    renderAutocompleteList_GoalScorer = () => {
        var { PlayerId, PlayerName } = this.state.ShowEditMatchEvent_Data.Events[0];
        var { IsOpen } = this.state.AutocompleteData_GoalScorers;
        var { Players, Loading } = this.state.AutocompleteData_Players;

        var value = { PlayerId, PlayerName };

        return (
            <Autocomplete
                sx={{ width: 300 }}
                open={IsOpen}
                onOpen={() => this.onToggleShowAutocompleteList_GoalScorers(true)}
                onClose={() => this.onToggleShowAutocompleteList_GoalScorers(false)}
                isOptionEqualToValue={(option, value) => option.PlayerId === value.PlayerId}
                getOptionLabel={option => option.PlayerName}
                options={Players}
                loading={Loading}
                value={value}
                onChange={(event, newValue) => this.onChangeGoalScorer(newValue)}
                renderInput={params => (
                    <TextField
                        {...params}
                        label="Goal scorer"
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

    renderAutocompleteList_GoalTypes = () => {
        var { GoalTypeId, GoalTypeName } = this.state.ShowEditMatchEvent_Data.Events[0];
        var { GoalTypes, IsOpen, Loading } = this.state.AutocompleteData_GoalTypes;

        var value = { GoalTypeId, GoalTypeName };

        return (
            <Autocomplete
                sx={{ width: 300 }}
                open={IsOpen}
                onOpen={() => this.onToggleShowAutocompleteList_GoalTypes(true)}
                onClose={() => this.onToggleShowAutocompleteList_GoalTypes(false)}
                isOptionEqualToValue={(option, value) => option.GoalTypeId === value.GoalTypeId}
                getOptionLabel={option => option.GoalTypeName}
                options={GoalTypes}
                loading={Loading}
                value={value}
                onChange={(event, newValue) => this.onChangeGoalType(newValue)}
                renderInput={params => (
                    <TextField
                        {...params}
                        label="Goal type"
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

    renderAutocompleteList_ParentMatchEventTypes = () => {
        var { ParentMatchEventTypeId: MatchEventTypeId, ParentMatchEventTypeName: MatchEventTypeName } = this.state.ShowEditMatchEvent_Data;
        var { MatchEventTypes, IsOpen, Loading } = this.state.AutocompleteData_MatchEventTypes;

        var value = { MatchEventTypeId, MatchEventTypeName };

        return (
            <Autocomplete
                sx={{ width: 300 }}
                open={IsOpen}
                onOpen={() => this.onToggleShowAutocompleteList_MatchEventTypes(true)}
                onClose={() => this.onToggleShowAutocompleteList_MatchEventTypes(false)}
                isOptionEqualToValue={(option, value) => option.MatchEventTypeId === value.MatchEventTypeId}
                getOptionLabel={option => option.MatchEventTypeName}
                options={MatchEventTypes}
                loading={Loading}
                value={value}
                onChange={(event, newValue) => this.onChangeMatchEventType(newValue)}
                renderInput={params => (
                    <TextField
                        {...params}
                        label="Parent match event type"
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

    renderAutocompleteList_Roster = () => {
        var { IsOpen } = this.state.AutocompleteData_Roster;
        var { Players, Loading } = this.state.AutocompleteData_Players;

        return (
            <Autocomplete
                multiple
                sx={{ width: '100%' }}
                open={IsOpen}
                onOpen={() => this.onToggleShowAutocompleteList_Roster(true)}
                onClose={() => this.onToggleShowAutocompleteList_Roster(false)}
                isOptionEqualToValue={(option, value) => option.PlayerId === value.PlayerId}
                getOptionLabel={option => option.PlayerName}
                options={Players}
                loading={Loading}
                value={this.state.MatchRoster}
                disableCloseOnSelect
                onChange={(event, newValue) => this.onChangeRoster(newValue)}
                renderInput={params => (
                    <TextField
                        {...params}
                        label="Roster"
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

    renderChooseMatchEventDetailsLogic = () => {
        var { ShowEditMatchEvent_Data } = this.state;

        var ParentMatchEventTypeId = ShowEditMatchEvent_Data.ParentMatchEventTypeId;

        // Goal --> Show Goal & Assist Options
            if (ParentMatchEventTypeId === 3) {
                return (
                    <>
                        <Typography variant="h5" gutterBottom>
                            Goal Scorer
                        </Typography>

                        {this.renderAutocompleteList_GoalScorer()}

                        <Box sx={{ height: 20 }} />

                        {this.renderAutocompleteList_GoalTypes()}

                        <Box sx={{ height: 20 }} />

                        {
                            ShowEditMatchEvent_Data.Events.length > 1 ?
                            <>
                                <Typography variant="h5" gutterBottom>
                                    Assister
                                </Typography>
        
                                {this.renderAutocompleteList_Assister()}

                                <Box sx={{ height: 20 }} />

                                <Button
                                    color="error"
                                    onClick={this.onRemoveAssister}
                                    startIcon={<DeleteIcon />}
                                    variant="outlined"
                                >
                                    Remove assister
                                </Button>
                            </>
                        :
                            <Button
                                color="primary"
                                onClick={this.onAddAssister}
                                startIcon={<AddIcon />}
                                variant="contained"
                            >
                                Add assister
                            </Button>
                        }
                    </>
                );
            }

        return null;
    }

    renderEditEvent = () => {
        var { ShowEditMatchEvent, ShowEditMatchEvent_Data } = this.state;

        if (!ShowEditMatchEvent) return null;

        if (!!ShowEditMatchEvent_Data.delete_warning) {
            return (
                <React.Fragment>
                    <Dialog
                        maxWidth="md"
                        fullWidth={true}
                        open={ShowEditMatchEvent}
                        onClose={this.onToggleShowEditMatchEvent}
                    >
                        <DialogTitle>Delete match event</DialogTitle>
    
                        <DialogContent>
                            <DialogContentText>Are you sure you want to delete the match event? You will not be able to undo this</DialogContentText>
                        </DialogContent>
    
                        <DialogActions>
                            <Button onClick={this.onToggleShowEditMatchEvent}>Cancel</Button>
                            <Button variant="outlined" color="error" type="delete" onClick={this.onDeleteMatchEvent}>Delete</Button>
                        </DialogActions>
                    </Dialog>
                </React.Fragment>
            );
        }

        var IsEditing = !!+ShowEditMatchEvent_Data.MatchEventId;

        var Disabled = !+ShowEditMatchEvent_Data.ParentMatchEventTypeId || !ShowEditMatchEvent_Data.TimeOfGame || ShowEditMatchEvent_Data.Events.length === 0;

        return (
            <React.Fragment>
                <Dialog
                    maxWidth="md"
                    fullWidth={true}
                    open={ShowEditMatchEvent}
                    onClose={this.onToggleShowEditMatchEvent}
                    PaperProps={{
                        component: 'form',
                        onSubmit: this.onInsertEditMatchEvent
                    }}
                >
                    <DialogTitle>{IsEditing ? 'Edit' : 'Insert'} Match Event</DialogTitle>

                    <DialogContent>
                        <DialogContentText>{IsEditing ? 'Edit' : 'Insert'} the match event details here</DialogContentText>

                        <Box sx={{ height: 20 }} />

                        <TextField
                            required
                            margin="dense"
                            id="TimeOfGame"
                            name="TimeOfGame"
                            label="Time of game"
                            type="number"
                            fullWidth
                            variant="standard"
                            onChange={this.onChangeTimeOfGame}
                            value={ShowEditMatchEvent_Data.TimeOfGame || ''}
                        />

                        <Box sx={{ height: 20 }} />

                        {this.renderAutocompleteList_ParentMatchEventTypes()}

                        {
                            !!+ShowEditMatchEvent_Data.ParentMatchEventTypeId &&
                            <>
                                <Box sx={{ height: 20 }} />

                                {this.renderChooseMatchEventDetailsLogic()}
                            </>
                        }
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={this.onToggleShowEditMatchEvent}>Cancel</Button>
                        <Button variant="contained" color="primary" disabled={Disabled} type="submit">{IsEditing ? 'Edit' : 'Insert'}</Button>
                        {IsEditing && <Button variant="outlined" color="error" type="delete" onClick={this.onDeleteMatchEvent_ShowWarning}>Delete match event</Button>}
                    </DialogActions>
                </Dialog>
            </React.Fragment>
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

    renderEventsTimeline = () => {
        return (
            <>
                <Typography variant="h5" gutterBottom>
                    Summary
                </Typography>

                {
                    this.state.MatchStats.length > 0 &&
                    <>
                        <Box sx={{ height: 20 }} />
        
                        <Timeline MatchStats={this.state.MatchStats} OnToggleShowEditMatchEvent={ShowEditMatchEvent_Data => this.onToggleShowEditMatchEvent({ ShowEditMatchEvent: true, ShowEditMatchEvent_Data })} />
        
                        <Box sx={{ height: 60 }} />
                    </>
                }

                <Button
                    color="primary"
                    onClick={() => this.onToggleShowEditMatchEvent({ ShowEditMatchEvent: true })}
                    startIcon={<AddIcon />}
                    variant="contained"
                >
                    Add new match event
                </Button>
            </>
        )
    }

    renderMatchDetailsTable = () => {
        var rows = [];
        rows.push(this.state.MatchDetails);

        return (
            <>
                <Typography variant="h5" gutterBottom>
                    Details
                </Typography>

                <Box sx={{ height: 20 }} />

                <DataGrid
                    autoHeight
                    rows={rows}
                    columns={MatchDetailsTable_columns}
                    getRowId={row => row.matchid}
                    hideFooter
                    onRowClick={({ row }) => this.onToggleShowEditPopup({ ShowEditPopup: true, ShowEditPopup_Data: row })}
                />
            </>
        );
    }

    renderMatchRoster = () => {
        return (
            <>
                <Typography variant="h5" gutterBottom>
                    Roster ({this.state.MatchRoster.length})
                </Typography>

                <Box sx={{ height: 20 }} />

                {this.renderAutocompleteList_Roster()}

                {
                    !!this.state.MatchRoster.length > 0 &&
                    <>
                        <Box sx={{ height: 20 }} />

                        <Typography variant="h6" gutterBottom>
                            Track Starts is {`${!!+this.state.MatchDetails.trackstarts ? 'ON' : 'OFF'}`}
                        </Typography>

                        {this.renderRosterTable()}
                    </>
                }
            </>
        )
    }

    renderRosterTable = () => {
        var { MatchDetails: { trackstarts }, MatchRoster } = this.state;

        return (
            <TableContainer sx={{ maxHeight: 800 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {MatchRosterTable_columns.map(({ id, label, needsTrackStarts }) => {
                                if (!trackstarts && !!needsTrackStarts) return null;

                                return <TableCell key={id}>{label}</TableCell>;
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            MatchRoster.map((Player, PlayerIndex) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={Player.PlayerId}>
                                        {MatchRosterTable_columns.map(({ id, needsTrackStarts, type }) => {
                                            if (!trackstarts && !!needsTrackStarts) return null;

                                            if (type === 'text') return <TableCell key={id}>{Player[id]}</TableCell>;

                                            return (
                                                <TableCell key={id}>
                                                    <Checkbox
                                                        checked={!!+Player[id]}
                                                        onChange={event => this.onChangeRosterData({ event, DataType: id, PlayerIndex })}
                                                        inputProps={{ 'aria-label': 'controlled' }}
                                                    />
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }

    renderLoading = () => {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    render() {
        if (this.state.Loading) return this.renderLoading();

        return (
            <>

                {this.renderMatchDetailsTable()}

                <Box sx={{ height: 60 }} />

                {this.renderEventsTimeline()}

                <Box sx={{ height: 60 }} />

                {this.renderMatchRoster()}

                {this.renderEditEvent()}
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

export default connect(mapStateToProps, { DeleteMatch, DeleteMatchEvent, GetEvents, GetGoalTypes, GetLocations, GetMatchDetails, GetMatchEventTypes, GetMatchStatuses, GetMatchTypes, GetPlayers, GetTeams, InsertEditMatch, InsertEditMatchEvent, InsertEditMatchRoster })(MatchDetailWrapper);