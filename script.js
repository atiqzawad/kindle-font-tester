let fontSize = 18;
const reader = document.getElementById("reader");
const dropOverlay = document.getElementById("drop-overlay");
const increaseBtn = document.getElementById("increase");
const decreaseBtn = document.getElementById("decrease");
const fontUpload = document.getElementById("font-upload");
const epubUpload = document.getElementById("epub-upload");
const nextPageBtn = document.getElementById("next-page");
const prevPageBtn = document.getElementById("prev-page");

let rendition = null;

function updateFontSize(size) {
  fontSize = size;
  if (rendition) {
    rendition.themes.fontSize(fontSize + "px");
  } else {
    reader.style.fontSize = fontSize + "px";
  }
}

// Increase font size
increaseBtn.addEventListener("click", () => {
  updateFontSize(fontSize + 1);
});

// Decrease font size
decreaseBtn.addEventListener("click", () => {
  if (fontSize > 6) updateFontSize(fontSize - 1);
});

// Load font from file
fontUpload.addEventListener("change", (event) => {
  handleFontFile(event.target.files[0]);
});

// Load EPUB from file input
epubUpload.addEventListener("change", (event) => {
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
      if (rendition) {
        rendition.themes.font(fontName);
      } else {
        reader.style.fontFamily = `'${fontName}'`;
      }
    }).catch((err) => {
      alert("Failed to load font: " + err);
    });
  };
  readerFile.readAsArrayBuffer(file);
}

function handleEpubFile(file) {
  if (!file) return;

  // Clear old content
  reader.innerHTML = "";
  reader.contentEditable = false; // Disable editing for EPUB

  if (rendition) {
    rendition.destroy();
    rendition = null;
  }

  const book = ePub(URL.createObjectURL(file));
  rendition = book.renderTo("reader", {
    width: "100%",
    height: "100%",
  });

  rendition.themes.fontSize(fontSize + "px");
  rendition.display();

  // Enable pagination buttons
  nextPageBtn.disabled = false;
  prevPageBtn.disabled = false;

  nextPageBtn.onclick = () => rendition.next();
  prevPageBtn.onclick = () => rendition.prev();
}

// Drag and drop events
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
