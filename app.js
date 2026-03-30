// Beallitasok betoltese a .env fajlbol (jelszo hash, titkos kulcs)
require('dotenv').config();

// Szukseges csomagok betoltese
const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const Database = require('better-sqlite3');

// Szerver letrehozasa
const app = express();
app.use(express.json());        // JSON formatu keresek fogadasa
app.use(express.static('public')); // A public mappa fajljainak kiszolgalasa

// --- Adatbazis beallitasa ---

const db = new Database('tanfolyamok.db');
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Tablak letrehozasa, ha meg nem leteznek
db.exec(`
    CREATE TABLE IF NOT EXISTS kepzesek (
        kid INTEGER PRIMARY KEY AUTOINCREMENT,
        knev TEXT NOT NULL,
        oraszam INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS csoportok (
        csid INTEGER PRIMARY KEY AUTOINCREMENT,
        kid INTEGER NOT NULL,
        indulas TEXT NOT NULL,
        beosztas TEXT NOT NULL,
        helyszin TEXT NOT NULL,
        ar INTEGER NOT NULL,
        FOREIGN KEY (kid) REFERENCES kepzesek (kid)
    );

    CREATE TABLE IF NOT EXISTS jelentkezok (
        jid INTEGER PRIMARY KEY AUTOINCREMENT,
        csid INTEGER NOT NULL,
        jnev TEXT NOT NULL,
        szulnev TEXT DEFAULT NULL,
        szulido TEXT NOT NULL,
        szulhely TEXT NOT NULL,
        anyjaneve TEXT NOT NULL,
        cim TEXT NOT NULL,
        telefon TEXT NOT NULL,
        email TEXT NOT NULL,
        FOREIGN KEY (csid) REFERENCES csoportok (csid)
    );

    CREATE INDEX IF NOT EXISTS idx_csoportok_kid ON csoportok (kid);
    CREATE INDEX IF NOT EXISTS idx_jelentkezok_csid ON jelentkezok (csid);
`);

// ===========================================
//  NYILVANOS VEGPONTOK (bejelentkezes nelkul)
// ===========================================

// Meg nem indult csoportok listaja letszammal
app.get("/public/csoportok", function (req, res) {
    try {
        const csoportok = db.prepare(`
            SELECT csoportok.csid, kepzesek.knev, indulas, beosztas, ar,
                   COUNT(jelentkezok.jid) AS letszam
            FROM kepzesek
            JOIN csoportok ON csoportok.kid = kepzesek.kid
            LEFT JOIN jelentkezok ON csoportok.csid = jelentkezok.csid
            WHERE indulas >= date('now')
            GROUP BY csoportok.csid
        `).all();

        res.status(200).send(csoportok);
    } catch (hiba) {
        console.error("Hiba a csoportok lekeresenel:", hiba.message);
        res.status(500).send({ message: "Adatbazis hiba tortent." });
    }
});

