export function currentTime() {
    let now = new Date();
    let minutes = now.getMinutes().toString();
    if (minutes.length == 1) {
        minutes = "0" + minutes;
    }
    return `${now.getHours()}:${minutes}`;
}
