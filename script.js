const characters = [
    { name: "Neon Blade", hp: 100, atk: [15, 20], def: [5, 8], icon: "⚔️", desc: "Equilibrado e letal." },
    { name: "Cyber Mage", hp: 100, atk: [18, 22], def: [3, 6], icon: "🔮", desc: "Alto dano, pouca defesa." },
    { name: "Data Tank", hp: 100, atk: [10, 15], def: [8, 12], icon: "🛡️", desc: "Resistência máxima." },
    { name: "Glitch Rogue", hp: 100, atk: [14, 18], def: [4, 7], icon: "👤", desc: "Ataques rápidos e furtivos." }
];

const weapons = [
    { name: "Katana de Plasma", atkMod: 5, defMod: -2, icon: "🗡️" },
    { name: "Escudo Digital", atkMod: -2, defMod: 6, icon: "🛡️" },
    { name: "Canhão Crítico", atkMod: 8, defMod: -4, icon: "🔫" },
    { name: "Lâminas Ocultas", atkMod: 2, defMod: 2, icon: "🔪" }
];

let p1 = null;
let p2 = null;
let gameMode = 'cpu'; // 'cpu' or 'pvp'
let currentTurn = 1; // 1 for P1, 2 for P2
let selectionOrder = 1; // 1 for P1 choosing, 2 for P2 choosing

// DOM Elements
const modeScreen = document.getElementById('mode-screen');
const selectionScreen = document.getElementById('selection-screen');
const battleScreen = document.getElementById('battle-screen');
const charList = document.querySelector('.character-list');
const weaponList = document.getElementById('weapon-list');
const selectionTitle = document.getElementById('selection-title');
const battleLog = document.getElementById('battle-log');
const modal = document.getElementById('result-modal');
const modalText = document.getElementById('result-text');
const attackBtn = document.getElementById('attack-btn');
const turnIndicator = document.getElementById('turn-indicator');

// Game Flow Functions
function setMode(mode) {
    gameMode = mode;
    modeScreen.classList.remove('active');
    selectionScreen.classList.add('active');
    initSelection();
}

function initSelection() {
    charList.innerHTML = '';
    weaponList.innerHTML = '';
    weaponList.parentElement.classList.add('hidden');
    charList.classList.remove('hidden');

    selectionTitle.textContent = gameMode === 'pvp' ? `CONTROLE DO JOGADOR ${selectionOrder}` : "ESCOLHA SEU HERÓI";

    characters.forEach((char, index) => {
        const card = document.createElement('div');
        card.className = 'char-card';
        card.innerHTML = `
            <div class="card-icon">${char.icon}</div>
            <h4>${char.name}</h4>
            <p class="desc">${char.desc}</p>
            <div class="stats">
                <span>ATK: ${char.atk[0]}-${char.atk[1]}</span>
                <span>DEF: ${char.def[0]}-${char.def[1]}</span>
            </div>
        `;
        card.onclick = () => selectCharacter(index);
        charList.appendChild(card);
    });
}

function selectCharacter(index) {
    const selectedChar = { ...characters[index], currentHp: 100 };
    if (selectionOrder === 1) {
        p1 = selectedChar;
        showWeaponSelection();
    } else {
        p2 = selectedChar;
        showWeaponSelection();
    }
}

function showWeaponSelection() {
    charList.classList.add('hidden');
    weaponList.parentElement.classList.remove('hidden');
    weaponList.innerHTML = '';

    selectionTitle.textContent = "ESCOLHA SUA ARMA";

    weapons.forEach((weapon, index) => {
        const card = document.createElement('div');
        card.className = 'weapon-card';
        card.innerHTML = `
            <div class="card-icon">${weapon.icon}</div>
            <h4>${weapon.name}</h4>
            <p>ATK: ${weapon.atkMod > 0 ? '+' : ''}${weapon.atkMod}</p>
            <p>DEF: ${weapon.defMod > 0 ? '+' : ''}${weapon.defMod}</p>
        `;
        card.onclick = () => selectWeapon(index);
        weaponList.appendChild(card);
    });
}

function selectWeapon(index) {
    const weapon = weapons[index];
    if (selectionOrder === 1) {
        p1.weapon = weapon;
        p1.atk = [p1.atk[0] + weapon.atkMod, p1.atk[1] + weapon.atkMod];
        p1.def = [p1.def[0] + weapon.defMod, p1.def[1] + weapon.defMod];

        if (gameMode === 'pvp') {
            selectionOrder = 2;
            initSelection();
        } else {
            // Random CPU
            const cpuCharIndex = Math.floor(Math.random() * characters.length);
            const cpuWeaponIndex = Math.floor(Math.random() * weapons.length);
            p2 = { ...characters[cpuCharIndex], currentHp: 100 };
            p2.weapon = weapons[cpuWeaponIndex];
            p2.atk = [p2.atk[0] + p2.weapon.atkMod, p2.atk[1] + p2.weapon.atkMod];
            p2.def = [p2.def[0] + p2.weapon.defMod, p2.def[1] + p2.weapon.defMod];
            p2.name += " (CPU)";
            startBattle();
        }
    } else {
        p2.weapon = weapon;
        p2.atk = [p2.atk[0] + weapon.atkMod, p2.atk[1] + weapon.atkMod];
        p2.def = [p2.def[0] + weapon.defMod, p2.def[1] + weapon.defMod];
        startBattle();
    }
}

