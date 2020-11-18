import axios from "axios";

export const getUrlFromDropFile = (dataTransfer) => {
  const getUrl = (url, name = "") => {
    let urlMD = url;
    if (["png", "jpg", "svg"].some((e) => e === url.slice(-3))) {
      urlMD = `\n![${name}](${url})\n`;
    }
    return urlMD;
  };
  return new Promise(async (resolve, reject) => {
    if (dataTransfer.files.length > 0) {
      const body = new FormData();
      for (const item of dataTransfer.files) {
        if (item.type.indexOf("image") !== -1) {
          body.append("postImage", item);
        }
      }
      const resp = await axios.post("/api/upload", body);
      const urls = resp.data.map((e) =>
        getUrl("/upload/" + resp.data[0].filename, resp.data[0].originalname)
      );
      return resolve(urls.join("\n"));
    } else if (dataTransfer.items.length > 0) {
      for (const item of dataTransfer.items) {
        if (item.type === "text/uri-list") {
          return item.getAsString((string) => resolve(getUrl(string)));
        }
      }
    }
    return reject();
  });
};