import { useContext } from "react";
import AppContext from "../constants/AppContext";

/**
 * @author blaine, rory
 * @summary Function to upload video -> modified slightly from blaines work previosly in Login.js
 * @todo require more concrete html response from server on upload completion and before processing for error handling (can have different errors for uploading, processing and results)
 *
 */

export default async function postVideo(auri) {
  //const context = useContext(AppContext);

  const hostIpPort = "http://172.20.10.2:80/api/SwiftUserManagement";

  //validate path string
  if (auri != null) {
    //&& typeof auri == "string") {
    const apiUrl = hostIpPort + "/analyseVideo?Name=Michal%20Guzy";
    console.log(auri);
    //const uri = this.state.image;
    //try to parse path of image
    //try {
    // const uriPartsFileType = auri.split(".");
    // var fileType = uriPartsFileType[uriPartsFileType.length - 1];

    // const uriPartsFileName = auri.split("/");
    // var fileName = uriPartsFileName[uriPartsFileName.length - 1];
    var fileType = "mp4";
    var fileName = "video";
    //} catch {
    // Alert.alert(
    //   "Error, path to video file malformed; upload operation cancelled",
    //   [{ text: "OK" }],
    //   { cancelable: false }
    // );


    const data = new FormData();
    data.append("video", {
      name: "mobile-video-upload",
      type: "video/mp4",
      auri,
    });

    try {
      await fetch(apiUrl, {
        method: "post",
        body: data,
      });
    } catch (e) {
      console.error(e);
    }

    //if respoonse ok
    // else {
    //   Alert.alert("Error, path to video not found", [{ text: "OK" }], {
    //     cancelable: false,
    //   });
  }
}
