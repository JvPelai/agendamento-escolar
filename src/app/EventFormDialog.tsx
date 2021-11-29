import React, { useEffect, useRef, useState } from "react";
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
import {
  createEventEndpoint,
  deleteEventEndpoint,
  ICalendar,
  updateEventEndpoint,
} from "./backend";

export interface IEditingEvent {
  id?: number;
  date: string;
  time: string;
  desc: string;
  calendarId: number;
}

interface IEventFormProps {
  event: IEditingEvent | null;
  calendars: ICalendar[];
  onCancel: () => void;
  onSave: () => void;
}
interface IValidationErrors {
  [field: string]: string;
}

export function EventFormDialog(props: IEventFormProps) {
  const { event, calendars, onCancel, onSave } = props;
  const [eventData, setEventData] = useState<IEditingEvent | null>(event);
  const [errors, setErrors] = useState<IValidationErrors>({});
  const inputDate = useRef<HTMLInputElement | null>();
  const inputTime = useRef<HTMLInputElement | null>();
  const inputDesc = useRef<HTMLInputElement | null>();

  const isNew = !event?.id;
  useEffect(() => {
    setEventData(event);
  }, [event]);

  function validate(): boolean {
    if (eventData) {
      const currentErrors: IValidationErrors = {};
      if (!eventData.date) {
        currentErrors["date"] = "é preciso selecionar uma data válida";
        inputDate.current?.focus();
      }
      if (eventData.time.length <= 1) {
        currentErrors["time"] = "é preciso selecionar um horário válido";
        inputTime.current?.focus();
      }
      if (eventData.desc.length < 4) {
        currentErrors["desc"] = "A descrição é muito curta";
        inputDesc.current?.focus();
      }
      setErrors(currentErrors);
      return Object.keys(currentErrors).length === 0;
    }
    return false;
  }
  function saveEvent(e: React.FormEvent) {
    e.preventDefault();
    if (eventData) {
      if (validate()) {
        if (isNew) {
          createEventEndpoint(eventData).then(onSave);
          return;
        }
        updateEventEndpoint(eventData).then(onSave);
        return;
      }
    }
  }

  function deleteEvent() {
    if (eventData) {
      deleteEventEndpoint(eventData.id!).then(onSave);
    }
  }
  return (
    <div>
      <Dialog
        open={!!event}
        onClose={onCancel}
        aria-labelledby="form-dialog-title"
      >
        <form onSubmit={saveEvent}>
          <DialogTitle id="form-dialog-title">
            {isNew ? "Novo Evento" : "Editar Evento"}
          </DialogTitle>
          <DialogContent>
            {eventData && (
              <>
                <TextField
                  inputRef={inputDate}
                  type="date"
                  margin="normal"
                  label="Data"
                  value={eventData.date}
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) =>
                    setEventData({ ...eventData, date: e.target.value })
                  }
                  error={!!errors.date}
                  helperText={errors.date}
                  fullWidth
                />
                <TextField
                  inputRef={inputTime}
                  type="time"
                  margin="normal"
                  label="Hora"
                  value={eventData.time}
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) =>
                    setEventData({ ...eventData, time: e.target.value })
                  }
                  error={!!errors.time}
                  helperText={errors.time}
                  fullWidth
                />
                <TextField
                  inputRef={inputDesc}
                  autoFocus
                  margin="normal"
                  value={eventData.desc}
                  label="Descrição"
                  onChange={(e) =>
                    setEventData({ ...eventData, desc: e.target.value })
                  }
                  error={!!errors.desc}
                  helperText={errors.desc}
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
            <Button type="button" onClick={deleteEvent}>
              Excluir
            </Button>
            <Button type="button" onClick={onCancel}>
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
