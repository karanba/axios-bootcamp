var todoList = [];

// AXIOS Globals
axios.defaults.headers.common['X-Auth-Token'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

function getTodos() {
    axios.get('https://jsonplaceholder.typicode.com/todos', {
        params: {
            _limit: 10
        },
        transformResponse: axios.defaults.transformResponse.concat(function (data) {
            data.forEach(d => {
                d.title = d.title.toUpperCase();
            });

            return data;
        })
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
        .catch(function (error) {});
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

function getDatas() {
    axios.all([
            axios.get('https://jsonplaceholder.typicode.com/users?_limit=5'),
            axios.get('https://jsonplaceholder.typicode.com/posts?_limit=5')
        ])
        .then(axios.spread(function (users, posts) {
            console.log(users.data, posts.data);
        }))
        .catch(function (error) {});
}

document.getElementById('add-todo').addEventListener('click', addTodo);


axios.interceptors.request.use(function (config) {
    console.log('Requesting', config.url, 'at', new Date().getTime());
    return config;
}, function (error) {
    return Promise.resolve(error);
});


function transformResponse() {
    var options = {
        method: 'post',
        url: 'https://jsonplaceholder.typicode.com/todos',
        data: {
            title: 'Hello World'
        },
        transformResponse: axios.defaults.transformResponse.concat(data => {
            data.title = data.title.toUpperCase();
            return data;
        })
    };

    axios(options).then(res => {
        console.dir(res.data);
    });
}

function customHeaders() {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'sometoken'
        }
    };

    axios.post('https://jsonplaceholder.typicode.com/todos', {
            title: document.getElementById('todo-title').value,
            completed: false
        }, config).then(function (response) {
            todoList.push(response.data);
            renderTodos();
        })
        .catch(function (error) {});
}


// Error Handling
function errorHandling() {
    axios.get('https://jsonplaceholder.typicode.com/userss?_limit=5', {
        validateStatus: function (status) {
            return status < 500; // Reject only if status greater or equal to 500
        }
    })
        .then(res => {
            console.dir(res);
        })
        .catch(err => {
            if (err.response) {
                // Server responded with a status other than 200 range
                console.log(err.response.data);
                console.log(err.response.status);
                console.log(err.response.headers);

                if (err.response.status === 404) {
                    //alert('Error: Page Not Found');
                } else if (err.request) {
                    // Request made but there is no response
                    console.log(err.request);
                } else {
                    console.log(err.message);
                }
            }
        });
}


// Cancel Token
function cancelToken() {
    var source = axios.CancelToken.source();
    axios
        .get('https://jsonplaceholder.typicode.com/todos?_limit=5', {
            cancelToken: source.token
        })
        .then(res => {
            console.dir(res);
        })
        .catch(thrown => {
            if (axios.isCancel(
                    thrown)) {
                console.log('Request canceled', thrown.message);
            }
        });

    source.cancel('Request canceled!');
}


// AXIOS Instance
var axiosInstance = axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com'
});

axiosInstance.get('/comments', { timeout: 5 }).then(res => {
    console.log(res);
});

getTodos();
getDatas();
customHeaders();
transformResponse();
errorHandling();
cancelToken();