import { Router, createRouter, createWebHistory } from "vue-router";
import Calendar from "./views/Calendar.vue";

const routes = [
    { path: "/", redirect: "/calendar" },
    { name: "calendar", path: "/calendar", component: Calendar }
]

export const router: Router = createRouter({
    history: createWebHistory(),
    routes,
})
