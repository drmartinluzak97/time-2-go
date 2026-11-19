// Texts for the cookie consent banner (Klaro). Klaro ships UI strings for
// cs, hu, pl, de and en; sk and uk are provided here in `ui`.

export interface ConsentTexts {
  settingsLink: string;
  /** Banner text (replaces Klaro's "{purposes}" sentence, which reads awkwardly). */
  notice: string;
  /** Banner buttons: "let me choose", "decline", "accept". */
  buttons: { learnMore: string; decline: string; ok: string };
  privacyUrl: string;
  analytics: { title: string; description: string };
  umami: { title: string; description: string };
  vercel: { title: string; description: string };
  ui?: Record<string, unknown>;
}

const SK_UI = {
  acceptAll: "Prijať všetko",
  acceptSelected: "Prijať vybrané",
  close: "Zavrieť",
  decline: "Odmietnuť",
  ok: "Súhlasím",
  save: "Uložiť",
  consentModal: {
    title: "Služby, ktoré by sme radi používali",
    description: "Tu si môžete pozrieť a upraviť služby, ktoré by sme na tomto webe radi používali. Rozhodujete vy – zapnite alebo vypnite ich podľa seba.",
  },
  consentNotice: {
    title: "Súhlas s cookies",
    description: "Môžeme zapnúť niekoľko ďalších služieb pre {purposes}? Súhlas môžete neskôr kedykoľvek zmeniť alebo odvolať.",
    changeDescription: "Od vašej poslednej návštevy nastali zmeny, prosím obnovte svoj súhlas.",
    learnMore: "Vybrať si",
    testing: "Testovací režim!",
  },
  contextualConsent: {
    acceptAlways: "Vždy",
    acceptOnce: "Áno",
    description: "Chcete načítať externý obsah od {title}?",
    descriptionEmptyStore: "Ak chcete s touto službou súhlasiť natrvalo, musíte prijať {title} v {link}.",
    modalLinkText: "nastaveniach súhlasu",
  },
  poweredBy: "Vytvorené pomocou Klaro!",
  privacyPolicy: { name: "zásadách ochrany súkromia", text: "Viac sa dozviete v našich {privacyPolicy}." },
  purposeItem: { service: "služba", services: "služby" },
  service: {
    disableAll: { title: "Zapnúť alebo vypnúť všetky služby", description: "Týmto prepínačom zapnete alebo vypnete všetky služby." },
    optOut: { title: "(možnosť odhlásenia)", description: "Táto služba sa načítava predvolene (môžete ju však vypnúť)." },
    required: { title: "(vždy potrebné)", description: "Táto služba je vždy potrebná." },
    purpose: "účel",
    purposes: "účely",
  },
};

const UK_UI = {
  acceptAll: "Прийняти все",
  acceptSelected: "Прийняти вибране",
  close: "Закрити",
  decline: "Відхилити",
  ok: "Погоджуюсь",
  save: "Зберегти",
  consentModal: {
    title: "Сервіси, які ми хотіли б використовувати",
    description: "Тут ви можете переглянути та налаштувати сервіси, які ми хотіли б використовувати на цьому сайті. Вирішуєте ви – вмикайте або вимикайте їх на свій розсуд.",
  },
  consentNotice: {
    title: "Згода на cookies",
    description: "Вітаємо! Чи можемо ми увімкнути кілька додаткових сервісів для {purposes}? Ви можете будь-коли змінити або відкликати свою згоду.",
    changeDescription: "Відтоді як ви були тут востаннє, дещо змінилося. Будь ласка, оновіть свою згоду.",
    learnMore: "Обрати самостійно",
    testing: "Тестовий режим!",
  },
  contextualConsent: {
    acceptAlways: "Завжди",
    acceptOnce: "Так",
    description: "Завантажити зовнішній вміст від {title}?",
    descriptionEmptyStore: "Щоб погодитися на цей сервіс назавжди, прийміть {title} у {link}.",
    modalLinkText: "налаштуваннях згоди",
  },
  poweredBy: "Реалізовано за допомогою Klaro!",
  privacyPolicy: { name: "політиці конфіденційності", text: "Докладніше – у нашій {privacyPolicy}." },
  purposeItem: { service: "сервіс", services: "сервіси" },
  service: {
    disableAll: { title: "Увімкнути або вимкнути всі сервіси", description: "Цим перемикачем можна увімкнути або вимкнути всі сервіси." },
    optOut: { title: "(можна відмовитися)", description: "Цей сервіс завантажується за замовчуванням (але ви можете його вимкнути)." },
    required: { title: "(завжди потрібно)", description: "Цей сервіс потрібен завжди." },
    purpose: "мета",
    purposes: "мети",
  },
};

