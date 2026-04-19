// Ha nincs bejelentkezve, visszairányítjuk a főoldalra
if (!sessionStorage.token) {
    document.location.href = "index.html";
}

var token = 'Bearer ' + sessionStorage.token;
var csoportAzonosito = sessionStorage.csid;

// Csoport azonosító kiírása az oldalra
document.getElementById("csid").innerHTML = csoportAzonosito;

// Induláskor betöltjük a csoport jelenlegi adatait
csoportAdatokBetoltese();

// --- Csoport jelenlegi adatainak betöltése az űrlapba ---

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

        // Űrlap mezők kitöltése a jelenlegi adatokkal
        document.getElementById("kepzes").selectedIndex = csoport.kid - 1;
        document.getElementById("datum").value = csoport.indulas;
        document.getElementById("beosztas").value = csoport.beosztas;
        document.getElementById("helyszin").value = csoport.helyszin;
        document.getElementById("ar").value = csoport.ar;
    } catch (hiba) {
        console.error("Hiba az adatok betöltésekor:", hiba.message);
        alert("Hiba az adatok betöltésekor: " + hiba.message);
    }
}

// --- Módosítás gomb megnyomása ---

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

        // Sikeres módosítás után visszatérünk a csoportok listájhoz
        document.location.href = "csoportok.html";
    } catch (hiba) {
        console.error("Hiba a módosításkor:", hiba.message);
        alert("Hiba a módosításkor: " + hiba.message);
    }
};

// --- Navigáció ---

document.getElementById("vissza").onclick = function () {
    document.location.href = "csoportok.html";
};

document.getElementById("kijelentkezes").onclick = function () {
    delete sessionStorage.token;
    document.location.replace("index.html");
};
