import en from "@/i18n/en/en_US.json";
import pl from "@/i18n/pl/pl_PL.json";

type DefaultResources = typeof en | typeof pl;

declare module "i18next" {
  interface CustomTypeOptions {
    resources: {
      translation: DefaultResources;
    };
  }
}
