//*****************************
//WALL STREET CRASH NOISE MAKER
//*****************************

var p; //array with the particles
var dj; //array for dow jones data
var spRange; //the maximum distance from the smallParticles to the particle they belong to
var oscPerParticle; //amount of oscillators per particle
var years; //array with the years
var currentYear; //the current year being displayed
var toolTips; //array with tooltips
var muteAllSw; //boolean that holds the mute-state of the particles
var ms; //the variable that holds the time the mouse hasn't moved (for the tool tips)
var imgSoundOn; //variable for the sound on image
var imgSoundOff; //variable for the sound off image
var monthTexts; //array with the texts of the months
var started; //bool for starting the sketch

function preload() {
    table = loadTable('data/dowjones.csv', 'csv');
    imgSoundOn = loadImage('img/soundOn.png');
    imgSoundOff = loadImage('img/soundOff.png');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    started = false;
    spRange = 40;
    oscPerParticle = 3;
    muteAllSw = true;
    setupYears();
}

//sets up the years array, makes a grid of particles and sets up the starting year
function setupYears() {
    years = [
        [1901, 'The murder of President McKinley and severe drought'],
        [1907, 'Roosevelt threatened to rein railway monopolies'],
        [1929, 'The Wall Street crash of 1929'],
        [1930, 'The aftermath of the Wall Street crash of 1929'],
        [1962, 'The flash crash'],
        [2000, 'The dot com bubble'],
        [2001, 'Nine eleven'],
        [2007, 'The financial crisis'],
        [2008, 'The financial crisis'],
        [2009, 'The financial crisis']
    ];
    currentYear = 2; //set the starting year to 1929
    monthTexts = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    makeGridOfParticles(12, 50);
    newYear(years[currentYear][0]);
    // switch a few particles on to start with
    p[0].switchOnOff();
    p[5].switchOnOff();
    p[8].switchOnOff();
    p[9].switchOnOff();
    p[10].switchOnOff();
    p[11].switchOnOff();
}

function draw() {
    if (started === true) {
        background(0, 0, 255);
        drawLine();
        drawParticles();
        drawMenu();
        enLargeSelectedParticle();
        hasMouseStopped();
        toolTip();
        animateSoundIcon();
    } else {
        startScreen();
    }
}

//draws the line through the particles
function drawLine() {
    stroke(255);
    strokeWeight(1);
    for (var i = 0; i < p.length; i++) {
        if (i > 0) {
            line(p[i - 1].x, p[i - 1].y, p[i].x, p[i].y);
        }
    }
}

//draw the particles to the canvas
function drawParticles() {
    for (var i = 0; i < p.length; i++) {
        p[i].show();
        p[i].update();
    }

}

//what to do when the mouse is clicked
function mouseClicked() {
    if (started === true) {
        if (mouseX < 85 && mouseY > 85 && mouseY < 145) {
            muteAllSw = !muteAllSw;
            if (muteAllSw === true) {
                muteAll();
            } else {
                unMuteAll();
            }
        } else if (mouseX < 50 || mouseX > width - 50) {
            if (mouseX < 135) {
                if (currentYear > 0) {
                    currentYear -= 1;
                } else {
                    currentYear = years.length - 1;
                }
                newYear(years[currentYear][0]);
            } else {
                if (currentYear < years.length - 1) {
                    currentYear += 1;
                } else {
                    currentYear = 0;
                }
                newYear(years[currentYear][0]);
            }
        } else {
            var selectedParticle = getSelectedParticle();
            if (selectedParticle === undefined) {
                // currentYear = int(random(years.length));
                currentYear = pickRandomYear();
                newYear(years[currentYear][0]);
            } else {
                selectedParticle.switchOnOff();
            }
        }
    } 
}

//pick a random year index number
function pickRandomYear() {
    var l = [];
    for (var i = 0; i < years.length; i++) {
        l.push(i);
    }
    l.splice(currentYear, 1);
    var index = int(random(l.length));
    return l[index];
}

//replaces the current year with a new year
function newYear(n) {
    dj = getMonths(n);
    dj = mapArray(dj, height - 100, 125);
    addArrayToGrid(dj);
}

//makes a grid of particles
function makeGridOfParticles(n, margin) {
    p = [];
    var w = width - (margin * 2);
    var xOffset = w / n;
    var x = margin + (xOffset / 2);
    for (var i = 0; i < n; i++) {
        p.push(new Particle(x, height / 2, monthTexts[i]));
        x += xOffset;
    }
}

//adds the dow jones array to the particles and to the mini particles
function addArrayToGrid(a) {
    for (var i = 0; i < p.length; i++) {
        p[i].yGoal = a[i];
        p[i].speed = random(1, 5) / 20;
        for (var j = 0; j < p[i].sp.length; j++) {
            p[i].sp[j].yGoal = p[i].yGoal + random(-1 * spRange, spRange);
            p[i].sp[j].xGoal = p[i].x + random(-1 * spRange, spRange);
            p[i].sp[j].speed = random(1, 5) / 20;
        }
    }
}

//returns an array with values per month from year n
function getMonths(n) {
    var l = [];
    var m = 0;
    for (var r = 0; r < table.getRowCount(); r++)
        for (var c = 0; c < table.getColumnCount(); c++) {
            var dt = table.getString(r, 0); //the whole string with the date
            var dy = dt.substring(8, 10); //day (not used right now)
            var mn = dt.substring(5, 7); //month
            var yr = dt.substring(0, 4); //year
            if (int(yr) === n) {
                if (int(mn) !== m) {
                    var vl = table.getString(r, 1); //value
                    l.push(vl);
                    m++;
                }
            }
        }
    return l;
}

