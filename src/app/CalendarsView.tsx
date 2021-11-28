import { Box, Checkbox, FormControlLabel } from "@material-ui/core";

import { ICalendar } from "./backend";

interface ICalendarsViewProps {
  calendars: ICalendar[];
  toggleCalendar: (i: number) => void;
  calendarsSelected: boolean[];
}

export function CalendarsView(props: ICalendarsViewProps) {
  const { calendars, toggleCalendar, calendarsSelected } = props;
  return (
    <Box marginTop="64px">
      <h3>Agendas</h3>
      {calendars.map((calendar, i) => (
        <FormControlLabel
          key={calendar.id}
          control={
            <Checkbox
              style={{ color: calendar.color }}
              checked={calendarsSelected[i]}
              onChange={() => toggleCalendar(i)}
            />
          }
          label={calendar.name}
        />
      ))}
    </Box>
  );
}
