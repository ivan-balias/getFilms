function webshare() {
  const ENDPOINT = 'https://webshare.cz';
  const PATH = {
    SALT: "/api/salt/",
    LOGIN: "/api/login/",
    USER_DATA: "/api/user_data/",
    FILE_LINK: "/api/file_link/",
    SEARCH: "/api/search/",
    FILE_INFO: "/api/file_info/",
  }

  const TOKEN = "N66aObXYOWcPFLZL"

  const network = new Lampa.Reguest()

  this.load = (path, body) => {
    const url = `${ENDPOINT}${path}`
    const headers = {'Content-Type': 'application/x-www-form-urlencoded'};
    // network.
    network.silent(url, (response) => {
      console.log(response)
    }, _ ,{}, {method: "POST", headers})

    // const response = await (await fetch(url, {method: "POST", body, headers})).text();
    // const xml = new DOMParser().parseFromString(response, "application/xml");
    // try {
    //   const response = xml.getElementsByTagName("response")[0];
    //   if (!response)
    //     throw new Error("Unexpected response");
    //   if (response.getElementsByTagName("status")?.[0]?.textContent !== "OK")
    //     throw new Error(response.getElementsByTagName("message")?.[0]?.textContent || undefined);
    //   return response;
    // } catch (error) {
    //   throw error;
    // }
  }

  this.loadValue = (path, body, param) => {
    const xml = this.load(path, body);
    return xml.getElementsByTagName(param)[0].textContent;
  }

  this.fileLink = (ident) => {
    console.log(ident)
    const body = `ident=${encodeURIComponent(ident)}&wst=${encodeURIComponent(TOKEN)}&download_type=video_stream`;
    return this.loadValue(PATH.FILE_LINK, body, "link");
  }
}

export default webshare;