// Beállítások betöltése a .env fájlból (jelszó hash, titkos kulcs)
require('dotenv').config();

// Szükséges csomagok betöltése
const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const Database = require('better-sqlite3');

// Szerver létrehozása
const app = express();
app.use(express.json());        // JSON formátumú kérések fogadása
app.use(express.static('public')); // A public mappa fájljainak kiszolgálása

// --- Adatbázis beállítása ---

const db = new Database('tanfolyamok.db');
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Táblák létrehozása, ha még nem léteznek
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
//  NYILVÁNOS VÉGPONTOK (bejelentkezés nélkül)
// ===========================================

// Még nem indult csoportok listája létszámmal
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
        console.error("Hiba a csoportok lekérésénél:", hiba.message);
        res.status(500).send({ message: "Adatbázis hiba történt." });
    }
});

// Új jelentkező hozzáadása egy csoporthoz
app.post("/public/jelentkezok", function (req, res) {
    const { csid, jnev, szulnev, szulido, szulhely, anyjaneve, cim, telefon, email } = req.body;

    // Kötelező mezők ellenőrzése
    if (!csid || !jnev || !szulido || !szulhely || !anyjaneve || !cim || !telefon || !email) {
        return res.status(400).send({ message: "Hiányzó kötelező mezők." });
    }

    try {
        // Létezik-e a csoport és még nem indult el?
        const csoport = db.prepare(
            "SELECT kid FROM csoportok WHERE csid = ? AND indulas >= date('now')"
        ).get(csid);

        if (!csoport) {
            return res.status(404).send({ message: "Ebbe a csoportba nem lehet jelentkezni." });
        }

        // Volt már jelentkezés ezzel az e-maillel?
        const duplikalt = db.prepare(
            "SELECT jid FROM jelentkezok WHERE csid = ? AND email = ?"
        ).get(csid, email);

        if (duplikalt) {
            return res.status(409).send({ message: "Ezzel az e-mail címmel már jelentkeztek ebbe a csoportba." });
        }

        // Van még szabad hely? (maximum 8 fő)
        const letszam = db.prepare(
            "SELECT COUNT(jid) AS db FROM jelentkezok WHERE csid = ?"
        ).get(csid);

        if (letszam.db >= 8) {
            return res.status(409).send({ message: "A csoport megtelt, maximum 8 fő jelentkezhet." });
        }

        // Jelentkező mentése az adatbázisba
        const eredmeny = db.prepare(`
            INSERT INTO jelentkezok (csid, jnev, szulnev, szulido, szulhely, anyjaneve, cim, telefon, email)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(csid, jnev, szulnev, szulido, szulhely, anyjaneve, cim, telefon, email);

        res.status(201).send({
            message: "Sikeres jelentkezés!",
            jid: eredmeny.lastInsertRowid,
            changes: eredmeny.changes
        });
    } catch (hiba) {
        console.error("Hiba a jelentkezés rögzítésénél:", hiba.message);
        if (hiba.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
            return res.status(400).send({ message: "Érvénytelen csoport azonosító (csid)." });
        }
        res.status(500).send({ message: "Adatbázis hiba történt a jelentkezés rögzítésekor." });
    }
});

// ===========================================
//  ADMIN BEJELENTKEZÉS
// ===========================================

// Jelszó ellenőrzése és token kiadása
app.post("/admin", function (req, res) {
    const helyes = bcrypt.compareSync(req.body.password, process.env.ADMIN);

    if (!helyes) {
        return res.status(401).send({ message: "Hibás jelszó!" });
    }

    // 1 órás token generálása
    const token = jwt.sign(
        { password: req.body.password },
        process.env.TOKEN_SECRET,
        { expiresIn: 3600 }
    );

    res.status(200).send({ token: token, message: "Sikeres bejelentkezés." });
});

// Token ellenőrző függvény - minden admin végpont előtt lefut
function tokenEllenorzes(req, res, next) {
    const fejlec = req.headers['authorization'];
    const token = fejlec && fejlec.split(' ')[1];

    if (!token) {
        return res.status(401).send({ message: "Azonosítás szükséges!" });
    }

    jwt.verify(token, process.env.TOKEN_SECRET, function (hiba) {
        if (hiba) {
            return res.status(403).send({ message: "Nincs jogosultsága!" });
        }
        next();
    });
}

// ===========================================
//  ADMIN VÉGPONTOK - CSOPORTOK KEZELÉSE
// ===========================================

// Összes csoport listája (múltbeliek is)
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
        console.error("Hiba a csoportok lekérésénél:", hiba.message);
        res.status(500).send({ message: "Adatbázis hiba történt." });
    }
});

// Új csoport létrehozása
app.post("/admin/csoportok", tokenEllenorzes, function (req, res) {
    const { kid, indulas, beosztas, helyszin, ar } = req.body;

    if (!kid || !indulas || !beosztas || !helyszin || !ar) {
        return res.status(400).send({ message: "Hiányzó kötelező mezők." });
    }
    if (ar < 0) {
        return res.status(400).send({ message: "Az ár nem lehet negatív." });
    }

    try {
        const eredmeny = db.prepare(
            "INSERT INTO csoportok (kid, indulas, beosztas, helyszin, ar) VALUES (?, ?, ?, ?, ?)"
        ).run(Number(kid), indulas, beosztas, helyszin, Number(ar));

        res.status(201).send({
            message: "Csoport sikeresen hozzáadva!",
            id: eredmeny.lastInsertRowid,
            changes: eredmeny.changes
        });
    } catch (hiba) {
        console.error("Hiba a csoport létrehozásánál:", hiba.message);
        if (hiba.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
            return res.status(400).send({ message: "Érvénytelen képzés azonosító (kid)." });
        }
        res.status(500).send({ message: "Adatbázis hiba történt a csoport létrehozásakor." });
    }
});

// Egy csoport adatainak lekérése
app.get("/admin/csoportok/:csid", tokenEllenorzes, function (req, res) {
    try {
        const csoport = db.prepare(
            "SELECT kid, indulas, beosztas, helyszin, ar FROM csoportok WHERE csid = ?"
        ).get(Number(req.params.csid));

        if (csoport) {
            res.status(200).send(csoport);
        } else {
            res.status(404).send({ message: "Csoport nem található." });
        }
    } catch (hiba) {
        console.error("Hiba a csoport lekérésénél:", hiba.message);
        res.status(500).send({ message: "Adatbázis hiba történt." });
    }
});

// Csoport adatainak módosítása
app.put("/admin/csoportok/:csid", tokenEllenorzes, function (req, res) {
    const { kid, indulas, beosztas, helyszin, ar } = req.body;

    if (!kid || !indulas || !beosztas || !helyszin || !ar) {
        return res.status(400).send({ message: "Hiányzó kötelező mezők." });
    }
    if (ar < 0) {
        return res.status(400).send({ message: "Az ár nem lehet negatív." });
    }

    try {
        const eredmeny = db.prepare(
            "UPDATE csoportok SET kid = ?, indulas = ?, beosztas = ?, helyszin = ?, ar = ? WHERE csid = ?"
        ).run(Number(kid), indulas, beosztas, helyszin, Number(ar), Number(req.params.csid));

        if (eredmeny.changes > 0) {
            res.status(200).send({ message: "Csoport sikeresen módosítva.", changes: eredmeny.changes });
        } else {
            res.status(404).send({ message: "Csoport nem található vagy nem történt módosítás." });
        }
    } catch (hiba) {
        console.error("Hiba a csoport módosításánál:", hiba.message);
        if (hiba.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
            return res.status(400).send({ message: "Érvénytelen képzés azonosító (kid)." });
        }
        res.status(500).send({ message: "Adatbázis hiba történt a csoport módosításakor." });
    }
});

// Csoport törlése
app.delete("/admin/csoportok/:csid", tokenEllenorzes, function (req, res) {
    try {
        const eredmeny = db.prepare(
            "DELETE FROM csoportok WHERE csid = ?"
        ).run(Number(req.params.csid));

        if (eredmeny.changes > 0) {
            res.status(200).send({ message: "Csoport sikeresen törölve.", changes: eredmeny.changes });
        } else {
            res.status(404).send({ message: "Csoport nem található." });
        }
    } catch (hiba) {
        console.error("Hiba a csoport törlésénél:", hiba.message);
        if (hiba.code === 'SQLITE_CONSTRAINT_FOREIGNKEY' || hiba.message.toUpperCase().includes("FOREIGN KEY CONSTRAINT FAILED")) {
            return res.status(400).send({ message: "A csoport nem törölhető, mert vannak hozzá rendelt jelentkezők." });
        }
        res.status(500).send({ message: "Adatbázis hiba történt a csoport törlésekor." });
    }
});

// ===========================================
//  ADMIN VÉGPONTOK - JELENTKEZŐK KEZELÉSE
// ===========================================

// Egy csoport jelentkezőinek listája
app.get("/admin/lista/:csid", tokenEllenorzes, function (req, res) {
    try {
        // Először ellenőrizzük, létezik-e a csoport
        const csoport = db.prepare("SELECT 1 FROM csoportok WHERE csid = ?").get(Number(req.params.csid));
        if (!csoport) {
            return res.status(404).send({ message: "A megadott csoport nem létezik." });
        }

        const jelentkezok = db.prepare(`
            SELECT jid, jnev, szulnev, szulido, szulhely, anyjaneve, cim, telefon, email
            FROM jelentkezok
            WHERE csid = ?
            ORDER BY jnev
        `).all(Number(req.params.csid));

        res.status(200).send(jelentkezok);
    } catch (hiba) {
        console.error("Hiba a jelentkezők lekérésénél:", hiba.message);
        res.status(500).send({ message: "Adatbázis hiba történt." });
    }
});

// Egy jelentkező összes adata
app.get("/admin/jelentkezok/:jid", tokenEllenorzes, function (req, res) {
    try {
        const jelentkezo = db.prepare(
            "SELECT * FROM jelentkezok WHERE jid = ?"
        ).get(Number(req.params.jid));

        if (jelentkezo) {
            res.status(200).send(jelentkezo);
        } else {
            res.status(404).send({ message: "Jelentkező nem található." });
        }
    } catch (hiba) {
        console.error("Hiba a jelentkező lekérésénél:", hiba.message);
        res.status(500).send({ message: "Adatbázis hiba történt." });
    }
});

// Jelentkező adatainak módosítása
app.put("/admin/jelentkezok/:jid", tokenEllenorzes, function (req, res) {
    const { csid, jnev, szulnev, szulido, szulhely, anyjaneve, cim, telefon, email } = req.body;

    // Kötelező mezők ellenőrzése
    if (!csid || !jnev || !szulido || !szulhely || !anyjaneve || !cim || !telefon || !email) {
        return res.status(400).send({ message: "Hiányzó kötelező mezők (csid, jnev, szulido, szulhely, anyjaneve, cim, telefon, email)." });
    }

    try {
        // Létezik-e a megadott csoport?
        const csoport = db.prepare("SELECT kid FROM csoportok WHERE csid = ?").get(Number(csid));
        if (!csoport) {
            return res.status(400).send({ message: "A megadott csoport (csid) nem létezik." });
        }

        const eredmeny = db.prepare(`
            UPDATE jelentkezok
            SET csid = ?, jnev = ?, szulnev = ?, szulido = ?,
                szulhely = ?, anyjaneve = ?, cim = ?, telefon = ?, email = ?
            WHERE jid = ?
        `).run(Number(csid), jnev, szulnev, szulido, szulhely, anyjaneve, cim, telefon, email, Number(req.params.jid));

        if (eredmeny.changes > 0) {
            res.status(200).send({ message: "Jelentkező sikeresen módosítva.", changes: eredmeny.changes });
        } else {
            // Megnézzük, hogy egyáltalán létezik-e a jelentkező
            const letezik = db.prepare("SELECT 1 FROM jelentkezok WHERE jid = ?").get(Number(req.params.jid));
            if (!letezik) {
                return res.status(404).send({ message: "Jelentkező nem található." });
            }
            res.status(200).send({ message: "Jelentkező adatai nem változtak.", changes: 0 });
        }
    } catch (hiba) {
        console.error("Hiba a jelentkező módosításánál:", hiba.message);
        if (hiba.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
            return res.status(400).send({ message: "Érvénytelen csoport azonosító (csid)." });
        }
        res.status(500).send({ message: "Adatbázis hiba történt a jelentkező módosításakor." });
    }
});

// Jelentkező törlése
app.delete("/admin/jelentkezok/:jid", tokenEllenorzes, function (req, res) {
    try {
        const eredmeny = db.prepare(
            "DELETE FROM jelentkezok WHERE jid = ?"
        ).run(Number(req.params.jid));

        if (eredmeny.changes > 0) {
            res.status(200).send({ message: "Jelentkező sikeresen törölve.", changes: eredmeny.changes });
        } else {
            res.status(404).send({ message: "Jelentkező nem található." });
        }
    } catch (hiba) {
        console.error("Hiba a jelentkező törlésénél:", hiba.message);
        res.status(500).send({ message: "Adatbázis hiba történt a jelentkező törlésekor." });
    }
});

// ===========================================
//  SZERVER INDÍTÁSA
// ===========================================

app.listen(5000, function () {
    console.log("Szerver elindult az 5000-es porton...");
});

// Adatbázis lezárása a program leállításakor
process.on('exit', function () { db.close(); });
process.on('SIGINT', function () { process.exit(); });
process.on('SIGTERM', function () { process.exit(); });
