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
        if (postAnterior == POST_HOME)
        {
            $("#menu_general").toggleClass("hidden", "show");
            $("#m_atras").toggleClass("hidden", "show");
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
        showError("Sin contenido! - C: 2");
    }
}

//Control de paginas (pagina anterior, pagine siguiente)
$("#m_atrasPage").click(function () {
    setActualPost(postActual);
    getJsonContent(getUrlTitulos(), displayTitulos);
});
$("#m_siguentePage").click(function () {
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
