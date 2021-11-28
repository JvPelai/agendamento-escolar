import {
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Icon,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import {
  getCalendarsEndpoint,
  getEventsEndpoint,
  ICalendar,
  IEvent,
} from "./backend";
import { addMonths, formatMonth } from "./dateFunctions";

const DAYS_OF_WEEK = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];

const useStyles = makeStyles({
  table: {
    minHeight: "100%",
    tableLayout: "fixed",
    borderTop: "1px solid rgb(224, 224, 224)",
    "& td ~ td, & th ~ th": {
      borderLeft: "1px solid rgb(224, 224, 224)",
    },
    "& td": {
      verticalAlign: "top",
      overflow: "hidden",
      padding: "8px 4px",
    },
  },
  dayOfMonth: {
    fontWeight: 500,
    marginBottom: "4px",
  },
  event: {
    display: "flex",
    alignItems: "center",
    background: "none",
    border: "none",
    cursor: "pointer",
    textAlign: "left",
    whiteSpace: "nowrap",
    margin: "4px 0",
  },
  eventBackground: {
    display: "inline-block",
    color: "white",
    padding: "2px 4px",
    borderRadius: "4px",
  },
});

type IEventWithCalendar = IEvent & { calendar: ICalendar };
interface ICalendarCell {
  date: string;
  dayOfMonth: number;
  events: IEventWithCalendar[];
}

function generateCalendar(
  date: string,
  allEvents: IEvent[],
  calendars: ICalendar[],
  calendarsSelected: boolean[]
): ICalendarCell[][] {
  const weeks: ICalendarCell[][] = [];
  const jsDate = new Date(date + "T12:00:00");
  const currentMonth = jsDate.getMonth();

  const currentDay = new Date(jsDate.valueOf());
  currentDay.setDate(1);
  const dayOfWeek = currentDay.getDay();
  currentDay.setDate(1 - dayOfWeek);

  do {
    const week: ICalendarCell[] = [];
    for (let i = 0; i < DAYS_OF_WEEK.length; i++) {
      const monthStr = (currentDay.getMonth() + 1).toString().padStart(2, "0");
      const dayStr = currentDay.getDate().toString().padStart(2, "0");
      const isoDate = `${currentDay.getFullYear()}-${monthStr}-${dayStr}`;

      const events: IEventWithCalendar[] = [];
      for (const event of allEvents) {
        if (event.date === isoDate) {
          const calIndex = calendars.findIndex(
            (cal) => cal.id === event.calendarId
          );
          if (calendarsSelected[calIndex]) {
            events.push({ ...event, calendar: calendars[calIndex] });
          }
        }
      }

      week.push({
        date: isoDate,
        dayOfMonth: currentDay.getDate(),
        events,
      });
      currentDay.setDate(currentDay.getDate() + 1);
    }
    weeks.push(week);
  } while (currentDay.getMonth() === currentMonth);
  return weeks;
}

export function CalendarScreen() {
  const { month } = useParams<{ month: string }>();
  const classes = useStyles();
  const [events, setEvents] = useState<IEvent[]>([]);
  const [calendars, setCalendars] = useState<ICalendar[]>([]);
  const [calendarsSelected, setCalendarsSelected] = useState<boolean[]>([]);
  const weeks = generateCalendar(
    month + "-01",
    events,
    calendars,
    calendarsSelected
  );

  const firstDate = weeks[0][0].date;
  const lastDate = weeks[weeks.length - 1][6].date;

  useEffect(() => {
    Promise.all([
      getCalendarsEndpoint(),

      getEventsEndpoint(firstDate, lastDate),
    ]).then(([calendars, events]) => {
      setCalendarsSelected(calendars.map(() => true));
      setCalendars(calendars);
      setEvents(events);
    });
  }, [firstDate, lastDate]);

  function toggleCalendar(i: number) {
    const newValue = [...calendarsSelected];
    newValue[i] = !newValue[i];
    setCalendarsSelected(newValue);
  }
  return (
    <Box display="flex" height="100%" alignItems="stretch">
      <Box
        borderRight="1px solid rgb(224, 224, 224)"
        width="15em"
        padding="8px 14px"
      >
        <h2>Agendamento Escolar</h2>
        <Button variant="contained" color="primary">
          Novo Evento
        </Button>
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
      </Box>
      <Box flex="1" display="flex" flexDirection="column">
        <Box display="flex" alignItems="center" padding="8px 16px">
          <Box>
            <IconButton
              aria-label="anterior"
              component={Link}
              to={`/calendar/${addMonths(month, -1)}`}
            >
              <Icon>chevron_left</Icon>
            </IconButton>
            <IconButton
              aria-label="próximo"
              component={Link}
              to={`/calendar/${addMonths(month, 1)}`}
            >
              <Icon>chevron_right</Icon>
            </IconButton>
          </Box>
          <Box flex="1" marginLeft="16px" component="h3">
            {formatMonth(month)}
          </Box>
          <IconButton>
            <Avatar>
              <Icon>person</Icon>
            </Avatar>
          </IconButton>
        </Box>
        <TableContainer style={{ flex: "1" }} component={"div"}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                {DAYS_OF_WEEK.map((day) => (
                  <TableCell align="center" key={day}>
                    {day}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {weeks.map((week, i) => (
                <TableRow key={i}>
                  {week.map((cell) => (
                    <TableCell align="center" key={cell.date}>
                      <div className={classes.dayOfMonth}>
                        {cell.dayOfMonth}
                      </div>
                      {cell.events.map((event) => {
                        const color = event.calendar.color;
                        return (
                          <button key={event.id} className={classes.event}>
                            {event.time && (
                              <>
                                <Icon style={{ color }} fontSize="inherit">
                                  watch_later
                                </Icon>

                                <Box component="span" margin="0 4px">
                                  {event.time}
                                </Box>
                              </>
                            )}
                            {event.time ? (
                              <span>{event.desc}</span>
                            ) : (
                              <div
                                className={classes.eventBackground}
                                style={{ backgroundColor: color }}
                              >
                                {event.desc}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