// Uj jelentkezo hozzaadasa egy csoporthoz
app.post("/public/jelentkezok", function (req, res) {
    const { csid, jnev, szulnev, szulido, szulhely, anyjaneve, cim, telefon, email } = req.body;

    // Kotelezo mezok ellenorzese
    if (!csid || !jnev || !szulido || !szulhely || !anyjaneve || !cim || !telefon || !email) {
        return res.status(400).send({ message: "Hianyzo kotelezo mezok." });
    }

    try {
        // Letezik-e a csoport es meg nem indult el?
        const csoport = db.prepare(
            "SELECT kid FROM csoportok WHERE csid = ? AND indulas >= date('now')"
        ).get(csid);

        if (!csoport) {
            return res.status(404).send({ message: "Ebbe a csoportba nem lehet jelentkezni." });
        }

        // Volt mar jelentkezes ezzel az e-maillel?
        const duplikalt = db.prepare(
            "SELECT jid FROM jelentkezok WHERE csid = ? AND email = ?"
        ).get(csid, email);

        if (duplikalt) {
            return res.status(409).send({ message: "Ezzel az e-mail cimmel mar jelentkeztek ebbe a csoportba." });
        }

        // Van meg szabad hely? (maximum 8 fo)
        const letszam = db.prepare(
            "SELECT COUNT(jid) AS db FROM jelentkezok WHERE csid = ?"
        ).get(csid);

        if (letszam.db >= 8) {
            return res.status(409).send({ message: "A csoport megtelt, maximum 8 fo jelentkezhet." });
        }

        // Jelentkezo mentese az adatbazisba
        const eredmeny = db.prepare(`
            INSERT INTO jelentkezok (csid, jnev, szulnev, szulido, szulhely, anyjaneve, cim, telefon, email)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(csid, jnev, szulnev, szulido, szulhely, anyjaneve, cim, telefon, email);

        res.status(201).send({
            message: "Sikeres jelentkezes!",
            jid: eredmeny.lastInsertRowid,
            changes: eredmeny.changes
        });
    } catch (hiba) {
        console.error("Hiba a jelentkezes rogzitesenel:", hiba.message);
        if (hiba.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
            return res.status(400).send({ message: "Ervenytelen csoport azonosito (csid)." });
        }
        res.status(500).send({ message: "Adatbazis hiba tortent a jelentkezes rogzitesekor." });
    }
});

// ===========================================
//  ADMIN BEJELENTKEZES
// ===========================================

// Jelszo ellenorzese es token kiadasa
app.post("/admin", function (req, res) {
    const helyes = bcrypt.compareSync(req.body.password, process.env.ADMIN);

    if (!helyes) {
        return res.status(401).send({ message: "Hibas jelszo!" });
    }

    // 1 oras token generalasa
    const token = jwt.sign(
        { password: req.body.password },
        process.env.TOKEN_SECRET,
        { expiresIn: 3600 }
    );

    res.status(200).send({ token: token, message: "Sikeres bejelentkezes." });
});

// Token ellenorzo fuggveny - minden admin vegpont elott lefut
function tokenEllenorzes(req, res, next) {
    const fejlec = req.headers['authorization'];
    const token = fejlec && fejlec.split(' ')[1];

    if (!token) {
        return res.status(401).send({ message: "Azonositas szukseges!" });
    }

    jwt.verify(token, process.env.TOKEN_SECRET, function (hiba) {
        if (hiba) {
            return res.status(403).send({ message: "Nincs jogosultsaga!" });
        }
        next();
    });
}

// ===========================================
//  ADMIN VEGPONTOK - CSOPORTOK KEZELESE
// ===========================================

// Osszes csoport listaja (mulbeliek is)
app.get("/admin/csoportok", tokenEllenorzes, function (req, res) {
    try {
        const csoportok = db.prepare(`
            SELECT csoportok.csid, kepzesek.knev, indulas, beosztas, helyszin, ar,
                   COUNT(jelentkezok.jid) AS letszam
            FROM kepzesek
            JOIN csoportok ON csoportok.kid = kepzesek.kid
            LEFT JOIN jelentkezok ON csoportok.csid = jelentkezok.csid
            GROUP BY csoportok.csid
            ORDER BY indulas DESC
        `).all();

        res.status(200).send(csoportok);
    } catch (hiba) {
        console.error("Hiba a csoportok lekeresenel:", hiba.message);
        res.status(500).send({ message: "Adatbazis hiba tortent." });
    }
});

// Uj csoport letrehozasa
app.post("/admin/csoportok", tokenEllenorzes, function (req, res) {
    const { kid, indulas, beosztas, helyszin, ar } = req.body;

    if (!kid || !indulas || !beosztas || !helyszin || !ar) {
        return res.status(400).send({ message: "Hianyzo kotelezo mezok." });
    }
    if (ar < 0) {
        return res.status(400).send({ message: "Az ar nem lehet negativ." });
    }

    try {
        const eredmeny = db.prepare(
            "INSERT INTO csoportok (kid, indulas, beosztas, helyszin, ar) VALUES (?, ?, ?, ?, ?)"
        ).run(Number(kid), indulas, beosztas, helyszin, Number(ar));

        res.status(201).send({
            message: "Csoport sikeresen hozzaadva!",
            id: eredmeny.lastInsertRowid,
            changes: eredmeny.changes
        });
    } catch (hiba) {
        console.error("Hiba a csoport letrehozasanal:", hiba.message);
        if (hiba.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
            return res.status(400).send({ message: "Ervenytelen kepzes azonosito (kid)." });
        }
        res.status(500).send({ message: "Adatbazis hiba tortent a csoport letrehozasakor." });
    }
});

// Egy csoport adatainak lekerese
app.get("/admin/csoportok/:csid", tokenEllenorzes, function (req, res) {
    try {
        const csoport = db.prepare(
            "SELECT kid, indulas, beosztas, helyszin, ar FROM csoportok WHERE csid = ?"
        ).get(Number(req.params.csid));

        if (csoport) {
            res.status(200).send(csoport);
        } else {
            res.status(404).send({ message: "Csoport nem talalhato." });
        }
    } catch (hiba) {
        console.error("Hiba a csoport lekeresenel:", hiba.message);
        res.status(500).send({ message: "Adatbazis hiba tortent." });
    }
});

// Csoport adatainak modositasa
app.put("/admin/csoportok/:csid", tokenEllenorzes, function (req, res) {
    const { kid, indulas, beosztas, helyszin, ar } = req.body;

    if (!kid || !indulas || !beosztas || !helyszin || !ar) {
        return res.status(400).send({ message: "Hianyzo kotelezo mezok." });
    }
    if (ar < 0) {
        return res.status(400).send({ message: "Az ar nem lehet negativ." });
    }

    try {
        const eredmeny = db.prepare(
            "UPDATE csoportok SET kid = ?, indulas = ?, beosztas = ?, helyszin = ?, ar = ? WHERE csid = ?"
        ).run(Number(kid), indulas, beosztas, helyszin, Number(ar), Number(req.params.csid));

        if (eredmeny.changes > 0) {
            res.status(200).send({ message: "Csoport sikeresen modositva.", changes: eredmeny.changes });
        } else {
            res.status(404).send({ message: "Csoport nem talalhato vagy nem tortent modositas." });
        }
    } catch (hiba) {
        console.error("Hiba a csoport modositasanal:", hiba.message);
        if (hiba.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
            return res.status(400).send({ message: "Ervenytelen kepzes azonosito (kid)." });
        }
        res.status(500).send({ message: "Adatbazis hiba tortent a csoport modositasakor." });
    }
});

// Csoport torlese
app.delete("/admin/csoportok/:csid", tokenEllenorzes, function (req, res) {
    try {
        const eredmeny = db.prepare(
            "DELETE FROM csoportok WHERE csid = ?"
        ).run(Number(req.params.csid));

        if (eredmeny.changes > 0) {
            res.status(200).send({ message: "Csoport sikeresen torolve.", changes: eredmeny.changes });
        } else {
            res.status(404).send({ message: "Csoport nem talalhato." });
        }
    } catch (hiba) {
        console.error("Hiba a csoport torlesenel:", hiba.message);
        if (hiba.code === 'SQLITE_CONSTRAINT_FOREIGNKEY' || hiba.message.toUpperCase().includes("FOREIGN KEY CONSTRAINT FAILED")) {
            return res.status(400).send({ message: "A csoport nem torolheto, mert vannak hozza rendelt jelentkezok." });
        }
        res.status(500).send({ message: "Adatbazis hiba tortent a csoport torlesekor." });
    }
});

// ===========================================
//  ADMIN VEGPONTOK - JELENTKEZOK KEZELESE
// ===========================================

// Egy csoport jelentkezoinek listaja
app.get("/admin/lista/:csid", tokenEllenorzes, function (req, res) {
    try {
        // Eloszor ellenorizzuk, letezik-e a csoport
        const csoport = db.prepare("SELECT 1 FROM csoportok WHERE csid = ?").get(Number(req.params.csid));
        if (!csoport) {
            return res.status(404).send({ message: "A megadott csoport nem letezik." });
        }

        const jelentkezok = db.prepare(`
            SELECT jid, jnev, szulnev, szulido, szulhely, anyjaneve, cim, telefon, email
            FROM jelentkezok
            WHERE csid = ?
            ORDER BY jnev
        `).all(Number(req.params.csid));

        res.status(200).send(jelentkezok);
    } catch (hiba) {
        console.error("Hiba a jelentkezok lekeresenel:", hiba.message);
        res.status(500).send({ message: "Adatbazis hiba tortent." });
    }
});

// Egy jelentkezo osszes adata
app.get("/admin/jelentkezok/:jid", tokenEllenorzes, function (req, res) {
    try {
        const jelentkezo = db.prepare(
            "SELECT * FROM jelentkezok WHERE jid = ?"
        ).get(Number(req.params.jid));

        if (jelentkezo) {
            res.status(200).send(jelentkezo);
        } else {
            res.status(404).send({ message: "Jelentkezo nem talalhato." });
        }
    } catch (hiba) {
        console.error("Hiba a jelentkezo lekeresenel:", hiba.message);
        res.status(500).send({ message: "Adatbazis hiba tortent." });
    }
});

// Jelentkezo adatainak modositasa
app.put("/admin/jelentkezok/:jid", tokenEllenorzes, function (req, res) {
    const { csid, jnev, szulnev, szulido, szulhely, anyjaneve, cim, telefon, email } = req.body;

    // Kotelezo mezok ellenorzese
    if (!csid || !jnev || !szulido || !szulhely || !anyjaneve || !cim || !telefon || !email) {
        return res.status(400).send({ message: "Hianyzo kotelezo mezok (csid, jnev, szulido, szulhely, anyjaneve, cim, telefon, email)." });
    }

    try {
        // Letezik-e a megadott csoport?
        const csoport = db.prepare("SELECT kid FROM csoportok WHERE csid = ?").get(Number(csid));
        if (!csoport) {
            return res.status(400).send({ message: "A megadott csoport (csid) nem letezik." });
        }

        const eredmeny = db.prepare(`
            UPDATE jelentkezok
            SET csid = ?, jnev = ?, szulnev = ?, szulido = ?,
                szulhely = ?, anyjaneve = ?, cim = ?, telefon = ?, email = ?
            WHERE jid = ?
        `).run(Number(csid), jnev, szulnev, szulido, szulhely, anyjaneve, cim, telefon, email, Number(req.params.jid));

        if (eredmeny.changes > 0) {
            res.status(200).send({ message: "Jelentkezo sikeresen modositva.", changes: eredmeny.changes });
        } else {
            // Megnezzuk, hogy egyaltalan letezik-e a jelentkezo
            const letezik = db.prepare("SELECT 1 FROM jelentkezok WHERE jid = ?").get(Number(req.params.jid));
            if (!letezik) {
                return res.status(404).send({ message: "Jelentkezo nem talalhato." });
            }
            res.status(200).send({ message: "Jelentkezo adatai nem valtoztak.", changes: 0 });
        }
    } catch (hiba) {
        console.error("Hiba a jelentkezo modositasanal:", hiba.message);
        if (hiba.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
            return res.status(400).send({ message: "Ervenytelen csoport azonosito (csid)." });
        }
        res.status(500).send({ message: "Adatbazis hiba tortent a jelentkezo modositasakor." });
    }
});

// Jelentkezo torlese
app.delete("/admin/jelentkezok/:jid", tokenEllenorzes, function (req, res) {
    try {
        const eredmeny = db.prepare(
            "DELETE FROM jelentkezok WHERE jid = ?"
        ).run(Number(req.params.jid));

        if (eredmeny.changes > 0) {
            res.status(200).send({ message: "Jelentkezo sikeresen torolve.", changes: eredmeny.changes });
        } else {
            res.status(404).send({ message: "Jelentkezo nem talalhato." });
        }
    } catch (hiba) {
        console.error("Hiba a jelentkezo torlesenel:", hiba.message);
        res.status(500).send({ message: "Adatbazis hiba tortent a jelentkezo torlesekor." });
    }
});

// ===========================================
//  SZERVER INDITASA
// ===========================================

app.listen(5000, function () {
    console.log("Szerver elindult az 5000-es porton...");
});

// Adatbazis lezarasa a program leallitasakor
process.on('exit', function () { db.close(); });
process.on('SIGINT', function () { process.exit(); });
process.on('SIGTERM', function () { process.exit(); });
