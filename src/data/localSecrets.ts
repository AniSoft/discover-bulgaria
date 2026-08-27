export type LocalizedString = {
  en: string;
  bg: string;
};

export type LocalSecret = {
  id: string;
  title: LocalizedString;
  text: LocalizedString;
  location: LocalizedString;
};

export const localSecrets: LocalSecret[] = [
  {
    id: "tyulenovo",
    title: {
      en: "Explore the coast beyond the main viewpoint",
      bg: "Разгледай брега отвъд основната гледка",
    },
    text: {
      en: "Look for the natural Rock Bridge near Tyulenovo and explore the coastline from more than one viewpoint. Stay on safe ground and keep a safe distance from the cliff edges.",
      bg: "Потърси естествения Скалния мост край Тюленово и разгледай крайбрежието от повече от една гледна точка. Стой на безопасно място и пази дистанция от ръба на скалите.",
    },
    location: {
      en: "Tyulenovo · Black Sea Coast",
      bg: "Тюленово · Черноморие",
    },
  },
  {
    id: "shiroka-laka",
    title: {
      en: "Leave the main road behind",
      bg: "Отклони се от главния път",
    },
    text: {
      en: "Walk through the quieter cobbled lanes on both sides of the river. Some of the most atmospheric views reveal traditional houses, stone roofs and old bridges away from the main road.",
      bg: "Разходи се по по-тихите калдъръмени улици от двете страни на реката. Някои от най-красивите гледки към традиционните къщи, каменните покриви и старите мостове са далеч от главния път.",
    },
    location: {
      en: "Shiroka Laka · Rhodopes",
      bg: "Широка лъка · Родопи",
    },
  },
  {
    id: "belogradchik",
    title: {
      en: "Change your point of view",
      bg: "Погледни скалите от различен ъгъл",
    },
    text: {
      en: "Do not stop at the first viewpoint. The shapes and scale of the Belogradchik Rocks change dramatically when seen from different positions around the town.",
      bg: "Не спирай само на първата панорамна площадка. Формите и мащабът на Белоградчишките скали изглеждат съвсем различно от различните гледни точки около града.",
    },
    location: {
      en: "Belogradchik · Northwest Bulgaria",
      bg: "Белоградчик · Северозападна България",
    },
  },
];
