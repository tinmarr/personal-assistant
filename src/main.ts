import { createApp } from "vue";
import App from "./App.vue";

// Vuetify
import "material-design-icons-iconfont/dist/material-design-icons.css";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, md } from "vuetify/iconsets/md";
import "vuetify/styles";

// Custom styles
import { router } from "./router";
import "./styles.css";

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: "md",
        aliases,
        sets: {
            md,
        },
    }
})

createApp(App).use(vuetify).use(router).mount("#app");
