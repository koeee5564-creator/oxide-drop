let coins = 700;
let inventory = []; // Список предметов в инвентаре пользователя

// База данных предметов кейса "Морозная ярость" с ценами и картинками
const frostCaseItems = [
    { name: "Калаш Морозная ярость", price: 1600, img: "https://i.ibb.co/3yL01x9/ak-frost.png" },
    { name: "Нагрудник Морозная ярость", price: 1000, img: "https://i.ibb.co/689L54q/plate-frost.png" },
    { name: "Шлем Морозная ярость", price: 800, img: "https://i.ibb.co/4g3R2q8/helmet-frost.png" },
    { name: "Штаны Морозная ярость", price: 650, img: "https://i.ibb.co/7X193v2/pants-frost.png" },
    { name: "Сапоги Морозная ярость", price: 550, img: "https://i.ibb.co/9v016X2/boots-frost.png" },
    { name: "Томпсон Морозная ярость", price: 350, img: "https://i.ibb.co/0y7x2Q1/tompson-frost.png" },
    { name: "Дробовик Морозная ярость", price: 300, img: "https://i.ibb.co/5L5x8Q3/shotgun-frost.png" },
    { name: "Винтовка Морозная ярость", price: 260, img: "https://i.ibb.co/2M3x9Q4/rifle-frost.png" },
    { name: "Арбалет Морозная ярость", price: 220, img: "https://i.ibb.co/8N1x7Q5/crossbow-frost.png" },
    { name: "Лук Морозная ярость", price: 180, img: "https://i.ibb.co/1K5x6Q6/bow-frost.png" }
];

// Функция переключения вкладок
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    if (tabName === 'cases') {
        document.getElementById('tab-cases').classList.remove('hidden');
    } else if (tabName === 'upgrade') {
        document.getElementById('tab-upgrade').classList.remove('hidden');
        updateUpgradeSelection();
    } else if (tabName === 'inventory') {
        document.getElementById('tab-inventory').classList.remove('hidden');
        renderInventory();
    } else if (tabName === 'quests') {
        document.getElementById('tab-quests').classList.remove('hidden');
    } else if (tabName === 'profile') {
        document.getElementById('tab-profile').classList.remove('hidden');
    }
}

// Открытие кейса с анимацией
function openFrostCase() {
    const cost = 350;
    if (coins < cost) {
        alert('Недостаточно монет для открытия кейса!');
        return;
    }

    coins -= cost;
    document.getElementById('coins').innerText = coins;

    // Выбираем случайный предмет
    const randomIndex = Math.floor(Math.random() * frostCaseItems.length);
    const wonItem = frostCaseItems[randomIndex];

    // Добавляем в инвентарь
    inventory.push(wonItem);

    // Показываем окно результата (рулетка / выпадение)
    const modal = document.getElementById('case-modal');
    const modalItemImg = document.getElementById('modal-item-img');
    const modalItemName = document.getElementById('modal-item-name');
    const modalItemPrice = document.getElementById('modal-item-price');

    modalItemImg.src = wonItem.img;
    modalItemName.innerText = wonItem.name;
    modalItemPrice.innerText = `🪙 ${wonItem.price}`;
    
    modal.classList.remove('hidden');
}

function closeModals() {
    document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
}

// Отрисовка инвентаря
function renderInventory() {
    const grid = document.getElementById('inventory-grid');
    const countEl = document.getElementById('inv-count');
    const totalEl = document.getElementById('inv-total');
    
    countEl.innerText = inventory.length;
    let totalValue = inventory.reduce((sum, item) => sum + item.price, 0);
    totalEl.innerText = `🪙 ${totalValue}`;

    if (inventory.length === 0) {
        grid.innerHTML = '<div class="empty-inventory">Инвентарь пуст</div>';
        return;
    }

    grid.innerHTML = '';
    inventory.forEach((item, index) => {
        grid.innerHTML += `
            <div class="frost-item">
                <img src="${item.img}" alt="${item.name}">
                <span>${item.name}</span>
                <b class="price">🪙 ${item.price}</b>
                <button class="sell-btn" onclick="sellItem(${index})">Продать</button>
            </div>
        `;
    });
}

function sellItem(index) {
    coins += inventory[index].price;
    document.getElementById('coins').innerText = coins;
    inventory.splice(index, 1);
    renderInventory();
}

// Логика апгрейда
let selectedUpgradeItem = null;

function updateUpgradeSelection() {
    const container = document.getElementById('upgrade-my-items');
    if (inventory.length === 0) {
        container.innerHTML = '<p style="color:#666; font-size:12px;">Сначала откройте кейс и получите предмет!</p>';
        return;
    }

    container.innerHTML = '';
    inventory.forEach((item, index) => {
        container.innerHTML += `
            <div class="frost-item ${selectedUpgradeItem === index ? 'selected' : ''}" onclick="selectItemForUpgrade(${index})">
                <img src="${item.img}" alt="${item.name}">
                <span>${item.name}</span>
                <b class="price">🪙 ${item.price}</b>
            </div>
        `;
    });
}

function selectItemForUpgrade(index) {
    selectedUpgradeItem = index;
    updateUpgradeSelection();
}

function performUpgrade() {
    if (selectedUpgradeItem === null) {
        alert('Выберите предмет из инвентаря для апгрейда!');
        return;
    }

    const item = inventory[selectedUpgradeItem];
    // Шанс 50% на успех
    const success = Math.random() < 0.5;

    if (success) {
        alert('Успех! Ваш предмет улучшен!');
        item.price = Math.floor(item.price * 2); // Удваиваем стоимость
    } else {
        alert('Неудача! Предмет сгорел.');
        inventory.splice(selectedUpgradeItem, 1);
        selectedUpgradeItem = null;
    }
    renderInventory();
    updateUpgradeSelection();
}

