import React, { Fragment, useCallback, useMemo } from 'react';
import dayjs from 'dayjs';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';

import timezone from 'dayjs/plugin/timezone'
dayjs.extend(timezone)

const djLocalizer = dayjsLocalizer(dayjs);

export default function CalendarComponent({ ...props }) {
    const { components, defaultDate, max, views } = useMemo(() => ({
        defaultDate: new Date(),
        views: [ 'month' ]
    }), []);

    const eventPropGetter = useCallback((event, start, end, isSelected) => ({
            ...(event.eventcolor && {
                style: {
                    backgroundColor: event.eventcolor
                }
            }),
        }),
    []);

    return (
        <Fragment>
            <div style={{ height: '600px' }}>
                <Calendar
                    components={components}
                    defaultDate={defaultDate}
                    events={props.CalendarEvents || []}
                    onRangeChange={props.OnRangeChange}
                    localizer={djLocalizer}
                    max={max}
                    showMultiDayTimes
                    step={60}
                    views={views}
                    eventPropGetter={eventPropGetter}
                    startAccessor="matchdate"
                    endAccessor="matchend"
                    titleAccessor="eventname"
                    selectable={true}
                    onSelectSlot={props.OnSelectSlot}
                    onSelectEvent={props.OnSelectEvent}
                />
            </div>
        </Fragment>
    )
}