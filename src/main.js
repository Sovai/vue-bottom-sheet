import { createApp } from "vue";
import { createPinia } from "pinia";
import { MotionPlugin } from "@vueuse/motion";
import { GesturePlugin } from "@vueuse/gesture";
import "./assets/style.css";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(GesturePlugin);
app.use(MotionPlugin);
app.use(createPinia());
app.use(router);
app.mount("#app");