//remaps an array
function mapArray(a, s, e) {
    var l = [];
    var low = min(a);
    var high = max(a);
    for (var i = 0; i < a.length; i++) {
        l.push(map(a[i], low, high, s, e));
    }
    return l;
}

//enlarges the particle when the mouse is over the particle
function enLargeSelectedParticle() {
    for (var i = 0; i < p.length; i++) {
        if (isParticleSelected(p[i]) === true) {
            p[i].r = lerp(p[i].r, (width / 75) * 1.5, 0.5);
            p[i].monthClr = color(255);
        } else {
            p[i].r = lerp(p[i].r, (width / 75) * 1.0, 0.25);
            p[i].monthClr = color(0, 100);
        }
    }
}

//check if a specific particle is selected
function isParticleSelected(p) {
    var d = dist(mouseX, mouseY, p.x, p.y);
    if (d < p.r) {
        return true;
    } else {
        return false;
    }
}

//returns the currently selected particle
function getSelectedParticle() {
    for (var i = 0; i < p.length; i++) {
        if (isParticleSelected(p[i]) === true) {
            return p[i];
        }
    }
}

//returns true if any of the particles are selected
function isAnyParticleSelected() {
    var ans = false;
    for (var i = 0; i < p.length; i++) {
        if (isParticleSelected(p[i]) === true) {
            ans = true;
        }
    }
    return ans;
}

//draw the menu
function drawMenu() {
    //top left text
    fill(255);
    noStroke();
    textSize(50);
    text('Dow Jones ' + years[currentYear][0], 10, 50);
    textSize(25);
    text(years[currentYear][1], 10, 80);
    //sound on/off icons
    if (muteAllSw === true) {
        image(imgSoundOff, -8, 90, 100, 50);
    } else {
        image(imgSoundOn, -8, 90, 100, 50);
    }
    //buttons
    textSize(50);
    if (mouseX < 50 && mouseY > 145) {
        fill(255);
    } else {
        fill(255, 75);
    }
    text('<', 10, height / 2);
    if (mouseX > width - 50) {
        fill(255);
    } else {
        fill(255, 75);
    }
    text('>', width - 40, height / 2);
}

//check if the mouse has moved (works together with the hasMouseStopped function)
function mouseMoved() {
    if (started === true) { //otherwise you'l imediately get a tooltip after pressing the spacebar that starts the sketch
        ms = millis();
    }
}

//check if the mouse has stopped, if so, display a tooltip
function hasMouseStopped() {
    var t = millis() - ms;
    if (t > 500) {
        return true;
    }
}

//draw a tooltip in the bottom left corner
function toolTip() {
    if (hasMouseStopped() === true) {
        toolTips = [
            'click for random year',
            'previous year',
            'next year',
            'turn this month on/off',
            'turn sound on/off'
        ];
        textSize(18);
        noStroke();
        var tip;
        if (mouseX < 85 && mouseY > 85 && mouseY < 145) {
            tip = toolTips[4];
        } else if (mouseX < 50 && mouseY > 145) {
            tip = toolTips[1];
        } else if (mouseX > width - 50) {
            tip = toolTips[2];
        } else if (isAnyParticleSelected() === true) {
            tip = toolTips[3];
        } else {
            tip = toolTips[0];
        }
        var tipX;
        if (mouseX > (width - textWidth(tip))) {
            tipX = mouseX - textWidth(tip) - 20;
        } else {
            tipX = mouseX + 20;
        }
        fill(0, 50);
        rect(tipX - 20, mouseY + 10, textWidth(tip) + 40, 40);
        fill(255);
        text(tip, tipX, mouseY + 35);
    }
}

//mute all particles that are switched on
function muteAll() {
    for (var i = 0; i < p.length; i++) {
        p[i].mute();
    }
}

//unmute all particles that are switched on
function unMuteAll() {
    for (var i = 0; i < p.length; i++) {
        p[i].unMute();
    }
}

//animate the sound icon
function animateSoundIcon() {
    if (muteAllSw === false) {
        var heightBarA = sin(frameCount / 3);
        heightBarA = map(heightBarA, -1.0, 1.0, 0, -24);
        var heightBarB = sin(10 + frameCount / 3);
        heightBarB = map(heightBarB, -1.0, 1.0, 0, -24);
        var heightBarC = sin(20 + frameCount / 3);
        heightBarC = map(heightBarC, -1.0, 1.0, 0, -24);
        noStroke();
        fill(255);
        rect(46, 127, 5, heightBarA);
        rect(56, 127, 5, heightBarB);
        rect(66, 127, 5, heightBarC);
    }
}

//mute or unmute when the spacebar is pressed
function keyPressed() {
    if (keyCode === 32) {
        started = true;
        if (muteAllSw === true) {
            unMuteAll();
            muteAllSw = false;
        } else {
            muteAll();
            muteAllSw = true;
        }
    }
}

//the start screen
function startScreen() {
    noStroke();
    fill(0, 0, 255);
    rect(0, 0, width, height);
    textAlign(CENTER);
    fill(255);
    textSize(50);
    var lift = (5 / 100) * windowWidth;
    text('The Wall Street Crash Noise Maker', width / 2, height / 2 - lift);
    textSize(25);
    text('press spacebar to start making noise', width / 2, height / 2 - lift + 50);
    textAlign(LEFT);
}
