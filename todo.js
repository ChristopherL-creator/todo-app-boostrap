// console.log('sono todo.js', window.location.href); 

const BASE_URL = 'https://628d3321a3fd714fd040dac4.mockapi.io/todo' 

let selectedToDo = new Todo('new todo') // come se fose un todo nuovo

const params = parseUrlParams();  //  chiamo parse paramas
// function parseUrlParams() {
//   const url = window.location.href; 
//   const urlArray = url.split('?') //  spexxo nel punto interrogativo; divido tra url e parametri
//   const paramsString = urlArray[1]; // mi prendo i parametri
//   if (paramsString) { //   mi chiedo se paramstring sia presente;
//     const paramsArray = paramsString.split('&'); //  creo array in cui divido parametri in "&" 
//     const paramsObj = {};
//   for (const str of paramsArray) {  //  ciclo su array, perchè mi prenda tutti e due i parametri
//     const strArray = str.split('=');  //  id=3 è chiave con valore, li voglio separare in array, per cui splitto su =
//     console.log('array', str); 
//     paramsObj[strArray[0]] = decodeURIComponent(strArray[1]) //  setto chiave [(indice)[0]], a cui assgno valore (indice)[1], 
    //                                        e li metto in oggetto vuoto paramsObj, così è più facile leggerli;
    //  caratteri strani vengono codificati in codice unicode, vanno trattati con decodeURIComponent(a cui passi il valore strArray[1]);
//   } 
//   console.log(paramsObj);
//   } else { 
//     return null;
//   }
// } 

function goHome() {
  window.location.href = './';
}

function parseUrlParams() {  //  secondo metodo
  const urlSearchParams = new URLSearchParams(window.location.search); //creo oggetto 
  const params = Object.fromEntries(urlSearchParams.entries()); //ritrasforma in oggett già decodificato 
  return params;
  // console.log('params', params);
} 

function checkTitle(){ // per cambiare titolo
  const params = parseUrlParams(); 
  if (params.id) {  //  se ha id è per modificare, sennò nuovo todo
    const pageTitle = document.getElementById('page-title'); 
    pageTitle.innerHTML = 'Modifica ToDo';
  }
} 


function loadSelectedToDos(id){ 
  const todoUrl = BASE_URL + 
  '/' + 
  id; 
  fetch(todoUrl) 
  .then(resp => resp.json()) 
  .then(result => initSelectedToDo(result));
} 

function initSelectedToDo(obj) {
  const toDo = Todo.fromDbObj(obj); //  creo todo da model 
  selectedToDo = toDo; 
  fillForm(selectedToDo);
}

//  prendo tags, li ciclo, controllo se nome è di quelli già preseti in array, in caso farò match: 
function colorTags(selectedTags) {
//  prendo tutti i default tags da html 
  const tags = document.getElementsByClassName('tag'); 
  // console.log('tags', tags); 
  for (const tagSpan of tags) { 
    if (selectedTags.includes(tagSpan.innerHTML)) { 
      tagSpan.style.backgroundColor = 'crimson';
    } else { 
      tagSpan.style.backgroundColor = '#414141';

    }
  }
} 

function colorPriority(priority) {
  // console.log(priority); 
//  prendo tutte priorità defualt
    const priorities = document.getElementsByClassName('priority'); 
    // console.log('tags', tags); 
    for (const prioritySpan of priorities) { 
      // console.log(prioritySpan);
      if (priority.name.toLowerCase() === prioritySpan.innerHTML.toLowerCase()) { 
        prioritySpan.style.backgroundColor = priority.color;
      } else { 
        prioritySpan.style.backgroundColor = '#414141';
      }
    }
} 

function addOrRemoveTag(tag) {
//  se todo selzionato ha già tag input lo rimuovo, sennò aggiungo; 
  if (selectedToDo.tags.includes(tag)) {
    selectedToDo.tags = selectedToDo.tags.filter(t => filterTags(t, tag)); // siccome filter crea nuovo array; t sta per tag 
  } else { 
    selectedToDo.tags.push(tag); // lo aggiungo, ed essendoci colortags lo coloro
  }
  colorTags(selectedToDo.tags);
} 

function changePriority(priority) {
//  priority è una sola, basta cmabiare ordine priority
  selectedToDo.priorityOrder = priority;  // ho spostato codice da mdel a todo.js 
  colorPriority(selectedToDo.priority);
} 

function filterTags(t1, t2) { // tiene tutti i tag diversi da tag di input
  return t1 !== t2;
}

function fillForm(toDo) {
  const nameInput = document.getElementById('name-input'); 
  nameInput.value = toDo.name; 
  colorTags(toDo.tags); 
  colorPriority(toDo.priority);
} 

function saveToDo() { //  deve fare solo un controllo, che ci sia il name nell'inputbox
  console.log('ciao');
  const nameInput = document.getElementById('name-input'); 
  const name = nameInput.value.trim()  //  imposto valore inputbox come name 
  
  if (name) {
    
    selectedToDo.name = name;  
    
    const dbObj = selectedToDo.toDbObj(); //  prendo oggetto da model
    
    const dbObjJson = JSON.stringify(dbObj);  //  trasformo oggetto in stringa 

    let url; 
    let fetchOptions;
    
    if(params.id){ 
      url = BASE_URL + '/' + params.id; //  creo url con nuovo todo
    
      fetchOptions = { 
        method: 'PUT', body: dbObjJson, headers:{ 
          'Content-Type': 'application/json'
        }
      }; 
    } else { 
      url = BASE_URL; 
    
      fetchOptions = { 
        method: 'post', body: dbObjJson, headers:{ 
          'Content-Type': 'application/json'
        }
      };
    }

    fetch(url, fetchOptions) 
      .then(resp => resp.json()) 
      .then(res => goHome()) 

  
  } else { 
    alert('non posso salvare todo senza nome')
  }
}


if (params.id) {  //  se hanno id, li ho chiamati per modifica
  checkTitle(); 
  loadSelectedToDos(params.id);
} else { 
  fillForm(selectedToDo)
} 

//  per check guardo data in cui faccio check: spazio su db minimo;
//  creo todo vuoto, 
//  se sono in modifica riempio todo con quello vuoto che devo modificare; 
//  sennò uso quello vuoto 

//  local storage e session storage 

//  session storage vive finche non pulisco sito; 
//  local storage è a livello di pc, permane in sessioni successive 
//  salvo sempre Key = Value: Key deve sempre essere stringa, e Value una stringa (con json.stringify posso usare anche array)

// function getToDoFromSessionStorage() { 
// const toDoString = sessionStorage.getItem('selectedToDo');  //  richiamo todo da app.js, mi ridà una stringa, devo riconvertirla in oggetto
//   if (toDoString) { 
//     const todo = JSON.parse(toDoString);  //  converto string in oggetto
//     console.log('todo', todo);  //  oggetto in session storage 
//   } 
// } 
//  inadeguato per modifiche concorrenziali da piu utenti

// getToDoFromSessionStorage(); 

//  chiamare mock api con id, per chiedere oggetto; quado ce l'abbiamo, step ulteriore: mostrare dati strutturati come: name con oggetto input; 
//  voglio editare name, tag, e priority