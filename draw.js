/* jshint browser: true, esversion: 6 */

var darktheme = false;
var runonce = false;

function darkTheme() {
  darktheme = !darktheme;
  document.getElementsByTagName("body")[0].style.background = darktheme ? "rgb(27, 32, 40)" : "white";
  if(runonce) run();
}

function run() {
  runonce = true;
  let table;
  try {
    table = JSON.parse(document.getElementById("jsontable").value);
  } catch (e) {
    alert("That weren't JSON...");
  }

  const norooms = table.rooms.length;
  const centre = 320 + norooms * 85;
  const outer = centre - 10;
  const inner = centre - 20;
  const ininner = centre - 30;
  const iouter = 260;
  const iinner = 250;
  document.getElementById("clock").innerHTML = "";
  const draw = SVG('clock').size(centre * 2, centre * 2);

  let linecolour = darktheme ? '#eee' : '#333';
  if (darktheme) {
    draw.circle(centre * 2).move(0, 0).fill('#1B2028');
  }

  let ot, it, theta;
  for (let x = 0; x < 60; x++) {
    theta = Math.PI * x / 30;
    ot = vp(centre, outer, theta);
    it = vp(centre, x % 5 === 0 ? ininner : inner, theta);
    draw.line(ot.x, ot.y, it.x, it.y).stroke({
      width: (x % 5 === 0 ? 3 : 2),
      linecap: 'round',
      color: linecolour
    });
    if (x % 5 === 0) {
      ot = vp(centre, iouter, theta);
      it = vp(centre, iinner, theta);
      draw.line(ot.x, ot.y, it.x, it.y).stroke({
        linecap: 'round',
        color: linecolour
      });
    }
  }

  let dolours = ['#592626', '#594d26', '#475926', '#315926', '#265941', '#265359', '#264259', '#263059', '#422659', '#592645'];
  let lolours = ['#d17777', '#d19877', '#d1c877', '#b6d177', '#87d177', '#77d193', '#77d1c6', '#77b4d1', '#7793d1', '#8477d1', '#b777d1', '#d177be'];
  let colours = darktheme ? dolours : lolours;
  //draw.circle(10).fill('#000').move(centre - 5, centre - 5);
  //draw.circle(20).stroke('#000').fill('none').move(centre - 10, centre - 10);
  let c = 0;
  for (let sesh of table.sessions) {
    let front = 270 + sesh.room * 85;
    let back = 347 + sesh.room * 85;
    let mid = 336 + sesh.room * 85;
    let stheta = Math.PI * sesh.start / 6;
    let etheta = Math.PI * (sesh.end - 0.03) / 6;
    let topleft = vp(centre, back, stheta);
    let midleft = vp(centre, mid, stheta);
    let topright = vp(centre, back, etheta);
    let midright = vp(centre, mid, etheta);
    let bottomleft = vp(centre, front, stheta);
    let bottomright = vp(centre, front, etheta);
    let path = draw.path(`M ${topleft.x} ${topleft.y} 
        A ${back} ${back} 0 0 1 ${topright.x} ${topright.y}
        L ${bottomright.x} ${bottomright.y}
        A ${front} ${front} 0 0 0 ${bottomleft.x} ${bottomleft.y}
        Z`);
    path.fill(colours[c]);
    c = (c + 1) % colours.length;
    var text = draw.text(sesh.name || "Event x");
    path = `M ${midleft.x} ${midleft.y}
      A ${mid} ${mid} 0 0 1 ${midright.x} ${midright.y}`;
    text.path(path).font({
      size: 28,
      weight: 300,
      family: 'Roboto',
      fill: linecolour
    });
    text.textPath().attr('startOffset', 10);
  }
  var svg = document.getElementById("clock").innerHTML;
  var b64 = window.btoa(svg);
  document.getElementById("clockimage").innerHTML = "<img src='data:image/svg+xml;base64,\n" + b64 + "' alt='file.svg'/>";
}


function vp(o, r, t) {
  return {
    x: o + r * Math.sin(t),
    y: o - r * Math.cos(t)
  };
}
