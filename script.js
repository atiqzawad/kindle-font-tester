let fontSize = 18;
const reader = document.getElementById("reader");
const dropOverlay = document.getElementById("drop-overlay");

// Font size controls
document.getElementById("increase").addEventListener("click", () => {
  fontSize += 1;
  reader.style.fontSize = fontSize + "px";
});

document.getElementById("decrease").addEventListener("click", () => {
  fontSize -= 1;
  reader.style.fontSize = fontSize + "px";
});

// File upload button
document.getElementById("font-upload").addEventListener("change", (event) => {
  handleFontFile(event.target.files[0]);
});

// Handle font loading
function handleFontFile(file) {
  if (!file) return;

  const readerFile = new FileReader();
  readerFile.onload = (e) => {
    const fontName = file.name.split(".")[0];
    const font = new FontFace(fontName, e.target.result);
    font.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
      reader.style.fontFamily = `'${fontName}'`;
    }).catch(err => {
      alert("Failed to load font: " + err);
    });
  };
  readerFile.readAsArrayBuffer(file);
}

// Drag-and-drop events
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
  if (file && (file.name.endsWith(".ttf") || file.name.endsWith(".otf"))) {
    handleFontFile(file);
  } else {
    alert("Please drop a valid .ttf or .otf font file.");
  }
});
