// Цены за кубический метр в зависимости от типа и длины материала
const prices = {
    'Сырой': {
        '3000': 7400,
        '4000': 7400,
        '4500': 7400,
        '6000': 7400,
        '7000': 12800,
        '8000': 13800
    },
    'Сухой': {
        '3000': 9300,
        '4000': 9300,
        '4500': 9300,
        '6000': 9300,
        '7000': 15100,
        '8000': 16100
    }
};

// Цены за антисептическую обработку
const antisepticPrices = {
    'none': 0,
    'BIO': 1000,
    'OgneBio': 2000
};

function calculate() {
    // Получаем значения из полей ввода
    var material = document.getElementById('material').value;
    var thickness = parseFloat(document.getElementById('thickness').value) / 1000; // Переводим в метры
    var width = parseFloat(document.getElementById('width').value) / 1000; // Переводим в метры
    var lengthValue = document.getElementById('length').value; // Получаем выбранную длину
    var length = parseFloat(lengthValue) / 1000; // Переводим в метры
    var quantity = parseFloat(document.getElementById('quantity').value) || 0;
    var volumeMpInput = parseFloat(document.getElementById('volume_mp').value) || 0;
    var volumeM3Input = parseFloat(document.getElementById('volume_m3').value) || 0;
    var antisepticType = document.getElementById('antiseptic').value;

    // Определяем цену в зависимости от типа и длины
    var pricePerCubicMeter = prices[material][lengthValue];

    // Расчетные переменные
    var totalVolume;
    var volumeMp;
    var volumePerPiece;

    // Расчёт на основе введённого количества штук
    if (quantity > 0) {
        volumePerPiece = thickness * width * length;
        totalVolume = volumePerPiece * quantity;
        volumeMp = length * quantity;
    }
    // Расчёт на основе введённого объема м/п
    else if (volumeMpInput > 0) {
        totalVolume = volumeMpInput * thickness * width;
        quantity = volumeMpInput / length;
        volumeMp = volumeMpInput;
    }
    // Расчёт на основе введённого объема м³
    else if (volumeM3Input > 0) {
        totalVolume = volumeM3Input;
        volumeMp = totalVolume / (thickness * width);
        quantity = totalVolume / (thickness * width * length);
    }

    // Расчет цены за метр погонный и за штуку
    var pricePerMeter = pricePerCubicMeter * thickness * width;
    var pricePerPiece = pricePerMeter * length;

    // Определяем стоимость антисептика
    var antisepticPrice = antisepticPrices[antisepticType];
    var antisepticCost = totalVolume * antisepticPrice;

    // Расчет общей стоимости с учетом антисептика
    var totalPrice = totalVolume * pricePerCubicMeter + antisepticCost;

    // Проверяем, был ли сделан хотя бы один расчёт
    if (!totalVolume) {
        alert('Введите количество штук, объем м/п или объем м³ для расчёта.');
        return; // Прерываем функцию, если нечего расчитывать
    }

    // Создание новой строки в таблице результатов
    var resultsTableBody = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];
    var newRow = resultsTableBody.insertRow();

    // Форматирование размера для отображения
    var sizeDisplay = `${(thickness * 1000).toFixed(0)}x${(width * 1000).toFixed(0)}x${lengthValue}`;

    // Заполнение новой строки таблицы данными
    newRow.innerHTML = `
    <td>${material}</td>
    <td>${sizeDisplay}</td>
    <td>${quantity.toFixed(2)}</td>
    <td>${volumeMp.toFixed(3)}</td>
    <td>${totalVolume.toFixed(3)}</td>
    <td>${pricePerMeter.toFixed(2)}</td>
    <td>${pricePerPiece.toFixed(2)}</td>
    <td>${pricePerCubicMeter.toFixed(2)}</td>
    <td>${totalPrice.toFixed(2)}</td>
    <td>${antisepticType !== 'none' ? antisepticType : 'Нет'}</td>
    `;

    // Добавляем кнопку удаления
    var deleteCell = newRow.insertCell();
    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Удалить';
    deleteButton.addEventListener('click', function() {
        resultsTableBody.deleteRow(newRow.rowIndex - 1);
    });
    deleteCell.appendChild(deleteButton);

    updateTotals();
}

function updateTotals() {
    var totalVolume = 0;
    var totalCost = 0;
    var rows = document.getElementById('resultsTable').getElementsByTagName('tbody')[0].rows;

    for (var i = 0; i < rows.length; i++) {
        totalVolume += parseFloat(rows[i].cells[4].textContent) || 0;
        totalCost += parseFloat(rows[i].cells[8].textContent) || 0;
    }

    document.getElementById('totalVolume').textContent = totalVolume.toFixed(3);
    document.getElementById('totalCost').textContent = totalCost.toFixed(2);
}

// Обработчики событий для кнопок
document.getElementById('add').addEventListener('click', calculate);
document.getElementById('clear').addEventListener('click', function() {
    document.getElementById('resultsTable').getElementsByTagName('tbody')[0].innerHTML = "";
    // Очистка всех полей ввода
    document.getElementById('material').selectedIndex = 0;
    document.getElementById('thickness').selectedIndex = 0;
    document.getElementById('width').selectedIndex = 0;
    document.getElementById('length').selectedIndex = 0;
    document.getElementById('quantity').value = '';
    document.getElementById('volume_mp').value = '';
    document.getElementById('volume_m3').value = '';
    document.getElementById('antiseptic').value = 'none'; // Изменил на 'value' с 'checked'

    updateTotals();
});
