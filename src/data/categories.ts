import hiddenGems from "@/assets/cat-hidden-gems.jpg";
import nature from "@/assets/cat-nature.jpg";
import mountains from "@/assets/cat-mountains.jpg";
import sea from "@/assets/cat-sea.jpg";
import culture from "@/assets/cat-culture.jpg";
import views from "@/assets/cat-views.jpg";
import photo from "@/assets/cat-photo.jpg";
import food from "@/assets/cat-food.jpg";

export type Category = {
  slug: string;
  name: string;
  count: number;
  image: string;
  alt: string;
};

export const categories: Category[] = [
  {
    slug: "hidden-gems",
    name: "Hidden Gems",
    count: 42,
    image: hiddenGems,
    alt: "Narrow cobbled lane between old stone houses in a Bulgarian village",
  },
  {
    slug: "nature",
    name: "Nature",
    count: 68,
    image: nature,
    alt: "Waterfall falling into a river inside a dense green forest",
  },
  {
    slug: "mountains",
    name: "Mountains",
    count: 55,
    image: mountains,
    alt: "Alpine lake surrounded by rocky mountain peaks",
  },
  {
    slug: "sea",
    name: "Sea",
    count: 34,
    image: sea,
    alt: "Turquoise Black Sea water beside limestone coastal cliffs",
  },
  {
    slug: "history-culture",
    name: "History & Culture",
    count: 47,
    image: culture,
    alt: "Stone fortress ruins with an old church tower in golden light",
  },
  {
    slug: "best-views",
    name: "Best Views",
    count: 29,
    image: views,
    alt: "Hiker standing on a rocky ledge above a hazy valley at sunrise",
  },
  {
    slug: "photo-spots",
    name: "Photo Spots",
    count: 31,
    image: photo,
    alt: "Photographer with a tripod shooting rock formations at sunset",
  },
  {
    slug: "food-wine",
    name: "Food & Wine",
    count: 23,
    image: food,
    alt: "Rustic wooden table with local food, grapes and red wine in a cellar",
  },
];
