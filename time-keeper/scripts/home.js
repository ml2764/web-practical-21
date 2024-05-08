import { getEvents, getGoals, isReturningUser, hasGoals, hasEvents, 
         getDateWithoutTime, MS_IN_HOUR, getTimeDifference, 
         removeChildNodes, getUser } from "./lib.js";

/**
 * The file contains functionality related only to the home page.
 */
const events = getEvents();
const goals = getGoals();
const goalMap = new Map();
const greeting = document.getElementById("greeting");
const contentArea = document.getElementById("contents");

/**
 * An object storing information about progress on a task
 * @param {string} activityName The activity name
 * @param {number} targetMinutes The number of minutes set as a goal
 * @param {number} minutesTracked The number of minutes tracked
 */
function Progress(activityName, targetMinutes, minutesTracked) {
    this.activityName = activityName;
    this.targetMinutes = targetMinutes;
    this.minutesTracked = minutesTracked;
    this.rate = function() {
        return this.minutesTracked / this.targetMinutes;
    }
}


const setupGoalMap = goalMap => {
    for (let goal of goals) {
        goalMap.set(goal.name, new Progress(goal.name, goal.duration, 0));
    }
}

const newUser = () => {
    greeting.innerHTML = '<h1 class="display-1">Hello, Stranger!</h1><p class="lead">It looks like this is your first time here. <a href="settings.html">Set your goals to start tracking.</a>.</p>';
}

const noGoals = () => {
    contentArea.classList.add("border-0");
    contentArea.innerHTML = '<p class="lead">It looks like you don\'t have any saved goals. <a href="settings.html">Set your goals to start tracking.</a>.</p>'
}

const noEvents = () => {
    contentArea.classList.add("border-0");
    contentArea.innerHTML = '<p class="lead">It looks like you haven\'t tracked any time yet. <a href="track.html">Go to tracking to see your progress toward your goals.</a>.</p>'
}

const isSameDate = (d1, d2) => {
    return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear() 
}

/**
 * Converts an object representing a duration to minutes. 
 * @param {Object} duration An object with properties hours, mins, and secs
 * @returns {number} The duration in mins, a float
 */
const convertDurationToMins = duration => {
    return duration.hours * 60 + duration.mins + duration.secs / 60;
}

/**
 * Calculates progress toward the daily goal for each tracked activity
 * @param {Date} date The date to summarise
 * @returns {Progress[]} An array of Progress objects sorted by rate in descending order (best progress first)
 */
const progressOnDate = (date) => {
    setupGoalMap(goalMap);
    // Get the events on the date
    const eventsOnDate = getEventDurationOnDate(date);
    // Group the mapped events by goal and sum the durations
    for (let event of eventsOnDate) {
        const progress = goalMap.get(event.activityName);
        progress.minutesTracked += event.duration;
        goalMap.set(event.activityName, progress);
    }
    const sortedProgress = Array.from(goalMap.values()).sort((a, b) => {
        const aRate = a.rate();
        const bRate = b.rate();
        if (aRate > bRate) {
            return -1;
        } else if (aRate < bRate) {
            return 1;
        }
        return 0;
    });
    return sortedProgress;
}

/**
 * Filters the saved events to those that took place on the given date and converts each event's duration to minutes.
 * @param {Date} date 
 * @returns {Object[]} An array of objects with properties activityName and duration (in minutes)
 */
const getEventDurationOnDate = date => {
    const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
    const eventsOnDate = events.filter(e => isSameDate(date, new Date(e.startTime) || isSameDate(date, new Date(e.endTime))))
                                .map(e => {
                                    const startTime = new Date(e.startTime);
                                    const sameStart = isSameDate(date, startTime);
                                    const endTime = new Date(e.endTime);
                                    const sameEnd = isSameDate(date, endTime);
                                    let diff;
                                    if (sameStart && sameEnd) {
                                        diff = getTimeDifference(startTime, endTime);
                                    }
                                    else if (sameStart && !sameEnd) {
                                        diff = getTimeDifference(startTime, endOfDay);
                                    }
                                    else {
                                        diff = getTimeDifference(date, endTime);
                                    }
                                    return ({
                                        activityName: e.activityName,
                                        duration: convertDurationToMins(diff)
                                    })
                                });
    return eventsOnDate;
}

