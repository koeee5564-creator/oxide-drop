"use strict";

/* =====================================================
   ДАННЫЕ ИГРЫ
===================================================== */

let balance = 700;

let inventory = [];

let selectedUpgradeItemId = null;

let rewardTaken = false;

const CASE_PRICE = 350;


/* =====================================================
   ПРЕДМЕТЫ КЕЙСА
===================================================== */

const caseItems = [
    {
        id: 1,
        name: "Ледяной Калаш",
        price: 250,
        icon: "🔫",
        rarity: "common"
    },
    {
        id: 2,
        name: "Морозная Винтовка",
        price: 450,
        icon: "❄️",
        rarity: "rare"
    },
    {
        id: 3,
        name: "Снежный Томми",
        price: 700,
        icon: "🔫",
        rarity: "epic"
    },
    {
        id: 4,
        name: "Легендарный Лед",
        price: 1200,
        icon: "💎",
        rarity: "legendary"
    }
];


/* =====================================================
   DOM
===================================================== */

const balanceElement = document.getElementById("balance");

const profileBalanceElement =
    document.getElementById("profileBalance");

const profileItemsElement =
    document.getElementById("profileItems");

const inventoryGrid =
    document.getElementById("inventoryGrid");

const inventoryEmpty =
    document.getElementById("inventoryEmpty");

const inventoryCount =
    document.getElementById("inventoryCount");

const caseItemsContainer =
    document.getElementById("caseItems");

const openCaseBtn =
    document.getElementById("openCaseBtn");

const winModal =
    document.getElementById("winModal");

const wonItemContainer =
    document.getElementById("wonItem");

const closeModal =
    document.getElementById("closeModal");

const modalOkBtn =
    document.getElementById("modalOkBtn");

const rewardBtn =
    document.getElementById("rewardBtn");

const addCoinsBtn =
    document.getElementById("addCoinsBtn");

const upgradeEmpty =
    document.getElementById("upgradeEmpty");

const upgradeContent =
    document.getElementById("upgradeContent");

const upgradeItemContainer =
    document.getElementById("upgradeItem");

const upgradeInventory =
    document.getElementById("upgradeInventory");

const upgradeBtn =
    document.getElementById("upgradeBtn");

const cancelUpgradeBtn =
    document.getElementById("cancelUpgradeBtn");


/* =====================================================
   БАЛАНС
===================================================== */

function updateBalance() {
    balanceElement.textContent = balance;
    profileBalanceElement.textContent = balance;
}


/* =====================================================
   НАВИГАЦИЯ
===================================================== */

const navButtons =
    document.querySelectorAll(".nav-button");

const pages =
    document.querySelectorAll(".page");

function switchPage(pageId) {

    pages.forEach(function(page) {
        page.classList.add("hidden");
        page.classList.remove("active");
    });

    const selectedPage =
        document.getElementById(pageId);

    if (!selectedPage) {
        return;
    }

    selectedPage.classList.remove("hidden");
    selectedPage.classList.add("active");

    navButtons.forEach(function(button) {
        button.classList.remove("active");

        if (button.dataset.page === pageId) {
            button.classList.add("active");
        }
    });

    if (pageId === "upgradePage") {
        renderUpgrade();
    }
}

navButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const pageId = button.dataset.page;

        switchPage(pageId);

    });

});


/* =====================================================
   ОТОБРАЖЕНИЕ ПРЕДМЕТОВ КЕЙСА
===================================================== */

function renderCaseItems() {

    caseItemsContainer.innerHTML = "";

    caseItems.forEach(function(item) {

        const card =
            document.createElement("div");

        card.className = "item-card";

        card.innerHTML = `
            <div class="item-image">
                ${item.icon}
            </div>

            <div class="item-name">
                ${item.name}
            </div>

            <div class="item-price">
                🪙 ${item.price}
            </div>
        `;

        caseItemsContainer.appendChild(card);

    });
}


/* =====================================================
   ОТКРЫТИЕ КЕЙСА
===================================================== */

function getRandomItem() {

    const randomIndex =
        Math.floor(Math.random() * caseItems.length);

    return caseItems[randomIndex];
}

function openCase() {

    if (balance < CASE_PRICE) {

        alert("Недостаточно монет!");

        return;
    }

    balance -= CASE_PRICE;

    updateBalance();

    openCaseBtn.disabled = true;

    const wonItem = getRandomItem();

    const inventoryItem = {
        ...wonItem,
        inventoryId: Date.now() + Math.random()
    };

    inventory.push(inventoryItem);

    renderInventory();

    showWinModal(wonItem);

    setTimeout(function() {
        openCaseBtn.disabled = false;
    }, 500);

}

openCaseBtn.addEventListener(
    "click",
    openCase
);


/* =====================================================
   МОДАЛЬНОЕ ОКНО
===================================================== */

function showWinModal(item) {

    wonItemContainer.innerHTML = `
        <div class="won-item">

            <div class="item-image">
                ${item.icon}
            </div>

            <div class="item-name">
                ${item.name}
            </div>

            <div class="item-price">
                🪙 ${item.price}
            </div>

        </div>
    `;

    winModal.classList.remove("hidden");
}

function hideWinModal() {

    winModal.classList.add("hidden");

}

closeModal.addEventListener(
    "click",
    hideWinModal
);

modalOkBtn.addEventListener(
    "click",
    hideWinModal
);

winModal
    .querySelector(".modal-overlay")
    .addEventListener(
        "click",
        hideWinModal
    );


/* =====================================================
   ИНВЕНТАРЬ
===================================================== */

