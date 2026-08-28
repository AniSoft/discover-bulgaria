/**
 * Legal page content for Discover Bulgaria, EN and BG.
 *
 * Everything here reflects the audited implementation: Supabase Auth (session
 * kept in browser localStorage, not cookies), Supabase PostgreSQL, Supabase
 * Storage, Netlify hosting, Google Analytics 4 loaded only after consent,
 * Leaflet with OpenStreetMap tiles, and Google Maps used only as an external
 * link. No processors, cookies or retention periods beyond these are claimed.
 *
 * LEGAL CONTACT INFORMATION REQUIRED: the controller's legal entity name,
 * address and contact email are not available in the project, so they are not
 * stated. Fill in `CONTROLLER_CONTACT_PLACEHOLDER` usages before treating these
 * pages as final.
 */
import type { Locale } from "@/lib/i18n/locale";

export const LEGAL_UPDATED: Record<Locale, string> = {
  en: "Last updated: August 28, 2026",
  bg: "Последна актуализация: 28 август 2026 г.",
};

export type LegalSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type LegalDoc = {
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  sections: LegalSection[];
};

const enPrivacy: LegalDoc = {
  title: "Privacy Policy",
  metaTitle: "Privacy Policy | Discover Bulgaria",
  metaDescription:
    "How Discover Bulgaria handles account data, submitted places, uploaded photos, analytics after consent and the services we rely on.",
  intro:
    "Discover Bulgaria is a community travel guide to lesser known places in Bulgaria. This policy explains what data the website processes, why, and what choices you have. It describes the website as it is actually built and is written in plain language rather than as legal advice.",
  sections: [
    {
      heading: "Who is responsible",
      paragraphs: [
        "Discover Bulgaria is operated at https://discoverbulgaria.net and was created by AniDigit (https://www.anidigit.com/).",
        "Full controller details (registered entity, postal address and a contact email for privacy requests) are not yet published on this website. Until they are added here, privacy requests can be directed through AniDigit.",
      ],
    },
    {
      heading: "Browsing without an account",
      paragraphs: [
        "You can browse places, categories and place pages without creating an account. In that case we do not store profile data about you. Our infrastructure providers process technical connection data such as your IP address in order to deliver pages and protect the service.",
      ],
    },
    {
      heading: "Account data",
      paragraphs: [
        "If you register, we process the data you provide to Supabase Auth: your email address, a display name, and a securely hashed password. We never see or store your password in readable form.",
        "Your session is kept in your browser's local storage so that you stay signed in. It is not stored in a cookie.",
      ],
    },
    {
      heading: "Content you create",
      bullets: [
        "Favorites: the places you save are stored with your account so the list is available when you sign in.",
        "Submitted places: the title, descriptions, location details, practical information and any Bulgarian translations you provide, together with your account as the owner.",
        "Uploaded photos: the image files you upload are stored in Supabase Storage and linked to your submission.",
        "Moderation status: whether a submission is awaiting review, published or rejected, plus the times it was created and updated.",
      ],
      paragraphs: [
        "Published places and their photos are public. Your email address is never published with them.",
      ],
    },
    {
      heading: "Why we process this data",
      bullets: [
        "To create and maintain user accounts and to authenticate you.",
        "To provide Favorites and the My Places area.",
        "To accept place submissions and photo uploads.",
        "To moderate community content before it is published.",
        "To keep the service secure and to investigate abuse.",
        "To operate, maintain and improve the website.",
        "To measure website usage with analytics, but only after you give consent.",
      ],
      paragraphs: [
        "Account and content processing is necessary to provide the service you asked for. Security and abuse prevention rest on our legitimate interest in a safe website. Analytics rests on your consent, which you can withdraw at any time.",
      ],
    },
    {
      heading: "Analytics",
      paragraphs: [
        "We use Google Analytics 4 (measurement ID G-NP4Y2XRK9Q) only if you accept analytics in the consent banner or in Cookie Settings. Before that, the Google tag is not loaded at all and no analytics data leaves your browser.",
        "The analytics events we send deliberately exclude personal data. We never send your email, name, user identifier, tokens, uploaded file names, submitted descriptions or the text you type into search. Events carry only safe values such as the interface language, a place slug, a place category, whether a search returned results and how many.",
        "Advertising features stay switched off: ad storage, ad user data and ad personalization are always denied.",
      ],
    },
    {
      heading: "Language and preferences",
      paragraphs: [
        "Your language choice is stored in a first-party cookie so pages render in the same language on your next visit. Your cookie consent choice is stored in your browser's local storage. Neither contains personal information.",
      ],
    },
    {
      heading: "Maps",
      paragraphs: [
        "Place pages can show an interactive map built with Leaflet. Map tiles are requested from OpenStreetMap, which means your IP address and the requested tiles are visible to OpenStreetMap when a map loads.",
        "Directions and \"open in Google Maps\" buttons are plain external links. Google Maps is not embedded in this website and is only reached if you choose to open it, at which point Google's own terms and privacy policy apply.",
      ],
    },
    {
      heading: "Service providers",
      bullets: [
        "Supabase: authentication, PostgreSQL database and file storage for accounts, places, favorites and photos.",
        "Netlify: hosting, server-side rendering and deployment infrastructure, including technical request logs generated by serving the site.",
        "Google Analytics 4: website usage measurement, only after your consent.",
        "OpenStreetMap: map tiles requested by your browser when a map is displayed.",
      ],
      paragraphs: [
        "These providers process data on our behalf or, in the case of OpenStreetMap tiles, receive the technical request your browser makes. We do not sell personal data.",
      ],
    },
    {
      heading: "How long data is kept",
      paragraphs: [
        "We retain account and submitted content data for as long as necessary to provide the service or until deletion is requested, subject to legitimate security and legal requirements.",
        "Published community content may remain visible while the account exists. Analytics data is retained according to the retention setting configured in our Google Analytics property. Technical logs generated by our hosting and database providers are kept for the limited period those providers apply for operations and security.",
      ],
    },
    {
      heading: "Your rights",
      paragraphs: [
        "If you are in the European Economic Area you have the right to access your data, to correct it, to have it deleted, to restrict or object to certain processing, to receive it in a portable format, and to withdraw consent at any time without affecting processing that already happened.",
        "Analytics consent can be withdrawn instantly through Cookie Settings in the footer. For the other rights, contact us through the details above. You also have the right to lodge a complaint with the competent data protection supervisory authority in your country.",
      ],
    },
    {
      heading: "Children",
      paragraphs: [
        "The website is not directed at children and accounts are intended for adults or for minors with the consent of a parent or guardian.",
      ],
    },
    {
      heading: "Changes",
      paragraphs: [
        "If this policy changes materially we will update the date at the top of the page, and where the change affects consent categories we will ask for your choice again.",
      ],
    },
  ],
};