const getProgressSummary = sortedProgress => {
    const achieved = sortedProgress.filter(p => p.rate() >= 1);
    const attempted = sortedProgress.filter(p => p.rate() > 0 && p.rate() < 1);
    const notAttempted = sortedProgress.filter(p => p.minutesTracked === 0);
    let summary = "";
    if (achieved.length > 0) {
        summary += `You have met your goals on ${achieved.length} activities. `
    }
    if (attempted.length > 0) {
        summary += `You tracked progress but did not achieve your goals on ${attempted.length} activites. `;
    }
    if (notAttempted.length > 0) {
        summary += `You didn't track any progress on ${notAttempted.length} activities.`;
    }
    return summary;
}

/**
 * Creates a d3 bar chart showing progress on goals as percentage of target time.
 * @param {Progress[]} sortedProgress An array of Progress objects
 * @returns {Element} An svg bar chart that can be added to the DOM
 */
const getProgressChart = sortedProgress => {
    // Get the highest progress rate
    const maxRate = d3.max(sortedProgress.map(d => d.rate() * 100));
    const progressToGoals = BarChart(sortedProgress, {
        x: d => d.activityName,
        y: d => d.rate() * 100, 
        yLabel: "% of goal achieved",
        yDomain: [0, Math.max(100, maxRate)],
        color: "#0dcaf0" // The bootstrap info colour
    });
    return progressToGoals;
}

/**
 * Creates a d3 pie chart showing how tracked was spent.
 * @param {Progress[]} sortedProgress An array of Progress objects
 * @returns {Element} An svg pie chart that can be added to the DOM
 */
const getMinutesTrackedPie = sortedProgress => {
    const refinedProgress = sortedProgress.filter(event => event.minutesTracked > 0);
    const minutesTracked = PieChart(refinedProgress, {
        name: d => d.activityName,
        value: d => d.minutesTracked,
        width: 300,
        height: 300
    });
    return minutesTracked;
}

/**
 * Populates a slide in the carousel with information about tracked time
 * @param {Date} date The date of the events
 * @param {string} id The id attribute of the slide
 */
const showProgressOnDate = (date, id) => {
    const sortedProgress = progressOnDate(date);
    const element = document.getElementById(id);
    removeChildNodes(id);
    
    element.innerHTML = `<p>${getProgressSummary(sortedProgress)}</p>`;

    element.appendChild(getProgressChart(sortedProgress));
    element.innerHTML += `<p>You spent ${sortedProgress.reduce((sum, event) => sum + event.minutesTracked, 0)} minutes working toward your goals.</p>`;

    element.appendChild(getMinutesTrackedPie(sortedProgress));
}

/** On page load */
if (isReturningUser()) {
    greeting.innerText = `Hello, ${getUser()}`;
}

if (hasGoals()) {
    // Track events
    if (hasEvents()) {
        const today = getDateWithoutTime(new Date());
        const yesterday = getDateWithoutTime(new Date(today - MS_IN_HOUR * 24));
        showProgressOnDate(today, "today-progress");
        showProgressOnDate(yesterday, "yesterday-progress");
    } else {
        noEvents();
    }
} else {
    noGoals();
}

