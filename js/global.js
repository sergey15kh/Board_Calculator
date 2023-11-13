/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./js/script.js":
/*!**********************!*\
  !*** ./js/script.js ***!
  \**********************/
/***/ (() => {

eval("// Предположим, что цена за м³ задана заранее\r\nconst pricePerCubicMeter = 7400; // Пример цены за м³\r\n\r\ndocument.getElementById('add').addEventListener('click', function() {\r\n    var material = document.getElementById('material').value;\r\n    var thickness = parseFloat(document.getElementById('thickness').value); // толщина в мм\r\n    var width = parseFloat(document.getElementById('width').value); // ширина в мм\r\n    var length = parseFloat(document.getElementById('length').value); // длина в мм\r\n    var quantity = parseInt(document.getElementById('quantity').value);\r\n    var antiseptic = document.getElementById('antiseptic').checked ? \"Да\" : \"Нет\";\r\n\r\n    // Расчет размеров для отображения\r\n    var sizeDisplay = `${thickness}x${width}x${length}`;\r\n\r\n    // Расчет объема одной доски или бруса в м³\r\n    var volumePerPiece = (thickness / 1000) * (width / 1000) * (length / 1000);\r\n    var totalVolume = volumePerPiece * quantity; // Общий объем в м³\r\n\r\n    // Расчет количества штук на основе введенного объема и размеров\r\n    var quantityCalc = totalVolume / volumePerPiece;\r\n\r\n    // Расчет объема м/п\r\n    var volumeMp = totalVolume / (thickness / 1000) / (width / 1000);\r\n\r\n    // Расчет цены за метр погонный\r\n    var pricePerMeter = pricePerCubicMeter * (thickness / 1000) * (width / 1000);\r\n\r\n    // Расчет цены за штуку\r\n    var pricePerPiece = pricePerMeter * (length / 1000);\r\n\r\n    // Расчет общей стоимости\r\n    var totalPrice = totalVolume * pricePerCubicMeter;\r\n\r\n    // Добавление строки в таблицу результатов\r\n    var resultsTableBody = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];\r\n    var newRow = resultsTableBody.insertRow();\r\n\r\n    // Заполнение данных в строку\r\n    newRow.innerHTML = `\r\n    <td>${material}</td>\r\n    <td>${sizeDisplay}</td>\r\n    <td>${quantityCalc.toFixed(2)}</td>\r\n    <td>${totalVolume.toFixed(3)}</td>\r\n    <td>${volumeMp.toFixed(2)}</td>\r\n    <td>${pricePerCubicMeter.toFixed(2)}</td>\r\n    <td>${pricePerMeter.toFixed(2)}</td>\r\n    <td>${pricePerPiece.toFixed(2)}</td>\r\n    <td>${totalPrice.toFixed(2)}</td>\r\n    <td>${antiseptic}</td>\r\n  `;\r\n\r\n    // Добавляем кнопку удаления\r\n    var deleteCell = newRow.insertCell();\r\n    var deleteButton = document.createElement('button');\r\n    deleteButton.textContent = 'Удалить';\r\n    deleteButton.onclick = function() {\r\n        resultsTableBody.removeChild(newRow);\r\n    };\r\n    deleteCell.appendChild(deleteButton);\r\n});\r\n\r\ndocument.getElementById('clear').addEventListener('click', function() {\r\n    var resultsTableBody = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];\r\n    resultsTableBody.innerHTML = \"\";\r\n\r\n    document.getElementById('material').selectedIndex = 0;\r\n    document.getElementById('thickness').selectedIndex = 0;\r\n    document.getElementById('width').selectedIndex = 0;\r\n    document.getElementById('length').selectedIndex = 0;\r\n    document.getElementById('quantity').value = '';\r\n    document.getElementById('antiseptic').checked = false;\r\n});\r\n\r\ndocument.getElementById('export').addEventListener('click', function() {\r\n    // Здесь будет логика экспорта данных в Excel\r\n});\r\n\n\n//# sourceURL=webpack://board-calculate/./js/script.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./js/script.js"]();
/******/ 	
/******/ })()
;