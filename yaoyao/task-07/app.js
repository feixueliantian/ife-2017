var table = function () {
  var $el = document.createElement('table');

  function render() {
    $el.border = 1;
    document.body.appendChild($el);
  }

  return {
    $el,
    render
  };
}();

var tHead = function (table) {
  var $el = table.$el.createTHead(),
      row = $el.insertRow(),
      cell = null;

  function render(fields) {
    fields.forEach(function (field) {
      cell = document.createElement('th');
      if (field.sortable) {
        cell.innerHTML = `${field.label} <span class="up-btn" data-by="${field.name}"></span><span class="down-btn" data-by="${field.name}"></span>`;
      } else {
        cell.innerHTML = `${field.label}`;
      }
      row.appendChild(cell);
    });
  }

  return {
    $el,
    render
  };
}(table);

var tBody = function (table) {
  var $el = table.$el.createTBody(),
      row = null,
      cell = null;

  function render(students) {
    $el.innerHTML = '';
    students.forEach(function (student) {
      row = $el.insertRow();
      for(var key in student) {
        cell = row.insertCell();
        cell.textContent = student[key];
      }
    });
  }

  return {
    $el,
    render
  };
}(table);

var ajax = function (url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'json';
  xhr.onload = function () {
    callback(xhr.response);
  };
  xhr.open('GET', url);
  xhr.send(null);
};

var app = function (table, tHead, tBody, ajax) {
  var fields = [],
      students = [];

  function by(course, direction) {
    return function (a, b) {
      if (direction === 'asc') {
        return a[course] - b[course];
      }
      if (direction === 'desc') {
        return b[course] - a[course];
      }
    }
  }

  function sort(event) {
    var target = event.target,
        course;

    if (target.classList.contains('up-btn')) {
      course = target.dataset.by;
      students.sort(by(course, 'asc'));
    } else if (target.classList.contains('down-btn')) {
      course = target.dataset.by;
      students.sort(by(course, 'desc'));
    }
  }

  function init() {
    table.render();
    ajax('fields.json', function (response) {
      fields = response;
      tHead.render(fields);
      tHead.$el.addEventListener('click', function (event) {
        sort(event);
        tBody.render(students);
      });
    });
    ajax('students.json', function (response) {
      students = response;
      tBody.render(students);
    });
  }

  return {
    init
  };
}(table, tHead, tBody, ajax);

app.init();
