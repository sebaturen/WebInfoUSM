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
    //console.log(jSONContent);
    //Capturando Hash
    var hashA = listHash();
    //console.log("DEBUG: displayTitulos: Llego para mostrar (resultado ajax): "+ jSONContent);
    if (jSONContent.length > 0)
    {
        //Setiando la posicion"
        //console.log(hashA);
        if (typeof paginaActual != "undefined")
        {
            //Si ya fue asignado un hash con la posicion, elimina y vuelve a insertar
            var regExpPage = new RegExp("p[0-9]?[0-9]");
            if (hashA.length == 2 && regExpPage.test(hashA[1]))
            { //Caso existe hash
                sacarHash();
                if (paginaActual > 1)
                {
                    setAddHashPost('/p'+ paginaActual);
                }
            }
            if (hashA.length < 2 && paginaActual > 1) //así no afecta cuando el usuario entre a por ejemplo #noticias/p<id pagina>/<id noticia>
            {
                setAddHashPost('/p'+ paginaActual);
            }
        }
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
            var txConent = '<div class="getArticInfo" data-tag="'+ data['ID'] +'"><fecha class="fechaLi" data-tag="'+ data['ID'] +'">'+ fechaNoticia +"</fecha> &#124; "+ tituloNoticia +"</div>";

            //en NO TOTEM, este contenido no se debe ver, debe redirigir a la pagina de la usm para que solo alumnos validados puedan acceder
            if (postActual == POST_OFERTA_LABORAL || postActual == POST_PRACTICA_PROFECIONAL)
            {
                if (!isTotem())
                {
                    txConent = "<a href='"+ data['link'] +"' style='display: block;'><div class='titlArticulInf'>"+ txConent +"</div><div class='vrWeb'>Ver en la WEB</div></a>";
                }
            }
		    textAut += '<li class="list-group-item sectionTitle '+ classNoticiaDelDia +'">'+ txConent +'</li>';
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
    //Mostrando advertencia d eseccion prohivida:
    if (!isTotem())
    {
        if (postActual == POST_OFERTA_LABORAL || postActual == POST_PRACTICA_PROFECIONAL)
        {
            $("#zona_externa").show();
        }
    }
}

//Control de paginas (pagina anterior, pagine siguiente)
$("#m_atrasPage").click(function () {
    accionPagina = MOVIMIENTO_PAGINA_ATRAS;
    //console.log("PaginaActual: "+ paginaActual);
    paginaActual += 1;
    //setActualPost(postActual);
    getJsonContent(getUrlTitulos(getApiLocation(postActual)), displayTitulos);
});
$("#m_siguentePage").click(function () {
    accionPagina = MOVIMIENTO_PAGINA_ADELANTE;
    if (paginaActual != 1)
    {
        paginaActual -= 1;
        //setActualPost(postActual);
        getJsonContent(getUrlTitulos(getApiLocation(postActual)), displayTitulos);
    }
    else
    {
        showError("No se ha encontrado nuevo contenido!");
    }
});

//Esta funcion se llama cuando se reonoce el hash #p<n>
function moverAPagina(nPagina)
{
    accionPagina = MOVIMIENTO_PAGINA_ATRAS;
    //console.log("Moviendo a nPagina: "+ nPagina);
    paginaActual = parseInt(nPagina);
    getJsonContent(getUrlTitulos(getApiLocation(postActual)), displayTitulos);
}

//Captura de Click para mostrar el contenido de un post
$("#contentPrincipal").on("click", ".getArticInfo", function (obCliked) {
    var idPost = obCliked.target.getAttribute('data-tag');
    if (postActual == POST_OFERTA_LABORAL || postActual == POST_PRACTICA_PROFECIONAL)
    {
        if (!isTotem()) //Si es una oferta o practica, y no esta en el totem, sale
        {
            return;
        }
    }
    if ($.isNumeric(idPost))
    {
        setAddHashPost('/'+ idPost);
        getInfoPost(idPost);
    }
    else
    {
        showError("Existe un error al cargar el contenido");
    }
});

function getInfoPost(idPost)
{
    if (postActual == POST_EVENTOS)
    {
        if (!isTotem()) //Algunos eventos son privados!, esos deben ser corroborados antes de mostrarse
        {
            getJsonContent(getUrlMetaPost(idPost), isEventPrivado, true);
            return;
        }
    }
    getJsonContent(getUrlContent(parseInt(idPost)), displayContent);
}

/* Muestra el detalle del titulo selecionado */
function displayContent(jSONContent)
{
    //Setiando posicion interna del post (evento, noticia, practica, etc)
    sectionDe = postActual;
    setActualPost(POST_DETAIL_INFO);
	hideMenuUpAtras();
    $("#content").html("<div id='info_Post'></div>");
    //Tomamos el contenido y mostramos
    var tFinal = "<h1 class='titloNoticiaDetail'>"+jSONContent['title']+"</h1>";
    tFinal += "<p class='fechaLi'>"+ generateFechaString(new Date(jSONContent['date'])) +"</p>";
    tFinal += jSONContent['content'];
    $("#info_Post").html(tFinal);
    if (sectionDe == POST_EVENTOS ||
        sectionDe == POST_PRACTICA_PROFECIONAL ||
        sectionDe == POST_OFERTA_LABORAL)
    {
        getJsonContent(getUrlMetaPost(jSONContent['ID']), loadMetaInfo, false);
    }
    //console.log(jSONContent);
}

function displayContentFail(jSONContent)
{
    setActualPost(POST_DETAIL_INFO);
    hideMenuUpAtras();
    $("#content").html("<div id='info_Post'></div>");
    //Tomamos el contenido y mostramos
    var tFinal = "<h1 class='titloNoticiaDetail'>"+jSONContent['title']+"</h1>";
    tFinal += "<p class='fechaLi'>"+ generateFechaString(new Date(jSONContent['date'])) +"</p>";
    tFinal += "Para ver el contenido debes iniciar sesión en la página de la carrera, con tus credenciales USM:";
    tFinal += " <a target='_blank' href='"+ jSONContent['link'] +"'>"+ jSONContent['link'] +"</a>";
    $("#info_Post").html(tFinal);
}

//Organiza los meta de eventos, practicas y ofertas
function loadMetaInfo(jSONContent)
{
    var tFinal = "";
    //console.log(jSONContent);
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
    $("#info_Post").append("<h1 class='titloNoticiaDetail'>Detalle</h1>");
    $("#info_Post").append(tFinal);
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

//Revisa si un evento es privado.
function isEventPrivado(jSONContent)
{
    var idPost = jSONContent['post_id'];
    if (typeof jSONContent['post_meta']['eventos_privados_v'] != undefined)
    {
        if (jSONContent['post_meta']['eventos_privados_v'])
        {
            //true!
            getJsonContent(getUrlContent(parseInt(idPost)), displayContentFail);
            return;
        }
    }
    //false!
    getJsonContent(getUrlContent(parseInt(idPost)), displayContent);
}
