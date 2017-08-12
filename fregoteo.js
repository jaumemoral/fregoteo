var CAPACITAT_FREGONA=5;

function Galleda(fila,columna,aigua) {
	this.fila=fila;
	this.columna=columna;
	this.aigua=aigua;
}

function Jugador(habitacio,fila,columna) {
	var self=this;
	this.habitacio=habitacio;
	this.fila=fila;
	this.columna=columna;

	this.filaDesti=fila;
	this.columnaDesti=columna;
	this.x=this.fila*64;
	this.y=this.columna*64;
	this.peusMolls=0;
	this.dx=0;
	this.dy=0;
	this.velocitat=2;
	this.aiguaFregona=0;

	this.frega = function() {
		if (this.aiguaFregona>0) {
			rajola=habitacio.getRajola(this.fila,this.columna);
			rajola.frega();
			this.aiguaFregona--;
		}
	}

	this.vesCap = function (dx,dy) {
		this.dx=dx;
		this.dy=dy;
		this.setDesti();
	}

	this.setDesti = function () {
		if (this.quiet()) {
			this.filaDesti=this.fila+this.dx;
			this.columnaDesti=this.columna+this.dy;
			this.dx=0;
			this.dy=0;
		}
	}

	this.mou = function (fila,columna) {
		this.fila=fila;
		this.columna=columna;	
		var rajola=habitacio.getRajola(this.fila,this.columna);
		rajola.trepitja(this);
		this.secaPeus();
	}

	this.tePeusMolls = function () {
		return this.peusMolls>0;
	}

	this.mullaPeus = function (aigua) {
		this.peusMolls=aigua
	}

	this.mullaFregona = function (galleda) {
		var quantitatAigua=galleda.aigua>CAPACITAT_FREGONA?CAPACITAT_FREGONA:galleda.aigua;
		this.aiguaFregona=quantitatAigua;
		galleda.aigua-=quantitatAigua;
	}

	this.estaSobre = function (cosa) {
		return (this.fila==cosa.fila)&&(this.columna==cosa.columna);
	}

	this.secaPeus = function () {
		if (this.tePeusMolls) this.peusMolls--;
	}

	this.quiet= function () {
		return (this.fila==this.filaDesti)&&(this.columna==this.columnaDesti);
	}

	this.pas=function() {
		if (this.quiet()) return;

		this.x+=(this.filaDesti-this.fila)*this.velocitat;
		this.y+=(this.columnaDesti-this.columna)*this.velocitat;		

		if ((this.x==this.filaDesti*64)&&(this.y==this.columnaDesti*64)){
			this.mou(this.filaDesti, this.columnaDesti);
			this.setDesti()
		} 
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
		this.abans=new Date().getTime()
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

	this.pas = function() {
		var ara=new Date().getTime();
		if (ara>this.abans+1000) {
			this.abans=ara
			this.secaUnaMica();
		}
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
		console.log("seca una mica "+this.molla)
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
/*
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

}

test()
*/