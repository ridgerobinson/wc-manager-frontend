import React from 'react';
import { connect } from 'react-redux';
import { DeletePlayer, GetPlayers, InsertEditPlayer } from '../../Services/Actions';
import history from '../../history';

import { DataGrid } from '@mui/x-data-grid';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';

import AddIcon from '@mui/icons-material/LibraryAdd';

const columns = [
    { field: 'playerid', headerName: 'Id', width: 70 },
    { field: 'playername', headerName: 'Player', flex: 2 },
    { field: 'playeremail', headerName: 'Email', flex: 1 },
    { field: 'playerphone', headerName: 'Phone', flex: 1 }
];

const ShowEditPopup_Data_Init = { id: 0, playeremail: '', playername: '', playerphone: '', delete_warning: false, matchingplayer_warning: false };

class Players extends React.Component {
    state = {
        Players: [],
        IsMoreResults: null,
        PageNo: 0,
        PageSize: 100,
        SearchName_Previous: '',
        SearchName: '',
        SkipCheck: 0,
        TotalRecords: 0,

        ShowEditPopup: false,
        ShowEditPopup_Data: {}
    }
    
    componentDidMount() {
        this.onLoadPlayers({});
    }

    onAddSameNamePlayer = () => {
        this.setState({ SkipCheck: 1 }, () => {
            this.onInsertEditPlayer();
        });
    }

    onChangeEmail = event => {
        var ShowEditPopup_Data = { ...this.state.ShowEditPopup_Data };
        ShowEditPopup_Data.playeremail = event.target.value;
        this.setState({ ShowEditPopup_Data });
    }

    onChangeName = event => {
        var ShowEditPopup_Data = { ...this.state.ShowEditPopup_Data };
        ShowEditPopup_Data.playername = event.target.value;
        this.setState({ ShowEditPopup_Data });
    }

    onChangeName_Search = event => {
        this.setState({ SearchName: event.target.value, SearchName_Previous: event.target.value }, () => this.onLoadPlayers({}));
    }

    onChangePhone = event => {
        var ShowEditPopup_Data = { ...this.state.ShowEditPopup_Data };
        ShowEditPopup_Data.playerphone = event.target.value;
        this.setState({ ShowEditPopup_Data });
    }

    onDeletePlayer = () => {
        this.props.DeletePlayer({ PlayerId: this.state.ShowEditPopup_Data.playerid }).then(() => {
            this.onToggleShowEditPopup({});
            this.onLoadPlayers({});
        });
    }

    onDeletePlayer_ShowWarning = () => {
        var ShowEditPopup_Data = { ...this.state.ShowEditPopup_Data };
        ShowEditPopup_Data.delete_warning = true;
        this.setState({ ShowEditPopup_Data });
    }

    onInsertEditPlayer = event => {
        event.preventDefault();

        var { playerid: PlayerId, playeremail: PlayerEmail, playername: PlayerName, playerphone: PlayerPhone } = this.state.ShowEditPopup_Data;
        var { SkipCheck } = this.state;

        this.props.InsertEditPlayer({ PlayerId, PlayerEmail, PlayerName, PlayerPhone, SkipCheck }).then(({ MatchingPlayer }) => {
            if (MatchingPlayer) this.onShowMatchingPlayerWarning();
            else {
                // this.onToggleShowEditPopup({});
                this.onResetPlayer();
                this.onLoadPlayers({});
            }
        });
    }

    onLoadPlayers = ({ page: PageNo, pageSize: PageSize }) => {
        var { SearchName } = this.state;
        PageNo = PageNo !== undefined ? PageNo : this.state.PageNo;
        PageSize = PageSize !== undefined ? PageSize : this.state.PageSize;

        // if (Increment) PageNo++;

        this.setState({ PageNo, PageSize }, () => {
            PageNo++;

            this.props.GetPlayers({ PageNo, PageSize, SearchName }).then(({ Players, IsMoreResults, TotalRecords }) => {
                this.setState({ Players, IsMoreResults, TotalRecords });
            });
        });
    }

    onResetPlayer = () => {
        var ShowEditPopup_Data = { ...ShowEditPopup_Data_Init };

        this.setState({ ShowEditPopup_Data, SkipCheck: 0 });
    }

    onShowMatchingPlayerWarning = () => {
        var ShowEditPopup_Data = { ...this.state.ShowEditPopup_Data, matchingplayer_warning: 1 };

        this.setState({ ShowEditPopup_Data });
    }

    onToggleShowEditPopup = ({ ShowEditPopup = false, ShowEditPopup_Data = {} }) => {
        if (!!ShowEditPopup) ShowEditPopup_Data = { ...ShowEditPopup_Data_Init, ...ShowEditPopup_Data };

        this.setState({ ShowEditPopup, ShowEditPopup_Data });
    }

