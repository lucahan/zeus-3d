const cesium = require('cesium/Cesium');

/**
 * 加载arcgis动态服务
 * @param cesium
 * @param url
 */
export function addOgcImageLayer(url,layers,srs){
    return new cesium.WebMapServiceImageryProvider({
        url: url,
        layers: layers,
        parameters: {
            transparent: true,
            format: 'image/png',
            version: '1.1.0',
            srs: srs,
        }
    })
}
