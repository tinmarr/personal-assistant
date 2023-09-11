<script setup lang="ts">
import { ref } from 'vue';
import { signIn } from "./services/auth";
import { ensureGapi, getCalendar, Statuses } from './services/google';

let temp = ref("waiting...");

ensureGapi();

const getData = async () => {
  let c = await getCalendar("primary")
  temp.value = JSON.stringify(c != Statuses.UNAUTHORIZED ? c : "No auth");
}

</script>

<template>
  <v-btn @click="signIn">sign in</v-btn>
  <v-btn @click="getData">get data</v-btn>
  <br>
  {{ temp }}
</template>