export const CONSENT_TEXTS: Record<string, ConsentTexts> = {
  sk: {
    buttons: { learnMore: "Vybrať si", decline: "Odmietnuť", ok: "Súhlasím" },
    notice: "Môžeme zapnúť anonymnú analytiku návštevnosti? Pomáha zlepšovať time2go. Súhlas môžete kedykoľvek zmeniť alebo odvolať.",
    settingsLink: "Nastavenia cookies",
    privacyUrl: "/sukromie?lang=sk",
    analytics: { title: "Analytika", description: "Anonymné štatistiky návštevnosti, ktoré pomáhajú zlepšovať time2go." },
    umami: { title: "Umami", description: "Štatistiky návštevnosti bez cookies, šetrné k súkromiu." },
    vercel: { title: "Vercel Analytics", description: "Štatistiky zobrazení a výkonu stránky od poskytovateľa hostingu, bez cookies." },
    ui: SK_UI,
  },
  cs: {
    buttons: { learnMore: "Vybrat si", decline: "Odmítnout", ok: "Souhlasím" },
    notice: "Můžeme zapnout anonymní analytiku návštěvnosti? Pomáhá zlepšovat time2go. Souhlas můžete kdykoli změnit nebo odvolat.",
    settingsLink: "Nastavení cookies",
    privacyUrl: "/sukromie?lang=cs",
    analytics: { title: "Analytika", description: "Anonymní statistiky návštěvnosti, které pomáhají zlepšovat time2go." },
    umami: { title: "Umami", description: "Statistiky návštěvnosti bez cookies, šetrné k soukromí." },
    vercel: { title: "Vercel Analytics", description: "Statistiky zobrazení a výkonu stránky od poskytovatele hostingu, bez cookies." },
  },
  hu: {
    buttons: { learnMore: "Választok", decline: "Elutasítom", ok: "Elfogadom" },
    notice: "Bekapcsolhatjuk a névtelen látogatottsági analitikát? Segít fejleszteni a time2go-t. Hozzájárulását bármikor módosíthatja vagy visszavonhatja.",
    settingsLink: "Cookie-beállítások",
    privacyUrl: "/sukromie?lang=hu",
    analytics: { title: "Analitika", description: "Névtelen látogatottsági statisztikák, amelyek segítenek fejleszteni a time2go-t." },
    umami: { title: "Umami", description: "Adatvédelmet tiszteletben tartó, cookie nélküli látogatottsági statisztika." },
    vercel: { title: "Vercel Analytics", description: "A tárhelyszolgáltató cookie nélküli oldalmegtekintési és teljesítménystatisztikái." },
  },
  pl: {
    buttons: { learnMore: "Pozwól mi wybrać", decline: "Odrzuć", ok: "Zgadzam się" },
    notice: "Czy możemy włączyć anonimową analitykę odwiedzin? Pomaga ulepszać time2go. Zgodę możesz w każdej chwili zmienić lub wycofać.",
    settingsLink: "Ustawienia cookies",
    privacyUrl: "/sukromie?lang=pl",
    analytics: { title: "Analityka", description: "Anonimowe statystyki odwiedzin, które pomagają ulepszać time2go." },
    umami: { title: "Umami", description: "Statystyki odwiedzin bez plików cookie, przyjazne dla prywatności." },
    vercel: { title: "Vercel Analytics", description: "Statystyki wyświetleń i wydajności strony od dostawcy hostingu, bez plików cookie." },
  },
  de: {
    buttons: { learnMore: "Selbst auswählen", decline: "Ablehnen", ok: "Einverstanden" },
    notice: "Dürfen wir eine anonyme Besuchsstatistik aktivieren? Sie hilft, time2go zu verbessern. Du kannst deine Einwilligung jederzeit ändern oder widerrufen.",
    settingsLink: "Cookie-Einstellungen",
    privacyUrl: "/sukromie?lang=de",
    analytics: { title: "Statistik", description: "Anonyme Besuchsstatistiken, die helfen, time2go zu verbessern." },
    umami: { title: "Umami", description: "Datenschutzfreundliche Besuchsstatistik ohne Cookies." },
    vercel: { title: "Vercel Analytics", description: "Cookie-freie Seitenaufruf- und Performance-Statistiken des Hosting-Anbieters." },
  },
  en: {
    buttons: { learnMore: "Let me choose", decline: "Decline", ok: "Accept" },
    notice: "May we turn on anonymous visit analytics? It helps improve time2go. You can change or withdraw your consent at any time.",
    settingsLink: "Cookie settings",
    privacyUrl: "/sukromie?lang=en",
    analytics: { title: "Analytics", description: "Anonymous visit statistics that help improve time2go." },
    umami: { title: "Umami", description: "Privacy-friendly, cookie-less visit statistics." },
    vercel: { title: "Vercel Analytics", description: "Cookie-less page view and performance statistics from the hosting provider." },
  },
  uk: {
    buttons: { learnMore: "Обрати самостійно", decline: "Відхилити", ok: "Погоджуюсь" },
    notice: "Чи можемо ми увімкнути анонімну аналітику відвідувань? Вона допомагає покращувати time2go. Ви можете будь-коли змінити або відкликати свою згоду.",
    settingsLink: "Налаштування cookies",
    privacyUrl: "/sukromie?lang=uk",
    analytics: { title: "Аналітика", description: "Анонімна статистика відвідувань, яка допомагає покращувати time2go." },
    umami: { title: "Umami", description: "Статистика відвідувань без cookies, що поважає приватність." },
    vercel: { title: "Vercel Analytics", description: "Статистика переглядів і швидкодії сторінок від хостинг-провайдера, без cookies." },
    ui: UK_UI,
  },
};
