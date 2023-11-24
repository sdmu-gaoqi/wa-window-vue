/// <reference types="vite/client" />
declare module "quill";

declare module "*.vue" {
  import type { DefineComponent } from "vue";

  const component: DefineComponent<{}, {}, any>;
  export default component;
}
