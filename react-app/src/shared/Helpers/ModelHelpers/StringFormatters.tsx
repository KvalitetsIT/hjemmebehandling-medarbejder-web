export class StringFormatter {
    
    static FormatPhonenumber(phonenumber?: string): string {
        if(!phonenumber)
            return "";
        
        let landcode = phonenumber.startsWith("+") ? phonenumber.slice(0,3) + " " : "";
        let onlyphone = phonenumber.startsWith("+") ? phonenumber.slice(3) : phonenumber

        
        return landcode + onlyphone.match(/.{1,2}/g)?.join(" ");
    }

    static FormatCpr(cpr? : string) {
        if (!cpr)
            return "";
            
        return cpr.slice(0, 6) + "-" + cpr.slice(6)
    }

}
