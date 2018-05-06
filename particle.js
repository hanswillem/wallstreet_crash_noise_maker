function Particle(x, y, monthText, yMonthText) {
    this.x = x;
    this.y = y;
    this.yGoal = y;
    this.r = width / 75;
    this.strWght = width / 350;
    this.speed = random(1, 5) / 20;
    this.sp = [];
    this.c = color(0, 0, 255);
    this.sw = false;
    this.monthText = monthText;
    this.monthSpeed = random(1, 5) / 20;
    this.monthIndex = monthTexts.indexOf(this.monthText);
    this.monthClr = color(255, 100);

    //fill array with small particles
    for (var i = 0; i < oscPerParticle; i++) {
        this.sp.push(new SmallParticle(this.x + random(-1 * spRange, spRange), this.y + random(-1 * spRange, spRange)));
    }

    this.show = function() {
        //big particles
        fill(this.c);
        stroke(255);
        strokeWeight(this.strWght);
        ellipse(this.x, this.y, this.r * 2, this.r * 2);
        //month text
        textSize(14);
        noStroke();
        fill(this.monthClr);
        //place the month text above or beneath the particle
        //above when the month index is uneven, beneath when even
        if (this.monthIndex % 2 === 0) {
            text(this.monthText, this.x + (this.r / 2), this.y + (this.r * 2));
        } else {
            text(this.monthText, this.x + (this.r / 2), this.y - (this.r * 2));
        }
        //----------------------------------------------------------
        //uncomment for visual representation of the small particles
        //----------------------------------------------------------
        // for (var i = 0; i < this.sp.length; i++) {
        //     noFill();
        //     stroke(255, 100);
        //     strokeWeight(1);
        //     this.sp[i].show();
        //     line(this.x, this.y, this.sp[i].x, this.sp[i].y);
        // }
    };

    this.update = function() {
        this.y = lerp(this.y, this.yGoal, this.speed);
        for (var i = 0; i < this.sp.length; i++) {
            this.sp[i].update();
        }
    };

    //switch on or off the sound belonging to this particle
    this.switchOnOff = function() {
        //switch to on
        if (this.sw === false) {
            this.sw = true;
            if (muteAllSw === true) {
                this.mute();
            } else {
                this.c = color(255, 0, 0);
                for (var i = 0; i < this.sp.length; i++) {
                    this.sp[i].osc.amp(1.0, 0.01);
                }
            }
            //switch to off
        } else {
            this.sw = false;
            this.c = color(0, 0, 255);
            for (var i = 0; i < this.sp.length; i++) {
                this.sp[i].osc.amp(0.0, 0.01);
            }
        }
    };

    //mute the sound
    this.mute = function() {
        if (this.sw === true) {
            for (var i = 0; i < this.sp.length; i++) {
                this.sp[i].osc.amp(0.0, 0.01);
                this.c = color(0);
            }
        }
    };

    //unmute the sound
    this.unMute = function() {
        if (this.sw === true) {
            for (var i = 0; i < this.sp.length; i++) {
                this.sp[i].osc.amp(1.0, 0.01);
                this.c = color(255, 0, 0);
            }
        }
    };
}
