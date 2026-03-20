import axios from 'axios';
import axiosInstance from "./axiosInterceptor";

import history from '../../history';
import { BASE_API } from '../../Config';

import {
    LOGOUT_USER,
    TRYING_LOGIN_USER, TRYING_LOGIN_USER_SUCCESS, TRYING_LOGIN_USER_ERROR,
    TRYING_GET_DATA, TRYING_GET_DATA_SUCCESS, TRYING_GET_DATA_ERROR
} from '../Types';

export const CheckLogin = () => async dispatch => {
    var Token = localStorage.getItem("accessToken");
  
    if (Token) {
        dispatch({ type: TRYING_LOGIN_USER });

        const response = await axiosInstance.get(`${BASE_API}users/profile`);

        if (response.data.Response === 1) {
            var { UserDetails } = response.data;

            dispatch({ type: TRYING_LOGIN_USER_SUCCESS, payload: UserDetails });
        } else {
            dispatch({ type: TRYING_LOGIN_USER_ERROR, payload: response.data.ErrorMessage });

            if (!response.data.IsTokenValid) LogoutUserFunc();
            // dispatch({ type: UPDATE_ERROR_MODAL_WARNING, payload: { ModalError: response.data.ErrorMessage } });
        }
    }
    else {
        dispatch({ type: LOGOUT_USER });
        history.push('/login');
    }
}

export const DeleteClub = ({ ClubId }) => async dispatch => {
    dispatch({ type: TRYING_GET_DATA });
  
    var data = { ClubId };
  
    const response = await axiosInstance.post(`${BASE_API}clubs/deleteClub`, { ...data }, { showSuccessToast: true });
  
    if (response.data.Response === 1) {        
        dispatch({ type: TRYING_GET_DATA_SUCCESS });
        
        return {};
    } else dispatch({ type: TRYING_GET_DATA_ERROR, payload: response.data.ErrorMessage });

    return {};
}

export const DeleteCompetition = ({ CompetitionId }) => async dispatch => {
    dispatch({ type: TRYING_GET_DATA });
  
    var data = { CompetitionId };
  
    const response = await axiosInstance.post(`${BASE_API}competitions/deleteCompetition`, { ...data }, { showSuccessToast: true });
  
    if (response.data.Response === 1) {        
        dispatch({ type: TRYING_GET_DATA_SUCCESS });
        
        return {};
    } else dispatch({ type: TRYING_GET_DATA_ERROR, payload: response.data.ErrorMessage });

    return {};
}

export const DeleteEvent = ({ EventId }) => async dispatch => {
    dispatch({ type: TRYING_GET_DATA });
  
    var data = { EventId };
  
    const response = await axiosInstance.post(`${BASE_API}events/deleteEvent`, { ...data }, { showSuccessToast: true });
  
    if (response.data.Response === 1) {        
        dispatch({ type: TRYING_GET_DATA_SUCCESS });
        
        return {};
    } else dispatch({ type: TRYING_GET_DATA_ERROR, payload: response.data.ErrorMessage });

    return {};
}

export const DeleteLocation = ({ LocationId }) => async dispatch => {
    dispatch({ type: TRYING_GET_DATA });
  
    var data = { LocationId };
  
    const response = await axiosInstance.post(`${BASE_API}locations/deleteLocation`, { ...data }, { showSuccessToast: true });
  
    if (response.data.Response === 1) {        
        dispatch({ type: TRYING_GET_DATA_SUCCESS });
        
        return {};
    } else dispatch({ type: TRYING_GET_DATA_ERROR, payload: response.data.ErrorMessage });

    return {};
}

export const DeleteMatch = ({ MatchId }) => async dispatch => {
    dispatch({ type: TRYING_GET_DATA });
  
    var data = { MatchId };
  
    const response = await axiosInstance.post(`${BASE_API}matches/deleteMatch`, { ...data }, { showSuccessToast: true });
  
    if (response.data.Response === 1) {        
        dispatch({ type: TRYING_GET_DATA_SUCCESS });
        
        return {};
    } else dispatch({ type: TRYING_GET_DATA_ERROR, payload: response.data.ErrorMessage });

    return {};
}

