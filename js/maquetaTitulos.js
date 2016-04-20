/**
 * Maqueta visual de los titulos de cada seccion.
 * Entrada:
 *      - Objecto jSON que contiene N elementos que seran presentandos visualmente
 * Salida:
 *      - Cambio visual que generará una lista con los titulos
 */
function displayTitulos(jSONContent)
{
    console.log("DEBUG: displayTitulos: Llego para mostrar (resultado ajax): "+ jSONContent);
    if (jSONContent.length > 0)
    {
        //Escondemos el menu general
        console.log("post Anterior: "+ postAnterior);
        if (postAnterior == POST_HOME)
        {
            hideMenuUpAtras();
            $("#m_atrasP_adelanteP").toggleClass("hidden", "show");
        }
        var textAut = '<ul class="list-group">';
        jSONContent.forEach(function (data)
        {
            textAut += '<li class="list-group-item sectionTitle" data-tag="'+ data['ID'] +'">'+ data['title'] +'</li>';
        });
        textAut += '</ul>';
        $("#content").html(textAut);
    }
    else
    {
        console.log("DEBUG: displayTitulos: Error, tamaño cero del objeto!");
        showError("No se ha encontrado nuevo contenido!");
        setActualPost(postAnterior); //como no se entro a esta pagina, se define la anterior como actual
    }
}

//Control de paginas (pagina anterior, pagine siguiente)
$("#m_atrasPage").click(function () {
    paginaActual += 1;
    setActualPost(postActual);
    getJsonContent(getUrlTitulos(), displayTitulos);
});
$("#m_siguentePage").click(function () {
    paginaActual -= 1;
    setActualPost(postActual);
    getJsonContent(getUrlTitulos(true), displayTitulos);
});

//Captura de Click para mostrar el contenido de un post
$("#contentPrincipal").on("click", ".sectionTitle", function (obCliked) {
    var idPost = obCliked.target.getAttribute('data-tag');
    getJsonContent(getUrlContent(idPost), displayContent);
});

function displayContent(jSONContent)
{
    //Escondemos el menu de navegacion
    $("#m_atrasP_adelanteP").toggleClass("hidden", "show");
    //Tomamos el contenido y mostramos
    $("#content").html(jSONContent['content']);
    $("#content").prepend("<h1>"+jSONContent['title']+"</h1>");
}
