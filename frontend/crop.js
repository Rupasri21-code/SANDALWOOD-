const { Jimp } = require('jimp');

async function crop() {
  try {
    const image = await Jimp.read('public/branding/gk-logo.png');
    image.autocrop();
    await image.write('public/branding/chandhan-navbar-logo.png');
    console.log("Successfully cropped transparent padding from logo");
  } catch (error) {
    console.error("Error cropping image:", error);
  }
}

crop();