export const DeleteMatchEvent = ({ MatchEventId }) => async dispatch => {
    dispatch({ type: TRYING_GET_DATA });
  
    var data = { MatchEventId };
  
    const response = await axiosInstance.post(`${BASE_API}matches/deleteMatchEvent`, { ...data }, { showSuccessToast: true });
  
    if (response.data.Response === 1) {        
        dispatch({ type: TRYING_GET_DATA_SUCCESS });
        
        return {};
    } else dispatch({ type: TRYING_GET_DATA_ERROR, payload: response.data.ErrorMessage });

    return {};
}

export const DeletePlayer = ({ PlayerId }) => async dispatch => {
    dispatch({ type: TRYING_GET_DATA });
  
    var data = { PlayerId };
  
    const response = await axiosInstance.post(`${BASE_API}players/deletePlayer`, { ...data }, { showSuccessToast: true });
  
    if (response.data.Response === 1) {        
        dispatch({ type: TRYING_GET_DATA_SUCCESS });
        
        return {};
    } else dispatch({ type: TRYING_GET_DATA_ERROR, payload: response.data.ErrorMessage });

    return {};
}

export const DeleteSeason = ({ SeasonId }) => async dispatch => {
    dispatch({ type: TRYING_GET_DATA });
  
    var data = { SeasonId };
  
    const response = await axiosInstance.post(`${BASE_API}seasons/deleteSeason`, { ...data }, { showSuccessToast: true });
  
    if (response.data.Response === 1) {        
        dispatch({ type: TRYING_GET_DATA_SUCCESS });
        
        return {};
    } else dispatch({ type: TRYING_GET_DATA_ERROR, payload: response.data.ErrorMessage });

    return {};
}

export const DeleteTeam = ({ TeamId }) => async dispatch => {
    dispatch({ type: TRYING_GET_DATA });
  
    var data = { TeamId };
  
    const response = await axiosInstance.post(`${BASE_API}teams/deleteTeam`, { ...data }, { showSuccessToast: true });
  
    if (response.data.Response === 1) {        
        dispatch({ type: TRYING_GET_DATA_SUCCESS });
        
        return {};
    } else dispatch({ type: TRYING_GET_DATA_ERROR, payload: response.data.ErrorMessage });

    return {};
}

export const GetClubs = ({ GetAll = 0, PageNo, PageSize, SearchName }) => async dispatch => {
    dispatch({ type: TRYING_GET_DATA });
  
    var data = { GetAll, PageNo, PageSize, SearchName };
  
    const response = await axiosInstance.post(`${BASE_API}clubs/clubs`, { ...data });
  
    if (response.data.Response === 1) {
        var { Clubs, IsMoreResults, TotalRecords } = response.data;
        
        dispatch({ type: TRYING_GET_DATA_SUCCESS });
        
        return { Clubs, IsMoreResults, TotalRecords };
    } else dispatch({ type: TRYING_GET_DATA_ERROR, payload: response.data.ErrorMessage });

    return {};
}

export const GetColors = () => async dispatch => {
    dispatch({ type: TRYING_GET_DATA });
    
    const response = await axiosInstance.post(`${BASE_API}events/colors`, {});
  
    if (response.data.Response === 1) {
        var { Colors } = response.data;
        
        dispatch({ type: TRYING_GET_DATA_SUCCESS });
        
        return { Colors };
    } else dispatch({ type: TRYING_GET_DATA_ERROR, payload: response.data.ErrorMessage });

    return {};
}

export const GetCompetitions = ({ GetAll = 0, PageNo, PageSize, SearchName }) => async dispatch => {
    dispatch({ type: TRYING_GET_DATA });
  
    var data = { GetAll, PageNo, PageSize, SearchName };
  
    const response = await axiosInstance.post(`${BASE_API}competitions/competitions`, { ...data });
  
    if (response.data.Response === 1) {
        var { Competitions, IsMoreResults, TotalRecords } = response.data;
        
        dispatch({ type: TRYING_GET_DATA_SUCCESS });
        
        return { Competitions, IsMoreResults, TotalRecords };
    } else dispatch({ type: TRYING_GET_DATA_ERROR, payload: response.data.ErrorMessage });

    return {};
}

