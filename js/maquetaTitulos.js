const MOVIMIENTO_PAGINA_ADELANTE = 1;
const MOVIMIENTO_PAGINA_ATRAS = 2;
const MOVIMIENTO_PAGINA_NINGUNO = 0;
var accionPagina = 0;
var sectionDe = 0;
/**
 * Maqueta visual de los titulos de cada seccion.
 * Entrada:
 *      - Objecto jSON que contiene N elementos que seran presentandos visualmente
 * Salida:
 *      - Cambio visual que generará una lista con los titulos
 */
function displayTitulos(jSONContent)
{
    //console.log("DEBUG: displayTitulos: Llego para mostrar (resultado ajax): "+ jSONContent);
    if (jSONContent.length > 0)
    {
        accionPagina = MOVIMIENTO_PAGINA_NINGUNO;
        //Escondemos el menu general
        hideMenuUpAtras();
        var textAut = '<ul class="list-group titulosGroup">';
        jSONContent.forEach(function (data)
        {
            var fechaNoticia = generateFechaString(new Date(data['date']));
            var classNoticiaDelDia = "";
            if(isSameData(data['date']))
            {
                classNoticiaDelDia += "noticiaDelDia";
            }
            var tituloNoticia = cortarTexto(data['title'], 50);
		textAut += '<li class="list-group-item sectionTitle '+ classNoticiaDelDia +'" data-tag="'+ data['ID'] +'"><fecha class="fechaLi">'+ fechaNoticia +"</fecha>&#124; "+ tituloNoticia +'</li>';
        });
        textAut += '</ul>';
        $("#content").html(textAut);
    }
    else
    {
        if (accionPagina == MOVIMIENTO_PAGINA_ATRAS)
        {
            paginaActual -= 1;
        }
        if (accionPagina == MOVIMIENTO_PAGINA_NINGUNO)
        {
            invertirAvance();
        }
        //console.log("PAG POST ACTUAL: "+ paginaActual);
        //console.log("DEBUG: displayTitulos: Error, tamaño cero del objeto!");
        showError("No se ha encontrado nuevo contenido!");
        //REVISAR!
        //setActualPost(postAnterior.get()); //como no se entro a esta pagina, se define la anterior como actual
    }
}

//Control de paginas (pagina anterior, pagine siguiente)
$("#m_atrasPage").click(function () {
    accionPagina = MOVIMIENTO_PAGINA_ATRAS;
    paginaActual += 1;
    window.location.hash += '/pA'+ paginaActual;
    //setActualPost(postActual);
    getJsonContent(getUrlTitulos(getApiLocation(postActual)), displayTitulos);
});
$("#m_siguentePage").click(function () {
    accionPagina = MOVIMIENTO_PAGINA_ADELANTE;
    if (paginaActual != 1)
    {
        paginaActual -= 1;
        window.location.hash += '/pS'+ paginaActual;
        //setActualPost(postActual);
        getJsonContent(getUrlTitulos(getApiLocation(postActual)), displayTitulos);
    }
    else
    {
        showError("No se ha encontrado nuevo contenido!");
    }
});

//Captura de Click para mostrar el contenido de un post
$("#contentPrincipal").on("click", ".sectionTitle", function (obCliked) {
    var idPost = obCliked.target.getAttribute('data-tag');
    	window.location.hash += '/'+ idPost;
    getJsonContent(getUrlContent(idPost), displayContent);
});

/* Muestra el detalle del titulo selecionado */
function displayContent(jSONContent)
{
    //Setiando posicion interna del post (evento, noticia, practica, etc)
    sectionDe = postActual;
    setActualPost(POST_DETAIL_INFO);
	hideMenuUpAtras();
    //Tomamos el contenido y mostramos
    $("#content").html(jSONContent['content']);
	$("#content").prepend("<p class='fechaLi'>"+ generateFechaString(new Date(jSONContent['date'])) +"</p>");
    $("#content").prepend("<h1 class='titloNoticiaDetail'>"+jSONContent['title']+"</h1>");
    if (sectionDe == POST_EVENTOS ||
        sectionDe == POST_PRACTICA_PROFECIONAL ||
        sectionDe == POST_OFERTA_LABORAL)
    {
        getJsonContent(getUrlMetaPost(jSONContent['ID']), loadMetaInfo);
    }
    console.log(jSONContent);
}

