async function megjelenit() {
    const res = await fetch('http://127.0.0.1:3000/api/osszesadat');
    const data = await res.json();
    console.log(data);

    let kartya_div = document.getElementById('kartyak');
    kartya_div.innerHTML = '';

    data.results.forEach((game) => {
        let kartya = document.createElement('div');
        kartya.className = 'card d-block mx-auto m-2';
        let kartyatest = document.createElement('div');
        kartyatest.className = 'card-body';
        kartyatest.innerHTML = `
            <p>Id: ${game.id}</p>
            <p>Név: ${game.nev}</p>
            <p>Fejlesztő: ${game.fejleszto}</p>
            <p>Megjelenési év: ${game.megjelenes_eve}</p>
            <p>Műfaj: ${game.mufaj}</p>
            <p>Eladott példányszám: ${game.eladott_peldanyszam}</p>
            <p>Összbevétel: ${game.osszbevetel}</p>
        `;

        let belso_div = document.createElement('div');
        belso_div.className = 'col-3';
        
        kartya.appendChild(kartyatest);
        belso_div.appendChild(kartya);
        kartya_div.appendChild(belso_div);
    });
}