export const GetEvents = ({ CompetitionId, GetAll = 0, PageNo, PageSize, SearchName, SeasonId, TeamId }) => async dispatch => {
    dispatch({ type: TRYING_GET_DATA });
  
    var data = { CompetitionId, GetAll, PageNo, PageSize, SearchName, SeasonId, TeamId };
  
    const response = await axiosInstance.post(`${BASE_API}events/events`, { ...data });
  
    if (response.data.Response === 1) {
        var { Events, IsMoreResults, TotalRecords } = response.data;
        
        dispatch({ type: TRYING_GET_DATA_SUCCESS });
        
        return { Events, IsMoreResults, TotalRecords };
    } else dispatch({ type: TRYING_GET_DATA_ERROR, payload: response.data.ErrorMessage });

    return {};
}

export const GetGoalTypes = () => async dispatch => {
    dispatch({ type: TRYING_GET_DATA });

    var data = {};

    const response = await axiosInstance.post(`${BASE_API}matches/goaltypes`, { ...data });

    if (response.data.Response === 1) {
        var { GoalTypes, IsMoreResults, TotalRecords } = response.data;
        
        dispatch({ type: TRYING_GET_DATA_SUCCESS });
        
        return { GoalTypes, IsMoreResults, TotalRecords };
    } else dispatch({ type: TRYING_GET_DATA_ERROR, payload: response.data.ErrorMessage });

    return {};
}

export const GetLocations = ({ GetAll = 0, PageNo, PageSize, SearchName }) => async dispatch => {
    dispatch({ type: TRYING_GET_DATA });
  
    var data = { GetAll, PageNo, PageSize, SearchName };
  
    const response = await axiosInstance.post(`${BASE_API}locations/locations`, { ...data });
  
    if (response.data.Response === 1) {
        var { Locations, IsMoreResults, TotalRecords } = response.data;
        
        dispatch({ type: TRYING_GET_DATA_SUCCESS });
        
        return { Locations, IsMoreResults, TotalRecords };
    } else dispatch({ type: TRYING_GET_DATA_ERROR, payload: response.data.ErrorMessage });

    return {};
}

export const GetMatchDetails = ({ MatchId }) => async dispatch => {
    dispatch({ type: TRYING_GET_DATA });
  
    var data = { MatchId };
  
    const response = await axiosInstance.post(`${BASE_API}matches/match`, { ...data });
  
    if (response.data.Response === 1) {
        var { MatchDetails, MatchRoster, MatchStats } = response.data;
        
        dispatch({ type: TRYING_GET_DATA_SUCCESS });
        
        return { MatchDetails, MatchRoster, MatchStats };
    } else dispatch({ type: TRYING_GET_DATA_ERROR, payload: response.data.ErrorMessage });

    return {};
}

export const GetMatchEventTypes = () => async dispatch => {
    dispatch({ type: TRYING_GET_DATA });

    var data = {};

    const response = await axiosInstance.post(`${BASE_API}matches/matcheventtypes`, { ...data });

    if (response.data.Response === 1) {
        var { MatchEventTypes, IsMoreResults, TotalRecords } = response.data;
        
        dispatch({ type: TRYING_GET_DATA_SUCCESS });
        
        return { MatchEventTypes, IsMoreResults, TotalRecords };
    } else dispatch({ type: TRYING_GET_DATA_ERROR, payload: response.data.ErrorMessage });

    return {};
}

export const GetMatches = ({ CompetitionIds, DateRange, EndDate, EventIds, GetAll, OpponentIds, SeasonIds, StartDate, TeamIds, PageNo, PageSize }) => async dispatch => {
    dispatch({ type: TRYING_GET_DATA });
  
    var data = { CompetitionIds, DateRange, EndDate, EventIds, GetAll, OpponentIds, SeasonIds, StartDate, TeamIds, PageNo, PageSize };
  
    const response = await axiosInstance.post(`${BASE_API}matches/matches`, { ...data });
  
    if (response.data.Response === 1) {
        var { Matches, IsMoreResults, TotalRecords } = response.data;
        
        dispatch({ type: TRYING_GET_DATA_SUCCESS });
        
        return { Matches, IsMoreResults, TotalRecords };
    } else dispatch({ type: TRYING_GET_DATA_ERROR, payload: response.data.ErrorMessage });

    return {};
}

