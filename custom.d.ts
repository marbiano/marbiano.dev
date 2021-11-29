import * as CSS from "csstype";

declare module "csstype" {
  interface Properties {
    [index: string]: any;
  }
}

declare const DATOCMS_API_TOKEN: string;
declare const DATOCMS_API_URL: string;