const bgPrivacy: LegalDoc = {
  title: "Политика за поверителност",
  metaTitle: "Политика за поверителност | Discover Bulgaria",
  metaDescription:
    "Как Discover Bulgaria обработва данни за профила, публикувани места, качени снимки, аналитични данни след съгласие и услугите, които използваме.",
  intro:
    "Discover Bulgaria е пътеводител на общността за по-малко познати места в България. Тази политика обяснява какви данни обработва сайтът, защо и какъв избор имате. Тя описва сайта такъв, какъвто е реално изграден, и е написана на разбираем език, а не като правен съвет.",
  sections: [
    {
      heading: "Кой отговаря за данните",
      paragraphs: [
        "Discover Bulgaria работи на адрес https://discoverbulgaria.net и е създаден от AniDigit (https://www.anidigit.com/).",
        "Пълните данни на администратора на лични данни (регистрирано лице, адрес и имейл за запитвания относно поверителност) все още не са публикувани на сайта. Докато не бъдат добавени тук, запитванията могат да се отправят чрез AniDigit.",
      ],
    },
    {
      heading: "Разглеждане без профил",
      paragraphs: [
        "Можете да разглеждате места, категории и страници на места без да създавате профил. В този случай не съхраняваме профилни данни за вас. Доставчиците на инфраструктура обработват технически данни за връзката, като IP адрес, за да доставят страниците и да защитят услугата.",
      ],
    },
    {
      heading: "Данни за профила",
      paragraphs: [
        "Ако се регистрирате, обработваме данните, които предоставяте на Supabase Auth: имейл адрес, име за показване и парола, съхранена като защитен хеш. Никога не виждаме и не съхраняваме паролата ви в четим вид.",
        "Сесията ви се пази в локалното хранилище на браузъра, за да останете вписани. Тя не се съхранява в бисквитка.",
      ],
    },
    {
      heading: "Съдържание, което създавате",
      bullets: [
        "Любими: местата, които запазвате, се съхраняват към профила ви, за да е достъпен списъкът при вписване.",
        "Публикувани места: заглавие, описания, данни за локацията, практическа информация и българските преводи, които добавяте, заедно с профила ви като автор.",
        "Качени снимки: файловете със снимки се съхраняват в Supabase Storage и се свързват с вашето предложение.",
        "Статус на модерация: дали предложението е за преглед, публикувано или отхвърлено, както и датите на създаване и обновяване.",
      ],
      paragraphs: [
        "Публикуваните места и техните снимки са публични. Имейл адресът ви никога не се публикува с тях.",
      ],
    },
    {
      heading: "Защо обработваме тези данни",
      bullets: [
        "За създаване и поддържане на потребителски профили и за вписване.",
        "За функциите „Любими“ и „Моите места“.",
        "За приемане на предложения за места и качване на снимки.",
        "За модериране на съдържанието от общността преди публикуване.",
        "За сигурността на услугата и разследване на злоупотреби.",
        "За поддържане и подобряване на сайта.",
        "За измерване на използването на сайта чрез аналитични инструменти, но само след вашето съгласие.",
      ],
      paragraphs: [
        "Обработването на профила и съдържанието е необходимо, за да предоставим услугата, която сте поискали. Сигурността и предотвратяването на злоупотреби се основават на нашия легитимен интерес от безопасен сайт. Аналитичните данни се обработват на основание вашето съгласие, което можете да оттеглите по всяко време.",
      ],
    },
    {
      heading: "Аналитични данни",
      paragraphs: [
        "Използваме Google Analytics 4 (идентификатор G-NP4Y2XRK9Q) само ако приемете аналитичните бисквитки в банера или в настройките за бисквитки. Преди това тагът на Google изобщо не се зарежда и никакви аналитични данни не напускат браузъра ви.",
        "Събитията, които изпращаме, съзнателно не съдържат лични данни. Никога не изпращаме имейл, име, потребителски идентификатор, токени, имена на качени файлове, текст от описания или текста, който въвеждате в търсачката. Събитията носят само безопасни стойности като език на интерфейса, идентификатор и категория на място, дали търсенето е върнало резултати и колко са те.",
        "Рекламните функции остават изключени: рекламно съхранение, рекламни потребителски данни и рекламна персонализация винаги са отказани.",
      ],
    },
    {
      heading: "Език и предпочитания",
      paragraphs: [
        "Изборът ви на език се пази в собствена бисквитка на сайта, за да се показват страниците на същия език при следващото посещение. Изборът ви за бисквитки се пази в локалното хранилище на браузъра. Нито едното не съдържа лична информация.",
      ],
    },
    {
      heading: "Карти",
      paragraphs: [
        "Страниците на местата могат да показват интерактивна карта, изградена с Leaflet. Плочките на картата се зареждат от OpenStreetMap, което означава, че при зареждане на карта вашият IP адрес и заявените плочки са видими за OpenStreetMap.",
        "Бутоните за посоки и „отвори в Google Maps“ са обикновени външни връзки. Google Maps не е вграден в този сайт и се отваря само ако вие го изберете, като тогава важат условията и политиката за поверителност на Google.",
      ],
    },
    {
      heading: "Доставчици на услуги",
      bullets: [
        "Supabase: удостоверяване, PostgreSQL база данни и файлово хранилище за профили, места, любими и снимки.",
        "Netlify: хостинг, сървърно рендиране и инфраструктура за внедряване, включително технически логове от обслужването на сайта.",
        "Google Analytics 4: измерване на използването на сайта, само след вашето съгласие.",
        "OpenStreetMap: плочки за картите, заявени от браузъра ви при показване на карта.",
      ],
      paragraphs: [
        "Тези доставчици обработват данни от наше име или, при плочките на OpenStreetMap, получават техническата заявка, която прави браузърът ви. Не продаваме лични данни.",
      ],
    },
    {
      heading: "Колко дълго пазим данните",
      paragraphs: [
        "Пазим данните за профила и подаденото съдържание толкова дълго, колкото е необходимо за предоставяне на услугата или до поискване на изтриване, при спазване на легитимни изисквания за сигурност и закон.",
        "Публикуваното съдържание от общността може да остане видимо, докато профилът съществува. Аналитичните данни се пазят според настройката за съхранение в нашия профил в Google Analytics. Техническите логове на хостинга и базата данни се пазят за ограничения период, който тези доставчици прилагат за поддръжка и сигурност.",
      ],
    },
    {
      heading: "Вашите права",
      paragraphs: [
        "Ако се намирате в Европейското икономическо пространство, имате право на достъп до данните си, коригиране, изтриване, ограничаване или възражение срещу определено обработване, преносимост на данните и оттегляне на съгласието по всяко време, без това да засяга вече извършеното обработване.",
        "Съгласието за аналитични бисквитки може да се оттегли веднага от „Настройки за бисквитки“ във футъра. За останалите права се свържете с нас чрез посочените по-горе данни. Имате право и да подадете жалба до компетентния надзорен орган за защита на личните данни във вашата държава.",
      ],
    },
    {
      heading: "Деца",
      paragraphs: [
        "Сайтът не е насочен към деца, а профилите са предназначени за пълнолетни лица или за непълнолетни със съгласието на родител или настойник.",
      ],
    },
    {
      heading: "Промени",
      paragraphs: [
        "Ако тази политика се промени съществено, ще обновим датата в началото на страницата, а когато промяната засяга категориите съгласие, ще поискаме избора ви отново.",
      ],
    },
  ],
};

