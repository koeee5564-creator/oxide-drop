
"use strict";

/* =====================================================
ИГРОВЫЕ ДАННЫЕ
===================================================== */

let balance = 700;

let inventory = [];

let selectedUpgradeItemId = null;

let selectedTargetId = null;

let rewardTaken = false;

const CASE_PRICE = 350;

/* =====================================================
ПРЕДМЕТЫ
===================================================== */

const caseItems = [

{
    id: 1,
    name: "Ледяной Калаш",
    price: 100,
    icon: "🔫"
},

{
    id: 2,
    name: "Морозный Томми",
    price: 150,
    icon: "🔫"
},

{
    id: 3,
    name: "Снежная Винтовка",
    price: 200,
    icon: "❄️"
},

{
    id: 4,
    name: "Ледяной АК",
    price: 300,
    icon: "🔫"
},

{
    id: 5,
    name: "Кристальный Rifle",
    price: 500,
    icon: "💎"
},

{
    id: 6,
    name: "Легендарный Лёд",
    price: 1000,
    icon: "💠"
}

];

/* =====================================================
DOM
===================================================== */

const balanceElement =
document.getElementById("balance");

const profileBalanceElement =
document.getElementById("profileBalance");

const profileItemsElement =
document.getElementById("profileItems");

const openCaseBtn =
document.getElementById("openCaseBtn");

const caseBox =
document.getElementById("caseBox");

const caseItemsContainer =
document.getElementById("caseItems");

const inventoryGrid =
document.getElementById("inventoryGrid");

const inventoryEmpty =
document.getElementById("inventoryEmpty");

const inventoryCount =
document.getElementById("inventoryCount");

const caseModal =
document.getElementById("caseModal");

const rouletteTrack =
document.getElementById("rouletteTrack");

const openingStatus =
document.getElementById("openingStatus");

const winModal =
document.getElementById("winModal");

const wonItemContainer =
document.getElementById("wonItem");

const closeModal =
document.getElementById("closeModal");

const modalOkBtn =
document.getElementById("modalOkBtn");

const upgradeEmpty =
document.getElementById("upgradeEmpty");

const upgradeContent =
document.getElementById("upgradeContent");

const upgradeInventory =
document.getElementById("upgradeInventory");

const targetInventory =
document.getElementById("targetInventory");

const selectedItem =
document.getElementById("selectedItem");

const targetItem =
document.getElementById("targetItem");

const upgradeBtn =
document.getElementById("upgradeBtn");

const cancelUpgradeBtn =
document.getElementById("cancelUpgradeBtn");

const upgradeAnimation =
document.getElementById("upgradeAnimation");

const upgradeResultText =
document.getElementById("upgradeResultText");

const rewardBtn =
document.getElementById("rewardBtn");

const addCoinsBtn =
document.getElementById("addCoinsBtn");

/* =====================================================
БАЛАНС
===================================================== */

function updateBalance() {

balanceElement.textContent =
    balance;

profileBalanceElement.textContent =
    balance;

}

/* =====================================================
НАВИГАЦИЯ
===================================================== */

const pages =
document.querySelectorAll(".page");

const navButtons =
document.querySelectorAll(".nav-button");

function switchPage(pageId) {

pages.forEach(function(page) {

    page.classList.add("hidden");
    page.classList.remove("active");

});


const page =
    document.getElementById(pageId);

if (!page) {
    return;
}


page.classList.remove("hidden");
page.classList.add("active");


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

button.addEventListener(
    "click",
    function() {

        switchPage(
            button.dataset.page
        );

    }
);

});

/* =====================================================
CASE ITEMS
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
RANDOM ITEM
===================================================== */

function getRandomItem() {

const index =
    Math.floor(
        Math.random() * caseItems.length
    );

return caseItems[index];

}

/* =====================================================
ОТКРЫТИЕ КЕЙСА
===================================================== */

