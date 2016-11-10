function newUpdateController()
{
	intervalUpdate();
	setInterval(intervalUpdate, 60000);
	timUpdInter();
}

function intervalUpdate()
{
	setHora();
	setMasUno();
}

function setMasUno()
{
	var apiLocation = null;
    //OFERTAS LABORALES
	apiLocation = OFERTAS_API_LOCATION;
    getJsonContent(getUrlTitulos(apiLocation), controOfertasLaborales, false);
	//PRACTICAS
    apiLocation = PRACTICAS_API_LOCATION;
    getJsonContent(getUrlTitulos(apiLocation), controlPracticas, false);
	//NOTICIAS CARRERA
    apiLocation = NOTICAS_API_LOCATION;
    getJsonContent(getUrlTitulos(apiLocation), controlNoticias, false);
	//EVENTOS
    apiLocation = EVENTOS_API_LOCATION;
    getJsonContent(getUrlTitulos(apiLocation), controlEventos, false);
}

function controlEventos(jSONContent)
{
	var textoMasUno = getTextMasUno(jSONContent);
	if (textoMasUno != null)
	{
		$("#mas_eventos").text(textoMasUno);
	}
}

function controOfertasLaborales(jSONContent)
{
	var textoMasUno = getTextMasUno(jSONContent);
	if (textoMasUno != null)
	{
		$("#mas_oferta").text(textoMasUno);
	}
}

function controlPracticas(jSONContent)
{
	var textoMasUno = getTextMasUno(jSONContent);
	if (textoMasUno != null)
	{
		$("#mas_practica").text(textoMasUno);
	}
}

function controlNoticias(jSONContent)
{
	var textoMasUno = getTextMasUno(jSONContent);
	if (textoMasUno != null)
	{
		$("#mas_noticias").text(textoMasUno);
	}
}

/* Validando fecha */
function isSameData(fechaComparar)
{
	var fechaActual = new Date(); //Date("2016-07-05T10:08:18");
	//Tomamos las noticias y revisamos que sean de hoy
	var fechaObject = new Date(fechaComparar);
	//Comprobamos año, mes y dia
	if (	(fechaObject.getFullYear() 	== fechaActual.getFullYear())
		&&	(fechaObject.getMonth() 	== fechaActual.getMonth())
		&&	(fechaObject.getDate() 		== fechaActual.getDate())		)
	{
		return true;
	}
	return false;
}

function cortarTexto(text, size)
{
	if (text.length > size)
	{
		text = text.substring(0, 40);
		text += "..";
	}
	return text;
}

/* Controlando la cant de post (+N) */
function getTextMasUno(jSONContent)
{
	var cantMismoDia = 0;
	var lastTitulo = null;
	//Recorremos las noticias
	if (jSONContent.length > 0)
	{
		//console.log("Lllamdo!");
		//console.log(jSONContent);
		jSONContent.forEach(function (postInfo)
		{
			if (isSameData(postInfo['date']))
			{
				//Si es el primer dia tomado, guardamos el titulo
				if (cantMismoDia == 0)
				{
					lastTitulo = cortarTexto(postInfo['title'], 40);
				}
				//Contamos
				cantMismoDia += 1;
			}
		});
	}

	//Revisamos de que sea mayor que 1, para poner el +N
	var output = null;
	if (cantMismoDia > 0)
	{
		output = "(+"+ cantMismoDia +") "+ lastTitulo;
	}
	return output;
}

/* Set Hora */
function setHora()
{
    $("#fechaActual").text(controlHora());
}
/* Genera la hora actual para poner en la pagina costado derecho. */
function controlHora()
{
    var fechaObject = new Date();
    //set Dia
    var diaNum = fechaObject.getDate();
    var diaSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    var diaText = diaSemana[fechaObject.getDay()];
    //set Mes
    var mesAnio = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    var mesText = mesAnio[fechaObject.getMonth()];

    var hora = fechaObject.getHours();
    var min = fechaObject.getMinutes();
    if (hora < 10) hora = '0' + hora;
    if (min < 10) min = '0' + min;
    return diaText +" "+ diaNum +" de "+ mesText +", "+ hora +':'+ min;
}

//Efecto menu aparece desde abajo (?)
function showMenuEfectFirst()
{
	if ($("#lastSession").data("content") == 1)
	{
		showMenuEfectLoad();
	}
}

//Ejecuta el efecto de muestra de menu solo si no esta deactivado
function showMenuEfectLoad()
{
	//Mostrando section menu
	$("#menuPrincipal").css('display', 'block');
	if ($("#runEfectCarga").data("content") != 2)
	{
		showMenuEfect();
	}
}

function showMenuEfect()
{

	//Desactivando mascara y ocultando resto:
	$("#m_oferta_laboral").css('opacity', '0');
	$("#m_practica_profecional").css('opacity', '0');
	$("#m_noticias_carrera").css('opacity', '0');
	$("#m_horario_labs").css('opacity', '0');
	$("#m_eventos").css('opacity', '0');
	$("#m_videos").css('opacity', '0');
	$("#mascara").css('display', 'none');

	//Moviendo todo un poco hacia abajo...
	$("#m_oferta_laboral").css('margin-top', '50px');
	$("#m_practica_profecional").css('margin-top', '50px');
	$("#m_noticias_carrera").css('margin-top', '50px');
	$("#m_horario_labs").css('margin-top', '50px');
	$("#m_eventos").css('margin-top', '50px');
	$("#m_videos").css('margin-top', '50px');

	//Desocultando mascara...
	clearDatMove(["#m_oferta_laboral", "#m_practica_profecional", "#m_noticias_carrera", "#m_horario_labs", "#m_eventos", "#m_videos"]);
}

var listInterval = [];
function clearDatMove(idList)
{
	for ( var i = 0; i <= idList.length; i++ )
	{
		listInterval[i] = [0.05, 47.5, idDiv];
		var idDiv = idList[i];
		setTimeout("generateInterval("+ i +")", i*250);
	}
}

function generateInterval(args)
{
	//console.log("llamado intervalo "+ args);
	listInterval[args][3] = setInterval(function() {sacarMascara(args);}, 50);
}

function sacarMascara(args)
{
	//Opoacity
	//console.log(listInterval[args]);
	$(listInterval[args][2]).css('opacity', listInterval[args][0]);
	listInterval[args][0] += 0.05;
	//Pos margin-top
	$(listInterval[args][2]).css('margin-top', listInterval[args][1] +'px');
	listInterval[args][1] -= 2.5;
	if (listInterval[args][0] >= 1)
	{
		$(listInterval[args][2]).css('margin-top', '0px');
		clearInterval(listInterval[args][3]);
	}
}

//Creditos IDLE TIme: http://stackoverflow.com/questions/667555/detecting-idle-time-in-javascript-elegantly
var idleTime = 0;
function timUpdInter() {
    //Increment the idle time counter every minute.
	if (postActual != POST_HOME)
	{
    	var idleInterval = setInterval(timerIncrement, 60000); // 1 minute
	}

    //Zero the idle timer on mouse movement.
    $(this).mousemove(function (e) {
        idleTime = 0;
    });
    $(this).keypress(function (e) {
        idleTime = 0;
    });
}

function timerIncrement() {
    idleTime = idleTime + 1;
	//console.log("Idle Time: "+ idleTime);
    if (idleTime > 1) { // 2 minutes
		setHashPost("home");
        window.location.reload();
    }
}
