import React from 'react';

import Box from '@mui/material/Box';

import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';

import AssistIcon from '@mui/icons-material/WavingHand';
import BaseIcon from '@mui/icons-material/AccessTime';
import GoalIcon from '@mui/icons-material/SportsSoccer';
import RedCardIcon from '@mui/icons-material/Report';
import YellowCardIcon from '@mui/icons-material/Flag';
// import WavingHandIcon from '@mui/icons-material/WavingHand';

class TimelineComponent extends React.Component {
    renderTimelineContent = ({ ParentMatchEventTypeId, Events }) => {
        // Goal
            if (+ParentMatchEventTypeId === 3) {
                return (
                    <div style={{ display: 'grid', gridGap: '10px' }}>
                        {
                            Events.map(({ MatchEventTypeId, PlayerName, GoalTypeId, GoalTypeName }, index) => {
                                return (
                                    <div key={index} style={{ display: 'flex' }}>
                                        {+MatchEventTypeId === 3 ? <GoalIcon /> : <AssistIcon />}
                                        <Box sx={{ width: 10 }} />
                                        <Typography>{PlayerName} {!!+GoalTypeId && `(${GoalTypeName})`}</Typography>
                                    </div>
                                );
                            })
                        }
                    </div>
                );
            }

            return null;
    }

    renderParentEventIcon = ParentMatchEventTypeId => {
        // Goal
            if (+ParentMatchEventTypeId === 3) return <GoalIcon />
        // Yellow Card
            else if (+ParentMatchEventTypeId === 1) return <YellowCardIcon />
        // Red Card
            else if (+ParentMatchEventTypeId === 2) return <RedCardIcon />
        
        // Base
            return <BaseIcon />
    }

    renderTimelineItem = (TimelineItemData, index) => {
        var { MatchEventId, ParentMatchEventTypeId, TimeOfGame, Events } = TimelineItemData;

        var First = index === 0;
        var Last = index === this.props.MatchStats.length - 1;

        return (
            <TimelineItem key={MatchEventId}>
                <TimelineOppositeContent
                    sx={{ m: 'auto 0' }}
                    align="right"
                    variant="body1"
                    color="text.primary"
                >
                    {`${TimeOfGame} min`}
                </TimelineOppositeContent>

                <TimelineSeparator>
                    {!First && <TimelineConnector />}

                    <TimelineDot color="primary" onClick={() => this.props.OnToggleShowEditMatchEvent(TimelineItemData)}>
                        {this.renderParentEventIcon(ParentMatchEventTypeId)}
                    </TimelineDot>

                    {!Last && <TimelineConnector />}
                </TimelineSeparator>

                <TimelineContent sx={{ py: '12px', px: 2 }}>
                    {this.renderTimelineContent({ ParentMatchEventTypeId, Events })}
                </TimelineContent>
            </TimelineItem>
        );
    }

    render() {
        var { MatchStats } = this.props;

        return (
            <Timeline>
                {MatchStats.map(this.renderTimelineItem)}
            </Timeline>
        );
    }
}

export default TimelineComponent;
