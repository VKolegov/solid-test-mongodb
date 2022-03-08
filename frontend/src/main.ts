import {createApp} from "vue";

import Datepicker from "vue3-date-time-picker";
import "vue3-date-time-picker/dist/main.css";

import App from "./App.vue";

const app = createApp(App);

app.component("Datepicker", Datepicker);

app.mount("#app");
