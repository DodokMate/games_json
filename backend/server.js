//!Module-ok importálása
const express = require('express'); //?npm install express
const session = require('express-session'); //?npm install express-session
const fs = require('fs');
const path = require('path');

//!Beállítások
const app = express();
const router = express.Router();

const ip = '127.0.0.1';
const port = 3000;

app.use(express.json()); //?Middleware JSON
app.set('trust proxy', 1); //?Middleware Proxy

const dataPath = path.join(__dirname, "adatok", "games.json");
const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));

//!Session beállítása:
app.use(
    session({
        secret: 'titkos_kulcs', //?Ezt generálni kell a későbbiekben
        resave: false,
        saveUninitialized: true
    })
);

//!Routing
//?Főoldal:
router.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, '../frontend/html/index.html'));
});

//!API endpoints
app.use('/', router);
const endpoints = require('./api/api.js');
const { request } = require('http');
app.use('/api', endpoints);

//Összes adat
app.get("/api/osszesadat", (req, res) => {
    console.log(`[${new Date().toLocaleTimeString()}] /api/osszesadat hívás érkezett!`);

    res.json({ results : data.results})
    console.log(data.results);
});

//1. feladat: RPG játékok lekérése
app.get("/api/rpg", (req, res) => {
    console.log(`[${new Date().toLocaleTimeString()}] /api/rpg hívás érkezett!`);

    const rpgjatekok = data.results.filter(game => game.mufaj.includes("RPG"));
    res.json({ results : rpgjatekok});
    console.log(rpgjatekok);
});

//2. feladat: bevétel nagyobb mint 100 000 000
app.get("/api/egymillio", (req, res) => {
    console.log(`[${new Date().toLocaleTimeString()}] /api/egymillio hívás érkezett!`);

    const egymilliosJatekok = data.results.filter(game => game.osszbevetel > 100000000);
    res.json({ results: egymilliosJatekok });
    console.log(egymilliosJatekok);
});

//3. feladat: 2000 után kiadott játékok
app.get("/api/ketezresek", (req, res) => {
    console.log(`[${new Date().toLocaleTimeString()}] /api/ketezresek hívás érkezett!`);

    const ketezresJatekok = data.results.filter(game => game.megjelenes_eve > 2000);
    res.json({ results: ketezresJatekok });
    console.log(ketezresJatekok);
});

//4. felafat: 1990 és 2010 között kiadott játékok
app.get("/api/kilencvenestiz", (req, res) => {
    console.log(`[${new Date().toLocaleTimeString()}] /api/kilencvenestiz hívás érkezett!`);

    const kilencvenestiz = data.results.filter(game => game.megjelenes_eve >= 1990 && game.megjelenes_eve <= 2010);
    res.json({ results: kilencvenestiz });
    console.log(kilencvenestiz);
});

//5. feladat: a név tartalmazza a war szót
app.get("/api/war", (req, res) => {
    console.log(`[${new Date().toLocaleTimeString()}] /api/war hívás érkezett!`);

    const warJatekok = data.results.filter(game => game.nev.includes("War"));
    res.json({ results: warJatekok });
    console.log(warJatekok);
});

//6. feladat: Action vagy Adventure műfajú játékok
app.get("/api/actionadventure", (req, res) => {
    console.log(`[${new Date().toLocaleTimeString()}] /api/actionadventure hívás érkezett!`);

    const actionAdventureJatekok = data.results.filter(game => game.mufaj === "Action" || game.mufaj === "Adventure" || game.mufaj === "Action-Adventure" || game.mufaj === "Action Adventure");
    res.json({ results: actionAdventureJatekok });
    console.log(actionAdventureJatekok);
});

//7. feladat: a bevétel 50 000000 és 200 000 000 közötti játékok
app.get("/api/bevetel", (req, res) => {
    console.log(`[${new Date().toLocaleTimeString()}] /api/bevetel hívás érkezett!`);

    const bevetelJatekok = data.results.filter(game => game.osszbevetel >= 50000000 && game.osszbevetel <= 200000000);
    res.json({ results: bevetelJatekok });
    console.log(bevetelJatekok);
});

//8. feladat: műfaja nem Puzzle
app.get("/api/nempuzzle", (req, res) => {
    console.log(`[${new Date().toLocaleTimeString()}] /api/nempuzzle hívás érkezett!`);

    const nemPuzzleJatekok = data.results.filter(game => game.mufaj !== "Puzzle");
    res.json({ results: nemPuzzleJatekok });
    console.log(nemPuzzleJatekok);
});

//9. feladat: játék cím ami 5 szóból áll
app.get("/api/otszo", (req, res) => {
    console.log(`[${new Date().toLocaleTimeString()}] /api/otszo hívás érkezett!`);

    const otSzoJatekok = data.results.filter(game => game.nev.trim().split(/\s+/).length === 5);
    res.json({ results: otSzoJatekok });
    console.log(otSzoJatekok);
});

//10. feladat: top 10 bevételű játék
app.get("/api/toptiz", (req, res) => {
    console.log(`[${new Date().toLocaleTimeString()}] /api/toptiz hívás érkezett!`);

    const toptizJatekok = data.results.sort((a, b) => b.osszbevetel - a.osszbevetel).slice(0, 10);
    res.json({ results: toptizJatekok });
    console.log(toptizJatekok);
}); 

