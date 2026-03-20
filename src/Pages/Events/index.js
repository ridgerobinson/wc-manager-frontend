import React from 'react';
import { connect } from 'react-redux';
import { DeleteEvent, GetColors, GetCompetitions, GetEvents, GetSeasons, GetTeams, InsertEditEvent } from '../../Services/Actions';

import { DataGrid } from '@mui/x-data-grid';

import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

import AddIcon from '@mui/icons-material/LibraryAdd';

const columns = [
    { field: 'eventid', headerName: 'Id', width: 70 },
    { field: 'teamname', headerName: 'Team', flex: 2 },
    { field: 'competitionname', headerName: 'Competition', flex: 1 },
    { field: 'seasonname', headerName: 'Season', flex: 1 },
    { field: 'rosterlimit', headerName: 'Roster Limit', flex: 1 }
];

const ShowEditPopup_Data_Init = { id: 0, hexcode: '', competitionid: 0, competitionname: '', seasonid: 0, seasonname: '', teamid: 0, teamname: '', rosterlimit: '', delete_warning: false };

class Events extends React.Component {
    state = {
        Colors: [],
        Events: [],
        IsMoreResults: null,
        PageNo: 0,
        PageSize: 10,
        SearchName_Previous: '',
        SearchName: '',
        TotalRecords: 0,

        ShowEditPopup: false,
        ShowEditPopup_Data: {},

        AutocompleteData_Competitions: {
            Competitions: [],
            IsOpen: false,
            Loading: false
        },
        AutocompleteData_Seasons: {
            Seasons: [],
            IsOpen: false,
            Loading: false
        },
        AutocompleteData_Teams: {
            Teams: [],
            IsOpen: false,
            Loading: false
        }
    }
    
    componentDidMount() {
        this.onLoadEvents({});
    }

    onChangeColor = hexcode => {
        var ShowEditPopup_Data = { ...this.state.ShowEditPopup_Data };
        ShowEditPopup_Data.hexcode = hexcode;

        this.setState({ ShowEditPopup_Data });
    }

    onChangeCompetition = newValue => {
        var ShowEditPopup_Data = { ...this.state.ShowEditPopup_Data };

        ShowEditPopup_Data.competitionid = !!newValue ? newValue.competitionid : 0;
        ShowEditPopup_Data.competitionname = !!newValue ? newValue.competitionname : '';

        this.setState({ ShowEditPopup_Data });
    }

    onChangeRosterLimit = event => {
        var ShowEditPopup_Data = { ...this.state.ShowEditPopup_Data };
        ShowEditPopup_Data.rosterlimit = event.target.value;
        this.setState({ ShowEditPopup_Data });
    }

    onChangeSeason = newValue => {
        var ShowEditPopup_Data = { ...this.state.ShowEditPopup_Data };

        ShowEditPopup_Data.seasonid = !!newValue ? newValue.seasonid : 0;
        ShowEditPopup_Data.seasonname = !!newValue ? newValue.seasonname : '';

        this.setState({ ShowEditPopup_Data });
    }

    onChangeTeam = newValue => {
        var ShowEditPopup_Data = { ...this.state.ShowEditPopup_Data };

        ShowEditPopup_Data.teamid = !!newValue ? newValue.teamid : 0;
        ShowEditPopup_Data.teamname = !!newValue ? newValue.teamname : '';

        this.setState({ ShowEditPopup_Data });
    }

    onDeleteEvent = () => {
        this.props.DeleteEvent({ EventId: this.state.ShowEditPopup_Data.eventid }).then(() => {
            this.onToggleShowEditPopup({});
            this.onLoadEvents({});
        });
    }

    onDeleteEvent_ShowWarning = () => {
        var ShowEditPopup_Data = { ...this.state.ShowEditPopup_Data };
        ShowEditPopup_Data.delete_warning = true;
        this.setState({ ShowEditPopup_Data });
    }

    onInsertEditEvent = event => {
        event.preventDefault();

        var { hexcode: Color, competitionid: CompetitionId, eventid: EventId, rosterlimit: RosterLimit, seasonid: SeasonId, teamid: TeamId } = this.state.ShowEditPopup_Data;

        this.props.InsertEditEvent({ Color, CompetitionId, EventId, RosterLimit: +RosterLimit, SeasonId, TeamId }).then(() => {
            this.onToggleShowEditPopup({});
            this.onLoadEvents({});
        });
    }

