declare module 'process' {
  interface ProcessEnv {
    // package name
    PKG_NAME: string;

    // package version
    PKG_VERSION: string;
  }
}
