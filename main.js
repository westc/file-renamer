function displayPath(entry) {
  chrome.fileSystem.getDisplayPath(entry, function(path) {
    console.log('path =', path);
  })
}

(function(_, g, u) {
  typeOf = function(o, p) {
    o = o === g
      ? "global"
      : o == u
        ? o === u
          ? "undefined"
          : "null"
        : _.toString.call(o).slice(8, -1);
    return p ? p === o : o;
  };
})({}, this);

function bindElements() {
  btnDir.onclick = chooseDirectory;
}

function chooseDirectory() {
  chrome.fileSystem.chooseEntry({ type: 'openDirectory' }, function(dirEntry) {
    if (dirEntry) {
      chrome.fileSystem.getDisplayPath(dirEntry, function(path) {
        txtDir.value = path;
      });
      window.dirEntry = dirEntry;

      clearLineItems();

      dirEntry.createReader().readEntries(function(arrEntries) {
        arrEntries.sort(function(a, b) {
          return a.isDirectory == b.isDirectory
            ? a.name < b.name
              ? -1
              : 1
            : a.isFile - b.isFile;
        }).forEach(addLineItem);
      });
    }
  });
}

function clearLineItems() {
  for (var i = tblFiles.rows.length; --i;) {
    tblFiles.deleteRow(i);
  }
}

function addLineItem(entry) {
  var tr = tblFiles.insertRow(tblFiles.rows.length);
  tr.className = entry.isFile ? 'file' : 'dir';
  tr.entry = entry;
  
  var td = tr.insertCell(0);
  td.className = 'current-name';
  td.textContent = entry.name;

  var input = document.createElement('input');
  input.type = 'text';
  input.value = entry.name;
  input.className = 'width-100';
  input.onfocus = function() { addClass('selected', tr); };
  input.onblur = function() { removeClass('selected', tr); };
  
  td = tr.insertCell(1);
  td.className = 'new-name';
  td.appendChild(input);
}

function removeClass(className, elem) {
  elem.className = (' ' + elem.className + ' ').split(' ' + className + ' ').join(' ').trim();
}

function addClass(className, elem) {
  elem.className = (elem.className + ' ' + className).trim();
}

window.onload = function() {
  bindElements();
};