/**
 * Maqueta visual de la lista de horarios de los labroatorios y extracion de PDF
 * Entrada:
 *      El contenido de la pagina que contiene los horarios.
 * Salida:
 *      Cambio visual mostrando los N labs, con sus PDF para abrirlos en el navegador web.
 */
function displayHorarioLab(jSONContent)
{
    //console.log("DEBUG: displayHorarioLab: Recibido: "+ jSONContent);
    var contentPage = jSONContent['content'];
    if (contentPage.length > 0)
    {
        //Escondemos el menu general
        hideMenuUpAtras();
        //Rompemos el STRING en busca de los PDF:
        //1º Buscamos una <ul> (los horarios van en una lista)
        contentPage = contentPage.split("<ul>")[1];
        //Separfamos entre elementos de <li>
        var horariosPdf = contentPage.split("<li>");
        //Sacamos la basura...
        horariosPdf.splice(0,1);
        //Recorremos cada <li>
        var textAut = '<ul class="list-group">';
        var i = 1;
        horariosPdf.forEach(function (data)
        {
            var inicioPDF = data.search("http://");
            var finPDF = data.search(".pdf"); //Se le debe sumar 4 para que guarde la posicion hasta que termina la extencion
            textAut += '<li class="list-group-item"><a href="'+ data.substring(inicioPDF, finPDF+4) +'">Horario Laboratorio '+ i +"</a></li>";
            i++;
        });
        textAut += '</ul>';
        $("#content").html(textAut);
    }
    else
    {
        //console.log("DEBUG: displayHorarioLab: Error, tamaño cero del objeto!");
        showError("Sin contenido! - C: 3");
    }
}
