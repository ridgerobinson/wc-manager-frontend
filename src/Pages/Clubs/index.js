import React from 'react';
import { connect } from 'react-redux';
import { DeleteClub, GetClubs, InsertEditClub } from '../../Services/Actions';

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
    { field: 'clubid', headerName: 'Id', width: 70 },
    { field: 'clubname', headerName: 'Club', flex: 1 }
];

const ShowEditPopup_Data_Init = { id: 0, clubname: '', delete_warning: false };

class Clubs extends React.Component {
    state = {
        Clubs: [],
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
        this.onLoadClubs({});
    }

    onChangeName = event => {
        var ShowEditPopup_Data = { ...this.state.ShowEditPopup_Data };
        ShowEditPopup_Data.clubname = event.target.value;
        this.setState({ ShowEditPopup_Data });
    }

    onDeleteClub = () => {
        this.props.DeleteClub({ ClubId: this.state.ShowEditPopup_Data.clubid }).then(() => {
            this.onToggleShowEditPopup({});
            this.onLoadClubs({});
        });
    }

    onDeleteClub_ShowWarning = () => {
        var ShowEditPopup_Data = { ...this.state.ShowEditPopup_Data };
        ShowEditPopup_Data.delete_warning = true;
        this.setState({ ShowEditPopup_Data });
    }

    onInsertEditClub = event => {
        event.preventDefault();

        var { clubid: ClubId, clubname: ClubName } = this.state.ShowEditPopup_Data;

        this.props.InsertEditClub({ ClubId, ClubName }).then(() => {
            this.onToggleShowEditPopup({});
            this.onLoadClubs({});
        });
    }

    onLoadClubs = ({ page: PageNo, pageSize: PageSize }) => {
        var { SearchName } = this.state;
        PageNo = PageNo !== undefined ? PageNo : this.state.PageNo;
        PageSize = PageSize !== undefined ? PageSize : this.state.PageSize;

        // if (Increment) PageNo++;

        this.setState({ PageNo, PageSize }, () => {
            PageNo++;

            this.props.GetClubs({ PageNo, PageSize, SearchName }).then(({ Clubs, IsMoreResults, TotalRecords }) => {
                this.setState({ Clubs, IsMoreResults, TotalRecords });
            });
        });
    }

    onToggleShowEditPopup = ({ ShowEditPopup = false, ShowEditPopup_Data = {} }) => {
        if (!!ShowEditPopup) ShowEditPopup_Data = { ...ShowEditPopup_Data_Init, ...ShowEditPopup_Data };

        this.setState({ ShowEditPopup, ShowEditPopup_Data });
    }

    renderClubsTable = () => {
        var { Clubs, PageNo, PageSize, TotalRecords } = this.state;

        return (
            <DataGrid
                autoHeight
                rows={Clubs}
                columns={columns}
                getRowId={row => row.clubid}
                loading={this.props.TryingGetData}
                pagination
                paginationMode="server"
                rowCount={TotalRecords}
                
                pageSize={PageSize}
                rowsPerPageOptions={[ 10, 20 ]}
                page={PageNo}
                onPageChange={page => this.onLoadClubs({ page })}
                onPageSizeChange={pageSize => this.onLoadClubs({ pageSize })}
                
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
                        <DialogTitle>Delete club</DialogTitle>
    
                        <DialogContent>
                            <DialogContentText>Are you sure you want to delete the club? You will not be able to undo this</DialogContentText>
                        </DialogContent>
    
                        <DialogActions>
                            <Button onClick={this.onToggleShowEditPopup}>Cancel</Button>
                            <Button variant="outlined" color="error" type="delete" onClick={this.onDeleteClub}>Delete</Button>
                        </DialogActions>
                    </Dialog>
                </React.Fragment>
            );
        }

        var IsEditing = !!+ShowEditPopup_Data.clubid;

        var Disabled = !ShowEditPopup_Data.clubname;

        return (
            <React.Fragment>
                <Dialog
                    maxWidth="md"
                    fullWidth={true}
                    open={ShowEditPopup}
                    onClose={this.onToggleShowEditPopup}
                    PaperProps={{
                        component: 'form',
                        onSubmit: this.onInsertEditClub
                    }}
                >
                    <DialogTitle>{IsEditing ? 'Edit' : 'Insert'} Club</DialogTitle>

                    <DialogContent>
                        <DialogContentText>{IsEditing ? 'Edit' : 'Insert'} the club details here</DialogContentText>
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="clubname"
                            name="clubname"
                            label="Club name"
                            type="text"
                            fullWidth
                            variant="standard"
                            onChange={this.onChangeName}
                            value={ShowEditPopup_Data.clubname}
                        />
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={this.onToggleShowEditPopup}>Cancel</Button>
                        <Button variant="contained" color="primary" disabled={Disabled} type="submit">{IsEditing ? 'Edit' : 'Insert'}</Button>
                        {IsEditing && <Button variant="outlined" color="error" type="delete" onClick={this.onDeleteClub_ShowWarning}>Delete club</Button>}
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
                    Add new club
                </Button>

                <Box
                    sx={{
                        height: 20
                    }}
                />

                {this.renderClubsTable()}

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

export default connect(mapStateToProps, { DeleteClub, GetClubs, InsertEditClub })(Clubs);