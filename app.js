
const BASE_URL = 'https://628d3321a3fd714fd040dac4.mockapi.io/todo'

let todosArray = [];


function goToTodoPage(id, name) { 
//  parametri url: www.pippo.it/nome pagina?K(ey)=V(alue)&K=V
  let urlString = "/todo.html";
  if (id && name) { 
//  se c'è un id (tipo in funzione edit), porto in nuova pagina in cui passo lo stesso id
    urlString = urlString + 
                '?id=' + 
                id;
  }
  window.location.href = urlString;
} 

// function goToToDoPage2(todo) {
//   let urlString = "/todo.html";
//   if (todo) {  
//     const todoString = JSON.stringify(todo);
//     sessionStorage.setItem('selectedToDo', todoString);  // voglio salver todo in session sotrage, 
    //                                                      lo salvo quindi come key(che imposto al momeneto come stringa), seguita dalla value (in stringa)
//   }
//   window.location.href = urlString;
// }

function populateTagContainer(container, tags){
  for (const tag of tags) {
    const span = document.createElement('span');
    span.classList.add('chip');
    const node = document.createTextNode('#' + tag);
    span.appendChild(node);
    container.appendChild(span)
  }
}


function createTodoCard(todo){

  const cardTemplate = `
      <span class="todo-name">#NAME</span>
      <div class="tag-container"></div>
      <span>#CREATIONDATE</span>
      <div class="divider"></div>
      <div class="buttons-container">
        <button class="delete-button"><img width="20px" src="./assets/delete.svg" alt=""></button>
        <button class="edit-button"><img width="20px" src="./assets/edit.svg" alt=""></button>
        <button class="done-button"><img width="20px" src="./assets/check.svg" alt=""></button>
        </div>`
  
  
  //const humanDate = new Date(todo.creationDate * 1000)
  const todoHtml = cardTemplate.replace('#NAME', todo.name)
                               .replace('#CREATIONDATE', todo.creationDate.toLocaleString())

  return todoHtml;
}

function startLoading(){
  const loader = document.getElementById('loader')
  loader.style.display = 'inline-block'
  const refresh = document.getElementById('refresh-button');
  refresh.style.display = 'none';
}

function stopLoading() {
  const loader = document.getElementById('loader')
  loader.style.display = 'none'
  const refresh = document.getElementById('refresh-button');
  refresh.style.display = 'inline-block';
}

function filterTodos(t1, t2){
  return t1.id !== t2.id;
}

function removeTodoAndRefesh(todo){
  stopLoading()
  todosArray = todosArray.filter(t1 => filterTodos(t1, todo))
  displayTodos(todosArray);
}

function deleteTodo(id){
  startLoading()
  const deleteUrl = BASE_URL + '/' + id;
  const fetchOptions = {method: 'delete'};
  fetch(deleteUrl, fetchOptions)
  .then(response => response.json())
  .then(result => removeTodoAndRefesh(result))
  .catch(error => stopLoading())
} 

function requestConfirmToDelete(id) {
  if(confirm('sicuro?')){ 
    deleteTodo(id);
  } else { 
    alert('pheww');
  } 
} 

function toDoDone(todo) {
  console.log('done', todo); 
  todo.doneDate = new Date().getTime() / 1000; //  prendo la data di oggi, in millisecondi
  console.log('todo', todo);
  todo.priority = Todo.PRIORITY.done; //  imposto la priorità del nuovo todo come "done", ossia -1
  const dbObj = todo.toDbObj(); //  mi prendo obj todo da model
  const dbObjJson = JSON.stringify(dbObj);  //  trasformo l'oggetto in stringa

  const url = BASE_URL + 
              '/' + 
              todo.id; 

  fetchOptions = { 
    method: 'PUT', body: dbObjJson, headers:{ 
      'Content-Type': 'application/json'
    }
  }; 

  fetch(url, fetchOptions) 
  .then(resp => resp.json()) 
  .then(res => displayTodos(todosArray))
}

function displayTodos(todos){ 
// così rioridina le tasks ogni volta che viene chiamata;
  todosArray.sort(Todo.orderToDoByPriority);

  const todosContainer = document.getElementById('todos-container');

  todosContainer.innerHTML = '';

  for (const todo of todos) {

    const todoCard = document.createElement('div');
    todoCard.classList.add('todo-card');

    todoCard.innerHTML = createTodoCard(todo);

    const tagContainer = todoCard.querySelector('.tag-container');

    populateTagContainer(tagContainer, todo.tags)

    const deleteButton = todoCard.querySelector('.delete-button');
    deleteButton.onclick = () => requestConfirmToDelete(todo.id); 

    const editButton = todoCard.querySelector('.edit-button');  
    if (todo.doneDate) {
      editButton.style.display = 'none';
    } else { 
      //  ho passato id della task su cui premo "edit"
    editButton.onclick = () => goToTodoPage(todo.id, todo.name); 
    }

//  qyeryslector prende primo elemento con stringa richiesta, getElement... prende una collezione di elementi;
    const doneButton = todoCard.querySelector('.done-button'); 
    if (todo.doneDate) {  //  se è presente doneDate, sparisce
      doneButton.style.display = 'none';
    } else { 
      // dovremo fare fetch di una put, scriviamo in database
      doneButton.onclick = () => toDoDone(todo); 
    } 

    const divider = todoCard.querySelector('.divider');
    divider.style.backgroundColor = todo.priority.color;

    // const span = document.createElement('span');
    // const nameNode = document.createTextNode(todo.name);
    // span.appendChild(nameNode);

    // todoCard.appendChild(span);

    // const button = document.createElement('button');
    // button.onclick = () => deleteTodo(todo.id)
    // const deleteNode = document.createTextNode('delete');
    // button.appendChild(deleteNode);

    // todoCard.appendChild(button);

    todosContainer.appendChild(todoCard);

  }
  
}

function initTodos(todos){
  stopLoading();
  todosArray = todos.map(obj => Todo.fromDbObj(obj)); 
//  ordinare per priorità
  todosArray.sort(Todo.orderToDoByPriority);
  displayTodos(todosArray);
}

function loadTodos(){
  startLoading()
  fetch(BASE_URL)
  .then(response => response.json())
  .then(result => initTodos(result))
  //.catch(error => stopLoading())
}

loadTodos()


