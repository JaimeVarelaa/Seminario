import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Make A Wish',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
    },
  },
};

export default config;
