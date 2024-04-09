import shp from "shpjs";

//convert shapefile to geojson
//return type: geojson
export default function shpReader(file)  {
    let fileReader = new FileReader();
    var r;
    fileReader.onload = function(file) {
        let result = file.target.result;
        r = result;
    }
    fileReader.readAsDataURL(file);
    return r;
}