# Manuális felhasználói tesztesetek

Készítette: Tóth József  
Ellenőrizte: X.Y.  
Utolsó módosítás: 2025. május 31.

## Bevezetés

Ez a dokumentum a "Tanfolyamok" webalkalmazás nyilvános felhasználói felületének manuális teszteseteit tartalmazza. A tesztesetek célja annak ellenőrzése, hogy az alapvető funkciók megfelelően működnek-e a végfelhasználók számára.

## Általános tesztelési környezet

* **Böngésző:** Chrome inkognitó módban
* **Backend elérhetőség:** A tesztek feltételezik, hogy a `http://localhost:5000` címen futó backend szerver elérhető és megfelelően működik.

## Tesztesetek

### 1. Navigáció és információ megjelenítés

**TC_PUB_001: Főoldal betöltése és alapvető elemek ellenőrzése**

* **Leírás:** Ellenőrzi, hogy a főoldal helyesen betöltődik-e, és a főbb vizuális elemek (fejléc, navigáció) megjelennek.
* **Előfeltételek:** Nincsenek.
* **Tesztlépések:**
    1. Nyissa meg az `index.html` oldalt egy webböngészőben.
* **Elvárt eredmény:**
    1. A böngésző címsorában a "Tanfolyamok" cím látható.
    2. A "Pogány Frigyes Technikum" és "Esti és hétvégi képzések" fejléc szövegek megjelennek.
    3. A navigációs sáv a következő linkekkel látható: "Junior frontend fejlesztő", "Junior Java backend fejlesztő", "Junior fullstack fejlesztő", "Jelentkezés".

**TC_PUB_002: Navigálás a "Junior frontend fejlesztő" szekcióra**

* **Leírás:** Ellenőrzi a navigációs link működését a Frontend szekcióhoz.
* **Előfeltételek:** Az `index.html` oldal be van töltve.
* **Tesztlépések:**
    1. Kattintson a "Junior frontend fejlesztő" linkre a navigációs sávban.
* **Elvárt eredmény:**
    1. Az oldal a "Junior frontend fejlesztő" szekcióhoz görget.
    2. A "Junior frontend fejlesztő" cím és a hozzá tartozó leírás, valamint a `img/software1.jpg` kép látható.

**TC_PUB_003: Navigálás a "Junior Java backend fejlesztő" szekcióra**

* **Leírás:** Ellenőrzi a navigációs link működését a Backend szekcióhoz.
* **Előfeltételek:** Az `index.html` oldal be van töltve.
* **Tesztlépések:**
    1. Kattintson a "Junior Java backend fejlesztő" linkre a navigációs sávban.
* **Elvárt eredmény:**
    1. Az oldal a "Junior Java backend fejlesztő" szekcióhoz görget.
    2. A "Junior Java backend fejlesztő" cím és a hozzá tartozó leírás látható. Nagyobb képernyőkön (lg és felette) az `img/software3.jpg` kép is megjelenik.

**TC_PUB_004: Navigálás a "Junior fullstack fejlesztő" szekcióra**

* **Leírás:** Ellenőrzi a navigációs link működését a Fullstack szekcióhoz.
* **Előfeltételek:** Az `index.html` oldal be van töltve.
* **Tesztlépések:**
    1. Kattintson a "Junior fullstack fejlesztő" linkre a navigációs sávban.
* **Elvárt eredmény:**
    1. Az oldal a "Junior fullstack fejlesztő" szekcióhoz görget.
    2. A "Junior fullstack fejlesztő" cím és a hozzá tartozó leírás látható. Nagyobb képernyőkön (lg és felette) az `img/software2.jpg` kép is megjelenik.

**TC_PUB_005: Navigálás a "Jelentkezés" szekcióra**

* **Leírás:** Ellenőrzi a navigációs link működését a Jelentkezés szekcióhoz.
* **Előfeltételek:** Az `index.html` oldal be van töltve.
* **Tesztlépések:**
    1. Kattintson a "Jelentkezés" linkre a navigációs sávban.
