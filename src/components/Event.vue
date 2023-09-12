<script setup lang="ts">
import { onMounted, ref } from "vue";
import { RegularEvent } from "../models/events";

defineProps<{
    event: RegularEvent;
}>();

const sheet = ref()
const sheetHeight = ref(0)

onMounted(() => {
    sheetHeight.value = (sheet.value.$el as HTMLDivElement).clientHeight
})
</script>

<template>
    <v-sheet v-if="event" ref="sheet" height="100%" color="blue" rounded border class="py-1 px-2 d-flex text-truncate"
        :class="{ 'flex-column': sheetHeight > 60 }" style="border-color: white;">
        <h4>{{ event.title }}</h4>
        <div v-if="sheetHeight > 60">
            <p><i>{{ RegularEvent.timeFormat.format(event.start) }}-{{ RegularEvent.timeFormat.format(event.end) }}</i></p>
            <p><i><v-icon icon="location_pin" />{{ event.location }}</i></p>
        </div>
        <i v-else-if="sheetHeight > 15">, {{ RegularEvent.timeFormat.format(event.start) }}</i>
    </v-sheet>
</template>
