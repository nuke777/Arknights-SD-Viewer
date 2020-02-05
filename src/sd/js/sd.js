function SD(basePath, identifier) {
    this.basePath = basePath;
    this.identifier = identifier;
    this.loader = new PIXI.loaders.Loader(this.basePath);
}

SD.prototype = {
    spineData : {},
    load: function(name, v, callback2) {
        if (!this.spineData[name]) {
            var skelpath = name+'.skel';
            var atlaspath = name+'.atlas';
            var texpath = name+'.png';

            this.loader.reset();

            this.loader.add(name+'_atlas_'+this.identifier, atlaspath, { xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.TEXT })
            this.loader.add(name+'_skel_'+this.identifier, skelpath, { xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.BUFFER })
            this.loader.add(name+'_tex_'+this.identifier, texpath)

            this.loader.load((loader, resources) => {
                var dec = new TextDecoder("utf-8");
                var head = dec.decode(resources[name+'_skel_'+this.identifier].data.slice(2, 10));
                var rawSkeletonData;
                if (head == "skeleton") {
                    rawSkeletonData = JSON.parse(dec.decode(resources[name+'_skel_'+this.identifier].data));
                } else {
                    var skelBin = new SkeletonBinary();
                    skelBin.data = new Uint8Array(resources[name+'_skel_'+this.identifier].data);
                    skelBin.initJson();

                    rawSkeletonData = skelBin.json;
                }
                //console.log(rawSkeletonData);
                var rawAtlasData = resources[name+'_atlas_'+this.identifier].data;
                var thisRef = this;
                var spineAtlas = new PIXI.spine.core.TextureAtlas(rawAtlasData, function(line, callback) {
                    callback(PIXI.BaseTexture.from(name+'_tex_'+thisRef.identifier));
                });
                var spineAtlasLoader = new PIXI.spine.core.AtlasAttachmentLoader(spineAtlas);
                var spineJsonParser = new PIXI.spine.core.SkeletonJson(spineAtlasLoader);
                var skeletonData = spineJsonParser.readSkeletonData(rawSkeletonData);

                this.spineData[name+"_"+this.identifier] = skeletonData;
                v.changeCanvas(skeletonData);
                v.spine.scale.set($(".vertical-descending").val(),$(".vertical-descending").val())
                callback2(false);
            });
        } else {
            v.changeCanvas(this.spineData[name]);
            v.spine.scale.set($(".vertical-descending").val(),$(".vertical-descending").val())
            callback2(false);
        }
    }
}
