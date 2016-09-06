const MOVIMIENTO_PAGINA_ADELANTE = 1;
const MOVIMIENTO_PAGINA_ATRAS = 2;
const MOVIMIENTO_PAGINA_NINGUNO = 0;
var accionPagina = 0;
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

//Captura de Click para mostrar el contenido de un post
$("#contentPrincipal").on("click", ".sectionTitle", function (obCliked) {
    var idPost = obCliked.target.getAttribute('data-tag');
    getJsonContent(getUrlContent(idPost), displayContent);
});

/* Muestra el detalle del titulo selecionado */
function displayContent(jSONContent)
{
    setActualPost(POST_DETAIL_INFO);
	hideMenuUpAtras();
    //Tomamos el contenido y mostramos
    $("#content").html(jSONContent['content']);
	$("#content").prepend("<p class='fechaLi'>"+ generateFechaString(new Date(jSONContent['date'])) +"</p>");
    $("#content").prepend("<h1 class='titloNoticiaDetail'>"+jSONContent['title']+"</h1>");
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