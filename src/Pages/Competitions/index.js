import React from 'react';
import { connect } from 'react-redux';
import { DeleteCompetition, GetCompetitions, InsertEditCompetition } from '../../Services/Actions';

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
    { field: 'competitionid', headerName: 'Id', width: 70 },
    { field: 'competitionname', headerName: 'Competition', flex: 1 }
];

const ShowEditPopup_Data_Init = { id: 0, competitionname: '', delete_warning: false };

class Competitions extends React.Component {
    state = {
        Competitions: [],
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
        this.onLoadCompetitions({});
    }

    onChangeName = event => {
        var ShowEditPopup_Data = { ...this.state.ShowEditPopup_Data };
        ShowEditPopup_Data.competitionname = event.target.value;
        this.setState({ ShowEditPopup_Data });
    }

    onDeleteCompetition = () => {
        this.props.DeleteCompetition({ CompetitionId: this.state.ShowEditPopup_Data.competitionid }).then(() => {
            this.onToggleShowEditPopup({});
            this.onLoadCompetitions({});
        });
    }

    onDeleteCompetition_ShowWarning = () => {
        var ShowEditPopup_Data = { ...this.state.ShowEditPopup_Data };
        ShowEditPopup_Data.delete_warning = true;
        this.setState({ ShowEditPopup_Data });
    }

    onInsertEditCompetition = event => {
        event.preventDefault();

        var { competitionid: CompetitionId, competitionname: CompetitionName } = this.state.ShowEditPopup_Data;

        this.props.InsertEditCompetition({ CompetitionId, CompetitionName }).then(() => {
            this.onToggleShowEditPopup({});
            this.onLoadCompetitions({});
        });
    }

    onLoadCompetitions = ({ page: PageNo, pageSize: PageSize }) => {
        var { SearchName } = this.state;
        PageNo = PageNo !== undefined ? PageNo : this.state.PageNo;
        PageSize = PageSize !== undefined ? PageSize : this.state.PageSize;

        // if (Increment) PageNo++;

        this.setState({ PageNo, PageSize }, () => {
            PageNo++;

            this.props.GetCompetitions({ PageNo, PageSize, SearchName }).then(({ Competitions, IsMoreResults, TotalRecords }) => {
                this.setState({ Competitions, IsMoreResults, TotalRecords });
            });
        });
    }

    onToggleShowEditPopup = ({ ShowEditPopup = false, ShowEditPopup_Data = {} }) => {
        if (!!ShowEditPopup) ShowEditPopup_Data = { ...ShowEditPopup_Data_Init, ...ShowEditPopup_Data };

        this.setState({ ShowEditPopup, ShowEditPopup_Data });
    }

    renderCompetitionsTable = () => {
        var { Competitions, PageNo, PageSize, TotalRecords } = this.state;

        return (
            <DataGrid
                autoHeight
                rows={Competitions}
                columns={columns}
                getRowId={row => row.competitionid}
                loading={this.props.TryingGetData}
                pagination
                paginationMode="server"
                rowCount={TotalRecords}
                
                pageSize={PageSize}
                rowsPerPageOptions={[ 10, 20 ]}
                page={PageNo}
                onPageChange={page => this.onLoadCompetitions({ page })}
                onPageSizeChange={pageSize => this.onLoadCompetitions({ pageSize })}

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
                        <DialogTitle>Delete competition</DialogTitle>
    
                        <DialogContent>
                            <DialogContentText>Are you sure you want to delete the competition? You will not be able to undo this</DialogContentText>
                        </DialogContent>
    
                        <DialogActions>
                            <Button onClick={this.onToggleShowEditPopup}>Cancel</Button>
                            <Button variant="outlined" color="error" type="delete" onClick={this.onDeleteCompetition}>Delete</Button>
                        </DialogActions>
                    </Dialog>
                </React.Fragment>
            );
        }

        var IsEditing = !!+ShowEditPopup_Data.competitionid;

        var Disabled = !ShowEditPopup_Data.competitionname;

        return (
            <React.Fragment>
                <Dialog
                    maxWidth="md"
                    fullWidth={true}
                    open={ShowEditPopup}
                    onClose={this.onToggleShowEditPopup}
                    PaperProps={{
                        component: 'form',
                        onSubmit: this.onInsertEditCompetition
                    }}
                >
                    <DialogTitle>{IsEditing ? 'Edit' : 'Insert'} Competition</DialogTitle>

                    <DialogContent>
                        <DialogContentText>{IsEditing ? 'Edit' : 'Insert'} the competition details here</DialogContentText>
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="competitionname"
                            name="competitionname"
                            label="Competition name"
                            type="text"
                            fullWidth
                            variant="standard"
                            onChange={this.onChangeName}
                            value={ShowEditPopup_Data.competitionname}
                        />
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={this.onToggleShowEditPopup}>Cancel</Button>
                        <Button variant="contained" color="primary" disabled={Disabled} type="submit">{IsEditing ? 'Edit' : 'Insert'}</Button>
                        {IsEditing && <Button variant="outlined" color="error" type="delete" onClick={this.onDeleteCompetition_ShowWarning}>Delete competition</Button>}
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
                    Add new competition
                </Button>

                <Box
                    sx={{
                        height: 20
                    }}
                />

                {this.renderCompetitionsTable()}

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

export default connect(mapStateToProps, { DeleteCompetition, GetCompetitions, InsertEditCompetition })(Competitions);