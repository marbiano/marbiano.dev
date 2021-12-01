export {};

declare global {
  const DATOCMS_API_TOKEN: string;
  const DATOCMS_API_URL: string;
  const PAGEVIEWS: KVNamespace;
}

declare module "csstype" {
  interface Properties {
    [index: string]: any;
  }
}
