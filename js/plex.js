window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(loop) {
      window.setTimeout(callback, 1000 / 60);
    };
})();

var c;//canvas
var $;//context
var msX;//mouse x
var msY;//mouse y
var _pt; //point value
var _pts;//point array(_pt)
var _num = 25; //starting num of points
var _s = 2.3; //point [ node ]size
var _lw = 0.2; //line width
var _maxD = 120; //max distance / size of object
var _sp = 40; //speed
var _spr = 0.6; //spring

window.addEventListener('resize', function(){
  c.width = window.innerWidth;
  c.height = window.innerHeight;
}, false);

window.addEventListener('mousemove',function(e) {
  var rect = e.target.getBoundingClientRect();
  msX = e.clientX - rect.left;
  msY = e.clientY - rect.top;
}, false)

window.addEventListener('touchmove',function(e) {
  var rect = e.target.getBoundingClientRect();
  msX = e.touches[0].pageX - rect.left;
  msY = e.touches[0].pageY - rect.top;
}, false);


var go = function() {

  c = document.getElementById("canv");
  $ = c.getContext("2d");
  c.width = window.innerWidth;
  c.height = window.innerHeight;

  msX = 0;
  msY = 0;

  _pt = document.getElementById("num_").value;
  _pts = new Array(_pt);
  
  for (var i = 0; i < _pt; i++) {
    _pts[i] = new Pt(i);
  }
 run();
}

var Pt = function(n) {
  this.go(n);
};

Pt.prototype.go = function(n) {
  this.n = n;
  this.x = Math.random() * c.width;
  this.y = Math.random() * c.height;
  this.vx = 0;
  this.vy = 0;
};

Pt.prototype.move = function() {
  var min = c.width + c.height;
  var _min_a = this.n;
  var _x = c.width / 2;
  var _y = c.height / 2;

  var d = this._dist(this.x, this.y, msX, msY);
  if (d <= _maxD * 1.5) {
    _x = this.x + Math.random() * ((this.x - msX) * 4);
    _y = this.y + Math.random() * ((this.y - msY) * 4);
  } else {

    d = this._dist(this.x, this.y, c.width / 2, c.height / 2);
    if (d < _maxD * 2) {

      for (var i = 0; i < _pt; i++) {
        if (i != this.n) {
          d = this._dist(this.x, this.y, _pts[i].x, _pts[i].y);
          if (min > d) {
            min = d;
            _min_a = i;
          }
        }
      }

      if (_maxD >= min) {
        _x = this.x + (this.x - _pts[_min_a].x) / 2;
        _y = this.y + (this.y - _pts[_min_a].y) / 2;
      }
    }
  }

  this.vx += ((this.x - _x) - this.vx * _spr);
  this.x -= this.vx / _sp;
  this.vy += ((this.y - _y) - this.vy * _spr);
  this.y -= this.vy / _sp;
};

Pt.prototype._dist = function(x1, y1, x2, y2) {
  var dx = (x1 - x2);
  var dy = (y1 - y2);
  return Math.sqrt(dx * dx + dy * dy);
};

var run = function(){
   window.requestAnimFrame(run);
   draw();
}
window.onload = function() {
  document.getElementById("num_").value = _num;
  go();
};

var draw = function() { 
  $.globalCompositeOperation = 'source-over';
  $.fillStyle = "hsla(0,5%,5%,1)";
  $.fillRect(0, 0, c.width, c.height);
  $.fill();
  $.globalCompositeOperation = 'lighter';
  for (var i = 0; i < _pt; i++) {

    _pts[i].move();

    $.beginPath();
    $.fillStyle = 'hsla(47, 95%, 45%, 1)';
    $.arc(_pts[i].x, _pts[i].y, _s, 0, Math.PI * 2, false);
    $.fill();

    for (var j = i; j < _pt; j++) {
      $.beginPath();
      $.strokeStyle = 'hsla(47, 95%, 45%, .3)';
      $.lineWidth = _lw;
      $.moveTo(_pts[i].x, _pts[i].y);
      $.lineTo(_pts[j].x, _pts[j].y);
      $.closePath();
      $.stroke();
    }
  }
}

var chg = function() {
 var _cur = document.getElementById("num_").value;
  document.getElementById("op_").innerHTML = "Current # of Points: " + _cur;
  
  if (isNaN(document.getElementById("num_").value)) {
    document.getElementById("num_").value = _num;  
  }
  if (50 <= document.getElementById("num_").value) {
    document.getElementById("num_").value = 50;
  }
  go();
}