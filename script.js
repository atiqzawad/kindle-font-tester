let fontSize = 18;
const reader = document.getElementById("reader");
const dropOverlay = document.getElementById("drop-overlay");
let rendition;  // EPUB rendition object

// Font size controls
document.getElementById("increase").addEventListener("click", () => {
  fontSize += 1;
  reader.style.fontSize = fontSize + "px";
  if (rendition) rendition.themes.fontSize(fontSize + "px");
});

document.getElementById("decrease").addEventListener("click", () => {
  fontSize -= 1;
  reader.style.fontSize = fontSize + "px";
  if (rendition) rendition.themes.fontSize(fontSize + "px");
});

// Font file upload
document.getElementById("font-upload").addEventListener("change", (event) => {
  handleFontFile(event.target.files[0]);
});

// EPUB file upload
document.getElementById("epub-upload").addEventListener("change", (event) => {
  handleEpubFile(event.target.files[0]);
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
      if (rendition) rendition.themes.font(fontName);
    }).catch(err => {
      alert("Failed to load font: " + err);
    });
  };
  readerFile.readAsArrayBuffer(file);
}

function handleEpubFile(file) {
  if (!file) return;

  // Clear old content
  reader.innerHTML = "";

  const book = ePub(URL.createObjectURL(file));

  if (rendition) {
    rendition.destroy(); // Remove old rendition if exists
  }

  rendition = book.renderTo("reader", {
    width: "100%",
    height: "100%",
  });

  rendition.themes.fontSize(fontSize + "px");

  rendition.display();

  // Optional: listen for location change for further UI controls
}

// Drag and drop handlers
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
  } else if (file.name.endsWith(".epub")) {
    handleEpubFile(file);
  } else {
    alert("Please drop a valid .ttf, .otf, or .epub file.");
  }
});
