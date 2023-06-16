"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    isAdmin() {
        const adminEntitlement = "Administrator";
        if (!this.entitlements)
            return false;
        return this.entitlements.some(e => e == adminEntitlement);
    }
}
exports.User = User;
