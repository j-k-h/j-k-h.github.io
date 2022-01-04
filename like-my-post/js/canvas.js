// TIMER

$(document).ready(function() {
  startTimer();
});

var timerCount = 0;
//var pumpLastTime = "";
//var pumpCounter = 0;
var second = "";
var minute = "";
var hour = "";
var sliceVal = 0;

function startTimer() {
    if (timerCount == 0) {
        var time = getTime();
        timerAction(0);
        timerCount = 1;
    }
    else {
        timerAction(1);
        timerCount = 0;
    }
}

function timerAction(action) {
    var counter = 0;
    var stopwatch = jQuery('#timer');
    var arr = jQuery('#timer').html().split(':');

    if (second == "") {
        second = parseInt("00");
    } else {
        second = arr[2];
    }

    if (minute == "") {
        minute = parseInt("00");
    } else {
        minute = arr[1];
    }

    if (hour == "") {
        hour = parseInt("00");
    } else {
        hour = arr[0];
    }

    if (action == 0) {
        pumpTimerId = setInterval(function () {
            counter++;
            second++;

            if (hour.toString().length == 4) {
                sliceVal = -4;
            }
            else if (hour.toString().length == 3) {
                sliceVal = -3;
            }
            else {
                sliceVal = -2;
            }

            if (second >= 60) {
                minute++;
                if (minute >= 60) {
                    hour++;
                    minute = 0;
                }
                second = 0;
                stopwatch.html(('0' + hour).slice(sliceVal) + ":" + ('0' + minute).slice(-2) + ":" + ('0' + second).slice(-2));
            } else {
                stopwatch.html(('0' + hour).slice(sliceVal) + ":" + ('0' + minute).slice(-2) + ":" + ('0' + second).slice(-2));
            }
        }, 1000, true);
    }
    else {
        clearInterval(pumpTimerId);
        counter = 0;
        pumpLastTime = stopwatch.html();
    }
}

function getTime() {
    Number.prototype.padLeft = function (base, chr) {
        var len = (String(base || 10).length - String(this).length) + 1;
        return len > 0 ? new Array(len).join(chr || '0') + this : this;
    };

    var d = new Date,
            dformat = [d.getFullYear().padLeft(),
                   (d.getMonth() + 1).padLeft(),
                    d.getDate()].join('-') +
                   ' ' +
                  [d.getHours().padLeft(),
                    d.getMinutes().padLeft(),
                    d.getSeconds().padLeft()].join(':');
    return dformat;
}
