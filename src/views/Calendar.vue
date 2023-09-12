<script setup lang="ts">
import Day from "../components/Day.vue";
import { signIn } from "../services/auth";
import { EventList, Statuses, getEvents } from "../services/google";

let today = new Date();
today.setHours(0, 0, 0, 0)
let tomorrow = new Date(today.toISOString());
tomorrow.setDate(tomorrow.getDate() + 1);
let es = await getEvents("primary", today, tomorrow);
if (es == Statuses.UNAUTHORIZED) {
    await signIn();
}
</script>

<template>
    <div style="width:200px">
        <Day :day="today" :events="(es as EventList)" />
    </div>
</template>