* **Elvárt eredmény:**
    1. Az oldal a "Jelentkezés" szekcióhoz görget.
    2. Az "Induló csoportok" táblázat és a "Jelentkezés" űrlap látható.

**TC_PUB_006: Frontend kurzus követelményeinek megtekintése**

* **Leírás:** Ellenőrzi a Frontend kurzus követelményeit tartalmazó PDF link működését.
* **Előfeltételek:** Az `index.html` oldal be van töltve, a "Junior frontend fejlesztő" szekció látható.
* **Tesztlépések:**
    1. Kattintson a "Követelmények" linkre a "Junior frontend fejlesztő" szekcióban.
* **Elvárt eredmény:**
    1. Új böngészőfülön vagy ablakban megnyílik a PDF dokumentum (`...06134004_junior_frontend_fejleszto_modpdf...`).

**TC_PUB_007: Backend kurzus követelményeinek megtekintése**

* **Leírás:** Ellenőrzi a Backend kurzus követelményeit tartalmazó PDF link működését.
* **Előfeltételek:** Az `index.html` oldal be van töltve, a "Junior Java backend fejlesztő" szekció látható.
* **Tesztlépések:**
    1. Kattintson a "Követelmények" linkre a "Junior Java backend fejlesztő" szekcióban.
* **Elvárt eredmény:**
    1. Új böngészőfülön vagy ablakban megnyílik a PDF dokumentum (`...06134005_junior_java_backend_fejleszto_modpdf...`).

**TC_PUB_008: Fullstack kurzus követelményeinek megtekintése**

* **Leírás:** Ellenőrzi a Fullstack kurzus követelményeit tartalmazó PDF link működését.
* **Előfeltételek:** Az `index.html` oldal be van töltve, a "Junior fullstack fejlesztő" szekció látható.
* **Tesztlépések:**
    1. Kattintson a "Követelmények" linkre a "Junior fullstack fejlesztő" szekcióban.
* **Elvárt eredmény:**
    1. Új böngészőfülön vagy ablakban megnyílik a PDF dokumentum (`...06135010_junior_fullstack_api_pkpdf...`).

### 2. Induló csoportok megjelenítése

**TC_PUB_009: Induló csoportok táblázat sikeres betöltése**

* **Leírás:** Ellenőrzi, hogy az induló csoportok adatai helyesen betöltődnek és megjelennek-e a táblázatban.
* **Előfeltételek:**
    1. Az `index.html` oldal be van töltve.
    2. A backend (`http://localhost:5000/public/csoportok`) elérhető és érvényes adatokat szolgáltat.
* **Tesztlépések:**
    1. Navigáljon a "Jelentkezés" szekcióhoz.
    2. Figyelje meg az "Induló csoportok" táblázatot.
* **Elvárt eredmény:**
    1. A `tesztadatok.sql` alapján a következő, még nem elindult csoportok jelennek meg:
        * csid=3 (Junior Java backend fejlesztő, 2025-09-07, 0 szabad hely)
        * csid=4 (Junior Java backend fejlesztő, 2025-09-10, 2 szabad hely)
        * csid=5 (Junior fullstack fejlesztő, 2025-09-10, 8 szabad hely)
    2. A táblázat fejlécei: "Azonosító", "Képzés", "Indulás", "Beosztás", "Szabad hely", "Ár (Ft)".
    3. A "Szabad hely" oszlop értéke `8 - letszam` alapján van kiszámolva.
    4. Az "Ár (Ft)" oszlop értéke helyi formátumban (ezres tagolással) jelenik meg.

**TC_PUB_010: Induló csoportok táblázat betöltési hiba kezelése**

* **Leírás:** Ellenőrzi a felhasználói felület viselkedését, ha a csoportadatok lekérése sikertelen.
* **Előfeltételek:**
    1. Az `index.html` oldal be van töltve.
    2. A backend (`http://localhost:5000/public/csoportok`) nem elérhető vagy hibát ad vissza.
    Ehhez blokkolni kell a böngésző fejlesztői eszközök Network lapján az adott címet.
