# Bulgaria Uncovered

I want to create a modern travel discovery web application called "Discover Bulgaria".

The purpose of the app is to help people discover interesting, beautiful and lesser-known places across Bulgaria. Later, registered users will be able to submit their own places and administrators will review and publish them.

For now, create ONLY the frontend foundation and visual structure of the application.

Do NOT connect Supabase yet.

Do NOT implement authentication yet.

Do NOT create a database yet.

Do NOT implement admin functionality yet.

Do NOT implement AI functionality yet.

I want to build the application step-by-step.

TECHNOLOGIES

Use:

- React

- TypeScript

- Vite

- Tailwind CSS

- Lucide React icons

Use a clean, modular component structure with reusable components and minimal dependencies.

DESIGN DIRECTION

Style:

Modern Travel Editorial + Nature Premium.

The application should feel:

- modern

- premium

- natural

- authentic

- adventurous

- elegant

- spacious

- highly visual

The photography should be the main visual element.

Avoid:

- heavy gradients

- glassmorphism

- excessive shadows

- excessive animations

- traditional folklore styling

- Bulgarian flag colors as the main palette

- outdated tourism portal styling

COLOR SYSTEM

Use these design tokens consistently:

Primary / Deep Forest:

#18392B

Primary Hover:

#10291F

Background / Warm Ivory:

#F7F5F0

Cards / Surface:

#FFFFFF

Secondary / Warm Sand:

#E8DFCF

Accent / Terracotta:

#C96846

Soft Blue Accent:

#87B9D1

Main Text / Charcoal:

#242424

Secondary Text:

#6F716E

Borders:

#E3E0D9

Success:

#3D7A58

Warning:

#C99035

Error:

#B84A45

TYPOGRAPHY

Use:

- DM Serif Display for major headings and editorial titles

- Inter for navigation, buttons, forms, labels and body text

The visual combination should feel like a premium travel magazine combined with a modern travel application.

LAYOUT

Use:

- max page width around 1280px

- main content width around 1200px

- generous whitespace

- responsive layout

- mobile-first behavior

Cards:

- approximately 18px border radius

- subtle border

- very light shadow or no shadow

- large photography

- subtle image zoom on hover

- smooth approximately 250ms transitions

Buttons:

- rounded approximately 10-12px

- primary buttons use Deep Forest

- important secondary CTA may use Terracotta

- secondary buttons can be white or transparent

NAVIGATION

Create a reusable header.

Desktop navigation:

Discover Bulgaria

Explore

Categories

Add a Place

Favorites

Sign In

"Discover Bulgaria" is the brand/logo text.

The header should initially be transparent when displayed over the homepage hero image and become a solid Warm Ivory / white navigation bar when scrolling.

Create a simple mobile hamburger navigation.

Do not implement real login state yet. Navigation links can simply point to their future routes.

ROUTES

Create the application as a multi-page application using routes.

Create these routes:

/

Home / Explore

/categories

Categories

/login

Login

/register

Register

/profile

Profile

/places/new

Add a Place

/my-places

My Places

/favorites

Favorites

/admin

Admin Dashboard

/admin/places

Manage Places

Also prepare a dynamic route structure for:

/places/:slug

This will later become the Place Details page.

For this first step, only the Home page needs to be fully designed.

All other pages should use the same header/footer and contain a simple clean placeholder layout with the page title. Do not implement their final functionality yet.

HOME PAGE

Create a premium visual homepage.

SECTION 1 — HERO

Use a large cinematic Bulgarian landscape image as the hero background.

The hero should occupy approximately 75-85% of the initial viewport height on desktop.

Use a subtle dark overlay to ensure text readability.

Main title:

Discover Bulgaria

Subtitle:

Hidden places. Local stories. Unforgettable experiences.

Add a large search interface with placeholder text:

"Search places, regions or experiences..."

The search does not need to work yet.

Add small quick-category links below the search:

Hidden Gems

Nature

Mountains

Sea

Culture

SECTION 2 — EXPLORE BY CATEGORY

Heading:

Explore by category

Create eight visual category cards:

Hidden Gems

Nature

Mountains

Sea

History & Culture

Best Views

Photo Spots

Food & Wine

Use large landscape photography and minimal text overlays.

SECTION 3 — FEATURED PLACES

Heading:

Places worth discovering

Create 6 STATIC sample place cards for design purposes only.

Example places:

Tyulenovo Cliffs

Kovachevitsa

Devil's Bridge

Belogradchik Rocks

Shiroka Laka

Beglik Tash

Each card should include:

- large photo

- place name

- region

- one category label

- short one-sentence description

- practical information such as "Free · 2-3 h"

- heart icon

- subtle arrow or "Explore" action

Use attractive but realistic placeholder travel content.

These are static mock items only.

Do NOT create database functionality.

SECTION 4 — LOCAL SECRETS

Create a visually distinctive editorial section introducing the concept of "Local Secrets".

Heading:

Discover what locals know

Text:

"The best places aren't always in the guidebooks. Discover authentic tips and hidden details shared by people who know Bulgaria."

Show 3 example Local Secret cards.

Use Warm Sand backgrounds and subtle Terracotta accents.

SECTION 5 — COMMUNITY CTA

Create a strong but elegant CTA section:

Heading:

Know a place worth discovering?

Text:

"Share your favorite corner of Bulgaria and help others experience it too."

Button:

Add a Place

The button should link to /places/new.

SECTION 6 — FOOTER

Create a clean footer.

Columns:

Discover

- Explore Places

- Categories

- Hidden Gems

Community

- Add a Place

- Sign In

- Register

Discover Bulgaria

- About

- Contact

At the bottom:

© 2026 Discover Bulgaria

Add a disabled or visual language selector:

English | Български

English should appear active.

Do NOT implement localization yet.

RESPONSIVE DESIGN

Make the entire application responsive.

Desktop:

- 3-column place card grids

Tablet:

- 2 columns

Mobile:

- 1 column

- large touch targets

- comfortable mobile search

- simplified header

- large visual cards

ACCESSIBILITY AND QUALITY

Use:

- semantic HTML

- accessible labels

- good text contrast

- visible focus states

- descriptive alt text where appropriate

CODE QUALITY

Keep the project modular.

Create reusable components for things such as:

Header

Footer

Hero

SearchBar

CategoryCard

PlaceCard

SectionHeading

LocalSecretCard

Do not put the whole homepage in one large component.

IMPORTANT

This is only STEP 1 of the application implementation.

Do not add Supabase.

Do not create database tables.

Do not add authentication logic.

Do not add admin logic.

Do not add upload functionality.

Do not add favorites functionality.

Do not add AI functionality.

Focus only on:

1. project structure

2. routes

3. reusable components

4. approved design system

5. responsive homepage

6. clean placeholder pages for future functionality

The result should look like a polished real-world travel startup, not like a school exercise.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d6f82dfc-2660-48f1-a897-2a429d9e7a45).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
