import * as wjCore from '@grapecity/wijmo';

// Issue number, status, and message information
var issues = [
    { issue: '500 Internal Server Error', status: 'High', message: 'General purpose error: potential server overload' },
    { issue: '400 Bad Request', status: 'High', message: 'Browser error: corrupted request' },
    { issue: '408 Request Time-Out', status: 'High', message: 'Slow response time: check server request' },
    { issue: '403 Forbidden', status: 'Moderate', message: 'Refused access: user attempted to access forbidden directory' },
    { issue: '501 Not Implemented', status: 'Moderate', message: 'Request refused: unsupported browser feature' },
    { issue: '401 Unauthorized', status: 'Low', message: 'Login failed: user does not have access' },
    { issue: '404 Not Found', status: 'Low', message: 'Page not returned: check status of requested page' },
];

// Reported issues by country
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

// Country-related data for map
var countryMapData = [
    { "Country": "United States", "AverageResponseTime": "1.2000", "PageViews": "21.9k", "IssuesReported": "72" },
    { "Country": "Canada", "AverageResponseTime": "1.4250", "PageViews": "12.7k", "IssuesReported": "35" },
    { "Country": "Mexico", "AverageResponseTime": "1.5500", "PageViews": "4.2k", "IssuesReported": "24" },
    { "Country": "Brazil", "AverageResponseTime": "2.6505", "PageViews": "1.3k", "IssuesReported": "7" },
    { "Country": "Peru", "AverageResponseTime": "3.2400", "PageViews": "0.8k", "IssuesReported": "2" },
    { "Country": "United Kingdom", "AverageResponseTime": "1.7500", "PageViews": "7.9k", "IssuesReported": "29" },
    { "Country": "France", "AverageResponseTime": "1.9000", "PageViews": "3.4k", "IssuesReported": "19" },
    { "Country": "Germany", "AverageResponseTime": "2.1000", "PageViews": "5.6k", "IssuesReported": "15" },
    { "Country": "Spain", "AverageResponseTime": "2.2500", "PageViews": "2.3k", "IssuesReported": "9" },
    { "Country": "Italy", "AverageResponseTime": "2.3500", "PageViews": "1.9k", "IssuesReported": "6" },
    { "Country": "Netherlands", "AverageResponseTime": "1.9250", "PageViews": "0.9k", "IssuesReported": "4" },
    { "Country": "Finland", "AverageResponseTime": "2.0150", "PageViews": "1.1k", "IssuesReported": "7" },
    { "Country": "Denmark", "AverageResponseTime": "3.5025", "PageViews": "1.8k", "IssuesReported": "9" },
    { "Country": "Norway", "AverageResponseTime": "2.7500", "PageViews": "2.1k", "IssuesReported": "14" },
    { "Country": "Poland", "AverageResponseTime": "3.4000", "PageViews": "0.3k", "IssuesReported": "3" },
    { "Country": "Russia", "AverageResponseTime": "2.2250", "PageViews": "5.9k", "IssuesReported": "11" },
    { "Country": "Ukraine", "AverageResponseTime": "3.2500", "PageViews": "3.1k", "IssuesReported": "8" },
    { "Country": "China", "AverageResponseTime": "2.7000", "PageViews": "11.3k", "IssuesReported": "18" },
    { "Country": "Japan", "AverageResponseTime": "2.3000", "PageViews": "13.8k", "IssuesReported": "17" },
    { "Country": "Australia", "AverageResponseTime": "3.1000", "PageViews": "2.4k", "IssuesReported": "7" },
];

// Top Country Data
var topCountryData = [
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

var topPlatformLoadTimeData = [
    { platform: "Desktop", prevMonth: 1.58, curMonth: 1.49 },
    { platform: "Phone", prevMonth: 2.01, curMonth: 1.96 },
    { platform: "Tablet", prevMonth: 2.16, curMonth: 2.41 },
    { platform: "Other", prevMonth: 2.53, curMonth: 2.65 }
];

var topPlatformSessionData = [
    { platform: "Desktop", sessions: 68379 },
    { platform: "Phone", sessions: 21478 },
    { platform: "Tablet", sessions: 14523 },
    { platform: "Other", sessions: 7520 }
];

var topBrowserLoadTimeData = [
    { platform: "Chrome", prevMonth: 1.68, curMonth: 1.52 },
    { platform: "Firefox", prevMonth: 1.93, curMonth: 1.71 },
    { platform: "Edge", prevMonth: 2.25, curMonth: 2.38 },
    { platform: "Safari", prevMonth: 2.11, curMonth: 2.03 },
    { platform: "Other", prevMonth: 2.56, curMonth: 2.49 },
];

var topBrowserSessionData = [
    { platform: "Chrome", sessions: 34520 },
    { platform: "Firefox", sessions: 29586 },
    { platform: "Edge", sessions: 13793 },
    { platform: "Safari", sessions: 22136 },
    { platform: "Other", sessions: 11865 },
];

// Returns issues based on country
export function getIssueData(country) {
    var data = [];
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

// Gets platform and browser-related user data
export function getUsersData(country) {
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

// Generates the tooltips for each of the cards
export function generateTooltips() {
    var toolTip = new wjCore.Tooltip();
    toolTip.setTooltip('#activeSession', 'Number of current active sessions.');
    toolTip.setTooltip('#loadTime', 'Current average loadtime of the site.');
    toolTip.setTooltip('#apdex', 'Ratio of tolerating requests to total requests made.');
    toolTip.setTooltip('#bounceRate', 'Percentage of visitors who enter and then leave the site');
    toolTip.setTooltip('#recentUsers', 'Information on the last 200 users from selected country.');
    toolTip.setTooltip('#sessions', 'User sessions breakdown.');
    toolTip.setTooltip('#issuesReported', 'Issues reported by the system.');
    toolTip.setTooltip('#topCountries', 'Displays the top 10 countries by # of sessions.');
    toolTip.setTooltip('#topPlatforms', 'Breakdown of sessions by platform.');
    toolTip.setTooltip('#topBrowsers', 'Breakdown of sessions by browser.');
}

// Returns the country map data
export function getCountryMapData() {
    return countryMapData;
}

// Returns the top country data
export function getTopCountryData() {
    return topCountryData;
}

export function getPlatformData() {
    return [topPlatformLoadTimeData, topPlatformSessionData];
}

export function getBrowserData() {
    return [topBrowserLoadTimeData, topBrowserSessionData];
}