* **Tesztlépések:**
    1. Navigáljon a "Jelentkezés" szekcióhoz.
    2. Figyelje meg az "Induló csoportok" táblázatot.
    3. Ellenőrizze a böngésző konzolját.
* **Elvárt eredmény:**
    1. A táblázatban a következő üzenet jelenik meg: "Hiba történt a csoportok betöltésekor. Kérjük, próbálja újra később."
    2. A böngésző konzoljában hibaüzenet látható (pl. "Hiba a csoportok feldolgozása közben: [HTTP_STATUS_CODE]").

### 3. Jelentkezési űrlap működése

**TC_PUB_011: Sikeres jelentkezés érvényes adatokkal**

* **Leírás:** Ellenőrzi a jelentkezési folyamat sikerességét minden kötelező mező helyes kitöltésével, egy olyan csoportba, ahol van szabad hely.
* **Előfeltételek:**
    1. Az `index.html` oldal be van töltve.
    2. Az "Induló csoportok" táblázat sikeresen betöltődött. A `tesztadatok.sql` alapján a `csid=4` csoportnak 2 szabad helye van, a `csid=5` csoportnak 8.
    4. A backend (`http://localhost:5000/public/jelentkezok`) elérhető és készen áll a POST kérések fogadására.
* **Tesztlépések:**
    1. Adjon meg egy érvényes "Csoport azonosítója"-t, ahol van szabad hely (pl. 4 vagy 5).
    2. Töltse ki a "Név" mezőt.
    3. Töltse ki a "Születési név" mezőt (opcionális, lehet azonos a névvel).
    4. Adjon meg érvényes "Születési idő"-t (pl. "1990-01-01").
    5. Töltse ki a "Születési hely" mezőt.
    6. Töltse ki az "Anyja neve" mezőt.
    7. Töltse ki a "Cím" mezőt.
    8. Adjon meg érvényes "Telefon"-t.
    9. Adjon meg érvényes "E-mail"-t.
    10. Jelölje be a "Vállalom a tandíj befizetését." jelölőnégyzetet.
    11. Kattintson a "Jelentkezem" gombra.
* **Elvárt eredmény:**
    1. Az `uzenet` elemben a szerver által küldött sikeres üzenet jelenik meg ("Sikeres jelentkezés!").
    2. A "Jelentkezem" gomb letiltódik.
    3. Az "Induló csoportok" táblázat frissül (a kiválasztott csoportnál a "Szabad hely" csökkenhet).
    4. A böngésző konzoljában nincs hiba.
    5. Az adatbázisban megjelenik az új jelentkező.

**TC_PUB_012: Jelentkezés hiányzó kötelező mezőkkel**

* **Leírás:** Ellenőrzi, hogy a rendszer megfelelően kezeli-e, ha egy vagy több kötelező mező üresen marad.
* **Előfeltételek:** Az `index.html` oldal be van töltve.
* **Tesztlépések:**
    1. Hagyja üresen a "Név" mezőt.
    2. Töltse ki a többi mezőt tetszőlegesen.
    3. Jelölje be a "Vállalom a tandíj befizetését." jelölőnégyzetet.
    4. Kattintson a "Jelentkezem" gombra.
* **Elvárt eredmény:**
    1. Az `uzenet` elemben egy hibaüzenet jelenik meg, amely jelzi a hiányzó vagy érvénytelen mező(ke)t.
    2. Az űrlap nem kerül beküldésre a szervernek.
    3. A "Jelentkezem" gomb aktív marad.
    4. Az adatbázis nem változik.

**TC_PUB_013: Jelentkezés a tandíj vállalása nélkül**

* **Leírás:** Ellenőrzi, hogy a rendszer hibaüzenetet ad-e, ha a tandíjbefizetés vállalása jelölőnégyzet nincs bejelölve.
* **Előfeltételek:** Az `index.html` oldal be van töltve.
* **Tesztlépések:**
    1. Töltse ki az összes kötelező mezőt érvényes adatokkal.
    2. Ne jelölje be a "Vállalom a tandíj befizetését." jelölőnégyzetet.
    3. Kattintson a "Jelentkezem" gombra.
