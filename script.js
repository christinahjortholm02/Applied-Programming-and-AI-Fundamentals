// =====================================================
//  MY MOMENTUM  –  script.js
//  Three features: clock + greeting, daily focus, background photo
// =====================================================

// Change this to your own name!
const NAME = "Christina";


// =====================================================
//  FEATURE 1: CLOCK + GREETING
// =====================================================

// 1. Find the elements on the page we want to write into
const clockElement = document.getElementById("clock");
const greetingElement = document.getElementById("greeting");

// 2. A function that reads the time and updates the page
function updateClock() {
  const now = new Date();            // a snapshot of the current date and time
  const hours = now.getHours();      // 0–23
  const minutes = now.getMinutes();  // 0–59

  // padStart turns 7 into "07", so the clock shows 09:07 instead of 9:7
  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  clockElement.textContent = hh + ":" + mm;

  // Pick a greeting based on the hour
  let partOfDay;
  if (hours < 12) {
    partOfDay = "morning";
  } else if (hours < 18) {
    partOfDay = "afternoon";
  } else {
    partOfDay = "evening";
  }
  greetingElement.textContent = "Good " + partOfDay + ", " + NAME + ".";
}

// 3. Run it once straight away (otherwise the page is blank for 1 second)...
updateClock();
// ...then run it again every 1000 milliseconds (= every second)
setInterval(updateClock, 1000);


// =====================================================
//  FEATURE 2: DAILY FOCUS (remembered with localStorage)
// =====================================================

const focusAsk = document.getElementById("focus-ask");
const focusShow = document.getElementById("focus-show");
const focusInput = document.getElementById("focus-input");
const focusText = document.getElementById("focus-text");
const focusClear = document.getElementById("focus-clear");

// Today's date as text, e.g. "Wed Sep 30 2026". Used so the focus resets each day.
const today = new Date().toDateString();

// Show the "question" mode
function showAskMode() {
  focusAsk.hidden = false;
  focusShow.hidden = true;
  focusInput.value = "";
  focusInput.focus();   // put the typing cursor in the box
}

// Show the "your focus is..." mode
function showFocusMode(text) {
  focusText.textContent = text;
  focusAsk.hidden = true;
  focusShow.hidden = false;
}

// When the page opens: is there a saved focus from TODAY?
const savedFocus = localStorage.getItem("focus");
const savedDate = localStorage.getItem("focusDate");

if (savedFocus && savedDate === today) {
  showFocusMode(savedFocus);
} else {
  showAskMode();
}

// Listen for key presses in the input box
focusInput.addEventListener("keydown", function (event) {
  // We only care about the Enter key
  if (event.key !== "Enter") return;

  const text = focusInput.value.trim();  // trim removes spaces at the start/end
  if (text === "") return;               // ignore empty input

  // Save it, so it survives closing the tab or Chrome
  localStorage.setItem("focus", text);
  localStorage.setItem("focusDate", today);

  showFocusMode(text);
});

// Clicking "Change focus" deletes the saved focus and asks again
focusClear.addEventListener("click", function () {
  localStorage.removeItem("focus");
  localStorage.removeItem("focusDate");
  showAskMode();
});


// =====================================================
//  FEATURE 3: RANDOM BACKGROUND PHOTO
// =====================================================

// Each word gives a different (but always the same) photo from picsum.photos.
// Add or change words to get different pictures.
const photoSeeds = ["harbor", "forest", "dune", "glacier", "meadow", "cliff", "lagoon", "valley"];

// Math.random() gives a number between 0 and 0.999...
// Multiply by the list length and round down -> a random index (0 to 7)
const randomIndex = Math.floor(Math.random() * photoSeeds.length);
const chosenSeed = photoSeeds[randomIndex];
const photoUrl = "https://picsum.photos/seed/" + chosenSeed + "/1920/1080";

// Load the photo "behind the scenes" first, and only show it once it has arrived
const backgroundElement = document.getElementById("background");
const photo = new Image();

photo.onload = function () {
  backgroundElement.style.backgroundImage = "url(" + photoUrl + ")";
  backgroundElement.classList.add("loaded");   // triggers the fade-in in style.css
};

photo.src = photoUrl;   // setting src is what starts the download