export const GetMatchStatuses = ({ GetAll = 0, PageNo, PageSize, SearchName }) => async dispatch => {
    dispatch({ type: TRYING_GET_DATA });
  
    var data = { GetAll, PageNo, PageSize, SearchName };
  
    const response = await axiosInstance.post(`${BASE_API}matches/matchstatuses`, { ...data });
  
    if (response.data.Response === 1) {
        var { MatchStatuses, IsMoreResults, TotalRecords } = response.data;
        
        dispatch({ type: TRYING_GET_DATA_SUCCESS });
        
        return { MatchStatuses, IsMoreResults, TotalRecords };
    } else dispatch({ type: TRYING_GET_DATA_ERROR, payload: response.data.ErrorMessage });

    return {};
}

export const GetMatchTypes = ({ GetAll = 0, PageNo, PageSize }) => async dispatch => {
    dispatch({ type: TRYING_GET_DATA });
  
    var data = { GetAll, PageNo, PageSize };
  
    const response = await axiosInstance.post(`${BASE_API}matches/matchtypes`, { ...data });
  
    if (response.data.Response === 1) {
        var { MatchTypes, IsMoreResults, TotalRecords } = response.data;
        
        dispatch({ type: TRYING_GET_DATA_SUCCESS });
        
        return { MatchTypes, IsMoreResults, TotalRecords };
    } else dispatch({ type: TRYING_GET_DATA_ERROR, payload: response.data.ErrorMessage });

    return {};
}

export const GetOverallStats = ({ CompetitionIds, EndDate, EventIds, HideFriendlies, OpponentIds, SeasonIds, StartDate, TeamIds }) => async dispatch => {
    dispatch({ type: TRYING_GET_DATA });
  
    var data = { CompetitionIds, EndDate, EventIds, HideFriendlies, OpponentIds, SeasonIds, StartDate, TeamIds };
  
    const response = await axiosInstance.post(`${BASE_API}stats/overallStats`, { ...data });
  
    if (response.data.Response === 1) {
        var { OverallStats, PlayerStats } = response.data;
        
        dispatch({ type: TRYING_GET_DATA_SUCCESS });
        
        return { OverallStats, PlayerStats };
    } else dispatch({ type: TRYING_GET_DATA_ERROR, payload: response.data.ErrorMessage });

    return {};
}

export const GetPlayerDetails = ({ PlayerId }) => async dispatch => {
    dispatch({ type: TRYING_GET_DATA });
  
    var data = { PlayerId };
  
    const response = await axiosInstance.post(`${BASE_API}players/player`, { ...data });
  
    if (response.data.Response === 1) {
        var { MatchStats, OverallStats, PlayerDetails } = response.data;
        
        dispatch({ type: TRYING_GET_DATA_SUCCESS });
        
        return { MatchStats, OverallStats, PlayerDetails };
    } else dispatch({ type: TRYING_GET_DATA_ERROR, payload: response.data.ErrorMessage });

    return {};
}

export const GetPlayers = ({ GetAll = 0, PageNo, PageSize, SearchName }) => async dispatch => {
    dispatch({ type: TRYING_GET_DATA });
  
    var data = { GetAll, PageNo, PageSize, SearchName };
  
    const response = await axiosInstance.post(`${BASE_API}players/players`, { ...data });
  
    if (response.data.Response === 1) {
        var { Players, IsMoreResults, TotalRecords } = response.data;
        
        dispatch({ type: TRYING_GET_DATA_SUCCESS });
        
        return { Players, IsMoreResults, TotalRecords };
    } else dispatch({ type: TRYING_GET_DATA_ERROR, payload: response.data.ErrorMessage });

    return {};
}

export const GetSeasons = ({ GetAll = 0, PageNo, PageSize, SearchName }) => async dispatch => {
    dispatch({ type: TRYING_GET_DATA });
  
    var data = { GetAll, PageNo, PageSize, SearchName };
  
    const response = await axiosInstance.post(`${BASE_API}seasons/seasons`, { ...data });
  
    if (response.data.Response === 1) {
        var { Seasons, IsMoreResults, TotalRecords } = response.data;
        
        dispatch({ type: TRYING_GET_DATA_SUCCESS });
        
        return { Seasons, IsMoreResults, TotalRecords };
    } else dispatch({ type: TRYING_GET_DATA_ERROR, payload: response.data.ErrorMessage });

    return {};
}

