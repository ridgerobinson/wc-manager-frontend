import React from 'react';
import { connect } from 'react-redux';
import { DeleteSeason, GetSeasons, InsertEditSeason } from '../../Services/Actions';

import { DataGrid } from '@mui/x-data-grid';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

import AddIcon from '@mui/icons-material/LibraryAdd';

const columns = [
    { field: 'seasonid', headerName: 'Id', width: 70 },
    { field: 'seasonname', headerName: 'Season', flex: 1 }
];

const ShowEditPopup_Data_Init = { id: 0, seasonname: '', delete_warning: false };

class Seasons extends React.Component {
    state = {
        Seasons: [],
        IsMoreResults: null,
        PageNo: 0,
        PageSize: 10,
        SearchName_Previous: '',
        SearchName: '',
        TotalRecords: 0,

        ShowEditPopup: false,
        ShowEditPopup_Data: {}
    }
    
    componentDidMount() {
        this.onLoadSeasons({});
    }

    onChangeName = event => {
        var ShowEditPopup_Data = { ...this.state.ShowEditPopup_Data };
        ShowEditPopup_Data.seasonname = event.target.value;
        this.setState({ ShowEditPopup_Data });
    }

    onDeleteSeason = () => {
        this.props.DeleteSeason({ SeasonId: this.state.ShowEditPopup_Data.seasonid }).then(() => {
            this.onToggleShowEditPopup({});
            this.onLoadSeasons({});
        });
    }

    onDeleteSeason_ShowWarning = () => {
        var ShowEditPopup_Data = { ...this.state.ShowEditPopup_Data };
        ShowEditPopup_Data.delete_warning = true;
        this.setState({ ShowEditPopup_Data });
    }

    onInsertEditSeason = event => {
        event.preventDefault();

        var { seasonid: SeasonId, seasonname: SeasonName } = this.state.ShowEditPopup_Data;

        this.props.InsertEditSeason({ SeasonId, SeasonName }).then(() => {
            this.onToggleShowEditPopup({});
            this.onLoadSeasons({});
        });
    }

    onLoadSeasons = ({ page: PageNo, pageSize: PageSize }) => {
        var { SearchName } = this.state;
        PageNo = PageNo !== undefined ? PageNo : this.state.PageNo;
        PageSize = PageSize !== undefined ? PageSize : this.state.PageSize;

        // if (Increment) PageNo++;

        this.setState({ PageNo, PageSize }, () => {
            PageNo++;

            this.props.GetSeasons({ PageNo, PageSize, SearchName }).then(({ Seasons, IsMoreResults, TotalRecords }) => {
                this.setState({ Seasons, IsMoreResults, TotalRecords });
            });
        });
    }

    onToggleShowEditPopup = ({ ShowEditPopup = false, ShowEditPopup_Data = {} }) => {
        if (!!ShowEditPopup) ShowEditPopup_Data = { ...ShowEditPopup_Data_Init, ...ShowEditPopup_Data };

        this.setState({ ShowEditPopup, ShowEditPopup_Data });
    }

    renderSeasonsTable = () => {
        var { Seasons, PageNo, PageSize, TotalRecords } = this.state;

        return (
            <DataGrid
                autoHeight
                rows={Seasons}
                columns={columns}
                getRowId={row => row.seasonid}
                loading={this.props.TryingGetData}
                pagination
                paginationMode="server"
                rowCount={TotalRecords}
                
                pageSize={PageSize}
                rowsPerPageOptions={[ 10, 20 ]}
                page={PageNo}
                onPageChange={page => this.onLoadSeasons({ page })}
                onPageSizeChange={pageSize => this.onLoadSeasons({ pageSize })}

                onRowClick={({ row }) => this.onToggleShowEditPopup({ ShowEditPopup: true, ShowEditPopup_Data: row })}
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
                        <DialogTitle>Delete season</DialogTitle>
    
                        <DialogContent>
                            <DialogContentText>Are you sure you want to delete the season? You will not be able to undo this</DialogContentText>
                        </DialogContent>
    
                        <DialogActions>
                            <Button onClick={this.onToggleShowEditPopup}>Cancel</Button>
                            <Button variant="outlined" color="error" type="delete" onClick={this.onDeleteSeason}>Delete</Button>
                        </DialogActions>
                    </Dialog>
                </React.Fragment>
            );
        }

        var IsEditing = !!+ShowEditPopup_Data.seasonid;

        var Disabled = !ShowEditPopup_Data.seasonname;

        return (
            <React.Fragment>
                <Dialog
                    maxWidth="md"
                    fullWidth={true}
                    open={ShowEditPopup}
                    onClose={this.onToggleShowEditPopup}
                    PaperProps={{
                        component: 'form',
                        onSubmit: this.onInsertEditSeason
                    }}
                >
                    <DialogTitle>{IsEditing ? 'Edit' : 'Insert'} Season</DialogTitle>

                    <DialogContent>
                        <DialogContentText>{IsEditing ? 'Edit' : 'Insert'} the season details here</DialogContentText>
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="seasonname"
                            name="seasonname"
                            label="Season name"
                            type="text"
                            fullWidth
                            variant="standard"
                            onChange={this.onChangeName}
                            value={ShowEditPopup_Data.seasonname}
                        />
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={this.onToggleShowEditPopup}>Cancel</Button>
                        <Button variant="contained" color="primary" disabled={Disabled} type="submit">{IsEditing ? 'Edit' : 'Insert'}</Button>
                        {IsEditing && <Button variant="outlined" color="error" type="delete" onClick={this.onDeleteSeason_ShowWarning}>Delete season</Button>}
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
                    Add new season
                </Button>

                <Box
                    sx={{
                        height: 20
                    }}
                />

                {this.renderSeasonsTable()}

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

export default connect(mapStateToProps, { DeleteSeason, GetSeasons, InsertEditSeason })(Seasons);