const enCookies: LegalDoc = {
  title: "Cookie Policy",
  metaTitle: "Cookie Policy | Discover Bulgaria",
  metaDescription:
    "The cookies and browser storage Discover Bulgaria actually uses: necessary sign-in and preference storage, and Google Analytics 4 only after consent.",
  intro:
    "This page lists the cookies and similar browser storage that Discover Bulgaria actually uses. Analytics is off until you switch it on, and you can change your choice at any time through Cookie Settings in the footer.",
  sections: [
    {
      heading: "Strictly necessary",
      paragraphs: [
        "These technologies are required for the website to work and cannot be switched off.",
      ],
      bullets: [
        "Sign-in session (browser local storage, key beginning with sb-): keeps you signed in with Supabase Auth. Set only when you sign in and removed when you sign out. Discover Bulgaria does not use a session cookie for authentication.",
        "Language preference (first-party cookie db_locale, stored for one year): remembers whether you read the site in English or Bulgarian, including during server-side rendering.",
        "Cookie consent (browser local storage, key db_cookie_consent): stores your choice as necessary: true, analytics: true or false, and a consent version number. It contains no personal information.",
      ],
    },
    {
      heading: "Analytics",
      paragraphs: [
        "Analytics is provided by Google Analytics 4 and is loaded only after you accept it. Until then, no Google script is loaded, no analytics cookies are created and no data, cookieless or otherwise, is sent.",
        "If you accept, the Google tag is loaded from googletagmanager.com and usage events are sent to Google. Where Google's tag stores an identifier in your browser it uses its own first-party cookies, typically named _ga and _ga_NP4Y2XRK9Q, whose content and lifetime are controlled by Google and not by us. We set no analytics cookies of our own.",
        "If you decline, or later turn analytics off in Cookie Settings, the tag is not loaded on subsequent page loads and no further analytics events are sent. Cookies already placed by Google can also be deleted in your browser settings at any time.",
        "Advertising storage, advertising user data and advertising personalization are always denied. Discover Bulgaria does not run advertising or cross-site tracking.",
      ],
    },
    {
      heading: "Maps",
      paragraphs: [
        "When a place page shows a map, your browser requests map tiles directly from OpenStreetMap. That request is not a cookie set by us, but it does mean OpenStreetMap receives the technical details of the request. Google Maps is only opened as an external link when you choose to use directions.",
      ],
    },
    {
      heading: "Managing your choice",
      paragraphs: [
        "Open Cookie Settings from the footer to review or change your analytics choice at any time. You can also delete cookies and local storage for this site directly in your browser, which resets your consent choice and shows the banner again on your next visit.",
      ],
    },
  ],
};

