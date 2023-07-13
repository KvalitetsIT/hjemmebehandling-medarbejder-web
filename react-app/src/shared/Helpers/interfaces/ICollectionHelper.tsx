export interface ICollectionHelper {
    /**
     * Transforms a map with arrays as values, into a one-dimensional array containing all values
     * @param map the map to be transformed
     */
    MapValueCollectionToArray<K, V>(map: Map<K, V[]>) : V[]   
}