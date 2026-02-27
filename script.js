const characters = [
    { name: "Neon Blade", hp: 100, atk: [15, 20], def: [5, 8], icon: "⚔️" },
    { name: "Cyber Mage", hp: 100, atk: [18, 22], def: [3, 6], icon: "🔮" },
    { name: "Data Tank", hp: 100, atk: [10, 15], def: [8, 12], icon: "🛡️" },
    { name: "Glitch Rogue", hp: 100, atk: [12, 18], def: [4, 7], icon: "👤" }
];

let player = null;
let cpu = null;
let isPlayerTurn = true;

// DOM Elements
const selectionScreen = document.getElementById('selection-screen');
const battleScreen = document.getElementById('battle-screen');
const charList = document.querySelector('.character-list');
const battleLog = document.getElementById('battle-log');
const modal = document.getElementById('result-modal');
const modalText = document.getElementById('result-text');

// Init Character Selection
function initSelection() {
    characters.forEach((char, index) => {
        const card = document.createElement('div');
        card.className = 'char-card';
        card.innerHTML = `
            <h3>${char.icon}</h3>
            <h4>${char.name}</h4>
            <p>ATK: ${char.atk[0]}-${char.atk[1]}</p>
            <p>DEF: ${char.def[0]}-${char.def[1]}</p>
        `;
        card.onclick = () => selectCharacter(index);
        charList.appendChild(card);
    });
}

function selectCharacter(index) {
    player = { ...characters[index], currentHp: 100 };
    
    // Choose random CPU
    const cpuIndex = Math.floor(Math.random() * characters.length);
    cpu = { ...characters[cpuIndex], currentHp: 100 };
    
    startBattle();
}

function startBattle() {
    selectionScreen.classList.remove('active');
    battleScreen.classList.add('active');
    
    document.getElementById('p-name').textContent = player.name;
    document.getElementById('p-icon').textContent = player.icon;
    document.getElementById('c-name').textContent = cpu.name;
    document.getElementById('c-icon').textContent = cpu.icon;
    
    updateHuds();
    addLog("O combate começou!");
    isPlayerTurn = true;
}

function updateHuds() {
    const pHealth = (player.currentHp / 100) * 100;
    const cHealth = (cpu.currentHp / 100) * 100;
    
    document.getElementById('p-hp').style.width = `${Math.max(0, pHealth)}%`;
    document.getElementById('c-hp').style.width = `${Math.max(0, cHealth)}%`;
}

function addLog(msg) {
    const p = document.createElement('p');
    p.textContent = msg;
    battleLog.prepend(p);
}

function attack() {
    if (!isPlayerTurn || player.currentHp <= 0 || cpu.currentHp <= 0) return;

    performAttack(player, cpu);
    isPlayerTurn = false;
    
    if (cpu.currentHp > 0) {
        setTimeout(cpuTurn, 1000);
    }
}

function cpuTurn() {
    performAttack(cpu, player);
    isPlayerTurn = true;
}

function performAttack(attacker, defender) {
    // Calc base attack and defense from ranges
    const atkVal = Math.floor(Math.random() * (attacker.atk[1] - attacker.atk[0] + 1)) + attacker.atk[0];
    const defVal = Math.floor(Math.random() * (defender.def[1] - defender.def[0] + 1)) + defender.def[0];
    
    let damage = atkVal - defVal;
    if (damage < 0) damage = 0;
    
    defender.currentHp -= damage;
    updateHuds();
    
    addLog(`${attacker.name} atacou causando ${damage} de dano!`);
    showDamageEffect(defender === cpu ? 'cpu' : 'player', damage);
    
    if (defender.currentHp <= 0) {
        setTimeout(() => endGame(attacker === player), 500);
    }
}

function showDamageEffect(target, damage) {
    const element = document.getElementById(target + '-container');
    const rect = element.getBoundingClientRect();
    
    const text = document.createElement('div');
    text.className = 'damage-text';
    text.textContent = `-${damage}`;
    text.style.left = `${rect.left + rect.width/2}px`;
    text.style.top = `${rect.top}px`;
    
    document.body.appendChild(text);
    setTimeout(() => text.remove(), 800);
    
    // Shake effect
    element.style.animation = 'none';
    element.offsetHeight; // trigger reflow
    element.style.animation = 'shake 0.5s';
}

function endGame(playerWon) {
    modal.classList.add('active');
    modalText.textContent = playerWon ? "VOCÊ VENCEU!" : "DERROTA...";
    modalText.style.color = playerWon ? "var(--primary)" : "var(--accent)";
}

function resetGame() {
    modal.classList.remove('active');
    battleScreen.classList.remove('active');
    selectionScreen.classList.add('active');
    battleLog.innerHTML = '';
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

initSelection();
