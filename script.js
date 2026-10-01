let coins = 700;
let inventory = [];

// База предметов кейса с рабочими иконками
const frostCaseItems = [
    { name: "Калаш Морозная ярость", price: 1600, img: "https://cdn-icons-png.flaticon.com/512/584/584841.png" },
    { name: "Нагрудник Морозная ярость", price: 1000, img: "https://cdn-icons-png.flaticon.com/512/2503/2503508.png" },
    { name: "Шлем Морозная ярость", price: 800, img: "https://cdn-icons-png.flaticon.com/512/2503/2503512.png" },
    { name: "Штаны Морозная ярость", price: 650, img: "https://cdn-icons-png.flaticon.com/512/2503/2503504.png" },
    { name: "Сапоги Морозная ярость", price: 550, img: "https://cdn-icons-png.flaticon.com/512/608/608970.png" },
    { name: "Томпсон Морозная ярость", price: 350, img: "https://cdn-icons-png.flaticon.com/512/584/584841.png" },
    { name: "Дробовик Морозная ярость", price: 300, img: "https://cdn-icons-png.flaticon.com/512/1067/1067356.png" },
    { name: "Винтовка Морозная ярость", price: 260, img: "https://cdn-icons-png.flaticon.com/512/1067/1067356.png" },
    { name: "Арбалет Морозная ярость", price: 220, img: "https://cdn-icons-png.flaticon.com/512/1577/1577038.png" },
    { name: "Лук Морозная ярость", price: 180, img: "https://cdn-icons-png.flaticon.com/512/1577/1577038.png" }
];

// Безопасное переключение вкладок
function switchTab(tabName, buttonElement) {
    // Скрываем все вкладки
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.add('hidden');
    });

    // Убираем активный класс со всех кнопок меню
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Показываем нужную вкладку
    const targetTab = document.getElementById('tab-' + tabName);
    if (targetTab) {
        targetTab.classList.remove('hidden');
    }

    // Подсвечиваем нажатую кнопку
    if (buttonElement) {
        buttonElement.classList.add('active');
    }

    // Дополнительные действия при открытии вкладок
    if (tabName === 'inventory') {
        renderInventory();
    } else if (tabName === 'upgrade') {
        updateUpgradeSelection();
    }
}

// Открытие кейса
function openFrostCase() {
    const cost = 350;
    if (coins < cost) {
        alert('Недостаточно монет!');
        return;
    }

    coins -= cost;
    document.getElementById('coins').innerText = coins;

    const randomIndex = Math.floor(Math.random() * frostCaseItems.length);
    const wonItem = frostCaseItems[randomIndex];
    inventory.push(wonItem);

    document.getElementById('modal-item-img').src = wonItem.img;
    document.getElementById('modal-item-name').innerText = wonItem.name;
    document.getElementById('modal-item-price').innerText = `🪙 ${wonItem.price}`;
    
    document.getElementById('case-modal').classList.remove('hidden');
}

function closeModals() {
    document.getElementById('case-modal').classList.add('hidden');
}

// Рендер инвентаря
function renderInventory() {
    const grid = document.getElementById('inventory-grid');
    document.getElementById('inv-count').innerText = inventory.length;
    let totalValue = inventory.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('inv-total').innerText = `🪙 ${totalValue}`;

    if (inventory.length === 0) {
        grid.innerHTML = '<div class="empty-inventory" style="grid-column: span 3; text-align:center; color:#666; padding:20px;">Инвентарь пуст</div>';
        return;
    }

    grid.innerHTML = '';
    inventory.forEach((item, index) => {
        grid.innerHTML += `
            <div class="frost-item">
                <img src="${item.img}" alt="${item.name}">
                <span>${item.name}</span>
                <b class="price">🪙 ${item.price}</b>
                <button class="action-btn" style="padding:4px; font-size:10px; margin-top:4px;" onclick="sellItem(${index})">Продать</button>
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

// Апгрейд
let selectedUpgradeItem = null;

function updateUpgradeSelection() {
    const container = document.getElementById('upgrade-my-items');
    if (inventory.length === 0) {
        container.innerHTML = '<p style="color:#666; font-size:12px; grid-column:span 3;">Сначала откройте кейс!</p>';
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
        alert('Выберите предмет!');
        return;
    }

    const item = inventory[selectedUpgradeItem];
    if (Math.random() < 0.5) {
        alert('Успех! Предмет улучшен!');
        item.price *= 2;
    } else {
        alert('Неудача! Предмет сгорел.');
        inventory.splice(selectedUpgradeItem, 1);
        selectedUpgradeItem = null;
    }
    renderInventory();
    updateUpgradeSelection();
}

