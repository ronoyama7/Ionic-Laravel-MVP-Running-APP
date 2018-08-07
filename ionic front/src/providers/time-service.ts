const timeStamp = {
    latestTimeStamp: 0,
    freeze: false,
    time: 0,
}

export function getCurrentTimeStamp() {
    return Math.round(new Date().getTime()/1000)
}

export function startTimeRecord() {
    timeStamp.latestTimeStamp = getCurrentTimeStamp();
    timeStamp.time = 0;
}

export function currentTimeRecord() {
    timeStamp.time += getCurrentTimeStamp() - timeStamp.latestTimeStamp;
    timeStamp.latestTimeStamp = getCurrentTimeStamp();
    return timeStamp.time;
}

export function pauseTimeRecord() {
    timeStamp.freeze = true;
}

export function resumeTimeRecord() {
    timeStamp.latestTimeStamp = getCurrentTimeStamp();
}

export function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " min " : " mins ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " sec" : " secs") : "";
    sDisplay = m > 0 ? '' : sDisplay;
    return hDisplay + mDisplay + sDisplay; 
}

export function seconds2Hms(d) {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor(d % 3600 / 60);
  var s = Math.floor(d % 3600 % 60);
  var hDisplay = h > 9 ? String(h) : '0' + String(h) + " : ";
  var mDisplay = m > 9 ? String(m) : '0' + String(m) + "";
  var sDisplay = s > 9 ? String(s) : '0' + String(s);
  return mDisplay + sDisplay ; 
}