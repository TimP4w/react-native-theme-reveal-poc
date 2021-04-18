export const minimumEnclosingScale = (offsetX: number = 0, offsetY: number = 0, screenWidth: number, screenHeight: number) => {
  /* 
  * Center is (0, 0)
  * offset are given in percent of the screen
  * Value must be between -50 and 50
  * e.g. offsetX=0, offsetY=50 means top of the screen in the center
  * 
  */
  if (offsetX < -50 || offsetY < -50 || offsetX > 50 || offsetY > 50) {
    console.error('Invalid offset value, must be between [-50, 50]');
  }

  const screenDiagonal = Math.sqrt(screenHeight*screenHeight + screenWidth*screenWidth);
  const maxSide = Math.max(screenHeight, screenHeight);

  /* 
  * We start from a scale of 1 meaning it's the same as the longest side. 
  * Since (0,0) is center, we then increase the scale based on the maximum offset 
  * We multiply by screenDiagonal / maxSide such that we increase the scale by the same ratio to include all the corners
  *
  */
  return (1 + Math.max(Math.abs(offsetX), Math.abs(offsetY)) / 50) * (screenDiagonal / maxSide);
}

export const discreteOffset = (screenSize: number, offset: number) => {
  return ((screenSize) / 100) * offset
}