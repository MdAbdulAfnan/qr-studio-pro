const qrInput = document.getElementById("qrInput");
const templateSelect = document.getElementById("templateSelect");
const gradientStyle = document.getElementById("gradientStyle");
const dotStyle = document.getElementById("dotStyle");
const eyeFrameStyle = document.getElementById("eyeFrameStyle");
const eyeDotStyle = document.getElementById("eyeDotStyle");
const qrContainer = document.getElementById("qrContainer");

const bottomText = document.getElementById("bottomText");
const fontSelect = document.getElementById("fontSelect");

let qr;

/* 25 Named Styles */
const templates = {
  // Corporate
  corporateBlue:["#2563eb","#1d4ed8","#1e3a8a"],
  slatePro:["#334155","#1e293b","#0f172a"],
  graphiteElite:["#111827","#374151","#6b7280"],
  steelGray:["#6b7280","#4b5563","#374151"],

  // Luxury
  royalGold:["#b9935a","#8d6e3b","#b9935a"],
  champagne:["#f5d6a1","#e6b980","#c89b3c"],
  platinumEdge:["#e5e4e2","#c0c0c0","#a9a9a9"],
  obsidian:["#1f1f1f","#2c2c2c","#000000"],

  // Modern Gradient
  sunsetGlow:["#ff512f","#dd2476","#ff512f"],
  coralWave:["#ff9966","#ff5e62","#ff9966"],
  blushAura:["#ee9ca7","#ffdde1","#ee9ca7"],
  goldenHour:["#ffb347","#ffcc33","#ffb347"],

  // Cool Tones
  oceanBreeze:["#007cf0","#00dfd8","#007cf0"],
  aquaFusion:["#00f0ff","#0ea5e9","#00f0ff"],
  deepSea:["#1e3c72","#2a5298","#1e3c72"],
  blueLagoon:["#2193b0","#6dd5ed","#2193b0"],

  // Greens
  emeraldDream:["#10b981","#059669","#047857"],
  forestDeep:["#134e4a","#065f46","#064e3b"],
  mintGlow:["#34d399","#10b981","#059669"],
  limeBurst:["#84cc16","#65a30d","#4d7c0f"],

  // Vibrant
  neonPulse:["#f72585","#7209b7","#3a0ca3"],
  violetRush:["#614385","#516395","#614385"],
  berrySplash:["#cc2b5e","#753a88","#cc2b5e"],
  crimsonFlow:["#de6161","#2657eb","#de6161"],

  // Pastels
  cottonCandy:["#ff9a9e","#fad0c4","#fbc2eb"],
  skyVibe:["#56ccf2","#2f80ed","#56ccf2"],
  roseBloom:["#ff758c","#ff7eb3","#ff758c"],
  lavenderMist:["#c084fc","#a78bfa","#8b5cf6"],

  // Dark Modern
  midnightSky:["#0f172a","#1e293b","#334155"],
  twilight:["#42275a","#734b6d","#42275a"],
  shadowBlue:["#1e293b","#334155","#475569"],
  carbonBlack:["#000000","#111827","#1f2937"],

  // Tech
  cyberBlue:["#0ea5e9","#2563eb","#1e40af"],
  digitalPurple:["#7c3aed","#6366f1","#4f46e5"],
  matrixGreen:["#16a34a","#15803d","#166534"],
  hyperPink:["#ec4899","#db2777","#be185d"]
};


Object.keys(templates).forEach(key=>{
  const opt=document.createElement("option");
  opt.value=key;
  opt.textContent=key.replace(/([A-Z])/g," $1").replace(/^./,str=>str.toUpperCase());
  templateSelect.appendChild(opt);
});

templateSelect.value="sunsetGlow";

