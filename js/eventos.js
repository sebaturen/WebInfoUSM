/**
 * Constantes
 */
 //URL BASE
const URL_BASE					= "http://turensoft.com/jmcInfo/"; //se usa para buscar los .php que generan imagenes o buscan si son posible el iframe.
//Api:
const URL_API 					= URL_BASE + "wp/wp-json/"; /* API DE PRUEBA! */
//const URL_API 					= "http://www.inf.jmc.utfsm.cl/wp-json/";
const OFERTAS_API_LOCATION      = "posts?type[]=laborales";
const PRACTICAS_API_LOCATION    = "posts?type[]=practicas";
const NOTICAS_API_LOCATION      = "posts?";
const HORARIO_LAB_API_LOCATION  = "pages/83";
const EVENTOS_API_LOCATION      = "posts?type[]=eventos";
const POST_API_DETAIL			= "posts/";
const POST_META_DETAIL			= "postmeta/";
//Varias
const JS_FOLDER_LOCATION        = "js/";
//Filtros: (generadores de URL)
const PAGINA 				= "&page=";
const POST_POR_PAGINA 		= 10;
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
const POST_VIDEO_VIEW			= 7;

/**
 * Variables de entorno:
 */
var paginaActual 	= 1;
var postActual 		= POST_HOME;
var postAnterior 	= new PilaControl();
//PNG de Carga.
var rotationPng 	= null;
var enMovimientoPng = false;
//Nuevas publicaciones
//Moviendo hash
var hashPosiotion = "#home";

/**
 * Funciones Generales
 */
/* Se encarga de hacer el llamado aJax y obtener el resultado, enviandolo a donde debe ser procesado*/
function getJsonContent(url, callBackFunction, loadDiv)
{
	//console.log(url);
	//Validando tipo de carga
	if (typeof loadDiv == "undefined")
	{
		loadDiv = true;
	}
    //Div muestra de carga...
	if (loadDiv)
	{
		loadingDiv();
	}
    //Obteniendo datos ajax
    var jSONCont = null;
    $.getJSON(url, function (result)
        {
            jSONCont = result;
        })
        .done(function () {
            //En caso de avanzar, suma la pagina.
            callBackFunction(jSONCont);
        })
        .fail(function (eCode) {
			if (loadDiv)
			{
				showError("Error Conexion - C: 1");
			}
        })
        .always(function () {
            //fin carga...
			if (loadDiv)
			{
				loadingDiv();
			}
        });
}

/* Transforma un mensaje de error, que sera desplegado a toda pantalla con un boton "cerrar"*/
function showError(info)
{
    $("#textMensaje").text(info);
    //alert("Error: "+ info);
    $("#mensajeDiv").toggleClass("hidden", "show");
}

/* Muestra la div de carga*/
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

/* Controla la muestra u ocultamiento de las secciones segun la navegacion en el sitio*/
function hideMenuUpAtras()
{
    //console.log("Pos actual: (hideMenuUpAtras) "+ postActual);
    /* En caso de que sea el home, ocultamos atras, mostramos menu princiap y borramos contenido*/
    if (postActual == POST_HOME)
    {
        $("#m_atras").hide();
		showMenuEfectLoad();
        $("#contentPrincipal").hide();
        $("#m_atrasP_adelanteP").hide();
        $("#content").text('');
		if (!isTotem()) //Seccion de versiones moviles.
		{
			$("#zona_externa").hide();
		}
    }
    else
    {
        $("#m_atras").show();
        $("#menuPrincipal").hide();
        $("#contentPrincipal").show();
        if (postActual != POST_DETAIL_INFO && postActual != POST_HORARIO_LAB && postActual != POST_VIDEO_VIEW)
        {
            $("#m_atrasP_adelanteP").show();
        }
		else
		{
			$("#m_atrasP_adelanteP").hide();
		}
    }
}

/* Siempre que se despliguea una pagina, debe setarse la nueva posicion de esta */
function setActualPost(post)
{
    //console.log("ENTRA A SET ACTUAL POST: "+ post +", valor actual postActual: "+ postActual);
    if (postActual != post)
    {
        //console.log("No es la misma page, asi que sigue...");
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
            //console.log("Se guarda: "+ post);
            postAnterior.put(postActual);
        }
    }
    postActual = post;
    //console.log("DEBUG: setPost: paginaActual: "+ paginaActual);
    //console.log("DEBUG: postActual: "+ postActual +" postAnterior: "+ postAnterior);
}

