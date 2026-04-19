// Egy csoportba maximum ennyi fő férhet
var maxLetszam = 8;

// Oldal betöltésekor lekérjük a csoportokat
csoportokBetoltese();

// --- Csoportok tábla feltöltése ---

async function csoportokBetoltese() {
    var tabla = document.getElementById("csoportok");

    try {
        var valasz = await fetch('http://localhost:5000/public/csoportok');
        var csoportok = await valasz.json();

        if (!valasz.ok) {
            throw new Error(csoportok.message);
        }

        // Tábla fejléc
        tabla.innerHTML = "<tr><th>Azonosító</th><th>Képzés</th><th>Indulás</th>"
            + "<th>Beosztás</th><th>Szabad hely</th><th>Ár (Ft)</th></tr>";

        // Minden csoport egy sor a táblában
        for (var i = 0; i < csoportok.length; i++) {
            var cs = csoportok[i];
            var szabadHely = maxLetszam - cs.letszam;
            tabla.innerHTML += "<tr>"
                + "<td>" + cs.csid + "</td>"
                + "<td>" + cs.knev + "</td>"
                + "<td>" + cs.indulas + "</td>"
                + "<td>" + cs.beosztas + "</td>"
                + "<td>" + szabadHely + "</td>"
                + "<td>" + cs.ar.toLocaleString() + "</td>"
                + "</tr>";
        }
    } catch (hiba) {
        console.error("Hiba a csoportok betöltésekor:", hiba.message);
        tabla.innerHTML = '<tr><td colspan="6">Hiba történt a csoportok betöltésekor.</td></tr>';
    }
}

// --- Jelentkezés gomb megnyomása ---

document.getElementById("jelentkezemGomb").onclick = async function () {
    var hibaUzenet = urlapEllenorzes();
    var uzenetMezo = document.getElementById("uzenet");
    uzenetMezo.innerHTML = hibaUzenet;

    // Ha van hiba, nem küldjük el
    if (hibaUzenet) return;

    // Adatok összegyűjtése az űrlapról
    var adatok = {
        csid: document.getElementById("csid").value,
        jnev: document.getElementById("jnev").value,
        szulnev: document.getElementById("szulnev").value,
        szulido: document.getElementById("szulido").value,
        szulhely: document.getElementById("szulhely").value,
        anyjaneve: document.getElementById("anyjaneve").value,
        cim: document.getElementById("cim").value,
        telefon: document.getElementById("telefon").value,
        email: document.getElementById("email").value
    };

    try {
        var valasz = await fetch('http://localhost:5000/public/jelentkezok', {
            method: 'POST',
            headers: { 'Content-type': 'application/json;charset=utf-8' },
            body: JSON.stringify(adatok)
        });

        var eredmeny = await valasz.json();

        if (!valasz.ok) {
            throw new Error(eredmeny.message);
        }

        // Sikeres jelentkezés
        uzenetMezo.innerHTML = eredmeny.message;
        document.getElementById("jelentkezemGomb").disabled = true;
        csoportokBetoltese(); // Tábla frissítése (szabad helyek változtak)
    } catch (hiba) {
        console.error("Hiba a jelentkezéskor:", hiba.message);
        uzenetMezo.innerHTML = hiba.message;
    }
};

// --- Admin bejelentkezés ---

document.getElementById("login").onclick = async function () {
    var uzenetMezo = document.getElementById("uzenet2");

    try {
        var valasz = await fetch('http://localhost:5000/admin', {
            method: 'POST',
            headers: { 'Content-type': 'application/json;charset=utf-8' },
            body: JSON.stringify({
                password: document.getElementById("password").value
            })
        });

        var eredmeny = await valasz.json();
        uzenetMezo.innerHTML = eredmeny.message;

        if (!valasz.ok) {
            throw new Error("Hibás jelszó");
        }

        // Sikeres belépés: token mentése és átirányítás az admin oldalra
        document.getElementById("password").value = "";
        sessionStorage.token = eredmeny.token;
        document.location.href = "csoportok.html";
    } catch (hiba) {
        console.error("Bejelentkezési hiba:", hiba.message);
        uzenetMezo.innerHTML = "Hibás jelszó!";
    }
};

// --- Űrlap ellenőrzése (jelentkezés előtt) ---

function urlapEllenorzes() {
    // Név ellenőrzése (5-60 karakter)
    var nev = document.getElementById("jnev").value.trim();
    if (nev.length < 5 || nev.length > 60) {
        return "Hibás név! (5-60 karakter lehet)";
    }

    // Születési idő ellenőrzése
    var datum = document.getElementById("szulido").value;
    if (datum === "") {
        return "Add meg a születési időt!";
    }

    // Kor számítása (18-65 év között kell lennie)
    var szuletesiEv = parseInt(datum.substring(0, 4));
    var mostaniEv = new Date().getFullYear();
    var kor = mostaniEv - szuletesiEv;
    if (kor < 18 || kor > 65) {
        return "Hibás születési idő! (18-65 év közötti lehetsz)";
    }

    // Születési hely ellenőrzése (3-60 karakter)
    var hely = document.getElementById("szulhely").value.trim();
    if (hely.length < 3 || hely.length > 60) {
        return "Hibás születési hely! (3-60 karakter lehet)";
    }

    // Anyja neve ellenőrzése (5-60 karakter)
    var anyjaNeve = document.getElementById("anyjaneve").value.trim();
    if (anyjaNeve.length < 5 || anyjaNeve.length > 60) {
        return "Anyja neve hibás! (5-60 karakter lehet)";
    }

    // Cím ellenőrzése (15-80 karakter)
    var cim = document.getElementById("cim").value.trim();
    if (cim.length < 15 || cim.length > 80) {
        return "Hibás cím! (15-80 karakter lehet)";
    }

    // Telefonszám ellenőrzése (8-15 karakter)
    var telefon = document.getElementById("telefon").value.trim();
    if (telefon.length < 8 || telefon.length > 15) {
        return "Hibás telefonszám! (8-15 karakter lehet)";
    }

    // Tandíj elfogadása
    if (!document.getElementById("tandij").checked) {
        return "Kérjük, fogadja el a fizetési feltételt a pipa bejelölésével!";
    }

    // Nincs hiba
    return "";
}