function startBattle() {
    selectionScreen.classList.remove('active');
    battleScreen.classList.add('active');

    document.getElementById('p-name').textContent = p1.name;
    document.getElementById('p-icon').innerHTML = `${p1.icon}<span class="weapon-mini">${p1.weapon.icon}</span>`;

    document.getElementById('c-name').textContent = p2.name;
    document.getElementById('c-icon').innerHTML = `${p2.icon}<span class="weapon-mini">${p2.weapon.icon}</span>`;

    updateHuds();
    battleLog.innerHTML = '';
    currentTurn = 1;
    updateTurnIndicator();
    addLog("O combate começou!");
}

function updateTurnIndicator() {
    if (gameMode === 'pvp') {
        turnIndicator.textContent = `TURNO DO JOGADOR ${currentTurn}`;
        attackBtn.textContent = `ATACAR (P${currentTurn})`;
    } else {
        turnIndicator.textContent = currentTurn === 1 ? "SEU TURNO" : "TURNO DO ADVERSÁRIO";
        attackBtn.textContent = "ATACAR";
        attackBtn.style.opacity = currentTurn === 1 ? '1' : '0.5';
    }
}

function updateHuds() {
    const p1Percent = (p1.currentHp / 100) * 100;
    const p2Percent = (p2.currentHp / 100) * 100;

    document.getElementById('p-hp').style.width = `${Math.max(0, p1Percent)}%`;
    document.getElementById('c-hp').style.width = `${Math.max(0, p2Percent)}%`;
}

function addLog(msg) {
    const p = document.createElement('p');
    p.textContent = msg;
    battleLog.prepend(p);
}

function attack() {
    if (p1.currentHp <= 0 || p2.currentHp <= 0) return;

    if (gameMode === 'cpu' && currentTurn !== 1) return;

    if (currentTurn === 1) {
        performAttack(p1, p2);
        if (p2.currentHp > 0) {
            currentTurn = 2;
            updateTurnIndicator();
            if (gameMode === 'cpu') {
                setTimeout(cpuTurn, 1000);
            }
        }
    } else if (gameMode === 'pvp') {
        performAttack(p2, p1);
        if (p1.currentHp > 0) {
            currentTurn = 1;
            updateTurnIndicator();
        }
    }
}

function cpuTurn() {
    performAttack(p2, p1);
    if (p1.currentHp > 0) {
        currentTurn = 1;
        updateTurnIndicator();
    }
}

function performAttack(attacker, defender) {
    const atkVal = Math.floor(Math.random() * (attacker.atk[1] - attacker.atk[0] + 1)) + attacker.atk[0];
    const defVal = Math.floor(Math.random() * (defender.def[1] - defender.def[0] + 1)) + defender.def[0];

    let damage = atkVal - defVal;
    if (damage < 0) damage = 0;

    defender.currentHp -= damage;
    updateHuds();

    addLog(`${attacker.name} usou ${attacker.weapon.name} e causou ${damage} de dano!`);
    showDamageEffect(defender === p2 ? 'cpu' : 'player', damage);

    if (defender.currentHp <= 0) {
        setTimeout(() => endGame(attacker === p1), 500);
    }
}

function showDamageEffect(target, damage) {
    const element = document.getElementById(target + '-container');
    const rect = element.getBoundingClientRect();

    const text = document.createElement('div');
    text.className = 'damage-text';
    text.textContent = `-${damage}`;
    text.style.left = `${rect.left + rect.width / 2}px`;
    text.style.top = `${rect.top}px`;

    document.body.appendChild(text);
    setTimeout(() => text.remove(), 800);

    element.style.animation = 'none';
    element.offsetHeight;
    element.style.animation = 'shake 0.5s';
}

function endGame(p1Won) {
    modal.classList.add('active');
    if (gameMode === 'pvp') {
        modalText.textContent = p1Won ? "JOGADOR 1 VENCEU!" : "JOGADOR 2 VENCEU!";
    } else {
        modalText.textContent = p1Won ? "VITÓRIA!" : "DERROTA...";
    }
}

function resetGame() {
    modal.classList.remove('active');
    battleScreen.classList.remove('active');
    modeScreen.classList.add('active');
    selectionOrder = 1;
    p1 = null;
    p2 = null;
}

// Add shake animation to style or script
const style = document.createElement('style');
style.innerHTML = `
@keyframes shake {
    0% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    50% { transform: translateX(10px); }
    75% { transform: translateX(-10px); }
    100% { transform: translateX(0); }
}
`;
document.head.appendChild(style);

// Start Screen
// initSelection(); // Removido para o fluxo de modo
