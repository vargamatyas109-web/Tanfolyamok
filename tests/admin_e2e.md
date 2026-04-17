Adminisztrációs funkciók tesztesetei
------------------------------------

### 1. Bejelentkezés

* * *

**Teszt ID:** ADM_TC_001

**Teszt megnevezése:** Bejelentkezés - Sikeres bejelentkezés

**Előfeltételek:**

1. A tesztadatok betöltve az adatbázisba.
2. A webalkalmazás fut.
3. A felhasználó az `index.html` oldalon van.

**Lépések:**

1. Görgessen le az "Adminisztráció" szekcióhoz.
2. Írja be a helyes jelszót a "Jelszó" mezőbe.
3. Kattintson a "Belépés" gombra.

**Tesztadatok:**

* Jelszó: `AdminJelszo`

**Elvárt eredmény:**

1. A felhasználó átirányításra kerül a `csoportok.html` oldalra.
2. Az oldalon megjelennek az adminisztrációs funkciók (új csoport hozzáadása űrlap, csoportok listája).
3. A `sessionStorage.token` sikeresen beállításra kerül.

* * *

**Teszt ID:** ADM_TC_002

**Teszt megnevezése:** Bejelentkezés - Sikertelen bejelentkezés hibás jelszóval

**Előfeltételek:**

1. A tesztadatok betöltve az adatbázisba.
2. A webalkalmazás fut.
3. A felhasználó az `index.html` oldalon van.

**Lépések:**

1. Görgessen le az "Adminisztráció" szekcióhoz.
2. Írja be a helytelen jelszót a "Jelszó" mezőbe.
3. Kattintson a "Belépés" gombra.

**Tesztadatok:**

* Jelszó: `hibasJelszo123`

**Elvárt eredmény:**

1. A felhasználó az `index.html` oldalon marad.
2. Az "Adminisztráció" szekcióban, a "Belépés" gomb alatt megjelenik a "Hibás jelszó!" hibaüzenet.

* * *

### 2. Csoportok kezelése (`csoportok.html`)

**Általános előfeltétel a csoportkezelési tesztekhez:** A felhasználó sikeresen bejelentkezett adminként és a `csoportok.html` oldalon van.

* * *

**Teszt ID:** ADM_TC_003

**Teszt megnevezése:** Csoportok - Lista megjelenítése

**Előfeltételek:**

1. Sikeres admin bejelentkezés.
2. A felhasználó a `csoportok.html` oldalon van.

**Lépések:**

1. Figyelje meg az oldal betöltődésekor a "Csoportok listája" táblázatot.

**Tesztadatok:**

* N/A

**Elvárt eredmény:**

1. A táblázat megjeleníti a `tesztadatok.sql`-ben definiált 5 csoportot.
2. Minden sor tartalmazza:
   * Azon
   * Képzés
   * Indulás
   * Beosztás
   * Helyszín
   * Ár (Ft)
   * Fő
   * Jelentkezők gomb
   * Módosítás gomb
   * Törlés gomb
3. Az árak helyesen formázva (pl. 390 000).
4. A létszámok helyesen jelennek meg (`csid=1` esetén 2 fő, `csid=3` esetén 8 fő).
5. A csoportok indulás szerint csökkenő sorrendben jelennek meg.

* * *

**Teszt ID:** ADM_TC_004

**Teszt megnevezése:** Csoportok - Új csoport hozzáadása - Sikeres

**Előfeltételek:**

1. Sikeres admin bejelentkezés.
2. A felhasználó a `csoportok.html` oldalon van.

**Lépések:**

1. Töltse ki az "Új csoport felvétele" űrlap mezőit érvényes adatokkal.
2. Kattintson a "Hozzáad" gombra.

**Tesztadatok:**

* Képzés: Junior fullstack fejlesztő (kid=3)
* Indulás dátuma: 2026-03-15
* Beosztás: Hétfő-Szerda 09:00-12:00
* Helyszín: Online
* Ár: 550000

**Elvárt eredmény:**

1. Az "Új csoport felvétele" űrlap mezői törlődnek.
2. A "Csoportok listája" frissül, és az új csoport megjelenik a listában a megadott adatokkal és 0 fő létszámmal.
3. Nincs hibaüzenet.
4. Az új csoport az adatbázisba is bekerül.

