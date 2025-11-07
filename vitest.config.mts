import { configDefaults, defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default defineConfig((configEnv) => {
  return mergeConfig(
    // @ts-expect-error testing
    viteConfig({ ...configEnv, excludeCrx: true }),
    defineConfig({
      test: {
        alias: {
          "@/": new URL("./src/", import.meta.url).pathname,
        },
        projects: [
          {
            test: {
              browser: {
                enabled: true,
                instances: [{ browser: "chromium" }],
                provider: "playwright",
              },
              exclude: [...configDefaults.exclude],
            },
          },
        ],
      },
    }),
  );
});