/** The following function is copied from the D3 documentation */
// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/bar-chart
function BarChart(data, {
    x = (d, i) => i, // given d in data, returns the (ordinal) x-value
    y = d => d, // given d in data, returns the (quantitative) y-value
    title, // given d in data, returns the title text
    marginTop = 20, // the top margin, in pixels
    marginRight = 0, // the right margin, in pixels
    marginBottom = 30, // the bottom margin, in pixels
    marginLeft = 40, // the left margin, in pixels
    width = 640, // the outer width of the chart, in pixels
    height = 400, // the outer height of the chart, in pixels
    xDomain, // an array of (ordinal) x-values
    xRange = [marginLeft, width - marginRight], // [left, right]
    yType = d3.scaleLinear, // y-scale type
    yDomain, // [ymin, ymax]
    yRange = [height - marginBottom, marginTop], // [bottom, top]
    xPadding = 0.1, // amount of x-range to reserve to separate bars
    yFormat, // a format specifier string for the y-axis
    yLabel, // a label for the y-axis
    color = "currentColor" // bar fill color
  } = {}) {
    // Compute values.
    const X = d3.map(data, x);
    const Y = d3.map(data, y);
  
    // Compute default domains, and unique the x-domain.
    if (xDomain === undefined) xDomain = X;
    if (yDomain === undefined) yDomain = [0, d3.max(Y)];
    xDomain = new d3.InternSet(xDomain);
  
    // Omit any data not present in the x-domain.
    const I = d3.range(X.length).filter(i => xDomain.has(X[i]));
  
    // Construct scales, axes, and formats.
    const xScale = d3.scaleBand(xDomain, xRange).padding(xPadding);
    const yScale = yType(yDomain, yRange);
    const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
    const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat);
  
    // Compute titles.
    if (title === undefined) {
      const formatValue = yScale.tickFormat(100, yFormat);
      title = i => `${X[i]}\n${formatValue(Y[i])}`;
    } else {
      const O = d3.map(data, d => d);
      const T = title;
      title = i => T(O[i], i, data);
    }
  
    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
  
    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(yAxis)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2", width - marginLeft - marginRight)
            .attr("stroke-opacity", 0.1))
        .call(g => g.append("text")
            .attr("x", -marginLeft)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text(yLabel));
  
    const bar = svg.append("g")
        .attr("fill", color)
      .selectAll("rect")
      .data(I)
      .join("rect")
        .attr("x", i => xScale(X[i]))
        .attr("y", i => yScale(Y[i]))
        .attr("height", i => yScale(0) - yScale(Y[i]))
        .attr("width", xScale.bandwidth());
  
    if (title) bar.append("title")
        .text(title);
  
    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(xAxis);
  
    return svg.node();
  }

// The following code is copied from the D3 documentation
// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/pie-chart
function PieChart(data, {
    name = ([x]) => x,  // given d in data, returns the (ordinal) label
    value = ([, y]) => y, // given d in data, returns the (quantitative) value
    title, // given d in data, returns the title text
    width = 640, // outer width, in pixels
    height = 400, // outer height, in pixels
    innerRadius = 0, // inner radius of pie, in pixels (non-zero for donut)
    outerRadius = Math.min(width, height) / 2, // outer radius of pie, in pixels
    labelRadius = (innerRadius * 0.2 + outerRadius * 0.8), // center radius of labels
    format = ",", // a format specifier for values (in the label)
    names, // array of names (the domain of the color scale)
    colors, // array of colors for names
    stroke = innerRadius > 0 ? "none" : "white", // stroke separating widths
    strokeWidth = 1, // width of stroke separating wedges
    strokeLinejoin = "round", // line join of stroke separating wedges
    padAngle = stroke === "none" ? 1 / outerRadius : 0, // angular separation between wedges
  } = {}) {
    // Compute values.
    const N = d3.map(data, name);
    const V = d3.map(data, value);
    const I = d3.range(N.length).filter(i => !isNaN(V[i]));
  
    // Unique the names.
    if (names === undefined) names = N;
    names = new d3.InternSet(names);
  
    // Chose a default color scheme based on cardinality.
    if (colors === undefined) colors = d3.schemeSpectral[names.size];
    if (colors === undefined) colors = d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), names.size);
  
    // Construct scales.
    const color = d3.scaleOrdinal(names, colors);
  
    // Compute titles.
    if (title === undefined) {
      const formatValue = d3.format(format);
      title = i => `${N[i]}\n${formatValue(V[i])}`;
    } else {
      const O = d3.map(data, d => d);
      const T = title;
      title = i => T(O[i], i, data);
    }
  
    // Construct arcs.
    const arcs = d3.pie().padAngle(padAngle).sort(null).value(i => V[i])(I);
    const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
    const arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);
    
    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
  
    svg.append("g")
        .attr("stroke", stroke)
        .attr("stroke-width", strokeWidth)
        .attr("stroke-linejoin", strokeLinejoin)
      .selectAll("path")
      .data(arcs)
      .join("path")
        .attr("fill", d => color(N[d.data]))
        .attr("d", arc)
      .append("title")
        .text(d => title(d.data));
  
    svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "middle")
      .selectAll("text")
      .data(arcs)
      .join("text")
        .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
      .selectAll("tspan")
      .data(d => {
        const lines = `${title(d.data)}`.split(/\n/);
        return (d.endAngle - d.startAngle) > 0.25 ? lines : lines.slice(0, 1);
      })
      .join("tspan")
        .attr("x", 0)
        .attr("y", (_, i) => `${i * 1.1}em`)
        .attr("font-weight", (_, i) => i ? null : "bold")
        .text(d => d);
  
    return Object.assign(svg.node(), {scales: {color}});
  }