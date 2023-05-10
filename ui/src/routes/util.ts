export function currentTime() {
    let now = new Date();
    let minutes = now.getMinutes().toString();
    if (minutes.length == 1) {
        minutes = "0" + minutes;
    }
    return `${now.getHours()}:${minutes}`;
}

export type Bound = { hour: string; minute: string };

export function boundToHour(bound: Bound) {
    let now = new Date();
    now.setUTCHours(Number(bound.hour));
    now.setUTCMinutes(Number(bound.minute));
    return now.getHours() + now.getMinutes() / 60;
}

export function boundToString(bound: Bound) {
    let now = new Date();
    now.setUTCHours(Number(bound.hour));
    now.setUTCMinutes(Number(bound.minute));

    let minutes = now.getMinutes().toString();
    if (minutes.length == 1) {
        minutes = "0" + minutes;
    }

    return `${now.getHours()}:${minutes}`;
}
