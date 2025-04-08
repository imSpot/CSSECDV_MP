let imageIndex = 1;

function showImages(n) {
  //Declaration of the arrays containing the images and pagination dots
  const images = document.getElementsByClassName("images");
  const dots = document.getElementsByClassName("dot");

  if (n > images.length) {
    imageIndex = 1;
  } else if (n < 1) {
    imageIndex = images.length;
  }

  //To update the slides and dots arrays
  for (let i = 0; i < images.length; i++) {
    images[i].style.display = 'none';
  }
  for (let i = 0; i < dots.length; i++) {
    if (dots[i]) {
      dots[i].className = dots[i].className.replace(" active", "");
    }
  }
  if (images[imageIndex - 1]) {
    images[imageIndex - 1].style.display = 'block';
  }
  if (dots[imageIndex - 1]) {
    dots[imageIndex - 1].className += " active";
  }
}

//Function to navigate to the next image by adding n to the current image index
function addImages(n) {
  showImages(imageIndex += n);
}

//Function to show the current image
function currentImage(n) {
  showImages(imageIndex = n + 1);
}

//To initialize the carousel
showImages(imageIndex);
