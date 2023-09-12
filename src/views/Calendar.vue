<script setup lang="ts">
import Day from "../components/Day.vue";
import { signIn } from "../services/auth";
import { EventList, Statuses, getEvents } from "../services/google";

let es = await getEvents("primary", new Date("2023-09-12T00:00:00-0400"), new Date("2023-09-13T00:00:00-0400"));
if (es == Statuses.UNAUTHORIZED) {
    await signIn();
}

</script>

<template>
    <div>
        <Day :day="new Date('2023-09-12T00:00:00-0400')" :events="(es as EventList)" />
    </div>
</template>
