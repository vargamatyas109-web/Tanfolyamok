// Ha nincs bejelentkezve, visszairanyitjuk a fooldra
if (!sessionStorage.token) {
    document.location.href = "index.html";
}

var token = 'Bearer ' + sessionStorage.token;
var csoportAzonosito = sessionStorage.csid;

// Csoport azonosito kiirasa az oldalra
document.getElementById("csid").innerHTML = csoportAzonosito;

// Indulaskor betoltjuk a csoport jelenlegi adatait
csoportAdatokBetoltese();

// --- Csoport jelenlegi adatainak betoltese az urlapba ---

async function csoportAdatokBetoltese() {
    try {
        var valasz = await fetch('http://localhost:5000/admin/csoportok/' + csoportAzonosito, {
            method: 'GET',
            headers: { 'Authorization': token }
        });

        var csoport = await valasz.json();

        if (!valasz.ok) {
            throw new Error(csoport.message);
        }

        // Urlap mezok kitoltese a jelenlegi adatokkal
        document.getElementById("kepzes").selectedIndex = csoport.kid - 1;
        document.getElementById("datum").value = csoport.indulas;
        document.getElementById("beosztas").value = csoport.beosztas;
        document.getElementById("helyszin").value = csoport.helyszin;
        document.getElementById("ar").value = csoport.ar;
    } catch (hiba) {
        console.error("Hiba az adatok betoltesekor:", hiba.message);
        alert("Hiba az adatok betoltesekor: " + hiba.message);
    }
}

// --- Modositas gomb megnyomasa ---

document.getElementById("modosit").onclick = async function () {
    var adatok = {
        kid: parseInt(document.getElementById("kepzes").value),
        indulas: document.getElementById("datum").value,
        beosztas: document.getElementById("beosztas").value.trim(),
        helyszin: document.getElementById("helyszin").value.trim(),
        ar: document.getElementById("ar").value.trim()
    };

    try {
        var valasz = await fetch('http://localhost:5000/admin/csoportok/' + csoportAzonosito, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json;charset=utf-8',
                'Authorization': token
            },
            body: JSON.stringify(adatok)
        });

        if (!valasz.ok) {
            var hibaAdatok = await valasz.json();
            throw new Error(hibaAdatok.message);
        }

        // Sikeres modositas utan visszaterunk a csoportok listajhoz
        document.location.href = "csoportok.html";
    } catch (hiba) {
        console.error("Hiba a modositaskor:", hiba.message);
        alert("Hiba a modositaskor: " + hiba.message);
    }
};

// --- Navigacio ---

document.getElementById("vissza").onclick = function () {
    document.location.href = "csoportok.html";
};

document.getElementById("kijelentkezes").onclick = function () {
    delete sessionStorage.token;
    document.location.replace("index.html");
};
