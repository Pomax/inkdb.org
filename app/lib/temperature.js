function clamp(x, min, max) {
  return x < min? min : x > max ? max : x;
}

function temperature(K) {
  var T = K/100, r, g, b;
  if (T <= 66) {
    r = 255;
    g = 99.4708025861 * Math.log(T) - 161.1195681661;
    b = 0;
    if (T > 19) {
      b = 138.5177312231 * Math.log(T-10) - 305.0447927307;
    }
  } else {
    r = 329.698727446 * Math.pow(T-60, -0.1332047592);
    g = 288.1221695283 * Math.pow(T-60, -0.0755148492);
    b = 255;
  }

  r = clamp(r, 0, 255);
  g = clamp(g, 0, 255);
  b = clamp(b, 0, 255);

  return [r,g,b];
}

module.exports = temperature;
