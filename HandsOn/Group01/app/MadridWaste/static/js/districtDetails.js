document.getElementById('yearSelector').addEventListener('change', function() {
    var selectedYear = this.value;
    var currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('year', selectedYear);
    window.location.href = currentUrl.toString();
});

$(document).ready(function() {
    $('#wasteDataTable').DataTable({
        "order": [[2, "asc"]],
        "pagingType": "full_numbers"
    });
});

document.addEventListener('DOMContentLoaded', function() {
    if (window.wasteResults) {
        initWasteChart(window.wasteResults);
    } else {
        console.error("No waste data available");
    }
});

function reverseFormatWasteType(formattedWasteType) {
    const reverseMap = {
        "Construction and Demolition Waste": "CDW",
        "Biomedical Waste": "biomedicalWaste",
        "Clothing": "clothing",
        "Glass": "glass",
        "Non Recyclable Waste": "non-recyclable-waste",
        "Organic Food": "organicFood",
        "Packaging Products of Plastic": "packagingProductsOfPlastics",
        "Waste Paper": "wastePaper",
        "Waste Container": "wasteContainer",
        "Horse Bed": "horseBed"
    };
    return reverseMap[formattedWasteType] || formattedWasteType;
}

document.querySelectorAll('.waste-type-link').forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        const originalWasteType = reverseFormatWasteType(this.textContent.trim());
        const wikidataId = this.dataset.wikidataId;
        window.location.href = `/wasteType?wikidata_id=${wikidataId}&name=${originalWasteType}`;
    });
});

function initWasteChart(wasteResults) {
    var canvas = document.getElementById('wasteChart');
    if (canvas) {
        var ctx = canvas.getContext('2d');
        var labels = [];  // x-axis labels (Months)
        var datasets = [];  // datasets for each waste type
        var wasteTypes = {};  // dictionary to hold data for each waste type

        wasteResults.forEach(result => {
            if (!wasteTypes.hasOwnProperty(result.wasteName)) {
                wasteTypes[result.wasteName] = new Array(12).fill(0); // Initialize with zeros for each month
            }
            // Assuming month is in 1-12 format
            wasteTypes[result.wasteName][parseInt(result.month) - 1] = parseFloat(result.totalAmount);
        });

        // Create labels for each month
        for (let i = 1; i <= 12; i++) {
            labels.push(i.toString());
        }

        Object.keys(wasteTypes).forEach(wasteType => {
            var color = '#' + Math.floor(Math.random() * 16777215).toString(16);  // random color
            datasets.push({
                label: wasteType,
                data: wasteTypes[wasteType],
                backgroundColor: color,
                borderColor: color,
                borderWidth: 1
            });
        });

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}
