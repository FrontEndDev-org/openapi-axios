declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // package name
      PKG_NAME: string;

      // package version
      PKG_VERSION: string;
    }
  }
}

export {};
