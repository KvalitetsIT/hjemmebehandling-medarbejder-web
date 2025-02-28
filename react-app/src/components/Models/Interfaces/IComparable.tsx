export interface IComparable<T>{
    isEqual : (other : T) => boolean
}