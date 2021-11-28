import React from "react";
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

export interface IEditingEvent {
  id?: number;
  date: string;
  time?: string;
  desc: string;
  calendarId: number;
}

interface IEventFormProps {
  event: IEditingEvent | null;
  onClose: () => void;
}

export function EventFormDialog(props: IEventFormProps) {
  const { event, onClose } = props;
  return (
    <div>
      <Dialog
        open={!!event}
        onClose={onClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Novo Evento</DialogTitle>
        <DialogContent>
          <TextField
            type="date"
            margin="normal"
            label="Data"
            value={event?.date}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            type="time"
            margin="normal"
            label="Hora"
            value={event?.time}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            autoFocus
            margin="normal"
            value={event?.desc}
            label="Descrição"
            fullWidth
          />
          <FormControl margin="normal" fullWidth>
            <InputLabel id="select-calendar">Agenda</InputLabel>
            <Select labelId="select-calendar">
              <MenuItem value={1}>Pedagógico</MenuItem>
              <MenuItem value={2}>Administrativo</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button onClick={onClose} color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
