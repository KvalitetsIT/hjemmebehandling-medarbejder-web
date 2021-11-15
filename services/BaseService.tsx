import { InvalidInputError, InvalidInputModel } from "./Errors/InvalidInputError";

export default class BaseService {
    ValidatePagination(page : number, pageSize : number) : void {
        let errors : InvalidInputModel[] = [];
        if(page <= 0)
            errors.push(new InvalidInputModel("page","Sidenummer skal være større end 0"))

        if(pageSize <= 0)
            errors.push(new InvalidInputModel("pageSize","Sidestørrelse skal være større end 0"))
        
        if(errors.length > 0)
            throw new InvalidInputError(errors);
    }
}
  