* **Elvárt eredmény:**
    1. Az `uzenet` elemben egy hibaüzenet jelenik meg, amely jelzi, hogy a jelölőnégyzetet be kell jelölni (az `ellenoriz()` függvény visszatérési értéke).
    2. Az űrlap nem kerül beküldésre a szervernek.
    3. A "Jelentkezem" gomb aktív marad.
    4. Az adatbázis nem változik.

**TC_PUB_014: Jelentkezés nem létező csoportba**

* **Leírás:** Ellenőrzi a rendszer viselkedését, ha a megadott csoportazonosítóval nem létezik csoport.
* **Előfeltételek:**
    1. Az `index.html` oldal be van töltve.
    2. Minden egyéb űrlapmező helyesen van kitöltve, a jelölőnégyzet be van jelölve.
    3. A backend (`http://localhost:5000/public/jelentkezok`) elérhető.
* **Tesztlépések:**
    1. Adjon meg egy nem létező "Csoport azonosítója"-t (pl. 99).
    2. Töltse ki a többi kötelező mezőt érvényes adatokkal.
    3. Jelölje be a "Vállalom a tandíj befizetését." jelölőnégyzetet.
    4. Kattintson a "Jelentkezem" gombra.
    5. Ellenőrizze a böngésző konzolját.
* **Elvárt eredmény:**
    1. Az `uzenet` elemben a "Ebbe a csoportba nem lehet jelentkezni." üzenet jelenik meg.
    2. A böngésző konzoljában hibaüzenet látható ("Hiba jelentkezéskor: Ebbe a csoportba nem lehet jelentkezni.").
    3. A "Jelentkezem" gomb aktív marad.

**TC_PUB_015: Jelentkezés már elindult csoportba**

* **Leírás:** Ellenőrzi a rendszer viselkedését, ha a felhasználó egy már elindult csoportba próbál jelentkezni.
* **Előfeltételek:**
    1. Az `index.html` oldal be van töltve.
    2. A `tesztadatok.sql` alapján a `csid=1` csoport már elindult (`indulas: 2024-09-08`).
    3. Minden egyéb űrlapmező helyesen van kitöltve, a jelölőnégyzet be van jelölve.
    4. A backend (`http://localhost:5000/public/jelentkezok`) elérhető.
* **Tesztlépések:**
    1. Adja meg a "Csoport azonosítója"-nak az `1`-et.
    2. Töltse ki a többi kötelező mezőt érvényes adatokkal.
    3. Jelölje be a "Vállalom a tandíj befizetését." jelölőnégyzetet.
    4. Kattintson a "Jelentkezem" gombra.
    5. Ellenőrizze a böngésző konzolját.
* **Elvárt eredmény:**
    1. Az `uzenet` elemben az "Ebbe a csoportba nem lehet jelentkezni." üzenet jelenik meg.
    2. A böngésző konzoljában hibaüzenet látható ("Hiba jelentkezéskor: Ebbe a csoportba nem lehet jelentkezni.").
    3. A "Jelentkezem" gomb aktív marad.

**TC_PUB_016: Jelentkezés teli csoportba**

* **Leírás:** Ellenőrzi a rendszer viselkedését, ha a felhasználó egy már betelt csoportba próbál jelentkezni.
* **Előfeltételek:**
    1. Az `index.html` oldal be van töltve.
    2. A `tesztadatok.sql` és az `index.js` `max = 8` alapján a `csid=3` csoport tele van (8 fő jelentkezett). Az "Induló csoportok" táblázatban a `csid=3` mellett 0 szabad helynek kell megjelennie.
    3. Minden egyéb űrlapmező helyesen van kitöltve, a jelölőnégyzet be van jelölve.
    4. A backend (`http://localhost:5000/public/jelentkezok`) elérhető.
* **Tesztlépések:**
    1. Adja meg a "Csoport azonosítója"-nak a `3`-at.
    2. Töltse ki a többi kötelező mezőt érvényes adatokkal.
    3. Jelölje be a "Vállalom a tandíj befizetését." jelölőnégyzetet.
    4. Kattintson a "Jelentkezem" gombra.
    5. Ellenőrizze a böngésző konzolját.
