<script setup lang="ts">
import Event from "../components/Event.vue";
import { RegularEvent } from "../models/events";
import { DayEvents } from "../services/google";

const props = defineProps<{
    day: Date;
    events: DayEvents | undefined;
}>();

const HOUR_SIZE = 60;
const MILLI_SIZE = HOUR_SIZE / (60 * 60 * 1000);

let times: RegularEvent[][] = [];
let date = new Date(props.day.toISOString());
let ongoing: RegularEvent[] = [];
for (let i = 0; i < 24 * 4; i++) {
    date.setMinutes(date.getMinutes() + 15);
    let newOngoing: RegularEvent[] = [];
    for (let j = 0; j < ongoing.length; j++) {
        if (ongoing[j].end.getTime() > date.getTime()) {
            newOngoing.push(ongoing[j]);
        }
    }
    if (props.events && props.events[date.toISOString()]) {
        times.push(props.events[date.toISOString()]);
        for (let e of newOngoing) {
            e.overlapAfter += props.events[date.toISOString()].length;
        }
        for (let j = 0; j < props.events[date.toISOString()].length; j++) {
            let e = props.events[date.toISOString()][j];
            e.overlapBefore = Math.max(newOngoing.length + j, e.overlapBefore);
        }
        newOngoing.push(...props.events[date.toISOString()]);
    }
    ongoing = newOngoing;
}
</script>

<template>
    <div :style="{ height: (HOUR_SIZE * 24) + 'px', position: 'relative' }">
        <div v-for="time in times">
            <div v-for="event in time" :style="{
                height: (MILLI_SIZE * event.duration()) + 'px',
                width: event.width() + '%',
                position: 'absolute',
                top: (HOUR_SIZE * (event.start.getHours() + event.start.getMinutes() / 60)) + 'px',
                left: event.left_pos() + '%',
            }">
                <Event :event="event" />
            </div>
        </div>
    </div>
</template>
