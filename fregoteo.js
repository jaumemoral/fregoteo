function Jugador(habitacio,x,y) {
	var self=this;
	this.habitacio=habitacio;
	this.x=x;
	this.y=y;
	this.peusMolls=0;

	this.frega = function() {
		rajola=habitacio.getRajola(this.x,this.y);
		rajola.frega();
	}

	this.mou = function (dx,dy) {
		this.x+=dx;
		this.y+=dy;
		var rajola=habitacio.getRajola(this.x,this.y);
		rajola.trepitja(this);
		this.secaPeus();
	}

	this.tePeusMolls = function () {
		return this.peusMolls>0;
	}

	this.mullaPeus = function (aigua) {
		this.peusMolls=aigua
	}

	this.secaPeus = function () {
		if (this.tePeusMolls) this.peusMolls--;
	}
}

function Habitacio(ample,alt) {
	var self=this;
	this.rajoles=[];
	this.llistaRajoles=[];
	this.ample=ample;
	this.alt=alt;

	this.init = function() {
		for (i=0;i<this.alt;i++) {
			var fila=[]
			for (j=0;j<this.ample;j++) {
				r=new Rajola(i,j);
				fila.push(r)
				this.llistaRajoles.push(r);
			}
			this.rajoles.push(fila)
		}
	}
	this.init();

	this.getRajola = function(x,y) {
		return this.rajoles[x][y];
	}

	this.secaUnaMica = function () {
		for (i in this.llistaRajoles) {
			this.llistaRajoles[i].secaUnaMica();
		}
	}

	this.toString = function () {
		var resultat="";
		for (var i=0;i<this.alt;i++) {
			for (var j=0;j<this.ample;j++) {
				r=this.getRajola(i,j)
				resultat+=r.toString()
			}
			resultat+="\n"
		}
		return resultat;
	}
}

function Rajola(x,y) {
	var self=this;
	this.bruta=true;
	this.molla=0;
	this.x=x;
	this.y=y;

	this.frega=function() {
		this.bruta=false;
		this.molla=9;
	}

	this.embruta=function() {
		this.bruta=true;
	}	

	this.trepitja=function(jugador) {
		if (jugador.tePeusMolls()) {
			this.embruta();
		} 		
		if (this.estaMolla()) {
			this.embruta();
			jugador.mullaPeus(this.molla)
		} 		
	}

	this.secaUnaMica=function()	{
		if (this.estaMolla()) this.molla--;
	}

	this.estaMolla=function()	{
		return (this.molla>0);
	}

	this.estaBruta=function()	{
		return (this.bruta);
	}

	this.toString = function() {
		return "["+(this.bruta?"X":".")+this.molla+"]"
	}
}

function assert(condicio) {
	if (!condicio) {
		console.log("Peta")
		process.exit();
	}
}

function test() {
	var habitacio=new Habitacio(3,3);
	console.log(habitacio.toString())
	j=new Jugador(habitacio,0,0);
	j.mou(1,0)
	j.frega()	
	habitacio.secaUnaMica()	
	j.mou(0,1)
	var r=habitacio.getRajola(1,0)	
	assert(r.estaMolla(),"Casella 1,0 molla")	
	/*
	j.frega()
	var r=habitacio.getRajola(1,1)
	assert(r.estaMolla(),"Casella 1,1 molla")	
	j.mou(0,-1)
	var r=habitacio.getRajola(1,0)
	assert(r.estaBruta(),"Casella 1,0 bruta")	
	console.log(habitacio.toString())
	j.mou(0,1)	
	console.log(habitacio.toString())
	habitacio.secaUnaMica()	
	console.log(habitacio.toString())
	*/
}

test()