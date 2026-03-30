// Ha nincs bejelentkezve, visszairanyitjuk a fooldra
if (!sessionStorage.token) {
    document.location.replace("index.html");
}

var csoportAzonosito = sessionStorage.csid;
var token = 'Bearer ' + sessionStorage.token;
var maxLetszam = 8;

// Csoport azonosito kiirasa az oldalra
document.getElementById("csid").innerHTML = csoportAzonosito;

// Indulaskor betoltjuk a jelentkezok listajat
jelentkezokBetoltese();

// --- Jelentkezok tabla feltoltese ---

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

        // Tabla fejlec
        tabla.innerHTML = "<tr><th>Nev</th><th>Szuletesi nev</th><th>Ido</th>"
            + "<th>Hely</th><th>Anyja neve</th><th>Cim</th><th>Telefon</th>"
            + "<th>Email</th><th></th><th></th></tr>";

        // Minden jelentkezo egy sor
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
                + '<td><button class="button btn-sm btn-primary" onclick="jelentkezoModositasa(' + j.jid + ')">Modositas</button></td>'
                + '<td><button class="button btn-sm btn-outline-danger" onclick="jelentkezoTorlese(' + j.jid + ')">Torles</button></td>'
                + "</tr>";
        }

        // Letszam kiirasa
        document.getElementById("letszam").innerHTML = "Letszam: " + jelentkezok.length + " fo";
    } catch (hiba) {
        console.error("Hiba a jelentkezok betoltesekor:", hiba.message);
        tabla.innerHTML = '<tr><td colspan="10">Hiba tortent a jelentkezok betoltesekor.</td></tr>';
    }
}

// --- Uj jelentkezo hozzaadasa ---

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

        // Urlap uritese es lista frissitese
        document.querySelector("form").reset();
        jelentkezokBetoltese();
    } catch (hiba) {
        console.error("Hiba a jelentkezo hozzaadasakor:", hiba.message);
        alert(hiba.message);
    }
};

// --- Navigacios fuggvenyek ---

// Atiranyitas a jelentkezo modosito oldalra
function jelentkezoModositasa(jid) {
    sessionStorage.jid = jid;
    window.location.href = "jmodosit.html";
}

// --- Jelentkezo torlese ---

async function jelentkezoTorlese(jid) {
    if (!confirm("Biztosan torolni szeretned ezt a jelentkezot?")) {
        return;
    }

    try {
        var valasz = await fetch('http://localhost:5000/admin/jelentkezok/' + jid, {
            method: 'DELETE',
            headers: { 'Authorization': token }
        });

        if (!valasz.ok) {
            throw new Error("Hiba a torles soran.");
        }

        jelentkezokBetoltese(); // Lista frissitese
    } catch (hiba) {
        console.error("Hiba a torleskor:", hiba.message);
        alert(hiba.message);
    }
}

// --- Navigacio ---

document.getElementById("vissza").onclick = function () {
    document.location.href = "csoportok.html";
};

document.getElementById("kijelentkezes").onclick = function () {
    delete sessionStorage.token;
    document.location.replace("index.html");
};
