"use strict";

class DatePicker {

  constructor(id, callback) {
    this.id = id; // element id
    this.callback = callback; // date selector
  }

  render(date) {
    const parent = document.getElementById(this.id);
    parent.appendChild(this.getCalendarTable(date)); // add the rendered calendar using date
  }

  // Generate rendered calendar
  getCalendarTable(date) {
    const table = document.createElement("table");
    table.appendChild(this.getMonthYearHeader(table, date)); // add month and year header
    table.appendChild(this.getWeekHeader()); // add Week header
    this.generateDaysContent(table, date); // add day cells
    return table; // return rendered table
  }

  // create month and year header
  getMonthYearHeader(table, date) {
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

    // "month year" cell
    const row = document.createElement("tr");
    row.className = "calendar-header";
    const middle = row.insertCell(0);
    const jsObj = this.parseDate(date);
    middle.innerHTML = months[jsObj.month - 1] + " " + jsObj.year;
    middle.colSpan = "5"; // set colspan to occupy 5 columns

    // "<" cell button
    const left = row.insertCell(0);
    left.innerHTML = "<";
    left.onclick = () => this.handleArrow(table, date);
    
    // ">" cell button
    const right = row.insertCell(-1);
    right.innerHTML = ">";
    right.onclick = () => this.handleArrow(table, date, true);

    // construct month year header
    return row;
  }

  handleArrow(table, date, rightArrow=false) {
    table.remove();
    date.setMonth(rightArrow ? date.getMonth()+1 : date.getMonth()-1);
    this.render(date); // render the calendar again
  }

  fillPreDays(row, date) {
    this.fillPreDays = this.fillPreDays.bind(this); // get rid of eslint error

    // the weekday of first day of a month
    const weekdayIndex = new Date(date.getFullYear(), date.getMonth(),1).getDay();

    // total days of previous month
    const preMonthTotalDays = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
    
    // insert the days of previous month into row starting from 'Sun'
    for (let i = 0; i < weekdayIndex; i++) {
      const cell = row.insertCell(0);
      cell.innerHTML = preMonthTotalDays - i;
      cell.className = "pre-month-cell";
    }

    // return number of days added from previous month
    return weekdayIndex; 
  }

  generateDaysContent(table, date) {
    // fill previous days of previous month, if any
    let row = table.insertRow(-1); // insert new row into table
    const preMonthDays = this.fillPreDays(row, date);
    const currMonthDays = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    // fill current month's days
    for (let day = 1; day < currMonthDays + 1; day++) {
      // insert day cell at the end
      const cell = row.insertCell(-1);
      cell.innerHTML = day;
      cell.className = "curr-month-cell";

      // event handler for each clicked cell
      cell.onclick = () => {
        date.setDate(day); // set the clicked date
        this.callback(table.parentNode.id, this.parseDate(date));
      };

      // if reach the end of week, but not the last day of the month
      if ( ((preMonthDays + day) % 7 === 0) && (day !== currMonthDays) ) {
        row = table.insertRow(-1); // add new row for next week
      }
    }

    // fill next month's days in cells after current month, if any
    const postDays = 7 - ((preMonthDays + currMonthDays) % 7);
    if (postDays !== 7) { // filling a whole extra week is not allowed
      for (let postDay = 1; postDay < postDays + 1; postDay++) {
        const cell = row.insertCell(-1);
        cell.innerHTML = postDay;
        cell.className = "post-month-cell";
      }
    }
  }

  // create a js object from Date object
  parseDate(date) {
    this.parseDate = this.parseDate.bind(this); // get rid of eslint error

    return {
      month: date.getMonth() + 1,
      day: date.getDate(),
      year: date.getFullYear(),
    };
  }

  // Create calendar Week header
  getWeekHeader() {
    this.getWeekHeader = this.getWeekHeader.bind(this); // get rid of eslint error

    // week row
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const row = document.createElement("tr");

    // loop for adding weekday headers
    weekdays.forEach((day) => {
      const cell = row.insertCell(-1);
      cell.innerHTML = day;
    });

    row.className = "calendar-header";
    return row;
  }

} // end of DatePicker class