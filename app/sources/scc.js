function scc(_object, data) {
  const ENDPOINT = 'https://plugin.sc2.zone';
  const PATH = {
    SEARCH: "/api/media/filter/v2/search?order=desc&sort=score&type=*",
    MEDIA: '/api/media/'
  }
  const TOKEN = "th2tdy0no8v1zoh1fs59"

  let network = new Lampa.Reguest()
  let extract = {}
  let results = []
  let object = _object
  let embed = component.proxy('scc') + ENDPOINT;

  let filter_items = {}


  /**
   * Начать поиск
   */
  this.search = function (_object, data) {
    if (this.wait_similars) return this.find(data[0].id)

    object = _object

    let url = `${embed}${PATH.SEARCH}`
    url = Lampa.Utils.addUrlComponent(url, `value=${encodeURIComponent(object.movie.imdb_id)}`)
    url = Lampa.Utils.addUrlComponent(url, `&access_token=${encodeURIComponent(TOKEN)}`)

    network.silent(url, ({hits}) => {
      const {_id: stream_id} = hits.hits.at(0);
      if (!stream_id) return

      network.clear();
      url = "";
      url = `${embed}${PATH.MEDIA}${stream_id}/streams`;
      url = Lampa.Utils.addUrlComponent(url, `&access_token=${encodeURIComponent(TOKEN)}`)

      network.silent(url, (streams) => {
        console.log(streams)
        // success(streams)
      })
    })
  }

  function success(data) {
    results = data
  }
}