import "./bootstrap";
import "../css/app.css";

import { createApp, h } from "vue";
import { createInertiaApp } from "@inertiajs/inertia-vue3";
import { InertiaProgress } from "@inertiajs/progress";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { ZiggyVue } from "../../vendor/tightenco/ziggy/dist/vue.m";
import VueGoogleMaps from "@fawmi/vue-google-maps";

const appName =
    window.document.getElementsByTagName("title")[0]?.innerText || "Laravel";
const googleMapApi = import.meta.env.VITE_GOOGLE_MAP_API;

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.vue`,
            import.meta.glob("./Pages/**/*.vue")
        ),
    setup({ el, app, props, plugin }) {
        return createApp({ render: () => h(app, props) })
            .use(plugin)
            .use(ZiggyVue, Ziggy)
            .use(VueGoogleMaps, {
                load: {
                    key: googleMapApi,
                },
            })
            .mount(el);
    },
});

InertiaProgress.init({ color: "#4B5563" });
