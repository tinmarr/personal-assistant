export class RegularEvent {
    title: string = "";
    start: Date = new Date();
    end: Date = new Date();
    allDay: boolean = false;
    overlapBefore: number = 0;
    overlapAfter: number = 0;

    static timeFormat = new Intl.DateTimeFormat("en-US", { timeStyle: "short", hour12: false });

    constructor(title: string, start: Date, end: Date, allDay: boolean = false) {
        this.title = title;
        this.start = start;
        this.end = end;
        this.allDay = allDay;
    }

    duration() {
        return this.end.getTime() - this.start.getTime();
    }

    static fromGoogle(event: gapi.client.calendar.Event) {
        if (event.start.date && event.end.date) {
            return new RegularEvent(event.summary, new Date(event.start.date), new Date(event.end.date), true);
        }
        return new RegularEvent(event.summary, new Date(event.start.dateTime!), new Date(event.end.dateTime!));
    }
}