async function openCase() {

if (balance < CASE_PRICE) {

    alert("Недостаточно монет!");

    return;
}


balance -= CASE_PRICE;

updateBalance();

openCaseBtn.disabled = true;


const wonItem =
    getRandomItem();


const inventoryItem = {
    ...wonItem,
    inventoryId:
        Date.now() +
        Math.random()
};


inventory.push(
    inventoryItem
);


await playCaseAnimation(
    wonItem
);


showWinModal(
    wonItem
);


openCaseBtn.disabled = false;

}

openCaseBtn.addEventListener(
"click",
openCase
);

/* =====================================================
АНИМАЦИЯ КЕЙСА
===================================================== */

function createRouletteItems(wonItem) {

rouletteTrack.innerHTML = "";

const animationItems = [];


/*
   Делаем длинную ленту.
   В конце вставляем реальный выигрыш.
*/

for (
    let i = 0;
    i < 35;
    i++
) {

    const random =
        caseItems[
            Math.floor(
                Math.random() *
                caseItems.length
            )
        ];

    animationItems.push(
        random
    );

}


const winningIndex = 30;

animationItems[winningIndex] =
    wonItem;


animationItems.forEach(function(item) {

    const element =
        document.createElement("div");

    element.className =
        "roulette-item";

    element.innerHTML = `
        <div class="roulette-icon">
            ${item.icon}
        </div>

        <span>
            ${item.name}
        </span>
    `;

    rouletteTrack.appendChild(
        element
    );

});


return winningIndex;

}

function playCaseAnimation(wonItem) {

return new Promise(function(resolve) {

    caseModal.classList.remove(
        "hidden"
    );


    caseBox.classList.add(
        "shake"
    );


    openingStatus.textContent =
        "ОТКРЫТИЕ КЕЙСА...";


    const winningIndex =
        createRouletteItems(
            wonItem
        );


    rouletteTrack.style.transition =
        "none";

    rouletteTrack.style.transform =
        "translateX(0)";


    /*
       Размер одного элемента:
       95px + 8px gap = 103px
    */

    const itemWidth = 103;

    const containerWidth =
        document.querySelector(
            ".roulette"
        ).clientWidth;


    const targetPosition =
        (
            winningIndex *
            itemWidth
        )
        -
        (
            containerWidth / 2
        )
        +
        (
            itemWidth / 2
        );


    requestAnimationFrame(function() {

        requestAnimationFrame(function() {

            rouletteTrack.style.transition =
                "transform 4.2s cubic-bezier(.08,.75,.12,1)";

            rouletteTrack.style.transform =
                `translateX(-${targetPosition}px)`;

        });

    });


    setTimeout(function() {

        caseBox.classList.remove(
            "shake"
        );

        openingStatus.textContent =
            "ГОТОВО!";


        setTimeout(function() {

            caseModal.classList.add(
                "hidden"
            );

            showWinModal(
                wonItem
            );

            resolve();

        }, 450);

    }, 4500);

});

}

/* =====================================================
WIN MODAL
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


winModal.classList.remove(
    "hidden"
);

}

function hideWinModal() {

winModal.classList.add(
    "hidden"
);

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

    inventoryEmpty.classList.remove(
        "hidden"
    );

} else {

    inventoryEmpty.classList.add(
        "hidden"
    );

}


inventory.forEach(function(item) {

    const card =
        document.createElement("div");

    card.className =
        "inventory-card";


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
            data-id="${item.inventoryId}">
            ПРОДАТЬ
        </button>

    `;


    card.querySelector(
        ".sell-button"
    ).addEventListener(
        "click",
        function() {

            sellItem(
                item.inventoryId
            );

        }
    );


    inventoryGrid.appendChild(
        card
    );

});


renderUpgrade();

}

/* =====================================================
ПРОДАЖА
===================================================== */

function sellItem(itemId) {

const index =
    inventory.findIndex(
        function(item) {

            return item.inventoryId ===
                itemId;

        }
    );


if (index === -1) {
    return;
}


const item =
    inventory[index];


balance +=
    item.price;


inventory.splice(
    index,
    1
);


if (
    selectedUpgradeItemId ===
    itemId
) {

    selectedUpgradeItemId =
        null;

}


updateBalance();

renderInventory();

}

