import { UserContext } from "../../generated";

export class User implements UserContext{

    userId!: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
	orgId?: string;
	email?: string;
	entitlements?: string[];
	autorisationsids?: string[];
	
}