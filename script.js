let currentCoins = 4017;

function openCase(cost) {
    if (currentCoins >= cost) {
        currentCoins -= cost;
        document.getElementById('coins').innerText = currentCoins;
        alert('Кейс успешно открыт!');
    } else {
        alert('Недостаточно монет!');
    }
}
