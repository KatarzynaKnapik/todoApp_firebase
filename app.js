const todos = document.querySelector('.todos');
const form = document.querySelector('#add-new-todo');

function renderList(doc){
    let li = document.createElement('li');
    let todo = document.createElement('span');
    let del = document.createElement('div');

    li.setAttribute('data_id', doc.id);
    todo.textContent = doc.data().todo;
    del.textContent = 'x';

    li.appendChild(todo);
    li.appendChild(del);

    todos.appendChild(li);

    del.addEventListener('click', e =>{
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data_id');
        db.collection('todos').doc(id).delete();
    })
}

form.addEventListener('submit', (e) =>{
    e.preventDefault();
    db.collection('todos').add({
        todo: form.todo.value
    })

    form.todo.value = '';
})

db.collection('todos').onSnapshot(snapshot =>{
    let changes = snapshot.docChanges();
    changes.forEach(change =>{
        if(change.type == 'added'){
            renderList(change.doc);
        }else if(change.type == 'removed'){
            let li = todos.querySelector('[data_id=' + change.doc.id + ']');
            todos.removeChild(li);
        }
    })
})