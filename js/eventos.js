/**
 * Constantes
 */
//Api:
const URL_API = "http://www.inf.jmc.utfsm.cl/wp-json/";
const NOTICAS_API_LOCATION      = "posts?";
const EVENTOS_API_LOCATION      = "posts?type[]=eventos";
//const PRACTICAS_API_LOCATION    = "practicas?_jsonp=?"
//Filtros: (generadores de URL)
const PAGINA = "&page=";
const POST_POR_PAGINA = 10;
const FILTRO_POST_POR_PAG   = "&filter[posts_per_page]=";
const FILTRO_ORDEN_DESC     = "&filter[order]=DESC";
//Poscion de navegacion
const POST_HOME                 = 0;
const POST_OFERTA_LABORAL       = 1;
const POST_PRACTICA_PROFECIONAL = 2;
const POST_NOTICIAS             = 3;
const POST_HORARIO_LAB          = 4;
const POST_EVENTOS              = 5;

/**
 * Funciones Generales
 */
function getJsonContent(url, callBackFunction)
{
    var jSONCont = null;
    $.getJSON(url, function (result)
        {
            jSONCont = result;
        })
        .done(function () {
            callBackFunction(jSONCont);
        })
        .fail(function () {
            showError("Conexion generando json - C: 1");
        });
}

function showError(info)
{
    alert("Error: "+ info);
}

function setActualPost(post)
{
    if (postActual != POST_HOME && postActual != post)
    {
        postActual = post;
        paginaActual = 1;
    }
}


/**
 * Eventos de Menu (clicks)
 */
var paginaActual = 1;
var postActual = POST_HOME;
//Atras:
$("#m_atras").click(function () {
    postActual = POST_HOME;
    $("#menu_general").show();
    $("#content").text("");
});
//Noticias:
$("#m_noticias_carrera").click(function () {
    //Validamos posicion y restablecemos valores
    setActualPost(POST_NOTICIAS);
    //Generamos el URL de la API
    var url = URL_API + NOTICAS_API_LOCATION
        + FILTRO_POST_POR_PAG + POST_POR_PAGINA
        + PAGINA + paginaActual
        + FILTRO_ORDEN_DESC;
    paginaActual += 1;
    //Mostramos el nuevo contenido
    getJsonContent(url, displayNoticias);
});
//Eventos:
$("#m_eventos").click(function () {
    //Validamos posicion y restablecemos valores
    setActualPost(POST_NOTICIAS);
    //Generamos la URL:
    var url = URL_API + EVENTOS_API_LOCATION
        + FILTRO_POST_POR_PAG + POST_POR_PAGINA
        + PAGINA + paginaActual
        + FILTRO_ORDEN_DESC;
    paginaActual += 1;
});

/**
 * Display Function
 */
//Noticias
function displayNoticias(jSONContent)
{
    if (jSONContent.length > 0)
    {
        //Escondemos el menu general
        $("#menu_general").hide();
        jSONContent.forEach(function (data)
        {
            $("#content").append(data['title'] + "<br/>");
        });
    }
    else
    {
        showError("Sin contenido! - C: 2");
    }
}
