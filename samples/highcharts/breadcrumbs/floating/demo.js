Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Floating breadcrumbs buttons'
    },
    subtitle: {
        text: 'Drilldown to see how the buttons are positioned'
    },
    xAxis: {
        type: 'category'
    },
    series: [{
        name: "Supply",
        data: [{
            name: "Fruits",
            y: 5,
            drilldown: "Fruits"
        }, {
            name: "Vegetables",
            y: 6
        }, {
            name: "Meat",
            y: 3
        }]
    }],
    drilldown: {
        breadcrumbs: {
            floating: false
        },
        animation: false,
        series: [{
            name: "Fruits",
            id: "Fruits",
            data: [
                ["Citrus", 2],
                ["Tropical", 5],
                ['Other', 1]
            ]
        }]
    }
});
