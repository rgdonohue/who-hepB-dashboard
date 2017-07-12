(function(Chart, $){

    d3.csv('data/hepB-master.csv', function(e,d){
        makeCountryDropdown(d);
    });

    $('#year-dropdown').dropdown({
        on: "hover"
    });

    $('#country-dropdown').dropdown({
        on: "hover"
    });

    function makeCountryDropdown(data) {

        var swappedIso = {};

        var $menu = $('#countryMenu');
        
        data.forEach(function(datum) {

            var dataISO = datum.ISO3;

            for(var code in isoCodes) {
                var codeISO = isoCodes[code];
                if(dataISO === codeISO) {
                    swappedIso[dataISO] = code
                }
            }

            var item = '<div class="item" data-value="' + dataISO + '"><i class="' + swappedIso[dataISO].toLowerCase() + ' flag"></i>' + datum.Country + '</div>';

            $menu.append(item);

        });

    }

    function makeCharts(data) {

        var ctxC = document.getElementById('vizC').getContext('2d');
        
        var chart = new Chart(ctxC, {
            // The type of chart we want to create
            type: 'line',

            // The data dataset
            data: {
                labels: ["1990", "1991", "1992", "1993", "1994", "1995", "1996"],
                datasets: [{
                    label: "Percentage of infants vaccinated with 3 doses of Hep B (2015)",
                    borderColor: 'rgb(255, 99, 132)',
                    data: [0, 10, 5, 2, 20, 30, 45],
                }, 
                {
                    label: "Percentage of infants vaccinated with 3 doses of Hep B birth (2015)",
                    borderColor: 'rgb(0, 99, 132)',
                    data: [20, 35, 45, 62, 72, 84, 96],
                }]
            },

            // Configuration options go here
            options: {}
        });

        var ctxD1 = document.getElementById('vizD-1').getContext('2d');

        var myBarChart = new Chart(ctxD1, {
            type: 'bar',
            data: {
                labels: ["pre", "post", "pre", "post"],
                datasets: [{
                    data: [3, 1.2, 3.5, 1.7]
                }]
            },
            options: {
                scaleBeginAtZero: true
            }
        });

        var ctxD2 = document.getElementById('vizD-2').getContext('2d');

        var myBarChart = new Chart(ctxD2, {
            type: 'bar',
            data: {
                labels: ["pre", "post", "pre", "post"],
                datasets: [{
                    data: [3, 1.2, 3.5, 1.7]
                }]
            },
            options: {
                scaleBeginAtZero: true
            }
        });

        var ctxD3 = document.getElementById('vizD-3').getContext('2d');

        var myBarChart = new Chart(ctxD3, {
            type: 'bar',
            data: {
                labels: ["pre", "post", "pre", "post"],
                datasets: [{
                    data: [3, 1.2, 3.5, 1.7]
                }]
            },
            options: {
                scaleBeginAtZero: true
            }
        });

    }



})(Chart, $);
