var CAPACITAT_FREGONA=5;
var VELOCITAT=2;
var MIDA_RAJOLA=64;

// ----------------------------------------------------

function Posicio(fila,columna) {
	this.fila=fila;
	this.columna=columna;
}

Posicio.prototype.igual=function(altraPosicio) {
	if (altraPosicio==null) return false;
	return (this.fila==altraPosicio.fila && this.columna==altraPosicio.columna);
}

Posicio.prototype.coordenadaX=function() {
	return this.columna*MIDA_RAJOLA;
}

Posicio.prototype.coordenadaY=function() {
	return this.fila*MIDA_RAJOLA;
}

Posicio.prototype.toString=function () {
	return "("+this.fila+","+this.columna+")";
}

Posicio.prototype.mou=function (direccio) {
	if (direccio==null) return this;
	return new Posicio(this.fila+direccio[0],this.columna+direccio[1]);
}

Posicio.prototype.calculaDireccioCapA=function(posicio) {
	if (this.fila>posicio.fila) return Direccio.AMUNT;
	if (this.fila<posicio.fila) return Direccio.AVALL;
	if (this.columna>posicio.columna) return Direccio.ESQUERRA;
	if (this.columna<posicio.columna) return Direccio.DRETA;
}

Posicio.prototype.clone = function() {
	var r=new Posicio(this.fila,this.columna);
	return r;
}

// ----------------------------------------------------

var Direccio={
	index:['AMUNT','ESQUERRA','AVALL','DRETA'],
	'ESQUERRA':[0,-1],
	'AMUNT':[-1,0],
	'AVALL':[1,0],
	'DRETA':[0,1],
	oposada: function (origen) {
		if (origen==Direccio.ESQUERRA) return Direccio.DRETA;
		if (origen==Direccio.AMUNT) return Direccio.AVALL;
		if (origen==Direccio.DRETA) return Direccio.ESQUERRA;
		if (origen==Direccio.AVALL) return Direccio.AMUNT;
	},
	random: function () {		
		var r=Math.floor(Math.random()*4);
		return Direccio[Direccio.index[r]];
	},
	seguent: function (origen) {		
		for (var i=0;i<4;i++) {
			if (origen==Direccio[Direccio.index[i]]) return Direccio[Direccio.index[(i+1)%4]];
		}
		return null;
	}

}

// ----------------------------------------------------

function Crono(temps) {
	this.temps=temps
	this.abans=new Date().getTime()

	this.pas=function() {
		var ara=new Date().getTime();
		if (ara>this.abans+1000) {
			this.abans=ara
			if (this.temps>0) this.temps--;
		}
	}

}

// ----------------------------------------------------
		
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

// ----------------------------------------------------

function Personatge(habitacio,posicio) {
	this.habitacio=habitacio;
	this.posicio=posicio;
	this.desti=posicio;
	this.origen=posicio;
	this.x=this.posicio.coordenadaX();
	this.y=this.posicio.coordenadaY();
	this.direccio=null;	
	this.peusMolls=0;	
}

Personatge.prototype.vesCap = function (direccio) {
	this.direccio=direccio;
	this.setDesti();
}

Personatge.prototype.vesCasella = function (posicio) {
	if (!this.quiet()) return;
	var direccio=this.posicio.calculaDireccioCapA(posicio)
	var p=this.posicio;
	this.desti=p;
	while (!p.igual(posicio)) {
		p=p.mou(direccio);
		if (!this.habitacio.posicioValida(p)) return;
		this.desti=p;
	}
}	

Personatge.prototype.mou = function (posicio) {
	this.origen=this.posicio;
	this.posicio=posicio;	
	var rajola=this.habitacio.getRajola(this.posicio);
	rajola.trepitja(this);
	this.secaPeus();
}

Personatge.prototype.direccioArribada = function() {
	return this.origen.calculaDireccioCapA(this.posicio);
}

