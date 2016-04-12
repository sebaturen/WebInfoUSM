/**
 * Maqueta visual de los titulos de cada seccion.
 * Entrada:
 *      - Objecto jSON que contiene N elementos que seran presentandos visualmente
 * Salida:
 *      - Cambio visual que generará una lista con los titulos
 */
function displayTitulos(jSONContent)
{
    console.log("DEBUG: displayTitulos: Llego para mostrar (resultado ajax): "+ jSONContent);
    if (jSONContent.length > 0)
    {
        //Escondemos el menu general
        $("#menu_general").hide();
        $("#m_atras").show();
        jSONContent.forEach(function (data)
        {
            $("#content").append(data['title'] + "<br/>");
        });
    }
    else
    {
        console.log("DEBUG: displayTitulos: Error, tamaño cero del objeto!");
        showError("Sin contenido! - C: 2");
    }
}
