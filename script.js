//TIME
function updateTime() {
  var currentTime = new Date().toLocaleString();
  var timeText = document.querySelector("#timeElement");
  timeText.innerHTML = currentTime;
}

setInterval(updateTime, 1000);


//Makes Windows Draggable
dragElement(document.getElementById("welcome"));
dragElement(document.querySelector("#NinjaNotes"));
dragElement(document.querySelector("#calculator"));

function dragElement(element) {
  var initialX = 0;
  var initialY = 0;
  var currentX = 0;
  var currentY = 0;

  if (document.getElementById(element.id + "header")) {
    document.getElementById(element.id + "header").onmousedown = startDragging;
  } else {
    element.onmousedown = startDragging;
  }

  function startDragging(e) {
    e = e || window.event;
    e.preventDefault();

    initialX = e.clientX;
    initialY = e.clientY;

    document.onmouseup = stopDragging;
    document.onmousemove = dragElement;
  }

  function dragElement(e) {
    e = e || window.event;
    e.preventDefault();

    currentX = initialX - e.clientX;
    currentY = initialY - e.clientY;
    initialX = e.clientX;
    initialY = e.clientY;

    var newTop = element.offsetTop - currentY;

    var topBar = document.querySelector("#top");

    if (newTop < topBar.offsetHeight) {
      newTop = topBar.offsetHeight;
    }

    element.style.top = newTop + "px";
    element.style.left = (element.offsetLeft - currentX) + "px";
  }

  function stopDragging() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}


//Open/Close Windows
var welcomeScreen = document.querySelector("#welcome");
var notesScreen = document.querySelector("#NinjaNotes");
var calcScreen = document.querySelector("#calculator");

function closeWindow(element) {
  element.style.display = "none";
}

function openWindow(element) {
  element.style.display = "flex";
}


//Universal Open/Close Window Function
function setupWindow(windowId, openButtonId, closeButtonId) {
  var windowElement = document.querySelector("#" + windowId);
  var openButton = document.querySelector("#" + openButtonId);
  var closeButton = document.querySelector("#" + closeButtonId);

  openButton.addEventListener("click", function() {
    openWindow(windowElement);
  });

  closeButton.addEventListener("click", function() {
    closeWindow(windowElement);
  });
}

setupWindow("welcome", "welcomeopen", "welcomeclose");
setupWindow("NinjaNotes", "notesopen", "notesclose");
setupWindow("calculator", "calcopen", "calcclose");


//State of Selected Icon
var selectedIcon = undefined;
var currentNoteIndex = null;

function selectIcon(element) {
  element.classList.add("selected");
  selectedIcon = element;
}

function deselectIcon(element) {
  if (element) {
    element.classList.remove("selected");
  }
  selectedIcon = undefined;
  //element.classList.remove("selected");
  //selectedIcon = undefined;
}

function handleIconTap(element) {
  if (element.classList.contains("selected")) {
    deselectIcon(element);
    openWindow(window);
  } else {
    selectIcon(element);
  }
}


//Tapping on Window Overlays It Over the Rest
var biggestIndex = 1;
var topBar = document.querySelector("#top");

function addWindowTapHandling(element) {
  element.addEventListener("mousedown", () =>
    handleWindowTap(element)
  );
}

function handleWindowTap(element) {
  biggestIndex++;
  element.style.zIndex = biggestIndex;
  topBar.style.zIndex = biggestIndex + 1;
  deselectIcon(selectedIcon);
}

addWindowTapHandling(welcomeScreen);
addWindowTapHandling(notesScreen);


function openWindow(element) {
  element.style.display = "flex";
  biggestIndex++;
  element.style.zIndex = biggestIndex;
  topBar.style.zIndex = biggestIndex + 1;
}


//Topbar Close/Open
var topBarClose = document.querySelector("#topclose");
var topBarOpen = document.querySelector("#topopen");

topBarClose.addEventListener("click", function() {
  closeWindow(topBar);
});

topBarOpen.addEventListener("click", function() {
  openWindow(topBar);
});

//notes
//Notes Data
var notes = [
  {
    title: "Welcome",
    date: "08/24/2026",
    content: `
      <p>Welcome to <strong>NinjaNotes</strong>.</p>
      <p>This is where your notes will live.</p>
    `
  }
];

if (localStorage.getItem("notes")) {
  notes = JSON.parse(localStorage.getItem("notes"));
}
//Grab the containers once
var noteGrid = document.querySelector("#noteGrid");
var noteView = document.querySelector("#noteView");
var noteContent = document.querySelector("#noteContent");
var createView = document.querySelector("#createView");
var NoteCreate = document.querySelector("#note-create");
var createContent = document.querySelector("#createContent");
var titleInput = document.querySelector("#title-input");
var bodyInput = document.querySelector("#bodyinput");
var savebutton = document.querySelector("#savebutton")
var deletebutton = document.querySelector("#deletebutton");
var editbutton = document.querySelector("#editbutton");

