// Предположим, что цена за м³ задана заранее
const pricePerCubicMeter = 7400; // Пример цены за м³

document.getElementById('add').addEventListener('click', function() {
    var material = document.getElementById('material').value;
    var thickness = parseFloat(document.getElementById('thickness').value); // толщина в мм
    var width = parseFloat(document.getElementById('width').value); // ширина в мм
    var length = parseFloat(document.getElementById('length').value); // длина в мм
    var quantity = parseInt(document.getElementById('quantity').value);
    var antiseptic = document.getElementById('antiseptic').checked ? "Да" : "Нет";

    // Расчет размеров для отображения
    var sizeDisplay = `${thickness}x${width}x${length}`;

    // Расчет объема одной доски или бруса в м³
    var volumePerPiece = (thickness / 1000) * (width / 1000) * (length / 1000);
    var totalVolume = volumePerPiece * quantity; // Общий объем в м³

    // Расчет количества штук на основе введенного объема и размеров
    var quantityCalc = totalVolume / volumePerPiece;

    // Расчет объема м/п
    var volumeMp = totalVolume / (thickness / 1000) / (width / 1000);

    // Расчет цены за метр погонный
    var pricePerMeter = pricePerCubicMeter * (thickness / 1000) * (width / 1000);

    // Расчет цены за штуку
    var pricePerPiece = pricePerMeter * (length / 1000);

    // Расчет общей стоимости
    var totalPrice = totalVolume * pricePerCubicMeter;

    // Добавление строки в таблицу результатов
    var resultsTableBody = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];
    var newRow = resultsTableBody.insertRow();

    // Заполнение данных в строку
    newRow.innerHTML = `
    <td>${material}</td>
    <td>${sizeDisplay}</td>
    <td>${quantityCalc.toFixed(2)}</td>
    <td>${totalVolume.toFixed(3)}</td>
    <td>${volumeMp.toFixed(2)}</td>
    <td>${pricePerCubicMeter.toFixed(2)}</td>
    <td>${pricePerMeter.toFixed(2)}</td>
    <td>${pricePerPiece.toFixed(2)}</td>
    <td>${totalPrice.toFixed(2)}</td>
    <td>${antiseptic}</td>
  `;

    // Добавляем кнопку удаления
    var deleteCell = newRow.insertCell();
    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Удалить';
    deleteButton.onclick = function() {
        resultsTableBody.removeChild(newRow);
    };
    deleteCell.appendChild(deleteButton);
});

document.getElementById('clear').addEventListener('click', function() {
    var resultsTableBody = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];
    resultsTableBody.innerHTML = "";

    document.getElementById('material').selectedIndex = 0;
    document.getElementById('thickness').selectedIndex = 0;
    document.getElementById('width').selectedIndex = 0;
    document.getElementById('length').selectedIndex = 0;
    document.getElementById('quantity').value = '';
    document.getElementById('antiseptic').checked = false;
});

document.getElementById('export').addEventListener('click', function() {
    // Здесь будет логика экспорта данных в Excel
});
