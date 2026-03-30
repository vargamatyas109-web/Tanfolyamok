// Ha nincs bejelentkezve, visszairanyitjuk a fooldra
if (!sessionStorage.token) {
    document.location.replace("index.html");
}

var token = 'Bearer ' + sessionStorage.token;
var jelentkezoAzonosito = sessionStorage.jid;

// Jelentkezo azonosito kiirasa az oldalra
document.getElementById("jid").innerHTML = jelentkezoAzonosito;

// Indulaskor betoltjuk a jelentkezo jelenlegi adatait
jelentkezoAdatokBetoltese();

// --- Jelentkezo jelenlegi adatainak betoltese az urlapba ---

async function jelentkezoAdatokBetoltese() {
    try {
        var valasz = await fetch('http://localhost:5000/admin/jelentkezok/' + jelentkezoAzonosito, {
            method: 'GET',
            headers: { 'Authorization': token }
        });

        var jelentkezo = await valasz.json();

        if (!valasz.ok) {
            throw new Error(jelentkezo.message);
        }

        // Urlap mezok kitoltese a jelenlegi adatokkal
        document.getElementById("jnev").value = jelentkezo.jnev;
        document.getElementById("szulnev").value = jelentkezo.szulnev || '';
        document.getElementById("szulido").value = jelentkezo.szulido;
        document.getElementById("szulhely").value = jelentkezo.szulhely;
        document.getElementById("anyjaneve").value = jelentkezo.anyjaneve;
        document.getElementById("cim").value = jelentkezo.cim;
        document.getElementById("telefon").value = jelentkezo.telefon;
        document.getElementById("email").value = jelentkezo.email;
    } catch (hiba) {
        console.error("Hiba az adatok betoltesekor:", hiba.message);
        alert("Hiba az adatok betoltesekor: " + hiba.message);
    }
}

// --- Modositas gomb megnyomasa ---

document.getElementById("modosit").onclick = async function () {
    var adatok = {
        csid: Number(sessionStorage.csid),
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
        var valasz = await fetch('http://localhost:5000/admin/jelentkezok/' + jelentkezoAzonosito, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json;charset=utf-8',
                'Authorization': token
            },
            body: JSON.stringify(adatok)
        });

        var eredmeny = await valasz.json();

        if (!valasz.ok) {
            alert("Hiba a modositas soran: " + eredmeny.message);
            return;
        }

        // Sikeres modositas utan visszaterunk a jelentkezok listajhoz
        document.location.href = "jelentkezok.html";
    } catch (hiba) {
        console.error("Hiba a modositaskor:", hiba.message);
        alert("Hiba tortent a modositas kozben: " + hiba.message);
    }
};

// --- Navigacio ---

document.getElementById("vissza").onclick = function () {
    document.location.href = "jelentkezok.html";
};

document.getElementById("kijelentkezes").onclick = function () {
    delete sessionStorage.token;
    document.location.replace("index.html");
};
