var todo = [];
var todoList = [];
var status = Boolean(false);

var Tasks = function () {
    this.todo = [];
    this.todoList = [];
    this.status = Boolean(false);
}

Object.defineProperty(Tasks.prototype, 'todo', {
    get: function () {
        return todo;
    },
    set: function (t) {
        todo = t;
    }
});

Object.defineProperty(Tasks.prototype, 'todoList', {
    get: function () {
        return todoList;
    },
    set: function (t) {
        todoList = t;
    }
});

Object.defineProperty(Tasks.prototype, 'status', {
    get: function () {
        return status;
    },
    set: function (s) {
        status = Boolean(s);
    }
});

var tasks = new Tasks();

console.log(tasks.todo);

highlight();
filterListEvent();

function getTodoList() {
    return tasks.todoList;
}

/**
 * Set list using the filter
 * @param {Array} todo
 * @param {boolean} filter 
 */
function setTodoList(filter) {
    if (todo.length > 0) {

        if (Boolean(filter) === true) {
            tasks.todoList = tasks.todo.filter(function (t) {
                return t.done === true;
            });
        } else {
            tasks.todoList = tasks.todo.filter(function (t) {
                return t.done === false;
            });
        }
    }

}


/**
 * Loads list
 */
function loadList() {
    var lists = document.getElementById("taskList");
    lists.innerHTML = '';

    if (getTodoList().length > 0) {
        getTodoList().map(function (todo) {
            lists.appendChild(newItemtemplate(todo.title, todo.id));
        });
    }
}

/**
 * Filter by title
 * @param {string} title 
 */
function filterByTitle(title) {
    var lists = document.getElementById("taskList");
    lists.innerHTML = '';

    if (getTodoList().length > 0) {
        tasks.todoList = getTodoList().filter(function (todo) {;
            return todo.title.toLocaleLowerCase().includes(title)
        })
        loadList();
    }
}


function filterListEvent() {
    var filter = document.querySelector('#filter');

    filter.onkeyup = function (e) {
        var title = e.target.value;

        if(tasks.status === 'false') {
            setTodoList(false);
        } else {
            setTodoList(true);
        }

        if (title !== '') {
            filterByTitle(title);

        } else {
            loadList();
        }


    };
}

/**
 * Active link
*/
function highlight() {
    var filter = document.querySelector(".task-filter");
    var btns = filter.querySelectorAll(".task-filter button");
    for (var i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", function () {
            var current = document.getElementsByClassName("active");


            current[0].className = current[0].className.replace(" active", "");
            this.className += " active";
            var text = current[0].textContent;
            var filter = document.querySelector('#filter');


            if (text === 'active') {
                tasks.status = false;
                setTodoList(false);
                loadList();
            } else {
                tasks.status = true;
                setTodoList(true);
                loadList();
            }
            filter.value = '';
        });
    }
}


/**
 * Add a task to array
*/
function addTask() {

    var newTask = document.getElementById("newTask");
    var lists = document.getElementById("taskList");
    var value = newTask.value.trim();

    if (value === '') return;

    var id = uuid();

    var listItem = newItemtemplate(value, id);


    tasks.todo.push({
        id: id,
        title: value,
        done: false
    });

    if(tasks.status === 'false') {
        lists.appendChild(listItem);
    }

    newTask.value = '';
}

/**
 * Mark tasks as done
 * @param {HTMLElement} element 
*/
function completed(element) {

    var task = element.currentTarget.parentNode.parentNode;
    var taskID = task.getAttribute('data-id');

    var index = findIndexByID(todo, taskID);

    /**
     * If 'done = false' then change to 'done = true'
    */
    if (index !== -1) {
        if (!tasks.todo[index].done) {
            var taskLsit = document.querySelector('#taskList');
            tasks.todo[index].done = !tasks.todo[index].done;
            taskLsit.removeChild(task);

        } else {
            tasks.todo[index].done = !tasks.todo[index].done;
        }
    } else {
        alert('Elemento não encontrado.');
    }

}

/**
 * Delete task from list
 * @param {HTMLElement} element 
*/
function remove(element) {

    var taskLsit = document.querySelector('#taskList');
    var task = element.currentTarget.parentNode.parentNode;
    var index = findIndexByID(tasks.todo);

    tasks.todo.splice(index, 1);
    taskLsit.removeChild(task)
}


/**
 * New item template
 * @param {string} value 
 * @param {string} id
*/
function newItemtemplate(value, id) {

    var listItem = document.createElement("li");
    listItem.setAttribute('class', 'task-list-item');
    listItem.setAttribute('data-id', id);

    listItem.innerHTML = '<label>' + value + '</label>' +
        '<div class="task-list-item__space"></div>' +
        '<div class="task btn-group">' +
        '<button onclick="completed(event)" class="task btn-check">' +
        '<i class="material-icons">check</i>' +
        '</button>' +
        '<button onclick="remove(event)" class="task btn-clear">' +
        '<i class="material-icons">clear</i>' +
        '</button>' +
        '</div>'

    return listItem;
}

/**
 * Return index value
 * @param {Array} todo 
 * @param {string} taskID
 */
function findIndexByID(todo, taskID) {

    var k = 0;
    var index = -1;

    while (k < todo.length) {

        if (todo[k].id === taskID) {
            index = k;
            break;
        } else {
            k++;
        }

    }

    return index;
}

/**
 * Generator ID
 */
function uuid() {
    return 'xxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 32 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(32);
    });
}