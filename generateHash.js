// Ez a segedprogram egy jelszot alakit at titkositott formaba (hash).
// A kapott hash-t kell a .env fajlba masolni ADMIN valtozokent.
//
// Hasznalat: node generateHash.js

var bcrypt = require('bcrypt');

var jelszo = 'AdminJelszo123'; // Ide ird a kivant admin jelszot
var titkositasiSzint = 10;     // Mennyire legyen eros a titkositas (10 az ajanlott)

try {
    var hash = bcrypt.hashSync(jelszo, titkositasiSzint);
    console.log('A jelszo:', jelszo);
    console.log('Titkositott forma:', hash);
    console.log('');
    console.log('Masold be a .env fajlba igy:');
    console.log('ADMIN="' + hash + '"');
} catch (hiba) {
    console.error('Hiba a titkositas kozben:', hiba);
}
