(()=>{"use strict";function e(){const e="/api/file_link/",i=new Lampa.Reguest;this.load=((e,t)=>{const n=`https://webshare.cz${e}`;i.silent(n,e=>{console.log(e)},_,{},{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"}})}),this.loadValue=((e,i,t)=>{return this.load(e,i).getElementsByTagName(t)[0].textContent}),this.fileLink=(i=>{console.log(i);const t=`ident=${encodeURIComponent(i)}&wst=${encodeURIComponent("N66aObXYOWcPFLZL")}&download_type=video_stream`;return this.loadValue(e,t,"link")})}function i(i,t){const n="/api/media/filter/v2/search?order=desc&sort=score&type=*",a="/api/media/",o="th2tdy0no8v1zoh1fs59",l=Lampa.Storage.get("language");let s={season:0,voice:0,voice_name:""},r=new Lampa.Reguest,p=[],m=i,d=i.proxy("scc")+"https://plugin.sc2.zone";function c(t){p=t,function(i){r.timeout(2e4);const t=i.filter(e=>e.audio.at(0).language===l);let n=new e;const a=t.map(async e=>await n.fileLink(e.ident));console.log(a)}(t),console.log(t),i.loading(!1)}this.searchByImdbID=function(e,i){m=e;let t=`${d}${n}`;t=Lampa.Utils.addUrlComponent(t,`value=${encodeURIComponent(m.movie.imdb_id)}`),t=Lampa.Utils.addUrlComponent(t,`&access_token=${encodeURIComponent(o)}`),r.silent(t,({hits:e})=>{const{_id:i}=e.hits.at(0);i&&(r.clear(),t="",t=`${d}${a}${i}/streams`,t=Lampa.Utils.addUrlComponent(t,`&access_token=${encodeURIComponent(o)}`),r.silent(t,e=>{c(e)}))})},this.extendChoice=function(e){Lampa.Arrays.extend(s,e,!0)}}function t(e){let t,n,a,o,l,s,r=new Lampa.Reguest,p=new Lampa.Scroll({mask:!0,over:!0}),m=new Lampa.Explorer(e),d=new Lampa.Filter(e),c={scc:i},g=[],_=Lampa.Arrays.getKeys(c),h={season:Lampa.Lang.translate("torrent_serial_season"),voice:Lampa.Lang.translate("torrent_parser_voice"),source:Lampa.Lang.translate("settings_rest_source")};this.initialize=function(){a=this.createSource(),d.onSearch=(e=>{Lampa.Activity.replace({search:e,clarification:!0})}),d.onBack=(()=>{this.start()}),d.render().find(".selector").on("hover:enter",()=>{clearInterval(s)}),d.onSelect=((e,i,t)=>{"filter"==e?i.reset?n?a.reset():this.start():a.filter(e,i,t):"sort"==e&&(Lampa.Select.close(),this.changeBalanser(i.source))}),d.addButtonBack&&d.addButtonBack(),d.render().find(".filter--sort span").text(Lampa.Lang.translate("cineSearch_balanser")),m.appendFiles(p.render()),m.appendHead(d.render()),p.body().addClass("torrent-list"),p.minus(m.render().find(".explorer__files-head")),this.search()},this.changeBalanser=function(i){let t=Lampa.Storage.cache("cineSearch_last_balanser",3e3,{});t[e.movie.id]=i,Lampa.Storage.set("cineSearch_last_balanser",t),Lampa.Storage.set("cineSearch_balanser",i);let n=this.getChoice(i),a=this.getChoice();a.voice_name&&(n.voice_name=a.voice_name),this.saveChoice(n,i),Lampa.Activity.replace()},this.createSource=function(){let i=Lampa.Storage.cache("cineSearch_last_balanser",3e3,{});return i[e.movie.id]&&(o=i[e.movie.id],Lampa.Storage.set("cineSearch_last_balanser",i)),c[o]||(o="scc"),new c[o](this,e)},this.proxy=function(e){let i=Lampa.Storage.get("online_proxy_all"),t=Lampa.Storage.get("online_proxy_"+e);return t&&(i=t),i&&"/"!==i.slice(-1)&&(i+="/"),i},this.create=function(){return this.render()},this.search=function(){this.activity.loader(!0),this.filter({source:_},this.getChoice()),this.find()},this.find=function(){const i=i=>{i&&a.searchByImdbID&&(this.extendChoice(),a.searchByImdbID(e,i))};e.movie.imdb_id&&i(e.movie.imdb_id)},this.getChoice=function(i){let t=Lampa.Storage.cache("cineSearch_choice_"+(i||o),3e3,{})[e.movie.id]||{};return Lampa.Arrays.extend(t,{season:0,voice:0,voice_name:"",voice_id:0,episodes_view:{},movie_view:""}),t},this.extendChoice=function(){n=!0,a.extendChoice(this.getChoice())},this.saveChoice=function(i,t){let n=Lampa.Storage.cache("online_choice_"+(t||o),3e3,{});n[e.movie.id]=i,Lampa.Storage.set("online_choice_"+(t||o),n)},this.clearImages=function(){g.forEach(e=>{e.onerror=(()=>{}),e.onload=(()=>{}),e.src=""}),g=[]},this.reset=function(){t=!1,clearInterval(s),r.clear(),this.clearImages(),p.render().find(".empty").remove(),p.clear()},this.loading=function(e){e?this.activity.loader(!0):(this.activity.loader(!1),this.activity.toggle())},this.filter=function(e,i){let t=[],n=(i,n)=>{let a=this.getChoice(),o=e[i],l=[],s=a[i];o.forEach((e,i)=>{l.push({title:e,selected:s==i,index:i})}),t.push({title:n,subtitle:o[s],items:l,stype:i})};e.source=_,t.push({title:Lampa.Lang.translate("torrent_parser_reset"),reset:!0}),this.saveChoice(i),e.voice&&e.voice.length&&n("voice",Lampa.Lang.translate("torrent_parser_voice")),e.season&&e.season.length&&n("season",Lampa.Lang.translate("torrent_serial_season")),d.set("filter",t),d.set("sort",_.map(e=>({title:e,source:e,selected:e==o}))),this.selected(e)},this.closeFilter=function(){$("body").hasClass("selectbox--open")&&Lampa.Select.close()},this.selected=function(e){let i=this.getChoice(),t=[];for(let n in i)e[n]&&e[n].length&&("voice"==n?t.push(h[n]+": "+e[n][i[n]]):"source"!==n&&e.season.length>=1&&t.push(h.season+": "+e[n][i[n]]));d.chosen("filter",t),d.chosen("sort",[o])},this.getEpisodes=function(i,t){let n=[];if("number"==typeof e.movie.id&&e.movie.name){let a="tv/"+e.movie.id+"/season/"+i+"?api_key="+Lampa.TMDB.key()+"&language="+Lampa.Storage.get("language","ru"),o=Lampa.TMDB.api(a);r.timeout(1e4),r.native(o,function(e){n=e.episodes||[],t(n)},(e,i)=>{t(n)})}else t(n)},this.append=function(e){e.on("hover:focus",e=>{t=e.target,p.update($(e.target),!0)}),p.append(e)},this.watched=function(i){let t=Lampa.Utils.hash(e.movie.number_of_seasons?e.movie.original_name:e.movie.original_title),n=Lampa.Storage.cache("online_watched_last",5e3,{});if(!i)return n[t];n[t]||(n[t]={}),Lampa.Arrays.extend(n[t],i,!0),Lampa.Storage.set("online_watched_last",n),this.updateWatched()},this.updateWatched=function(){let e=this.watched(),i=p.body().find(".online-prestige-watched .online-prestige-watched__body").empty();if(e){let t=[];e.balanser_name&&t.push(e.balanser_name),e.voice_name&&t.push(e.voice_name),e.season&&t.push(Lampa.Lang.translate("torrent_serial_season")+" "+e.season),e.episode&&t.push(Lampa.Lang.translate("torrent_serial_episode")+" "+e.episode),t.forEach(e=>{i.append("<span>"+e+"</span>")})}else i.append("<span>"+Lampa.Lang.translate("online_no_watch_history")+"</span>")},this.draw=function(i,n={}){if(!i.length)return this.empty();p.append(Lampa.Template.get("online_prestige_watched",{})),this.updateWatched(),this.getEpisodes(i[0].season,a=>{let l=Lampa.Storage.cache("online_view",5e3,[]),s=!!e.movie.name,r=this.getChoice(),m=window.innerWidth>480,d=!1,c=!1;if(i.forEach((_,h)=>{let v=!(!s||!a.length||n.similars)&&a.find(e=>e.episode_number==_.episode),f=_.episode||h+1,u=r.episodes_view[_.season];Lampa.Arrays.extend(_,{info:"",quality:"",time:Lampa.Utils.secondsToTime(60*(v?v.runtime:e.movie.runtime),!0)});let b=Lampa.Utils.hash(_.season?[_.season,_.episode,e.movie.original_title].join(""):e.movie.original_title),L=Lampa.Utils.hash(_.season?[_.season,_.episode,e.movie.original_title,_.voice_name].join(""):e.movie.original_title+_.voice_name),y={hash_timeline:b,hash_behold:L},w=[];_.season&&(_.translate_episode_end=this.getLastEpisode(i),_.translate_voice=_.voice_name),_.timeline=Lampa.Timeline.view(b),v?(_.title=v.name,_.info.length<30&&v.vote_average&&w.push(Lampa.Template.get("online_prestige_rate",{rate:parseFloat(v.vote_average+"").toFixed(1)},!0)),v.air_date&&m&&w.push(Lampa.Utils.parseTime(v.air_date).full)):e.movie.release_date&&m&&w.push(Lampa.Utils.parseTime(e.movie.release_date).full),!s&&e.movie.tagline&&_.info.length<30&&w.push(e.movie.tagline),_.info&&w.push(_.info),w.length&&(_.info=w.map(e=>"<span>"+e+"</span>").join('<span class="online-prestige-split">●</span>'));let x=Lampa.Template.get("online_prestige_full",_),k=x.find(".online-prestige__loader"),C=x.find(".online-prestige__img");if(s?void 0!==u&&u==f&&(d=x):r.movie_view==L&&(d=x),s&&!v)C.append('<div class="online-prestige__episode-number">'+("0"+(_.episode||h+1)).slice(-2)+"</div>"),k.remove();else{let i=x.find("img")[0];i.onerror=function(){i.src="./img/img_broken.svg"},i.onload=function(){C.addClass("online-prestige__img--loaded"),k.remove(),s&&C.append('<div class="online-prestige__episode-number">'+("0"+(_.episode||h+1)).slice(-2)+"</div>")},i.src=Lampa.TMDB.image("t/p/w300"+(v?v.still_path:e.movie.backdrop_path)),g.push(i)}x.find(".online-prestige__timeline").append(Lampa.Timeline.render(_.timeline)),-1!==l.indexOf(L)&&(c=x,x.find(".online-prestige__img").append('<div class="online-prestige__viewed">'+Lampa.Template.get("icon_viewed",{},!0)+"</div>")),_.mark=(()=>{-1==(l=Lampa.Storage.cache("online_view",5e3,[])).indexOf(L)&&(l.push(L),Lampa.Storage.set("online_view",l),0==x.find(".online-prestige__viewed").length&&x.find(".online-prestige__img").append('<div class="online-prestige__viewed">'+Lampa.Template.get("icon_viewed",{},!0)+"</div>")),r=this.getChoice(),s?r.episodes_view[_.season]=f:r.movie_view=L,this.saveChoice(r),this.watched({balanser:o,balanser_name:Lampa.Utils.capitalizeFirstLetter(o),voice_id:r.voice_id,voice_name:r.voice_name||_.voice_name,episode:_.episode,season:_.season})}),_.unmark=(()=>{-1!==(l=Lampa.Storage.cache("online_view",5e3,[])).indexOf(L)&&(Lampa.Arrays.remove(l,L),Lampa.Storage.set("online_view",l),Lampa.Manifest.app_digital>=177&&Lampa.Storage.remove("online_view",L),x.find(".online-prestige__viewed").remove())}),_.timeclear=(()=>{_.timeline.percent=0,_.timeline.time=0,_.timeline.duration=0,Lampa.Timeline.update(_.timeline)}),x.on("hover:enter",()=>{e.movie.id&&Lampa.Favorite.add("history",e.movie,100),n.onEnter&&n.onEnter(_,x,y)}).on("hover:focus",e=>{t=e.target,n.onFocus&&n.onFocus(_,x,y),p.update($(e.target),!0)}),n.onRender&&n.onRender(_,x,y),this.contextMenu({html:x,element:_,onFile:e=>{n.onContextMenu&&n.onContextMenu(_,x,y,e)},onClearAllMark:()=>{i.forEach(e=>{e.unmark()})},onClearAllTime:()=>{i.forEach(e=>{e.timeclear()})}}),p.append(x)}),s&&a.length>i.length&&!n.similars){a.slice(i.length).forEach(n=>{let a=[];n.vote_average&&a.push(Lampa.Template.get("online_prestige_rate",{rate:parseFloat(n.vote_average+"").toFixed(1)},!0)),n.air_date&&a.push(Lampa.Utils.parseTime(n.air_date).full);let o=new Date((n.air_date+"").replace(/-/g,"/")),l=Date.now(),s=Math.round((o.getTime()-l)/864e5),r=Lampa.Lang.translate("full_episode_days_left")+": "+s,m=Lampa.Template.get("online_prestige_full",{time:Lampa.Utils.secondsToTime(60*(n?n.runtime:e.movie.runtime),!0),info:a.length?a.map(e=>"<span>"+e+"</span>").join('<span class="online-prestige-split">●</span>'):"",title:n.name,quality:s>0?r:""}),d=m.find(".online-prestige__loader"),c=m.find(".online-prestige__img"),_=i[0]?i[0].season:1;m.find(".online-prestige__timeline").append(Lampa.Timeline.render(Lampa.Timeline.view(Lampa.Utils.hash([_,n.episode_number,e.movie.original_title].join("")))));let h=m.find("img")[0];n.still_path?(h.onerror=function(){h.src="./img/img_broken.svg"},h.onload=function(){c.addClass("online-prestige__img--loaded"),d.remove(),c.append('<div class="online-prestige__episode-number">'+("0"+n.episode_number).slice(-2)+"</div>")},h.src=Lampa.TMDB.image("t/p/w300"+n.still_path),g.push(h)):(d.remove(),c.append('<div class="online-prestige__episode-number">'+("0"+n.episode_number).slice(-2)+"</div>")),m.on("hover:focus",e=>{t=e.target,p.update($(e.target),!0)}),p.append(m)})}d?t=d[0]:c&&(t=c[0]),Lampa.Controller.enable("content")})},this.contextMenu=function(i){i.html.on("hover:long",()=>{i.onFile(function(t){let n=Lampa.Controller.enabled().name,a=[];Lampa.Platform.is("webos")&&a.push({title:Lampa.Lang.translate("player_lauch")+" - Webos",player:"webos"}),Lampa.Platform.is("android")&&a.push({title:Lampa.Lang.translate("player_lauch")+" - Android",player:"android"}),a.push({title:Lampa.Lang.translate("player_lauch")+" - Lampa",player:"lampa"}),a.push({title:Lampa.Lang.translate("online_video"),separator:!0}),a.push({title:Lampa.Lang.translate("torrent_parser_label_title"),mark:!0}),a.push({title:Lampa.Lang.translate("torrent_parser_label_cancel_title"),unmark:!0}),a.push({title:Lampa.Lang.translate("time_reset"),timeclear:!0}),t&&a.push({title:Lampa.Lang.translate("copy_link"),copylink:!0}),a.push({title:Lampa.Lang.translate("more"),separator:!0}),Lampa.Account.logged()&&i.element&&void 0!==i.element.season&&i.element.translate_voice&&a.push({title:Lampa.Lang.translate("online_voice_subscribe"),subscribe:!0}),a.push({title:Lampa.Lang.translate("online_clear_all_marks"),clearallmark:!0}),a.push({title:Lampa.Lang.translate("online_clear_all_timecodes"),timeclearall:!0}),Lampa.Select.show({title:Lampa.Lang.translate("title_action"),items:a,onBack:()=>{Lampa.Controller.toggle(n)},onSelect:a=>{if(a.mark&&i.element.mark(),a.unmark&&i.element.unmark(),a.timeclear&&i.element.timeclear(),a.clearallmark&&i.onClearAllMark(),a.timeclearall&&i.onClearAllTime(),Lampa.Controller.toggle(n),a.player&&(Lampa.Player.runas(a.player),i.html.trigger("hover:enter")),a.copylink)if(t.quality){let e=[];for(let i in t.quality)e.push({title:i,file:t.quality[i]});Lampa.Select.show({title:Lampa.Lang.translate("settings_server_links"),items:e,onBack:()=>{Lampa.Controller.toggle(n)},onSelect:e=>{Lampa.Utils.copyTextToClipboard(e.file,()=>{Lampa.Noty.show(Lampa.Lang.translate("copy_secuses"))},()=>{Lampa.Noty.show(Lampa.Lang.translate("copy_error"))})}})}else Lampa.Utils.copyTextToClipboard(t.file,()=>{Lampa.Noty.show(Lampa.Lang.translate("copy_secuses"))},()=>{Lampa.Noty.show(Lampa.Lang.translate("copy_error"))});a.subscribe&&Lampa.Account.subscribeToTranslation({card:e.movie,season:i.element.season,episode:i.element.translate_episode_end,voice:i.element.translate_voice},()=>{Lampa.Noty.show(Lampa.Lang.translate("online_voice_success"))},()=>{Lampa.Noty.show(Lampa.Lang.translate("online_voice_error"))})}})})}).on("hover:focus",()=>{Lampa.Helper&&Lampa.Helper.show("online_file",Lampa.Lang.translate("helper_online_file"),i.html)})},this.empty=function(e){let i=Lampa.Template.get("online_does_not_answer",{});i.find(".online-empty__buttons").remove(),i.find(".online-empty__title").text(Lampa.Lang.translate("empty_title_two")),i.find(".online-empty__time").text(Lampa.Lang.translate("empty_text")),p.append(i),this.loading(!1)},this.doesNotAnswer=function(){this.reset();let e=Lampa.Template.get("online_does_not_answer",{balanser:o}),i=10;e.find(".cancel").on("hover:enter",()=>{clearInterval(s)}),e.find(".change").on("hover:enter",()=>{clearInterval(s),d.render().find(".filter--sort").trigger("hover:enter")}),p.append(e),this.loading(!1),s=setInterval(()=>{if(i--,e.find(".timeout").text(i),0==i){clearInterval(s);let e=Lampa.Arrays.getKeys(c),i=e.indexOf(o),t=e[i+1];t||(t=e[0]),o=t,Lampa.Activity.active().activity==this.activity&&this.changeBalanser(o)}},1e3)},this.getLastEpisode=function(e){let i=0;return e.forEach(e=>{void 0!==e.episode&&(i=Math.max(i,parseInt(e.episode)))}),i},this.start=function(){Lampa.Activity.active().activity===this.activity&&(l||(l=!0,this.initialize()),Lampa.Background.immediately(Lampa.Utils.cardImgBackgroundBlur(e.movie)),Lampa.Controller.add("content",{toggle:()=>{Lampa.Controller.collectionSet(p.render(),m.render()),Lampa.Controller.collectionFocus(t||!1,p.render())},up:()=>{Navigator.canmove("up")?Navigator.move("up"):Lampa.Controller.toggle("head")},down:()=>{Navigator.move("down")},right:()=>{Navigator.canmove("right")?Navigator.move("right"):d.show(Lampa.Lang.translate("title_filter"),"filter")},left:()=>{Navigator.canmove("left")?Navigator.move("left"):Lampa.Controller.toggle("menu")},gone:()=>{clearInterval(s)},back:this.back}),Lampa.Controller.toggle("content"))},this.render=function(){return m.render()},this.back=function(){Lampa.Activity.backward()},this.pause=function(){},this.stop=function(){},this.destroy=function(){r.clear(),this.clearImages(),m.destroy(),p.destroy(),clearInterval(s),a&&a.destroy()}}!window.CineSearch&&Lampa.Manifest.app_digital>=155&&(()=>{window.CineSearch=!0;let e={type:"video",version:"1.0.0",name:"Cine Search beta",description:"Cine Search beta",component:"cineSearch",onContextMenu:e=>({name:"Film Plugin beta",description:"Film Plugin beta"}),onContextLaunch:e=>{i(),Lampa.Component.add("cineSearch",t),Lampa.Activity.push({url:"",title:"Cine Search beta",component:"cineSearch",search:e.title,search_one:e.title,search_two:e.original_title,movie:e,page:1})}};Lampa.Manifest.plugins=e,Lampa.Template.add("cineSearch_css","\n            <style>\n            .online-prestige{position:relative;-webkit-border-radius:.3em;-moz-border-radius:.3em;border-radius:.3em;background-color:rgba(0,0,0,0.3);display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;will-change:transform}.online-prestige__body{padding:1.2em;line-height:1.3;-webkit-box-flex:1;-webkit-flex-grow:1;-moz-box-flex:1;-ms-flex-positive:1;flex-grow:1;position:relative}@media screen and (max-width:480px){.online-prestige__body{padding:.8em 1.2em}}.online-prestige__img{position:relative;width:13em;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0;min-height:8.2em}.online-prestige__img>img{position:absolute;top:0;left:0;width:100%;height:100%;-o-object-fit:cover;object-fit:cover;-webkit-border-radius:.3em;-moz-border-radius:.3em;border-radius:.3em;opacity:0;-webkit-transition:opacity .3s;-o-transition:opacity .3s;-moz-transition:opacity .3s;transition:opacity .3s}.online-prestige__img--loaded>img{opacity:1}@media screen and (max-width:480px){.online-prestige__img{width:7em;min-height:6em}}.online-prestige__folder{padding:1em;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0}.online-prestige__folder>svg{width:4.4em !important;height:4.4em !important}.online-prestige__viewed{position:absolute;top:1em;left:1em;background:rgba(0,0,0,0.45);-webkit-border-radius:100%;-moz-border-radius:100%;border-radius:100%;padding:.25em;font-size:.76em}.online-prestige__viewed>svg{width:1.5em !important;height:1.5em !important}.online-prestige__episode-number{position:absolute;top:0;left:0;right:0;bottom:0;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;font-size:2em}.online-prestige__loader{position:absolute;top:50%;left:50%;width:2em;height:2em;margin-left:-1em;margin-top:-1em;background:url(./img/loader.svg) no-repeat center center;-webkit-background-size:contain;-moz-background-size:contain;-o-background-size:contain;background-size:contain}.online-prestige__head,.online-prestige__footer{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;-moz-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center}.online-prestige__timeline{margin:.8em 0}.online-prestige__timeline>.time-line{display:block !important}.online-prestige__title{font-size:1.7em;overflow:hidden;-o-text-overflow:ellipsis;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:1;line-clamp:1;-webkit-box-orient:vertical}@media screen and (max-width:480px){.online-prestige__title{font-size:1.4em}}.online-prestige__time{padding-left:2em}.online-prestige__info{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center}.online-prestige__info>*{overflow:hidden;-o-text-overflow:ellipsis;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:1;line-clamp:1;-webkit-box-orient:vertical}.online-prestige__quality{padding-left:1em;white-space:nowrap}.online-prestige__scan-file{position:absolute;bottom:0;left:0;right:0}.online-prestige__scan-file .broadcast__scan{margin:0}.online-prestige .online-prestige-split{font-size:.8em;margin:0 1em;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0}.online-prestige.focus::after{content:'';position:absolute;top:-0.6em;left:-0.6em;right:-0.6em;bottom:-0.6em;-webkit-border-radius:.7em;-moz-border-radius:.7em;border-radius:.7em;border:solid .3em #fff;z-index:-1;pointer-events:none}.online-prestige+.online-prestige{margin-top:1.5em}.online-prestige--folder .online-prestige__footer{margin-top:.8em}.online-prestige-watched{padding:1em}.online-prestige-watched__icon>svg{width:1.5em;height:1.5em}.online-prestige-watched__body{padding-left:1em;padding-top:.1em;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap}.online-prestige-watched__body>span+span::before{content:' ● ';vertical-align:top;display:inline-block;margin:0 .5em}.online-prestige-rate{display:-webkit-inline-box;display:-webkit-inline-flex;display:-moz-inline-box;display:-ms-inline-flexbox;display:inline-flex;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center}.online-prestige-rate>svg{width:1.3em !important;height:1.3em !important}.online-prestige-rate>span{font-weight:600;font-size:1.1em;padding-left:.7em}.online-empty{line-height:1.4}.online-empty__title{font-size:1.8em;margin-bottom:.3em}.online-empty__time{font-size:1.2em;font-weight:300;margin-bottom:1.6em}.online-empty__buttons{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex}.online-empty__buttons>*+*{margin-left:1em}.online-empty__button{background:rgba(0,0,0,0.3);font-size:1.2em;padding:.5em 1.2em;-webkit-border-radius:.2em;-moz-border-radius:.2em;border-radius:.2em;margin-bottom:2.4em}.online-empty__button.focus{background:#fff;color:black}.online-empty__templates .online-empty-template:nth-child(2){opacity:.5}.online-empty__templates .online-empty-template:nth-child(3){opacity:.2}.online-empty-template{background-color:rgba(255,255,255,0.3);padding:1em;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;-webkit-border-radius:.3em;-moz-border-radius:.3em;border-radius:.3em}.online-empty-template>*{background:rgba(0,0,0,0.3);-webkit-border-radius:.3em;-moz-border-radius:.3em;border-radius:.3em}.online-empty-template__ico{width:4em;height:4em;margin-right:2.4em}.online-empty-template__body{height:1.7em;width:70%}.online-empty-template+.online-empty-template{margin-top:1em}\n            </style>\n        "),document.body.append(Lampa.Template.get("cineSearch_css",{},!0));const i=()=>{Lampa.Template.add("online_prestige_full",'<div class="online-prestige online-prestige--full selector">\n                <div class="online-prestige__img">\n                    <img alt="">\n                    <div class="online-prestige__loader"></div>\n                </div>\n                <div class="online-prestige__body">\n                    <div class="online-prestige__head">\n                        <div class="online-prestige__title">{title}</div>\n                        <div class="online-prestige__time">{time}</div>\n                    </div>\n                    <div class="online-prestige__timeline"></div>\n                    <div class="online-prestige__footer">\n                        <div class="online-prestige__info">{info}</div>\n                        <div class="online-prestige__quality">{quality}</div>\n                    </div>\n                </div>\n            </div>'),Lampa.Template.add("online_does_not_answer",'<div class="online-empty">\n                <div class="online-empty__title">\n                    #{online_balanser_dont_work}\n                </div>\n                <div class="online-empty__time">\n                    #{online_balanser_timeout}\n                </div>\n                <div class="online-empty__buttons">\n                    <div class="online-empty__button selector cancel">#{cancel}</div>\n                    <div class="online-empty__button selector change">#{online_change_balanser}</div>\n                </div>\n                <div class="online-empty__templates">\n                    <div class="online-empty-template">\n                        <div class="online-empty-template__ico"></div>\n                        <div class="online-empty-template__body"></div>\n                    </div>\n                    <div class="online-empty-template">\n                        <div class="online-empty-template__ico"></div>\n                        <div class="online-empty-template__body"></div>\n                    </div>\n                    <div class="online-empty-template">\n                        <div class="online-empty-template__ico"></div>\n                        <div class="online-empty-template__body"></div>\n                    </div>\n                </div>\n            </div>'),Lampa.Template.add("online_prestige_rate",'<div class="online-prestige-rate">\n                <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">\n                    <path d="M8.39409 0.192139L10.99 5.30994L16.7882 6.20387L12.5475 10.4277L13.5819 15.9311L8.39409 13.2425L3.20626 15.9311L4.24065 10.4277L0 6.20387L5.79819 5.30994L8.39409 0.192139Z" fill="#fff"></path>\n                </svg>\n                <span>{rate}</span>\n            </div>'),Lampa.Template.add("online_prestige_folder",'<div class="online-prestige online-prestige--folder selector">\n                <div class="online-prestige__folder">\n                    <svg viewBox="0 0 128 112" fill="none" xmlns="http://www.w3.org/2000/svg">\n                        <rect y="20" width="128" height="92" rx="13" fill="white"></rect>\n                        <path d="M29.9963 8H98.0037C96.0446 3.3021 91.4079 0 86 0H42C36.5921 0 31.9555 3.3021 29.9963 8Z" fill="white" fill-opacity="0.23"></path>\n                        <rect x="11" y="8" width="106" height="76" rx="13" fill="white" fill-opacity="0.51"></rect>\n                    </svg>\n                </div>\n                <div class="online-prestige__body">\n                    <div class="online-prestige__head">\n                        <div class="online-prestige__title">{title}</div>\n                        <div class="online-prestige__time">{time}</div>\n                    </div>\n                    <div class="online-prestige__footer">\n                        <div class="online-prestige__info">{info}</div>\n                    </div>\n                </div>\n            </div>'),Lampa.Template.add("online_prestige_watched",'<div class="online-prestige online-prestige-watched selector">\n                <div class="online-prestige-watched__icon">\n                    <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">\n                        <circle cx="10.5" cy="10.5" r="9" stroke="currentColor" stroke-width="3"/>\n                        <path d="M14.8477 10.5628L8.20312 14.399L8.20313 6.72656L14.8477 10.5628Z" fill="currentColor"/>\n                    </svg>\n                </div>\n                <div class="online-prestige-watched__body">\n                    \n                </div>\n            </div>')},n=`<div class="full-start__button selector view--online" id="filmPluginButton" data-subtitle="Cine Search v${e.version}">\n            <svg width="135" height="147" viewBox="0 0 135 147" fill="none" xmlns="http://www.w3.org/2000/svg">\n                <path d="M121.5 96.8823C139.5 86.49 139.5 60.5092 121.5 50.1169L41.25 3.78454C23.25 -6.60776 0.750004 6.38265 0.750001 27.1673L0.75 51.9742C4.70314 35.7475 23.6209 26.8138 39.0547 35.7701L94.8534 68.1505C110.252 77.0864 111.909 97.8693 99.8725 109.369L121.5 96.8823Z" fill="currentColor"/>\n                <path d="M63 84.9836C80.3333 94.991 80.3333 120.01 63 130.017L39.75 143.44C22.4167 153.448 0.749999 140.938 0.75 120.924L0.750001 94.0769C0.750002 74.0621 22.4167 61.5528 39.75 71.5602L63 84.9836Z" fill="currentColor"/>\n            </svg>\n            <span>Cine Search beta</span>\n        </div>`;Lampa.Component.add("cineSearch",t),i(),Lampa.Listener.follow("full",e=>{if("complite"==e.type){let a=$(Lampa.Lang.translate(n));a.on("hover:enter",()=>{i(),Lampa.Component.add("cineSearch",t),Lampa.Activity.push({url:"",title:"Cine Search beta",component:"cineSearch",search:e.data.movie.title,search_one:e.data.movie.title,search_two:e.data.movie.original_title,movie:e.data.movie,page:1})}),e.object.activity.render().find(".view--torrent").after(a)}}),console.log("CineSearch v"+e.version+" loaded")})()})();