const bgCookies: LegalDoc = {
  title: "Политика за бисквитки",
  metaTitle: "Политика за бисквитки | Discover Bulgaria",
  metaDescription:
    "Бисквитките и браузърното хранилище, които Discover Bulgaria реално използва: необходими за вход и предпочитания, и Google Analytics 4 само след съгласие.",
  intro:
    "Тази страница изброява бисквитките и подобните технологии, които Discover Bulgaria реално използва. Аналитичните са изключени, докато вие не ги включите, и можете да промените избора си по всяко време от „Настройки за бисквитки“ във футъра.",
  sections: [
    {
      heading: "Строго необходими",
      paragraphs: ["Тези технологии са нужни за работата на сайта и не могат да бъдат изключени."],
      bullets: [
        "Сесия при вход (локално хранилище на браузъра, ключ, започващ с sb-): пази вписването ви чрез Supabase Auth. Създава се при вписване и се премахва при изход. Discover Bulgaria не използва бисквитка за сесия при удостоверяване.",
        "Езикова настройка (собствена бисквитка db_locale, със срок една година): помни дали четете сайта на английски или на български, включително при сървърното рендиране.",
        "Съгласие за бисквитки (локално хранилище, ключ db_cookie_consent): пази избора ви като necessary: true, analytics: true или false и номер на версията на съгласието. Не съдържа лична информация.",
      ],
    },
    {
      heading: "Аналитични",
      paragraphs: [
        "Аналитичните данни се събират чрез Google Analytics 4 и се зареждат само след като ги приемете. Дотогава не се зарежда скрипт на Google, не се създават аналитични бисквитки и не се изпращат данни, включително без бисквитки.",
        "Ако приемете, тагът на Google създава стандартните си собствени аналитични бисквитки в браузъра ви с имена _ga и _ga_NP4Y2XRK9Q. Те съдържат произволно генериран идентификатор, който служи за различаване на посещения и сесии, а срокът им се определя от Google, а не от нас.",
        "Ако откажете или по-късно изключите аналитичните от настройките, тагът не се зарежда при следващите отваряния на страници и не се изпращат нови аналитични събития. Вече поставените от Google бисквитки можете да изтриете по всяко време от настройките на браузъра си.",
        "Рекламното съхранение, рекламните потребителски данни и рекламната персонализация винаги са отказани. Discover Bulgaria не показва реклами и не проследява между сайтове.",
      ],
    },
    {
      heading: "Карти",
      paragraphs: [
        "Когато страница на място показва карта, браузърът ви зарежда плочките директно от OpenStreetMap. Това не е бисквитка, поставена от нас, но означава, че OpenStreetMap получава техническите данни на заявката. Google Maps се отваря само като външна връзка, когато изберете да ползвате посоки.",
      ],
    },
    {
      heading: "Управление на избора",
      paragraphs: [
        "Отворете „Настройки за бисквитки“ във футъра, за да прегледате или промените избора си по всяко време. Можете и да изтриете бисквитките и локалното хранилище за този сайт директно от браузъра си, което нулира съгласието и показва банера отново при следващото посещение.",
      ],
    },
  ],
};

