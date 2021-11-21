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

const DAYS_OF_WEEK = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];

const useStyles = makeStyles({
  root: {
    height: "100%",
  },
  table: {
    minHeight: "100%",
    borderTop: "1px solid rgb(224, 224, 224)",
    "& td ~ td, & th ~ th": {
      borderLeft: "1px solid rgb(224, 224, 224)",
    },
  },
});

interface ICalendarCell {
  date: string;
}

function generateCalendar(date: string): ICalendarCell[][] {
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
      week.push({ date: isoDate });
      currentDay.setDate(currentDay.getDate() + 1);
    }
    weeks.push(week);
  } while (currentDay.getMonth() === currentMonth);
  return weeks;
}

function getToday() {
  return "2021-11-21";
}

export function CalendarScreen() {
  const classes = useStyles();
  const weeks = generateCalendar(getToday());
  return (
    <Box display="flex" height="100%" alignItems="stretch">
      <Box
        borderRight="1px solid rgb(224, 224, 224)"
        width="16em"
        padding="8px 16px"
      >
        <h2>Agendamento Escolar</h2>
        <Button variant="contained" color="primary">
          Novo Evento
        </Button>
        <Box marginTop="64px">
          <h3>Agendas</h3>

          <FormControlLabel control={<Checkbox />} label="Pedagógico" />
          <FormControlLabel control={<Checkbox />} label="Administrativo" />
        </Box>
      </Box>
      <TableContainer className={classes.root} component={"div"}>
        <Box display="flex" alignItems="center">
          <Box flex="1">
            <IconButton aria-label="anterior">
              <Icon>chevron_left</Icon>
            </IconButton>
            <IconButton aria-label="próximo">
              <Icon>chevron_right</Icon>
            </IconButton>
          </Box>
          <Box flex="1" marginLeft="16px" component="h3">
            Novembro de 2021
          </Box>
          <IconButton>
            <Avatar>
              <Icon>person</Icon>
            </Avatar>
          </IconButton>
        </Box>
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
                    {cell.date}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
