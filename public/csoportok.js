// Ha nincs bejelentkezve, visszairanyitjuk a fooldra
if (!sessionStorage.token) {
    document.location.replace("index.html");
}

var token = 'Bearer ' + sessionStorage.token;

// Indulaskor betoltjuk a mai datumot es a csoportokat
document.getElementById("datum").value = new Date().toISOString().slice(0, 10);
csoportokBetoltese();

// --- Csoportok tabla feltoltese ---

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

        // Tabla fejlec
        tabla.innerHTML = '<tr><th>Azon</th><th>Kepzes</th><th>Indulas</th>'
            + '<th>Beosztas</th><th>Helyszin</th><th>Ar (Ft)</th>'
            + '<th>Fo</th><th></th><th></th><th></th></tr>';

        // Minden csoport egy sor a tablaban, 3 gombbal
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
                + '<td><button class="button btn-sm btn-primary" onclick="jelentkezokMegnyitasa(' + cs.csid + ')">Jelentkezok</button></td>'
                + '<td><button class="button btn-sm btn-primary" onclick="csoportModositasa(' + cs.csid + ')">Modositas</button></td>'
                + '<td><button class="button btn-sm btn-outline-danger" onclick="csoportTorlese(' + cs.csid + ')">Torles</button></td>'
                + '</tr>';
        }
    } catch (hiba) {
        console.error("Hiba a csoportok betoltesekor:", hiba.message);
        tabla.innerHTML = '<tr><td colspan="10">Hiba tortent a csoportok betoltesekor.</td></tr>';
    }
}

// --- Uj csoport hozzaadasa ---

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

        // Urlap uritese es tabla frissitese
        document.querySelector("form").reset();
        csoportokBetoltese();
    } catch (hiba) {
        console.error("Hiba a csoport hozzaadasakor:", hiba.message);
        alert(hiba.message);
    }
};

// --- Navigacios fuggvenyek ---

// Atiranyitas a jelentkezok oldalra
function jelentkezokMegnyitasa(csid) {
    sessionStorage.csid = csid;
    window.location.href = "jelentkezok.html";
}

// Atiranyitas a modosito oldalra
function csoportModositasa(csid) {
    sessionStorage.csid = csid;
    window.location.href = "modosit.html";
}

// --- Csoport torlese ---

async function csoportTorlese(csid) {
    try {
        // Eloszor megnezzuk, vannak-e jelentkezok
        var listaValasz = await fetch('http://localhost:5000/admin/lista/' + csid, {
            method: 'GET',
            headers: { 'Authorization': token }
        });

        if (!listaValasz.ok) {
            throw new Error("Hiba a jelentkezok lekeresekor.");
        }

        var jelentkezok = await listaValasz.json();

        // Csak ures csoportot lehet torolni
        if (jelentkezok.length > 0) {
            alert("Csak ures csoport torolheto!");
            return;
        }

        // Megerosites keres
        if (!confirm("Biztosan torolni szeretned ezt a csoportot?")) {
            return;
        }

        // Torles vegrehajtasa
        var torlesValasz = await fetch('http://localhost:5000/admin/csoportok/' + csid, {
            method: 'DELETE',
            headers: { 'Authorization': token }
        });

        if (!torlesValasz.ok) {
            throw new Error("Hiba a csoport torlesekor.");
        }

        csoportokBetoltese(); // Tabla frissitese
    } catch (hiba) {
        console.error("Hiba a torles soran:", hiba.message);
        alert(hiba.message);
    }
}

// --- Kijelentkezes ---

document.getElementById("kijelentkezes").onclick = function () {
    delete sessionStorage.token;
    document.location.replace("index.html");
};
