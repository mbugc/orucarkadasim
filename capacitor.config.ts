import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.orucarkadasim.app",
  appName: "Oruç Arkadaşım",
  webDir: "out",
  server: {
    androidScheme: "https",
  },
};

export default config;
