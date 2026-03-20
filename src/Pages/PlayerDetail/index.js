import React from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import history from '../../history';
import { GetPlayerDetails } from '../../Services/Actions';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { DataGrid } from '@mui/x-data-grid';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const TIMEZONE = 'America/New_York';

const MatchStatsTable_columns = [
    { field: 'eventname', headerName: 'Event', flex: 3 },
    { field: 'matchdate', headerName: 'Match Date', flex: 2,
        valueFormatter: params => {
            // Check if value is valid to avoid errors
            if (!params.value) return '';
            return dayjs(params.value).tz(TIMEZONE).format('YYYY/MM/DD hh:mm A');
        }
    },
    { field: 'opponentname', headerName: 'Opponent', flex: 2 },
    { field: 'locationname', headerName: 'Location', flex: 2 },
    { field: 'score', headerName: 'Score', flex: 1 },
    { field: 'matchresult', headerName: 'Result', flex: 1 },
    { field: 'goals', headerName: 'Goals', flex: 1 },
    { field: 'assists', headerName: 'Assists', flex: 1 },
    {
        field: 'starter', headerName: 'Started', flex: 1,
        valueGetter: params => !!params.row.trackstarts ? params.row.starter : 'n/a'
    },
    { field: 'captain', headerName: 'Captain', flex: 1 },
    { field: 'mom', headerName: 'MOM', flex: 1 }
];

const playerStatsColumns = [
    { field: 'gamesplayed', headerName: 'Games', flex: 1 },
    { field: 'goals', headerName: 'Goals', flex: 1 },
    { field: 'assists', headerName: 'Assists', flex: 1 },
    { field: 'goalcontributions', headerName: 'GC', flex: 1 },
    { field: 'goalcontributionspg', headerName: 'GC PG', flex: 1 },
    { field: 'moms', headerName: 'MOM', flex: 1 },
    { field: 'captains', headerName: 'Capt', flex: 1 }
];

function PlayerDetailWrapper(props) {
    const params = useParams();
    return <PlayerDetail PlayerId={params.PlayerId} {...props} />;
}

class PlayerDetail extends React.Component {
    state = {
        Loading: true,

        MatchStats: [],
        OverallStats: [],
        PlayerDetails: {}
    }
    
    componentDidMount() {
        var { PlayerId } = this.props;
        PlayerId = +PlayerId;

        if (!PlayerId) history.push('/players');

        this.onLoadPlayerDetails();
    }

    onLoadPlayerDetails = () => {
        var { PlayerId } = this.props;
        PlayerId = +PlayerId;

        this.setState({ Loading: true }, () => {
            this.props.GetPlayerDetails({ PlayerId }).then(({ MatchStats, OverallStats, PlayerDetails }) => {
                this.setState({ Loading: false, MatchStats, OverallStats, PlayerDetails });
            });
        });
    }

    renderLoading = () => {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    renderMatchStats = () => {
        return (
            <DataGrid
                autoHeight
                rows={this.state.MatchStats}
                columns={MatchStatsTable_columns}
                getRowId={row => row.matchid}
                // loading={this.props.TryingGetData}
                // pagination
                // paginationMode="server"
                // rowCount={TotalRecords}

                // pageSize={PageSize}
                // rowsPerPageOptions={[ 10, 20 ]}
                // page={PageNo}
                // onPageChange={page => this.onLoadPastMatches({ page })}
                // onPageSizeChange={pageSize => this.onLoadPastMatches({ pageSize })}

                onRowClick={({ row }) => window.open(`/matches/${row.matchid}`, '_blank').focus()}
            />
        );
    }

    renderOverallStats = () => {
        return (
            <DataGrid
                autoHeight
                rows={this.state.OverallStats}
                columns={playerStatsColumns}
                getRowId={row => row.playerid}
                loading={this.props.TryingGetData}
                hideFooterPagination
            />
        );
    }

    render() {
        if (this.state.Loading) return this.renderLoading();

        return (
            <>
                <pre>{JSON.stringify(this.state.PlayerDetails, null, 2)}</pre>

                <Box sx={{ height: 20 }} />

                {this.renderOverallStats()}

                <Box sx={{ height: 20 }} />

                {this.renderMatchStats()}
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

export default connect(mapStateToProps, { GetPlayerDetails })(PlayerDetailWrapper);