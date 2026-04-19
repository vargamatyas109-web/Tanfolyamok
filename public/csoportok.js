// Ha nincs bejelentkezve, visszairányítjuk a főoldalra
if (!sessionStorage.token) {
    document.location.replace("index.html");
}

var token = 'Bearer ' + sessionStorage.token;

// Induláskor betöltjük a mai dátumot és a csoportokat
document.getElementById("datum").value = new Date().toISOString().slice(0, 10);
csoportokBetoltese();

// --- Csoportok tábla feltöltése ---

async function csoportokBetoltese() {
    var tabla = document.getElementById("csoportok");

    try {
        var valasz = await fetch('http://localhost:5000/admin/csoportok', {
            method: 'GET',
            headers: { 'Authorization': token }
        });

        var csoportok = await valasz.json();

        if (!valasz.ok) {
            throw new Error(csoportok.message);
        }

        // Tábla fejléc
        tabla.innerHTML = '<tr><th>Azon</th><th>Képzés</th><th>Indulás</th>'
            + '<th>Beosztás</th><th>Helyszín</th><th>Ár (Ft)</th>'
            + '<th>Fő</th><th></th><th></th><th></th></tr>';

        // Minden csoport egy sor a táblában, 3 gombbal
        for (var i = 0; i < csoportok.length; i++) {
            var cs = csoportok[i];
            tabla.innerHTML += '<tr>'
                + '<td>' + cs.csid + '</td>'
                + '<td>' + cs.knev + '</td>'
                + '<td>' + cs.indulas + '</td>'
                + '<td>' + cs.beosztas + '</td>'
                + '<td>' + cs.helyszin + '</td>'
                + '<td>' + cs.ar.toLocaleString() + '</td>'
                + '<td>' + cs.letszam + '</td>'
                + '<td><button class="button btn-sm btn-primary" onclick="jelentkezokMegnyitasa(' + cs.csid + ')">Jelentkezők</button></td>'
                + '<td><button class="button btn-sm btn-primary" onclick="csoportModositasa(' + cs.csid + ')">Módosítás</button></td>'
                + '<td><button class="button btn-sm btn-outline-danger" onclick="csoportTorlese(' + cs.csid + ')">Törlés</button></td>'
                + '</tr>';
        }
    } catch (hiba) {
        console.error("Hiba a csoportok betöltésekor:", hiba.message);
        tabla.innerHTML = '<tr><td colspan="10">Hiba történt a csoportok betöltésekor.</td></tr>';
    }
}

// --- Új csoport hozzáadása ---

document.getElementById("hozzaad").onclick = async function () {
    var adatok = {
        kid: document.getElementById("kepzes").value,
        indulas: document.getElementById("datum").value,
        beosztas: document.getElementById("beosztas").value,
        helyszin: document.getElementById("helyszin").value,
        ar: document.getElementById("ar").value
    };

    try {
        var valasz = await fetch('http://localhost:5000/admin/csoportok', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json;charset=utf-8',
                'Authorization': token
            },
            body: JSON.stringify(adatok)
        });

        var eredmeny = await valasz.json();

        if (!valasz.ok) {
            throw new Error(eredmeny.message);
        }

        // Űrlap ürítése és tábla frissítése
        document.querySelector("form").reset();
        csoportokBetoltese();
    } catch (hiba) {
        console.error("Hiba a csoport hozzáadásakor:", hiba.message);
        alert(hiba.message);
    }
};

// --- Navigációs függvények ---

// Átirányítás a jelentkezők oldalra
function jelentkezokMegnyitasa(csid) {
    sessionStorage.csid = csid;
    window.location.href = "jelentkezok.html";
}

// Átirányítás a módosító oldalra
function csoportModositasa(csid) {
    sessionStorage.csid = csid;
    window.location.href = "modosit.html";
}

// --- Csoport törlése ---

async function csoportTorlese(csid) {
    try {
        // Először megnézzük, vannak-e jelentkezők
        var listaValasz = await fetch('http://localhost:5000/admin/lista/' + csid, {
            method: 'GET',
            headers: { 'Authorization': token }
        });

        if (!listaValasz.ok) {
            throw new Error("Hiba a jelentkezők lekérésekor.");
        }

        var jelentkezok = await listaValasz.json();

        // Csak üres csoportot lehet törölni
        if (jelentkezok.length > 0) {
            alert("Csak üres csoport törölhető!");
            return;
        }

        // Megerősítés kérés
        if (!confirm("Biztosan törölni szeretnéd ezt a csoportot?")) {
            return;
        }

        // Törlés végrehajtása
        var torlesValasz = await fetch('http://localhost:5000/admin/csoportok/' + csid, {
            method: 'DELETE',
            headers: { 'Authorization': token }
        });

        if (!torlesValasz.ok) {
            throw new Error("Hiba a csoport törlésekor.");
        }

        csoportokBetoltese(); // Tábla frissítése
    } catch (hiba) {
        console.error("Hiba a törlés során:", hiba.message);
        alert(hiba.message);
    }
}

// --- Kijelentkezés ---

document.getElementById("kijelentkezes").onclick = function () {
    delete sessionStorage.token;
    document.location.replace("index.html");
};
