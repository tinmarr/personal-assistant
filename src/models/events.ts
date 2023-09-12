export class RegularEvent {
    title: string = "";
    start: Date = new Date();
    end: Date = new Date();
    location?: string;
    allDay: boolean = false;
    overlapBefore: number = 0;
    overlapAfter: number = 0;

    static timeFormat = new Intl.DateTimeFormat("en-US", { timeStyle: "short", hour12: false });

    constructor(title: string, start: Date, end: Date, allDay: boolean = false, location?: string) {
        this.title = title;
        this.start = start;
        this.end = end;
        this.allDay = allDay;
        this.location = location;
    }

    duration() {
        return this.end.getTime() - this.start.getTime();
    }

    left_pos() {
        if (this.allDay) return 0;
        return this.overlapBefore * 20;
    }

    width() {
        if (this.allDay || this.overlapAfter + this.overlapBefore == 0) return 100;
        return 100 - (this.overlapBefore * 20) - (this.overlapAfter * 10);
    }

    static fromGoogle(event: gapi.client.calendar.Event) {
        if (event.start.date && event.end.date) {
            return new RegularEvent(event.summary, new Date(event.start.date), new Date(event.end.date), true, event.location);
        }
        return new RegularEvent(event.summary, new Date(event.start.dateTime!), new Date(event.end.dateTime!), false, event.location);
    }
}
