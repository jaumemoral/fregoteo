var CAPACITAT_FREGONA=5;

function Posicio(fila,columna) {
	this.fila=fila;
	this.columna=columna;

	this.igual=function(altraPosicio) {
		if (altraPosicio==null) return false;
		return (this.fila==altraPosicio.fila && this.columna==altraPosicio.columna)
	}

	this.coordenadaX=function() {
		return this.fila*64
	}

	this.coordenadaY=function() {
		return this.columna*64
	}

	this.toString=function () {
		return "("+this.fila+","+this.columna+")";
	}

}

function Galleda(posicio,aigua) {
	this.posicio=posicio;
	this.aigua=aigua;
	this.agafadaPer=null;

	this.estaAgafada = function() {
		return this.agafadaPer!=null
	}

	this.agafa = function(jugador) {
		this.agafadaPer=jugador
	}

	this.deixa = function() {
		this.posicio=this.agafadaPer.posicio;
		this.agafadaPer=null
	}
}

function Jugador(habitacio,posicio) {
	var self=this;
	this.habitacio=habitacio;
	this.posicio=posicio;

	this.desti=posicio;
	this.x=this.posicio.coordenadaX();
	this.y=this.posicio.coordenadaY();
	this.peusMolls=0;
	this.dx=0;
	this.dy=0;
	this.velocitat=2;
	this.aiguaFregona=0;

	this.frega = function() {
		if (this.aiguaFregona>0) {
			rajola=habitacio.getRajola(this.posicio);
			rajola.frega();
			this.aiguaFregona--;
		}
	}

	this.vesCap = function (dx,dy) {
		this.dx=dx;
		this.dy=dy;
		this.setDesti();
	}

	this.vesCasella = function (posicio) {
		if (this.quiet()) this.desti=posicio;
	}

	this.setDesti = function () {
		console.log("set desti")
		//if (this.quiet() && this.habitacio.posicioValida(this.fila+this.dx,this.columna+this.dy)) {
		if (this.quiet()) {
			this.desti=new Posicio(this.posicio.fila+this.dx, this.posicio.columna+this.dy);
			this.dx=0;
			this.dy=0;
		}
	}

	this.mou = function (posicio) {
		this.posicio=posicio;	
		var rajola=habitacio.getRajola(this.posicio);
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

	this.agafaGalleda = function (galleda) {
		galleda.agafa(this)
	}

	this.deixaGalleda = function (galleda) {
		galleda.deixa()
	}

	this.estaSobre = function (cosa) {
		return (this.posicio.igual(cosa.posicio));
	}

	this.secaPeus = function () {
		if (this.tePeusMolls) this.peusMolls--;
	}

	this.quiet= function () {
		return (this.posicio.igual(this.desti));
	}

	this.pas=function() {
		if (this.quiet()) return;

		// Movem cap on calgui
		if (this.desti.fila>this.posicio.fila) this.x+=this.velocitat;
		if (this.desti.fila<this.posicio.fila) this.x-=this.velocitat;
		if (this.desti.columna>this.posicio.columna) this.y+=this.velocitat;
		if (this.desti.columna<this.posicio.columna) this.y-=this.velocitat;

		// Anem trepitjant al passar per cada casella
		if ((this.x%64==0)&&(this.y%64==0)) {
			console.log("trepitjo!")
			this.mou(new Posicio(Math.floor(this.x/64),Math.floor(this.y/64)))
		}

		// Fins arribar al nostre desti	
		if ((this.x==this.desti.coordenadaX())&&(this.y==this.desti.coordenadaY())){
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
				r=new Rajola(new Posicio(i,j));
				fila.push(r)
				this.llistaRajoles.push(r);
			}
			this.rajoles.push(fila)
		}
		this.abans=new Date().getTime()
	}
	this.init();

	this.getRajola = function(posicio) {
		return this.rajoles[posicio.fila][posicio.columna];
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
				r=this.rajoles[i][j]
				resultat+=r.toString()
			}
			resultat+="\n"
		}
		return resultat;
	}

	this.rajolesBrutes=function() {
		var n=0;
		for (var i in this.llistaRajoles) {
			if (this.llistaRajoles[i].estaBruta()) n++;
		}
		return n;
	}

	this.estaSeca=function() {
		var n=0;
		for (var i in this.llistaRajoles) {
			if (this.llistaRajoles[i].estaMolla()) return
		}
		return true;
	}

	this.posicioValida=function(posicio) {
		if (posicio.fila<0) return false;
		if (posicio.columna<0) return false;
		if (posicio.fila>=alt) return false;
		if (posicio.columna>=ample) return false;
		if (this.getRajola(posicio)==null) return false;
	}

	this.pas = function() {
		var ara=new Date().getTime();
		if (ara>this.abans+1000) {
			this.abans=ara
			this.secaUnaMica();
		}
	}
}

function Rajola(posicio) {
	var self=this;
	this.bruta=true;
	this.molla=0;
	this.posicio=posicio;

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