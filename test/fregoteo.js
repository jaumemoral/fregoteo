describe("Provant fregoteo", function() {
  var habitacio=new Habitacio(3,3).buida();
  var jugador=new Jugador(habitacio,new Posicio(0,0));
  var galleda=new Galleda(new Posicio(0,0),20);

  it("Casella (0,0) seca  quan freguem sense aigua", function() {
    jugador.frega()
	var r=habitacio.getRajola(new Posicio(0,0))
    expect(r.estaMolla()).toBe(false);
  });

  it("Casella (0,0) molla quan freguem amb aigua", function() {
    jugador.mullaFregona(galleda)
    jugador.frega()
	var r=habitacio.getRajola(new Posicio(0,0))
    expect(r.estaMolla()).toBe(true);
  });

  it("Casella (1,0) molla quan hi anem i freguem", function() {
    jugador.mullaFregona(galleda)
    jugador.mou(new Posicio(1,0));
    jugador.frega()
	var r=habitacio.getRajola(new Posicio(1,0))
    expect(r.estaMolla()).toBe(true);
  });

  it("Casella (0,0) trepiatjada quan esta molla i trepitgem", function() {
    jugador.mullaFregona(galleda)
    jugador.frega()
    jugador.mou(new Posicio(1,0));
    jugador.frega()
    jugador.mou(new Posicio(0,0));
	var r=habitacio.getRajola(new Posicio(0,0))
    expect(r.estaTrepitjada()).toBe(true);
  });

  it("Casella (0,0) seca esperant un rato", function() {
    jugador.mullaFregona(galleda)
    jugador.frega()
    jugador.mou(new Posicio(1,0));
    habitacio.secaUnaMica()
    habitacio.secaUnaMica()
    habitacio.secaUnaMica()
    habitacio.secaUnaMica()
    habitacio.secaUnaMica()
    habitacio.secaUnaMica()
    habitacio.secaUnaMica()
    habitacio.secaUnaMica()
    habitacio.secaUnaMica()
    habitacio.secaUnaMica()
	var r=habitacio.getRajola(new Posicio(0,0))
    expect(r.estaMolla()).toBe(false);
  });

  it("Una rajola es igual que una altra pero si canvia llavors ja no", function() {
    var rajola=new Rajola(new Posicio(1,1));
    rajola.estatAnterior=rajola.clone();
    expect(rajola.equals(rajola.estatAnterior)).toBe(true);
    console.log(rajola.toString())
    console.log(rajola.estatAnterior.toString())
    rajola.frega();
    console.log(rajola.toString())
    console.log(rajola.estatAnterior.toString())
    expect(rajola.equals(rajola.estatAnterior)).toBe(false);
  });

  it("Idem amb la funcio haCanviat", function() {
    var rajola=new Rajola(new Posicio(1,1));
    expect(rajola.haCanviat()).toBe(true);
    expect(rajola.haCanviat()).toBe(false);
    rajola.frega();
    expect(rajola.haCanviat()).toBe(true);
    expect(rajola.haCanviat()).toBe(false);
  });

});
    



