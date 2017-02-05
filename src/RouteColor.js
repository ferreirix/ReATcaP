import {
    yellow500,
    pink800,
    blue300,
    lime900,
    orange500,
    pinkA100,
    green400,
    lime600,
    indigo900,
    orange200,
    deepOrange300,
    gray800,
    purple200,
    green900,
    lightBlueA200,
    deepPurple500,
    yellow700,
    brown500,
    red500,
    blue500,
    orange300,
    purple500,
    blue800,
} from 'material-ui/styles/colors';

export default function GetRouteColor(lignetype, id) {
    let color = gray800;

    switch (lignetype) {
        case 'metro':
            color = getMetroColor(id);
            break;
        case 'bus':
            break;
        case 'tramway':
            color = getTramColor(id);
            break;
        case 'rer':
            color = getRERColor(id);
            break;
        default:
            break;
    }
    return color;
};

function getMetroColor(id) {
    switch (id) {
        case "1":
            return yellow500;
        case "2":
            return indigo900;
        case "3":
            return lime900;
        case "4":
            return pink800;
        case "5":
            return orange500;
        case "6":
            return green400;
        case "7":
            return pinkA100;
        case "8":
            return purple200;
        case "9":
            return lime600;
        case "10":
            return yellow700;
        case "11":
            return brown500;
        case "12":
            return green900;
        case "13":
            return lightBlueA200;
        case "14":
            return deepPurple500;
        default:
            break;
    }
};

function getTramColor(id) {
    switch (id) {
        case '1':
            return blue800;
        case '2':
            return purple500;
        case '3A':
            return orange300;
        default:
            break;
    }
};

function getRERColor(id) {
    switch (id) {
        case 'A':
            return red500;
        case 'B':
            return blue500;
        default:
            break;
    }
};