/* =====================================================
АПГРЕЙД
===================================================== */

function renderUpgrade() {

if (inventory.length === 0) {

    upgradeEmpty.classList.remove(
        "hidden"
    );

    upgradeContent.classList.add(
        "hidden"
    );

    return;

}


upgradeEmpty.classList.add(
    "hidden"
);

upgradeContent.classList.remove(
    "hidden"
);


renderUpgradeInventory();

renderTargetInventory();

renderSelectedItems();

}

function renderUpgradeInventory() {

upgradeInventory.innerHTML = "";


inventory.forEach(function(item) {

    const card =
        document.createElement("div");

    card.className =
        "item-card";


    if (
        item.inventoryId ===
        selectedUpgradeItemId
    ) {

        card.classList.add(
            "selected"
        );

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


            /*
               После выбора автоматически
               убираем цель, если она
               стала дешевле или равна.
            */

            if (
                selectedTargetId
            ) {

                const target =
                    caseItems.find(
                        function(x) {
                            return x.id ===
                                selectedTargetId;
                        }
                    );


                if (
                    target &&
                    target.price <=
                    item.price
                ) {

                    selectedTargetId =
                        null;

                }

            }


            renderUpgrade();

        }
    );


    upgradeInventory.appendChild(
        card
    );

});

}

function renderTargetInventory() {

targetInventory.innerHTML = "";


if (!selectedUpgradeItemId) {
    return;
}


const currentItem =
    inventory.find(
        function(item) {

            return item.inventoryId ===
                selectedUpgradeItemId;

        }
    );


if (!currentItem) {
    return;
}


/*
   Целями могут быть только предметы
   ДОРОЖЕ выбранного.
*/

const targets =
    caseItems.filter(
        function(item) {

            return item.price >
                currentItem.price;

        }
    );


targets.forEach(function(target) {

    const card =
        document.createElement("div");

    card.className =
        "item-card";


    if (
        target.id ===
        selectedTargetId
    ) {

        card.classList.add(
            "selected"
        );

    }


    card.innerHTML = `

        <div class="item-image">
            ${target.icon}
        </div>

        <div class="item-name">
            ${target.name}
        </div>

        <div class="item-price">
            🪙 ${target.price}
        </div>

    `;


    card.addEventListener(
        "click",
        function() {

            selectedTargetId =
                target.id;

            renderUpgrade();

        }
    );


    targetInventory.appendChild(
        card
    );

});


if (targets.length === 0) {

    targetInventory.innerHTML = `

        <div class="empty-box"
             style="grid-column:1/-1">

            <div>🔒</div>

            <h3>
                Нет доступных целей
            </h3>

            <p>
                Нужен предмет дороже текущего.
            </p>

        </div>

    `;

}

}

function renderSelectedItems() {

/*
   Текущий предмет
*/

const current =
    inventory.find(
        function(item) {

            return item.inventoryId ===
                selectedUpgradeItemId;

        }
    );


if (!current) {

    selectedItem.innerHTML = `
        <span>?</span>
    `;

} else {

    selectedItem.innerHTML = `

        <div class="item-image">
            ${current.icon}
        </div>

        <div class="item-name">
            ${current.name}
        </div>

        <div class="item-price">
            🪙 ${current.price}
        </div>

    `;

}


/*
   Цель
*/

const target =
    caseItems.find(
        function(item) {

            return item.id ===
                selectedTargetId;

        }
    );


if (!target) {

    targetItem.innerHTML = `
        <span>?</span>
    `;

} else {

    targetItem.innerHTML = `

        <div class="item-image">
            ${target.icon}
        </div>

        <div class="item-name">
            ${target.name}
        </div>

        <div class="item-price">
            🪙 ${target.price}
        </div>

    `;

}


upgradeBtn.disabled =
    !current ||
    !target;

}

/* =====================================================
ЗАПУСК АПГРЕЙДА
===================================================== */

