declare global {
    interface Date {
        compareTo(otherDate: Date): number;
    }
}

Date.prototype.compareTo = function (otherDate: Date): number {
    return this.getTime() - otherDate.getTime();
}
export { };  