Personatge.prototype.setDesti = function () {
	if (!this.quiet()) return;
	var possibleDesti=this.desti.mou(this.direccio);
	if (!this.habitacio.posicioValida(possibleDesti)) return
	
	this.desti=possibleDesti;
	this.direccio=null;
}	

Personatge.prototype.tePeusMolls = function () {
	return this.peusMolls>0;
}

Personatge.prototype.mullaPeus = function (aigua) {
	this.peusMolls=aigua
}

Personatge.prototype.secaPeus = function () {
	if (this.tePeusMolls) this.peusMolls--;
}

Personatge.prototype.estaSobre = function (cosa) {
	return (this.posicio.igual(cosa.posicio));
}

Personatge.prototype.quiet= function () {
	return (this.posicio.igual(this.desti));
}

Personatge.prototype.pas=function() {
	if (this.quiet()) return;

	// Movem cap on calgui
	if (this.desti.fila>this.posicio.fila) this.y+=VELOCITAT;
	if (this.desti.fila<this.posicio.fila) this.y-=VELOCITAT;
	if (this.desti.columna>this.posicio.columna) this.x+=VELOCITAT;
	if (this.desti.columna<this.posicio.columna) this.x-=VELOCITAT;

	// Anem trepitjant al passar per cada casella
	if ((this.x%MIDA_RAJOLA==0)&&(this.y%MIDA_RAJOLA==0)) {
		this.mou(new Posicio(this.y/MIDA_RAJOLA,this.x/MIDA_RAJOLA))
	}

	// Fins arribar al nostre desti	
	if ((this.x==this.desti.coordenadaX())&&(this.y==this.desti.coordenadaY())){
		this.setDesti()
	} 
}

// ----------------------------------------------------

function Jugador(habitacio,posicio) {
	Personatge.call(this,habitacio,posicio);
	this.aiguaFregona=0;
}


Jugador.prototype=Object.create(Personatge.prototype);
Jugador.prototype.constructor=Jugador;

Jugador.prototype.frega = function() {
	if (this.aiguaFregona>0) {
		rajola=this.habitacio.getRajola(this.posicio);
		rajola.frega();
		this.aiguaFregona--;
	}
}

Jugador.prototype.mullaFregona = function (galleda) {
	var quantitatAigua=galleda.aigua>CAPACITAT_FREGONA?CAPACITAT_FREGONA:galleda.aigua;
	this.aiguaFregona=quantitatAigua;
	galleda.aigua-=quantitatAigua;
}

Jugador.prototype.agafaGalleda = function (galleda) {
	galleda.agafa(this)
}

Jugador.prototype.deixaGalleda = function (galleda) {
	galleda.deixa()
}

// ----------------------------------------------------

function Gat(habitacio,posicio) {
	Personatge.call(this,habitacio,posicio);
	this.setDesti();
}

Gat.prototype=Object.create(Personatge.prototype);
Gat.prototype.constructor=Gat;

Gat.prototype.setDesti = function () {
	if (!this.quiet()) return;
	var siNoHiHaMesRemei = Direccio.oposada(this.direccioArribada());
	var direccio=Direccio.random();
	for (var i=0;i<4;i++) {		
		direccio=Direccio.seguent(direccio);
		possibleDesti=this.desti.mou(direccio);
		if (this.habitacio.posicioValida(possibleDesti) && direccio!=siNoHiHaMesRemei) {
			this.desti=possibleDesti;
			return
		}
	}
	this.desti=this.desti.mou(siNoHiHaMesRemei);
}	

// ----------------------------------------------------

