const tConvert = (time) => {
  if (time == null) return null;
  var H = +time.substr(0, 2);
  var h = H % 12 || 12;
  var ampm = H < 12 ? "AM" : "PM";
  time = h + time.substr(2, 3) + ampm;

  return time;
};

export { tConvert };
