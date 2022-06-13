import '../css/websessions.css';
import '@grapecity/wijmo.styles/themes/wijmo.theme.material.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import * as wjCore from '@grapecity/wijmo';
import * as wjGrid from '@grapecity/wijmo.grid';
import * as wjChart from '@grapecity/wijmo.chart';
import * as wjGauge from '@grapecity/wijmo.gauge';
import * as wjMap from '@grapecity/wijmo.chart.map';
import * as wjInput from '@grapecity/wijmo.input';

import * as dashboardData from './dashboard-data';

const geoJson = require('../custom.geo.json');

// Retrieves the jwt used to connect to Weavy
async function tokenFactory() {
    var response = await fetch('/token').then((response) => response.json());
    document.getElementById('username').innerText = response.name;
    return response.value;
}
var webtoken = tokenFactory();

// Handles visibility of the Weavy Messenger control
document.getElementById('chatBubble').addEventListener('click', () => {
    if(document.getElementById('theMessenger').style.visibility == "" || document.getElementById('theMessenger').style.visibility == "hidden") {
        document.getElementById('theMessenger').style.visibility = "visible";
    }
    else if(document.getElementById('theMessenger').style.visibility == "visible") {
        document.getElementById('theMessenger').style.visibility = "hidden";
    }
});

// Generates tooltips to display when hovering icons
dashboardData.generateTooltips();

// Generates data and settings for datamap
var countryMapData = dashboardData.getCountryMapData();
var dataMap = new Map();
Array.prototype.forEach.call(countryMapData, el => {
    dataMap.set(el.Country, parseFloat(el.AverageResponseTime));
});
var hitTestInfo, selectedId;
var selectedColor = '#188d9b';

function updateGrids(name) {
    if(validCountry(name)) {
        uCollectionView.sourceCollection = dashboardData.getUsersData(name)
        iGrid.collectionView.sourceCollection = dashboardData.getIssueData(name);
    }
}

function validCountry(name) {
    for(var i = 0; i < countryMapData.length; i++) {
        if(countryMapData[i].Country == name) {
            return true;
        }
    }
    return false;
}

// Generates the gauge controls
function generateGauges(countriesArray) {
    var tcMax = 21.9;
    var countriesList = document.getElementById('countries-list');
    for(var i = 0; i < countriesArray.length; i++) {
        var countryItem = document.createElement('div');
        countryItem.classList = 'country-item';
        countriesList.appendChild(countryItem);
        var countryName = document.createElement('div');
        countryName.innerText = countriesArray[i].name;
        countryItem.appendChild(countryName);
        var totalVisits = document.createElement('div');
        totalVisits.innerText = "Total Visits: " + countriesArray[i].visits + "k";
        countryItem.appendChild(totalVisits);
        var percentage = document.createElement('div');
        percentage.innerText = "Percentage: " + countriesArray[i].percentage;
        countryItem.appendChild(percentage);
        var countryGauge = document.createElement('div');
        countryGauge.classList = 'country-subtotal-gauge';
        countryItem.appendChild(countryGauge);
        var gaugeEl = document.createElement('div');
        gaugeEl.id = "gauge" + i;
        countryGauge.appendChild(gaugeEl);
        var gaugeDiv = "#" + gaugeEl.id;
        var gauge = new wjGauge.LinearGauge(gaugeDiv, {
            isReadOnly: true,
            min: 0,
            max: tcMax,
            value: countriesArray[i].visits,
            showRanges: false
        });
    }
}

generateGauges(dashboardData.getTopCountryData());

// Map Control
var map = new wjMap.FlexMap('#map', {
    header: 'Breakdown by Country',
    selectionMode: 2,
    layers: [
        new wjMap.GeoMapLayer({
            itemsSource: geoJson,
            colorScale: new wjMap.ColorScale({
                colors: wjChart.Palettes.Diverging.RdYlGn,
                binding: (o) => dataMap.get(o.properties.name),
                scale: (v) => 1-v,
            })
        })
    ]
});

// Events for the map to display selected country
map.hostElement.addEventListener('mousedown', (e) => {
    hitTestInfo = map.hitTest(e);
    if(hitTestInfo._item !== undefined) {
        updateGrids(hitTestInfo._item.name);
        let el = document.elementFromPoint(e.x, e.y);
        let id = el ? el.getAttribute('wj-map:id') : undefined;
        selectedId = id;
        map.invalidate(true);
    }
});

map.rendered.addHandler((s, e) => {
    let layer = map.layers[0];
    let g = layer._g;
    if(g && selectedId && validCountry(hitTestInfo._item.name)) {
        let list = [];
        for(var i = 0; i < g.childNodes.length; i++) {
            const node = g.childNodes[i];
            let id = node.getAttribute('wj-map:id');
            if(id === selectedId) {
                node.setAttribute('fill', selectedColor);
                list.push(node);
            }
        }
        list.forEach((el) => el.parentNode.appendChild(el));
    }
});

