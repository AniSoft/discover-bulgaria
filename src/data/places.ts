import tyulenovo from "@/assets/place-tyulenovo.jpg";
import kovachevitsa from "@/assets/place-kovachevitsa.jpg";
import devilsBridge from "@/assets/place-devils-bridge.jpg";
import belogradchik from "@/assets/place-belogradchik.jpg";
import shirokaLaka from "@/assets/place-shiroka-laka.jpg";
import beglikTash from "@/assets/place-beglik-tash.jpg";

export type Place = {
  slug: string;
  name: string;
  region: string;
  category: string;
  description: string;
  practical: string;
  image: string;
  alt: string;
};

export const featuredPlaces: Place[] = [
  {
    slug: "tyulenovo-cliffs",
    name: "Tyulenovo Cliffs",
    region: "Dobrich Province",
    category: "Sea",
    description:
      "Sun-bleached rock arches and sea caves where the Black Sea turns an improbable shade of blue.",
    practical: "Free · 2-3 h",
    image: tyulenovo,
    alt: "Aerial view of red sea cliffs and a rock arch above deep blue water",
  },
  {
    slug: "kovachevitsa",
    name: "Kovachevitsa",
    region: "Rhodope Mountains",
    category: "Hidden Gems",
    description:
      "A preserved stone village of timber balconies and slate roofs, still without a single traffic light.",
    practical: "Free · Half day",
    image: kovachevitsa,
    alt: "Stone village houses with slate roofs on an autumn forested hillside",
  },
  {
    slug: "devils-bridge",
    name: "Devil's Bridge",
    region: "Ardino, Rhodopes",
    category: "History & Culture",
    description:
      "An Ottoman-era arch spanning the Arda gorge, wrapped in morning mist and older legends.",
    practical: "Free · 1-2 h",
    image: devilsBridge,
    alt: "Old stone arch bridge crossing a misty river gorge",
  },
  {
    slug: "belogradchik-rocks",
    name: "Belogradchik Rocks",
    region: "Vidin Province",
    category: "Best Views",
    description:
      "Towering sandstone pillars that swallow a medieval fortress and glow deep red at sunset.",
    practical: "8 lv · 2-3 h",
    image: belogradchik,
    alt: "Red sandstone rock formations glowing at sunset above green forest",
  },
  {
    slug: "shiroka-laka",
    name: "Shiroka Laka",
    region: "Smolyan Province",
    category: "Food & Wine",
    description:
      "Whitewashed Rhodope houses, bagpipe schools and slow winter meals beside a mountain river.",
    practical: "Free · 3-4 h",
    image: shirokaLaka,
    alt: "White Rhodope village houses with dark wooden balconies in winter",
  },
  {
    slug: "beglik-tash",
    name: "Beglik Tash",
    region: "Primorsko, Strandzha",
    category: "Photo Spots",
    description:
      "A Thracian rock sanctuary hidden in oak forest a short walk from the sea, best at first light.",
    practical: "5 lv · 1-2 h",
    image: beglikTash,
    alt: "Megalithic stone sanctuary surrounded by oak forest in morning light",
  },
];
