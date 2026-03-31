
// animacia čisel
function animujCislo(testPred, velicina, textId, konecnaHodnota, trvanie = 1500) {
    let start = null;

    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    function krok(cas) {
        if (!start) start = cas;
        let progress = cas - start;

        let percento = progress / trvanie;
        if (percento > 1) percento = 1;

        let eased = easeOutCubic(percento);
        let aktualnaHodnota = konecnaHodnota * eased;

        document.getElementById(textId).textContent =
            testPred + aktualnaHodnota.toFixed(1).replace(".", ",") + velicina;

        if (percento < 1) {
            requestAnimationFrame(krok);
        }
    }

    requestAnimationFrame(krok);
}


// doplňovanie radiusu a priemeru z selectu
function nastavRozmery() {
    let select = document.getElementById("vyber_kolena").value;
    //console.log(select);
    
    if (select !== "") {
        let hodnoty = select.split(",");
        //console.log(hodnoty);
        document.getElementById("radius").value = hodnoty[0];
        document.getElementById("priemer").value = hodnoty[1];
    }    
}

// Výpočet uhla
function vypocitaj() {
    let r = parseFloat(document.getElementById("radius").value);
    let o = parseFloat(document.getElementById("odskok").value);
    let chyba = document.getElementById("chyba");
    let uholInput = document.getElementById("uhol");
    let uholl = document.getElementById("uholl");
    let max = 2 * r;

    chyba.innerText = "";
    uholInput.value = "";

    // Kontrola vstupov
    if (!r || !o) {
        return;
    }

    if (r <= 0 || o <= 0) {
        chyba.innerText = "Hodnoty musia byť väčšie ako 0";
        return;
    }

    if (o > 2 * r) {
        chyba.innerText = "Odskok nad " + max + " mm sú už dve celé kolená";
        return;
    }

    let hodnota = (r - (o / 2)) / r;

    if (hodnota < -1 || hodnota > 1) {
        chyba.innerText = "Matematická chyba (acos mimo rozsah)";
        return;
    }

    // výpočet uhla v radiánech a převod na stupně
    let uhol = Math.acos(hodnota);
    uhol = uhol * (180 / Math.PI);

    // vyplní input
    uholInput.value = uhol.toFixed(1) + "°";

    // vyplní text p id "uholl" zatial vypnuté
    //uholl.innerText = "Uhol je " + uhol.toFixed(1).replace(".", ",") + "°";
    // animace čísla
    animujCislo("Uhol je: ", "°", "uholl", uhol, 1500);

}

// Výpočet rezu
function vypocitajRez() {
    // vstupy
    const D = parseFloat(document.getElementById("priemer").value);
    const r = parseFloat(document.getElementById("radius").value);
    const uhol = parseFloat(document.getElementById("uhol").value);
    let miestoRezu = document.getElementById("miesto_rezu");

    
    
    // Kontrola vstupov
    if (!D || !r || !uhol) {
        return;
    }

    miestoRezu.innerText = "";

    // premena stupňov na radiány
    const uholRad = (uhol * Math.PI) / 180;

    // výpočet
    const a = r - (D / 2);
    const c = Math.sqrt(2 * a * a * (1 - Math.cos(uholRad)));

    
    // výstup
    //miestoRezu.innerText ="Rez je " + c.toFixed(1).replace(".", ",") + " mm od okraja kolena";
    animujCislo("Miesto rezu je: ", "mm", "miesto_rezu", c, 1500);

    // vibrácia
    if (navigator.vibrate) {
        navigator.vibrate([300, 100, 300]);
    }

    // hlasová správa
    let msg = new SpeechSynthesisUtterance("Rez je " + c.toFixed(1).replace(".", ",") + " milimetrov od okraja kolena a uhol" + uhol.toFixed(1) + "si nastav z digitalnym uhlomerom");
    setTimeout(() => {
        msg.text = "Rez je " + c.toFixed(1).replace(".", ",") + " milimetrov ";
    }, 2000);

    //speechSynthesis.speak(msg);
    //console.log(c.toFixed(1).replace(".", ","));
    
}

let timeout1;

function spustiVypocerSOneskocenim() {
    clearTimeout(timeout1);
    timeout1 = setTimeout(() => {
        vypocitaj();
        vypocitajRez();
    }, 1500);
}