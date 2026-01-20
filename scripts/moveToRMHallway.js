
// Function to set a background image
function clearExternalBackground() {
  // Remove any background image set by any script
  document.body.style.backgroundImage = '';
  document.body.style.backgroundColor = '';
  document.body.style.backgroundRepeat = '';
  document.body.style.backgroundPosition = '';
  document.body.style.backgroundSize = '';
}

// Usage:
clearExternalBackground();

function setBackgroundImage(url) {
  clearBackground(); // remove any previous background first
  document.body.style.backgroundImage = `url('${url}')`;
  document.body.style.backgroundSize = 'cover';
  document.body.style.backgroundRepeat = 'no-repeat';
  document.body.style.backgroundPosition = 'center';
}


// Function to clear the previous background


// Example usage:
 // sets the background
// clearBackground(); // call this if you want to remove it later

