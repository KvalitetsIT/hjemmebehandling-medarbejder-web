export class User{

    userId!: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
	orgId?: string;
	email?: string;
	entitlements?: EntitlementEnum[];
	autorisationsids?: string[];
	orgName?: string;
}
export enum EntitlementEnum{
	NURSE = "Sygeplejerske",
	SOSU = "SOSU",
	UNKNOWN = "UKENDT"
}