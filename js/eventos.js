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
const POST_API_DETAIL               = "posts/";
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
const POST_DETAIL_INFO          = 6;

/**
 * Variables de entorno:
 */
var paginaActual = 1;
var postActual = POST_HOME;
var postAnterior = new PilaControl();
var apiLocation = null;
//PNG de Carga.
var rotationPng = null;
var enMovimientoPng = false;
/**
 * Funciones Generales
 */
function getJsonContent(url, callBackFunction)
{
    //Div muestra de carga...
    loadingDiv();
    //Obteniendo datos ajax
    //console.log("DEBUG: getJsonContent: Fue solicitado la URL: "+ url);
    var jSONCont = null;
    $.getJSON(url, function (result)
        {
            jSONCont = result;
        })
        .done(function () {
            //console.log("DEBUG: getJsonContent: Resultado de ajax: ");
            console.log(jSONCont);
            //En caso de avanzar, suma la pagina.
            callBackFunction(jSONCont);
        })
        .fail(function (eCode) {
            //console.log("DEBUG: getJsonContent: Error ajax: "+ eCode);
            showError("Error Conexion - C: 1");
        })
        .always(function () {
            //fin carga...
            loadingDiv();
        });
}

function showError(info)
{
    $("#textMensaje").text(info);
    //alert("Error: "+ info);
    $("#mensajeDiv").toggleClass("hidden", "show");
}

function loadingDiv()
{
    //Movemos el png!
    if (rotationPng == null)
    {
        $(".sprite-spinner").each(function(i){
            rotationPng = new SpriteSpinner(this, {
                interval:50
            });
        });
    }
    if (enMovimientoPng == true)
    {
        rotationPng.stop();
        enMovimientoPng = false;
    }
    else
    {
        rotationPng.start();
        enMovimientoPng = true;
    }
    //Activa la div que tiene la carga
    $("#loadingDiv").toggleClass("hidden", "show");
}

function hideMenuUpAtras()
{
    console.log("Pos actual: (hideMenuUpAtras) "+ postActual);
    /* En caso de que sea el home, ocultamos atras, mostramos menu princiap y borramos contenido*/
    if (postActual == POST_HOME)
    {
        $("#m_atras").hide();
        $("#menuPrincipal").show();
        $("#contentPrincipal").hide();
        $("#m_atrasP_adelanteP").hide();
        $("#content").text('');
    }
    else
    {
        $("#m_atras").show();
        $("#menuPrincipal").hide();
        $("#contentPrincipal").show();
        if (postActual != POST_DETAIL_INFO && postActual != POST_HORARIO_LAB)
        {
            $("#m_atrasP_adelanteP").show();
        }
    }
}

function setActualPost(post)
{
    console.log("ENTRA A SET ACTUAL POST: "+ post +", valor actual postActual: "+ postActual);
    if (postActual != post)
    {
        console.log("No es la misma page, asi que sigue...");
        /* POR AHORA OFF, SE CARGAN EN EL INDEX.HTML
        var scriptMaqueta = null;
        switch (post)
        {
            case HORARIO_LAB_API_LOCATION: scriptMaqueta = "maquetaHorariosLab.js"; break;
            default: scriptMaqueta = "maquetaTitulos.js"; break;
        }
        //Carga script de la maqueta visual que corresponda
        $.getScript(JS_FOLDER_LOCATION + scriptMaqueta);*/

        if (post == POST_HOME)
        {
            paginaActual = 1;
        }
        //Para no meter a la pila el ultimo nivel
        if (postActual != POST_DETAIL_INFO) //En este instante, el postActual es la posicion anterior
        {
            console.log("Se guarda: "+ post);
            postAnterior.put(postActual);
        }
    }
    postActual = post;
    console.log("DEBUG: setPost: paginaActual: "+ paginaActual);
    console.log("DEBUG: postActual: "+ postActual +" postAnterior: "+ postAnterior);
}

//Usado para cuando la paginas no tienen contenidos y llega a la funcion de muestra, en dicho caso, se reviertre el avance
function invertirAvance()
{
    postActual = postAnterior.remove();
    console.log("Posicion revertida, postActual: "+ postActual +" Anterior: ");
    console.log(postAnterior);
}


/**
 * Eventos de Menu (clicks)
 */
//Atras:
$("#m_atras").click(function ()
{
    var posMove = postAnterior.remove();

    if (posMove == POST_HOME)
    {
        setActualPost(POST_HOME);
        hideMenuUpAtras();
        postAnterior.clear();
    }
    else
    {
        setActualPost(posMove);
        $("#content").text('');
        switch(posMove)
        {
            case POST_EVENTOS: eventosGenerator(); break;
            case POST_OFERTA_LABORAL: ofertLaboralGenerator(); break;
            case POST_NOTICIAS: noticiasGenerator(); break;
            case POST_HORARIO_LAB: horarioLabGenerator(); break;
            case POST_PRACTICA_PROFECIONAL: practicaLaboralGenerator(); break;
        }
    }
    console.log(postAnterior);
});

//Noticias:
$("#m_noticias_carrera").click(function () {
    noticiasGenerator();
});
function noticiasGenerator()
{
    //Validamos posicion y restablecemos valores
    setActualPost(POST_NOTICIAS);
    //Mostramos el nuevo contenido
    apiLocation = NOTICAS_API_LOCATION;
    getJsonContent(getUrlTitulos(), displayTitulos);
}
//Eventos:
$("#m_eventos").click(function () {
    eventosGenerator();
});
function eventosGenerator()
{
    //Validamos posicion y restablecemos valores
    setActualPost(POST_EVENTOS);
    //Mostramos el nuevo contenido
    apiLocation = EVENTOS_API_LOCATION;
    getJsonContent(getUrlTitulos(), displayTitulos);
}
//Ofertas laborales
$("#m_oferta_laboral").click(function () {
    ofertLaboralGenerator();
});
function ofertLaboralGenerator()
{
    //Validando posicion
    setActualPost(POST_OFERTA_LABORAL);
    apiLocation = OFERTAS_API_LOCATION;
    getJsonContent(getUrlTitulos(), displayTitulos);
}
//Horario laboratorios
$("#m_horario_labs").click(function () {
    horarioLabGenerator();
});
function horarioLabGenerator()
{
    //Valid post
    setActualPost(POST_HORARIO_LAB);
    var url = URL_API + HORARIO_LAB_API_LOCATION;
    getJsonContent(url, displayHorarioLab);
}
//Practicas laborales
$("#m_practica_profecional").click(function () {
    practicaLaboralGenerator();
});
function practicaLaboralGenerator()
{
    //Valid post
    setActualPost(POST_PRACTICA_PROFECIONAL);
    apiLocation = PRACTICAS_API_LOCATION;
    getJsonContent(getUrlTitulos(), displayTitulos);
}

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
    var url = URL_API + POST_API_DETAIL + idPost;
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