const enTerms: LegalDoc = {
  title: "Terms of Use",
  metaTitle: "Terms of Use | Discover Bulgaria",
  metaDescription:
    "The rules for using Discover Bulgaria: accounts, community submissions, photo rights, moderation, external links and travel information disclaimers.",
  intro:
    "Discover Bulgaria is a free, community driven guide to lesser known places in Bulgaria. By using the website you agree to these terms. They are written to be readable rather than as legal advice.",
  sections: [
    {
      heading: "Informational nature of the content",
      paragraphs: [
        "All place descriptions, practical information, coordinates and tips are published for inspiration and general orientation. They are not professional travel, safety or navigation advice.",
      ],
    },
    {
      heading: "Accounts",
      paragraphs: [
        "You need an account to save favorites and to submit places. Provide accurate information, keep your password confidential, and let us know if you believe your account has been used without your permission. You are responsible for the activity that happens through your account.",
      ],
    },
    {
      heading: "Acceptable use",
      bullets: [
        "Do not attempt to disrupt, overload or gain unauthorised access to the website or its infrastructure.",
        "Do not scrape or reuse the content in a way that harms the service or its contributors.",
        "Do not submit spam, advertising, harassment or misleading information.",
      ],
    },
    {
      heading: "Community submissions",
      paragraphs: [
        "Registered users can submit places and upload photos. You remain responsible for everything you submit and you must have the rights necessary to publish it, including for every photo you upload.",
        "Do not upload illegal, infringing, offensive or misleading material, and do not publish personal data about other people without their agreement.",
      ],
    },
    {
      heading: "Rights in submitted content",
      paragraphs: [
        "You keep the copyright in your text and photos. By submitting them you grant Discover Bulgaria a non-exclusive, worldwide, royalty free licence to store, reproduce, adapt for formatting, translate and display that content as part of operating and promoting the service. This licence exists only so the website can show your submission and ends for future use when the content is removed.",
        "We do not claim ownership of your work and we do not sell it.",
      ],
    },
    {
      heading: "Moderation and removal",
      paragraphs: [
        "Submissions are reviewed before they appear publicly. A submission can be published, kept for review or rejected. We can edit obvious errors, or remove content that breaks these terms, infringes someone's rights or is inaccurate.",
        "You can delete your own submissions from the My Places area. If you believe published content infringes your rights, contact us and we will review it.",
      ],
    },
    {
      heading: "Availability of the service",
      paragraphs: [
        "The website is provided as it is and free of charge. We work to keep it available and accurate, but we cannot guarantee uninterrupted operation, and features may change or be discontinued.",
      ],
    },
    {
      heading: "Travel information disclaimer",
      paragraphs: [
        "Travel conditions change. Access, prices, opening hours, road quality, weather and safety conditions may differ from what is described here. Maps and coordinates are provided for convenience and may not reflect the safest or the legal route.",
        "Please check current local conditions before you travel, especially for remote locations, caves, cliffs and mountain routes, and travel at your own responsibility.",
      ],
    },
    {
      heading: "External links",
      paragraphs: [
        "The website links to external services, for example directions in Google Maps. Those websites are operated by other companies under their own terms and privacy policies, and we do not control their content or behaviour.",
      ],
    },
    {
      heading: "Intellectual property",
      paragraphs: [
        "The Discover Bulgaria name, design, code and editorial materials belong to their respective owners. Community photos and texts belong to the people who submitted them. Map data comes from OpenStreetMap contributors and is used under its own licence.",
      ],
    },
    {
      heading: "Changes to these terms",
      paragraphs: [
        "If these terms change, the date at the top of the page is updated. Continuing to use the website after a change means you accept the updated terms.",
      ],
    },
  ],
};

