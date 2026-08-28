import * as common from "./common";
import * as nav from "./nav";
import * as taxonomy from "./taxonomy";
import * as home from "./home";
import * as place from "./place";
import * as auth from "./auth";
import * as forms from "./forms";
import * as dashboard from "./dashboard";
import * as photos from "./photos";
import * as footer from "./footer";
import * as map from "./map";
import * as consent from "./consent";

export const enMessages = {
  ...common.en,
  ...nav.en,
  ...taxonomy.en,
  ...home.en,
  ...place.en,
  ...auth.en,
  ...forms.en,
  ...dashboard.en,
  ...photos.en,
  ...footer.en,
  ...map.en,
  ...consent.en,
};

export const bgMessages: Record<MessageKey, string> = {
  ...common.bg,
  ...nav.bg,
  ...taxonomy.bg,
  ...home.bg,
  ...place.bg,
  ...auth.bg,
  ...forms.bg,
  ...dashboard.bg,
  ...photos.bg,
  ...footer.bg,
  ...map.bg,
  ...consent.bg,
};

export type MessageKey = keyof typeof enMessages;

export const messages = { en: enMessages as Record<MessageKey, string>, bg: bgMessages };