    onLoadEvents = ({ page: PageNo, pageSize: PageSize }) => {
        var { SearchName } = this.state;
        PageNo = PageNo !== undefined ? PageNo : this.state.PageNo;
        PageSize = PageSize !== undefined ? PageSize : this.state.PageSize;

        // if (Increment) PageNo++;

        this.setState({ PageNo, PageSize }, () => {
            PageNo++;

            this.props.GetEvents({ PageNo, PageSize, SearchName }).then(({ Events, IsMoreResults, TotalRecords }) => {
                this.setState({ Events, IsMoreResults, TotalRecords });
            });
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

    onToggleShowAutocompleteList_Teams = ShowAutocompleteList_Teams => {
        var AutocompleteData_Teams = { ...this.state.AutocompleteData_Teams };

        var Teams = AutocompleteData_Teams.Teams;
        AutocompleteData_Teams.IsOpen = ShowAutocompleteList_Teams;
        this.setState({ AutocompleteData_Teams }, () => {
            if (!Teams.length) {
                this.props.GetTeams({ GetAll: true }).then(({ Teams }) => {
                    AutocompleteData_Teams.Teams = [ ...Teams ];

                    this.setState({ AutocompleteData_Teams });
                });
            }
        });    
    }

    onToggleShowEditPopup = ({ ShowEditPopup = false, ShowEditPopup_Data = {} }) => {
        if (!!ShowEditPopup) {
            ShowEditPopup_Data = { ...ShowEditPopup_Data_Init, ...ShowEditPopup_Data };

            var Colors = [ ...this.state.Colors ];

            if (!Colors.length) {
                Colors = this.props.GetColors().then(({ Colors }) => {
                    this.setState({ Colors, ShowEditPopup, ShowEditPopup_Data  })
                })
            } else this.setState({ ShowEditPopup, ShowEditPopup_Data });
            
        } else this.setState({ ShowEditPopup, ShowEditPopup_Data });
    }

    renderEventsTable = () => {
        var { Events, PageNo, PageSize, TotalRecords } = this.state;

        return (
            <DataGrid
                autoHeight
                rows={Events}
                columns={columns}
                getRowId={row => row.eventid}
                loading={this.props.TryingGetData}
                pagination
                paginationMode="server"
                rowCount={TotalRecords}
                
                pageSize={PageSize}
                rowsPerPageOptions={[ 10, 20 ]}
                page={PageNo}
                onPageChange={page => this.onLoadEvents({ page })}
                onPageSizeChange={pageSize => this.onLoadEvents({ pageSize })}

                onRowClick={({ row }) => this.onToggleShowEditPopup({ ShowEditPopup: true, ShowEditPopup_Data: row })}
            />
        );
    }

    renderAutocompleteList_Competitions = () => {
        var { competitionid, competitionname } = this.state.ShowEditPopup_Data;
        var { Competitions, IsOpen, Loading } = this.state.AutocompleteData_Competitions;

        var value = { competitionid, competitionname };

        return (
            <Autocomplete
                sx={{ width: 300 }}
                open={IsOpen}
                onOpen={() => this.onToggleShowAutocompleteList_Competitions(true)}
                onClose={() => this.onToggleShowAutocompleteList_Competitions(false)}
                isOptionEqualToValue={(option, value) => option.competitionid === value.competitionid}
                getOptionLabel={option => option.competitionname}
                options={Competitions}
                loading={Loading}
                value={value}
                onChange={(event, newValue) => this.onChangeCompetition(newValue)}
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

    renderAutocompleteList_Seasons = () => {
        var { seasonid, seasonname } = this.state.ShowEditPopup_Data;
        var { Seasons, IsOpen, Loading } = this.state.AutocompleteData_Seasons;

        var value = { seasonid, seasonname };

        return (
            <Autocomplete
                sx={{ width: 300 }}
                open={IsOpen}
                onOpen={() => this.onToggleShowAutocompleteList_Seasons(true)}
                onClose={() => this.onToggleShowAutocompleteList_Seasons(false)}
                isOptionEqualToValue={(option, value) => option.seasonid === value.seasonid}
                getOptionLabel={option => option.seasonname}
                options={Seasons}
                loading={Loading}
                value={value}
                onChange={(event, newValue) => this.onChangeSeason(newValue)}
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

    renderAutocompleteList_Teams = () => {
        var { teamid, teamname } = this.state.ShowEditPopup_Data;
        var { Teams, IsOpen, Loading } = this.state.AutocompleteData_Teams;

        var value = { teamid, teamname };

        return (
            <Autocomplete
                sx={{ width: 300 }}
                open={IsOpen}
                onOpen={() => this.onToggleShowAutocompleteList_Teams(true)}
                onClose={() => this.onToggleShowAutocompleteList_Teams(false)}
                isOptionEqualToValue={(option, value) => option.teamid === value.teamid}
                getOptionLabel={option => option.teamname}
                options={Teams}
                loading={Loading}
                value={value}
                onChange={(event, newValue) => this.onChangeTeam(newValue)}
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

    renderColors = () => {
        var { Colors, ShowEditPopup_Data } = this.state;

        return (
            <div>
                {
                    Colors.map(({ id, hexcode }) => {
                        return (
                            <div key={id} onClick={() => this.onChangeColor(hexcode)} style={{ height: '30px', width: '30px', borderRadius: '100%', backgroundColor: hexcode, border: hexcode === ShowEditPopup_Data.hexcode ? '5px solid black' : null }}/>
                        );
                    })
                }
            </div>
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
                        <DialogTitle>Delete event</DialogTitle>
    
                        <DialogContent>
                            <DialogContentText>Are you sure you want to delete the event? You will not be able to undo this</DialogContentText>
                        </DialogContent>
    
                        <DialogActions>
                            <Button onClick={this.onToggleShowEditPopup}>Cancel</Button>
                            <Button variant="outlined" color="error" type="delete" onClick={this.onDeleteEvent}>Delete</Button>
                        </DialogActions>
                    </Dialog>
                </React.Fragment>
            );
        }

        var IsEditing = !!+ShowEditPopup_Data.eventid;

        var Disabled = !ShowEditPopup_Data.hexcode || !ShowEditPopup_Data.competitionid || !ShowEditPopup_Data.seasonid || !ShowEditPopup_Data.teamid;

        return (
            <React.Fragment>
                <Dialog
                    maxWidth="md"
                    fullWidth={true}
                    open={ShowEditPopup}
                    onClose={this.onToggleShowEditPopup}
                    PaperProps={{
                        component: 'form',
                        onSubmit: this.onInsertEditEvent
                    }}
                >
                    <DialogTitle>{IsEditing ? 'Edit' : 'Insert'} Event</DialogTitle>

                    <DialogContent>
                        <DialogContentText>{IsEditing ? 'Edit' : 'Insert'} the event details here</DialogContentText>
                        
                        <TextField
                            autoFocus
                            margin="dense"
                            id="rosterlimit"
                            name="rosterlimit"
                            label="Roster limit"
                            type="text"
                            fullWidth
                            variant="standard"
                            onChange={this.onChangeRosterLimit}
                            value={ShowEditPopup_Data.rosterlimit}
                        />

                        <Box sx={{ height: 20 }} />

                        {this.renderColors()}

                        <Box sx={{ height: 20 }} />

                        {this.renderAutocompleteList_Competitions()}

                        <Box sx={{ height: 20 }} />

                        {this.renderAutocompleteList_Seasons()}

                        <Box sx={{ height: 20 }} />

                        {this.renderAutocompleteList_Teams()}
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={this.onToggleShowEditPopup}>Cancel</Button>
                        <Button variant="contained" color="primary" disabled={Disabled} type="submit">{IsEditing ? 'Edit' : 'Insert'}</Button>
                        {IsEditing && <Button variant="outlined" color="error" type="delete" onClick={this.onDeleteEvent_ShowWarning}>Delete event</Button>}
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        );
    }

    render() {
        return (
            <>
                <Button
                    color="primary"
                    onClick={() => this.onToggleShowEditPopup({ ShowEditPopup: true })}
                    startIcon={<AddIcon />}
                    variant="contained"
                >
                    Add new event
                </Button>

                <Box sx={{ height: 20 }} />

                {this.renderEventsTable()}

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

export default connect(mapStateToProps, { DeleteEvent, GetColors, GetCompetitions, GetEvents, GetSeasons, GetTeams, InsertEditEvent })(Events);