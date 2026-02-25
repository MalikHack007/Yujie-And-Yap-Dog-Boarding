export function startOfLocalDay(d: Date) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}
export function diffDaysLocal(a: Date, b: Date) {
    const ms = startOfLocalDay(b).getTime() - startOfLocalDay(a).getTime();
    return Math.round(ms / 86400000);
}
export function computeBoardingUnits(startAt: Date, endAt: Date) {
    if (!(endAt > startAt)) return 0;
    const baseNights = Math.max(0, diffDaysLocal(startAt, endAt));
    const startMinutes = startAt.getHours() * 60 + startAt.getMinutes();
    const endMinutes = endAt.getHours() * 60 + endAt.getMinutes();
    let minutesLater = endMinutes - startMinutes;
    if (minutesLater < 0) minutesLater = 0;
    const hoursLater = minutesLater / 60;
    let extra = 0;
    if (hoursLater >= 8) extra = 1;
    else if (hoursLater >= 2) extra = 0.5;
    return baseNights + extra;
}
export function computeDaycareUnits(startAt: Date, endAt: Date) {
    const days = diffDaysLocal(startAt, endAt) + 1;
    return Math.max(1, days);
}