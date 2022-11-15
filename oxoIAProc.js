var imgJugador = new Image();
imgJugador.src = "Imagenes/O.png";
var imgIA = new Image();
imgIA.src = "Imagenes/X.png";
var tablero = new Array();
var celdasTablero = 9;
var celdasLibres = ' ';
var jugador = 'O';
var IA = 'X';
var turnoActual = "HUMAN";
var eleccion;

window.onload = function () {
    nuevoJuego();
    inicializarTablero();
}

function inicializarTablero(){
    var celdas = document.getElementsByName("celdas");
    for (var i = 0; i < celdas.length; i++) {
        celdas[i].onmouseenter = previsualizacion;
        celdas[i].onmouseleave = limpiarPrevisualizacion;
        celdas[i].onclick =  movimiento;
    }
}

function nuevoJuego()
{
    for (i = 0; i < celdasTablero; i++)
    {
        tablero[i] = celdasLibres;
        document.getElementById(i).src = "";
    }
}

function previsualizacion() {
    if (tablero[this.id] == celdasLibres) {
        document.getElementById(this.id + this.id).src = "Imagenes/Oaux.png";
    }
}

function limpiarPrevisualizacion(){
    if (tablero[this.id] == celdasLibres) document.getElementById(this.id + this.id).src = "";
}

function movimiento()
{
    if (comprobarGanador(tablero) === 0 && tablero[this.id] == celdasLibres)
    {
        var aux;
        tablero[this.id] = jugador;
        document.getElementById(this.id + this.id).src = imgJugador.src;
        aux = comprobarGanador(tablero);
        if (aux === 0)
        {
            turnoActual = "COMPUTER";
            setTimeout(movimientoIA, 100);
        }else if (aux === 1){
            document.getElementById("imagencabecera").src = "Imagenes/Empate.png";
        }
    }
}

function movimientoIA()
{
    minimax(tablero, 0);
    var aux;
    var movimiento = eleccion;
    tablero[movimiento] = IA;
    document.getElementById(movimiento.toString() + movimiento.toString()).src = imgIA.src;
    eleccion = [];
    turnoActual = "HUMAN";
    aux = comprobarGanador(tablero);
    if (aux === 3){
        document.getElementById("imagencabecera").src = "Imagenes/Derrota.png";
    }
}

function puntuacion(juego, profundidad) {
    var puntuacion = comprobarGanador(juego);
    if (puntuacion === 1)
        return 0;
    else if (puntuacion === 2)
        return profundidad-10;
    else if (puntuacion === 3)
        return 10-profundidad;
}

function minimax(tableroTemporal, profundidad) {
    if (comprobarGanador(tableroTemporal) !== 0)
        return puntuacion(tableroTemporal, profundidad);

    profundidad+=1;
    var puntuaciones = new Array();
    var movimientos = new Array();
    var movimientosPosibles = getMovimientosDisponibles(tableroTemporal);
    var movimiento, possible_game;
    for(var i=0; i < movimientosPosibles.length; i++) {
	movimiento = movimientosPosibles[i];
        possible_game = getNuevoEstado(movimiento, tableroTemporal);
        puntuaciones.push(minimax(possible_game, profundidad));
        movimientos.push(movimiento);
        tableroTemporal = deshacerMovimiento(tableroTemporal, movimiento);
    }

    var maxPunt, maxPuntIndex, minPunt, minPuntIndex;
    if (turnoActual === "COMPUTER") {
        maxPunt = Math.max.apply(Math, puntuaciones);
        maxPuntIndex = puntuaciones.indexOf(maxPunt);
        eleccion = movimientos[maxPuntIndex];
        return puntuaciones[maxPuntIndex];

    } else {
        minPunt = Math.min.apply(Math, puntuaciones);
        minPuntIndex = puntuaciones.indexOf(minPunt);
        eleccion = movimientos[minPuntIndex];
        return puntuaciones[minPuntIndex];
    }
}

function deshacerMovimiento(juego, movimiento) {
    juego[movimiento] = celdasLibres;
    cambiarTurno();
    return juego;
}

function getNuevoEstado(movimiento, juego) {
    var pieza = cambiarTurno();
    juego[movimiento] = pieza;
    return juego;
}

function cambiarTurno() {
    var pieza;
    if (turnoActual === "COMPUTER") {
        pieza = 'X';
        turnoActual = "HUMAN";
    } else {
        pieza = 'O';
        turnoActual = "COMPUTER";
    }
    return pieza;
}

function getMovimientosDisponibles(juego) {
    var movimientosPosibles = new Array();
    for (var i = 0; i < celdasTablero; i++)
        if (juego[i] === celdasLibres)
            movimientosPosibles.push(i);
    return movimientosPosibles;
}

// comprobarGanador.  Return
//   0 Si aun no hay ganador o empate
//   1 cuando hay un empate
//   2 Cuando gana el jugador
//   3 cuando gana la IA
function comprobarGanador(juego) {
    // Horizontal
    for (i = 0; i <= 6; i += 3)
    {
        if (juego[i] === jugador && juego[i + 1] === jugador && juego[i + 2] === jugador)
            return 2;
        if (juego[i] === IA && juego[i + 1] === IA && juego[i + 2] === IA)
            return 3;
    }

    // Vertical
    for (i = 0; i <= 2; i++)
    {
        if (juego[i] === jugador && juego[i + 3] === jugador && juego[i + 6] === jugador)
            return 2;
        if (juego[i] === IA && juego[i + 3] === IA && juego[i + 6] === IA)
            return 3;
    }

    // Diagonal
    if ((juego[0] === jugador && juego[4] === jugador && juego[8] === jugador) ||
            (juego[2] === jugador && juego[4] === jugador && juego[6] === jugador))
        return 2;

    if ((juego[0] === IA && juego[4] === IA && juego[8] === IA) ||
            (juego[2] === IA && juego[4] === IA && juego[6] === IA))
        return 3;

    // Empate
    for (i = 0; i < celdasTablero; i++)
    {
        if (juego[i] !== jugador && juego[i] !== IA)
            return 0;
    }
    return 1;
}