* **Elvárt eredmény:**
    1. Az `uzenet` elemben "A csoport megtelt, maximum 8 fő jelentkezhet." üzenet jelenik meg.
    2. A böngésző konzoljában hibaüzenet látható (pl. "Hiba jelentkezéskor: A csoport megtelt, maximum 8 fő jelentkezhet").
    3. A "Jelentkezem" gomb aktív marad.

**TC_PUB_017: Dupla jelentkezés ugyanabba a csoportba ugyanazzal az e-mail címmel**

* **Leírás:** Ellenőrzi, hogy a rendszer kezeli-e, ha egy felhasználó ugyanazzal az e-mail címmel próbál meg ismételten jelentkezni ugyanarra a csoportra.
* **Előfeltételek:**
    1. Egy sikeres jelentkezés már megtörtént egy adott csoportba (pl. `csid=4`) egy adott e-mail címmel a `TC_PUB_011` végrehajtása után.
    2. Az `index.html` oldal be van töltve.
    3. Az "Induló csoportok" táblázat sikeresen betöltődött.
    4. A backend (`http://localhost:5000/public/jelentkezok`) elérhető.
* **Tesztlépések:**
    1. Adja meg ugyanazt a "Csoport azonosítója"-t, mint a korábbi sikeres jelentkezésnél (pl. 4).
    2. Töltse ki a "Név" mezőt (lehet más, mint az előző).
    3. Adja meg ugyanazt az "E-mail"-t, mint a korábbi sikeres jelentkezésnél.
    4. Töltse ki a többi kötelező mezőt érvényes adatokkal.
    5. Jelölje be a "Vállalom a tandíj befizetését." jelölőnégyzetet.
    6. Kattintson a "Jelentkezem" gombra.
    7. Ellenőrizze a böngésző konzolját.
* **Elvárt eredmény:**
    1. Az `uzenet` elemben az "Ezzel az e-mail címmel már jelentkeztek erre a csoportra." üzenet jelenik meg.
    2. A böngésző konzoljában hibaüzenet látható (pl. "Hiba jelentkezéskor: Ezzel az e-mail címmel már jelentkeztek erre a csoportra.").
    3. A "Jelentkezem" gomb aktív marad.

### 4. Adminisztrátori bejelentkezési kísérlet (a nyilvános oldalról)

**TC_PUB_018: Adminisztrátori bejelentkezési kísérlet helytelen jelszóval**

* **Leírás:** Ellenőrzi a bejelentkezési kísérletet hibás jelszóval a nyilvános oldalon található űrlapon.
* **Előfeltételek:**
    1. Az `index.html` oldal be van töltve.
    2. A backend (`http://localhost:5000/admin`) elérhető.
* **Tesztlépések:**
    1. Görgessen az oldal alján található "Adminisztrátor jelszó" űrlaphoz.
    2. Írjon be egy helytelen jelszót az "Adminisztrátor jelszó" mezőbe.
    3. Kattintson a "Bejelentkezés" gombra.
    4. Ellenőrizze a böngésző konzolját.
* **Elvárt eredmény:**
    1. Az `uzenet2` elemben a "Hibás jelszó!" üzenet jelenik meg.
    2. A böngésző konzoljában hibaüzenet látható (pl. "Fetch hiba a bejelentkezésnél: [HTTP_STATUS_CODE]", tipikusan 401 vagy 403).
    3. A felhasználó nem kerül átirányításra a `csoportok.html` oldalra.

**TC_PUB_019: Adminisztrátori bejelentkezési kísérlet helyes jelszóval**

* **Leírás:** Ellenőrzi a sikeres bejelentkezést és átirányítást helyes jelszóval.
* **Előfeltételek:**
    1. Az `index.html` oldal be van töltve.
    2. A backend (`http://localhost:5000/admin`) elérhető.
    3. Ismert egy érvényes adminisztrátori jelszó.
