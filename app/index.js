import clock from "clock";
import * as document from "document";
import { preferences } from "user-settings";

//Method to convert time to 24 hour format
function zeroPad(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

//Method to convert Date class' getDay() which represents days from 0-6 & make it say the name of the day
function dayName(j) {
    if (j == 0) { //0 == Sunday
        j = "Sunday";
    } else if (j == 1) { //1 == Monday
        j = "Monday";
    } else if (j == 2) { //2 == Tuesday
        j = "Tuesday";
    } else if (j == 3) { //3 == Wednesday
        j = "Wednesday";
    } else if (j == 4) { //4 == Thursday
        j = "Thursday";
    } else if (j == 5) { //5 == Friday
        j = "Friday";
    } else if (j == 6) { //6 == Saturday
        j = "Saturday";
    }

    return j;
}

// Update the clock every minute
clock.granularity = "minutes";

// Get a handle on the <text> element
const myTime = document.getElementById("myTime");

//Date d = new Date();
const myDate = document.getElementById("myDate");
//dayName(d.getDay());

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
    let today = evt.date;
    let hours = today.getHours();
    if (preferences.clockDisplay === "12h") {
        // 12h format
        hours = hours % 12 || 12;
    } else {
        // 24h format
        hours = zeroPad(hours);
    }
    let mins = zeroPad(today.getMinutes());
    myTime.text = `${hours}:${mins}`;

    //will update the date regularly alongside clock. Uses evt
    let weekday = dayName(today.getDay());
    let parseDateArr = today.toString().split(' '); //0 = weekday, 1 = month, 2 = day, 3 = year, 4 = 24hr clock, 5 = timezone
    myDate.text = `${weekday} - ${parseDateArr[1]} ${parseDateArr[2]}`;
}