const bgTerms: LegalDoc = {
  title: "Условия за ползване",
  metaTitle: "Условия за ползване | Discover Bulgaria",
  metaDescription:
    "Правилата за ползване на Discover Bulgaria: профили, предложения от общността, права върху снимките, модерация, външни връзки и уточнения за пътуванията.",
  intro:
    "Discover Bulgaria е безплатен пътеводител на общността за по-малко познати места в България. С използването на сайта се съгласявате с тези условия. Те са написани разбираемо, а не като правен съвет.",
  sections: [
    {
      heading: "Информационен характер на съдържанието",
      paragraphs: [
        "Всички описания на места, практическа информация, координати и съвети се публикуват за вдъхновение и обща ориентация. Те не са професионален съвет за пътуване, безопасност или навигация.",
      ],
    },
    {
      heading: "Профили",
      paragraphs: [
        "Нужен ви е профил, за да запазвате любими места и да предлагате нови. Посочвайте точна информация, пазете паролата си и ни уведомете, ако смятате, че профилът ви е използван без ваше знание. Вие отговаряте за действията, извършени през вашия профил.",
      ],
    },
    {
      heading: "Допустимо ползване",
      bullets: [
        "Не нарушавайте работата на сайта, не го претоварвайте и не се опитвайте да получите неоторизиран достъп до него или до инфраструктурата му.",
        "Не извличайте и не преизползвайте съдържанието по начин, който вреди на услугата или на авторите ѝ.",
        "Не публикувайте спам, реклама, тормоз или подвеждаща информация.",
      ],
    },
    {
      heading: "Предложения от общността",
      paragraphs: [
        "Регистрираните потребители могат да предлагат места и да качват снимки. Вие оставате отговорни за всичко, което подавате, и трябва да имате необходимите права да го публикувате, включително за всяка качена снимка.",
        "Не качвайте незаконни, нарушаващи права, обидни или подвеждащи материали и не публикувайте лични данни на други хора без тяхното съгласие.",
      ],
    },
    {
      heading: "Права върху подаденото съдържание",
      paragraphs: [
        "Авторските права върху вашите текстове и снимки остават ваши. С подаването им предоставяте на Discover Bulgaria неизключителен, световен и безвъзмезден лиценз да съхранява, възпроизвежда, форматира, превежда и показва това съдържание във връзка с работата и представянето на услугата. Този лиценз съществува само за да може сайтът да показва вашето предложение и спира да важи за бъдещо използване, когато съдържанието бъде премахнато.",
        "Не претендираме за собственост върху вашата работа и не я продаваме.",
      ],
    },
    {
      heading: "Модерация и премахване",
      paragraphs: [
        "Предложенията се преглеждат, преди да станат публични. Едно предложение може да бъде публикувано, оставено за преглед или отхвърлено. Можем да коригираме очевидни грешки или да премахнем съдържание, което нарушава тези условия, засяга чужди права или е неточно.",
        "Можете да изтриете собствените си предложения от секцията „Моите места“. Ако смятате, че публикувано съдържание нарушава ваши права, свържете се с нас и ще го прегледаме.",
      ],
    },
    {
      heading: "Достъпност на услугата",
      paragraphs: [
        "Сайтът се предоставя такъв, какъвто е, и е безплатен. Стараем се да е достъпен и точен, но не можем да гарантираме непрекъсната работа, а функциите може да се променят или прекратят.",
      ],
    },
    {
      heading: "Уточнение за пътуванията",
      paragraphs: [
        "Условията за пътуване се променят. Достъпът, цените, работното време, качеството на пътищата, времето и безопасността може да се различават от описаното тук. Картите и координатите са дадени за удобство и невинаги отразяват най-безопасния или разрешения маршрут.",
        "Проверявайте актуалната обстановка преди пътуване, особено за отдалечени места, пещери, скали и планински маршрути, и пътувайте на своя отговорност.",
      ],
    },
    {
      heading: "Външни връзки",
      paragraphs: [
        "Сайтът води към външни услуги, например посоки в Google Maps. Тези сайтове се управляват от други компании със собствени условия и политики за поверителност и ние не контролираме тяхното съдържание или поведение.",
      ],
    },
    {
      heading: "Интелектуална собственост",
      paragraphs: [
        "Името Discover Bulgaria, дизайнът, кодът и редакционните материали принадлежат на съответните им собственици. Снимките и текстовете от общността принадлежат на хората, които са ги подали. Данните за картите идват от сътрудниците на OpenStreetMap и се използват съгласно техния лиценз.",
      ],
    },
    {
      heading: "Промени в условията",
      paragraphs: [
        "Ако тези условия се променят, датата в началото на страницата се обновява. Продължаването на ползването след промяна означава, че приемате обновените условия.",
      ],
    },
  ],
};

export const PRIVACY_DOC: Record<Locale, LegalDoc> = { en: enPrivacy, bg: bgPrivacy };
export const COOKIE_DOC: Record<Locale, LegalDoc> = { en: enCookies, bg: bgCookies };
export const TERMS_DOC: Record<Locale, LegalDoc> = { en: enTerms, bg: bgTerms };
