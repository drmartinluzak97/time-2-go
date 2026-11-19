import type { Lang } from "./i18n";

export interface PrivacySection {
  h: string;
  p: string[];
}

export interface PrivacyText {
  title: string;
  intro: string;
  sections: PrivacySection[];
  updated: string;
}

export const PRIVACY: Record<Lang, PrivacyText> = {
  sk: {
    title: "Ochrana súkromia",
    intro: "time2go nepoužíva reklamu ani sledovanie naprieč webmi a nevyžaduje registráciu. Anonymnú analytiku návštevnosti zapína len s vaším súhlasom.",
    sections: [
      {
        h: "Čo sa ukladá vo vašom prehliadači",
        p: [
          "Do úložiska prehliadača (localStorage) sa ukladá iba to, čo potrebujete na používanie stránky: zvolený jazyk, či je zapnutá mapa, vaše obľúbené trasy a zastávky a história vyhľadávania.",
          "Tieto údaje zostávajú len vo vašom zariadení. Neposielajú sa na náš server a autor stránky k nim nemá prístup.",
          "Ukladanie histórie môžete kedykoľvek vypnúť prepínačom pod vyhľadávaním. Vypnutím sa história zároveň vymaže.",
        ],
      },
      {
        h: "Vyhľadávanie spojení",
        p: [
          "Pri vyhľadávaní sa zadané zastávky, miesta a čas posielajú cez náš server službe Transitous (api.transitous.org), ktorá spojenia vypočíta. Transitous vidí adresu nášho servera, nie vašu IP adresu.",
          "Stránka beží na platforme Vercel, ktorá môže na technické a bezpečnostné účely krátkodobo evidovať prístupy vrátane IP adresy.",
        ],
      },
      {
        h: "Analytika (len so súhlasom)",
        p: [
          "Ak v lište cookies súhlasíte, načíta sa anonymná analytika návštevnosti Umami a Vercel Analytics. Obe fungujú bez cookies a slúžia len na štatistiky, ktoré pomáhajú stránku zlepšovať, nie na reklamu ani sledovanie naprieč webmi.",
          "Bez súhlasu sa nenačítajú. Vašu voľbu ukladáme do cookie time2go_consent na 1 rok a môžete ju kedykoľvek zmeniť alebo odvolať cez odkaz „Nastavenia cookies“ v pätičke.",
        ],
      },
      {
        h: "Mapa",
        p: [
          "Mapové podklady sa načítavajú priamo z vášho prehliadača zo služby OpenFreeMap (tiles.openfreemap.org), ktorá preto vidí vašu IP adresu. Ak mapu skryjete, podklady sa nenačítavajú.",
        ],
      },
      {
        h: "Ako údaje vymazať",
        p: [
          "Obľúbené položky odstránite krížikom, históriu tlačidlom „Vymazať históriu“. Všetko naraz vymažete vymazaním údajov tejto stránky v nastaveniach prehliadača.",
        ],
      },
      {
        h: "Kontakt",
        p: ["Martin Lužák, hello@martinluzak.sk, martinluzak.sk"],
      },
    ],
    updated: "Posledná aktualizácia: november 2026",
  },
  cs: {
    title: "Ochrana soukromí",
    intro: "time2go nepoužívá reklamu ani sledování napříč weby a nevyžaduje registraci. Anonymní analytiku návštěvnosti zapíná jen s vaším souhlasem.",
    sections: [
      {
        h: "Co se ukládá ve vašem prohlížeči",
        p: [
          "Do úložiště prohlížeče (localStorage) se ukládá pouze to, co potřebujete k používání stránky: zvolený jazyk, zda je zapnutá mapa, vaše oblíbené trasy a zastávky a historie vyhledávání.",
          "Tyto údaje zůstávají jen ve vašem zařízení. Neposílají se na náš server a autor stránky k nim nemá přístup.",
          "Ukládání historie můžete kdykoli vypnout přepínačem pod vyhledáváním. Vypnutím se historie zároveň smaže.",
        ],
      },
      {
        h: "Vyhledávání spojení",
        p: [
          "Při vyhledávání se zadané zastávky, místa a čas posílají přes náš server službě Transitous (api.transitous.org), která spojení vypočítá. Transitous vidí adresu našeho serveru, ne vaši IP adresu.",
          "Stránka běží na platformě Vercel, která může pro technické a bezpečnostní účely krátkodobě evidovat přístupy včetně IP adresy.",
        ],
      },
      {
        h: "Analytika (jen se souhlasem)",
        p: [
          "Pokud v liště cookies souhlasíte, načte se anonymní analytika návštěvnosti Umami a Vercel Analytics. Obě fungují bez cookies a slouží jen ke statistikám, které pomáhají stránku zlepšovat, ne k reklamě ani sledování napříč weby.",
          "Bez souhlasu se nenačtou. Vaši volbu ukládáme do cookie time2go_consent na 1 rok a můžete ji kdykoli změnit nebo odvolat přes odkaz „Nastavení cookies“ v patičce.",
        ],
      },
      {
        h: "Mapa",
        p: [
          "Mapové podklady se načítají přímo z vašeho prohlížeče ze služby OpenFreeMap (tiles.openfreemap.org), která proto vidí vaši IP adresu. Pokud mapu skryjete, podklady se nenačítají.",
        ],
      },
      {
        h: "Jak údaje smazat",
        p: [
          "Oblíbené položky odstraníte křížkem, historii tlačítkem „Smazat historii“. Vše najednou smažete vymazáním dat této stránky v nastavení prohlížeče.",
        ],
      },
      { h: "Kontakt", p: ["Martin Lužák, hello@martinluzak.sk, martinluzak.sk"] },
    ],
    updated: "Poslední aktualizace: listopad 2026",
  },
  hu: {
    title: "Adatvédelem",
    intro: "A time2go nem használ hirdetéseket és weboldalakon átívelő követést, és nem kér regisztrációt. Névtelen látogatottsági analitikát csak az Ön hozzájárulásával kapcsol be.",
    sections: [
      {
        h: "Mit tárol a böngészője",
        p: [
          "A böngésző tárhelyén (localStorage) csak az oldal használatához szükséges adatok tárolódnak: a választott nyelv, a térkép be- vagy kikapcsolt állapota, a kedvenc útvonalak és megállók, valamint a keresési előzmények.",
          "Ezek az adatok csak az Ön eszközén maradnak. Nem kerülnek a szerverünkre, és az oldal szerzője nem fér hozzájuk.",
          "Az előzmények mentését a keresés alatti kapcsolóval bármikor kikapcsolhatja. Kikapcsoláskor az előzmények törlődnek.",
        ],
      },
      {
        h: "Útvonaltervezés",
        p: [
          "Keresésnél a megadott megállók, helyek és időpont a szerverünkön keresztül a Transitous szolgáltatáshoz (api.transitous.org) kerülnek, amely kiszámítja a kapcsolatokat. A Transitous a szerverünk címét látja, nem az Ön IP-címét.",
          "Az oldal a Vercel platformon fut, amely technikai és biztonsági célból rövid ideig naplózhatja a hozzáféréseket, beleértve az IP-címet.",
        ],
      },
      {
        h: "Analitika (csak hozzájárulással)",
        p: [
          "Ha a cookie-sávban hozzájárul, betöltődik az Umami és a Vercel Analytics névtelen látogatottsági analitikája. Mindkettő cookie nélkül működik, és csak az oldal fejlesztését segítő statisztikákra szolgál, nem hirdetésre vagy weboldalakon átívelő követésre.",
          "Hozzájárulás nélkül nem töltődnek be. Döntését a time2go_consent cookie-ban tároljuk 1 évig, és a lábléc „Cookie-beállítások” hivatkozásán bármikor módosíthatja vagy visszavonhatja.",
        ],
      },
      {
        h: "Térkép",
        p: [
          "A térképcsempék közvetlenül az Ön böngészőjéből töltődnek az OpenFreeMap szolgáltatástól (tiles.openfreemap.org), amely ezért látja az IP-címét. Ha elrejti a térképet, a csempék nem töltődnek be.",
        ],
      },
      {
        h: "Az adatok törlése",
        p: [
          "A kedvenceket az X gombbal, az előzményeket az „Előzmények törlése” gombbal törölheti. Mindent egyszerre a böngésző beállításaiban, az oldal adatainak törlésével távolíthat el.",
        ],
      },
      { h: "Kapcsolat", p: ["Martin Lužák, hello@martinluzak.sk, martinluzak.sk"] },
    ],
    updated: "Utolsó frissítés: 2026. november",
  },
  pl: {
    title: "Prywatność",
    intro: "time2go nie wyświetla reklam, nie śledzi użytkowników między stronami i nie wymaga rejestracji. Anonimową analitykę odwiedzin włącza tylko za Twoją zgodą.",
    sections: [
      {
        h: "Co jest zapisywane w Twojej przeglądarce",
        p: [
          "W pamięci przeglądarki (localStorage) zapisywane są tylko dane potrzebne do korzystania ze strony: wybrany język, czy mapa jest włączona, ulubione trasy i przystanki oraz historia wyszukiwania.",
          "Dane te pozostają wyłącznie na Twoim urządzeniu. Nie są wysyłane na nasz serwer, a autor strony nie ma do nich dostępu.",
          "Zapisywanie historii możesz w każdej chwili wyłączyć przełącznikiem pod wyszukiwarką. Wyłączenie jednocześnie usuwa historię.",
        ],
      },
      {
        h: "Wyszukiwanie połączeń",
        p: [
          "Podczas wyszukiwania podane przystanki, miejsca i czas są przesyłane przez nasz serwer do usługi Transitous (api.transitous.org), która oblicza połączenia. Transitous widzi adres naszego serwera, a nie Twój adres IP.",
          "Strona działa na platformie Vercel, która może przez krótki czas rejestrować dostęp, w tym adres IP, w celach technicznych i bezpieczeństwa.",
        ],
      },
      {
        h: "Analityka (tylko za zgodą)",
        p: [
          "Jeśli wyrazisz zgodę na pasku cookies, załaduje się anonimowa analityka odwiedzin Umami i Vercel Analytics. Obie działają bez plików cookie i służą wyłącznie do statystyk pomagających ulepszać stronę, a nie do reklam ani śledzenia między stronami.",
          "Bez zgody nie są ładowane. Twój wybór zapisujemy w pliku cookie time2go_consent na 1 rok i możesz go w każdej chwili zmienić lub wycofać przez link „Ustawienia cookies” w stopce.",
        ],
      },
      {
        h: "Mapa",
        p: [
          "Podkłady mapowe są pobierane bezpośrednio przez Twoją przeglądarkę z usługi OpenFreeMap (tiles.openfreemap.org), która widzi więc Twój adres IP. Po ukryciu mapy podkłady nie są pobierane.",
        ],
      },
      {
        h: "Jak usunąć dane",
        p: [
          "Ulubione usuniesz krzyżykiem, historię przyciskiem „Wyczyść historię”. Wszystko naraz usuniesz, czyszcząc dane tej strony w ustawieniach przeglądarki.",
        ],
      },
      { h: "Kontakt", p: ["Martin Lužák, hello@martinluzak.sk, martinluzak.sk"] },
    ],
    updated: "Ostatnia aktualizacja: listopad 2026",
  },
  de: {
    title: "Datenschutz",
    intro: "time2go zeigt keine Werbung, verfolgt dich nicht über Websites hinweg und erfordert keine Registrierung. Anonyme Besuchsstatistik wird nur mit deiner Einwilligung aktiviert.",
    sections: [
      {
        h: "Was in Ihrem Browser gespeichert wird",
        p: [
          "Im Browser-Speicher (localStorage) wird nur gespeichert, was Sie für die Nutzung der Seite brauchen: die gewählte Sprache, ob die Karte eingeblendet ist, Ihre favorisierten Verbindungen und Haltestellen sowie der Suchverlauf.",
          "Diese Daten bleiben ausschließlich auf Ihrem Gerät. Sie werden nicht an unseren Server gesendet, und der Betreiber der Seite hat keinen Zugriff darauf.",
          "Das Speichern des Verlaufs können Sie jederzeit mit dem Schalter unter der Suche deaktivieren. Dabei wird der Verlauf gelöscht.",
        ],
      },
      {
        h: "Verbindungssuche",
        p: [
          "Bei einer Suche werden die eingegebenen Haltestellen, Orte und die Zeit über unseren Server an den Dienst Transitous (api.transitous.org) übermittelt, der die Verbindungen berechnet. Transitous sieht die Adresse unseres Servers, nicht Ihre IP-Adresse.",
          "Die Seite wird auf der Plattform Vercel betrieben, die Zugriffe einschließlich der IP-Adresse aus technischen und Sicherheitsgründen kurzzeitig protokollieren kann.",
        ],
      },
      {
        h: "Statistik (nur mit Einwilligung)",
        p: [
          "Wenn du im Cookie-Banner zustimmst, werden die anonymen Besuchsstatistiken Umami und Vercel Analytics geladen. Beide funktionieren ohne Cookies und dienen nur Statistiken zur Verbesserung der Seite, nicht der Werbung oder dem Tracking über Websites hinweg.",
          "Ohne Einwilligung werden sie nicht geladen. Deine Wahl speichern wir 1 Jahr lang im Cookie time2go_consent; du kannst sie jederzeit über „Cookie-Einstellungen“ in der Fußzeile ändern oder widerrufen.",
        ],
      },
      {
        h: "Karte",
        p: [
          "Die Kartenkacheln werden direkt von Ihrem Browser beim Dienst OpenFreeMap (tiles.openfreemap.org) geladen, der daher Ihre IP-Adresse sieht. Wenn Sie die Karte ausblenden, werden keine Kacheln geladen.",
        ],
      },
      {
        h: "Daten löschen",
        p: [
          "Favoriten entfernen Sie mit dem Kreuz, den Verlauf mit „Verlauf löschen“. Alles auf einmal löschen Sie, indem Sie die Daten dieser Seite in den Browser-Einstellungen entfernen.",
        ],
      },
      { h: "Kontakt", p: ["Martin Lužák, hello@martinluzak.sk, martinluzak.sk"] },
    ],
    updated: "Zuletzt aktualisiert: November 2026",
  },
  en: {
    title: "Privacy",
    intro: "time2go shows no ads, does not track you across websites and needs no sign-up. Anonymous visit analytics is switched on only with your consent.",
    sections: [
      {
        h: "What is stored in your browser",
        p: [
          "Only what you need to use the site is kept in browser storage (localStorage): your language, whether the map is shown, your favourite routes and stops, and your search history.",
          "This data stays on your device. It is not sent to our server and the site's author cannot access it.",
          "You can turn history off at any time with the switch below the search form. Turning it off also deletes it.",
        ],
      },
      {
        h: "Journey search",
        p: [
          "When you search, the stops, places and time you enter are sent through our server to Transitous (api.transitous.org), which calculates the connections. Transitous sees our server's address, not your IP address.",
          "The site runs on Vercel, which may briefly log requests, including IP addresses, for technical and security purposes.",
        ],
      },
      {
        h: "Analytics (only with consent)",
        p: [
          "If you agree in the cookie banner, the anonymous visit analytics Umami and Vercel Analytics are loaded. Both work without cookies and are used only for statistics that help improve the site, not for advertising or cross-site tracking.",
          "Without consent they are not loaded. Your choice is stored in the time2go_consent cookie for 1 year, and you can change or withdraw it at any time via “Cookie settings” in the footer.",
        ],
      },
      {
        h: "Map",
        p: [
          "Map tiles are loaded by your browser directly from OpenFreeMap (tiles.openfreemap.org), which therefore sees your IP address. If you hide the map, no tiles are loaded.",
        ],
      },
      {
        h: "Deleting your data",
        p: [
          "Remove favourites with the cross and history with “Clear history”. To remove everything at once, clear this site's data in your browser settings.",
        ],
      },
      { h: "Contact", p: ["Martin Lužák, hello@martinluzak.sk, martinluzak.sk"] },
    ],
    updated: "Last updated: November 2026",
  },
  uk: {
    title: "Конфіденційність",
    intro: "time2go не показує реклами, не відстежує вас на інших сайтах і не потребує реєстрації. Анонімну аналітику відвідувань вмикає лише з вашої згоди.",
    sections: [
      {
        h: "Що зберігається у вашому браузері",
        p: [
          "У сховищі браузера (localStorage) зберігається лише те, що потрібно для користування сайтом: вибрана мова, чи показано карту, ваші обрані маршрути та зупинки, а також історія пошуку.",
          "Ці дані залишаються лише на вашому пристрої. Вони не надсилаються на наш сервер, і автор сайту не має до них доступу.",
          "Збереження історії можна будь-коли вимкнути перемикачем під формою пошуку. Під час вимкнення історію також буде видалено.",
        ],
      },
      {
        h: "Пошук маршрутів",
        p: [
          "Під час пошуку введені зупинки, місця та час надсилаються через наш сервер до сервісу Transitous (api.transitous.org), який розраховує маршрути. Transitous бачить адресу нашого сервера, а не вашу IP-адресу.",
          "Сайт працює на платформі Vercel, яка може короткочасно реєструвати запити, зокрема IP-адресу, з технічною метою та з міркувань безпеки.",
        ],
      },
      {
        h: "Аналітика (лише за згодою)",
        p: [
          "Якщо ви погодитеся на панелі cookies, завантажиться анонімна аналітика відвідувань Umami та Vercel Analytics. Обидві працюють без cookies і слугують лише для статистики, яка допомагає покращувати сайт, а не для реклами чи відстеження на інших сайтах.",
          "Без згоди вони не завантажуються. Ваш вибір ми зберігаємо в cookie time2go_consent на 1 рік, і ви можете будь-коли змінити або відкликати його через посилання «Налаштування cookies» у нижній частині сторінки.",
        ],
      },
      {
        h: "Карта",
        p: [
          "Фрагменти карти ваш браузер завантажує безпосередньо із сервісу OpenFreeMap (tiles.openfreemap.org), тому він бачить вашу IP-адресу. Якщо сховати карту, фрагменти не завантажуються.",
        ],
      },
      {
        h: "Як видалити дані",
        p: [
          "Обране видаляється хрестиком, історія — кнопкою «Очистити історію». Щоб видалити все одразу, очистьте дані цього сайту в налаштуваннях браузера.",
        ],
      },
      { h: "Контакт", p: ["Martin Lužák, hello@martinluzak.sk, martinluzak.sk"] },
    ],
    updated: "Останнє оновлення: листопад 2026",
  },
};
