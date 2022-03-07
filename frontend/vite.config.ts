import {fileURLToPath, URL} from "url";

import {defineConfig, loadEnv} from "vite";
import vue from "@vitejs/plugin-vue";

export default ({mode}) => {
    process.env = {...process.env, ...loadEnv(mode, process.cwd())};

    const PORT_ENV = process.env.VITE_FRONTEND_PORT;
    let PORT = 80;

    if (PORT_ENV) {
        PORT = parseInt(PORT_ENV);
    }

    // import.meta.env.VITE_NAME available here with: process.env.VITE_NAME
    // import.meta.env.VITE_PORT available here with: process.env.VITE_PORT

    return defineConfig({
        plugins: [vue()],

        resolve: {
            alias: {
                "@": fileURLToPath(new URL("./src", import.meta.url)),
            },
        },

        server: {
            port: PORT,
        },
    });
}