* **Tesztlépések:**
    1. Görgessen az oldal alján található "Adminisztrátor jelszó" űrlaphoz.
    2. Írja be a helyes jelszót (TanfAdmin!2025) az "Adminisztrátor jelszó" mezőbe.
    3. Kattintson a "Bejelentkezés" gombra.
* **Elvárt eredmény:**
    1. Az `uzenet2` elemben rövid időre megjelenik a szerver által küldött sikeres üzenet (pl. "Sikeres bejelentkezés").
    2. A `sessionStorage.token` beállításra kerül a szervertől kapott tokennel.
    3. A böngésző átirányít a `csoportok.html` oldalra.

### 5. Lábléc navigációs linkek

**TC_PUB_020: Lábléc navigáció a "Junior frontend fejlesztő" szekcióra**

* **Leírás:** Ellenőrzi a láblécben található Frontend link működését.
* **Előfeltételek:** Az `index.html` oldal be van töltve.
* **Tesztlépések:**
    1. Görgessen az oldal láblécéhez.
    2. Kattintson a "Junior frontend fejlesztő;" linkre.
* **Elvárt eredmény:**
    1. Az oldal a "Junior frontend fejlesztő" szekcióhoz görget.

**TC_PUB_021: Lábléc navigáció a "Junior Java backend fejlesztő" szekcióra**

* **Leírás:** Ellenőrzi a láblécben található Backend link működését.
* **Előfeltételek:** Az `index.html` oldal be van töltve.
* **Tesztlépések:**
    1. Görgessen az oldal láblécéhez.
    2. Kattintson a "Junior Java backend fejlesztő" linkre.
* **Elvárt eredmény:**
    1. Az oldal a "Junior Java backend fejlesztő" szekcióhoz görget.

**TC_PUB_022: Lábléc navigáció a "Junior fullstack fejlesztő" szekcióra**

* **Leírás:** Ellenőrzi a láblécben található Fullstack link működését.
* **Előfeltételek:** Az `index.html` oldal be van töltve.
* **Tesztlépések:**
    1. Görgessen az oldal láblécéhez.
    2. Kattintson a "Junior fullstack fejlesztő" linkre.
* **Elvárt eredmény:**
    1. Az oldal a "Junior fullstack fejlesztő" szekcióhoz görget.

**TC_PUB_023: Lábléc navigáció a "Jelentkezés" szekcióra**

* **Leírás:** Ellenőrzi a láblécben található Jelentkezés link működését.
* **Előfeltételek:** Az `index.html` oldal be van töltve.
* **Tesztlépések:**
    1. Görgessen az oldal láblécéhez.
    2. Kattintson a "Jelentkezés" linkre.
* **Elvárt eredmény:**
    1. Az oldal a "Jelentkezés" szakaszhoz görget.

### 6. Reszponzivitás

**TC_PUB_024: Reszponzív elrendezés ellenőrzése különböző képernyőméreteken**

* **Leírás:** Ellenőrzi az oldal megjelenését és használhatóságát különböző képernyőméreteken.
* **Előfeltételek:** Az `index.html` oldal be van töltve.
* **Tesztlépések:**
    1. Nyissa meg a böngésző fejlesztői eszközeit.
    2. Méretezze át a nézetablakot különböző eszközök szimulálásához (mobil, tablet, desktop).
    3. Különösen figyelje meg:
        * A navigációs sáv viselkedését (összecsukódás 768 picelnél keskenyebb képernyőkön).
        * A tartalmi oszlopok tördelését (Bootstrap sorok viselkedése).
        * Az `img/software3.jpg` (Backend) és `img/software2.jpg` (Fullstack) képek elrejtését kisebb (`<lg`) képernyőkön.
* **Elvárt eredmény:**
    1. Az elrendezés használható és olvasható marad minden tesztelt képernyőméreten.
    2. A navigációs elemek megfelelően alkalmazkodnak.
    3. A tartalom nem csúszik egymásra, nem válik olvashatatlanná.
    4. A megadott képek helyesen jelennek meg vagy rejtődnek el a képernyőméretnek megfelelően.
