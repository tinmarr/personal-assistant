import { RegularEvent } from "../models/events";
import { getSession } from "./auth";

const CALENDAR_BASE = "https://www.googleapis.com/calendar/v3";
let gapiInitialized = false;
let gapiInitializing = false;

export enum Statuses {
    OK = 200,
    UNAUTHORIZED = 401,
}

export const ensureGapi = async () => {
    if (gapiInitialized || gapiInitializing) return;
    gapiInitializing = true;
    gapi.load("client", async () => {
        await gapi.client.init({
            apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
            discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
        });
        gapiInitialized = true;
        gapiInitializing = false;
    });
    return new Promise((resolve) => {
        const interval = setInterval(() => {
            if (gapiInitialized) {
                clearInterval(interval);
                resolve(undefined);
            }
        }, 100);
    })
}

const getAuth = async () => {
    let session = await getSession();
    if (!session || !session.provider_token) return;
    return {
        "access_token": session.provider_token,
    }
}

export const getCalendarList = async () => {
    await ensureGapi();
    let response = await gapi.client.request({
        path: `${CALENDAR_BASE}/users/me/calendarList`,
        method: "GET",
        params: await getAuth()
    });
    if (response.status == Statuses.UNAUTHORIZED) {
        return Statuses.UNAUTHORIZED;
    }
    return response.result.items as gapi.client.calendar.CalendarListEntry[];
}

export const getCalendar = async (id: string) => {
    await ensureGapi();
    let response = await gapi.client.request({
        path: `${CALENDAR_BASE}/calendars/${id}`,
        method: "GET",
        params: await getAuth()
    });
    if (response.status == Statuses.UNAUTHORIZED) {
        return Statuses.UNAUTHORIZED;
    }
    return response.result as gapi.client.calendar.CalendarListEntry;
}

export type EventList = { [start: string]: RegularEvent[] }

export const getEvents = async (cal_id: string, start: Date, end: Date) => {
    let auth = await getAuth();
    if (!auth) return Statuses.UNAUTHORIZED;
    await ensureGapi();

    let response = await gapi.client.request({
        path: `${CALENDAR_BASE}/calendars/${cal_id}/events`,
        method: "GET",
        params: { timeMin: start.toISOString(), timeMax: end.toISOString(), orderBy: "startTime", singleEvents: true, ...auth },
    });

    if (response.status == Statuses.UNAUTHORIZED) {
        return Statuses.UNAUTHORIZED;
    }

    let events = response.result.items as gapi.client.calendar.Event[];
    let cal_events: EventList = {}
    for (let event of events) {
        let e = RegularEvent.fromGoogle(event);
        if (cal_events[e.start.toISOString()]) {
            cal_events[e.start.toISOString()].push(e);
        } else {
            cal_events[e.start.toISOString()] = [e];
        }
    }
    return cal_events;
}