var ConstructorPantalles={
	desdePantalla:function (pantalla) {
		var strings=pantalla.habitacio;
		var ample=strings[0].length;
		var alt=strings.length;
		var h=new Habitacio(ample,alt);
		var j=null;
		var g=null;
		var posicioGalleda=null;
		for (var fila=0;fila<h.alt;fila++) {			
			h.rajoles.push([]);
			for (var columna=0;columna<h.ample;columna++) {
				var p=new Posicio(fila,columna)
				var lletra=strings[fila].charAt(columna);
				var r=null;
				if (lletra!='X') r=new Rajola(p);
				if (lletra=='J') j=new Jugador(h,p);
				if (lletra=='G') posicioGalleda=p;
				h.rajoles[fila].push(r);
			}
		}
		h.init();
		g=new Galleda(posicioGalleda,h.llistaRajoles.length+5);
		var gat=null;
		if (pantalla.gat>0) gat=new Gat(h,j.posicio.clone());
		return new Pantalla(h,j,g,gat,pantalla.temps)
	},
	carrega:function(npantalla) {
		return ConstructorPantalles.desdePantalla(PANTALLES[npantalla]);
	}
}

// ----------------------------------------------------

function Habitacio(ample,alt) {
	this.rajoles=[];
	this.ample=ample;
	this.alt=alt;

	this.buida = function() {
		this.rajoles=[];
		for (var i=0;i<this.alt;i++) {
			var fila=[]
			for (var j=0;j<this.ample;j++) {
				var r=new Rajola(new Posicio(i,j))
				fila.push(r);
			}
			this.rajoles.push(fila);
		}
		this.init();
		return this;
	}

	this.init = function() {
		this.llistaRajoles=[];
		for (var i=0;i<this.alt;i++) {
			for (var j=0;j<this.ample;j++) {
				var r=this.rajoles[i][j]
				if (r!=null) this.llistaRajoles.push(r);
			}
		}
		this.abans=new Date().getTime()
	}

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
				if (r!=null)
					resultat+=r.toString()
				else 
					resultat+="[  ]"
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
		if (posicio.fila>=this.alt) return false;
		if (posicio.columna>=this.ample) return false;
		if (this.getRajola(posicio)==null) return false;
		return true;
	}

	this.pas = function() {
		var ara=new Date().getTime();
		if (ara>this.abans+1000) {
			this.abans=ara
			this.secaUnaMica();
		}
	}
}

// ----------------------------------------------------

function Rajola(posicio) {
	this.bruta=true;
	this.trepitjada=null;
	this.molla=0;
	this.posicio=posicio;
	this.estatAnterior=null;
	this.abans=new Date().getTime();
}

Rajola.prototype.frega=function() {
	this.estatAnterior=this.clone();
	this.bruta=false;
	this.trepitjada=null;
	this.molla=9;
}

Rajola.prototype.trepitja=function(personatge) {
	if (personatge.tePeusMolls()||this.estaMolla()) {
		this.estatAnterior=this.clone();
		this.trepitjada={personatge:personatge,direccio:personatge.direccioArribada()};
	} 		
	if (this.estaMolla()) {
		personatge.mullaPeus(this.molla)
	} 		
}

Rajola.prototype.secaUnaMica=function()	{
	if (this.estaMolla()) {
		this.molla--;
	}
}

Rajola.prototype.estaMolla=function()	{
	return (this.molla>0);
}

Rajola.prototype.estaBruta=function()	{
	return (this.bruta);
}

Rajola.prototype.estaTrepitjada=function()	{
	return (this.trepitjada!=null);
}

Rajola.prototype.toString = function() {
	return "["+(this.bruta?"X":".")+this.trepitjada+this.molla+"]"
}

Rajola.prototype.estaIgualDeBruta = function (altra) {
	if (altra==null) return false;
	var igual=(this.bruta==altra.bruta) && (this.trepitjada==altra.trepitjada);
	return igual;
}

Rajola.prototype.haCanviat = function() {
	var canviat= !this.estaIgualDeBruta(this.estatAnterior);
	this.estatAnterior=this.clone();
	return canviat;
}

Rajola.prototype.clone = function() {
	var r=new Rajola(this.posicio);
	r.bruta=this.bruta;
	r.molla=this.molla;
	r.trepitjada=this.trepitjada;
	return r;
}

Rajola.prototype.pas = function() {
	var ara=new Date().getTime();
	if (ara>this.abans+1000) {
		this.abans=ara
		this.secaUnaMica();
	}
}