function startUpgrade() {

if (
    !selectedUpgradeItemId ||
    !selectedTargetId
) {

    return;

}


const index =
    inventory.findIndex(
        function(item) {

            return item.inventoryId ===
                selectedUpgradeItemId;

        }
    );


if (index === -1) {

    selectedUpgradeItemId =
        null;

    renderUpgrade();

    return;

}


const currentItem =
    inventory[index];


const target =
    caseItems.find(
        function(item) {

            return item.id ===
                selectedTargetId;

        }
    );


if (!target) {
    return;
}


/*
   Проверяем ещё раз,
   чтобы нельзя было выбрать
   дешёвую цель.
*/

if (
    target.price <=
    currentItem.price
) {

    alert(
        "Цель должна быть дороже предмета."
    );

    return;

}


upgradeBtn.disabled = true;

cancelUpgradeBtn.disabled = true;


upgradeAnimation.classList.remove(
    "hidden"
);

upgradeAnimation.classList.remove(
    "success",
    "fail"
);

upgradeAnimation.classList.add(
    "spinning"
);


upgradeResultText.textContent =
    "ПРОВЕРКА ШАНСА...";


/*
   Настоящий случайный шанс 50/50.
*/

const success =
    Math.random() < 0.5;


/*
   Анимация длится 2.5 секунды.
*/

setTimeout(function() {

    upgradeAnimation.classList.remove(
        "spinning"
    );


    if (success) {

        /*
           Успех:
           текущий предмет удаляется,
           целевой предмет добавляется.
        */

        inventory.splice(
            index,
            1
        );


        const newItem = {
            ...target,
            inventoryId:
                Date.now() +
                Math.random()
        };


        inventory.push(
            newItem
        );


        upgradeAnimation.classList.add(
            "success"
        );


        upgradeResultText.textContent =
            "⚡ УСПЕХ!";


        setTimeout(function() {

            alert(
                `УСПЕХ!\n\n${currentItem.name} → ${target.name}\nСтоимость: ${target.price} монет`
            );


            finishUpgrade();

        }, 650);

    } else {

        /*
           Неудача:
           предмет сгорает.
        */

        inventory.splice(
            index,
            1
        );


        upgradeAnimation.classList.add(
            "fail"
        );


        upgradeResultText.textContent =
            "💥 НЕУДАЧА";


        setTimeout(function() {

            alert(
                `НЕУДАЧА!\n\n${currentItem.name} сгорел.`
            );


            finishUpgrade();

        }, 650);

    }

}, 2500);

}

/* =====================================================
ЗАВЕРШЕНИЕ АПГРЕЙДА
===================================================== */

function finishUpgrade() {

selectedUpgradeItemId =
    null;

selectedTargetId =
    null;

upgradeAnimation.classList.add(
    "hidden"
);

cancelUpgradeBtn.disabled =
    false;

updateBalance();

renderInventory();

renderUpgrade();

}

upgradeBtn.addEventListener(
"click",
startUpgrade
);

/* =====================================================
СБРОС
===================================================== */

cancelUpgradeBtn.addEventListener(
"click",
function() {

    selectedUpgradeItemId =
        null;

    selectedTargetId =
        null;

    renderUpgrade();

}

);

/* =====================================================
ЗАДАНИЕ
===================================================== */

rewardBtn.addEventListener(
"click",
function() {

    if (rewardTaken) {
        return;
    }


    balance += 400;

    rewardTaken = true;

    rewardBtn.textContent =
        "ПОЛУЧЕНО";

    rewardBtn.disabled =
        true;

    updateBalance();

}

);

/* =====================================================
ПОПОЛНЕНИЕ
===================================================== */

addCoinsBtn.addEventListener(
"click",
function() {

    balance += 400;

    updateBalance();

    alert(
        "Вам начислено +400 монет!"
    );

}

);

/* =====================================================
ЗАПУСК
===================================================== */

function init() {

updateBalance();

renderCaseItems();

renderInventory();

switchPage("casesPag
