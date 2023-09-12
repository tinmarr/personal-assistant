<script setup lang="ts">
import { RegularEvent } from "../models/events";

defineProps<{
    event: RegularEvent;
}>();
</script>

<template>
    <v-sheet v-if="event" height="100%" color="blue" rounded class="py-1 px-2 d-flex flex-column" style="overflow: hidden;">
        <h4>{{ event.title }}</h4>
        <i>{{ RegularEvent.timeFormat.format(event.start) }}-{{ RegularEvent.timeFormat.format(event.end) }}</i>
    </v-sheet>
</template>
