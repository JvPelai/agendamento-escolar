import { IEditingEvent } from "./EventFormDialog";

export interface ICalendar {
  id: number;
  name: string;
  color: string;
}

export interface IEvent {
  id?: number;
  date: string;
  time: string;
  desc: string;
  calendarId: number;
}

export async function getCalendarsEndpoint(): Promise<ICalendar[]> {
  return fetch(`https://arcane-shore-50736.herokuapp.com/calendars`).then(
    (resp) => {
      return resp.json();
    }
  );
}

export async function getEventsEndpoint(
  from: string,
  to: string
): Promise<IEvent[]> {
  return fetch(
    `https://arcane-shore-50736.herokuapp.com/appointments?date_gte=${from}&date_lte=${to}&_sort=date,time`
  ).then((resp) => {
    return resp.json();
  });
}

export async function createEventEndpoint(
  event: IEditingEvent
): Promise<IEvent> {
  return fetch(`https://arcane-shore-50736.herokuapp.com/appointments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  }).then((resp) => {
    return resp.json();
  });
}

export async function updateEventEndpoint(event: IEditingEvent): Promise<any> {
  return fetch(
    `https://arcane-shore-50736.herokuapp.com/appointments/${event.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    }
  ).then((resp) => {
    return resp.json();
  });
}

export async function deleteEventEndpoint(eventId: number): Promise<any> {
  return fetch(
    `https://arcane-shore-50736.herokuapp.com/appointments/${eventId}`,
    {
      method: "DELETE",
    }
  ).then((resp) => {
    return resp.json();
  });
}
