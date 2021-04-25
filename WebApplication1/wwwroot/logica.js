var categories;
var todos;
var select;
var divCategorie;
var modificando;
var lists;

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
            select = $('<select id="listacategoria"></select>');
            for(var x = 0; x < categories.length; x++)
            {
                
                var prova = $('<option></option>');

                prova.attr({
                    "value" :categories[x].id,
                    "class": 'lista'+categories[x].id,
                });
                prova.html(categories[x].name);
                prova.appendTo(select);

                divCategorie.push($('<div></div>')
                .attr({
                    "class": "divCategoria",
                    "id": "div"+categories[x].id
                })
                .appendTo('#todolist'));
            }
            caricaListe();
            
        }
    }   
}
function caricaListe()
{
    refhttp.open("GET", "https://localhost:44318/api/list", true);

    refhttp.send();

    refhttp.onreadystatechange = 
    function () {
        if (this.readyState == 4 )
        {
            //alert(this.responseText);
            lists = JSON.parse(this.responseText);
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
            // alert(this.responseText);
             var listaOpzioni=[];

            $(select.clone()).children().each(function () {
                listaOpzioni.push($(this));
            });

            var y=0;
            $(divCategorie).each(function () {
                $(this).html('');
                $('<p></p>').attr('class','titolo').html(listaOpzioni[y]).appendTo(this);

                $('<button></button>')
                .attr({
                    'onclick':"postTodosNuovo("+categories[y].id+")",
                    'class':'pulsanteAggiungi'
                })
                .html('<i class="fa fa-plus-square">').appendTo(this);

                y++;

                for(var x = 0; x < lists.length; x++)
                {
                    var idtemp = $(this).attr('id');
                    //alert(idtemp);
                    $(this).append(
                        $('<div></div>')
                        .attr({
                            'value': lists[x].date,
                            'class': lists[x].id,
                            'id':idtemp+'_'+lists[x].id
                        })
                        .append(
                            $('<p></p>')
                            .attr({
                                'class':'titoloData fa fa-plus-square',
                                'onclick':"postTodosNuovo("+idtemp.substring(3)+","+lists[x].id+")"
                            })
                            .html(lists[x].date.substr(0,10))
                        )
                    );
                }
                
            });
            


            for (var x = 0; x < todos.length; x++) {

                //creo la textbox con dentro la todo
                var taskToDo = $('<textarea></textarea>')
                .attr({
                    'id':'name'+todos[x].id,
                    'onfocusin':'prePut('+todos[x].id+')',
                    'onfocusout':'mandaPut('+todos[x].id+')'
                })
                //.resizable({resize: putSenzaCarica(todos[x].id)})
                .height(todos[x].altezza)
                .html(todos[x].name);

                //creo la checkbox is Complete
               var isComplete= $('<input></input>')
                .attr({
                    'type':'checkbox',
                    'id':'isComplete'+todos[x].id,
                    'onclick':'putSenzaCarica('+todos[x].id+')'
                })
                .prop("checked",todos[x].isComplete);

                //utilizzo la select che ho preparato prima 
                var singolaCategoria = select.clone();
                
                singolaCategoria
                .attr({
                    'id':'categoria'+todos[x].id,
                    'onchange':'putTodos('+todos[x].id+')'
                })
                .val(todos[x].categoryId);

                //creo il pulsante cancella

                var del = document.createElement('button');
                del.setAttribute('onclick','deleteTodos('+todos[x].id+')');
                del.innerHTML='<i class="fa fa-trash">';
                
                //aggiungo alla categoria adeguata i vari elementi
                
                $("#div"+todos[x].categoryId+"_"+todos[x].listId)
                .append($('<div></div>')
                .attr("class","divTodo")
                .append(taskToDo, singolaCategoria, isComplete, del));

                
                $('#grid').show();
                $('.spinner-grow').hide();
                
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

function postTodosNuovo(idCategoria,idlista)
{
    refhttp.open("POST", "https://localhost:44318/api/todo/", true);
    refhttp.setRequestHeader("Content-Type", "application/json");

    var lista ='{"name": "' + "" + '","isComplete":'+false+',"categoryId":'+idCategoria+',"listId":'+idlista+',"altezza":'+50+'}';
    
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
    var altezza = $('#name'+id).height();
    var lista ='{"id":'+id+',"name": "' + name + '","isComplete":'+isComplete+',"categoryId":'+category+',"listId": 1,"altezza":'+altezza+'}';
    
    refhttp.send(lista);
    refhttp.onreadystatechange = 
    function () {
        if (this.readyState == 4 && this.status < 300) {
            //alert('modifica effettuata');
            CaricaTodos();
        }
    }
}
function putSenzaCarica(id)
{
    refhttp.open("PUT", "https://localhost:44318/api/todo/"+id, true);
    refhttp.setRequestHeader("Content-Type", "application/json");

    var name = $('#name'+id).val();
    var isComplete = $('#isComplete'+id).prop("checked"); 
    var category= $('#categoria'+id).val();
    var altezza = $('#name'+id).height();
    
    var lista ='{"id":'+id+',"name": "' + name + '","isComplete":'+isComplete+',"categoryId":'+category+',"listId": 1,"altezza":'+altezza+'}';
    alert(lista);
    refhttp.send(lista);
    refhttp.onreadystatechange = 
    function () {
        if (this.readyState == 4 && this.status < 300) {
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
        putSenzaCarica(id);
}
function postCategoria()
{
    
}