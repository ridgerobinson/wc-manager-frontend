import React from 'react';
import { connect } from 'react-redux';
import { DeleteTeam, GetClubs, GetTeams, InsertEditTeam } from '../../Services/Actions';

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
    { field: 'teamid', headerName: 'Id', width: 70 },
    { field: 'teamname', headerName: 'Team', flex: 2 },
    { field: 'clubname', headerName: 'Club', flex: 1 }
];

const ShowEditPopup_Data_Init = { id: 0, clubid: 0, clubname: '', teamname: '', delete_warning: false };

class Teams extends React.Component {
    state = {
        Teams: [],
        IsMoreResults: null,
        PageNo: 0,
        PageSize: 10,
        SearchName_Previous: '',
        SearchName: '',
        TotalRecords: 0,

        ShowEditPopup: false,
        ShowEditPopup_Data: {},

        AutocompleteData_Clubs: {
            Clubs: [],
            IsOpen: false,
            Loading: false
        }
    }
    
    componentDidMount() {
        this.onLoadTeams({});
    }

    onChangeClub = newValue => {
        var ShowEditPopup_Data = { ...this.state.ShowEditPopup_Data };

        ShowEditPopup_Data.clubid = !!newValue ? newValue.clubid : 0;
        ShowEditPopup_Data.clubname = !!newValue ? newValue.clubname : '';

        this.setState({ ShowEditPopup_Data });
    }

    onChangeName = event => {
        var ShowEditPopup_Data = { ...this.state.ShowEditPopup_Data };
        ShowEditPopup_Data.teamname = event.target.value;
        this.setState({ ShowEditPopup_Data });
    }

    onDeleteTeam = () => {
        this.props.DeleteTeam({ TeamId: this.state.ShowEditPopup_Data.teamid }).then(() => {
            this.onToggleShowEditPopup({});
            this.onLoadTeams({});
        });
    }

    onDeleteTeam_ShowWarning = () => {
        var ShowEditPopup_Data = { ...this.state.ShowEditPopup_Data };
        ShowEditPopup_Data.delete_warning = true;
        this.setState({ ShowEditPopup_Data });
    }

    onInsertEditTeam = event => {
        event.preventDefault();

        var { clubid: ClubId, teamid: TeamId, teamname: TeamName } = this.state.ShowEditPopup_Data;

        this.props.InsertEditTeam({ ClubId, TeamId, TeamName }).then(() => {
            this.onToggleShowEditPopup({});
            this.onLoadTeams({});
        });
    }

    onLoadTeams = ({ page: PageNo, pageSize: PageSize }) => {
        var { SearchName } = this.state;
        PageNo = PageNo !== undefined ? PageNo : this.state.PageNo;
        PageSize = PageSize !== undefined ? PageSize : this.state.PageSize;

        // if (Increment) PageNo++;

        this.setState({ PageNo, PageSize }, () => {
            PageNo++;

            this.props.GetTeams({ PageNo, PageSize, SearchName }).then(({ Teams, IsMoreResults, TotalRecords }) => {
                this.setState({ Teams, IsMoreResults, TotalRecords });
            });
        });
    }

    onToggleShowAutocompleteList_Clubs = ShowAutocompleteList_Clubs => {
        var AutocompleteData_Clubs = { ...this.state.AutocompleteData_Clubs };

        var Clubs = AutocompleteData_Clubs.Clubs;
        AutocompleteData_Clubs.IsOpen = ShowAutocompleteList_Clubs;
        this.setState({ AutocompleteData_Clubs }, () => {
            if (!Clubs.length) {
                this.props.GetClubs({ GetAll: true }).then(({ Clubs }) => {
                    AutocompleteData_Clubs.Clubs = [ ...Clubs ];

                    this.setState({ AutocompleteData_Clubs });
                });
            }
        });    
    }

    onToggleShowEditPopup = ({ ShowEditPopup = false, ShowEditPopup_Data = {} }) => {
        if (!!ShowEditPopup) ShowEditPopup_Data = { ...ShowEditPopup_Data_Init, ...ShowEditPopup_Data };

        this.setState({ ShowEditPopup, ShowEditPopup_Data });
    }

