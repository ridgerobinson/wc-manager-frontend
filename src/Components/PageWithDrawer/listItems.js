import * as React from 'react';

import history from '../../history';

import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import CompetitionsIcon from '@mui/icons-material/EmojiEvents';
import ClubsIcon from '@mui/icons-material/Shield';
import EventsIcon from '@mui/icons-material/Event';
import LocationsIcon from '@mui/icons-material/Stadium';
import LogoutIcon from '@mui/icons-material/Logout';
import MatchesIcon from '@mui/icons-material/SportsSoccer';
import PlayersIcon from '@mui/icons-material/People';
import SeasonsIcon from '@mui/icons-material/DateRange';
import StatisticsIcon from '@mui/icons-material/BarChart';
import TeamsIcon from '@mui/icons-material/Groups';

export const mainListItems = (
  <React.Fragment>
    <ListItemButton onClick={() => history.push('/competitions')}>
      <ListItemIcon>
        <CompetitionsIcon />
      </ListItemIcon>
      <ListItemText primary="Competitions" />
    </ListItemButton>
    <ListItemButton onClick={() => history.push('/clubs')}>
      <ListItemIcon>
        <ClubsIcon />
      </ListItemIcon>
      <ListItemText primary="Clubs" />
    </ListItemButton>
    <ListItemButton onClick={() => history.push('/events')}>
      <ListItemIcon>
        <EventsIcon />
      </ListItemIcon>
      <ListItemText primary="Events" />
    </ListItemButton>
    <ListItemButton onClick={() => history.push('/locations')}>
      <ListItemIcon>
        <LocationsIcon />
      </ListItemIcon>
      <ListItemText primary="Locations" />
    </ListItemButton>
    <ListItemButton onClick={() => history.push('/matches')}>
      <ListItemIcon>
        <MatchesIcon />
      </ListItemIcon>
      <ListItemText primary="Matches" />
    </ListItemButton>
    <ListItemButton onClick={() => history.push('/players')}>
      <ListItemIcon>
        <PlayersIcon />
      </ListItemIcon>
      <ListItemText primary="Players" />
    </ListItemButton>
    <ListItemButton onClick={() => history.push('/seasons')}>
      <ListItemIcon>
        <SeasonsIcon />
      </ListItemIcon>
      <ListItemText primary="Seasons" />
    </ListItemButton>
    <ListItemButton onClick={() => history.push('/statistics')}>
      <ListItemIcon>
        <StatisticsIcon />
      </ListItemIcon>
      <ListItemText primary="Statistics" />
    </ListItemButton>
    <ListItemButton onClick={() => history.push('/teams')}>
      <ListItemIcon>
        <TeamsIcon />
      </ListItemIcon>
      <ListItemText primary="Teams" />
    </ListItemButton>
    <ListItemButton onClick={() => history.push('/logout')}>
      <ListItemIcon>
        <LogoutIcon />
      </ListItemIcon>
      <ListItemText primary="Logout" />
    </ListItemButton>
  </React.Fragment>
);