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
    var quantityInput = document.getElementById('quantity').value;

    // Проверяем, сколько полей заполнено
    var inputCount = [quantityInput, volumeMpInput, volumeM3Input].filter(value => value).length;

    // Если заполнено более одного поля, показываем предупреждение
    if (inputCount > 1) {
        showModal('Пожалуйста, заполните только одно поле: "Кол-во шт.", "Объем м/п" или "Объем (м³)".');
        return; // Прерываем выполнение функции
    }

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
        showModal('Введите количество штук, объем м/п или объем м³ для расчёта.');
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

document.addEventListener('DOMContentLoaded', function() {
    // Ваш код для установки обработчиков событий
    document.getElementById('add').addEventListener('click', function() {
        calculate();
        updateTotals();
    });

    document.getElementById('clear').addEventListener('click', function() {
        document.getElementById('resultsTable').getElementsByTagName('tbody')[0].innerHTML = "";
        updateTotals();
    });
});

// Функция для удаления строки из таблицы результатов и обновления итогов
function deleteRowAndUpdateTotals(row) {
    var volumeToRemove = parseFloat(row.cells[4].textContent) || 0;
    var costToRemove = parseFloat(row.cells[8].textContent) || 0;

    // Удаляем строку
    row.remove();

    // Обновляем итоговые значения
    var totalVolumeElement = document.getElementById('totalVolume');
    var totalCostElement = document.getElementById('totalCost');

    var totalVolume = parseFloat(totalVolumeElement.textContent) - volumeToRemove;
    var totalCost = parseFloat(totalCostElement.textContent) - costToRemove;

    totalVolumeElement.textContent = totalVolume.toFixed(3);
    totalCostElement.textContent = totalCost.toFixed(2);
}

// Обработчик события для кнопки "Удалить" в таблице результатов
document.getElementById('resultsTable').addEventListener('click', function(event) {
    if (event.target.tagName === 'BUTTON' && event.target.textContent === 'Удалить') {
        // Находим родительскую строку кнопки "Удалить"
        var row = event.target.closest('tr');

        // Выполняем проверку, чтобы убедиться, что строка найдена
        if (row) {
            deleteRowAndUpdateTotals(row); // Вызываем функцию для удаления строки и обновления итогов
        }
    }
});


/* Functions добавление реека в таблицу
--------------------------------------------- */
// Функция добавления выбранных данных в основную таблицу
function addSelectedBars() {
    // Находим таблицу в модальном окне
    var barsTable = document.getElementById('barsModal').querySelector('table');
    var rows = barsTable.tBodies[0].rows;

    // Перебираем строки таблицы в модальном окне
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var materialName = row.cells[0].textContent; // "Наименование"
        var quantity = row.cells[4].querySelector('input[type="number"]').value;
        var pricePerMeter = parseFloat(row.cells[3].textContent);
        var cost = pricePerMeter * quantity;

        // Если чекбокс выбран и количество введено
        if (quantity) {
            var newRow = document.getElementById('resultsTable').tBodies[0].insertRow();
            newRow.innerHTML = `
                <td>${materialName}</td>
                <td>${row.cells[1].textContent}</td>
                <td></td>
                <td>${quantity}</td>
                <td></td>
                <td>${pricePerMeter.toFixed(2)}</td>
                <td></td>
                <td></td>
                <td>${cost.toFixed(2)}</td>
                <td></td>
            `;

            // Добавляем ячейку с кнопкой удаления
            var deleteCell = newRow.insertCell();
            var deleteButton = document.createElement('button');
            deleteButton.textContent = 'Удалить';
            deleteButton.addEventListener('click', function() {
                this.closest('tr').remove();
                updateTotals(); // Обновляем итоговые значения после удаления строки
            });
            deleteCell.appendChild(deleteButton);
        }
    }

    // Очищаем выбор чекбоксов и поля после добавления строк
    document.querySelectorAll('#barsModal input[type="checkbox"]').forEach(checkbox => checkbox.checked = false);
    document.querySelectorAll('#barsModal input[type="number"]').forEach(input => input.value = '');

    // Обновляем итоговые значения после добавления строки
    updateTotals();
}

// Добавляем обработчик клика на кнопку "Добавить" в модальном окне
var addBarsButtons = document.getElementById('barsModal').querySelectorAll('.addBars');
addBarsButtons.forEach(function(button) {
    button.addEventListener('click', function() {
        addSelectedBars();
    });
});

