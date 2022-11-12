"use strict";

class TableTemplate {
  static fillIn(id, dict, columnName = undefined) {

    // process the header cells according to dict
    const table = document.getElementById(id);
    const rows = table.rows; // all the rows in the table
    const header = rows[0]; // first row is the header row
    const headerProcessor = new Cs142TemplateProcessor(header.innerHTML); // process header text
    header.innerHTML = headerProcessor.fillIn(dict); // process
    let index;

    // find specified column index
    for (let i = 0; i < header.cells.length; i++) {
      const headerText = header.cells[i].innerHTML;
      if (headerText === columnName) {
        index = i;
      }
    }

    // process the other cells according to dict
    for (let i = 1; i < rows.length; i++) {  // for each row
        let elem;

        // if column name is specified, process the cell under that column 
        if (columnName) {
            elem = rows[i].cells[index];
        } else { 
        // else process cells the whole row
            elem = rows[i];
        }

        const cellProcesor = new Cs142TemplateProcessor(elem.innerHTML); // process
        elem.innerHTML = cellProcesor.fillIn(dict); // ouptut
    }

    // display the table from hidden
    table.style.visibility = "visible";
  }
}
