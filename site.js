var todoList = [];

function getTodos() {
    axios.get('https://jsonplaceholder.typicode.com/todos', {
        params: {
            _limit: 10
        }
    }).then(function (response) {
        todoList = response.data;
        renderTodos()
    }).catch(function (error) {
        console.log(error);
    });
}


function renderTodos() {
    var todoListHtml = '';
    todoList.forEach(function (todo) {
        var isChecked = todo.completed ? 'checked' : '';
        todoListHtml +=
            '<li class="list-group-item d-flex">' +
            '<input data-id="' + todo.id + '" class="form-check-input me-2" type="checkbox" value="" ' + isChecked + '>' +
            todo.title +
            '<button class="btn btn-danger btn-sm ms-auto" onclick="removeTodo(' + todo.id + ')"><span class="bi bi-trash" /></button>' +
            '</li>';
    });
    document.getElementById('todo-list').innerHTML = todoListHtml;
    document.querySelectorAll('.form-check-input')
        .forEach(el => {
            el.addEventListener('click', function (e) {
                updateTodo(e.target.dataset.id, e.target.checked);
            });
        });
}


function addTodo() {
    axios.post('https://jsonplaceholder.typicode.com/todos', {
            title: document.getElementById('todo-title').value,
            completed: false
        }).then(function (response) {
            todoList.push(response.data);
            renderTodos();
        })
        .catch(function (error) {});;
}

function updateTodo(id, isCompeleted) {
    axios.patch('https://jsonplaceholder.typicode.com/todos/' + id, {
            completed: isCompeleted
        })
        .then(function (response) {
            var index = todoList.findIndex(todo => todo.id === id);
            if (index > -1) {
                todoList[index].completed = isCompeleted;
                renderTodos();
            }
        })
        .catch(function (error) {});
}

function removeTodo(id) {
    axios.delete('https://jsonplaceholder.typicode.com/todos/' + id)
        .then(function (response) {
            var index = todoList.findIndex(todo => todo.id === id);
            if (index > -1) {
                todoList.splice(index, 1);
            }
            renderTodos();
        })
        .catch(function (error) {});
}

document.getElementById('add-todo').addEventListener('click', addTodo);

getTodos();