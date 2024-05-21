document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var formData = new FormData(this);
    var searchParams = new URLSearchParams(formData).toString();
    const startYear = document.getElementById('startYear').value;
    const endYear = document.getElementById('endYear').value;

    if (parseInt(endYear) < parseInt(startYear)) {
        alert("结束年份必须大于开始年份。");
        return;
    }

    // Check if any yuzu type is selected
    var selectedYuzuTypes = Array.from(document.querySelectorAll('.yuzuType input[type="checkbox"]:checked')).map(checkbox => checkbox.value);
    if (selectedYuzuTypes.length === 0) {
        alert("请至少选择一个柚子品种。");
        return;
    }

    fetch('/search?' + searchParams)
        .then(response => response.json())
        .then(data => {
            var resultDiv = document.getElementById('result');
            resultDiv.innerHTML = '';

            if (data.length === 0) {
                resultDiv.textContent = 'No results found.';
            } else {
                var table = document.createElement('table');
                var headerRow = table.insertRow(0);
                var columns = ['Year'];

                // Get selected yuzu types
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
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});