function renderInventory() {

    inventoryGrid.innerHTML = "";

    inventoryCount.textContent =
        `Предметов: ${inventory.length}`;

    profileItemsElement.textContent =
        inventory.length;

    if (inventory.length === 0) {

        inventoryEmpty.classList.remove("hidden");

    } else {

        inventoryEmpty.classList.add("hidden");
    }

    inventory.forEach(function(item) {

        const card =
            document.createElement("div");

        card.className = "inventory-card";

        card.innerHTML = `
            <div class="item-image">
                ${item.icon}
            </div>

            <div class="item-name">
                ${item.name}
            </div>

            <div class="item-price">
                🪙 ${item.price}
            </div>

            <button
                class="sell-button"
                data-id="${item.inventoryId}"
            >
                ПРОДАТЬ
            </button>
        `;

        const sellButton =
            card.querySelector(".sell-button");

        sellButton.addEventListener(
            "click",
            function() {

                sellItem(item.inventoryId);

            }
        );

        inventoryGrid.appendChild(card);

    });

    renderUpgrade();
}


/* =====================================================
   ПРОДАЖА
===================================================== */

function sellItem(itemId) {

    const index =
        inventory.findIndex(function(item) {
            return item.inventoryId === itemId;
        });

    if (index === -1) {
        return;
    }

    const item = inventory[index];

    balance += item.price;

    inventory.splice(index, 1);

    if (selectedUpgradeItemId === itemId) {

        selectedUpgradeItemId = null;

    }

    updateBalance();

    renderInventory();
}


/* =====================================================
   АПГРЕЙД
===================================================== */

function renderUpgrade() {

    upgradeInventory.innerHTML = "";

    if (inventory.length === 0) {

        upgradeEmpty.classList.remove("hidden");
        upgradeContent.classList.add("hidden");

        return;
    }

    upgradeEmpty.classList.add("hidden");
    upgradeContent.classList.remove("hidden");

    inventory.forEach(function(item) {

        const card =
            document.createElement("div");

        card.className = "item-card";

        if (
            item.inventoryId ===
            selectedUpgradeItemId
        ) {
            card.classList.add("selected");
        }

        card.innerHTML = `
            <div class="item-image">
                ${item.icon}
            </div>

            <div class="item-name">
                ${item.name}
            </div>

            <div class="item-price">
                🪙 ${item.price}
            </div>
        `;

        card.addEventListener(
            "click",
            function() {

                selectedUpgradeItemId =
                    item.inventoryId;

                renderUpgrade();

            }
        );

        upgradeInventory.appendChild(card);

    });

    renderSelectedUpgrade();
}


/* =====================================================
   ВЫБРАННЫЙ ПРЕДМЕТ
===================================================== */

function renderSelectedUpgrade() {

    if (!selectedUpgradeItemId) {

        upgradeItemContainer.innerHTML = `
            <div class="empty-box">
                <div>⚡</div>
                <h3>Выбери предмет</h3>
                <p>Нажми на предмет ниже.</p>
            </div>
        `;

        upgradeBtn.disabled = true;

        return;
    }

    const item =
        inventory.find(function(item) {
            return item.inventoryId ===
                selectedUpgradeItemId;
        });

    if (!item) {

        selectedUpgradeItemId = null;

        renderSelectedUpgrade();

        return;
    }

    upgradeItemContainer.innerHTML = `
        <div class="item-image">
            ${item.icon}
        </div>

        <div class="item-name">
            ${item.name}
        </div>

        <div class="item-price">
            🪙 ${item.price}
        </div>
    `;

    upgradeBtn.disabled = false;
}


/* =====================================================
   ЗАПУСК АПГРЕЙДА
===================================================== */

function upgradeSelectedItem() {

    if (!selectedUpgradeItemId) {

        alert("Сначала выбери предмет.");

        return;
    }

    const index =
        inventory.findIndex(function(item) {
            return item.inventoryId ===
                selectedUpgradeItemId;
        });

    if (index === -1) {

        selectedUpgradeItemId = null;

        renderUpgrade();

        return;
    }

    const item = inventory[index];

    const success =
        Math.random() < 0.5;

    if (success) {

        item.price *= 2;

        alert(
            `⚡ Успех!\n\n${item.name}\nНовая стоимость: ${item.price} монет`
        );

    } else {

        alert(
            `💥 Неудача!\n\n${item.name} сгорел.`
        );

        inventory.splice(index, 1);

    }

    selectedUpgradeItemId = null;

    renderInventory();
    renderUpgrade();

}

upgradeBtn.addEventListener(
    "click",
    upgradeSelectedItem
);


/* =====================================================
   ОТМЕНА ВЫБОРА
===================================================== */

cancelUpgradeBtn.addEventListener(
    "click",
    function() {

        selectedUpgradeItemId = null;

        renderUpgrade();

    }
);


/* =====================================================
   ЗАДАНИЕ +400
===================================================== */

rewardBtn.addEventListener(
    "click",
    function() {

        if (rewardTaken) {
            return;
        }

        balance += 400;

        rewardTaken = true;

        rewardBtn.textContent = "ПОЛУЧЕНО";
        rewardBtn.disabled = true;

        updateBalance();

    }
);


/* =====================================================
   ПОПОЛНЕНИЕ ПРОФИЛЯ
===================================================== */

addCoinsBtn.addEventListener(
    "click",
    function() {

        balance += 400;

        updateBalance();

        alert("Вам начислено +400 монет!");

    }
);


/* =====================================================
   ИНИЦИАЛИЗАЦИЯ
===================================================== */

function init() {

    updateBalance();

    renderCaseItems();

    renderInventory();

    renderUpgrade();

    switchPage("casesPage");

}

init();
