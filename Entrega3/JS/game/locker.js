class Locker {
    constructor(ctx, width, image, height) {
        this.ctx = ctx;
        this.chip = null;
        this.x = 0;
        this.y = 0;
        this.width = width;
        this.image = image;
        this.height = height;
    }

    //GETTERS Y SETTERS DE UN CASILLERO
    getChip() {
        return this.chip;
    }

    setChip(chip) {
        this.chip = chip;
    }

    getX() {
        return this.x;
    }

    setX(x) {
        this.x = x;
    }

    getY() {
        return this.y;
    }

    setY(y) {
        this.y = y;
    }

    getImage() {
        return this.image;
    }

    setImage(image) {
        this.image = image;
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    getEmpty(){
        return this.chip == null;
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        this.ctx.closePath();
    }

    equals(locker) {
        return this.getX() == locker.getX() && this.getY() == locker.getY()
    }
}