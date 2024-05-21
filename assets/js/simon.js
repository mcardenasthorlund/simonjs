class Simon{

    colores = ["#75f6ff","#e20dbf","#59b93b","#f71313"];
    colores2 = ["#00acee", "#8b0c76", "#326822", "#c20d25"];
    sonidos = ["1.mp3", "2.mp3", "3.mp3", "4.mp3"];
    

    temporizador;
    turno = 0; 

    nivel = 1;
    intentos = 0;
    esIniciado = false;
    secuencia = [];
    secuenciaUsuario = [];

    // Sonidos
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    audios = [];
    audioElements = [];

    constructor(){
        // Creamos los elementos de audio
        for (let i = 0; i < this.sonidos.length; i++) {
            this.audios[i] = new Audio("/assets/audios/" + this.sonidos[i]);
            //this.audios[i].src = "/assets/audios/" + this.sonidos[i];
            this.audioElements[i] = this.audioCtx.createMediaElementSource(this.audios[i]);
            this.audioElements[i].connect(this.audioCtx.destination);
        }
    }

    jugar(id){

        if (!this.esIniciado)
            return;

        document.getElementById('caja' + id).style.backgroundColor=this.colores[id-1];
        this.turno++;
        document.getElementById('div-contador').innerHTML = this.turno;

        // Sonido
        for (let i=0; i < this.audios.length; i++) {
            this.audios[i].pause();
        }
        this.audios[id-1].play();
        this.audios[id-1].currentTime = 0;

        this.temporizador = setTimeout(() => {
            this.soltar(id);
        }, 200);
    
        // Comprobamos si es correcto o no 
        this.secuenciaUsuario.push(id);
        if (this.secuenciaUsuario[this.turno-1] != this.secuencia[this.turno-1]) {
            this.terminar(true);
            return;
        }

        // Vemos si hemos llegado al final
        if (this.turno == this.nivel) {
            this.terminar(false);
            return;
        }
    }

    soltar(id){
        if (!this.esIniciado)
            return;

        document.getElementById('caja' + id).style.backgroundColor=this.colores2[id-1];
        clearTimeout(this.temporizador);
    }

    iniciarNivel(){
        document.getElementById('sp-nivel').innerHTML = this.nivel;
        document.getElementById('div-contador').innerHTML = `<i class="bi bi-play" style="margin-left:5px" onclick="objSimon.iniciar()"></i>`;
        this.esIniciado = false;

    }

    iniciar(){
        this.esIniciado = true;
        document.getElementById('div-contador').innerHTML = `<i class="bi bi-hourglass"></i>`;
        

        // Generamos la secuencia
        this.secuencia = [];
        this.secuenciaUsuario=  [];
        for (let i = 0; i < this.nivel; i++) {
            this.secuencia.push(Math.floor(Math.random()*4)+1);
        }
        this.turno = 0;

        console.log(this.secuencia);

        // Ejecutamos la secuencia
        for (let i = 0; i < this.secuencia.length; i++) {

            this.temporizador = setTimeout(() => {
                this.sonar(this.secuencia[i]);
            }, 500 * i);
        }

        setTimeout(() => {
            document.getElementById('div-contador').innerHTML = '0';
        }, 500 * this.secuencia.length );
    }

    terminar(esError){
        this.esIniciado = false;
        clearTimeout(this.temporizador);
        
        // Ponemos los colores de las cajas
        for (let i = 0; i < this.secuencia.length; i++) {
            document.getElementById('caja' + this.secuencia[i]).style.backgroundColor=this.colores2[this.secuencia[i]-1];
        }
        if (esError) {
            document.getElementById('resultado').style.display= 'flex';
            document.getElementById('error').style.display= 'block';
            document.getElementById('correcto').style.display= 'none';
            document.getElementById('btnReintentar').style.display= 'block';
            document.getElementById('btnSiguienteNivel').style.display= 'none';
        } else {
            document.getElementById('resultado').style.display= 'flex';
            document.getElementById('error').style.display= 'none';
            document.getElementById('correcto').style.display= 'block';
            document.getElementById('btnReintentar').style.display= 'none';
            document.getElementById('btnSiguienteNivel').style.display= 'block';
        }
    }

    siguienteNivel(){
        this.nivel++;

        document.getElementById('resultado').style.display= 'none';
        this.iniciarNivel();
    }

    reintentar(){
        document.getElementById('resultado').style.display= 'none';
        this.intentos++;
        document.getElementById('sp-intentos').innerHTML = this.intentos;
        this.iniciarNivel();
    }

    sonar(id){
        
        document.getElementById('caja' + id).style.backgroundColor=this.colores[id-1];

        for (let i=0; i < this.audios.length; i++) {
            this.audios[i].pause();
        }
        this.audios[id-1].play();
        this.audios[id-1].currentTime = 0;

        setTimeout(() => {
            document.getElementById('caja' + id).style.backgroundColor=this.colores2[id-1];
        }, 300);
    }
}