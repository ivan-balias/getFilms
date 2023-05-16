(()=>{
  'use strict'
  function scc(_object, data) {
  const ENDPOINT = 'https://plugin.sc2.zone';
  const PATH = {
    SEARCH: "/api/media/filter/v2/search?order=desc&sort=score&type=*",
    MEDIA: '/api/media/'
  }
  const TOKEN = "th2tdy0no8v1zoh1fs59"

  const userLang = Lampa.Storage.get('language')

  let choice = {
    season: 0,
    voice: 0,
    voice_name: ''
  }

  let network = new Lampa.Reguest()
  let extract = {}
  let results = []
  let object = _object
  let embed = _object.proxy('scc') + ENDPOINT;

  let filter_items = {}

  this.searchByImdbID = function (_object, data) {
    // if (this.wait_similars) return this.find(data[0].id)

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
        // console.log(streams)
        success(streams)
      })
    })
  }

  this.extendChoice = function (saved) {
    Lampa.Arrays.extend(choice, saved, true)
  }

  function success(json) {
    results = json

    build(json)


  }

  function build(streams) {
    network.timeout(20000)

    const fromUserLang = streams.filter((stream) => {
      return stream.audio.at(0).language === userLang
    })



    console.log(results)
    console.log(fromUserLang)
  }

  function append(items) {

    _object.reset();

    _object.draw(items, {
      
    })

  }

}
function component(object) {
  let network = new Lampa.Reguest()
  let scroll = new Lampa.Scroll({mask: true, over: true})
  let files = new Lampa.Explorer(object)
  let filter = new Lampa.Filter(object)
  let sources = {
    scc: scc
  }
  let last
  let extended
  let selected_id
  let source
  let balanser
  let initialized
  let balanser_timer
  let images = []

  let filter_sources = Lampa.Arrays.getKeys(sources)
  let filter_translate = {
    season: Lampa.Lang.translate('torrent_serial_season'),
    voice: Lampa.Lang.translate('torrent_parser_voice'),
    source: Lampa.Lang.translate('settings_rest_source')
  }

  this.initialize = function () {
    source = this.createSource()

    filter.onSearch = (value) => {
      Lampa.Activity.replace({
        search: value,
        clarification: true
      })
    }

    filter.onBack = () => {
      this.start()
    }

    filter.render().find('.selector').on('hover:enter', () => {
      clearInterval(balanser_timer)
    })

    filter.onSelect = (type, a, b) => {
      if (type == 'filter') {
        if (a.reset) {
          if (extended) source.reset()
          else this.start()
        } else {
          source.filter(type, a, b)
        }
      } else if (type == 'sort') {
        Lampa.Select.close()

        this.changeBalanser(a.source)
      }
    }

    if (filter.addButtonBack) filter.addButtonBack()

    filter.render().find('.filter--sort span').text(Lampa.Lang.translate('cineSearch_balanser'))

    files.appendFiles(scroll.render())
    files.appendHead(filter.render())

    scroll.body().addClass('torrent-list')

    scroll.minus(files.render().find('.explorer__files-head'))

    this.search()
  }

  this.changeBalanser = function (balanser_name) {
    let last_select_balanser = Lampa.Storage.cache('cineSearch_last_balanser', 3000, {})
    last_select_balanser[object.movie.id] = balanser_name

    Lampa.Storage.set('cineSearch_last_balanser', last_select_balanser)
    Lampa.Storage.set('cineSearch_balanser', balanser_name)

    let to = this.getChoice(balanser_name)
    let from = this.getChoice()

    if (from.voice_name) to.voice_name = from.voice_name

    this.saveChoice(to, balanser_name)

    Lampa.Activity.replace()
  }

  this.createSource = function () {
    let last_select_balanser = Lampa.Storage.cache('cineSearch_last_balanser', 3000, {})

    if (last_select_balanser[object.movie.id]) {
      balanser = last_select_balanser[object.movie.id]
      Lampa.Storage.set('cineSearch_last_balanser', last_select_balanser)
    }

    if (!sources[balanser]) {
      balanser = 'scc'
    }

    return new sources[balanser](this, object)
  }

  this.proxy = function(name){
    let prox = Lampa.Storage.get('online_proxy_all')
    let need = Lampa.Storage.get('online_proxy_'+name)

    if(need) prox = need

    if(prox && prox.slice(-1) !== '/'){
      prox += '/'
    }

    return prox
  }
  this.create = function () {
    return this.render()
  }

  this.search = function () {
    this.activity.loader(true)

    this.filter({
      source: filter_sources
    }, this.getChoice())

    this.find()
  }

  this.find = function () {
    const letsGo = (imdb_id) => {
      if (imdb_id && source.searchByImdbID) {
        this.extendChoice()
        source.searchByImdbID(object, imdb_id)
      }
    }

    if (object.movie.imdb_id) {
      letsGo(object.movie.imdb_id)
    }
  }

  this.getChoice = function (for_balanser) {
    let data = Lampa.Storage.cache('cineSearch_choice_' + (for_balanser || balanser), 3000, {})
    let save = data[selected_id || object.movie.id] || {}

    Lampa.Arrays.extend(save, {
      season: 0,
      voice: 0,
      voice_name: '',
      voice_id: 0,
      episodes_view: {},
      movie_view: ''
    })

    return save
  }

  this.extendChoice = function () {
    extended = true
    source.extendChoice(this.getChoice())
  }

  this.saveChoice = function (choice, for_balanser) {
    let data = Lampa.Storage.cache('online_choice_' + (for_balanser || balanser), 3000, {})

    data[selected_id || object.movie.id] = choice

    Lampa.Storage.set('online_choice_' + (for_balanser || balanser), data)
  }

  this.clearImages = function () {
    images.forEach(img => {
      img.onerror = () => {
      }
      img.onload = () => {
      }

      img.src = ''
    })

    images = []
  }

  this.reset = function () {
    last = false

    clearInterval(balanser_timer)

    network.clear()

    this.clearImages()

    scroll.render().find('.empty').remove()

    scroll.clear()
  }

  this.loading = function (status) {
    if (status) this.activity.loader(true)
    else {
      this.activity.loader(false)

      this.activity.toggle()
    }
  }

  this.filter = function (filter_items, choice) {
    let select = []

    let add = (type, title) => {
      let need = this.getChoice()
      let items = filter_items[type]
      let subitems = []
      let value = need[type]

      items.forEach((name, i) => {
        subitems.push({
          title: name,
          selected: value == i,
          index: i
        })
      })

      select.push({
        title: title,
        subtitle: items[value],
        items: subitems,
        stype: type
      })
    }

    filter_items.source = filter_sources

    select.push({
      title: Lampa.Lang.translate('torrent_parser_reset'),
      reset: true
    })

    this.saveChoice(choice)

    if (filter_items.voice && filter_items.voice.length) add('voice', Lampa.Lang.translate('torrent_parser_voice'))

    if (filter_items.season && filter_items.season.length) add('season', Lampa.Lang.translate('torrent_serial_season'))

    filter.set('filter', select)
    filter.set('sort', filter_sources.map(e => {
      return {title: e, source: e, selected: e == balanser}
    }))

    this.selected(filter_items)
  }

  this.closeFilter = function () {
    if ($('body').hasClass('selectbox--open')) Lampa.Select.close()
  }

  this.selected = function (filter_items) {
    let need = this.getChoice(),
        select = []

    for (let i in need) {
      if (filter_items[i] && filter_items[i].length) {
        if (i == 'voice') {
          select.push(filter_translate[i] + ': ' + filter_items[i][need[i]])
        } else if (i !== 'source') {
          if (filter_items.season.length >= 1) {
            select.push(filter_translate.season + ': ' + filter_items[i][need[i]])
          }
        }
      }
    }

    filter.chosen('filter', select)
    filter.chosen('sort', [balanser])
  }

  this.getEpisodes = function (season, call) {
    let episodes = []

    if (typeof object.movie.id == 'number' && object.movie.name) {
      let tmdburl = 'tv/' + object.movie.id + '/season/' + season + '?api_key=' + Lampa.TMDB.key() + '&language=' + Lampa.Storage.get('language', 'ru')
      let baseurl = Lampa.TMDB.api(tmdburl)

      network.timeout(1000 * 10)

      network.native(baseurl, function (data) {
        episodes = data.episodes || []

        call(episodes)
      }, (a, c) => {
        call(episodes)
      })
    } else call(episodes)
  }

  this.append = function (item) {
    item.on('hover:focus', (e) => {
      last = e.target

      scroll.update($(e.target), true)
    })

    scroll.append(item)
  }

  this.watched = function (set) {
    let file_id = Lampa.Utils.hash(object.movie.number_of_seasons ? object.movie.original_name : object.movie.original_title)
    let watched = Lampa.Storage.cache('online_watched_last', 5000, {})

    if (set) {
      if (!watched[file_id]) watched[file_id] = {}

      Lampa.Arrays.extend(watched[file_id], set, true)

      Lampa.Storage.set('online_watched_last', watched)

      this.updateWatched()
    } else {
      return watched[file_id]
    }
  }

  this.updateWatched = function () {
    let watched = this.watched()
    let body = scroll.body().find('.online-prestige-watched .online-prestige-watched__body').empty()

    if (watched) {
      let line = []

      if (watched.balanser_name) line.push(watched.balanser_name)
      if (watched.voice_name) line.push(watched.voice_name)
      if (watched.season) line.push(Lampa.Lang.translate('torrent_serial_season') + ' ' + watched.season)
      if (watched.episode) line.push(Lampa.Lang.translate('torrent_serial_episode') + ' ' + watched.episode)

      line.forEach(n => {
        body.append('<span>' + n + '</span>')
      })
    } else body.append('<span>' + Lampa.Lang.translate('online_no_watch_history') + '</span>')
  }

  this.draw = function (items, params = {}) {
    if (!items.length) return this.empty()

    scroll.append(Lampa.Template.get('online_prestige_watched', {}))

    this.updateWatched()

    this.getEpisodes(items[0].season, episodes => {
      let viewed = Lampa.Storage.cache('online_view', 5000, [])
      let serial = object.movie.name ? true : false
      let choice = this.getChoice()
      let fully = window.innerWidth > 480

      let scroll_to_element = false
      let scroll_to_mark = false

      items.forEach((element, index) => {
        let episode = serial && episodes.length && !params.similars ? episodes.find(e => e.episode_number == element.episode) : false
        let episode_num = element.episode || (index + 1)
        let episode_last = choice.episodes_view[element.season]

        Lampa.Arrays.extend(element, {
          info: '',
          quality: '',
          time: Lampa.Utils.secondsToTime((episode ? episode.runtime : object.movie.runtime) * 60, true)
        })

        let hash_timeline = Lampa.Utils.hash(element.season ? [element.season, element.episode, object.movie.original_title].join('') : object.movie.original_title)
        let hash_behold = Lampa.Utils.hash(element.season ? [element.season, element.episode, object.movie.original_title, element.voice_name].join('') : object.movie.original_title + element.voice_name)

        let data = {
          hash_timeline,
          hash_behold
        }

        let info = []

        if (element.season) {
          element.translate_episode_end = this.getLastEpisode(items)
          element.translate_voice = element.voice_name
        }

        element.timeline = Lampa.Timeline.view(hash_timeline)

        if (episode) {
          element.title = episode.name

          if (element.info.length < 30 && episode.vote_average) info.push(Lampa.Template.get('online_prestige_rate', {rate: parseFloat(episode.vote_average + '').toFixed(1)}, true))

          if (episode.air_date && fully) info.push(Lampa.Utils.parseTime(episode.air_date).full)
        } else if (object.movie.release_date && fully) {
          info.push(Lampa.Utils.parseTime(object.movie.release_date).full)
        }

        if (!serial && object.movie.tagline && element.info.length < 30) info.push(object.movie.tagline)

        if (element.info) info.push(element.info)

        if (info.length) element.info = info.map(i => '<span>' + i + '</span>').join('<span class="online-prestige-split">●</span>')

        let html = Lampa.Template.get('online_prestige_full', element)
        let loader = html.find('.online-prestige__loader')
        let image = html.find('.online-prestige__img')

        if (!serial) {
          if (choice.movie_view == hash_behold) scroll_to_element = html
        } else if (typeof episode_last !== 'undefined' && episode_last == episode_num) {
          scroll_to_element = html
        }

        if (serial && !episode) {
          image.append('<div class="online-prestige__episode-number">' + ('0' + (element.episode || (index + 1))).slice(-2) + '</div>')

          loader.remove()
        } else {
          let img = html.find('img')[0]

          img.onerror = function () {
            img.src = './img/img_broken.svg'
          }

          img.onload = function () {
            image.addClass('online-prestige__img--loaded')

            loader.remove()

            if (serial) image.append('<div class="online-prestige__episode-number">' + ('0' + (element.episode || (index + 1))).slice(-2) + '</div>')
          }

          img.src = Lampa.TMDB.image('t/p/w300' + (episode ? episode.still_path : object.movie.backdrop_path))

          images.push(img)
        }

        html.find('.online-prestige__timeline').append(Lampa.Timeline.render(element.timeline))

        if (viewed.indexOf(hash_behold) !== -1) {
          scroll_to_mark = html

          html.find('.online-prestige__img').append('<div class="online-prestige__viewed">' + Lampa.Template.get('icon_viewed', {}, true) + '</div>')
        }


        element.mark = () => {
          viewed = Lampa.Storage.cache('online_view', 5000, [])

          if (viewed.indexOf(hash_behold) == -1) {
            viewed.push(hash_behold)

            Lampa.Storage.set('online_view', viewed)

            if (html.find('.online-prestige__viewed').length == 0) {
              html.find('.online-prestige__img').append('<div class="online-prestige__viewed">' + Lampa.Template.get('icon_viewed', {}, true) + '</div>')
            }
          }

          choice = this.getChoice()

          if (!serial) {
            choice.movie_view = hash_behold
          } else {
            choice.episodes_view[element.season] = episode_num
          }

          this.saveChoice(choice)

          this.watched({
            balanser: balanser,
            balanser_name: Lampa.Utils.capitalizeFirstLetter(balanser),
            voice_id: choice.voice_id,
            voice_name: choice.voice_name || element.voice_name,
            episode: element.episode,
            season: element.season
          })
        }

        element.unmark = () => {
          viewed = Lampa.Storage.cache('online_view', 5000, [])

          if (viewed.indexOf(hash_behold) !== -1) {
            Lampa.Arrays.remove(viewed, hash_behold)

            Lampa.Storage.set('online_view', viewed)

            if (Lampa.Manifest.app_digital >= 177) Lampa.Storage.remove('online_view', hash_behold)

            html.find('.online-prestige__viewed').remove()
          }
        }

        element.timeclear = () => {
          element.timeline.percent = 0
          element.timeline.time = 0
          element.timeline.duration = 0

          Lampa.Timeline.update(element.timeline)
        }

        html.on('hover:enter', () => {
          if (object.movie.id) Lampa.Favorite.add('history', object.movie, 100)

          if (params.onEnter) params.onEnter(element, html, data)
        }).on('hover:focus', (e) => {
          last = e.target

          if (params.onFocus) params.onFocus(element, html, data)

          scroll.update($(e.target), true)
        })

        if (params.onRender) params.onRender(element, html, data)

        this.contextMenu({
          html,
          element,
          onFile: (call) => {
            if (params.onContextMenu) params.onContextMenu(element, html, data, call)
          },
          onClearAllMark: () => {
            items.forEach(elem => {
              elem.unmark()
            })
          },
          onClearAllTime: () => {
            items.forEach(elem => {
              elem.timeclear()
            })
          }
        })

        scroll.append(html)
      })

      if (serial && episodes.length > items.length && !params.similars) {
        let left = episodes.slice(items.length)

        left.forEach(episode => {
          let info = []

          if (episode.vote_average) info.push(Lampa.Template.get('online_prestige_rate', {rate: parseFloat(episode.vote_average + '').toFixed(1)}, true))
          if (episode.air_date) info.push(Lampa.Utils.parseTime(episode.air_date).full)

          let air = new Date((episode.air_date + '').replace(/-/g, '/'))
          let now = Date.now()

          let day = Math.round((air.getTime() - now) / (24 * 60 * 60 * 1000))
          let txt = Lampa.Lang.translate('full_episode_days_left') + ': ' + day

          let html = Lampa.Template.get('online_prestige_full', {
            time: Lampa.Utils.secondsToTime((episode ? episode.runtime : object.movie.runtime) * 60, true),
            info: info.length ? info.map(i => '<span>' + i + '</span>').join('<span class="online-prestige-split">●</span>') : '',
            title: episode.name,
            quality: day > 0 ? txt : ''
          })
          let loader = html.find('.online-prestige__loader')
          let image = html.find('.online-prestige__img')
          let season = items[0] ? items[0].season : 1

          html.find('.online-prestige__timeline').append(Lampa.Timeline.render(Lampa.Timeline.view(Lampa.Utils.hash([season, episode.episode_number, object.movie.original_title].join('')))))

          let img = html.find('img')[0]

          if (episode.still_path) {
            img.onerror = function () {
              img.src = './img/img_broken.svg'
            }

            img.onload = function () {
              image.addClass('online-prestige__img--loaded')

              loader.remove()

              image.append('<div class="online-prestige__episode-number">' + ('0' + (episode.episode_number)).slice(-2) + '</div>')
            }

            img.src = Lampa.TMDB.image('t/p/w300' + episode.still_path)

            images.push(img)
          } else {
            loader.remove()

            image.append('<div class="online-prestige__episode-number">' + ('0' + (episode.episode_number)).slice(-2) + '</div>')
          }

          html.on('hover:focus', (e) => {
            last = e.target

            scroll.update($(e.target), true)
          })

          scroll.append(html)
        })
      }

      if (scroll_to_element) {
        last = scroll_to_element[0]
      } else if (scroll_to_mark) {
        last = scroll_to_mark[0]
      }

      Lampa.Controller.enable('content')
    })
  }

  this.contextMenu = function (params) {
    params.html.on('hover:long', () => {
      function show(extra) {
        let enabled = Lampa.Controller.enabled().name

        let menu = []

        if (Lampa.Platform.is('webos')) {
          menu.push({
            title: Lampa.Lang.translate('player_lauch') + ' - Webos',
            player: 'webos'
          })
        }

        if (Lampa.Platform.is('android')) {
          menu.push({
            title: Lampa.Lang.translate('player_lauch') + ' - Android',
            player: 'android'
          })
        }

        menu.push({
          title: Lampa.Lang.translate('player_lauch') + ' - Lampa',
          player: 'lampa'
        })

        menu.push({
          title: Lampa.Lang.translate('online_video'),
          separator: true
        })

        menu.push({
          title: Lampa.Lang.translate('torrent_parser_label_title'),
          mark: true
        })
        menu.push({
          title: Lampa.Lang.translate('torrent_parser_label_cancel_title'),
          unmark: true
        })
        menu.push({
          title: Lampa.Lang.translate('time_reset'),
          timeclear: true
        })

        if (extra) {
          menu.push({
            title: Lampa.Lang.translate('copy_link'),
            copylink: true
          })
        }

        menu.push({
          title: Lampa.Lang.translate('more'),
          separator: true
        })

        if (Lampa.Account.logged() && params.element && typeof params.element.season !== 'undefined' && params.element.translate_voice) {
          menu.push({
            title: Lampa.Lang.translate('online_voice_subscribe'),
            subscribe: true
          })
        }

        menu.push({
          title: Lampa.Lang.translate('online_clear_all_marks'),
          clearallmark: true
        })

        menu.push({
          title: Lampa.Lang.translate('online_clear_all_timecodes'),
          timeclearall: true
        })

        Lampa.Select.show({
          title: Lampa.Lang.translate('title_action'),
          items: menu,
          onBack: () => {
            Lampa.Controller.toggle(enabled)
          },
          onSelect: (a) => {
            if (a.mark) params.element.mark()
            if (a.unmark) params.element.unmark()
            if (a.timeclear) params.element.timeclear()

            if (a.clearallmark) params.onClearAllMark()
            if (a.timeclearall) params.onClearAllTime()

            Lampa.Controller.toggle(enabled)

            if (a.player) {
              Lampa.Player.runas(a.player)

              params.html.trigger('hover:enter')
            }

            if (a.copylink) {
              if (extra.quality) {
                let qual = []

                for (let i in extra.quality) {
                  qual.push({
                    title: i,
                    file: extra.quality[i]
                  })
                }

                Lampa.Select.show({
                  title: Lampa.Lang.translate('settings_server_links'),
                  items: qual,
                  onBack: () => {
                    Lampa.Controller.toggle(enabled)
                  },
                  onSelect: (b) => {
                    Lampa.Utils.copyTextToClipboard(b.file, () => {
                      Lampa.Noty.show(Lampa.Lang.translate('copy_secuses'))
                    }, () => {
                      Lampa.Noty.show(Lampa.Lang.translate('copy_error'))
                    })
                  }
                })
              } else {
                Lampa.Utils.copyTextToClipboard(extra.file, () => {
                  Lampa.Noty.show(Lampa.Lang.translate('copy_secuses'))
                }, () => {
                  Lampa.Noty.show(Lampa.Lang.translate('copy_error'))
                })
              }
            }

            if (a.subscribe) {
              Lampa.Account.subscribeToTranslation({
                card: object.movie,
                season: params.element.season,
                episode: params.element.translate_episode_end,
                voice: params.element.translate_voice
              }, () => {
                Lampa.Noty.show(Lampa.Lang.translate('online_voice_success'))
              }, () => {
                Lampa.Noty.show(Lampa.Lang.translate('online_voice_error'))
              })
            }
          }
        })
      }

      params.onFile(show)
    }).on('hover:focus', () => {
      if (Lampa.Helper) Lampa.Helper.show('online_file', Lampa.Lang.translate('helper_online_file'), params.html)
    })
  }

  this.empty = function (msg) {
    let html = Lampa.Template.get('online_does_not_answer', {})

    html.find('.online-empty__buttons').remove()
    html.find('.online-empty__title').text(Lampa.Lang.translate('empty_title_two'))
    html.find('.online-empty__time').text(Lampa.Lang.translate('empty_text'))

    scroll.append(html)

    this.loading(false)
  }

  this.doesNotAnswer = function () {
    this.reset()

    let html = Lampa.Template.get('online_does_not_answer', {balanser})
    let tic = 10

    html.find('.cancel').on('hover:enter', () => {
      clearInterval(balanser_timer)
    })

    html.find('.change').on('hover:enter', () => {
      clearInterval(balanser_timer)

      filter.render().find('.filter--sort').trigger('hover:enter')
    })

    scroll.append(html)

    this.loading(false)

    balanser_timer = setInterval(() => {
      tic--

      html.find('.timeout').text(tic)

      if (tic == 0) {
        clearInterval(balanser_timer)

        let keys = Lampa.Arrays.getKeys(sources)
        let indx = keys.indexOf(balanser)
        let next = keys[indx + 1]

        if (!next) next = keys[0]

        balanser = next

        if (Lampa.Activity.active().activity == this.activity) this.changeBalanser(balanser)
      }
    }, 1000)
  }

  this.getLastEpisode = function (items) {
    let last_episode = 0

    items.forEach(e => {
      if (typeof e.episode !== 'undefined') last_episode = Math.max(last_episode, parseInt(e.episode))
    })

    return last_episode
  }

  this.start = function () {
    if (Lampa.Activity.active().activity !== this.activity) return

    if (!initialized) {
      initialized = true

      this.initialize()
    }

    Lampa.Background.immediately(Lampa.Utils.cardImgBackgroundBlur(object.movie))

    Lampa.Controller.add('content', {
      toggle: () => {
        Lampa.Controller.collectionSet(scroll.render(), files.render())
        Lampa.Controller.collectionFocus(last || false, scroll.render())
      },
      up: () => {
        if (Navigator.canmove('up')) {
          Navigator.move('up')
        } else Lampa.Controller.toggle('head')
      },
      down: () => {
        Navigator.move('down')
      },
      right: () => {
        if (Navigator.canmove('right')) Navigator.move('right')
        else filter.show(Lampa.Lang.translate('title_filter'), 'filter')
      },
      left: () => {
        if (Navigator.canmove('left')) Navigator.move('left')
        else Lampa.Controller.toggle('menu')
      },
      gone: () => {
        clearInterval(balanser_timer)
      },
      back: this.back
    })

    Lampa.Controller.toggle('content')
  }

  this.render = function () {
    return files.render()
  }

  this.back = function () {
    Lampa.Activity.backward()
  }

  this.pause = function () {
  }

  this.stop = function () {
  }

  this.destroy = function () {
    network.clear()

    this.clearImages()

    files.destroy()

    scroll.destroy()

    clearInterval(balanser_timer)

    if (source) source.destroy()
  }
}

