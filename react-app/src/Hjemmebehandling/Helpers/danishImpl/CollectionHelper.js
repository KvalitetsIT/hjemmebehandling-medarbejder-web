"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionHelper = void 0;
class CollectionHelper {
    MapValueCollectionToArray(map) {
        let arrayToReturn = [];
        const iterator = map.entries();
        let next = iterator.next();
        while (next == undefined || !next.done) {
            next.value[1].forEach(invalid => arrayToReturn.push(invalid));
            next = iterator.next();
        }
        return arrayToReturn;
    }
}
exports.CollectionHelper = CollectionHelper;