// Функция для изменения текста кнопки на иконку и обратно
function toggleButtonLoading(button) {
    const originalText = button.innerHTML; // Сохраняем исходный текст кнопки
    button.innerHTML = '<i class="fa fa-check"></i>'; // Заменяем текст на иконку (пример использует Font Awesome)

    // Возвращаем исходный текст кнопки через 2 секунды
    setTimeout(() => {
        button.innerHTML = originalText;
    }, 1000);
}

// Назначаем обработчик событий на кнопку
document.querySelectorAll('.addBars').forEach(button => {
    button.addEventListener('click', function() {
        addSelectedBars(); // Вызываем основную функцию добавления
        toggleButtonLoading(this); // Изменяем текст кнопки на иконку загрузки
    });
});

// Объявление функции updateTotals() здесь или в другом месте скрипта...

// Drag and Drops
// Drag and Drop для .modal-content
var modalContent = document.querySelector("#barsModal .modal-content"); // Элемент для перетаскивания

// Инициализация переменных для координат
var active = false;
var currentX;
var currentY;
var initialX;
var initialY;
var xOffset = 0;
var yOffset = 0;

// Обработчик события нажатия кнопки мыши
modalContent.onmousedown = dragStart;

// Обработчики событий мыши
document.addEventListener("mouseup", dragEnd, false);
document.addEventListener("mousemove", drag, false);

// Функция для начала перетаскивания
function dragStart(e) {
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;

    if (e.target === modalContent) {
        active = true; // Активируем перетаскивание
    }
}

// Функция для окончания перетаскивания
function dragEnd(e) {
    initialX = currentX;
    initialY = currentY;
    active = false; // Деактивируем перетаскивание
}

// Функция для перетаскивания
function drag(e) {
    if (active) {
        e.preventDefault();

        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;

        xOffset = currentX;
        yOffset = currentY;

        // Установка новой позиции элемента
        setTranslate(currentX, currentY, modalContent);
    }
}

// Установка позиции элемента
function setTranslate(xPos, yPos, el) {
    el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
}

// Закрытие модального окна только при нажатии на крестик
var closeModalButton = document.querySelector(".close"); // Предполагаем, что у вас есть элемент с классом close
closeModalButton.onclick = function() {
    modalContent.parentNode.style.display = "none";
};



/* Functions Export Exel
--------------------------------------------- */
document.getElementById('export').addEventListener('click', function() {
    var tableBody = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];
    // Проверяем, есть ли строки в теле таблицы
    if (tableBody.rows.length === 0) {
        showModal('Нет данных для экспорта.');
        return; // Прерываем выполнение, если таблица пуста
    }

    // Создаём рабочую книгу
    var wb = XLSX.utils.book_new();

    // Находим таблицу результатов и клонируем её для экспорта
    var exportTable = document.getElementById('resultsTable').cloneNode(true);

    // Удаляем кнопки удаления, если они есть
    Array.from(exportTable.querySelectorAll('button')).forEach(button => button.parentNode.removeChild(button));

    // Используем утилиту SheetJS для преобразования таблицы в лист данных
    var ws = XLSX.utils.table_to_sheet(exportTable);

    // Добавляем лист данных в рабочую книгу
    XLSX.utils.book_append_sheet(wb, ws, "Results");

    // Генерируем файл Excel и инициируем его скачивание
    XLSX.writeFile(wb, "Results.xlsx");
});


/* POPUP с ошибками
--------------------------------------------- */
var modal = document.getElementById("errorModal");

// Получаем элемент <span>, который закрывает модальное окно
var span = document.getElementsByClassName("close")[0];

// Функция для отображения модального окна с текстом сообщения
function showModal(message) {
    var modalText = document.getElementById("modalText");
    modalText.textContent = message; // Установить текст в модальное окно
    modal.style.display = "block"; // Показать модальное окно
}

// Когда пользователь кликает на <span> (x), закрыть модальное окно
span.onclick = function() {
    modal.style.display = "none";
}

// Когда пользователь кликает в любом месте за пределами модального окна, закрыть его
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

/* POPUP с выбором реек
--------------------------------------------- */
var barsModal = document.getElementById('barsModal');

// Получаем кнопку, которая открывает модальное окно
var barsBtn = document.getElementById('bars');

// Получаем элемент <span> (x), который закрывает модальное окно
var span = barsModal.getElementsByClassName('close')[0];

// Когда пользователь кликает на кнопку, открыть модальное окно
barsBtn.onclick = function() {
    barsModal.style.display = "block";
}

// Когда пользователь кликает на <span> (x), закрыть модальное окно
span.onclick = function() {
    barsModal.style.display = "none";
}

// Когда пользователь кликает в любом месте за пределами модального окна, закрыть его
// window.onclick = function(event) {
//     if (event.target == barsModal) {
//         barsModal.style.display = "none";
//     }
// }

