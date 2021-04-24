var categories;
var todos;
var select;
var divCategorie;
var modificando;

var refhttp;

function IstanziaTodo()
{
    refhttp = new XMLHttpRequest();
    //console.log('ciao1');
    caricaCategorie();
}

function caricaCategorie()
{
    divCategorie=[];
    refhttp.open("GET", "https://localhost:44318/api/category", true);
    refhttp.send();
    refhttp.onreadystatechange = 
    function () {
        //console.log('ciao2');
        if (this.readyState == 4 )
        {
            categories = JSON.parse(this.responseText);
            select = document.createElement('select');
            for(var x = 0; x < categories.length; x++)
            {
                var option = document.createElement('option');
                option.setAttribute("value",categories[x].id);
                option.setAttribute("class",'lista'+categories[x].id);
                
                option.innerHTML=categories[x].name;
                select.setAttribute('id','listacategoria');
                select.appendChild(option);

                var sezione = document.createElement('div');
                sezione.setAttribute("class","divCategoria");
                sezione.setAttribute("id","div"+categories[x].id);
                document.getElementById("todolist").appendChild(sezione);
                divCategorie.push(sezione);
            }
            var div = document.getElementById('categoria');
            CaricaTodos();
        }
    }
    
}

function CaricaTodos() 
{
   
    refhttp.open("GET", "https://localhost:44318/api/todo", true);

    refhttp.send();

    refhttp.onreadystatechange = 
    function () {

        if (this.readyState == 4 && this.status == 200) {

            todos = JSON.parse(this.responseText);

            var tbody;

            for(var x=0;x<divCategorie.length;x++)
            {
                divCategorie[x].innerHTML="";
                p = document.createElement('p');
                p.setAttribute('class','titolo');
                p.innerHTML=select[x].innerHTML;
                divCategorie[x].appendChild(p);

                var pulsante = document.createElement('button');
                pulsante.setAttribute('onclick',"postTodosNuovo("+categories[x].id+")")
                pulsante.setAttribute('class','pulsanteAggiungi');
                pulsante.innerHTML='<i class="fa fa-plus-square">';
                divCategorie[x].appendChild(pulsante);
            }

            for (var x = 0; x < todos.length; x++) {

                //creo la textbox con dentro la todo
                var taskToDo = document.createElement('textarea');
                // taskToDo.setAttribute('type','text');
                // taskToDo.setAttribute('value',todos[x].name);
                taskToDo.innerHTML=todos[x].name;
                taskToDo.setAttribute('id','name'+todos[x].id);
                taskToDo.setAttribute('onfocusin','prePut('+todos[x].id+')');
                taskToDo.setAttribute('onfocusout','mandaPut('+todos[x].id+')');

                //creo la checkbox is Complete
                var isComplete= document.createElement('input');
                isComplete.setAttribute('type','checkbox');
                isComplete.setAttribute('id','isComplete'+todos[x].id);
                isComplete.setAttribute('onclick','putTodos('+todos[x].id+')');
                isComplete.checked=todos[x].isComplete;
                
                //utilizzo la select che ho preparato prima 
                var singolaCategoria = select.cloneNode(true);
                singolaCategoria.setAttribute('id','categoria'+todos[x].id);
                singolaCategoria.setAttribute('onchange','putTodos('+todos[x].id+')');

                var opzione = singolaCategoria.getElementsByClassName("lista"+todos[x].categoryId)[0];
                opzione.selected=true;

                //creo il pulsante cancella

                var del = document.createElement('button');
                del.setAttribute('onclick','deleteTodos('+todos[x].id+')');
                del.innerHTML='<i class="fa fa-trash">';
                
                //aggiungo alla categoria adeguata i vari elementi
                tbody = document.getElementById("div"+todos[x].categoryId);
                var divTodo = document.createElement('div');
                divTodo.setAttribute("class","divTodo")
                divTodo.appendChild(taskToDo);
                divTodo.appendChild(singolaCategoria);
                divTodo.appendChild(isComplete);
                divTodo.appendChild(del);
                tbody.appendChild(divTodo);

                $('#loading').hide();
            }

        }
    }
}
    function deleteTodos(id)
{
    var r=confirm("conferma l'eliminazione");
    if(r)
    {
    refhttp.open("DELETE", "https://localhost:44318/api/todo/"+id, true);
    refhttp.send();
    refhttp.onreadystatechange = 
    function () {
        if (this.readyState == 4 && this.status == 204) {
            CaricaTodos();
        }
    }
    }
}

function postTodosNuovo(idCategoria)
{
    refhttp.open("POST", "https://localhost:44318/api/todo/", true);
    refhttp.setRequestHeader("Content-Type", "application/json");

    var lista ='{"name": "' + "" + '","isComplete":'+false+',"categoryId":'+idCategoria+',"listId": 1}';
    
    refhttp.send(lista);

    refhttp.onreadystatechange = 
    function () {

        if (this.readyState == 4 && this.status < 300) {
            CaricaTodos();
        }
    }
}

function postTodos()
{
    refhttp.open("POST", "https://localhost:44318/api/todo/", true);
    refhttp.setRequestHeader("Content-Type", "application/json");

    var name = document.getElementById('name').value;
    var isComplete = document.getElementById('isComplete').checked; 
    var category= document.getElementById('listacategoria').value;

    var lista ='{"name": "' + name + '","isComplete":'+isComplete+',"categoryId":'+category+',"listId": 1}';
    
    refhttp.send(lista);

    refhttp.onreadystatechange = 
    function () {

        if (this.readyState == 4 && this.status < 300) {
            CaricaTodos();
        }
    }
}    
function putTodos(id)
{
    refhttp.open("PUT", "https://localhost:44318/api/todo/"+id, true);
    refhttp.setRequestHeader("Content-Type", "application/json");

    var name = document.getElementById('name'+id).value;
    var isComplete = document.getElementById('isComplete'+id).checked; 
    var category= document.getElementById('categoria'+id).value;
    var lista ='{"id":'+id+',"name": "' + name + '","isComplete":'+isComplete+',"categoryId":'+category+',"listId": 1}';
    
    refhttp.send(lista);
    refhttp.onreadystatechange = 
    function () {
        if (this.readyState == 4 && this.status < 300) {
            //alert('modifica effettuata');
            CaricaTodos();
        }
    }
}
function prePut(id)
{
    modificando=document.getElementById('name'+id).innerHTML;
}

function mandaPut(id)
{
    if(modificando!=document.getElementById('name'+id).value)
        putTodos(id);
}
postCategoria()
{
    
}