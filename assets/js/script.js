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

// Массив объектов с данными для брусков
var barsData = [
    {
        name: "Сырая пилорамная",
        thickness: 30,
        width: 50,
        unit: "м/п",
        price: 14.10
    },
    {
        name: "Сырая калиброваная",
        thickness: 30,
        width: 50,
        unit: "м/п",
        price: 18.50
    },
    {
        name: "Сухая калиброваная",
        thickness: 30,
        width: 50,
        unit: "м/п",
        price: 21.50
    },
    {
        name: "Сырая пилорамная",
        thickness: 50,
        width: 50,
        unit: "м/п",
        price: 23.50
    },
    {
        name: "Сырая калиброваная",
        thickness: 50,
        width: 50,
        unit: "м/п",
        price: 30.80
    },
    {
        name: "Сухая калиброваная",
        thickness: 50,
        width: 50,
        unit: "м/п",
        price: 35.80
    },
];

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
    <td>${quantity.toFixed(0)}</td>
    <td>${volumeMp.toFixed(2)}</td>
    <td>${totalVolume.toFixed(3)}</td>
    <td>${pricePerMeter.toFixed(2)}</td>
    <td>${pricePerPiece.toFixed(2)}</td>
    <td>${pricePerCubicMeter.toFixed(0)}</td>
    <td>${totalPrice.toFixed(2)}</td>
    <td>${antisepticCost > 0 ? antisepticCost.toFixed(2) : 'Нет'}</td>
    `;

    // Добавляем кнопку удаления
    var deleteCell = newRow.insertCell();
    var deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
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
// Функция для создания строк в модальном окне на основе данных из barsData
// Функция для создания строк в модальном окне на основе данных из barsData
function populateBarsModal() {
    var barsTableBody = document.getElementById('barsModal').querySelector('tbody');
    barsTableBody.innerHTML = ''; // Очистить текущие строки

    barsData.forEach(function(bar) {
        var row = barsTableBody.insertRow();
        row.innerHTML = `
            <td>${bar.name}</td>
            <td>${bar.thickness}x${bar.width}</td>
            <td>${bar.unit}</td>
            <td>${bar.price.toFixed(2)}</td>
            <td><input type="number" min="0"></td>
            <td>
                <select class="barAntiseptic js-example-basic-single" name="state">
                        <option value="none">Нет</option>
                        <option value="BIO">БИО</option>
                        <option value="OgneBio">ОгнеБио</option>
                </select>
            </td>
            <td><button class="addBars">Добавить</button></td>
        `;
        // Назначаем обработчик события для кнопки "Добавить" в этой строке
        row.querySelector('.addBars').addEventListener('click', function() {
            addBarToResults(bar, row);
        });
    });
}

// Функция добавления выбранных данных в основную таблицу
function addBarToResults(bar, row) {
    var quantity = row.querySelector('input[type="number"]').value;
    var pricePerMeter = bar.price;
    var cost = pricePerMeter * quantity;

    var antisepticSelect = row.querySelector('.barAntiseptic'); // Выбор антисептика
    var antisepticType = antisepticSelect ? antisepticSelect.value : 'none'; // Тип антисептика или 'none', если select не найден
    var antisepticPrice = antisepticPrices[antisepticType]; // Цена антисептической обработки

    var volume = (bar.thickness / 1000) * (bar.width / 1000) * (bar.unit === 'м/п' ? 1 : 0); // Объем одного бруса в куб.м., если единица измерения 'м/п'
    var totalVolume = volume * quantity; // Общий объем бруса в куб.м.
    var totalPrice = (bar.price * totalVolume) + (antisepticPrice * totalVolume); // Общая стоимость бруса и антисептика

    if (quantity) {
        var newRow = document.getElementById('resultsTable').tBodies[0].insertRow();
        newRow.innerHTML = `
            <td>${bar.name}</td>
            <td>${bar.thickness}x${bar.width}</td>
            <td>-</td>
            <td>${quantity}</td>
            <td>${(quantity * bar.thickness * bar.width / 1000000).toFixed(3)}</td>
            <td>${pricePerMeter.toFixed(2)}</td>
            <td>-</td>
            <td>${(pricePerMeter / (bar.thickness / 1000) / (bar.width / 1000)).toFixed(2)}</td>
            <td>${(pricePerMeter * quantity).toFixed(2)}</td>
            <td>${(antisepticPrice * totalVolume).toFixed(2)}</td>
        `;

        var deleteCell = newRow.insertCell();
        var deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
        deleteButton.addEventListener('click', function() {
            newRow.remove();
            updateTotals();
        });
        deleteCell.appendChild(deleteButton);
    }

    row.querySelector('input[type="number"]').value = ''; // Очистить поле ввода после добавления
    updateTotals();
}


populateBarsModal();

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

/* addCustomSizeTable
--------------------------------------------- */
// Get the modal element for custom size
var addCustomSizeModal = document.getElementById('addCustomSizeTable');

// Get the button that opens the custom size modal
var addCustomSizeButton = document.getElementById('addCustomSizeButton');

// Get the <span> element that closes the modal
var spanCloseCustomSize = addCustomSizeModal.querySelector('.close');

// Event listener to open the custom size modal
addCustomSizeButton.onclick = function() {
    addCustomSizeModal.style.display = "block";
    initDragAndDrop(addCustomSizeModal.querySelector('.modal-content'));
}

// Event listener to close the custom size modal
spanCloseCustomSize.onclick = function() {
    addCustomSizeModal.style.display = "none";
}

// Initialize drag and drop on modal content
function initDragAndDrop(modalContent) {
    var active = false;
    var currentX;
    var currentY;
    var initialX;
    var initialY;
    var xOffset = 0;
    var yOffset = 0;

    modalContent.addEventListener('mousedown', dragStart, false);

    function dragStart(e) {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
        if (e.target === modalContent) {
            active = true;
        }
    }

    document.addEventListener('mouseup', dragEnd, false);
    document.addEventListener('mousemove', drag, false);

    function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;
        active = false;
    }

    function drag(e) {
        if (active) {
            e.preventDefault();

            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, modalContent);
        }
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
    }
}

// Close the custom size modal when clicking outside of it
window.onclick = function(event) {
    if (event.target == addCustomSizeModal) {
        addCustomSizeModal.style.display = "none";
    }
}

////
// Функция для получения цены за кубический метр в зависимости от длины и типа материала
function getPricePerCubicMeter(length, materialType) {
    // Объявление цен в зависимости от длины и типа материала
    const prices = {
        'Сырой': {
            '3000': 7900,
            '4000': 7900,
            '4500': 7900,
            '6000': 7900,
            '7000': 12800,
            '8000': 13800
        },
        'Сухой': {
            '3000': 9800,
            '4000': 9800,
            '4500': 9800,
            '6000': 9800,
            '7000': 13800,
            '8000': 14800,
            '9000': 9800
        }
    };

    // Определение базовой цены для нестандартных длин
    let basePrice = materialType === 'Сырой' ? 7900 : 9800;

    // Возврат цены в зависимости от длины и типа материала
    return prices[materialType][length.toString()] || basePrice * 1.3;
}

// Вспомогательная функция для получения цены за кубический метр на основе длины
function calculateCustomSize() {
    // Получаем значения из полей ввода и переводим миллиметры в метры
    var materialCustom = document.getElementById('materialCustom').value;
    var thicknessCustom = parseFloat(document.getElementById('thicknessCustom').value) / 1000;
    var widthCustom = parseFloat(document.getElementById('widthCustom').value) / 1000;
    var lengthCustom = parseFloat(document.getElementById('lengthCustom').value) / 1000;
    var quantityCustom = parseFloat(document.getElementById('quantityCustom').value);
    var antisepticType = document.getElementById('antisepticCustom').value;

    if (isNaN(thicknessCustom) || isNaN(widthCustom) || isNaN(lengthCustom) || isNaN(quantityCustom)) {
        showModal('Необходимо ввести все размеры и количество.');
        return;
    }

    // Расчет стоимости м/п
    let totalLength = quantityCustom * lengthCustom;

    // Расчет объема одной штуки в кубических метрах и общего объема
    var volumePerPiece = thicknessCustom * widthCustom * lengthCustom; // Уже в кубических метрах
    var totalVolume = volumePerPiece * quantityCustom;

    // Получаем цену за кубический метр
    var pricePerCubicMeter = getPricePerCubicMeter(lengthCustom * 1000, materialCustom); // Передаем длину обратно в миллиметрах
    var pricePerMeter = pricePerCubicMeter * thicknessCustom * widthCustom; // Цена за метр погонный
    var pricePerPiece = pricePerMeter * lengthCustom; // Цена за штуку

    // Расчет стоимости антисептической обработки
    var antisepticPrice = antisepticPrices[antisepticType];
    var antisepticCost = totalVolume * antisepticPrice;

    // Расчет общей стоимости
    var totalPrice = totalVolume * pricePerCubicMeter + antisepticCost;

    // Добавление строки в таблицу результатов
    var resultsTableBody = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];
    var newRow = resultsTableBody.insertRow();
    newRow.innerHTML = `
        <td>${materialCustom}</td>
        <td>${(thicknessCustom * 1000).toFixed(0)}x${(widthCustom * 1000).toFixed(0)}x${(lengthCustom * 1000).toFixed(0)}</td>
        <td>${quantityCustom.toFixed(0)}</td>
        <td>${totalLength.toFixed(1)}</td>
        <td>${totalVolume.toFixed(3)}</td>
        <td>${pricePerMeter.toFixed(2)}</td>
        <td>${pricePerPiece.toFixed(2)}</td>
        <td>${pricePerCubicMeter.toFixed(0)}</td>
        <td>${totalPrice.toFixed(2)}</td>
        <td>${antisepticCost > 0 ? antisepticCost.toFixed(2) : 'Нет'}</td>
        <td><button onclick="deleteRow(this.parentNode.parentNode)"><i class="fa-solid fa-trash"></i></button></td>
    `;

    // Обновление итоговых значений
    updateTotals();

    // Очистка полей ввода
    clearCustomSizeInputs();
}

function clearCustomSizeInputs() {
    document.getElementById('thicknessCustom').value = '';
    document.getElementById('widthCustom').value = '';
    document.getElementById('lengthCustom').value = '';
    document.getElementById('quantityCustom').value = '';
    document.getElementById('materialCustom').selectedIndex = 0;
    document.getElementById('antisepticCustom').selectedIndex = 0;
    // Обновление плагина select2 для отображения изменений, если используется
    $('#materialCustom').select2().trigger('change');
    $('#antisepticCustom').select2().trigger('change');
}


// Обработчик клика для кнопки добавления пользовательского размера в таблицу
document.getElementById('customSizeButton').addEventListener('click', calculateCustomSize);

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