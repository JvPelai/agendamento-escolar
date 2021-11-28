export interface ICalendar {
  id: number;
  name: string;
  color: string;
}

export interface IEvent {
  id: number;
  date: string;
  time?: string;
  desc: string;
  calendarId: number;
}

export async function getCalendarsEndpoint(): Promise<ICalendar[]> {
  return fetch(`https://arcane-shore-50736.herokuapp.com/calendars`).then((resp) => {
    return resp.json();
  });
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