//11. feladat: megjelenési év 1980 előtt van
app.get("/api/nyolcvanelott", (req, res) => {
    console.log(`[${new Date().toLocaleTimeString()}] /api/nyolcvanelott hívás érkezett!`);

    const nyolcvanelottJatekok = data.results.filter(game => game.megjelenes_eve < 1980);
    res.json({ results: nyolcvanelottJatekok });
    console.log(nyolcvanelottJatekok);
});

//12. feladat: shooter műfajú játékok amikneka bevétele nagyobb mint 150 000 000
app.get("/api/shooter150", (req, res) => {
    console.log(`[${new Date().toLocaleTimeString()}] /api/shooter150 hívás érkezett!`);
    
    const shooter150Jatekok = data.results.filter(game => game.mufaj === "Shooter" && game.osszbevetel > 150000000);
    res.json({ results: shooter150Jatekok });
    console.log(shooter150Jatekok);
});

//13. feladat: star vagy galaxy van a nevében
app.get("/api/stargalaxy", (req, res) => {
    console.log(`[${new Date().toLocaleTimeString()}] /api/stargalaxy hívás érkezett!`);

    const stargalaxy = data.results.filter(game => game.nev.includes("Star") || game.nev.includes("Galaxy"));
    res.json({results: stargalaxy});
    console.log(stargalaxy); 
});

//14. feladat: bevétel pontosan 50 000 000
app.get("/api/otvenmilla", (req,res) => {
    console.log(`[${new Date().toLocaleTimeString()}]/api/otvenmilla hívás érkezett!`);

    const otvenmillasJatekok = data.results.filter(game => game.osszbevetel == 50000000);
    res.json({results: otvenmillasJatekok});
    console.log(otvenmillasJatekok);
});

//15. feladat: műfaja strategy és kiadási év 2010 után
app.get("/api/strategyafter2010", (req,res) => {
    console.log(`[${new Date().toLocaleTimeString()}]/api/strategyafter2010 hívás érkezett!`);

    const strategyketezertiz = data.results.filter(game => game.mufaj.includes("Strategy") && game.megjelenes_eve > 2010);
    res.json({results: strategyketezertiz});
    console.log(strategyketezertiz);
});

//16. feladat: címe The szóval kezdődik
app.get("/api/thekezdes", (req,res) => {
    console.log(`[${new Date().toLocaleTimeString()}]/api/thekezdes hívás érkezett!`);

    const thekezdesJatekok = data.results.filter(game => game.nev.startsWith("The"));
    res.json({results: thekezdesJatekok});
    console.log(thekezdesJatekok);
});

//17. feladat: racing vagy sport műfajú
app.get("/api/racingorsport", (req,res) => {
    console.log(`[${new Date().toLocaleTimeString()}]/api/racingorsport hívás érkezett!`);
    
    const racingorsport = data.results.filter(game => game.mufaj.includes("Racing") || game.mufaj.includes("Sport"));
    res.json({results: racingorsport});
    console.log(racingorsport);
});

//18. feladat: bevétel ksiebb mint 20 000 000
app.get("/api/huszmillaalatt", (req,res) => {
    console.log(`[${new Date().toLocaleTimeString()}]/api/huszmillaalatt hívás érkezett!`);
    
    const huszmillaalatt = data.results.filter(game => game.osszbevetel < 20000000);
    res.json({results: huszmillaalatt});
    console.log(huszmillaalatt);
});

//19. feladat: 1980 és 1989 között megjelent játékok
app.get("/api/nyolcvanasevek", (req, res) => {
    console.log(`[${new Date().toLocaleTimeString()}] /api/nyolcvanasevek hívás érkezett!`);

    const nyolcvanasevek = data.results.filter(game => game.megjelenes_eve < 1989 && game.megjelenes_eve > 1980);
    res.json(!data.results ? { results: nyolcvanasevek } : "Nincs ilyen játék!" );
    console.log(nyolcvanasevek.length ? nyolcvanasevek : "Nincs ilyen játék!");
});

//20. feladat: műfaj simulation és a cím tartalmazza a city szót
app.get("/api/citysimulation", (req, res) => {
    console.log(`[${new Date().toLocaleTimeString()}] /api/citysimulation hívás érkezett!`);

    const citysimulation = data.results.filter(game => game.mufaj.includes("Simulation") && game.nev.includes("city"));
    res.json(data.length ? { results: citysimulation } : {message: "Nincs ilyen játék!"} );
    console.log(citysimulation.length ? citysimulation : "Nincs ilyen játék!");
});

//!Szerver futtatása
app.use(express.static(path.join(__dirname, '../frontend'))); //?frontend mappa tartalmának betöltése az oldal működéséhez
app.listen(port, ip, () => {
    console.log(`Szerver elérhetősége: http://${ip}:${port}`);
});

//?Szerver futtatása terminalból: npm run dev
//?Szerver leállítása (MacBook és Windows): Control + C
//?Terminal ablak tartalmának törlése (MacBook): Command + K
