// Ha nincs bejelentkezve, visszairányítjuk a főoldalra
if (!sessionStorage.token) {
    document.location.replace("index.html");
}

var csoportAzonosito = sessionStorage.csid;
var token = 'Bearer ' + sessionStorage.token;
var maxLetszam = 8;

// Csoport azonosító kiírása az oldalra
document.getElementById("csid").innerHTML = csoportAzonosito;

// Induláskor betöltjük a jelentkezők listáját
jelentkezokBetoltese();

// --- Jelentkezők tábla feltöltése ---

async function jelentkezokBetoltese() {
    var tabla = document.getElementById("jelentkezok");

    try {
        var valasz = await fetch('http://localhost:5000/admin/lista/' + csoportAzonosito, {
            method: 'GET',
            headers: { 'Authorization': token }
        });

        var jelentkezok = await valasz.json();

        if (!valasz.ok) {
            throw new Error(jelentkezok.message);
        }

        // Tábla fejléc
        tabla.innerHTML = "<tr><th>Név</th><th>Születési név</th><th>Idő</th>"
            + "<th>Hely</th><th>Anyja neve</th><th>Cím</th><th>Telefon</th>"
            + "<th>Email</th><th></th><th></th></tr>";

        // Minden jelentkező egy sor
        for (var i = 0; i < jelentkezok.length; i++) {
            var j = jelentkezok[i];
            tabla.innerHTML += "<tr>"
                + "<td>" + j.jnev + "</td>"
                + "<td>" + (j.szulnev || "") + "</td>"
                + "<td>" + j.szulido + "</td>"
                + "<td>" + j.szulhely + "</td>"
                + "<td>" + j.anyjaneve + "</td>"
                + "<td>" + j.cim + "</td>"
                + "<td>" + j.telefon + "</td>"
                + "<td>" + j.email + "</td>"
                + '<td><button class="button btn-sm btn-primary" onclick="jelentkezoModositasa(' + j.jid + ')">Módosítás</button></td>'
                + '<td><button class="button btn-sm btn-outline-danger" onclick="jelentkezoTorlese(' + j.jid + ')">Törlés</button></td>'
                + "</tr>";
        }

        // Létszám kiírása
        document.getElementById("letszam").innerHTML = "Létszám: " + jelentkezok.length + " fő";
    } catch (hiba) {
        console.error("Hiba a jelentkezők betöltésekor:", hiba.message);
        tabla.innerHTML = '<tr><td colspan="10">Hiba történt a jelentkezők betöltésekor.</td></tr>';
    }
}

// --- Új jelentkező hozzáadása ---

document.getElementById("hozzaad").onclick = async function () {
    var adatok = {
        csid: Number(csoportAzonosito),
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

        // Űrlap ürítése és lista frissítése
        document.querySelector("form").reset();
        jelentkezokBetoltese();
    } catch (hiba) {
        console.error("Hiba a jelentkező hozzáadásakor:", hiba.message);
        alert(hiba.message);
    }
};

// --- Navigációs függvények ---

// Átirányítás a jelentkező módosító oldalra
function jelentkezoModositasa(jid) {
    sessionStorage.jid = jid;
    window.location.href = "jmodosit.html";
}

// --- Jelentkező törlése ---

async function jelentkezoTorlese(jid) {
    if (!confirm("Biztosan törölni szeretnéd ezt a jelentkezőt?")) {
        return;
    }

    try {
        var valasz = await fetch('http://localhost:5000/admin/jelentkezok/' + jid, {
            method: 'DELETE',
            headers: { 'Authorization': token }
        });

        if (!valasz.ok) {
            throw new Error("Hiba a törlés során.");
        }

        jelentkezokBetoltese(); // Lista frissítése
    } catch (hiba) {
        console.error("Hiba a törléskor:", hiba.message);
        alert(hiba.message);
    }
}

// --- Navigáció ---

document.getElementById("vissza").onclick = function () {
    document.location.href = "csoportok.html";
};

document.getElementById("kijelentkezes").onclick = function () {
    delete sessionStorage.token;
    document.location.replace("index.html");
};
