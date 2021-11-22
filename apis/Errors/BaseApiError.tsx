export class BaseApiError extends Error {
    displayMessage() : string{
        return "";
    }
    displayTitle() : string{
        return "";
    }
}