const form = document.querySelector('#img-form');
const img = document.querySelector('#img');
const outputPath = document.querySelector('#output-path');
const filename = document.querySelector('#filename');
const heightInput = document.querySelector('#height');
const widthInput = document.querySelector('#width');
let selectedImagePath = null;

// Load image and show form
function loadImage(e) {
  const file = e.target.files[0];

  if (!isFileImage(file)) {
    alertError('Please select an image');
    return;
  }

  selectedImagePath = file && file.path ? file.path : null;

  const image = new Image();
  image.src = URL.createObjectURL(file);
  image.onload = function () {
    widthInput.value = this.width;
    heightInput.value = this.height;
  };

  form.style.display = 'block';
  filename.innerHTML = img.files[0].name;
  outputPath.innerText = path.join(os.homedir(), 'imageresizer');
}

// Make sure file is an image
function isFileImage(file) {
  const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
  return file && acceptedImageTypes.includes(file['type']);
}

// Resize image
function resizeImage(e) {
  e.preventDefault();

  const file = img.files[0];
  const imgPath = (file && file.path) || selectedImagePath;

  if (!file || !imgPath) {
    alertError('Please upload an image');
    return;
  }

  if (widthInput.value === '' || heightInput.value === '') {
    alertError('Please enter a width and height');
    return;
  }

  const width = widthInput.value;
  const height = heightInput.value;

  ipcRenderer.send('image:resize', {
    imgPath,
    height,
    width,
  });
}

// When done, show message
ipcRenderer.on('image:done', () =>
  alertSuccess(`Image resized to ${heightInput.value} x ${widthInput.value}`)
);

function alertSuccess(message) {
  Toastify.toast({
    text: message,
    duration: 5000,
    close: false,
    style: {
      background: 'green',
      color: 'white',
      textAlign: 'center',
    },
  });
}

function alertError(message) {
  Toastify.toast({
    text: message,
    duration: 5000,
    close: false,
    style: {
      background: 'red',
      color: 'white',
      textAlign: 'center',
    },
  });
}

// File select listener
img.addEventListener('change', loadImage);
// Form submit listener
form.addEventListener('submit', resizeImage);