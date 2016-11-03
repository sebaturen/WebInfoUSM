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
    sacarHash();
    return this.elementos.shift();
};

//Borra todo del array.
PilaControl.prototype.clear = function()
{
    //Set location en "homa"
    window.location.hash = 'home';
    //Borrando todo...
    this.elementos.length = 0;
};

//Saca el ultimo hash, si es el ultimo deja "#home" como la primera.
function sacarHash()
{
    //hash HTML
    var hashA = listHash();
	if (hashA.length > 1)
	{
		hashA = hashA.splice(0, hashA.length-1);
		var i = hashA.length-1;
		var hashF = '';
		hashA.forEach(function(hash)
		{
			hashF += hash;
			if (i != 0)
			{
				hashF += '/';
			}
			i--;
		});
		window.location.hash = hashF;
	}
	else
	{
		window.location.hash = 'home';
	}
}

function listHash()
{
    var hashA = window.location.hash;
    hashA = hashA.substring(1,hashA.length);
    hashA = hashA.split("/");
    return hashA;
}
