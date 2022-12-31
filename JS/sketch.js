var song;
var image;
var fft;
var particles = [];

var audioEl;
var currentLyric = '';
var lyricDiv;
var lrcStrings;


//const song_input = document.querySelector("#file-upload");
function preload(){
  song = loadSound("/assets/music/docthan.mp3");
  image = loadImage("/assets/picture/background2.png");
 // lrcStrings = loadStrings('song.lrc')
}
function setup() {
 createCanvas(windowWidth,windowHeight);
 // noCanvas();
  angleMode(DEGREES);
  //imageMode(CENTER);
  fft = new p5.FFT ();
  image.filter(BLUR,2);
  
 // lrcStrings = lrcStrings.join('\n');
 // lrc.js library converts Strings to JSON
  //  var lrcJSON = new Lrc(lrcStrings);

//  iterate through each line of the LRC file to get a Time and Lyric
  // for (var i = 0; i < lrcJSON.lines.length; i++) {
  //   var time = lrcJSON.lines[i].time;
  //   var lyric = lrcJSON.lines[i].txt.valueOf();

  //   // schedule events to trigger at specific times during audioEl playback
  //   audioEl.addCue(time, showLyric, lyric);
  // }

  // create a <div> to hold the lyrics and give it some style
//  lyricDiv = createDiv('');
//   lyricDiv.style('font-size', '48px')
//   lyricDiv.style('padding', '10px')
//   lyricDiv.style('margin', 'auto')
  
 }
// function showLyric(value) {
//   var lyric = value;

//   // if lyric is empty, clear the lyricDiv
//   if (lyric === '') {
//     lyricDiv.html('');
//     return;
//   }

//   // othewrwise, create a new <span> with the lyric, followed by a space
//   currentLyric = lyric + ' ';
//   var newLyric = createSpan(currentLyric);

//   // give it a random color
//   newLyric.style('color', 'rgba(' + int(random(0,255)) + ', ' + int(random(0,255)) + ', ' + int(random(0,255)) +', 255)' );

//   // append newLyric to the lyricDiv
//   lyricDiv.child(newLyric);
// }
// create moving wave
function draw() {
  background(image,100);
  
  stroke(200);
  strokeWeight(3.5);
   //noStroke();
  //stroke(237, 34, 93);
  translate(width/2, height/2);
  colorMode(HSB,100);
  fft.analyze();
  amp = fft.getEnergy(20,200);

  var wave = fft.waveform();
  for(var v=-1;v<=1;v+=2){
   
  beginShape(POINTS);
  for (var i =0 ;i<width ;i+=1.5){
    var index = floor(map(i,0,width,0,wave.length));

    var r = map(wave[index],-1,1,150,350);
    var x = r * sin(i)*sin(i)*sin(i)*v/1.2;
    //var y = wave[index]*300+ height/2;
    var y = r * (cos(i) )/1.2;
    vertex(x,y);
    var x2 = r*sin(4*i)*cos(i);
    var y2 = r*sin(4*i)*sin(i);
    vertex(x2,y2);
  }
  
  endShape();
}

// create flying points
var p = new Particle();
particles.push(p);

for( let i=0;i<particles.length;i++){
  if(!particles[i].edges()){
    particles[i].update(amp>230);
    particles[i].show();
  }
  else {
    particles.slice(i,1);
  }

}
}
function mouseClicked (){
  if(song.isPlaying()){
    song.pause();
  }
  else {
    song.play();
    loop();
  }
}
class Particle{
  constructor(){
    this.pos = p5.Vector.random2D().mult(250);
    this.vel = createVector(0,0);
    this.acc = this.pos.copy().mult(random(0.0001,0.00001));
    this.w = random(3,5);
  }
  update(cond){
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    if(cond){
      this.pos.add(this.vel);
      this.pos.add(this.vel);
      this.pos.add(this.vel);
    }
  }
  edges(){
    if(this.pos.x < -width/2 || this.pos.x > width/2 ||
    this.pos.y< -height/2  || this.pos.y > height/2){
      return true;
    }
    else{
      return false;
    }
  }
  show(){
    noStroke();
    fill(255);
    ellipse(this.pos.x, this.pos.y,4);
  }
}