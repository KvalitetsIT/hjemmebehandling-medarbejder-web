import { ICollectionHelper } from "../interfaces/ICollectionHelper";

export class CollectionHelper implements ICollectionHelper {
    MapValueCollectionToArray<K, V> (map: Map<K, V[]>) : V[] {
        
        let arrayToReturn : V[] = [];
        const iterator = map.entries();
        let next = iterator.next();
        while(next == undefined || !next.done){
                next.value[1].forEach(invalid => arrayToReturn.push(invalid))  
                next = iterator.next();        
        }

        return arrayToReturn;
    }

}