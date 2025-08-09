const reader = document.getElementById("reader");
const fontUpload = document.getElementById("font-upload");
const dropOverlay = document.getElementById("drop-overlay");
const increaseBtn = document.getElementById("increase");
const decreaseBtn = document.getElementById("decrease");

let fontSize = 18;

function updateFontSize(size) {
  fontSize = size;
  if (fontSize < 6) fontSize = 6;
  reader.style.fontSize = fontSize + "px";
}

increaseBtn.addEventListener("click", () => {
  updateFontSize(fontSize + 1);
});

decreaseBtn.addEventListener("click", () => {
  updateFontSize(fontSize - 1);
});

fontUpload.addEventListener("change", (event) => {
  const file = event.target.files[0];
  handleFontFile(file);
});

function handleFontFile(file) {
  if (!file) return;

  const readerFile = new FileReader();
  readerFile.onload = (e) => {
    const fontName = file.name.split(".")[0];
    const font = new FontFace(fontName, e.target.result);
    font.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
      reader.style.fontFamily = `'${fontName}'`;
    }).catch((err) => {
      alert("Failed to load font: " + err);
    });
  };
  readerFile.readAsArrayBuffer(file);
}

// Drag and drop font files support

document.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropOverlay.style.display = "flex";
});

document.addEventListener("dragleave", (e) => {
  if (e.target === document || e.target === reader) {
    dropOverlay.style.display = "none";
  }
});

document.addEventListener("drop", (e) => {
  e.preventDefault();
  dropOverlay.style.display = "none";
  const file = e.dataTransfer.files[0];
  if (!file) return;

  if (file.name.endsWith(".ttf") || file.name.endsWith(".otf")) {
    handleFontFile(file);
  } else {
    alert("Please drop a valid .ttf or .otf font file.");
  }
});

// Initialize font size
updateFontSize(fontSize);
