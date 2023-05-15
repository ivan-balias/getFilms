//import('./component.js')
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