//Usado para cuando la paginas no tienen contenidos y llega a la funcion de muestra, en dicho caso, se reviertre el avance
function invertirAvance()
{
    postActual = postAnterior.remove();
    //console.log("Posicion revertida, postActual: "+ postActual +" Anterior: ");
    //console.log(postAnterior);
}


/**
 * Eventos de Menu (clicks)
 */
//Atras:
$("#m_atras").click(function ()
{
	//Removiendo pila
	var posMove = postAnterior.remove();

	//contenido
    if (posMove == POST_HOME)
    {
        setActualPost(POST_HOME);
        hideMenuUpAtras();
        postAnterior.clear();
		//Reanuda la reproduccion de los videos
		startVideo();
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
    //console.log(postAnterior);
});
//Fuera de totem
function isTotem()
{
	if ($('meta[name=totemUSM]').attr("content") == 'true')
	{
		return true;
	}
	return false;
}
//Cerrar iframe
$("#m_iFrameCerrar").click(function() {
	cerrarIframe();
});

function cerrarIframe()
{
	$("#iframeBox").hide();
	$("#iframeContent").html('<iframe id="iframeExternalLink" name="iframe1" frameborder="0" src="" style="width: 100%; height: 100%;"></iframe>');
	//Mostrando contenido
	$("#contentPage").show();
	if (postActual == POST_VIDEO_VIEW)
	{
		setActualPost(POST_HOME);
		startVideo();
	}
}

function setContentIframe(htmlContent)
{
	//Cargando....
	$("#iframeContent").html(htmlContent);
	//Mostrando Iframe box...
	$("#iframeBox").show();
	//Ocultando contenido
	$("#contentPage").hide();
}

function loadIframe(url)
{
	chkIframe(url);
	loadingDiv();
}

function chkIframe(url)
{
	urlConsilt = URL_BASE + "validExternalFrame.php";
	$.getJSON( urlConsilt, {
	  url: url
	})
	.always(function () {
		loadingDiv();
	})
	.done(function( data ) {
		//Revisa si la pagina puede ser cargada en iframe
		if (data.error == false)
		{
			var urlCarga = url;
			if (data.typeImg == true)
			{
				var urlCarga = URL_BASE + "showImg.php?url="+ url;
			}
			if (postActual == POST_HORARIO_LAB || data.typeImg == true)
			{
				//Cargando....
				$("#iframeExternalLink").attr("src", urlCarga);
				//Mostrando Iframe box...
				$("#iframeBox").show();
				//Ocultando contenido
				$("#contentPage").hide();
			}
			else
			{
				//error
				showError("No esta permitido ver esta pagina.");
			}
		}
		else
		{
			//error
			showError("No esta permitido ver esta pagina.");
		}

	});
}

//Noticias:
$("#m_noticias_carrera").click(function () {
	setHashPost('noticias');
    noticiasGenerator();
});
function noticiasGenerator()
{
    //Validamos posicion y restablecemos valores
    setActualPost(POST_NOTICIAS);
    //Mostramos el nuevo contenido
    var apiLocation = NOTICAS_API_LOCATION;
    getJsonContent(getUrlTitulos(apiLocation), displayTitulos);
}
//Eventos:
$("#m_eventos").click(function () {
	setHashPost('eventos');
    eventosGenerator();
});
function eventosGenerator()
{
    //Validamos posicion y restablecemos valores
    setActualPost(POST_EVENTOS);
    //Mostramos el nuevo contenido
    var apiLocation = EVENTOS_API_LOCATION;
    getJsonContent(getUrlTitulos(apiLocation), displayTitulos);
}
//Ofertas laborales
$("#m_oferta_laboral").click(function () {
	setHashPost('offLaboral');
	ofertLaboralGenerator();
});
function ofertLaboralGenerator()
{
    //Validando posicion
    setActualPost(POST_OFERTA_LABORAL);
    var apiLocation = OFERTAS_API_LOCATION;
    getJsonContent(getUrlTitulos(apiLocation), displayTitulos);
}
//Horario laboratorios
$("#m_horario_labs").click(function () {
	setHashPost('horarioLab');
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
	setHashPost('practica');
    practicaLaboralGenerator();
});

function practicaLaboralGenerator()
{
    //Valid post
    setActualPost(POST_PRACTICA_PROFECIONAL);
    var apiLocation = PRACTICAS_API_LOCATION;
    getJsonContent(getUrlTitulos(apiLocation), displayTitulos);
}

/* Genera el url para consultar a la API sobre los titulos de cada seccion */
function getUrlTitulos(apiLocation)
{
	//console.log("apiLocation: "+ apiLocation);
    //Generando URL:
    var url = URL_API + apiLocation
        + FILTRO_POST_POR_PAG + POST_POR_PAGINA
        + PAGINA + paginaActual
        + FILTRO_ORDEN_DESC;

    return url;
}

/* Genera el url para consultar a la API del contenido de un post*/
function getUrlContent(idPost)
{
    //Generando URL para el detalle
    var url = URL_API + POST_API_DETAIL + idPost;
    return url;
}

/* Genera el URL para consultar los meta del post*/
function getUrlMetaPost(idPost)
{
	//Generando URL...
	var url = URL_API + POST_META_DETAIL + idPost;
	return url;
}

/* Entrega la posicion de la API segun la posicion interna*/
function getApiLocation(post)
{
	var postAPI = null;
	switch (post) {
		case POST_OFERTA_LABORAL       : postAPI = OFERTAS_API_LOCATION; break;
		case POST_PRACTICA_PROFECIONAL : postAPI = PRACTICAS_API_LOCATION; break;
		case POST_NOTICIAS             : postAPI = NOTICAS_API_LOCATION; break;
		case POST_HORARIO_LAB          : postAPI = HORARIO_LAB_API_LOCATION; break;
		case POST_EVENTOS              : postAPI = EVENTOS_API_LOCATION; break;
	}

	return postAPI;
}

/*
 * Controles ejecucion (?)
 */
//Pagina lista!
$( document ).ready(function()
{
	//set move hash
	moveHash();
	//Toma la fecha actual
	setHora();
	//Mostrando Menu
	showMenuEfectFirst();
    //Revisa nuevas publicaciones...
    newUpdateController();
});
//Captura de Click para todos los tag 'a'
$("#contentPrincipal").on("click", "a", function (obCliked) {
	obCliked.preventDefault();
    var urlHref = obCliked.currentTarget.getAttribute('href');
	if (urlHref != null)
	{
		if ($("#runEfectCarga").data("content") != 2) //version en totem!
		{
			loadIframe(urlHref);
		}
		else
		{ //version en telefonos!
			window.open(urlHref, '_system');
		}
	}
	return false;
});

function moveHash()
{
	//set Hash home
	if (window.location.hash != "" && window.location.hash != "#home")
	{
		//viene con un hash, vamos a ver donde corresponde...
		var hashA = listHash();
		var i = 0;
		hashA.forEach(function(hash)
		{
			switch(i)
			{
				case 0: //Caso pagina principal de contenido
					switch (hash)
					{
						case "noticias":
							noticiasGenerator();
							break;
						case "eventos":
							eventosGenerator();
							break;
						case "offLaboral":
							ofertLaboralGenerator();
							break;
						case "horarioLab":
							horarioLabGenerator();
							break;
						case "practica":
							practicaLaboralGenerator();
							break;
					}
					break;
				case 1: //caso de pagina
					var regExpPage = new RegExp("p[0-9]?[0-9]");
					if (regExpPage.test(hash))
					{
						moverAPagina(String(hash.match(/[0-9]?[0-9]/g)));
						break;
					}
				case 2: //caso de detalle de publicacion en concreto (id public)
					var regExpPubliID = new RegExp("[0-9].[^a-z]*");
					if (regExpPubliID.test(hash))
					{
						getInfoPost(String(hash.match(/[0-9].[^a-z]*/g)));
					}
				break;
			}
			i++;
		});
	}
	else
	{
		setHashPost('home');
		if (postActual != POST_HOME)
		{
			setActualPost(POST_HOME);
	        hideMenuUpAtras();
		}
	}
}

/*Deteccion de cambio de posicion (boton atras, o adelante en la pagina)*/
window.onhashchange = function()
{
	if (window.location.hash != hashPosiotion)
	{
		moveHash();
		//console.log("Retrocedio!: "+ window.location.hash +" pV: "+ hashPosiotion);
	}
}
