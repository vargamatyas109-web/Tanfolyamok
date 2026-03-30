// Egy csoportba maximum ennyi fo ferhet
var maxLetszam = 8;

// Oldal betoltesekor lekerjuk a csoportokat
csoportokBetoltese();

// --- Csoportok tabla feltoltese ---

async function csoportokBetoltese() {
    var tabla = document.getElementById("csoportok");

    try {
        var valasz = await fetch('http://localhost:5000/public/csoportok');
        var csoportok = await valasz.json();

        if (!valasz.ok) {
            throw new Error(csoportok.message);
        }

        // Tabla fejlec
        tabla.innerHTML = "<tr><th>Azonosito</th><th>Kepzes</th><th>Indulas</th>"
            + "<th>Beosztas</th><th>Szabad hely</th><th>Ar (Ft)</th></tr>";

        // Minden csoport egy sor a tablaban
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
        console.error("Hiba a csoportok betoltesekor:", hiba.message);
        tabla.innerHTML = '<tr><td colspan="6">Hiba tortent a csoportok betoltesekor.</td></tr>';
    }
}

// --- Jelentkezes gomb megnyomasa ---

document.getElementById("jelentkezemGomb").onclick = async function () {
    var hibaUzenet = urlapEllenorzes();
    var uzenetMezo = document.getElementById("uzenet");
    uzenetMezo.innerHTML = hibaUzenet;

    // Ha van hiba, nem kuldjuk el
    if (hibaUzenet) return;

    // Adatok osszegyujtese az urlaprol
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

        // Sikeres jelentkezes
        uzenetMezo.innerHTML = eredmeny.message;
        document.getElementById("jelentkezemGomb").disabled = true;
        csoportokBetoltese(); // Tabla frissitese (szabad helyek valtoztak)
    } catch (hiba) {
        console.error("Hiba a jelentkezeskor:", hiba.message);
        uzenetMezo.innerHTML = hiba.message;
    }
};

// --- Admin bejelentkezes ---

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
            throw new Error("Hibas jelszo");
        }

        // Sikeres belepes: token mentese es atiranyitas az admin oldalra
        document.getElementById("password").value = "";
        sessionStorage.token = eredmeny.token;
        document.location.href = "csoportok.html";
    } catch (hiba) {
        console.error("Bejelentkezesi hiba:", hiba.message);
        uzenetMezo.innerHTML = "Hibas jelszo!";
    }
};

// --- Urlap ellenorzese (jelentkezes elott) ---

function urlapEllenorzes() {
    // Nev ellenorzese (5-60 karakter)
    var nev = document.getElementById("jnev").value.trim();
    if (nev.length < 5 || nev.length > 60) {
        return "Hibas nev! (5-60 karakter lehet)";
    }

    // Szuletesi ido ellenorzese
    var datum = document.getElementById("szulido").value;
    if (datum === "") {
        return "Add meg a szuletesi idot!";
    }

    // Kor szamitasa (18-65 ev kozott kell lennie)
    var szuletesiEv = parseInt(datum.substring(0, 4));
    var mostaniEv = new Date().getFullYear();
    var kor = mostaniEv - szuletesiEv;
    if (kor < 18 || kor > 65) {
        return "Hibas szuletesi ido! (18-65 ev kozotti lehetsz)";
    }

    // Szuletesi hely ellenorzese (3-60 karakter)
    var hely = document.getElementById("szulhely").value.trim();
    if (hely.length < 3 || hely.length > 60) {
        return "Hibas szuletesi hely! (3-60 karakter lehet)";
    }

    // Anyja neve ellenorzese (5-60 karakter)
    var anyjaNeve = document.getElementById("anyjaneve").value.trim();
    if (anyjaNeve.length < 5 || anyjaNeve.length > 60) {
        return "Anyja neve hibas! (5-60 karakter lehet)";
    }

    // Cim ellenorzese (15-80 karakter)
    var cim = document.getElementById("cim").value.trim();
    if (cim.length < 15 || cim.length > 80) {
        return "Hibas cim! (15-80 karakter lehet)";
    }

    // Telefonszam ellenorzese (8-15 karakter)
    var telefon = document.getElementById("telefon").value.trim();
    if (telefon.length < 8 || telefon.length > 15) {
        return "Hibas telefonszam! (8-15 karakter lehet)";
    }

    // Tandij elfogadasa
    if (!document.getElementById("tandij").checked) {
        return "Kerjuk, fogadja el a fizetesi feltetelt a pipa bejelolesevel!";
    }

    // Nincs hiba
    return "";
}