    renderPlayersTable = () => {
        var { Players, PageNo, PageSize, TotalRecords } = this.state;

        return (
            <DataGrid
                autoHeight
                rows={Players}
                columns={columns}
                getRowId={row => row.playerid}
                loading={this.props.TryingGetData}
                pagination
                paginationMode="server"
                rowCount={TotalRecords}
                
                pageSize={PageSize}
                rowsPerPageOptions={[ 10, 20 ]}
                page={PageNo}
                onPageChange={page => this.onLoadPlayers({ page })}
                onPageSizeChange={pageSize => this.onLoadPlayers({ pageSize })}

                onRowClick={({ row }) => this.onToggleShowEditPopup({ ShowEditPopup: true, ShowEditPopup_Data: row })}
            />
        );
    }

    renderEditPopup = () => {
        var { ShowEditPopup, ShowEditPopup_Data } = this.state;

        if (!ShowEditPopup) return null;

        if (!!ShowEditPopup_Data.matchingplayer_warning) {
            return (
                <React.Fragment>
                    <Dialog
                        maxWidth="md"
                        fullWidth={true}
                        open={ShowEditPopup}
                        onClose={this.onResetPlayer}
                    >
                        <DialogTitle>Matching player</DialogTitle>
    
                        <DialogContent>
                            <DialogContentText>Are you sure you want to add the player? There is already a player with the same name</DialogContentText>
                        </DialogContent>
    
                        <DialogActions>
                            <Button onClick={this.onResetPlayer}>Cancel</Button>
                            <Button variant="outlined" color="error" type="delete" onClick={this.onAddSameNamePlayer}>Add</Button>
                        </DialogActions>
                    </Dialog>
                </React.Fragment>
            );
        }

        if (!!ShowEditPopup_Data.delete_warning) {
            return (
                <React.Fragment>
                    <Dialog
                        maxWidth="md"
                        fullWidth={true}
                        open={ShowEditPopup}
                        onClose={this.onToggleShowEditPopup}
                    >
                        <DialogTitle>Delete player</DialogTitle>
    
                        <DialogContent>
                            <DialogContentText>Are you sure you want to delete the player? You will not be able to undo this</DialogContentText>
                        </DialogContent>
    
                        <DialogActions>
                            <Button onClick={this.onToggleShowEditPopup}>Cancel</Button>
                            <Button variant="outlined" color="error" type="delete" onClick={this.onDeletePlayer}>Delete</Button>
                        </DialogActions>
                    </Dialog>
                </React.Fragment>
            );
        }

        var IsEditing = !!+ShowEditPopup_Data.playerid;

        var Disabled = !ShowEditPopup_Data.playername;

        return (
            <React.Fragment>
                <Dialog
                    maxWidth="md"
                    fullWidth={true}
                    open={ShowEditPopup}
                    onClose={this.onToggleShowEditPopup}
                    PaperProps={{
                        component: 'form',
                        onSubmit: this.onInsertEditPlayer
                    }}
                >
                    <DialogTitle>{IsEditing ? 'Edit' : 'Insert'} Player</DialogTitle>

                    {
                        !!IsEditing &&
                        <Link
                            component="button"
                            variant="body2"
                            onClick={() => history.push(`/players/${ShowEditPopup_Data.playerid}`)}
                        >
                            View player details
                        </Link>
                    }

                    {
                        !!IsEditing &&
                        <Link
                            component="button"
                            variant="body2"
                            onClick={() => window.open(`/players/${ShowEditPopup_Data.playerid}`, '_blank').focus()}
                        >
                            View player details in new tab
                        </Link>
                    }

                    <DialogContent>
                        <DialogContentText>{IsEditing ? 'Edit' : 'Insert'} the player details here</DialogContentText>
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="playername"
                            name="playername"
                            label="Player name"
                            type="text"
                            fullWidth
                            variant="standard"
                            onChange={this.onChangeName}
                            value={ShowEditPopup_Data.playername}
                        />

                        <TextField
                            margin="dense"
                            id="playeremail"
                            name="playeremail"
                            label="Player email"
                            type="email"
                            fullWidth
                            variant="standard"
                            onChange={this.onChangeEmail}
                            value={ShowEditPopup_Data.playeremail}
                        />

                        <TextField
                            margin="dense"
                            id="playerphone"
                            name="playerphone"
                            label="Player phone"
                            type="phone"
                            fullWidth
                            variant="standard"
                            onChange={this.onChangePhone}
                            value={ShowEditPopup_Data.playerphone}
                        />
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={this.onToggleShowEditPopup}>Cancel</Button>
                        <Button variant="contained" color="primary" disabled={Disabled} type="submit">{IsEditing ? 'Edit' : 'Insert'}</Button>
                        {IsEditing && <Button variant="outlined" color="error" type="delete" onClick={this.onDeletePlayer_ShowWarning}>Delete player</Button>}
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        );
    }

    renderSearchPlayer = () => {
        return (
            <>
                <TextField
                    label="Search by player name"
                    value={this.state.SearchName}
                    onChange={this.onChangeName_Search}
                />
            </>
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
                    Add new player
                </Button>

                <Box sx={{ height: 20 }} />

                {this.renderSearchPlayer()}

                <Box sx={{ height: 20 }} />

                {this.renderPlayersTable()}

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

export default connect(mapStateToProps, { DeletePlayer, GetPlayers, InsertEditPlayer })(Players);