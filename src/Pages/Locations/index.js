import React from 'react';
import { connect } from 'react-redux';
import { DeleteLocation, GetLocations, InsertEditLocation } from '../../Services/Actions';

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
    { field: 'locationid', headerName: 'Id', width: 70 },
    { field: 'locationname', headerName: 'Location', flex: 1 }
];

const ShowEditPopup_Data_Init = { id: 0, locationname: '', delete_warning: false };

class Locations extends React.Component {
    state = {
        Locations: [],
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
        this.onLoadLocations({});
    }

    onChangeName = event => {
        var ShowEditPopup_Data = { ...this.state.ShowEditPopup_Data };
        ShowEditPopup_Data.locationname = event.target.value;
        this.setState({ ShowEditPopup_Data });
    }

    onDeleteLocation = () => {
        this.props.DeleteLocation({ LocationId: this.state.ShowEditPopup_Data.locationid }).then(() => {
            this.onToggleShowEditPopup({});
            this.onLoadLocations({});
        });
    }

    onDeleteLocation_ShowWarning = () => {
        var ShowEditPopup_Data = { ...this.state.ShowEditPopup_Data };
        ShowEditPopup_Data.delete_warning = true;
        this.setState({ ShowEditPopup_Data });
    }

    onInsertEditLocation = event => {
        event.preventDefault();

        var { locationid: LocationId, locationname: LocationName } = this.state.ShowEditPopup_Data;

        this.props.InsertEditLocation({ LocationId, LocationName }).then(() => {
            this.onToggleShowEditPopup({});
            this.onLoadLocations({});
        });
    }

    onLoadLocations = ({ page: PageNo, pageSize: PageSize }) => {
        var { SearchName } = this.state;
        PageNo = PageNo !== undefined ? PageNo : this.state.PageNo;
        PageSize = PageSize !== undefined ? PageSize : this.state.PageSize;

        // if (Increment) PageNo++;

        this.setState({ PageNo, PageSize }, () => {
            PageNo++;

            this.props.GetLocations({ PageNo, PageSize, SearchName }).then(({ Locations, IsMoreResults, TotalRecords }) => {
                this.setState({ Locations, IsMoreResults, TotalRecords });
            });
        });
    }

    onToggleShowEditPopup = ({ ShowEditPopup = false, ShowEditPopup_Data = {} }) => {
        if (!!ShowEditPopup) ShowEditPopup_Data = { ...ShowEditPopup_Data_Init, ...ShowEditPopup_Data };

        this.setState({ ShowEditPopup, ShowEditPopup_Data });
    }

    renderLocationsTable = () => {
        var { Locations, PageNo, PageSize, TotalRecords } = this.state;

        return (
            <DataGrid
                autoHeight
                rows={Locations}
                columns={columns}
                getRowId={row => row.locationid}
                loading={this.props.TryingGetData}
                pagination
                paginationMode="server"
                rowCount={TotalRecords}
                
                pageSize={PageSize}
                rowsPerPageOptions={[ 10, 20 ]}
                page={PageNo}
                onPageChange={page => this.onLoadLocations({ page })}
                onPageSizeChange={pageSize => this.onLoadLocations({ pageSize })}

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
                        <DialogTitle>Delete location</DialogTitle>
    
                        <DialogContent>
                            <DialogContentText>Are you sure you want to delete the location? You will not be able to undo this</DialogContentText>
                        </DialogContent>
    
                        <DialogActions>
                            <Button onClick={this.onToggleShowEditPopup}>Cancel</Button>
                            <Button variant="outlined" color="error" type="delete" onClick={this.onDeleteLocation}>Delete</Button>
                        </DialogActions>
                    </Dialog>
                </React.Fragment>
            );
        }

        var IsEditing = !!+ShowEditPopup_Data.locationid;

        var Disabled = !ShowEditPopup_Data.locationname;

        return (
            <React.Fragment>
                <Dialog
                    maxWidth="md"
                    fullWidth={true}
                    open={ShowEditPopup}
                    onClose={this.onToggleShowEditPopup}
                    PaperProps={{
                        component: 'form',
                        onSubmit: this.onInsertEditLocation
                    }}
                >
                    <DialogTitle>{IsEditing ? 'Edit' : 'Insert'} Location</DialogTitle>

                    <DialogContent>
                        <DialogContentText>{IsEditing ? 'Edit' : 'Insert'} the location details here</DialogContentText>
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="locationname"
                            name="locationname"
                            label="Location name"
                            type="text"
                            fullWidth
                            variant="standard"
                            onChange={this.onChangeName}
                            value={ShowEditPopup_Data.locationname}
                        />
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={this.onToggleShowEditPopup}>Cancel</Button>
                        <Button variant="contained" color="primary" disabled={Disabled} type="submit">{IsEditing ? 'Edit' : 'Insert'}</Button>
                        {IsEditing && <Button variant="outlined" color="error" type="delete" onClick={this.onDeleteLocation_ShowWarning}>Delete location</Button>}
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
                    Add new location
                </Button>

                <Box
                    sx={{
                        height: 20
                    }}
                />

                {this.renderLocationsTable()}

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

export default connect(mapStateToProps, { DeleteLocation, GetLocations, InsertEditLocation })(Locations);