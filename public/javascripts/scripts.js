document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var formData = new FormData(this);
    var searchParams = new URLSearchParams(formData).toString();
    const startYear = document.getElementById('startYear').value;
    const endYear = document.getElementById('endYear').value;

    if (parseInt(endYear) < parseInt(startYear)) {
        alert("結束年份必須大於等於開始年分");
        return;
    }

    var selectedYuzuTypes = Array.from(document.querySelectorAll('.yuzuType input[type="checkbox"]:checked')).map(checkbox => checkbox.value);
    if (selectedYuzuTypes.length === 0) {
        alert("請至少選擇一種柚子品種");
        return;
    }

    fetch('/search?' + searchParams)
        .then(response => response.json())
        .then(data => {
            var resultDiv = document.getElementById('result');
            resultDiv.innerHTML = '';
            var exportBtn = document.getElementById('exportBtn');

            if (data.length === 0) {
                resultDiv.textContent = 'No results found.';
                exportBtn.style.display = 'none'
            } else {
                resultDiv.classList.add('showBorder');
                var table = document.createElement('table');
                var headerRow = table.insertRow(0);
                var columns = ['Year'];

                if (selectedYuzuTypes.includes('all')) {
                    columns.push('Wendan', 'GrapeFruit', 'XishiYuzu');
                } else {
                    columns.push(...selectedYuzuTypes);
                }

                columns.forEach(headerText => {
                    var headerCell = document.createElement('th');
                    headerCell.textContent = headerText;
                    headerRow.appendChild(headerCell);
                });

                data.forEach(entry => {
                    var row = table.insertRow(-1);
                    columns.forEach(field => {
                        var cell = row.insertCell(-1);
                        cell.textContent = entry[field];
                    });
                });

                resultDiv.appendChild(table);

                // 顯示導出按鈕
                exportBtn.style.display = 'inline';

                // 移除之前的折線圖
                var oldChart = Chart.getChart('trendChart');
                if (oldChart) {
                    oldChart.destroy();
                }

                // 繪製新的折線圖
                var ctx = document.getElementById('trendChart').getContext('2d');
                var labels = data.map(entry => entry.Year);
                var datasets = selectedYuzuTypes.map((type, index) => {
                    return {
                        label: type,
                        data: data.map(entry => entry[type]),
                        fill: false,
                        borderColor: yuzuColors[index % yuzuColors.length], // 使用模運算來保證顏色不重複
                        tension: 0.1
                    };
                });

                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: datasets
                    },
                    options: {
                        responsive: true,
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Year'
                                }
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Price'
                                }
                            }
                        }
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

document.getElementById('exportBtn').addEventListener('click', function() {
    var table = document.querySelector('#result table');
    var csv = [];
    var rows = table.querySelectorAll('tr');

    for (var i = 0; i < rows.length; i++) {
        var row = [], cols = rows[i].querySelectorAll('td, th');

        for (var j = 0; j < cols.length; j++) {
            row.push(cols[j].innerText);
        }

        csv.push(row.join(','));
    }

    var csvString = csv.join('\n');
    var downloadLink = document.createElement('a');
    downloadLink.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvString);
    downloadLink.target = '_blank';
    downloadLink.download = 'yuzu_prices.csv';
    downloadLink.click();
});

// 將柚子顏色陣列隨機排序
const yuzuColors = ['#f5eac3', '#53664a', '#f9f68a', '#f6dd58', '#b9cd94'];
yuzuColors.sort(() => Math.random() - 0.5);
