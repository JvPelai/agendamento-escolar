import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import { createEventEndpoint, ICalendar } from "./backend";

export interface IEditingEvent {
  id?: number;
  date: string;
  time?: string;
  desc: string;
  calendarId: number;
}

interface IEventFormProps {
  event: IEditingEvent | null;
  calendars: ICalendar[];
  onClose: () => void;
}

export function EventFormDialog(props: IEventFormProps) {
  const { event, calendars, onClose } = props;
  const [eventData, setEventData] = useState<IEditingEvent | null>(event);
  useEffect(() => {
    setEventData(event);
  }, [event]);

  function saveEvent(e: React.FormEvent) {
    e.preventDefault();
    if (eventData) {
      createEventEndpoint(eventData).then(onClose);
    }
  }
  return (
    <div>
      <Dialog
        open={!!event}
        onClose={onClose}
        aria-labelledby="form-dialog-title"
      >
        <form onSubmit={saveEvent}>
          <DialogTitle id="form-dialog-title">Novo Evento</DialogTitle>
          <DialogContent>
            {eventData && (
              <>
                <TextField
                  type="date"
                  margin="normal"
                  label="Data"
                  value={eventData.date}
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) =>
                    setEventData({ ...eventData, date: e.target.value })
                  }
                  fullWidth
                />
                <TextField
                  type="time"
                  margin="normal"
                  label="Hora"
                  value={eventData.time}
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) =>
                    setEventData({ ...eventData, time: e.target.value })
                  }
                  fullWidth
                />
                <TextField
                  autoFocus
                  margin="normal"
                  value={eventData.desc}
                  label="Descrição"
                  onChange={(e) =>
                    setEventData({ ...eventData, desc: e.target.value })
                  }
                  fullWidth
                />
                <FormControl margin="normal" fullWidth>
                  <InputLabel id="select-calendar">Agenda</InputLabel>
                  <Select
                    labelId="select-calendar"
                    value={eventData.calendarId}
                    onChange={(e) =>
                      setEventData({
                        ...eventData,
                        calendarId: e.target.value as number,
                      })
                    }
                  >
                    {calendars.map((calendar) => (
                      <MenuItem key={calendar.id} value={calendar.id}>
                        {calendar.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" color="primary">
              Salvar
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
