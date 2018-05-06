function SmallParticle(x, y) {
    this.x = x;
    this.y = y;
    this.xGoal = this.x;
    this.yGoal = this.y;
    this.speed = random(1, 5) / 20;

    //audio
    this.oscTypes = ['square', 'sawtooth'];
    this.type = this.oscTypes[int(random(this.oscTypes.length))];
    this.osc = new p5.Oscillator();
    this.osc.setType(this.type);
    this.freqScaler = 0;
    this.f = map(this.y, height, 0, 0, 512);
    this.osc.freq(this.f + this.freqScaler);
    this.osc.amp(0);
    this.p = map(this.x, 0, width, -1, 1);
    this.osc.pan(this.p);
    this.osc.start();

    this.show = function() {
        noFill();
        stroke(255, 100);
        strokeWeight(1);
        ellipse(this.x, this.y, 5, 5);
    };

    this.update = function() {
        this.x = lerp(this.x, this.xGoal, this.speed);
        this.y = lerp(this.y, this.yGoal, this.speed);

        //audio
        this.f = map(this.y, height, 0, 0, 512);
        this.osc.freq(this.f + this.freqScaler);
        this.freqScaler = random(-0.000025 * (this.y * this.y), 0.000025 * (this.y * this.y));
    };
}
