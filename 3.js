// ===== ELEMENT =====
const page1 = document.getElementById("page1");
const page2 = document.getElementById("page2");

const flame = document.getElementById("flame");
const smoke = document.getElementById("smoke");

const readBtn = document.getElementById("readBtn");
const backBtn = document.getElementById("backBtn");
const relightBtn = document.getElementById("relightBtn");

const hint = document.getElementById("hint");

// ===== STATE =====
let blown = false;
readBtn.disabled = true;

// ===== SMOKE =====
function playSmoke(){
  smoke.classList.remove("play");
  void smoke.offsetWidth;
  smoke.classList.add("play");
}

// ===== HINT TEXT =====
function setHint(text){
  hint.classList.add("fade");
  setTimeout(() => {
    hint.textContent = text;
    hint.classList.remove("fade");
  }, 180);
}

// ===== BLOW OUT =====
function blowOut(){
  if (blown) return;

  blown = true;
  flame.classList.add("off");
  playSmoke();

  setHint("✨ Lilinnya padam! Klik Read it 💌");
  readBtn.disabled = false;
}

// ===== RELIGHT =====
function relight(){
  blown = false;
  flame.classList.remove("off");
  smoke.classList.remove("play");

  readBtn.disabled = true;
  setHint("Kalo Udah Tiup Lilinnya");
}

// ===== MIC SETUP =====
let audioCtx, analyser, mic, dataArray;

async function initMic(){
  try{
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    mic = audioCtx.createMediaStreamSource(stream);

    analyser.fftSize = 256;
    dataArray = new Uint8Array(analyser.frequencyBinCount);

    mic.connect(analyser);

    setHint("Kalo Udah Tiup Lilinnya");
    listenBlow();

  } catch (err){
    setHint("❌ Mic tidak diizinkan");
    console.error(err);
  }
}

// ===== DETECT BLOW =====
function listenBlow(){
  function detect(){
    if (blown) return;

    analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < dataArray.length; i++){
      sum += dataArray[i];
    }
    const volume = sum / dataArray.length;

    // Sensitivitas tiupan
    if (volume > 35 && dataArray[0] > 60){
      blowOut();
      return;
    }

    requestAnimationFrame(detect);
  }
  detect();
}

// ===== NAV =====
readBtn.addEventListener("click", () => {
  if (readBtn.disabled) return;
  page1.style.display = "none";
  page2.style.display = "grid";
});

backBtn.addEventListener("click", () => {
  page2.style.display = "none";
  page1.style.display = "grid";
  relight();
  listenBlow();
});

relightBtn.addEventListener("click", relight);

// ===== START =====
initMic();
