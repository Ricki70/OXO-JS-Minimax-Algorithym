var checkX = [[false,false,false],[false,false,false],[false,false,false]];
var checkO = [[false,false,false],[false,false,false],[false,false,false]];

var control, turno, ronda;

window.onload = function () {
    inizializarJuego();
    inicializarTablero();
}

function inicializarTablero(){
    var celdas = document.getElementsByName("celdas");
    for (var i = 0; i < celdas.length; i++) {
        celdas[i].onmouseenter = previsualizacion;
        celdas[i].onmouseleave = limpiarPrevisualizacion;
        celdas[i].onclick =  jugada;
    }
}

function desactivarTablero(){
    var celdas = document.getElementsByName("celdas");
    for (var i = 0; i < celdas.length; i++) {
        celdas[i].onmouseenter = null;
        celdas[i].onmouseleave = null;
        celdas[i].onclick = null;
    }
}

function inizializarJuego() {
    turno = "X";
    document.getElementById("texto").value = "Turno del jugador: |" + turno + "|";
    document.getElementById("imagencabecera").src = "Imagenes/cabecera.png";
    control = false;
    turno = "X";
    ronda = 1;
    for (var filas = 0; filas < 3; filas++) {
        for (var columnas = 0; columnas < 3; columnas++) {
            checkX[filas][columnas] = false;
            checkO[filas][columnas] = false;
            var indice = filas.toString() + columnas.toString();
            document.getElementById(indice).src = "";
        }
    }
}

function previsualizacion() {
    var fila = Math.floor(this.id / 3);
    var columna = this.id % 3;
    var indice = fila.toString() + columna.toString();
    if (turno == "X" && !checkX[fila][columna] && !checkO[fila][columna]) {
        document.getElementById(indice).src = "Imagenes/Xaux.png";
    }else if(turno == "O" && !checkO[fila][columna] && !checkX[fila][columna]){ 
        document.getElementById(indice).src = "Imagenes/Oaux.png";
    }
}

function limpiarPrevisualizacion(){
    var fila = Math.floor(this.id / 3);
    var columna = this.id % 3;
    var indice = fila.toString() + columna.toString();
    if (!checkX[fila][columna] && !checkO[fila][columna]) document.getElementById(indice).src = "";
}

function jugada(){
    var fila = Math.floor(this.id / 3);
    var columna = this.id % 3;
    var indice = fila.toString() + columna.toString();
    if (!checkO[fila][columna] && !checkX[fila][columna]) {
        if (turno == "X") {
            document.getElementById(indice).src = "Imagenes/X.png";
            checkX[fila][columna] = true;
            turno = "O";
        } else {
            document.getElementById(indice).src = "Imagenes/O.png";
            checkO[fila][columna] = true;
            turno = "X";
        }
    }
    document.getElementById("texto").value = "Turno del jugador: |" + turno + "|";
    ronda++;
    if (comprobarGanador()) {
        window.setTimeout(victoria, 10);
    }else if (ronda == 10) {
        window.setTimeout(empate, 10);
    }

}

function comprobarGanador() {
    var diagonalX = 0, diagonalO = 0, invertidaX = 0, invertidaO = 0
    for (var filas = 0, aux = 2; filas < 3, aux >= 0; filas++, aux--){
        var verticalO = 0, verticalX = 0, horizonotalO = 0, horizonotalX = 0;
        if (turno=="O") {
            if (checkX[filas][filas]) diagonalX++;
            if (checkX[filas][aux])   invertidaX++;
        }else{
            if (checkO[filas][filas]) diagonalO++;
            if (checkO[filas][aux])   invertidaO++;
        }
        for (var columnas = 0; columnas < 3; columnas++){
            if (turno=="O") {
                if (checkX[filas][columnas]) horizonotalX++;
                if (checkX[columnas][filas]) verticalX++;
            }else{
                if (checkO[filas][columnas]) horizonotalO++;
                if (checkO[columnas][filas]) verticalO++;
            }
        }
        if (verticalO == 3 || horizonotalO == 3 || diagonalO == 3 || invertidaO == 3 || verticalX == 3 || horizonotalX == 3 || diagonalX == 3 || invertidaX == 3) {
            return true;
        }
    }
}

function victoria(){
    if (turno == "X") {
        turno = "O";
    }else{
        turno = "X";
    }
    document.getElementById("imagencabecera").src = "Imagenes/Victoria.png";
    document.getElementById("texto").value = "Ha ganado el jugador |" + turno + "|";
    desactivarTablero();
}

function empate(){
    document.getElementById("imagencabecera").src = "Imagenes/Empate.png";
    document.getElementById("texto").value = "Nadie ha Ganado";
}