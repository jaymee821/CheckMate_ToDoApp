window.addEventListener('load', () => {
    todos = JSON.parse(localStorage.getItem('todos')) || [];
    const nameInput  = document.querySelector('#name');
    const newTodoForm = document.querySelector('#new-todo-form');
    const warningMessage = document.getElementById('warning-message');

    const username = localStorage.getItem('username') || '';

    nameInput.value = username;

    nameInput.addEventListener('change', e => {
        localStorage.setItem('username', e.target.value);
    })

    newTodoForm.addEventListener('submit', e => {
        e.preventDefault();

        const contentValue = e.target.elements.content.value.trim();
        const categoryValue = e.target.elements.category.value;

        if (contentValue === '' || categoryValue === '') {
            warningMessage.classList.remove('hidden');
            return; // Stop form submission if the content is empty
        }

        const todo = {
            content: contentValue,
            category: e.target.elements.category.value,
            done: false,
            createdAt: new Date().getTime()
        };

        todos.push(todo);
        localStorage.setItem('todos', JSON.stringify(todos));
        e.target.reset();
        warningMessage.classList.add('hidden'); // Hide warning after successful addition
        DisplayTodos();
    });

    DisplayTodos();
})

function DisplayTodos() {
    const todoList = document.querySelector('#todo-list');

    todoList.innerHTML = '';

    if (todos.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = "No tasks for now, take it easy!";
        emptyMessage.classList.add('empty-message');
        todoList.appendChild(emptyMessage);
    
        const image = document.createElement('img');
        image.src = 'img/relax.png'; // Make sure this path is correct
        image.alt = 'Relaxing image'; // Optional: describe the image
        image.classList.add('empty-message-image'); // Add a class for styling if needed
        
        todoList.appendChild(image); // Append the image to the todoList
    
        return;
    }    
    
    // Sort todos by createdAt in descending order
    todos.sort((a, b) => b.createdAt - a.createdAt);

    let allDone = true;

    todos.forEach(todo => {

        if (!todo.done) {
            allDone = false;
        }

        const todoItem = document.createElement('div');
        todoItem.classList.add('todo-item')

        const label = document.createElement('label');
        const input = document.createElement('input');
        const span = document.createElement('span');
        const content = document.createElement('div');
        const actions = document.createElement('div');
        const edit = document.createElement('button');
        const deleteButton  = document.createElement('button');

        input.type = 'checkbox';
        input.checked = todo.done;
        span.classList.add('bubble');

        if (todo.category == 'personal') {
            span.classList.add('personal');
        } else {
            span.classList.add('work');
        }

        content.classList.add('todo-content');
        actions.classList.add('actions');
        edit.classList.add('edit');
        deleteButton.classList.add('delete');

        content.innerHTML = `<input type="text" value="${todo.content}" readonly>`;
        edit.innerHTML = '<i class="fas fa-edit"></i> Edit';
        deleteButton.innerHTML = '<i class="fas fa-trash"></i> Delete';

        label.appendChild(input);
        label.appendChild(span);
        actions.appendChild(edit);
        actions.appendChild(deleteButton);
        todoItem.appendChild(label);
        todoItem.appendChild(content);
        todoItem.appendChild(actions);

        todoList.appendChild(todoItem);

        if (todo.done) {
            todoItem.classList.add('done');
        }

        input.addEventListener('click', e => {
            todo.done = e.target.checked;
            localStorage.setItem('todos', JSON.stringify(todos));

            if (todo.done) {
                todoItem.classList.add('done');
            } else {
                todoItem.classList.remove('done');
            }

            DisplayTodos();
        })

        edit.addEventListener('click', e => {
            const input = content.querySelector('input');
            input.removeAttribute('readonly');
            input.focus();
            input.addEventListener('blur', e => {
                input.setAttribute('readonly', true);
                todo.content = e.target.value;
                localStorage.setItem('todos', JSON.stringify(todos));
                DisplayTodos();
            })
        })

        deleteButton.addEventListener('click', e => {
            openDeleteConfirmationModal(() => {
                todos = todos.filter(t => t !== todo);
                localStorage.setItem('todos', JSON.stringify(todos));
                DisplayTodos();
            })   
        })
    })

    if (allDone) {
        const emptyMessage1 = document.createElement('p');
        emptyMessage1.textContent = "All clear for today! Free time ahead!";
        emptyMessage1.classList.add('empty-message1');
        todoList.appendChild(emptyMessage1);
        // Insert the message at the top of the list
        todoList.insertBefore(emptyMessage1, todoList.firstChild);
    }
}

function openDeleteConfirmationModal(onConfirm) {
    const modal = document.getElementById('delete-confirmation-modal');
    const confirmDeleteButton = document.getElementById('confirm-delete');
    const cancelDeleteButton = document.getElementById('cancel-delete');

    modal.classList.remove('hidden');

    confirmDeleteButton.onclick = () => {
        onConfirm();
        closeDeleteConfirmationModal();
    };

    cancelDeleteButton.onclick = closeDeleteConfirmationModal;

    function closeDeleteConfirmationModal() {
        modal.classList.add('hidden');
        confirmDeleteButton.onclick = null;
        cancelDeleteButton.onclick = null;
    }
}