//Build one card
function addToGrid(index) {
  var card = document.createElement("div");
  card.className = "note-card";
  card.innerHTML = `
    <h3>${notes[index].title}</h3>
    <p>${notes[index].date}</p>
  `;

  card.addEventListener("click", function() {
    openNote(index);
  });

  noteGrid.appendChild(card);
}

//Show a note's content in place of the grid
function openNote(index) {
  noteContent.innerHTML = notes[index].content;
  noteGrid.style.display = "none";
  noteView.style.display = "block";
  currentNoteIndex = index;
}

//Go back to the grid

function setupBackButton(backButtonId, viewElement) {
  var backButton = document.querySelector("#" + backButtonId);

  backButton.addEventListener("click", function() {
    viewElement.style.display = "none";
    noteGrid.style.display = "grid";
  });
}

setupBackButton("noteBack", noteView);
setupBackButton("createBack", createView);

//Render all notes on load
function renderNotes() {
  noteGrid.innerHTML = "";
  notes.forEach(function(note, index) {
    addToGrid(index);
  });
}

renderNotes();

NoteCreate.addEventListener("click", function() {
  titleInput.value = "";
  bodyInput.innerHTML = "";
  noteGrid.style.display = "none";
  createView.style.display = "block";
  noteView.style.display = "none";
  currentNoteIndex = null;
});



savebutton.addEventListener("click", function() {
  var newTitle = titleInput.value;
  var newBody = bodyInput.innerHTML;
  var newDate = new Date().toLocaleDateString();

  var newNote = {
    title: newTitle,
    date: newDate,
    content: newBody
  };
  if (currentNoteIndex == null) {
    notes.push(newNote);
  } else {
    notes[currentNoteIndex] = newNote;
  }
  localStorage.setItem("notes", JSON.stringify(notes));
  renderNotes();

  createView.style.display = "none";
  noteGrid.style.display = "grid";
  currentNoteIndex = null;
});


deletebutton.addEventListener("click", function() {
  notes.splice(currentNoteIndex, 1);
  localStorage.setItem("notes", JSON.stringify(notes));
  renderNotes();
  noteView.style.display = "none";
  noteGrid.style.display = "grid";
});

editbutton.addEventListener("click", function() {
  titleInput.value = notes[currentNoteIndex].title
  bodyInput.innerHTML = notes[currentNoteIndex].content
  noteView.style.display = "none";
  createView.style.display = "block";
});

function toggleFullscreen(element) {
  if (element.classList.contains("fullscreen")) {
    element.classList.remove("fullscreen");
  } else {
    element.classList.add("fullscreen");
  }
}

function setupFullscreen(buttonId, windowElement) {
  var button = document.querySelector("#" + buttonId);
  button.addEventListener("click", function() {
    toggleFullscreen(windowElement);
  });
}

setupFullscreen("welcomefullscreen", welcomeScreen);
setupFullscreen("notesfullscreen", notesScreen);
setupFullscreen("calcfullscreen", calcScreen);

//fullscreenbutton makes topbar invisible
var topBarWasVisible = true;

function toggleFullscreen(element) {
  if (element.classList.contains("fullscreen")) {
    // Leaving fullscreen
    element.classList.remove("fullscreen");
    if (topBarWasVisible) {
      openWindow(topBar);
    }
  } else {
    // Entering fullscreen
    topBarWasVisible = (topBar.style.display !== "none");
    closeWindow(topBar);
    element.classList.add("fullscreen");
  }
}

//Calculator

let calculatorValue = "";

function appendNumber(number) {
    calculatorValue += number;
    document.getElementById("calc-display").textContent = calculatorValue;
}

function appendOperator(operator) {
    calculatorValue += operator;
    document.getElementById("calc-display").textContent = calculatorValue;
}

function appendDecimal() {
    calculatorValue += ".";
    document.getElementById("calc-display").textContent = calculatorValue;
}

function clearCalculator() {
    calculatorValue = "";
    document.getElementById("calc-display").textContent = "0";
}

function deleteLast() {
    calculatorValue = calculatorValue.slice(0, -1);
    document.getElementById("calc-display").textContent =
        calculatorValue || "0";
}

function calculate() {
    try {
        calculatorValue = String(eval(calculatorValue));
        document.getElementById("calc-display").textContent = calculatorValue;
    } catch {
        calculatorValue = "";
        document.getElementById("calc-display").textContent = "Error";
    }
}