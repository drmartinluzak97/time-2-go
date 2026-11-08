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
    intro: "time2go nepoužíva cookies na sledovanie, analytiku ani reklamu a nevyžaduje registráciu.",
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
    intro: "time2go nepoužívá cookies ke sledování, analytice ani reklamě a nevyžaduje registraci.",
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
    intro: "A time2go nem használ sütiket követésre, elemzésre vagy hirdetésre, és nem kér regisztrációt.",
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
    intro: "time2go nie używa plików cookie do śledzenia, analityki ani reklam i nie wymaga rejestracji.",
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
    intro: "time2go verwendet keine Cookies für Tracking, Analyse oder Werbung und erfordert keine Registrierung.",
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
    intro: "time2go does not use cookies for tracking, analytics or advertising, and needs no sign-up.",
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
    intro: "time2go не використовує файли cookie для відстеження, аналітики чи реклами і не потребує реєстрації.",
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
