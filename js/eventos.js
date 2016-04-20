/**
 * Constantes
 */
//Api:
const URL_API = "http://www.inf.jmc.utfsm.cl/wp-json/";
const OFERTAS_API_LOCATION      = "posts?type[]=laborales";
const PRACTICAS_API_LOCATION    = "posts?type[]=practicas";
const NOTICAS_API_LOCATION      = "posts?";
const HORARIO_LAB_API_LOCATION  = "pages/83";
const EVENTOS_API_LOCATION      = "posts?type[]=eventos";
const POST_DETAIL               = "posts/";
//Varias
const JS_FOLDER_LOCATION        = "js/";
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
 * Variables de entorno:
 */
var paginaActual = 1;
var postActual = POST_HOME;
var postAnterior = POST_HOME;
var apiLocation = null;
/**
 * Funciones Generales
 */
function getJsonContent(url, callBackFunction)
{
    //Div muestra de carga...
    loadingDiv();
    //Obteniendo datos ajax
    console.log("DEBUG: getJsonContent: Fue solicitado la URL: "+ url);
    var jSONCont = null;
    $.getJSON(url, function (result)
        {
            jSONCont = result;
        })
        .done(function () {
            console.log("DEBUG: getJsonContent: Resultado de ajax: ");
            console.log(jSONCont);
            //En caso de avanzar, suma la pagina.
            callBackFunction(jSONCont);
        })
        .fail(function (eCode) {
            console.log("DEBUG: getJsonContent: Error ajax: "+ eCode);
            showError("Error: Conexion generando json - C: 1");
        })
        .always(function () {
            //fin carga...
            loadingDiv();
        });
}

function showError(info)
{
    var textMensaje = '<h1 id="textMensaje" class="text-center">'+ info +'</h1>'
        + '<div><button onclick="showError()" type="button" class="btn btn-danger">Cerrar</button></div>';
    $("#divContentMensaje").html(textMensaje);
    //alert("Error: "+ info);
    $("#mensajeDiv").toggleClass("hidden", "show");
}

function loadingDiv()
{
    //Activa la div que tiene la carga
    $("#loadingDiv").toggleClass("hidden", "show");
}

function hideMenuUpAtras()
{
    $("#m_atras").toggleClass("hidden", "show");
    $("#menuPrincipal").toggleClass("hidden", "show");
}

function setActualPost(post)
{
    if (postActual != post)
    {
        /* POR AHORA OFF, SE CARGAN EN EL INDEX.HTML
        var scriptMaqueta = null;
        switch (post)
        {
            case HORARIO_LAB_API_LOCATION: scriptMaqueta = "maquetaHorariosLab.js"; break;
            default: scriptMaqueta = "maquetaTitulos.js"; break;
        }
        //Carga script de la maqueta visual que corresponda
        $.getScript(JS_FOLDER_LOCATION + scriptMaqueta);*/

        paginaActual = 1;
    }
    postAnterior = postActual;
    postActual = post;
    console.log("DEBUG: setPost: postActual: "+ postActual +" paginaActual: "+ paginaActual);
}


/**
 * Eventos de Menu (clicks)
 */
//Atras:
$("#m_atras").click(function () {
    //Esconde el menu de navegacion.
    if (postActual != POST_HORARIO_LAB)
    {
        $("#m_atrasP_adelanteP").toggleClass("hidden", "show");
    }
    setActualPost(POST_HOME);
    hideMenuUpAtras();
    $("#content").text("");
});
//Noticias:
$("#m_noticias_carrera").click(function () {
    //Validamos posicion y restablecemos valores
    setActualPost(POST_NOTICIAS);
    //Mostramos el nuevo contenido
    apiLocation = NOTICAS_API_LOCATION;
    getJsonContent(getUrlTitulos(), displayTitulos);
});
//Eventos:
$("#m_eventos").click(function () {
    //Validamos posicion y restablecemos valores
    setActualPost(POST_EVENTOS);
    //Mostramos el nuevo contenido
    apiLocation = EVENTOS_API_LOCATION;
    getJsonContent(getUrlTitulos(), displayTitulos);
});
//Ofertas laborales
$("#m_oferta_laboral").click(function () {
    //Validando posicion
    setActualPost(POST_OFERTA_LABORAL);
    apiLocation = OFERTAS_API_LOCATION;
    getJsonContent(getUrlTitulos(), displayTitulos);
});
//Horario laboratorios
$("#m_horario_labs").click(function () {
    //Valid post
    setActualPost(POST_HORARIO_LAB);
    var url = URL_API + HORARIO_LAB_API_LOCATION;
    getJsonContent(url, displayHorarioLab);
});
//Practicas laborales
$("#m_practica_profecional").click(function () {
    //Valid post
    setActualPost(POST_PRACTICA_PROFECIONAL);
    apiLocation = PRACTICAS_API_LOCATION;
    getJsonContent(getUrlTitulos(), displayTitulos);
});

function getUrlTitulos()
{
    //Generando URL:
    var url = URL_API + apiLocation
        + FILTRO_POST_POR_PAG + POST_POR_PAGINA
        + PAGINA + paginaActual
        + FILTRO_ORDEN_DESC;

    return url;
}

function getUrlContent(idPost)
{
    //Generando URL para el detalle
    var url = URL_API + POST_DETAIL + idPost;
    return url;
}

/*
 * Controles ejecucion (?)
 */
//Pagina lista!
$( document ).ready(function()
{
    //Toma la fecha actual
    $("#fechaActual").text(controlHora());
    //Revisa nuevas publicaciones...
});

function controlHora()
{
    var fechaObject = new Date();
    //set Dia
    var diaNum = fechaObject.getDate();
    var diaSemana = new Array(7);
    diaSemana[0]=  "Domingo";
    diaSemana[1] = "Lunes";
    diaSemana[2] = "Martes";
    diaSemana[3] = "Miércoles";
    diaSemana[4] = "Jueves";
    diaSemana[5] = "Viernes";
    diaSemana[6] = "Sábado";
    var diaText = diaSemana[fechaObject.getDay()];
    //set Mes
    var mesAnio = new Array(12);
    mesAnio[0]=  "Enero";
    mesAnio[1] = "Febrero";
    mesAnio[2] = "Marzo";
    mesAnio[3] = "Abril";
    mesAnio[4] = "Mayo";
    mesAnio[5] = "Junio";
    mesAnio[6] = "Julio";
    mesAnio[7]=  "Agosto";
    mesAnio[8] = "Septiembre";
    mesAnio[9] = "Octubre";
    mesAnio[10] = "Noviembre";
    mesAnio[11] = "Diciembre";
    var mesText = mesAnio[fechaObject.getMonth()];

    var hora = fechaObject.getHours();
    var min = fechaObject.getMinutes();
    if (hora < 10) hora = '0' + hora;
    if (min < 10) min = '0' + min;
    return diaText +" "+ diaNum +" de "+ mesText +", "+ hora +':'+ min;
}
