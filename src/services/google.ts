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

export type DayEvents = { [start: string]: RegularEvent[] }
export type WeekEvents = { [date: string]: DayEvents }

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
    let cal_events: WeekEvents = {}
    let currentDay = new Date(start.toISOString());

    for (let event of events) {
        let e = RegularEvent.fromGoogle(event);
        // If next week, update currentMonday and currentSunday
        if (e.start.getDate() >= currentDay.getDate() + 1) {
            currentDay.setDate(currentDay.getDate() + 1);
        }
        // Get week from cal_events, or create it if it doesn't exist
        let week = cal_events[currentDay.toISOString()] || {};
        // Add event to week
        if (week[e.start.toISOString()]) {
            week[e.start.toISOString()].push(e);
        } else {
            week[e.start.toISOString()] = [e];
        }
        // Update cal_events
        cal_events[currentDay.toISOString()] = week;
    }
    return cal_events;
}