export const GetTeams = ({ GetAll = 0, MyClub = 0, PageNo, PageSize, SearchName }) => async dispatch => {
    dispatch({ type: TRYING_GET_DATA });
  
    var data = { GetAll, MyClub, PageNo, PageSize, SearchName };
  
    const response = await axiosInstance.post(`${BASE_API}teams/teams`, { ...data });
  
    if (response.data.Response === 1) {
        var { Teams, IsMoreResults, TotalRecords } = response.data;
        
        dispatch({ type: TRYING_GET_DATA_SUCCESS });
        
        return { Teams, IsMoreResults, TotalRecords };
    } else dispatch({ type: TRYING_GET_DATA_ERROR, payload: response.data.ErrorMessage });

    return {};
}

export const InsertEditClub = ({ ClubId, ClubName }) => async dispatch => {
    dispatch({ type: TRYING_GET_DATA });
  
    var data = { ClubId, ClubName };
  
    const response = await axiosInstance.post(`${BASE_API}clubs/insertEditClub`, { ...data }, { showSuccessToast: true });
  
    if (response.data.Response === 1) {
        var { Club } = response.data;
        
        dispatch({ type: TRYING_GET_DATA_SUCCESS });
        
        return { Club };
    } else dispatch({ type: TRYING_GET_DATA_ERROR, payload: response.data.ErrorMessage });

    return {};
}

export const InsertEditCompetition = ({ CompetitionId, CompetitionName }) => async dispatch => {
    dispatch({ type: TRYING_GET_DATA });
  
    var data = { CompetitionId, CompetitionName };
  
    const response = await axiosInstance.post(`${BASE_API}competitions/insertEditCompetition`, { ...data }, { showSuccessToast: true });
  
    if (response.data.Response === 1) {
        var { Competition } = response.data;
        
        dispatch({ type: TRYING_GET_DATA_SUCCESS });
        
        return { Competition };
    } else dispatch({ type: TRYING_GET_DATA_ERROR, payload: response.data.ErrorMessage });

    return {};
}

export const InsertEditEvent = ({ Color, CompetitionId, EventId, RosterLimit, SeasonId, TeamId }) => async dispatch => {
    dispatch({ type: TRYING_GET_DATA });
  
    var data = { Color, CompetitionId, EventId, RosterLimit, SeasonId, TeamId };
  
    const response = await axiosInstance.post(`${BASE_API}events/insertEditEvent`, { ...data }, { showSuccessToast: true });
  
    if (response.data.Response === 1) {
        var { Event } = response.data;
        
        dispatch({ type: TRYING_GET_DATA_SUCCESS });
        
        return { Event };
    } else dispatch({ type: TRYING_GET_DATA_ERROR, payload: response.data.ErrorMessage });

    return {};
}

export const InsertEditLocation = ({ LocationId, LocationName }) => async dispatch => {
    dispatch({ type: TRYING_GET_DATA });
  
    var data = { LocationId, LocationName };
  
    const response = await axiosInstance.post(`${BASE_API}locations/insertEditLocation`, { ...data }, { showSuccessToast: true });
  
    if (response.data.Response === 1) {
        var { Location } = response.data;
        
        dispatch({ type: TRYING_GET_DATA_SUCCESS });
        
        return { Location };
    } else dispatch({ type: TRYING_GET_DATA_ERROR, payload: response.data.ErrorMessage });

    return {};
}

export const InsertEditMatch = ({ EventId, HomeAway, MatchDate, MatchId, MatchStatusId, MatchTypeId, LocationId, OpponentId, OpponentScore, TeamScore, TrackStarts }) => async dispatch => {
    dispatch({ type: TRYING_GET_DATA });
  
    var data = { EventId, HomeAway, MatchDate, MatchId, MatchStatusId, MatchTypeId, LocationId, OpponentId, OpponentScore, TeamScore, TrackStarts };
  
    const response = await axiosInstance.post(`${BASE_API}matches/insertEditMatch`, { ...data }, { showSuccessToast: true });
  
    if (response.data.Response === 1) {
        var { Match } = response.data;
        
        dispatch({ type: TRYING_GET_DATA_SUCCESS });
        
        return { Match };
    } else dispatch({ type: TRYING_GET_DATA_ERROR, payload: response.data.ErrorMessage });

    return {};
}

