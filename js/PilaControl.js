/**
 * Clase de Control de la pila
 */
//Se genera el array
function PilaControl () {
    this.elementos = new Array();
}

//Se retorna siempre el primero
PilaControl.prototype.get = function()
{
    return this.elementos[0];
};

//Se ingresa el valor siempre primero
PilaControl.prototype.put = function(elemento)
{
    this.elementos.unshift(elemento);
};

//Se remueve y se retorna el primer valor del array
PilaControl.prototype.remove = function()
{
    return this.elementos.shift();
};

//Borra todo del array.
PilaControl.prototype.clear = function()
{
    this.elementos.length = 0;
};