* * *

**Teszt ID:** ADM_TC_005

**Teszt megnevezése:** Csoportok - Új csoport hozzáadása - Hiányzó kötelező mezők

**Előfeltételek:**

1. Sikeres admin bejelentkezés.
2. A felhasználó a `csoportok.html` oldalon van.

**Lépések:**

1. Válasszon ki egy képzést az "Új csoport felvétele" űrlapon.
2. Hagyja üresen a "Beosztás" mezőt.
3. Töltse ki a többi mezőt (pl. Indulás dátuma, Helyszín, Ár).
4. Kattintson a "Hozzáad" gombra.

**Tesztadatok:**

* Képzés: Junior frontend fejlesztő (kid=1)
* Indulás dátuma: (aktuális dátum)
* Beosztás: (üres)
* Helyszín: Tanterem
* Ár: 300000

**Elvárt eredmény:**

1. Egy felugró ablak (alert) jelenik meg hibaüzenettel ("400 Hiányzó kötelező mezők."
2. Az űrlap mezői nem ürülnek ki.
3. Az új csoport nem kerül hozzáadásra a listához.

* * *

**Teszt ID:** ADM_TC_006

**Teszt megnevezése:** Csoportok - Új csoport hozzáadása - Érvénytelen ár (negatív)

**Előfeltételek:**

1. Sikeres admin bejelentkezés.
2. A felhasználó a `csoportok.html` oldalon van.

**Lépések:**

1. Töltse ki az "Új csoport felvétele" űrlapot érvényes adatokkal, de az "Ár" mezőbe negatív értéket írjon.
2. Kattintson a "Hozzáad" gombra.

**Tesztadatok:**

* Képzés: Junior Java backend fejlesztő (kid=2)
* Indulás dátuma: 2026-04-01
* Beosztás: Kedd 17-20
* Helyszín: Online
* Ár: -50000

**Elvárt eredmény:**

1. Egy felugró ablak (alert) jelenik meg hibaüzenettel ("400 Az ár nem lehet negatív.").
2. Az űrlap mezői nem ürülnek ki.
3. Az új csoport nem kerül hozzáadásra a listához.

* * *

**Teszt ID:** ADM_TC_007

**Teszt megnevezése:** Csoportok - Csoport módosítása - Navigáció a módosító oldalra

**Előfeltételek:**

1. Sikeres admin bejelentkezés.
2. A felhasználó a `csoportok.html` oldalon van.
3. Létezik legalább egy csoport a listában (pl. `csid=1`).

**Lépések:**

1. Kattintson a `csid=1` azonosítójú csoport sorában a "Módosítás" gombra.

**Tesztadatok:**

* N/A

**Elvárt eredmény:**

1. A felhasználó átirányításra kerül a `modosit.html` oldalra.
2. A `sessionStorage.csid` értéke `1`-re van állítva.
3. A `modosit.html` oldalon az űrlapmezők kitöltődnek a `csid=1` csoport adataival (Képzés, Indulás dátuma, Beosztás, Helyszín, Ár).

* * *

**Teszt ID:** ADM_TC_008

**Teszt megnevezése:** Csoport módosítása - Adatok sikeres módosítása

**Előfeltételek:**

1. Sikeres admin bejelentkezés.
2. A felhasználó a `modosit.html` oldalon van, a `csid=1` csoport adataival betöltve.

**Lépések:**

1. Módosítsa a "Beosztás" mező értékét.
2. Módosítsa az "Ár" mező értékét.
3. Kattintson a "Módosít" gombra.

**Tesztadatok (csid=1 módosítása):**

* Eredeti Beosztás: szerda-péntek 17-20 óráig
* Módosított Beosztás: Kedd-Csütörtök 18:00-21:00
* Eredeti Ár: 390000
* Módosított Ár: 400000

**Elvárt eredmény:**

1. A felhasználó visszairányításra kerül a `csoportok.html` oldalra.
2. A `csoportok.html` oldalon a `csid=1` csoport adatai frissültek a megadott új értékekkel (Beosztás, Ár).
3. A módosítás az adatbázisban is megtörténik.

* * *

**Teszt ID:** ADM_TC_009

**Teszt megnevezése:** Csoport módosítása - Módosítás érvénytelen árral (negatív)

**Előfeltételek:**

1. Sikeres admin bejelentkezés.
2. A felhasználó a `modosit.html` oldalon van, a `csid=1` csoport adataival betöltve.

**Lépések:**

1. Módosítsa az "Ár" mező értékét negatív számra.
2. Kattintson a "Módosít" gombra.

**Tesztadatok (csid=1 módosítása):**

* Módosított Ár: -50000

**Elvárt eredmény:**

1. Egy felugró ablak (alert) jelenik meg hibaüzenettel (pl. "Hiba a csoport módosításakor: Az ár nem lehet negatív."
2. A felhasználó a `modosit.html` oldalon marad.
3. Az űrlap mezőiben a bevitt (hibás) érték marad.

* * *

**Teszt ID:** ADM_TC_010

**Teszt megnevezése:** Csoport módosítása - "Vissza" gomb funkcionalitása

**Előfeltételek:**

1. Sikeres admin bejelentkezés.
2. A felhasználó a `modosit.html` oldalon van.

**Lépések:**

1. Kattintson a "Vissza a csoportokhoz" gombra.

**Tesztadatok:**

* N/A

**Elvárt eredmény:**

1. A felhasználó visszairányításra kerül a `csoportok.html` oldalra.
2. Nem történik adatmentés, az esetlegesen módosított, de nem mentett adatok elvesznek.

* * *

**Teszt ID:** ADM_TC_011

**Teszt megnevezése:** Csoportok - Csoport törlése - Sikeres törlés (üres csoport)

**Előfeltételek:**

1. Sikeres admin bejelentkezés.
2. A felhasználó a `csoportok.html` oldalon van.

**Lépések:**

1. Hozzon létre egy új, üres csoportot az ADM_TC_004 lépései szerint.
   * Példa adatok: Képzés: Junior frontend, Indulás: 2027-01-01, Beosztás: "Törlendő teszt", Helyszín: "Teszt", Ár: 100000.
2. Keresse meg ezt az újonnan létrehozott, üres csoportot a listában.
3. Jegyezze fel az új csoport ID-ját (pl. `csid=7`).
4. Kattintson a "Törlés" gombra ennél a csoportnál.
5. A megjelenő megerősítő párbeszédablakban ("Biztosan törölni szeretnéd ezt a csoportot?") kattintson az "OK" gombra.

**Tesztadatok:**

* Törlendő csoport: Az 1-2. lépésben létrehozott új, üres csoport.

**Elvárt eredmény:**

1. A megerősítő párbeszédablak megjelenik.
2. A csoport eltávolításra kerül a "Csoportok listája" táblázatból.
3. Nincs hibaüzenet.
4. A törlés az adatbázisban is megtörténik.

* * *

**Teszt ID:** ADM_TC_012

**Teszt megnevezése:** Csoportok - Csoport törlése - Törlés megszakítása

**Előfeltételek:**

1. Sikeres admin bejelentkezés.
2. A felhasználó a `csoportok.html` oldalon van.
3. Létezik egy üres csoport (pl. az ADM_TC_011 lépés 1-2. alapján létrehozott, de még nem törölt).

**Lépések:**

1. Keresse meg az üres csoportot a listában.
2. Kattintson a "Törlés" gombra ennél a csoportnál.
3. A megjelenő megerősítő párbeszédablakban ("Biztosan törölni szeretnéd ezt a csoportot?") kattintson a "Mégse" (vagy "Nem") gombra.

**Tesztadatok:**

* Csoport: Az ADM_TC_011 lépés 1-2. alapján létrehozott csoport.

**Elvárt eredmény:**

1. A megerősítő párbeszédablak megjelenik.
2. A csoport nem kerül törlésre, továbbra is látható a listában.

* * *

**Teszt ID:** ADM_TC_013

**Teszt megnevezése:** Csoportok - Csoport törlése - Sikertelen törlés (nem üres csoport)

**Előfeltételek:**

1. Sikeres admin bejelentkezés.
2. A felhasználó a `csoportok.html` oldalon van.
3. Létezik egy csoport, amelyhez vannak jelentkezők (pl. `csid=1`, amelyhez a tesztadatok szerint 2 jelentkező tartozik).

**Lépések:**

1. Keresse meg a `csid=1` azonosítójú csoportot a listában.
2. Kattintson a "Törlés" gombra ennél a csoportnál.

**Tesztadatok:**

* Törlendő csoport: `csid=1`

**Elvárt eredmény:**

1. Egy felugró ablak (alert) jelenik meg a "Csak üres csoport törölhető!" üzenettel.
2. A csoport nem kerül törlésre, továbbra is látható a listában.
3. A megerősítő párbeszédablak nem jelenik meg.

* * *

**Teszt ID:** ADM_TC_014

**Teszt megnevezése:** Csoportok - Jelentkezők listázása - Navigáció a jelentkezők oldalra

**Előfeltételek:**

1. Sikeres admin bejelentkezés.
2. A felhasználó a `csoportok.html` oldalon van.
3. Létezik a `csid=1` csoport.

**Lépések:**

1. Kattintson a `csid=1` azonosítójú csoport sorában a "Jelentkezők" gombra.

**Tesztadatok:**

* N/A

**Elvárt eredmény:**

1. A felhasználó átirányításra kerül a `jelentkezok.html` oldalra.
2. A `sessionStorage.csid` értéke `1`-re van állítva.
3. A `jelentkezok.html` oldalon megjelenik a "Csoport azonosító: 1" felirat.
4. A jelentkezők listája betöltődik a `csid=1` csoporthoz.

* * *

### 3. Jelentkezők kezelése (`jelentkezok.html`)

**Általános előfeltétel a jelentkezőkezelési tesztekhez:** A felhasználó sikeresen bejelentkezett adminként, kiválasztott egy csoportot a `csoportok.html` oldalon (pl. `csid=1`), és a `jelentkezok.html` oldalon van. A `sessionStorage.csid` be van állítva erre a csoportra.

* * *

**Teszt ID:** ADM_TC_015

**Teszt megnevezése:** Jelentkezők - Lista megjelenítése egy adott csoporthoz

**Előfeltételek:**

1. Sikeres admin bejelentkezés.
2. A felhasználó a `jelentkezok.html` oldalon van.
3. `sessionStorage.csid=1`.

**Lépések:**

1. Figyelje meg az oldal betöltődésekor a "Jelentkezők listája" táblázatot.

**Tesztadatok:**

* N/A

**Elvárt eredmény:**

1. A "Csoport azonosító: 1" felirat megjelenik.
2. A táblázat megjeleníti a `csid=1` csoporthoz tartozó 2 jelentkezőt (Kiss Gizella, Nagy Béla) a `tesztadatok.sql` alapján.
3. Minden sor tartalmazza:
   * Név
   * Születési név
   * Idő (születési)
   * Hely (születési)
   * Anyja neve
   * Cím
   * Telefon
   * email
   * Módosítás gomb
   * Törlés gomb
4. A "Létszám: 2 fő" felirat megjelenik.

* * *

**Teszt ID:** ADM_TC_016

**Teszt megnevezése:** Jelentkezők - Új jelentkező hozzáadása - Sikeres

**Előfeltételek:**

1. Sikeres admin bejelentkezés.
2. A felhasználó a `jelentkezok.html` oldalon van.
3. `sessionStorage.csid=4`.
4. A `csid=4` csoportnak jelenleg 6 jelentkezője van (a maximális létszám 8), és ezután indul.

**Lépések:**

1. Töltse ki az "Új jelentkező felvétele" űrlap mezőit érvényes adatokkal.
2. Kattintson a "Hozzáad" gombra.

**Tesztadatok:**

* Név: Admin Tesztelő
* Születési név: Admin Tesztelő
* Születési idő: 1990-05-15
* Születési hely: Próbaváros
* Anyja neve: Minta Anna
* Lakcím: 1234 Tesztváros, Minta utca 7.
* Telefonszám: +36301234567
* Email: adminteszter@example.com

**Elvárt eredmény:**

1. Az "Új jelentkező felvétele" űrlap mezői kiürülnek.
2. A "Jelentkezők listája" frissül, és az új jelentkező megjelenik a listában a megadott adatokkal.
3. A "Létszám" frissül 7 főre.
4. Nincs hibaüzenet.
5. Az új jelentkező az adatbázisba is bekerül.

* * *

**Teszt ID:** ADM_TC_017

**Teszt megnevezése:** Jelentkezők - Új jelentkező hozzáadása - Már jelentkezett ezzel az email-lel

**Előfeltételek:**

1. Sikeres admin bejelentkezés.
2. A felhasználó a `jelentkezok.html` oldalon van.
3. `sessionStorage.csid=4`.

**Lépések:**

1. Töltse ki az "Új jelentkező felvétele" űrlapot ugyanúgy, mint az előző tesztben.
2. Kattintson a "Hozzáad" gombra.

**Tesztadatok:**

* Név: Admin Tesztelő
* Születési név: Admin Tesztelő
* Születési idő: 1990-05-15
* Születési hely: Próbaváros
* Anyja neve: Minta Anna
* Lakcím: 1234 Tesztváros, Minta utca 7.
* Telefonszám: +36301234567
* Email: adminteszter@example.com

**Elvárt eredmény:**

1. Egy felugró ablak (alert) jelenik meg a "Hiba: 409 Ezzel az e-mail címmel már jelentkeztek ebbe a csoportba." hibaüzenettel.
2. Az űrlap mezői nem ürülnek ki.
3. Az új jelentkező nem kerül hozzáadásra a listához.
4. A létszám nem változik.

* * *

**Teszt ID:** ADM_TC_018

**Teszt megnevezése:** Jelentkezők - Új jelentkező hozzáadása - Csoport betelt

**Előfeltételek:**

1. Sikeres admin bejelentkezés.
2. A felhasználó a `jelentkezok.html` oldalon van.
3. A `sessionStorage.csid` egy olyan csoportra van állítva, amely már 8 jelentkezővel rendelkezik (pl. `csid=3` a tesztadatokból).

**Lépések:**

1. Töltse ki az "Új jelentkező felvétele" űrlapot érvényes adatokkal.
2. Kattintson a "Hozzáad" gombra.

**Tesztadatok:**

* (Bármilyen érvényes adat, pl. az ADM_TC_016-ban megadottak)

**Elvárt eredmény:**

1. Egy felugró ablak (alert) jelenik meg a "Hiba: 409 A csoport megtelt, maximum 8 fő jelentkezhet." hibaüzenettel.
2. Az űrlap mezői nem ürülnek ki.
3. Az új jelentkező nem kerül hozzáadásra a listához.
4. A létszám nem változik (marad 8 fő).

* * *

**Teszt ID:** ADM_TC_018A

**Teszt megnevezése:** Jelentkezők - Új jelentkező hozzáadása - Csoport már elindult

**Előfeltételek:**

1. Sikeres admin bejelentkezés.
2. A felhasználó a `jelentkezok.html` oldalon van.
3. A `sessionStorage.csid` egy olyan csoportra van állítva, amelynek az indulási dátuma már a múltban van (pl. `csid=1` a `tesztadatok.sql`-ből, indulás: `2024-09-02`, feltételezve, hogy a teszt futtatásakor ez a dátum már elmúlt).
4. A csoportnak van még szabad helye (pl. `csid=1` esetén 2/8 fő).

**Lépések:**

1. Töltse ki az "Új jelentkező felvétele" űrlap mezőit érvényes adatokkal.
2. Kattintson a "Hozzáad" gombra.

**Tesztadatok:**

* Csoport ID (`sessionStorage.csid`): `1` (vagy más, már elindult, de nem telt csoport)
* Jelentkező adatai:
  * Név: Későn Érkező
  * Születési név: Későn Érkező
  * Születési idő: 1995-01-01
  * Születési hely: Halasztó
  * Anyja neve: Váró Vera
  * Lakcím: 6789 Későfalva, Utolsó utca 1.
  * Telefonszám: +36309998877
  * Email: keso@example.com

**Elvárt eredmény:**

1. Egy felugró ablak (alert) jelenik meg a "Ebbe a csoportba nem lehet jelentkezni." hibaüzenettel.
2. Az űrlap mezői nem ürülnek ki.
3. Az új jelentkező nem kerül hozzáadásra a listához.
4. A létszám nem változik.

* * *

**Teszt ID:** ADM_TC_019

**Teszt megnevezése:** Jelentkezők - Jelentkező módosítása - Navigáció a módosító oldalra
* * *

**Teszt ID:** ADM_TC_019

**Teszt megnevezése:** Jelentkezők - Jelentkező módosítása - Navigáció a módosító oldalra

**Előfeltételek:**

1. Sikeres admin bejelentkezés.
2. A felhasználó a `jelentkezok.html` oldalon van.
3. `sessionStorage.csid=1`.
4. Létezik legalább egy jelentkező a listában (pl. Kiss Gizella, `jid=1`).

**Lépések:**

1. Kattintson a `jid=1` azonosítójú (Kiss Gizella) jelentkező sorában a "Módosítás" gombra.

**Tesztadatok:**

* N/A

**Elvárt eredmény:**

1. A felhasználó átirányításra kerül a `jmodosit.html` oldalra.
2. A `sessionStorage.jid` értéke `1`-re van állítva.
3. A `jmodosit.html` oldalon az űrlapmezők kitöltődnek a `jid=1` jelentkező adataival.

* * *

**Teszt ID:** ADM_TC_020

**Teszt megnevezése:** Jelentkező módosítása - Adatok sikeres módosítása

**Előfeltételek:**

1. Sikeres admin bejelentkezés.
2. A felhasználó a `jmodosit.html` oldalon van, a `jid=1` (Kiss Gizella) adataival betöltve.
3. `sessionStorage.csid=1`.

**Lépések:**

1. Módosítsa a "Lakcím" mező értékét.
2. Módosítsa az "Email" mező értékét.
3. Kattintson a "Módosít" gombra.

**Tesztadatok (jid=1 módosítása):**

* Eredeti Lakcím: 1011 Budapest, Vár u. 11.
* Módosított Lakcím: 1111 Budapest, Új utca 1.
* Eredeti Email: kissg@freemail.hu
* Módosított Email: kiss.gizella.uj@example.com

**Elvárt eredmény:**

1. A felhasználó visszairányításra kerül a `jelentkezok.html` oldalra (a `sessionStorage.csid=1` alapján a `csid=1` csoport jelentkezőihez).
2. A `jelentkezok.html` oldalon a `jid=1` jelentkező adatai frissültek a megadott új értékekkel (Lakcím, Email).
3. A módosítások az adatbázisba is bekerülnek.

* * *

**Teszt ID:** ADM_TC_021

**Teszt megnevezése:** Jelentkező módosítása - Módosítás érvénytelen adatokkal (pl. hiányzó név)

**Előfeltételek:**

1. Sikeres admin bejelentkezés.
2. A felhasználó a `jmodosit.html` oldalon van, a `jid=1` adataival betöltve.

**Lépések:**

1. Törölje ki a "Név" mező tartalmát.
2. Kattintson a "Módosít" gombra.

**Tesztadatok (jid=1 módosítása):**

* Módosított Név: (üres)

**Elvárt eredmény:**

1. Egy felugró ablak (alert) jelenik meg hibaüzenettel (pl. "Hiba a módosítás során: Hiányzó kötelező mezők...".
2. A felhasználó a `jmodosit.html` oldalon marad.
3. Az űrlap mezőiben a bevitt (hibás) érték marad.

* * *

**Teszt ID:** ADM_TC_022

**Teszt megnevezése:** Jelentkező módosítása - "Vissza" gomb funkcionalitása

**Előfeltételek:**

1. Sikeres admin bejelentkezés.
2. A felhasználó a `jmodosit.html` oldalon van.

**Lépések:**

1. Kattintson a "Vissza a jelentkezőkhöz" gombra.

**Tesztadatok:**

* N/A

**Elvárt eredmény:**

1. A felhasználó visszairányításra kerül a `jelentkezok.html` oldalra.
2. Nem történik adatmentés.

* * *

**Teszt ID:** ADM_TC_023

**Teszt megnevezése:** Jelentkezők - Jelentkező törlése - Sikeres törlés

**Előfeltételek:**

1. Sikeres admin bejelentkezés.
2. A felhasználó a `jelentkezok.html` oldalon van.
3. `sessionStorage.csid=1`.
4. Létezik a `jid=2` (Nagy Béla) jelentkező a `csid=1` csoportban.

**Lépések:**

1. Keresse meg a `jid=2` azonosítójú (Nagy Béla) jelentkezőt a listában.
2. Kattintson a "Törlés" gombra ennél a jelentkezőnél.
3. A megjelenő megerősítő párbeszédablakban ("Biztosan törölni szeretnéd ezt a jelentkezőt?") kattintson az "OK" (vagy "Igen") gombra.

**Tesztadatok:**

* Törlendő jelentkező: `jid=2` (Nagy Béla)

**Elvárt eredmény:**

1. A megerősítő párbeszédablak megjelenik.
2. A jelentkező eltávolításra kerül a "Jelentkezők listája" táblázatból.
3. A "Létszám" frissül 1 főre (ha előtte 2 volt és csak Nagy Béla lett törölve).
4. Nincs hibaüzenet.
5. A törlés az adatbázisban is megtörténik.

* * *

**Teszt ID:** ADM_TC_024

**Teszt megnevezése:** Jelentkezők - Jelentkező törlése - Törlés megszakítása

**Előfeltételek:**

1. Sikeres admin bejelentkezés.
2. A felhasználó a `jelentkezok.html` oldalon van.
3. `sessionStorage.csid=1`.
4. Létezik a `jid=1` (Kiss Gizella) jelentkező a `csid=1` csoportban.

**Lépések:**

1. Keresse meg a `jid=1` azonosítójú (Kiss Gizella) jelentkezőt a listában.
2. Kattintson a "Törlés" gombra ennél a jelentkezőnél.
3. A megjelenő megerősítő párbeszédablakban ("Biztosan törölni szeretnéd ezt a jelentkezőt?") kattintson a "Mégse" (vagy "Nem") gombra.

**Tesztadatok:**

* Jelentkező: `jid=1` (Kiss Gizella)

**Elvárt eredmény:**

1. A megerősítő párbeszédablak megjelenik.
2. A jelentkező nem kerül törlésre, továbbra is látható a listában.
3. A létszám nem változik.

* * *

**Teszt ID:** ADM_TC_025

**Teszt megnevezése:** Jelentkezők - "Vissza a csoportokhoz" gomb funkcionalitása

**Előfeltételek:**

1. Sikeres admin bejelentkezés.
2. A felhasználó a `jelentkezok.html` oldalon van.

**Lépések:**

1. Kattintson a "Vissza a csoportokhoz" gombra.

**Tesztadatok:**

* N/A

**Elvárt eredmény:**

1. A felhasználó visszairányításra kerül a `csoportok.html` oldalra.

* * *

### 4. Kijelentkezés

* * *

**Teszt ID:** ADM_TC_026

**Teszt megnevezése:** Kijelentkezés - Sikeres kijelentkezés a `csoportok.html` oldalról

**Előfeltételek:**

1. Sikeres admin bejelentkezés.
2. A felhasználó a `csoportok.html` oldalon van.

**Lépések:**

1. Kattintson a "Kijelentkezés" gombra.

**Tesztadatok:**

* N/A

**Elvárt eredmény:**

1. A `sessionStorage.token` törlődik.
2. A felhasználó átirányításra kerül az `index.html` oldalra.

* * *

**Teszt ID:** ADM_TC_027

**Teszt megnevezése:** Kijelentkezés - Sikeres kijelentkezés a `jelentkezok.html` oldalról

**Előfeltételek:**

1. Sikeres admin bejelentkezés.
2. A felhasználó a `jelentkezok.html` oldalon van.

**Lépések:**

1. Kattintson a "Kijelentkezés" gombra.

**Tesztadatok:**

* N/A

**Elvárt eredmény:**

1. A `sessionStorage.token` törlődik.
2. A felhasználó átirányításra kerül az `index.html` oldalra.
