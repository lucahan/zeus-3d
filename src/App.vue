<template>
    <div id="container" class="box">
        <div id="cesiumContainer"></div>
    </div>
</template>

<script>

import {addArcGISImageLayer} from './core/mapArcgis'

export default {
    name: 'App',
    components: {},
    mounted() {
        this.init()
    },
    methods: {
        init() {
            let Cesium = this.cesium
            let viewer = new Cesium.Viewer('cesiumContainer', {
                geocoder: false,
                homeButton: false,
                sceneModePicker: false,
                baseLayerPicker: false,
                fullscreenButton: false,
                navigationHelpButton: false,
                animation: false,
                timeline: false,
                fulllscreenButtond: false,
                vrButton: false,
                infoBox: false
            });
            viewer._cesiumWidget._creditContainer.style.display = "none";// 隐藏版权

            this. show3DCoordinates(viewer);

            //矢量底图
            viewer.imageryLayers.addImageryProvider(
                new this.cesium.WebMapTileServiceImageryProvider({
                    url: "http://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=719fbabce3f84fb70bb9884d7df106ee",
                    layer: "tdtImgBasicLayer",
                    style: "default",
                    format: "image/jpeg",
                    tileMatrixSetID: "GoogleMapsCompatible",
                    show: false
                })
            );
            //中文地名注记
            viewer.imageryLayers.addImageryProvider(
                new this.cesium.WebMapTileServiceImageryProvider({
                    url: "http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=719fbabce3f84fb70bb9884d7df106ee",
                    layer: "tdtAnnoLayer",
                    style: "default",
                    format: "tiles",
                    tileMatrixSetID: "GoogleMapsCompatible",
                    show: true
                })
            );

            const arcgisCanyinLayer = addArcGISImageLayer('/agmap/arcgis/rest/services/canyin/MapServer');
            viewer.imageryLayers.addImageryProvider(arcgisCanyinLayer);


            //
            //
            // const hospitalWms = new this.cesium.WebMapServiceImageryProvider({
            //     url: '/agmap/arcgis/services/yiyuan/MapServer/WmsServer',
            //     layers: '0',
            //     parameters: {
            //         transparent: true,
            //         format: 'image/png',
            //         version: '1.1.0',
            //         srs: 'EPSG:4326',
            //     }
            // });
            //
            // viewer.imageryLayers.addImageryProvider(
            //     hospitalWms
            // );

            // 将三维球定位到中国
            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(112.96, 28.20, 57850)
            });
        },
        show3DCoordinates: function (viewer) {
            let cesium = this.cesium
            //地图底部工具栏显示地图坐标信息
            var elementbottom = document.createElement("div");
            document.getElementById("cesiumContainer").append(elementbottom);
            elementbottom.className = "mapfootBottom";
            var coordinatesDiv = document.getElementById(this.mapDivId + "_coordinates");
            if (coordinatesDiv) {
                coordinatesDiv.style.display = "block";
            }
            else {

                //var scale;
                var _divID_coordinates = this.mapDivId + "_coordinates";
                coordinatesDiv = document.createElement("div");
                coordinatesDiv.id = _divID_coordinates;
                coordinatesDiv.className = "map3D-coordinates";
                coordinatesDiv.innerHTML = "<span id='cd_label' style='font-size:13px;text-align:center;font-family:微软雅黑;color:#edffff;'>暂无坐标信息</span>";
                document.getElementById("cesiumContainer").append(coordinatesDiv);
                var handler3D = new this.cesium.ScreenSpaceEventHandler(
                    viewer.scene.canvas);
                handler3D.setInputAction(function(movement) {
                    var pick= new cesium.Cartesian2(movement.endPosition.x,movement.endPosition.y);
                    if(pick){
                        var cartesian = viewer.scene.globe.pick(viewer.camera.getPickRay(pick), viewer.scene);
                        if(cartesian){
                            //世界坐标转地理坐标（弧度）
                            var cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
                            if(cartographic){
                                //海拔
                                var height = viewer.scene.globe.getHeight(cartographic);
                                //视角海拔高度
                                var he = Math.sqrt(viewer.scene.camera.positionWC.x * viewer.scene.camera.positionWC.x + viewer.scene.camera.positionWC.y * viewer.scene.camera.positionWC.y + viewer.scene.camera.positionWC.z * viewer.scene.camera.positionWC.z);
                                var he2 = Math.sqrt(cartesian.x * cartesian.x + cartesian.y * cartesian.y + cartesian.z * cartesian.z);
                                //地理坐标（弧度）转经纬度坐标
                                var point=[ cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180];
                                if(!height){
                                    height = 0;
                                }
                                if(!he){
                                    he = 0;
                                }
                                if(!he2){
                                    he2 = 0;
                                }
                                if(!point){
                                    point = [0,0];
                                }
                                coordinatesDiv.innerHTML = "<span id='cd_label' style='font-size:13px;text-align:center;font-family:微软雅黑;color:#edffff;'>"+"视角海拔高度:"+(he - he2).toFixed(2)+"米"+"&nbsp;&nbsp;&nbsp;&nbsp;海拔:"+height.toFixed(2)+"米"+"&nbsp;&nbsp;&nbsp;&nbsp;经度：" + point[0].toFixed(6) + "&nbsp;&nbsp;纬度：" + point[1].toFixed(6)+ "</span>";
                            }
                        }
                    }
                }, cesium.ScreenSpaceEventType.MOUSE_MOVE);
            }
        },
    }

}
</script>

<style>
html,
body,
#cesiumContainer {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
}

.box {
    height: 100%;
}

/* 显示当前坐标 */
.map3D-coordinates{
    z-index: 888;
    position: absolute;
    bottom: 15px;
    height: auto;
    overflow: hidden;
    text-align: center;
    left: 10px;
    height: 29px;
    line-height: 29px;
}
</style>
