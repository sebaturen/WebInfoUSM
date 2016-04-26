function PilaControl () {
    this.elementos = new Array();
}

PilaControl.prototype.get = function()
{
    return this.elementos[0];
};

PilaControl.prototype.put = function(elemento)
{
    this.elementos.unshift(elemento);
};

PilaControl.prototype.remove = function()
{
    return this.elementos.shift();
};

PilaControl.prototype.clear = function()
{
    this.elementos.length = 0;
};