const startPlugin = () => {
  window.CineSearch = true;
  let manifest = {
    type: 'video',
    version: '1.0.0',
    name: 'Cine Search beta',
    description: 'Cine Search beta',
    component: "cineSearch",
    onContextMenu: (object) => {
      return {
        name: 'Film Plugin beta',
        description: 'Film Plugin beta',
      }
    },
    onContextLaunch: (object) => {
      resetTemplates();
      Lampa.Component.add('cineSearch', component)

      Lampa.Activity.push({
        url: '',
        title: 'Cine Search beta',
        component: 'cineSearch',
        search: object.title,
        search_one: object.title,
        search_two: object.original_title,
        movie: object,
        page: 1,
      })
    }
  }
  Lampa.Manifest.plugins = manifest;
  Lampa.Template.add('cineSearch_css', `
            <style>
            .online-prestige{position:relative;-webkit-border-radius:.3em;-moz-border-radius:.3em;border-radius:.3em;background-color:rgba(0,0,0,0.3);display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;will-change:transform}.online-prestige__body{padding:1.2em;line-height:1.3;-webkit-box-flex:1;-webkit-flex-grow:1;-moz-box-flex:1;-ms-flex-positive:1;flex-grow:1;position:relative}@media screen and (max-width:480px){.online-prestige__body{padding:.8em 1.2em}}.online-prestige__img{position:relative;width:13em;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0;min-height:8.2em}.online-prestige__img>img{position:absolute;top:0;left:0;width:100%;height:100%;-o-object-fit:cover;object-fit:cover;-webkit-border-radius:.3em;-moz-border-radius:.3em;border-radius:.3em;opacity:0;-webkit-transition:opacity .3s;-o-transition:opacity .3s;-moz-transition:opacity .3s;transition:opacity .3s}.online-prestige__img--loaded>img{opacity:1}@media screen and (max-width:480px){.online-prestige__img{width:7em;min-height:6em}}.online-prestige__folder{padding:1em;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0}.online-prestige__folder>svg{width:4.4em !important;height:4.4em !important}.online-prestige__viewed{position:absolute;top:1em;left:1em;background:rgba(0,0,0,0.45);-webkit-border-radius:100%;-moz-border-radius:100%;border-radius:100%;padding:.25em;font-size:.76em}.online-prestige__viewed>svg{width:1.5em !important;height:1.5em !important}.online-prestige__episode-number{position:absolute;top:0;left:0;right:0;bottom:0;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;font-size:2em}.online-prestige__loader{position:absolute;top:50%;left:50%;width:2em;height:2em;margin-left:-1em;margin-top:-1em;background:url(./img/loader.svg) no-repeat center center;-webkit-background-size:contain;-moz-background-size:contain;-o-background-size:contain;background-size:contain}.online-prestige__head,.online-prestige__footer{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;-moz-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center}.online-prestige__timeline{margin:.8em 0}.online-prestige__timeline>.time-line{display:block !important}.online-prestige__title{font-size:1.7em;overflow:hidden;-o-text-overflow:ellipsis;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:1;line-clamp:1;-webkit-box-orient:vertical}@media screen and (max-width:480px){.online-prestige__title{font-size:1.4em}}.online-prestige__time{padding-left:2em}.online-prestige__info{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center}.online-prestige__info>*{overflow:hidden;-o-text-overflow:ellipsis;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:1;line-clamp:1;-webkit-box-orient:vertical}.online-prestige__quality{padding-left:1em;white-space:nowrap}.online-prestige__scan-file{position:absolute;bottom:0;left:0;right:0}.online-prestige__scan-file .broadcast__scan{margin:0}.online-prestige .online-prestige-split{font-size:.8em;margin:0 1em;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0}.online-prestige.focus::after{content:'';position:absolute;top:-0.6em;left:-0.6em;right:-0.6em;bottom:-0.6em;-webkit-border-radius:.7em;-moz-border-radius:.7em;border-radius:.7em;border:solid .3em #fff;z-index:-1;pointer-events:none}.online-prestige+.online-prestige{margin-top:1.5em}.online-prestige--folder .online-prestige__footer{margin-top:.8em}.online-prestige-watched{padding:1em}.online-prestige-watched__icon>svg{width:1.5em;height:1.5em}.online-prestige-watched__body{padding-left:1em;padding-top:.1em;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap}.online-prestige-watched__body>span+span::before{content:' ● ';vertical-align:top;display:inline-block;margin:0 .5em}.online-prestige-rate{display:-webkit-inline-box;display:-webkit-inline-flex;display:-moz-inline-box;display:-ms-inline-flexbox;display:inline-flex;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center}.online-prestige-rate>svg{width:1.3em !important;height:1.3em !important}.online-prestige-rate>span{font-weight:600;font-size:1.1em;padding-left:.7em}.online-empty{line-height:1.4}.online-empty__title{font-size:1.8em;margin-bottom:.3em}.online-empty__time{font-size:1.2em;font-weight:300;margin-bottom:1.6em}.online-empty__buttons{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex}.online-empty__buttons>*+*{margin-left:1em}.online-empty__button{background:rgba(0,0,0,0.3);font-size:1.2em;padding:.5em 1.2em;-webkit-border-radius:.2em;-moz-border-radius:.2em;border-radius:.2em;margin-bottom:2.4em}.online-empty__button.focus{background:#fff;color:black}.online-empty__templates .online-empty-template:nth-child(2){opacity:.5}.online-empty__templates .online-empty-template:nth-child(3){opacity:.2}.online-empty-template{background-color:rgba(255,255,255,0.3);padding:1em;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;-webkit-border-radius:.3em;-moz-border-radius:.3em;border-radius:.3em}.online-empty-template>*{background:rgba(0,0,0,0.3);-webkit-border-radius:.3em;-moz-border-radius:.3em;border-radius:.3em}.online-empty-template__ico{width:4em;height:4em;margin-right:2.4em}.online-empty-template__body{height:1.7em;width:70%}.online-empty-template+.online-empty-template{margin-top:1em}
            </style>
        `)

  document.body.append(Lampa.Template.get('cineSearch_css', {}, true))

  const resetTemplates = () => {
    Lampa.Template.add('online_prestige_full', `<div class="online-prestige online-prestige--full selector">
                <div class="online-prestige__img">
                    <img alt="">
                    <div class="online-prestige__loader"></div>
                </div>
                <div class="online-prestige__body">
                    <div class="online-prestige__head">
                        <div class="online-prestige__title">{title}</div>
                        <div class="online-prestige__time">{time}</div>
                    </div>
                    <div class="online-prestige__timeline"></div>
                    <div class="online-prestige__footer">
                        <div class="online-prestige__info">{info}</div>
                        <div class="online-prestige__quality">{quality}</div>
                    </div>
                </div>
            </div>`)

    Lampa.Template.add('online_does_not_answer', `<div class="online-empty">
                <div class="online-empty__title">
                    #{online_balanser_dont_work}
                </div>
                <div class="online-empty__time">
                    #{online_balanser_timeout}
                </div>
                <div class="online-empty__buttons">
                    <div class="online-empty__button selector cancel">#{cancel}</div>
                    <div class="online-empty__button selector change">#{online_change_balanser}</div>
                </div>
                <div class="online-empty__templates">
                    <div class="online-empty-template">
                        <div class="online-empty-template__ico"></div>
                        <div class="online-empty-template__body"></div>
                    </div>
                    <div class="online-empty-template">
                        <div class="online-empty-template__ico"></div>
                        <div class="online-empty-template__body"></div>
                    </div>
                    <div class="online-empty-template">
                        <div class="online-empty-template__ico"></div>
                        <div class="online-empty-template__body"></div>
                    </div>
                </div>
            </div>`)

    Lampa.Template.add('online_prestige_rate', `<div class="online-prestige-rate">
                <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.39409 0.192139L10.99 5.30994L16.7882 6.20387L12.5475 10.4277L13.5819 15.9311L8.39409 13.2425L3.20626 15.9311L4.24065 10.4277L0 6.20387L5.79819 5.30994L8.39409 0.192139Z" fill="#fff"></path>
                </svg>
                <span>{rate}</span>
            </div>`)

    Lampa.Template.add('online_prestige_folder', `<div class="online-prestige online-prestige--folder selector">
                <div class="online-prestige__folder">
                    <svg viewBox="0 0 128 112" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect y="20" width="128" height="92" rx="13" fill="white"></rect>
                        <path d="M29.9963 8H98.0037C96.0446 3.3021 91.4079 0 86 0H42C36.5921 0 31.9555 3.3021 29.9963 8Z" fill="white" fill-opacity="0.23"></path>
                        <rect x="11" y="8" width="106" height="76" rx="13" fill="white" fill-opacity="0.51"></rect>
                    </svg>
                </div>
                <div class="online-prestige__body">
                    <div class="online-prestige__head">
                        <div class="online-prestige__title">{title}</div>
                        <div class="online-prestige__time">{time}</div>
                    </div>
                    <div class="online-prestige__footer">
                        <div class="online-prestige__info">{info}</div>
                    </div>
                </div>
            </div>`)

    Lampa.Template.add('online_prestige_watched', `<div class="online-prestige online-prestige-watched selector">
                <div class="online-prestige-watched__icon">
                    <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="10.5" cy="10.5" r="9" stroke="currentColor" stroke-width="3"/>
                        <path d="M14.8477 10.5628L8.20312 14.399L8.20313 6.72656L14.8477 10.5628Z" fill="currentColor"/>
                    </svg>
                </div>
                <div class="online-prestige-watched__body">
                    
                </div>
            </div>`)


  }
  const button = `<div class="full-start__button selector view--online" id="filmPluginButton" data-subtitle="Cine Search v${manifest.version}">
            <svg width="135" height="147" viewBox="0 0 135 147" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M121.5 96.8823C139.5 86.49 139.5 60.5092 121.5 50.1169L41.25 3.78454C23.25 -6.60776 0.750004 6.38265 0.750001 27.1673L0.75 51.9742C4.70314 35.7475 23.6209 26.8138 39.0547 35.7701L94.8534 68.1505C110.252 77.0864 111.909 97.8693 99.8725 109.369L121.5 96.8823Z" fill="currentColor"/>
                <path d="M63 84.9836C80.3333 94.991 80.3333 120.01 63 130.017L39.75 143.44C22.4167 153.448 0.749999 140.938 0.75 120.924L0.750001 94.0769C0.750002 74.0621 22.4167 61.5528 39.75 71.5602L63 84.9836Z" fill="currentColor"/>
            </svg>
            <span>Cine Search beta</span>
        </div>`

  Lampa.Component.add('cineSearch', component)
  resetTemplates()

  Lampa.Listener.follow('full', (e) => {
    if (e.type == 'complite') {
      let btn = $(Lampa.Lang.translate(button))

      btn.on('hover:enter', () => {
        resetTemplates()
        Lampa.Component.add('cineSearch', component)
        Lampa.Activity.push({
          url: '',
          title: 'Cine Search beta',
          component: 'cineSearch',
          search: e.data.movie.title,
          search_one: e.data.movie.title,
          search_two: e.data.movie.original_title,
          movie: e.data.movie,
          page: 1
        })
      })
      e.object.activity.render().find('.view--torrent').after(btn)
    }
  })
  console.log('CineSearch v' + manifest.version + ' loaded')
}

if (!window.CineSearch && Lampa.Manifest.app_digital >= 155) startPlugin();
})();