/* Gradient */
function getGradient(colors){
  switch(gradientStyle.value){

    case "radial":
      return {
        type:"radial",
        colorStops:[
          {offset:0,color:colors[0]},
          {offset:0.6,color:colors[1]},
          {offset:1,color:colors[2]}
        ]
      };

    case "diagonal":
      return {
        type:"linear",
        rotation:135,
        colorStops:[
          {offset:0,color:colors[0]},
          {offset:0.5,color:colors[1]},
          {offset:1,color:colors[2]}
        ]
      };

    case "vertical":
      return {
        type:"linear",
        rotation:90,
        colorStops:[
          {offset:0,color:colors[0]},
          {offset:1,color:colors[2]}
        ]
      };

    case "horizontal":
      return {
        type:"linear",
        rotation:0,
        colorStops:[
          {offset:0,color:colors[0]},
          {offset:1,color:colors[2]}
        ]
      };

    case "soft":
      return {
        type:"linear",
        rotation:45,
        colorStops:[
          {offset:0,color:colors[0]},
          {offset:0.7,color:colors[1]},
          {offset:1,color:colors[2]}
        ]
      };

    case "bold":
      return {
        type:"linear",
        rotation:90,
        colorStops:[
          {offset:0,color:colors[0]},
          {offset:0.3,color:colors[1]},
          {offset:1,color:colors[2]}
        ]
      };

    case "mirror":
      return {
        type:"linear",
        rotation:45,
        colorStops:[
          {offset:0,color:colors[0]},
          {offset:0.5,color:colors[1]},
          {offset:0.5,color:colors[1]},
          {offset:1,color:colors[0]}
        ]
      };

    default:
      return {
        type:"linear",
        rotation:45,
        colorStops:[
          {offset:0,color:colors[0]},
          {offset:0.5,color:colors[1]},
          {offset:1,color:colors[2]}
        ]
      };
  }
}


/* Build QR */
function buildQR(){

  const data = qrInput.value.trim();
  if(!data) return;

  const colors = [...templates[templateSelect.value]]; 
  // clone array so we don't mutate original

  const isLight = (hex) => {
    const c = hex.substring(1);
    const rgb = parseInt(c, 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = rgb & 0xff;
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 180;
  };

  // Contrast safety
  if(isLight(colors[0])) {
    colors[0] = "#000000";
  }

  const options = {
    width:260,
    height:260,
    data,
    qrOptions:{
      errorCorrectionLevel:"H",
      margin:2   // important for fast scanning
    },
    dotsOptions:{
      type:dotStyle.value,
      gradient:getGradient(colors)
    },
    cornersSquareOptions:{
      type:eyeFrameStyle.value,
      color:colors[0]
    },
    cornersDotOptions:{
      type:eyeDotStyle.value,
      color:colors[1]
    },
    backgroundOptions:{color:"#ffffff"}
  };

  qrContainer.innerHTML="";
  qr = new QRCodeStyling(options);
  qr.append(qrContainer);
}


let typingTimer;
qrInput.addEventListener("input",()=>{
  clearTimeout(typingTimer);
  typingTimer=setTimeout(buildQR,400);
});

templateSelect.addEventListener("change",buildQR);
gradientStyle.addEventListener("change",buildQR);
dotStyle.addEventListener("change",buildQR);
eyeFrameStyle.addEventListener("change",buildQR);
eyeDotStyle.addEventListener("change",buildQR);

/* Premium Frame Export */
function drawAutoText(ctx, text, width, y, fontFamily) {
  if (!text) return;

  let fontSize = 26;
  const maxWidth = width - 80;

  ctx.textAlign = "center";
  ctx.fillStyle = "#111827";

  while (fontSize > 12) {
    ctx.font = `600 ${fontSize}px "${fontFamily}"`;
    if (ctx.measureText(text).width <= maxWidth) break;
    fontSize--;
  }

  ctx.fillText(text, width / 2, y);
}


/* ===========================
   1️⃣ CORPORATE DOWNLOAD
=========================== */
document.getElementById("downloadCorporate").onclick = () => {
  if (!qr) return;

  const size = 260;
  const padding = 60;
  const textSpace = 80;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const width = size + padding * 2;
  const height = size + padding * 2 + textSpace;

const scale = 2;
canvas.width = width * scale;
canvas.height = height * scale;
ctx.scale(scale, scale);


  /* Soft corporate gradient background */
  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, "#f4f6f9");
  bg.addColorStop(1, "#e9eef5");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  /* Frosted glass card */
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.beginPath();
  ctx.roundRect(30, 30, width - 60, height - 60, 28);
  ctx.fill();

  const qrCanvas = qrContainer.querySelector("canvas");
  ctx.drawImage(qrCanvas, (width - size) / 2, 80);

  drawAutoText(ctx, bottomText.value, width, height - 40, fontSelect.value);

  const link = document.createElement("a");
  link.download = "qr-corporate.png";
  link.href = canvas.toDataURL("image/png", 1.0);
  link.click();
};


/* ===========================
   2️⃣ ONLY QR (TRUE TRANSPARENT)
=========================== */
document.getElementById("downloadOnlyQR").onclick = () => {
  if (!qr) return;

  qr.update({
    backgroundOptions: { color: "transparent" }
  });

  qr.download({
    name: "qr-transparent",
    extension: "png"
  });
};


document.getElementById("closeBtn").addEventListener("click", () => {
  document.body.style.opacity = "0";
  document.body.style.transform = "scale(0.96)";
  setTimeout(() => {
    window.close();
  }, 180);
});
