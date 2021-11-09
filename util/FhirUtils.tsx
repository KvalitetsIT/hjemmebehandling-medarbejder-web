export default class FhirUtils {
    public static unqualifyId(id: string) : string {
        if(this.isPlainId(id)) {
            return id
        }
        var parts = id.split('/')
        if(parts.length != 2) {
            throw new Error('Cannot unqualify id: ' + id + '! Illegal format')
        }
        if(!Object.values(Qualifier).some(q => q === parts[0])) {
            throw new Error('Cannot unqualify id: ' + id + '! Illegal qualifier')
        }
        if(!this.isPlainId(parts[1])) {
            throw new Error('Cannot unqualify id: ' + id + '! Illegal id')
        }
        return parts[1]
    }

    public static qualifyId(id: string, qualifier: Qualifier) : string {
        if(!this.isPlainId(id)) {
            throw new Error('Cannot qualify id: ' + id)
        }
        return qualifier.toString() + '/' + id;
    }

    private static isPlainId(id: string) : boolean {
        const regex = /^[a-z0-9\-]+$/
        return regex.test(id)
    }
}

export enum Qualifier {
    CarePlan,
    Patient,
    Questionnaire,
    QuestionnaireResponse
}