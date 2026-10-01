let coins = 5000;

// Лут для малого ящика
const smallLoot = [
    "Камень (x500)", 
    "Дерево (x1000)", 
    "Ткань (x50)", 
    "Ржавый топор", 
    "Патроны 9mm (x20)"
];

// Лут для военного ящика
const militaryLoot = [
    "Самодельный пистолет", 
    "Бронежилет", 
    "Пакет с порохом", 
    "Автомат (AK)", 
    "Медикаменты (Аптечка)"
];

function openCase(cost, type) {
    if (coins >= cost) {
        coins -= cost;
        document.getElementById('coins').innerText = coins;

        // Выбираем случайный предмет
        let lootList = (type === 'small') ? smallLoot : militaryLoot;
        let randomIndex = Math.floor(Math.random() * lootList.length);
        let wonItem = lootList[randomIndex];

        // Показываем результат
        let resultBox = document.getElementById('result-box');
        let droppedItemText = document.getElementById('dropped-item');
        
        resultBox.classList.remove('hidden');
        droppedItemText.innerText = wonItem;

    } else {
        alert('Недостаточно монет для обыска ящика!');
    }
}

