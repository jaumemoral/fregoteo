var CAPACITAT_FREGONA=5;
var VELOCITAT=2;
var MIDA_RAJOLA=64;

function Posicio(fila,columna) {
	this.fila=fila;
	this.columna=columna;

	this.igual=function(altraPosicio) {
		if (altraPosicio==null) return false;
		return (this.fila==altraPosicio.fila && this.columna==altraPosicio.columna);
	}

	this.coordenadaX=function() {
		return this.columna*MIDA_RAJOLA;
	}

	this.coordenadaY=function() {
		return this.fila*MIDA_RAJOLA;
	}

	this.toString=function () {
		return "("+this.fila+","+this.columna+")";
	}

	this.mou=function (direccio) {
		if (direccio==null) return this;
		return new Posicio(this.fila+direccio[0],this.columna+direccio[1]);
	}

	this.calculaDireccioCapA=function(posicio) {
		if (this.fila>posicio.fila) return Direccio.AMUNT;
		if (this.fila<posicio.fila) return Direccio.AVALL;
		if (this.columna>posicio.columna) return Direccio.ESQUERRA;
		if (this.columna<posicio.columna) return Direccio.DRETA;
	}
}

var Direccio={
	'ESQUERRA':[0,-1],
	'AMUNT':[-1,0],
	'AVALL':[1,0],
	'DRETA':[0,1]
}

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
	this.direccio=null;
	this.aiguaFregona=0;

	this.frega = function() {
		if (this.aiguaFregona>0) {
			rajola=habitacio.getRajola(this.posicio);
			rajola.frega();
			this.aiguaFregona--;
		}
	}

	this.vesCap = function (direccio) {
		this.direccio=direccio;
		this.setDesti();
	}

	this.vesCasella = function (posicio) {
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

	this.setDesti = function () {
		if (!this.quiet()) return;
		var possibleDesti=this.desti.mou(this.direccio);
		if (!this.habitacio.posicioValida(possibleDesti)) return
		
		this.desti=possibleDesti;
		this.direccio=null;
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
}

var ConstructorJoc={
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
		return new Joc (h,j,g,pantalla.temps)
	}	
}

function Habitacio(ample,alt) {
	var self=this;
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