// Users data CollectionView
var uCollectionView = new wjCore.CollectionView(dashboardData.getUsersData('United States'), {
    pageSize: 25
});

// Users FlexGrid Control
var uGrid = new wjGrid.FlexGrid('#uGrid', {
    itemsSource: uCollectionView,
    isReadOnly: true,
    selectionMode: wjGrid.SelectionMode.Row,
    headersVisibility: wjGrid.HeadersVisibility.Column,
    columns: [
        { binding: 'country', header: 'Country', width: '*' },
        { binding: 'sessionDuration', header: 'Session Duration' },
        { binding: 'ipAddress', header: 'IP Address' },
        { binding: 'platform', header: 'Platform' },
        { binding: 'browser', header: 'Browser' },
    ]
});

// FlexGrid Pager
var uPager = new wjInput.CollectionViewNavigator('#uPager', {
    byPage: true,
    headerFormat: 'Page {currentPage:n0} of {pageCount:n0}',
    cv: uCollectionView
})

// Sessions Data
var sData = [
    { sessions: 'New Users', number: 49120 },
    { sessions: 'Returning Users', number: 62780 }
];

var pageViews = { value: 3.54, change: '12.26%' };
var sessions = { value: '4m 41s', change: '9.38%' };
var totalSessions = '111.9k';

var pChange = document.createElement('span');
pChange.innerText = pageViews.change;
var sChange = document.createElement('span');
sChange.innerText = sessions.change;

document.getElementById('sessionTotal').innerText = totalSessions;
document.getElementById('newSessions').innerText = sData[0].number;
document.getElementById('returnSessions').innerText = sData[1].number;
document.getElementById('pageViewValue').innerText = pageViews.value;
document.getElementById('pageViewChange').appendChild(pChange);
document.getElementById('sessionsValue').innerText = sessions.value;
document.getElementById('sessionsChange').appendChild(sChange);

// Sessions Control
var sPie = new wjChart.FlexPie('#sPie', {
    itemsSource: sData,
    bindingName: 'sessions',
    binding: 'number',
    innerRadius: 0.85,
    palette: ['#2b8cbe', '#0868ac'],
    legend: {
        position: wjChart.Position.None
    },
});

// Issues Data
var iData = dashboardData.getIssueData('United States');

// Issues Control
var iGrid = new wjGrid.FlexGrid('#issuesGrid', {
    itemsSource: iData,
    isReadOnly: true,
    selectionMode: wjGrid.SelectionMode.Row,
    headersVisibility: wjGrid.HeadersVisibility.Column,
    lazyRender: false,
    columns: [
        { binding: 'country', header: 'Country', width: '*' },
        { binding: 'issue', header: 'Issue', width: '*' },
        { binding: 'status', header: 'Status', width: '*' },
    ]
});

// Chart data and styles
var piePalette = ["#a8ddb5", "#7bccc4", "#4eb3d3", "#2b8cbe", "#0868ac"];
var chartPalette = ["#2b8cbe", "#0868ac"];
var platformData = dashboardData.getPlatformData();
var browserData = dashboardData.getBrowserData();

// Top Platform Controls
var tpChart = new wjChart.FlexChart('#tpChart', {
    header: "Average Load Time",
    legend: {
        position: wjChart.Position.None
    },
    bindingX: "platform",
    series: [
        {
            binding: "prevMonth",
            name: "Previous Month"
        },
        {
            binding: "curMonth",
            name: "Current Month"
        }
    ],
    palette: chartPalette,
    itemsSource: platformData[0],
    selectionMode: wjChart.SelectionMode.Point
});

var tpPie = new wjChart.FlexPie('#tpPie', {
    header: "Sessions by Platform",
    binding: "sessions",
    bindingName: "platform",
    itemsSource: platformData[1],
    palette: piePalette
})

// Top Browser Controls
var tbChart = new wjChart.FlexChart('#tbChart', {
    header: "Average Load Time",
    legend: {
        position: wjChart.Position.None
    },
    bindingX: "platform",
    series: [
        {
            binding: "prevMonth",
            name: "Previous Month"
        },
        {
            binding: "curMonth",
            name: "Current Month"
        }
    ],
    palette: chartPalette,
    itemsSource: browserData[0],
    selectionMode: wjChart.SelectionMode.Point
});

var tbPie = new wjChart.FlexPie('#tbPie', {
    header: "Sessions by Browser",
    binding: "sessions",
    bindingName: "platform",
    itemsSource: browserData[1],
    palette: piePalette
});