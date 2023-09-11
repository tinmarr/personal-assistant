import { getSession } from "./auth";

const CALENDAR_BASE = "https://www.googleapis.com/calendar/v3";
let gapiInitialized = false;

export enum Statuses {
    OK = 200,
    UNAUTHORIZED = 401,
}

export const ensureGapi = async () => {
    if (gapiInitialized) return;
    gapi.load("client", async () => {
        await gapi.client.init({
            apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
            discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
        });
        gapiInitialized = true;
    });
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
    })
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
    })
    if (response.status == Statuses.UNAUTHORIZED) {
        return Statuses.UNAUTHORIZED;
    }
    return response.result as gapi.client.calendar.CalendarListEntry;
}
