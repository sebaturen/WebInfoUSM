function newUpdateController()
{
	intervalUpdate();
	setInterval(intervalUpdate, 60000);
}

function intervalUpdate()
{
    console.log("Hola mundo!");
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
	console.log("Eventos");
	var textoMasUno = getTextMasUno(jSONContent);
	if (textoMasUno != null)
	{
		$("#mas_eventos").text(textoMasUno);
	}
}

function controOfertasLaborales(jSONContent)
{
	console.log("OfertasLab");
	var textoMasUno = getTextMasUno(jSONContent);
	if (textoMasUno != null)
	{
		$("#mas_oferta").text(textoMasUno);
	}
}

function controlPracticas(jSONContent)
{
	console.log("Practicas");
	var textoMasUno = getTextMasUno(jSONContent);
	if (textoMasUno != null)
	{
		$("#mas_practica").text(textoMasUno);
	}
}

function controlNoticias(jSONContent)
{
	console.log("Noticias");
	var textoMasUno = getTextMasUno(jSONContent);
	if (textoMasUno != null)
	{
		$("#mas_noticias").text(textoMasUno);
	}
}

/* Controlando la cant de post (+N) */
function getTextMasUno(jSONContent)
{
	var fechaActual = new Date("2016-03-04T10:08:18");
	var cantMismoDia = 0;
	var lastTitulo = null;
	//Recorremos las noticias
	if (jSONContent.length > 0) 
	{
		console.log("Lllamdo!");
		console.log(jSONContent);
		jSONContent.forEach(function (postInfo)
		{
			//Tomamos las noticias y revisamos que sean de hoy
			var fechaObject = new Date(postInfo['date']);
			//Comprobamos año, mes y dia
			if (	(fechaObject.getFullYear() 	== fechaActual.getFullYear())
				&&	(fechaObject.getMonth() 	== fechaActual.getMonth())
				&&	(fechaObject.getDate() 		== fechaActual.getDate())		)
			{
				//Si es el primer dia tomado, guardamos el titulo
				if (cantMismoDia == 0)
				{
					lastTitulo = postInfo['title'];
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