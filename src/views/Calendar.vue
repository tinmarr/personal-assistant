<script setup lang="ts">
import Day from "../components/Day.vue";
import { signIn } from "../services/auth";
import { Statuses, WeekEvents, getEvents } from "../services/google";

// Get monday of the week
let monday = new Date();
monday.setHours(0, 0, 0, 0)
monday.setDate(monday.getDate() - monday.getDay() + 1);
// Enumerate days of the week
let days: Date[] = [];
for (let i = 0; i < 7; i++) {
    let d = new Date(monday.toISOString());
    d.setDate(d.getDate() + i);
    days.push(d);
}


let es = await getEvents("primary", days[0], days[6]);

if (es == Statuses.UNAUTHORIZED) {
    await signIn();
}
</script>

<template>
    <div class="d-flex">
        <div v-for="day in days" style="width:200px">
            <Day :day="day" :events="(es as WeekEvents)[day.toISOString()]" />
        </div>
    </div>
</template>