//Organiza los meta de eventos, practicas y ofertas
function loadMetaInfo(jSONContent)
{
    var tFinal = "";
    console.log(jSONContent);
    switch(sectionDe)
    {
        case POST_EVENTOS:
            //Fecha
            tFinal += "<div><h2 class='titloNoticiaDetail'>Fecha:</h2>";
                tFinal += jSONContent['post_meta']['eventos_fecha_inicio'];
                if (typeof jSONContent['post_meta']['eventos_fecha_termino'] != "undefined")
                {
                    tFinal += " al " + jSONContent['post_meta']['eventos_fecha_termino'];
                }
            tFinal += "</div>";
            //Hora
            if (typeof jSONContent['post_meta']['eventos_hora_inicio'] != "undefined" || typeof jSONContent['post_meta']['eventos_hora_termino'] != "undefined" )
            {
                tFinal += "<div><h2 class='titloNoticiaDetail'>Hora:</h2>";
                    if (typeof jSONContent['post_meta']['eventos_hora_inicio'] != "undefined")
                    {
                        tFinal += jSONContent['post_meta']['eventos_hora_inicio'];
                    }
                    if (typeof jSONContent['post_meta']['eventos_hora_inicio'] != "undefined" && typeof jSONContent['post_meta']['eventos_hora_termino'] != "undefined" )
                    {
                        tFinal += " - ";
                    }
                    if (typeof jSONContent['post_meta']['eventos_hora_termino'] != "undefined")
                    {
                        tFinal += jSONContent['post_meta']['eventos_hora_termino'];
                    }
                tFinal += "</div>"
            }
            //Lugar
            if (typeof jSONContent['post_meta']['eventos_lugar'] != "undefined")
            {
                tFinal += "<div><h2 class='titloNoticiaDetail'>Lugar:</h2>";
                    tFinal += jSONContent['post_meta']['eventos_lugar'];
                tFinal += "</div>";
            }
            break;
        case POST_PRACTICA_PROFECIONAL:
            //Vacanges
            tFinal += "<div><h2>Hay <b>"+ jSONContent['post_meta']['praclab_vacantes'] +"</b> vacantes disponibles</h2>";
            //Empresa
            if (typeof jSONContent['post_meta']['praclab_direccion'] != "undefined" || typeof jSONContent['post_meta']['praclab_sitio_web'] != "undefined")
            {
                tFinal += "<div><h2 class='titloNoticiaDetail'>Empresa:</h2>";
                    if (typeof jSONContent['post_meta']['praclab_direccion'] != "undefined")
                    {
                        tFinal += jSONContent['post_meta']['praclab_direccion'];
                    }
                    if (typeof jSONContent['post_meta']['praclab_sitio_web'] != "undefined" && typeof jSONContent['post_meta']['praclab_sitio_web'] != "undefined")
                    {
                        tFinal += "<br/>";
                    }
                    if (typeof jSONContent['post_meta']['praclab_sitio_web'] != "undefined")
                    {
                        tFinal += jSONContent['post_meta']['praclab_sitio_web'];
                    }
                tFinal += "</div>"
            }
            //Contacto
            if (typeof jSONContent['post_meta']['praclab_encargado'] != "undefined" || typeof jSONContent['post_meta']['praclab_telefono'] != "undefined")
            {
                tFinal += "<div><h2 class='titloNoticiaDetail'>Contacto:</h2>";
                    if (typeof jSONContent['post_meta']['praclab_encargado'] != "undefined")
                    {
                        tFinal += jSONContent['post_meta']['praclab_encargado'];
                    }
                    if (typeof jSONContent['post_meta']['praclab_encargado'] != "undefined" && typeof jSONContent['post_meta']['praclab_telefono'] != "undefined")
                    {
                        tFinal += "<br/>";
                    }
                    if (typeof jSONContent['post_meta']['praclab_telefono'] != "undefined")
                    {
                        tFinal += jSONContent['post_meta']['praclab_telefono'];
                    }
                tFinal += "</div>";
            }
            break;
        case POST_OFERTA_LABORAL:
            //Vacanges
            tFinal += "<div><h2>Hay <b>"+ jSONContent['post_meta']['praclab_vacantes'] +"</b> vacantes disponibles</h2>";
            //Empresa
            if (typeof jSONContent['post_meta']['praclab_direccion'] != "undefined" || typeof jSONContent['post_meta']['praclab_sitio_web'] != "undefined")
            {
                tFinal += "<div><h2 class='titloNoticiaDetail'>Empresa:</h2>";
                    if (typeof jSONContent['post_meta']['praclab_direccion'] != "undefined")
                    {
                        tFinal += jSONContent['post_meta']['praclab_direccion'];
                    }
                    if (typeof jSONContent['post_meta']['praclab_sitio_web'] != "undefined" && typeof jSONContent['post_meta']['praclab_sitio_web'] != "undefined")
                    {
                        tFinal += "<br/>";
                    }
                    if (typeof jSONContent['post_meta']['praclab_sitio_web'] != "undefined")
                    {
                        tFinal += jSONContent['post_meta']['praclab_sitio_web'];
                    }
                tFinal += "</div>"
            }
            //Contacto
            if (typeof jSONContent['post_meta']['praclab_encargado'] != "undefined" || typeof jSONContent['post_meta']['praclab_telefono'] != "undefined")
            {
                tFinal += "<div><h2 class='titloNoticiaDetail'>Contacto:</h2>";
                    if (typeof jSONContent['post_meta']['praclab_encargado'] != "undefined")
                    {
                        tFinal += jSONContent['post_meta']['praclab_encargado'];
                    }
                    if (typeof jSONContent['post_meta']['praclab_encargado'] != "undefined" && typeof jSONContent['post_meta']['praclab_telefono'] != "undefined")
                    {
                        tFinal += "<br/>";
                    }
                    if (typeof jSONContent['post_meta']['praclab_telefono'] != "undefined")
                    {
                        tFinal += jSONContent['post_meta']['praclab_telefono'];
                    }
                tFinal += "</div>";
            }
            //Beneficios
            if (typeof jSONContent['post_meta']['praclab_beneficios'] != "undefined")
            {
                tFinal += "<div><h2 class='titloNoticiaDetail'>Beneficios:</h2>";
                    tFinal += jSONContent['post_meta']['praclab_beneficios'];
                tFinal += "</div>";
            }
            break;
    }
    $("#content").append("<h1 class='titloNoticiaDetail'>Detalle</h1>");
    $("#content").append(tFinal);
}

function generateFechaString(dataObj)
{
	var fechaOut = "";
	if (dataObj.getDate() < 10) fechaOut += "0";
	fechaOut += dataObj.getDate() +"-";
	if (dataObj.getMonth() < 10) fechaOut += "0";
	fechaOut += dataObj.getMonth() +"-" + dataObj.getFullYear();
	return fechaOut;
}
