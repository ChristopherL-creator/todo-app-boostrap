
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
    span.classList.add('badge'); 
    span.classList.add('rounded-pill');
    span.classList.add('text-bg-primary'); 
    span.classList.add('chip'); 
    const node = document.createTextNode('#' + tag);
    span.appendChild(node);
    container.appendChild(span)
  }
}


function createTodoCard(todo){

  const cardTemplate = 
    // `
    //   <span class="todo-name">#NAME</span>
    //   <div class="tag-container"></div>
    //   <span>#CREATIONDATE</span>
    //   <div class="divider"></div>
    //   <div class="buttons-container">
    //     <button class="delete-button"><img width="20px" src="./assets/delete.svg" alt=""></button>
    //     <button class="edit-button"><img width="20px" src="./assets/edit.svg" alt=""></button>
    //     <button class="done-button"><img width="20px" src="./assets/check.svg" alt=""></button>
    //     </div> 
    // ` 
    ` 
    <div class="card divider todo-card" style="width: 90%;">
      <div class="card-body">
        <h5 class="card-title">#NAME</h5> 
        <span>#CREATIONDATE</span>
        <div class="card-text tag-container"></div> 
        <button class="btn btn-success delete-button"> 
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
          <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
          </svg> 
        </button> 
        <button class="btn btn-success edit-button"> 
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
          <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
          </svg>
        </button> 
        <button class="btn btn-success done-button"> 
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2" viewBox="0 0 16 16">
          <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
          </svg>
        </button> 
      </div>
    </div>
    `
  
  
  //const humanDate = new Date(todo.creationDate * 1000)
  const todoHtml = cardTemplate.replace('#NAME', todo.name)
                               .replace('#CREATIONDATE', todo.creationDate.toLocaleString())

  return todoHtml;
}

function startLoading(){
//   const loader = document.getElementById('loader')
//   loader.style.display = 'inline-block'
//   const refresh = document.getElementById('refresh-button');
//   refresh.style.display = 'none';
}

function stopLoading() {
//   const loader = document.getElementById('loader')
//   loader.style.display = 'none'
//   const refresh = document.getElementById('refresh-button');
//   refresh.style.display = 'inline-block';
}

function filterTodos(t1, t2){
  return t1.id !== t2.id;
}

function removeTodoAndRefesh(todo){
//   stopLoading()
  todosArray = todosArray.filter(t1 => filterTodos(t1, todo))
  displayTodos(todosArray);
}

function deleteTodo(id){
//   startLoading()
  const deleteUrl = BASE_URL + '/' + id;
  const fetchOptions = {method: 'delete'};
  fetch(deleteUrl, fetchOptions)
  .then(response => response.json())
  .then(result => removeTodoAndRefesh(result))
//   .catch(error => stopLoading())
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
//   stopLoading();
  todosArray = todos.map(obj => Todo.fromDbObj(obj)); 
//  ordinare per priorità
  todosArray.sort(Todo.orderToDoByPriority);
  displayTodos(todosArray);
}

function loadTodos(){
//   startLoading()
  fetch(BASE_URL)
  .then(response => response.json())
  .then(result => initTodos(result))
  //.catch(error => stopLoading())
}

loadTodos()


