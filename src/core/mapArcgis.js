const cesium = require('cesium/Cesium');

/**
 * 加载arcgis动态服务
 * @param cesium
 * @param layerUrl
 */
export function addArcGISImageLayer(layerUrl){
    return new cesium.ArcGisMapServerImageryProvider({
        url: layerUrl
    })
}
