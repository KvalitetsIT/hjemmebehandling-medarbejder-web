export default class DateProperties {
    showDate: boolean;
    showMonth: boolean;
    showYear: boolean;
    showTime: boolean;

    constructor(
        showDate?: boolean,
        showMonth?: boolean,
        showYear?: boolean,
        showTime?: boolean
    ) {
        this.showDate = showDate ?? true;
        this.showMonth = showMonth ?? true;
        this.showYear = showYear ?? true;
        this.showTime = showTime ?? true;
    }
}