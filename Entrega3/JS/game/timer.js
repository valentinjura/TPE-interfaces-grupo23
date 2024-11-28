class Timer {
    constructor(time, ctx, game) {
        this.initialTime = time;
        this.ctx = ctx;
        this.game = game;
        this.pausa = false;
        this.remainingtime = time;
        this.empate = false;
        //Funcionamiento del Timer
        this.contar = setInterval(() => {
            if(this.game.isHabilitado()){
                if (this.remainingtime >= 0  && !this.pausa && !this.empate ) {
                    this.drawTimer();
                    this.remainingtime--;
                } else if (this.remainingtime < 0) {
                    this.borrarIntervalo();
                    this.empate = true;
                    this.game.finalizarJuego();
                    this.game.drawEmpate();
                }
            }
        }, 1000);
    }
    
    //Reinicia el temporizador
    resetTimer() {
        this.remainingtime = this.initialTime;
    }

    //Borra el intervalo
    borrarIntervalo() {
        clearInterval(this.contar);
    }

    
    drawTimer() {
        this.ctx.clearRect(40 - 50, 0, 100, 50);
        
        this.ctx.fillStyle = "#fff";
        this.ctx.fillRect(40 - 50, 0, 100, 50);
        
        const minutes = Math.floor(this.remainingtime / 60);
        const seconds = this.remainingtime % 60;
        
        const timeText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        this.ctx.font = "24px 'Montserrat', sans-serif";
        this.ctx.fillStyle = '#000';
        this.ctx.textAlign = 'center';
    
        this.ctx.fillText(timeText, 43, 33);
    }

    //Devuelve el tiempo en este momento
    getRemainingTime(){
        return this.remainingtime;
    }

    //Pausa y despausa el tiempo
    setPausa(pausa) {
        this.pausa = pausa;
    }

    //Devuelve si es empate
    isEmpate(){
        return this.empate;
    }

}