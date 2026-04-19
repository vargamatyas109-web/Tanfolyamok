// Ez a segédprogram egy jelszót alakít át titkosított formába (hash).
// A kapott hash-t kell a .env fájlba másolni ADMIN változóként.
//
// Használat: node generateHash.js

var bcrypt = require('bcrypt');

var jelszo = 'AdminJelszo'; // Ide írd a kívánt admin jelszót
var titkositasiSzint = 10;     // Mennyire legyen erős a titkosítás (10 az ajánlott)

try {
    var hash = bcrypt.hashSync(jelszo, titkositasiSzint);
    console.log('A jelszó:', jelszo);
    console.log('Titkosított forma:', hash);
    console.log('');
    console.log('Másold be a .env fájlba így:');
    console.log('ADMIN="' + hash + '"');
} catch (hiba) {
    console.error('Hiba a titkosítás közben:', hiba);
}
