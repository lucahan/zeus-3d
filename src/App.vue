<template>
    <div id="container" class="box">
        <div id="cesiumContainer"></div>
    </div>
</template>

<script>

    export default {
        name: 'App',
        components: {},
        mounted() {
            this.init()
        },
        methods: {
            init() {
                let Cesium = this.cesium
                let viewer = new Cesium.Viewer('cesiumContainer');
                viewer._cesiumWidget._creditContainer.style.display = "none";// 隐藏版权

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

                // 将三维球定位到中国
                viewer.camera.flyTo({
                    destination: Cesium.Cartesian3.fromDegrees(112.96, 28.20, 57850)
                });
            }
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
</style>
