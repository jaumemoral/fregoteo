describe("Provant fregoteo", function() {
  var habitacio=new Habitacio(3,3);
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

  it("Casella (0,0) bruta quan esta molla i trepitgem", function() {
    jugador.mullaFregona(galleda)
    jugador.frega()
    jugador.mou(new Posicio(1,0));
    jugador.frega()
    jugador.mou(new Posicio(0,0));
	var r=habitacio.getRajola(new Posicio(0,0))
    expect(r.estaBruta()).toBe(true);
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


});
    