export const InsertEditMatchEvent = ({ MatchEventId, MatchEvents, MatchEventTypeId, MatchId, TimeOfGame }) => async dispatch => {
    dispatch({ type: TRYING_GET_DATA });
  
    var data = { MatchEventId, MatchEvents, MatchEventTypeId, MatchId, TimeOfGame };
  
    const response = await axiosInstance.post(`${BASE_API}matches/insertEditMatchEvent`, { ...data }, { showSuccessToast: true });
  
    if (response.data.Response === 1) {
        dispatch({ type: TRYING_GET_DATA_SUCCESS });
        
        return {};
    } else dispatch({ type: TRYING_GET_DATA_ERROR, payload: response.data.ErrorMessage });

    return {};
}

export const InsertEditMatchRoster = ({ MatchId, MatchRoster }) => async dispatch => {
    dispatch({ type: TRYING_GET_DATA });
  
    var data = { MatchId, MatchRoster };
  
    const response = await axiosInstance.post(`${BASE_API}matches/insertEditMatchRoster`, { ...data }, { showSuccessToast: true });
  
    if (response.data.Response === 1) {
        dispatch({ type: TRYING_GET_DATA_SUCCESS });
        
        return {};
    } else dispatch({ type: TRYING_GET_DATA_ERROR, payload: response.data.ErrorMessage });

    return {};
}

export const InsertEditPlayer = ({ PlayerId, PlayerEmail, PlayerName, PlayerPhone, SkipCheck }) => async dispatch => {
    dispatch({ type: TRYING_GET_DATA });
  
    var data = { PlayerId, PlayerEmail, PlayerName, PlayerPhone, SkipCheck };
  
    const response = await axiosInstance.post(`${BASE_API}players/insertEditPlayer`, { ...data }, { showSuccessToast: true });
  
    if (response.data.Response === 1) {
        var { MatchingPlayer, Player } = response.data;
        
        dispatch({ type: TRYING_GET_DATA_SUCCESS });
        
        return { MatchingPlayer, Player };
    } else dispatch({ type: TRYING_GET_DATA_ERROR, payload: response.data.ErrorMessage });

    return {};
}

export const InsertEditSeason = ({ SeasonId, SeasonName }) => async dispatch => {
    dispatch({ type: TRYING_GET_DATA });
  
    var data = { SeasonId, SeasonName };
  
    const response = await axiosInstance.post(`${BASE_API}seasons/insertEditSeason`, { ...data }, { showSuccessToast: true });
  
    if (response.data.Response === 1) {
        var { Season } = response.data;
        
        dispatch({ type: TRYING_GET_DATA_SUCCESS });
        
        return { Season };
    } else dispatch({ type: TRYING_GET_DATA_ERROR, payload: response.data.ErrorMessage });

    return {};
}

export const InsertEditTeam = ({ ClubId, TeamId, TeamName }) => async dispatch => {
    dispatch({ type: TRYING_GET_DATA });
  
    var data = { ClubId, TeamId, TeamName };
  
    const response = await axiosInstance.post(`${BASE_API}teams/insertEditTeam`, { ...data }, { showSuccessToast: true });
  
    if (response.data.Response === 1) {
        var { Team } = response.data;
        
        dispatch({ type: TRYING_GET_DATA_SUCCESS });
        
        return { Team };
    } else dispatch({ type: TRYING_GET_DATA_ERROR, payload: response.data.ErrorMessage });

    return {};
}

export const LoginUser = ({ Email, Password }) => async dispatch => {
    dispatch({ type: TRYING_LOGIN_USER });
  
    var data = { Email, Password };
  
    const response = await axios.post(`${BASE_API}auth/login`, { ...data });
  
    if (response.data.Response === 1) {
        var { accessToken, UserDetails } = response.data;
        
        localStorage.setItem("accessToken", accessToken);
        dispatch({ type: TRYING_LOGIN_USER_SUCCESS, payload: UserDetails });
    
        history.push('/statistics');
    } else dispatch({ type: TRYING_LOGIN_USER_ERROR, payload: response.data.ErrorMessage });
}

export const LogoutUser = () => async dispatch => {
    LogoutUserFunc();
    dispatch({ type: LOGOUT_USER });

    history.push('/login');
}

function LogoutUserFunc() {
    localStorage.clear();
}