    renderTeamsTable = () => {
        var { Teams, PageNo, PageSize, TotalRecords } = this.state;

        return (
            <DataGrid
                autoHeight
                rows={Teams}
                columns={columns}
                getRowId={row => row.teamid}
                loading={this.props.TryingGetData}
                pagination
                paginationMode="server"
                rowCount={TotalRecords}
                
                pageSize={PageSize}
                rowsPerPageOptions={[ 10, 20 ]}
                page={PageNo}
                onPageChange={page => this.onLoadTeams({ page })}
                onPageSizeChange={pageSize => this.onLoadTeams({ pageSize })}
                
                onRowClick={({ row }) => this.onToggleShowEditPopup({ ShowEditPopup: true, ShowEditPopup_Data: row })}
            />
        );
    }

    renderAutocompleteList_Clubs = () => {
        var { clubid, clubname } = this.state.ShowEditPopup_Data;
        var { Clubs, IsOpen, Loading } = this.state.AutocompleteData_Clubs;

        var value = { clubid, clubname };

        return (
            <Autocomplete
                sx={{ width: 300 }}
                open={IsOpen}
                onOpen={() => this.onToggleShowAutocompleteList_Clubs(true)}
                onClose={() => this.onToggleShowAutocompleteList_Clubs(false)}
                isOptionEqualToValue={(option, value) => option.clubid === value.clubid}
                getOptionLabel={option => option.clubname}
                options={Clubs}
                loading={Loading}
                value={value}
                onChange={(event, newValue) => this.onChangeClub(newValue)}
                renderInput={params => (
                    <TextField
                        {...params}
                        label="Clubs"
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
                        <DialogTitle>Delete team</DialogTitle>
    
                        <DialogContent>
                            <DialogContentText>Are you sure you want to delete the team? You will not be able to undo this</DialogContentText>
                        </DialogContent>
    
                        <DialogActions>
                            <Button onClick={this.onToggleShowEditPopup}>Cancel</Button>
                            <Button variant="outlined" color="error" type="delete" onClick={this.onDeleteTeam}>Delete</Button>
                        </DialogActions>
                    </Dialog>
                </React.Fragment>
            );
        }

        var IsEditing = !!+ShowEditPopup_Data.teamid;

        var Disabled = !ShowEditPopup_Data.teamname || !ShowEditPopup_Data.clubid;

        return (
            <React.Fragment>
                <Dialog
                    maxWidth="md"
                    fullWidth={true}
                    open={ShowEditPopup}
                    onClose={this.onToggleShowEditPopup}
                    PaperProps={{
                        component: 'form',
                        onSubmit: this.onInsertEditTeam
                    }}
                >
                    <DialogTitle>{IsEditing ? 'Edit' : 'Insert'} Team</DialogTitle>

                    <DialogContent>
                        <DialogContentText>{IsEditing ? 'Edit' : 'Insert'} the team details here</DialogContentText>
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="teamname"
                            name="teamname"
                            label="Team name"
                            type="text"
                            fullWidth
                            variant="standard"
                            onChange={this.onChangeName}
                            value={ShowEditPopup_Data.teamname}
                        />

                        <Box sx={{ height: 20 }} />

                        {this.renderAutocompleteList_Clubs()}
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={this.onToggleShowEditPopup}>Cancel</Button>
                        <Button variant="contained" color="primary" disabled={Disabled} type="submit">{IsEditing ? 'Edit' : 'Insert'}</Button>
                        {IsEditing && <Button variant="outlined" color="error" type="delete" onClick={this.onDeleteTeam_ShowWarning}>Delete team</Button>}
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
                    Add new team
                </Button>

                <Box sx={{ height: 20 }} />

                {this.renderTeamsTable()}

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

export default connect(mapStateToProps, { DeleteTeam, GetClubs, GetTeams, InsertEditTeam })(Teams);