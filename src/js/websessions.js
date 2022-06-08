import '../css/websessions.css';
import '@grapecity/wijmo.styles/themes/wijmo.theme.material.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import * as wjCore from '@grapecity/wijmo';
import * as wjGrid from '@grapecity/wijmo.grid';
import * as wjChart from '@grapecity/wijmo.chart';
import * as wjGauge from '@grapecity/wijmo.gauge';
import * as wjInput from '@grapecity/wijmo.input';

async function tokenFactory() {
    var response = await fetch('/token').then((response) => response.json());
    document.getElementById('username').innerText = response.name;
    return response.value;
}

var jwt = tokenFactory();

function getIssueData(country) {
    var issues = [
        { issue: '500 Internal Server Error', status: 'High', message: 'General purpose error: potential server overload' },
        { issue: '400 Bad Request', status: 'High', message: 'Browser error: corrupted request' },
        { issue: '408 Request Time-Out', status: 'High', message: 'Slow response time: check server request' },
        { issue: '403 Forbidden', status: 'Moderate', message: 'Refused access: user attempted to access forbidden directory' },
        { issue: '501 Not Implemented', status: 'Moderate', message: 'Request refused: unsupported browser feature' },
        { issue: '401 Unauthorized', status: 'Low', message: 'Login failed: user does not have access' },
        { issue: '404 Not Found', status: 'Low', message: 'Page not returned: check status of requested page' },
    ], data = [];
    var reportedIssues = [
        { country: 'United States', issuesReported: 72 },
        { country: 'Canada', issuesReported: 35 },
        { country: 'Mexico', issuesReported: 24 },
        { country: 'Brazil', issuesReported: 7 },
        { country: 'Peru', issuesReported: 2 },
        { country: 'United Kingdom', issuesReported: 29 },
        { country: 'France', issuesReported: 19 },
        { country: 'Germany', issuesReported: 15 },
        { country: 'Spain', issuesReported: 9 },
        { country: 'Italy', issuesReported: 6 },
        { country: 'Netherlands', issuesReported: 4 },
        { country: 'Finland', issuesReported: 7 },
        { country: 'Denmark', issuesReported: 9 },
        { country: 'Norway', issuesReported: 14 },
        { country: 'Poland', issuesReported: 3 },
        { country: 'Russia', issuesReported: 11 },
        { country: 'Ukraine', issuesReported: 8 },
        { country: 'China', issuesReported: 18 },
        { country: 'Japan', issuesReported: 17 },
        { country: 'Australia', issuesReported: 7 },
    ];    
    for(var i = 0; i < reportedIssues.length; i++) {
        if(reportedIssues[i].country == country) {
            for(var j = 0; j < reportedIssues[i].issuesReported; j++) {
                var selector = Math.round(Math.random() * (6));
                data.push({
                    country: country,
                    issue: issues[selector].issue,
                    status: issues[selector].status,
                    message: issues[selector].message
                });
            }
            break;
        }
    }
    return data;
}

function getUsersData(country) {
    var data = [], platforms = ['Desktop', 'Mobile', 'Tablet', 'Other'], browsers = ['Chrome', 'Firefox', 'Edge', 'Safari', 'Other'];
    for(var i = 0; i < 200; i++) {
        data.push({
            country: country,
            sessionDuration: Math.round(Math.random() * 7) + 'm ' + Math.round(Math.random() * 60) + 's',
            ipAddress: Math.round(Math.random() * (999 - 1) + 1) + '.' + Math.round(Math.random() * (999 - 1) + 1) + '.' + Math.round(Math.random() * (999 - 1) + 1) + '.' + Math.round(Math.random() * (999 - 1) + 1),
            platform: platforms[Math.round(Math.random() * (3))],
            browser: browsers[Math.round(Math.random() * (4))]
        });
    }
    return data;
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

// Users Data
var uCollectionView = new wjCore.CollectionView(getUsersData('United States'), {
    pageSize: 25
})

// Users Control
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
var iData = getIssueData('United States');

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

// Top Country Data
var tcData = [
    { name: 'United States', visits: 21.9, percentage: 19.7 },
    { name: 'Japan', visits: 13.8, percentage: 12.4 },
    { name: 'Canada', visits: 12.7, percentage: 11.4 },
    { name: 'China', visits: 11.3, percentage: 10.2 },
    { name: 'United Kingdom', visits: 7.9, percentage: 7.1 },
    { name: 'Russia', visits: 5.9, percentage: 5.3 },
    { name: 'Germany', visits: 5.9, percentage: 5.3 },
    { name: 'Mexico', visits: 4.2, percentage: 3.8 },
    { name: 'France', visits: 3.4, percentage: 3.1 },
    { name: 'Ukraine', visits: 3.1, percentage: 2.8 }
];

generateGauges(tcData);

// Platform and Browser Data
var tpLoadTimeData = [
    { platform: "Desktop", prevMonth: 1.58, curMonth: 1.49 },
    { platform: "Phone", prevMonth: 2.01, curMonth: 1.96 },
    { platform: "Tablet", prevMonth: 2.16, curMonth: 2.41 },
    { platform: "Other", prevMonth: 2.53, curMonth: 2.65 }
];
var tpSessionData = [
    { platform: "Desktop", sessions: 68379 },
    { platform: "Phone", sessions: 21478 },
    { platform: "Tablet", sessions: 14523 },
    { platform: "Other", sessions: 7520 }
];
var tbLoadTimeData = [
    { platform: "Chrome", prevMonth: 1.68, curMonth: 1.52 },
    { platform: "Firefox", prevMonth: 1.93, curMonth: 1.71 },
    { platform: "Edge", prevMonth: 2.25, curMonth: 2.38 },
    { platform: "Safari", prevMonth: 2.11, curMonth: 2.03 },
    { platform: "Other", prevMonth: 2.56, curMonth: 2.49 },
];
var tbSessionData = [
    { platform: "Chrome", sessions: 34520 },
    { platform: "Firefox", sessions: 29586 },
    { platform: "Edge", sessions: 13793 },
    { platform: "Safari", sessions: 22136 },
    { platform: "Other", sessions: 11865 },
];
var tpPlatformTooltip = "Breakdown of Sessions by Platform";
var piePalette = ["#a8ddb5", "#7bccc4", "#4eb3d3", "#2b8cbe", "#0868ac"];
var chartPalette = ["#2b8cbe", "#0868ac"];

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
    itemsSource: tpLoadTimeData,
    selectionMode: wjChart.SelectionMode.Point
});

var tpPie = new wjChart.FlexPie('#tpPie', {
    header: "Sessions by Platform",
    binding: "sessions",
    bindingName: "platform",
    itemsSource: tpSessionData,
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
    itemsSource: tbLoadTimeData,
    selectionMode: wjChart.SelectionMode.Point
});

var tbPie = new wjChart.FlexPie('#tbPie', {
    header: "Sessions by Browser",
    binding: "sessions",
    bindingName: "platform",
    itemsSource: tbSessionData,
    palette: piePalette
})