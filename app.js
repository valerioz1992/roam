const MONTHS=['GEN','FEB','MAR','APR','MAG','GIU','LUG','AGO','SET','OTT','NOV','DIC'];let countries=[],favorites=new Set(),compare=new Set(),onlyFav=false;try{const saved=JSON.parse(localStorage.getItem('roam_favs')||'[]');if(Array.isArray(saved))favorites=new Set(saved.filter(x=>typeof x==='string'))}catch(e){try{localStorage.removeItem('roam_favs')}catch(_){}favorites=new Set()}
const $=id=>document.getElementById(id), esc=s=>String(s??'—').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const get=(c,k)=>c[k]??'';const monthKeys={GEN:'GEN',FEB:'FEB',MAR:'MAR',APR:'APR',MAG:'MAG',GIU:'GIU',LUG:'LUG',AGO:'AGO',SET:'SET',OTT:'OTT',NOV:'NOV',DIC:'DIC'};
function monthMatch(c,m){return !m||String(c[m]||'').toUpperCase()==='X'}
function isNoVisa(c){return /senza visto|visa.?free|esente/i.test(c['Visto per cittadini italiani']||'')}
function isOnline(c){return /online|evisa|e-visa|e.?visa/i.test(c['Modalità richiesta visto']||'')}
function filtered(){let q=$('q').value.toLowerCase().trim(),m=$('month').value,co=$('continent').value,v=$('visa').value;let a=countries.filter(c=>{let text=[c.Paese,c.Continente,c['Periodo migliore'],c['Visto per cittadini italiani'],c['Modalità richiesta visto']].join(' ').toLowerCase();return(!q||text.includes(q))&&monthMatch(c,m)&&(!co||c.Continente===co)&&(!v||(v==='senza'?isNoVisa(c):v==='richiesto'?/richiesto/i.test(c['Visto per cittadini italiani']||''):v==='elettronico'?isOnline(c):!String(c['Visto per cittadini italiani']||'').trim()))&&(!onlyFav||favorites.has(c.Paese))})
let s=$('sort').value;if(s==='az')a.sort((x,y)=>x.Paese.localeCompare(y.Paese,'it'));if(s==='za')a.sort((x,y)=>y.Paese.localeCompare(x.Paese,'it'));return a}
function render(){let arr=filtered();$('count').textContent=arr.length+' risultati';$('favCount').textContent=favorites.size;$('grid').innerHTML=arr.length?arr.map(c=>{let n=esc(c.Paese),fav=favorites.has(c.Paese),checked=compare.has(c.Paese);let visa=esc(c['Visto per cittadini italiani']||'Dato non inserito');return `<article class="country"><div class="country-photo"><img data-country-photo="${n}" alt="${esc(PHOTO_ARTICLES[c.Paese]||c.Paese)} – immagine rappresentativa di ${n}" loading="lazy"></div><div class="countrytop"><div><div class="continent">${esc(c.Continente)}</div><h3><span class="country-flag" aria-hidden="true">${countryFlag(c.Paese)}</span> ${n}</h3></div><button class="heart ${fav?'on':''}" aria-label="Preferito" data-fav="${n}">${fav?'♥':'♡'}</button></div><div class="meta"><span class="chip">${esc(c['Periodo migliore']||'Periodo non indicato')}</span></div><div class="countryfoot"><span>${visa}</span><label style="display:flex;align-items:center;gap:6px"><input class="comparecheck" type="checkbox" data-compare="${n}" ${checked?'checked':''}> Confronta</label></div><button class="pill" style="margin-top:12px" data-detail="${n}">Apri scheda →</button></article>`}).join(''):'<div class="empty">Nessuna destinazione corrisponde ai filtri.<br>Prova a modificare la ricerca.</div>';$('compareCount').textContent=compare.size+' selezionati';$('comparebar').classList.toggle('show',compare.size>0);observeCountryPhotos()}
function detail(c){const currencyCode=(c.Valute||[]).map(v=>v.codice).find(Boolean)||'';let fields=[['Continente',c.Continente],['Periodo migliore',c['Periodo migliore']],['Visto per cittadini italiani',c['Visto per cittadini italiani']],['Modalità richiesta visto',c['Modalità richiesta visto']],['Budget giornaliero','Stima editoriale da completare'],['Durata consigliata','Da definire in base all’itinerario'],['Esperienze','Da completare con contenuti verificati'],['Clima','Consulta il periodo migliore indicato e le fonti meteo locali'],['Completezza del dato visto',String(c['Visto per cittadini italiani']||'').trim()?'Presente nel database, da verificare su fonte ufficiale':'Dato non inserito'],['Capitale',c.Capitale],['Lingue', (c.Lingue||[]).join(', ')],['Valuta',(c.Valute||[]).map(v=>v.nome+' ('+v.codice+')').join(', ')],['Fuso orario',(c.Fuso_orario||[]).join(', ')],['Popolazione',c.Popolazione?Number(c.Popolazione).toLocaleString('it-IT'):'Dato non disponibile'],['Superficie',c.Superficie_km2?Number(c.Superficie_km2).toLocaleString('it-IT')+' km²':'Dato non disponibile']];$('detailContent').innerHTML='<div class="detail-photo"><img data-country-photo="'+esc(c.Paese)+'" alt="'+esc(PHOTO_ARTICLES[c.Paese]||c.Paese)+' – immagine rappresentativa di '+esc(c.Paese)+'"></div><div class="detailhead"><div><div class="eyebrow">Scheda destinazione</div><h2>'+esc(c.Paese)+'</h2></div><button class="close" onclick="$(\'detail\').close()">×</button></div><div class="detailgrid">'+fields.map(([k,v])=>'<div class="detailbox"><small>'+esc(k)+'</small><strong>'+esc(v||'Non disponibile')+'</strong></div>').join('')+'</div><section class="rating-panel"><div class="eyebrow">Valutazione ROAM</div><div class="rating-top"><strong>— <span>/ 5</span></strong><span class="rating-status">Valutazione in corso</span></div><p>Il punteggio sarà pubblicato quando i criteri saranno supportati da dati verificabili. Nessuna valutazione inventata.</p><div class="rating-criteria"><span>Attrattività turistica</span><span>Rapporto qualità/prezzo</span><span>Facilità di organizzazione</span><span>Sicurezza</span><span>Accessibilità</span></div><small>La sicurezza sarà valutata separatamente dagli avvisi ufficiali aggiornati.</small></section><section class="currency-panel" data-currency="'+esc(currencyCode)+'"><div class="eyebrow">Cambio valuta</div><h3>Euro ↔ valuta locale</h3><div class="currency-converter"><label for="currencyEuro">Importo in euro (€)</label><input id="currencyEuro" type="number" min="0" step="any" value="100" inputmode="decimal" oninput="convertCurrency('eur')"><label for="currencyLocal">Importo in valuta locale ('+esc(currencyCode)+')</label><input id="currencyLocal" type="number" min="0" step="any" value="" inputmode="decimal" oninput="convertCurrency('local')"></div><div id="currencyResult">'+(currencyCode?'Recupero del tasso di cambio…':'Valuta non disponibile nel database')+'</div><small id="currencySource">Tassi di riferimento · Frankfurter</small></section><section style="margin-top:18px;padding:16px;border:1px solid var(--line);border-radius:15px;background:#fbfcf9"><div class="eyebrow">Prima di partire</div><h3 style="margin:7px 0 10px;font-size:18px">Controlli pratici per '+esc(c.Paese)+'</h3><ul style="padding-left:19px;margin:0;color:var(--muted);font-size:13px;line-height:1.7"><li>Verifica quale documento è accettato e la sua validità residua.</li><li>Controlla requisiti di ingresso, eventuale visto e modalità di richiesta.</li><li>Consulta gli avvisi di sicurezza, la situazione sanitaria e le indicazioni sulla mobilità.</li><li>Annota i contatti dell’Ambasciata o del Consolato italiano.</li></ul><p style="margin:13px 0 0"><a href="https://www.viaggiaresicuri.it/" target="_blank" rel="noopener noreferrer" style="display:inline-block;background:var(--ink);color:white;text-decoration:none;border-radius:30px;padding:10px 14px;font-size:13px;font-weight:700">Apri Viaggiare Sicuri ↗</a> <a href="https://www.viaggiaresicuri.it/approfondimenti-insights/documentidiviaggio" target="_blank" rel="noopener noreferrer" style="display:inline-block;color:var(--teal);font-size:13px;margin:10px 0 0 8px">Documenti di viaggio ↗</a></p></section><p class="note">I dati su periodo e visto riportati sopra provengono dal database ROAM e non sono verificati in tempo reale. La sezione “Prima di partire” è una checklist: consulta le fonti ufficiali per le regole aggiornate e specifiche di '+esc(c.Paese)+'. Il portale Viaggiare Sicuri del Ministero degli Affari Esteri pubblica informazioni su requisiti di ingresso, sicurezza, salute, mobilità e contatti diplomatici.</p>';$('detail').showModal();observeCountryPhotos();if(currencyCode)loadCurrencyRate(currencyCode)}
const currencyCache=new Map();let activeCurrencyRate=null,activeCurrencyCode='';
async function loadCurrencyRate(code){
 const target=$('currencyResult'),source=$('currencySource');if(!target||!code)return;
 activeCurrencyCode=code;target.textContent='Recupero del tasso di cambio…';
 try{
  let data=currencyCache.get('EUR');
  if(!data){const response=await fetch('https://open.er-api.com/v6/latest/EUR');if(!response.ok)throw new Error('Tasso non disponibile');data=await response.json();if(data.result!=='success'||!data.rates)throw new Error('Tasso non disponibile');currencyCache.set('EUR',data)}
  if(activeCurrencyCode!==code)return;
  const rate=Number(data.rates?.[code]);if(!Number.isFinite(rate)||rate<=0)throw new Error('Tasso non disponibile');
  activeCurrencyRate=rate;const euro=$('currencyEuro'),local=$('currencyLocal');
  if(euro&&local){euro.value='100';local.value=(100*rate).toFixed(2)}
  target.innerHTML='<strong>1 EUR = '+rate.toLocaleString('it-IT',{maximumFractionDigits:5})+' '+esc(code)+'</strong><br><span>1 '+esc(code)+' = '+(1/rate).toLocaleString('it-IT',{maximumFractionDigits:6})+' EUR</span>';
  if(source)source.textContent='Fonte: ExchangeRate-API · tasso aggiornato il '+new Date(data.time_last_update_utc).toLocaleDateString('it-IT')+' · tasso indicativo, non include commissioni';
 }catch(e){activeCurrencyRate=null;target.textContent='Cambio temporaneamente non disponibile per questa valuta. Riprova più tardi.';if(source)source.textContent='Fonte: ExchangeRate-API · nessun dato ricevuto'}
}
function convertCurrency(side){
 const euro=$('currencyEuro'),local=$('currencyLocal');if(!euro||!local||!activeCurrencyRate)return;
 if(side==='eur'){const amount=Number(euro.value);local.value=euro.value===''?'':(amount*activeCurrencyRate).toFixed(2)}
 else{const amount=Number(local.value);euro.value=local.value===''?'':(amount/activeCurrencyRate).toFixed(2)}
}
const photoCache=new Map(),photoPending=new Set();
const PHOTO_ARTICLES={
'Giappone':'Mount Fuji','Egitto':'Giza pyramid complex','Thailandia':'Phi Phi Islands','Nuova Zelanda':'Aoraki Mount Cook','Perù':'Machu Picchu','Marocco':'Chefchaouen','Sud Africa':'Table Mountain','Islanda':'Skógafoss','Norvegia':'Lofoten',
'Italia':'Dolomites','Francia':'Mont Saint-Michel','Spagna':'Alhambra','Portogallo':'Pena Palace','Grecia':'Santorini','Turchia':'Cappadocia','Regno Unito':'Scottish Highlands','Irlanda':'Cliffs of Moher','Germania':'Neuschwanstein Castle','Svizzera':'Matterhorn','Austria':'Hallstatt','Polonia':'Tatra Mountains','Croazia':'Plitvice Lakes National Park','Slovenia':'Lake Bled','Montenegro':'Bay of Kotor','Albania':'Ksamil','Romania':'Bran Castle','Bulgaria':'Rila Monastery',
'Stati Uniti':'Grand Canyon','USA':'Grand Canyon','Canada':'Moraine Lake','Messico':'Chichen Itza','Costa Rica':'Arenal Volcano','Panama':'Panama Canal','Guatemala':'Tikal','Cuba':'Viñales Valley','Giamaica':'Dunns River Falls','Bahamas':'Exuma Cays','Brasile':'Iguazu Falls','Argentina':'Perito Moreno Glacier','Cile':'Torres del Paine National Park','Bolivia':'Salar de Uyuni','Ecuador':'Galápagos Islands','Uruguay':'Colonia del Sacramento',
'Kenya':'Maasai Mara','Tanzania':'Mount Kilimanjaro','Namibia':'Sossusvlei','Botswana':'Okavango Delta','Zambia':'Victoria Falls','Zimbabwe':'Victoria Falls','Uganda':'Bwindi Impenetrable National Park','Ruanda':'Volcanoes National Park Rwanda','Etiopia':'Lalibela','Ghana':'Cape Coast Castle','Senegal':'Lake Retba','Madagascar':'Avenue of the Baobabs','Mauritius':'Le Morne Brabant','Seychelles':'Anse Source d’Argent','Capo Verde':'Pico do Fogo','Oman':'Wadi Shab','Giordania':'Petra','Emirati Arabi Uniti':'Burj Khalifa','Arabia Saudita':'AlUla','Qatar':'Doha skyline','India':'Taj Mahal','Nepal':'Annapurna Range','Pakistan':'Hunza Valley','Sri Lanka':'Sigiriya','Maldive':'Baa Atoll','Indonesia':'Borobudur','Vietnam':'Ha Long Bay','Cambogia':'Angkor Wat','Laos':'Kuang Si Falls','Filippine':'Palawan','Malaysia':'Mount Kinabalu','Singapore':'Gardens by the Bay','Cina':'Zhangjiajie National Forest Park','Corea del Sud':'Seoraksan National Park','Taiwan':'Taroko National Park','Australia':'Uluru','Figi':'Yasawa Islands','Polinesia Francese':'Bora Bora'
};
const COUNTRY_FLAGS={'Italia':'🇮🇹','Giappone':'🇯🇵','Egitto':'🇪🇬','Thailandia':'🇹🇭','Francia':'🇫🇷','Spagna':'🇪🇸','USA':'🇺🇸','Australia':'🇦🇺','Nuova Zelanda':'🇳🇿','India':'🇮🇳','Cina':'🇨🇳','Brasile':'🇧🇷','Perù':'🇵🇪','Messico':'🇲🇽','Grecia':'🇬🇷','Turchia':'🇹🇷','Marocco':'🇲🇦','Sud Africa':'🇿🇦','Kenya':'🇰🇪','Tanzania':'🇹🇿','Islanda':'🇮🇸','Norvegia':'🇳🇴','Svizzera':'🇨🇭','Germania':'🇩🇪','Regno Unito':'🇬🇧','Portogallo':'🇵🇹','Paesi Bassi':'🇳🇱','Irlanda':'🇮🇪','Croazia':'🇭🇷','Capo Verde':'🇨🇻','Maldive':'🇲🇻','Indonesia':'🇮🇩','Vietnam':'🇻🇳','Cambogia':'🇰🇭','Nepal':'🇳🇵','Giordania':'🇯🇴','Emirati Arabi Uniti':'🇦🇪','Singapore':'🇸🇬','Corea del Sud':'🇰🇷','Argentina':'🇦🇷','Cile':'🇨🇱','Bolivia':'🇧🇴','Canada':'🇨🇦','Finlandia':'🇫🇮','Austria':'🇦🇹','Polonia':'🇵🇱','Cuba':'🇨🇺','Giamaica':'🇯🇲','Seychelles':'🇸🇨','Mauritius':'🇲🇺','Madagascar':'🇲🇬','Oman':'🇴🇲','Qatar':'🇶🇦','Arabia Saudita':'🇸🇦','Uzbekistan':'🇺🇿','Georgia':'🇬🇪','Armenia':'🇦🇲','Albania':'🇦🇱','Montenegro':'🇲🇪','Romania':'🇷🇴','Bulgaria':'🇧🇬','Serbia':'🇷🇸','Taiwan':'🇹🇼','Filippine':'🇵🇭','Sri Lanka':'🇱🇰','Laos':'🇱🇦','Birmania':'🇲🇲','Pakistan':'🇵🇰','Ghana':'🇬🇭','Senegal':'🇸🇳','Namibia':'🇳🇦','Botswana':'🇧🇼','Zambia':'🇿🇲','Zimbabwe':'🇿🇼','Uganda':'🇺🇬','Ruanda':'🇷🇼','Etiopia':'🇪🇹','Tunisia':'🇹🇳','Panama':'🇵🇦','Costa Rica':'🇨🇷','Guatemala':'🇬🇹','Ecuador':'🇪🇨','Uruguay':'🇺🇾','Bahamas':'🇧🇸','Figi':'🇫🇯','Polinesia Francese':'🇵🇫'};
const COUNTRY_CODES={
'Algeria':'DZ','Angola':'AO','Benin':'BJ','Burkina Faso':'BF','Burundi':'BI','Camerun':'CM','Ciad':'TD','Comore':'KM','Congo':'CG','Congo Rep. Dem.':'CD',"Costa d'Avorio":'CI','Gibuti':'DJ','Eritrea':'ER','Gabon':'GA','Gambia':'GM','Guinea':'GN','Guinea-Bissau':'GW','Lesotho':'LS','Liberia':'LR','Libia':'LY','Malawi':'MW','Mali':'ML','Mauritania':'MR','Mozambico':'MZ','Niger':'NE','Nigeria':'NG','São Tomé e Príncipe':'ST','Sierra Leone':'SL','Somalia':'SO','Sudan del sud':'SS','Sudan':'SD','Togo':'TG',
'Afghanistan':'AF','Azerbaijan':'AZ','Bahrein':'BH','Bangladesh':'BD','Bhutan':'BT','Brunei':'BN','Corea del Nord':'KP','Iran':'IR','Iraq':'IQ','Israele':'IL','Kazakistan':'KZ','Kuwait':'KW','Kirghizistan':'KG','Libano':'LB','Malesia':'MY','Mongolia':'MN','Palestina':'PS','Siria':'SY','Tagikistan':'TJ','Timor Est':'TL','Turkmenistan':'TM','Yemen':'YE',
'Belize':'BZ','El Salvador':'SV','Haiti':'HT','Honduras':'HN','Nicaragua':'NI','Repubblica Dominicana':'DO','Trinidad e Tobago':'TT','Colombia':'CO','Guyana':'GY','Paraguay':'PY','Suriname':'SR','Venezuela':'VE',
'Andorra':'AD','Belgio':'BE','Bielorussia':'BY','Bosnia-Erzegovina':'BA','Cipro':'CY','Città del Vaticano':'VA','Danimarca':'DK','Estonia':'EE','Kosovo':'XK','Lettonia':'LV','Liechtenstein':'LI','Lituania':'LT','Lussemburgo':'LU','Macedonia del Nord':'MK','Malta':'MT','Moldavia':'MD','Principato di Monaco':'MC','Russia':'RU','San Marino':'SM','Slovacchia':'SK','Slovenia':'SI','Svezia':'SE','Ucraina':'UA','Ungheria':'HU',
'Kiribati':'KI','Isole Marshall':'MH','Micronesia':'FM','Palau':'PW','Papua Nuova Guinea':'PG','Samoa':'WS','Isole Salomone':'SB','Tonga':'TO','Vanuatu':'VU'
};
function flagFromCode(code){return String.fromCodePoint(...[...code.toUpperCase()].map(ch=>127397+ch.charCodeAt(0)))}
function countryFlag(name){const key=String(name||'').trim().toLocaleLowerCase('it');const flagKey=Object.keys(COUNTRY_FLAGS).find(k=>k.toLocaleLowerCase('it')===key);if(flagKey)return COUNTRY_FLAGS[flagKey];const codeKey=Object.keys(COUNTRY_CODES).find(k=>k.toLocaleLowerCase('it')===key);return codeKey?flagFromCode(COUNTRY_CODES[codeKey]):'🌍'}
async function fetchCountryPhoto(name){
 if(photoCache.has(name))return photoCache.get(name);
 if(photoPending.has(name))return null;
 photoPending.add(name);
 let result=null;
 const localNames=new Set(['Afghanistan','Albania','Algeria','Andorra','Angola']);
 if(localNames.has(name)){
  const localUrl='./assets/country-photos/'+encodeURIComponent(name)+'.webp';
  try{const check=await fetch(localUrl,{method:'HEAD',cache:'no-store'});if(check.ok){photoPending.delete(name);photoCache.set(name,localUrl);return localUrl;}}catch(e){}
 }
 const article=PHOTO_ARTICLES[name];
 const queries=article
  ? [name+' '+article+' landscape',article+' '+name+' travel photography',name+' iconic landscape']
  : [name+' landscape travel photography',name+' famous natural landmark',name+' national park scenery',name+' coast mountain waterfall'];
 const excluded=/(flag|map|coat of arms|logo|icon|seal|emblem|locator|blank map|outline map|satellite image|airport diagram|political map|flag of)/i;
 const countryTokens=name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').split(/[^a-z0-9]+/).filter(t=>t.length>2);
 for(const term of queries){
  try{
   const url='https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch='+encodeURIComponent(term)+'&gsrnamespace=6&gsrlimit=40&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=1400&format=json&origin=*';
   const response=await fetch(url);
   if(!response.ok)continue;
   const data=await response.json();
   const pages=Object.values(data.query?.pages||{});
   const candidates=pages.filter(p=>{
    const info=p.imageinfo?.[0],title=p.title||'';
    if(!info?.thumburl||info.width<1200||info.height<650||excluded.test(title)||/\.svg($|\?)/i.test(info.thumburl))return false;
    const meta=info.extmetadata||{};
    const license=meta.LicenseShortName?.value||meta.UsageTerms?.value||'';
    return Boolean(license);
   }).map(p=>{
    const info=p.imageinfo[0],meta=info.extmetadata||{};
    const title=(p.title||'').toLowerCase();
    const description=(meta.ImageDescription?.value||'').replace(/<[^>]*>/g,' ').toLowerCase();
    const categories=(p.categories||[]).map(c=>c.title||'').join(' ').toLowerCase();
    const evidence=title+' '+description+' '+categories;
    let score=0;
    for(const token of countryTokens)if(evidence.includes(token))score+=8;
    if(article&&evidence.includes(article.toLowerCase()))score+=12;
    if(/landscape|mountain|waterfall|beach|coast|island|national park|valley|lake|desert|temple|old town|bay|fjord|volcano|historic|heritage/i.test(evidence))score+=4;
    if(/tourism|travel|scenery|panorama/i.test(evidence))score+=2;
    if(/\.(jpg|jpeg|webp)$/i.test(info.thumburl))score+=1;
    return {url:info.thumburl,score,title:p.title,license:meta.LicenseShortName?.value||''};
   }).sort((x,y)=>y.score-x.score);
   if(candidates.length&&candidates[0].score>=8){result=candidates[0].url;break;}
  }catch(e){}
 }
 photoPending.delete(name);
 photoCache.set(name,result);
 return result;
}
function observeCountryPhotos(){const imgs=document.querySelectorAll('img[data-country-photo]:not([data-photo-observed])');if(!('IntersectionObserver'in window)){imgs.forEach(img=>loadPhoto(img));return}const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){observer.unobserve(entry.target);loadPhoto(entry.target)}})},{rootMargin:'250px'});imgs.forEach(img=>{img.dataset.photoObserved='1';observer.observe(img)})}
async function loadPhoto(img){const name=img.dataset.countryPhoto;if(!name)return;const src=await fetchCountryPhoto(name);if(src&&img.isConnected){img.src=src;img.closest('.country-photo,.detail-photo')?.classList.add('loaded')}else if(img.isConnected){img.closest('.country-photo,.detail-photo')?.classList.add('no-photo')}}
function updateFav(name){favorites.has(name)?favorites.delete(name):favorites.add(name);localStorage.setItem('roam_favs',JSON.stringify([...favorites]));render()}
fetch(new URL('./countries.json?build=16',document.baseURI),{cache:'reload'}).then(r=>{if(!r.ok)throw new Error('HTTP '+r.status+' durante il caricamento di countries.json');return r.json()}).then(data=>{if(!Array.isArray(data)||!data.length)throw new Error('Il database ricevuto è vuoto o non valido');countries=data;$('total').textContent=countries.length;$('seasonCoverage').textContent=countries.filter(c=>String(c['Periodo migliore']||'').trim()).length+'/'+countries.length;$('visaCoverage').textContent=countries.filter(c=>String(c['Visto per cittadini italiani']||'').trim()).length+'/'+countries.length;$('methodCoverage').textContent=countries.filter(c=>String(c['Modalità richiesta visto']||'').trim()).length+'/'+countries.length;let continents=[...new Set(countries.map(c=>c.Continente).filter(Boolean))].sort();continents.forEach(v=>$('continent').insertAdjacentHTML('beforeend',`<option>${esc(v)}</option>`));render()}).catch(error=>{console.error('ROAM database load failed:',error);$('count').textContent='Errore nel caricamento';$('grid').innerHTML='<div class="empty"><strong>Non riesco a caricare le destinazioni.</strong><br>'+esc(error.message)+'<br><small>Controlla la connessione e riprova.</small></div>'});
['q','month','continent','visa','sort'].forEach(id=>$(id).addEventListener(id==='q'?'input':'change',render));$('grid').addEventListener('click',e=>{let f=e.target.closest('[data-fav]'),d=e.target.closest('[data-detail]');if(f)updateFav(f.dataset.fav);if(d){let c=countries.find(x=>x.Paese===d.dataset.detail);if(c)detail(c)}});$('grid').addEventListener('change',e=>{let c=e.target.closest('[data-compare]');if(c){if(c.checked){if(compare.size>=3){c.checked=false;alert('Puoi confrontare al massimo 3 Paesi.');return}compare.add(c.dataset.compare)}else compare.delete(c.dataset.compare);render()}});
$('favNav').onclick=()=>{onlyFav=!onlyFav;$('favBtn').classList.toggle('active',onlyFav);$('allBtn').classList.toggle('active',!onlyFav);render();window.scrollTo({top:document.querySelector('.filters').offsetTop-20,behavior:'smooth'})};$('favBtn').onclick=()=>{onlyFav=!onlyFav;$('favBtn').classList.toggle('active',onlyFav);$('allBtn').classList.toggle('active',!onlyFav);render()};$('allBtn').onclick=()=>{onlyFav=false;$('favBtn').classList.remove('active');$('allBtn').classList.add('active');render()};$('reset').onclick=()=>{$('q').value='';['month','continent','visa'].forEach(id=>$(id).value='');onlyFav=false;$('favBtn').classList.remove('active');$('allBtn').classList.add('active');render()};$('clearCompare').onclick=()=>{compare.clear();render()};$('compareBtn').onclick=()=>{let chosen=countries.filter(c=>compare.has(c.Paese));let fields=['Continente','Periodo migliore','Visto per cittadini italiani','Modalità richiesta visto',...MONTHS];$('compareContent').innerHTML=`<div class="detailhead"><div><div class="eyebrow">ROAM</div><h2>Confronta destinazioni</h2></div><button class="close" onclick="$('compareDialog').close()">×</button></div><div style="overflow:auto"><table class="comparetable"><thead><tr><th>Caratteristica</th>${chosen.map(c=>`<th>${esc(c.Paese)}</th>`).join('')}</tr></thead><tbody>${fields.map(k=>`<tr><td>${esc(k)}</td>${chosen.map(c=>`<td>${esc(c[k]??'Non disponibile')}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;$('compareDialog').showModal()};

// ROAM transport estimator: geocoding + road routing, with clearly labelled heuristic fare ranges.
const routeFrom=$('routeFrom'),routeTo=$('routeTo'),routeMode=$('routeMode'),routeError=$('routeError'),routeResults=$('routeResults');
const money=n=>'€'+Math.round(n).toLocaleString('it-IT');
async function geocodePlace(q){const r=await fetch('https://geocoding-api.open-meteo.com/v1/search?name='+encodeURIComponent(q)+'&count=1&language=it&format=json');if(!r.ok)throw new Error('Servizio di ricerca località non disponibile.');const d=await r.json();if(!d.results?.length)throw new Error('Non trovo una località per “'+q+'”. Prova con città e Paese.');return d.results[0]}
function haversine(a,b){const rad=x=>x*Math.PI/180,R=6371,dLat=rad(b.latitude-a.latitude),dLon=rad(b.longitude-a.longitude),v=Math.sin(dLat/2)**2+Math.cos(rad(a.latitude))*Math.cos(rad(b.latitude))*Math.sin(dLon/2)**2;return 2*R*Math.asin(Math.sqrt(v))}
function makeRouteCard(name,icon,min,max,duration,detail,tag,link){return '<article class="route-result '+(tag?'best':'')+'"><div class="route-result-head"><h3>'+icon+' '+name+'</h3>'+(tag?'<span class="rating-status">'+tag+'</span>':'')+'</div><div class="route-price">'+money(min)+' – '+money(max)+'</div><p>Prezzo indicativo per persona · sola andata</p><p><strong>Tempo orientativo:</strong> '+duration+'</p><p>'+detail+'</p><a href="'+link+'" target="_blank" rel="noopener noreferrer">Verifica tratte e tariffe ↗</a></article>'}
async function openRouteSearch(){const from=routeFrom.value.trim(),to=routeTo.value.trim();routeError.textContent='';routeResults.innerHTML='';if(!from||!to){routeError.textContent='Inserisci sia il luogo di partenza sia la destinazione.';(!from?routeFrom:routeTo).focus();return}const button=$('routeSearch');button.disabled=true;button.textContent='Calcolo in corso…';try{const [a,b]=await Promise.all([geocodePlace(from),geocodePlace(to)]);const kmAir=haversine(a,b);if(kmAir<1)throw new Error('Partenza e destinazione sembrano coincidere.');const map='https://www.google.com/maps/dir/?api=1&origin='+encodeURIComponent(from)+'&destination='+encodeURIComponent(to);const rr='https://www.rome2rio.com/map/'+encodeURIComponent(from)+'/'+encodeURIComponent(to);let kmRoad=kmAir*1.25,driveHours=kmRoad/85;try{const r=await fetch('https://router.project-osrm.org/route/v1/driving/'+a.longitude+','+a.latitude+';'+b.longitude+','+b.latitude+'?overview=false');if(r.ok){const d=await r.json();if(d.routes?.[0]){kmRoad=d.routes[0].distance/1000;driveHours=d.routes[0].duration/3600}}}catch(e){}const mode=routeMode.value,cards=[];if(mode==='all'||mode==='car'){const fuel=kmRoad*0.065*1.85;cards.push(makeRouteCard('Auto','🚗',fuel+kmRoad*.04,fuel+kmRoad*.12,(driveHours*1.15).toFixed(1).replace('.',',')+'–'+(driveHours*1.4).toFixed(1).replace('.',',')+' h','Carburante stimato con consumo 6,5 l/100 km e carburante a 1,85 €/l; pedaggi e parcheggi esclusi.',false,map))}if(mode==='all'||mode==='bus'){const lo=Math.max(8,kmRoad*.045),hi=Math.max(18,kmRoad*.095);cards.push(makeRouteCard('Autobus','🚌',lo,hi,Math.ceil(kmRoad/65*10)/10+'–'+Math.ceil(kmRoad/50*10)/10+' h','Fascia modellata sulla distanza: non conferma che esista una corsa diretta.',false,rr))}if(mode==='all'||mode==='train'){const lo=Math.max(12,kmRoad*.07),hi=Math.max(25,kmRoad*.17);cards.push(makeRouteCard('Treno','🚆',lo,hi,Math.ceil(kmRoad/100*10)/10+'–'+Math.ceil(kmRoad/65*10)/10+' h','Stima generica: dipende da rete ferroviaria, cambi, anticipo e classe.',false,rr))}if(mode==='all'||mode==='plane'){const lo=Math.max(35,70+kmAir*.045),hi=Math.max(90,170+kmAir*.12);cards.push(makeRouteCard('Aereo','✈️',lo,hi,(kmAir/750+2.5).toFixed(1).replace('.',',')+'–'+(kmAir/600+3.5).toFixed(1).replace('.',',')+' h','Include un margine convenzionale per aeroporto; bagagli, transfer e disponibilità non verificati.',false,rr))}routeResults.innerHTML=cards.join('')+'<p class="route-disclaimer">Stime automatiche sperimentali basate su distanza e coefficienti medi, non su inventario di operatori. Non attestano l’esistenza di un collegamento, né includono necessariamente cambi, supplementi, pedaggi o stagionalità. Per prezzi e orari effettivi apri Rome2Rio o Google Maps. Distanza stradale da OpenStreetMap/OSRM quando disponibile; località da Open-Meteo Geocoding.</p>'}catch(error){routeError.textContent=error.message||'Non riesco a calcolare il percorso. Riprova o controlla i nomi delle località.'}finally{button.disabled=false;button.innerHTML='Calcola alternative <span>→</span>'}}
$('routeSearch').addEventListener('click',openRouteSearch);$('routeSwap').addEventListener('click',()=>{const v=routeFrom.value;routeFrom.value=routeTo.value;routeTo.value=v;routeError.textContent='';routeResults.innerHTML=''});[routeFrom,routeTo].forEach(input=>input.addEventListener('keydown',e=>{if(e.key==='Enter')openRouteSearch()}));
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'}).then(reg=>reg.update()).catch(()=>{}));
$('surpriseBtn').onclick=()=>{let pool=filtered();if(!pool.length){alert('Nessuna destinazione disponibile con i filtri attuali.');return}detail(pool[Math.floor(Math.random()*pool.length)])};

$('shareBtn').addEventListener('click',async()=>{const shareData={title:'ROAM — Find your next destination',text:'Scopri ROAM: esplora destinazioni e trova il momento giusto per partire.',url:window.location.href};if(navigator.share){try{await navigator.share(shareData);return}catch(error){if(error&&error.name==='AbortError')return}}try{await navigator.clipboard.writeText(shareData.url);alert('Link di ROAM copiato! Ora puoi incollarlo su WhatsApp o dove vuoi.')}catch(error){window.prompt('Copia il link di ROAM:',shareData.url)}});

/* ROAM install experience */
let roamInstallPrompt=null;
const installDialog=document.getElementById('installDialog');
const installAction=document.getElementById('installAction');
const installHelp=document.getElementById('installHelp');
const isStandalone=()=>window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;
const isAppleMobile=()=>/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
function showInstallHelp(){
 const apple=isAppleMobile();
 installHelp.innerHTML=apple
 ? '<strong>Su iPhone o iPad:</strong><br>1. Tocca il pulsante Condividi in Safari.<br>2. Scorri e scegli “Aggiungi alla schermata Home”.<br>3. Conferma con “Aggiungi”.'
 : '<strong>Per installare ROAM:</strong><br>Apri il menu del browser (⋮ su Chrome o Edge) e scegli “Installa app” oppure “Aggiungi a schermata Home”. Se la voce non compare, prova con Chrome aggiornato.';
 installHelp.classList.add('show');
 installAction.textContent='Ho capito';
}
function openInstallDialog(){if(!isStandalone()&&installDialog&&!installDialog.open)installDialog.showModal()}
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();roamInstallPrompt=event;installAction.textContent='Installa ROAM';});
window.addEventListener('appinstalled',()=>{roamInstallPrompt=null;if(installDialog?.open)installDialog.close();const nav=document.getElementById('installNav');if(nav)nav.hidden=true;});
document.getElementById('installNav')?.addEventListener('click',openInstallDialog);
installAction?.addEventListener('click',async()=>{
 if(roamInstallPrompt){
  const promptEvent=roamInstallPrompt;roamInstallPrompt=null;
  await promptEvent.prompt();
  const choice=await promptEvent.userChoice;
  if(choice?.outcome==='accepted'){installDialog.close();return;}
  installAction.textContent='Riprova installazione';
  return;
 }
 if(installHelp.classList.contains('show')){installDialog.close();return;}
 showInstallHelp();
});
document.getElementById('installLater')?.addEventListener('click',()=>installDialog.close());
if(isStandalone()){const nav=document.getElementById('installNav');if(nav)nav.hidden=true;}
else{document.getElementById('installNav').hidden=false;window.addEventListener('load',()=>setTimeout(openInstallDialog,250));}


/* ROAM multilingual interface */
(()=>{
 const picker=document.getElementById('languagePicker');
 if(!picker)return;
 const translations={
 en:{
 'FIND YOUR NEXT DESTINATION':'FIND YOUR NEXT DESTINATION','↓ Installa app':'↓ Install app','♡ Preferiti ':'♡ Favorites ','Azzera filtri':'Reset filters',
 'Il mondo, a portata di viaggio':'The world, within reach','La prossima meta':'Your next destination','inizia da qui.':'starts here.',
 'Esplora le destinazioni, filtra in base al periodo e alle tue esigenze, salva i luoghi che ti ispirano e confrontali.':'Explore destinations, filter by season and your needs, save places that inspire you and compare them.',
 'DESTINAZIONI NEL DATABASE':'DESTINATIONS IN DATABASE','Completezza dei dati':'Data completeness','Paesi con periodo indicato':'Countries with best season listed','Paesi con dato visto':'Countries with visa information','Paesi con modalità visto':'Countries with visa method',
 'Pianifica gli spostamenti':'Plan your journey','Come arrivare':'How to get there','Stima le alternative di viaggio e confronta i costi orientativi. Per tariffe e orari reali verifica poi gli operatori.':'Estimate travel options and compare indicative costs. Check operators for actual fares and schedules.',
 'Da dove parti?':'Where are you leaving from?','Città o aeroporto':'City or airport','Inverti partenza e destinazione':'Swap origin and destination','Dove vuoi arrivare?':'Where do you want to go?','Mezzo':'Transport','Tutti i mezzi':'All transport','Aereo':'Flight','Treno':'Train','Autobus':'Bus','Auto':'Car','Calcola alternative':'Compare options',
 'Le fasce sono stime orientative, non tariffe disponibili.':'Price ranges are estimates, not available fares.','Filtri di ricerca':'Search filters','Cerca destinazione':'Search destination','Es. Giappone, mare, safari…':'E.g. Japan, beach, safari…','Mese':'Month','Tutti i mesi':'All months','Continente':'Continent','Tutti':'All','Visto':'Visa','Qualsiasi':'Any','Senza visto':'Visa-free','Visto richiesto':'Visa required','Online / eVisa':'Online / eVisa','Da verificare':'To be checked',
 'Tutti i Paesi':'All countries','↗ Condividi ROAM':'↗ Share ROAM','♡ Solo preferiti':'♡ Favorites only','✦ Sorprendimi':'✦ Surprise me','Ordina':'Sort','Esplora le destinazioni':'Explore destinations','Caricamento destinazioni…':'Loading destinations…',
 'Porta ROAM con te':'Take ROAM with you','Installa l’app sul telefono per ritrovare le tue destinazioni e pianificare i prossimi viaggi in modo rapido.':'Install the app on your phone to access your destinations and plan your next trips quickly.','Installa ROAM':'Install ROAM','Continua sul sito':'Continue to website','Confronta':'Compare','selezionati':'selected','Scheda destinazione':'Destination overview','Prima di partire':'Before you go','Controlli pratici per':'Practical checks for','Apri Viaggiare Sicuri ↗':'Open Viaggiare Sicuri ↗','Documenti di viaggio ↗':'Travel documents ↗','Valutazione ROAM':'ROAM rating','Valutazione in corso':'Rating in progress','Cambio valuta':'Currency exchange','Euro ↔ valuta locale':'Euro ↔ local currency','Non disponibile':'Not available','Dato non disponibile':'Data unavailable','Dato non inserito':'Not entered','Periodo non indicato':'Season not specified','Confronta destinazioni':'Compare destinations','Carburante stimato':'Estimated fuel','Prezzo indicativo per persona · sola andata':'Indicative price per person · one way','Tempo orientativo:':'Estimated time:','Verifica tratte e tariffe ↗':'Check routes and fares ↗',
 'Nessuna destinazione corrisponde ai filtri.':'No destinations match your filters.','Prova a modificare la ricerca.':'Try changing your search.','Apri scheda →':'Open details →','Preferito':'Favorite','Paese':'Country','Continente':'Continent','Periodo migliore':'Best time to visit','Visto per cittadini italiani':'Visa for Italian citizens','Modalità richiesta visto':'Visa application method','Budget giornaliero':'Daily budget','Durata consigliata':'Recommended duration','Esperienze':'Experiences','Clima':'Climate','Completezza del dato visto':'Visa data completeness','Capitale':'Capital','Lingue':'Languages','Valuta':'Currency','Fuso orario':'Time zone','Popolazione':'Population','Superficie':'Area',
 'Verifica quale documento è accettato e la sua validità residua.':'Check which travel document is accepted and its remaining validity.','Controlla requisiti di ingresso, eventuale visto e modalità di richiesta.':'Check entry requirements, any visa and application method.','Consulta gli avvisi di sicurezza, la situazione sanitaria e le indicazioni sulla mobilità.':'Check safety notices, health information and mobility guidance.','Annota i contatti dell’Ambasciata o del Consolato italiano.':'Save the contact details of the Italian Embassy or Consulate.','Nessuna valutazione inventata.':'No invented ratings.','Recupero del tasso di cambio…':'Loading exchange rate…','Cambio temporaneamente non disponibile. Riprova più tardi.':'Exchange rate temporarily unavailable. Try again later.','Calcolo in corso…':'Calculating…','Inserisci sia il luogo di partenza sia la destinazione.':'Enter both your origin and destination.','Non trovo una località per':'Could not find a location for','Prova con città e Paese.':'Try a city and country.','Partenza e destinazione sembrano coincidere.':'Origin and destination appear to be the same.'
 },
 es:{
 'FIND YOUR NEXT DESTINATION':'ENCUENTRA TU PRÓXIMO DESTINO','↓ Installa app':'↓ Instalar app','♡ Preferiti ':'♡ Favoritos ','Azzera filtri':'Restablecer filtros',
 'Il mondo, a portata di viaggio':'El mundo, al alcance de un viaje','La prossima meta':'Tu próximo destino','inizia da qui.':'empieza aquí.',
 'Esplora le destinazioni, filtra in base al periodo e alle tue esigenze, salva i luoghi che ti ispirano e confrontali.':'Explora destinos, filtra por temporada y necesidades, guarda los lugares que te inspiran y compáralos.',
 'DESTINAZIONI NEL DATABASE':'DESTINOS EN LA BASE DE DATOS','Completezza dei dati':'Completitud de los datos','Paesi con periodo indicato':'Países con mejor época indicada','Paesi con dato visto':'Países con información de visado','Paesi con modalità visto':'Países con método de visado',
 'Pianifica gli spostamenti':'Planifica tus desplazamientos','Come arrivare':'Cómo llegar','Stima le alternative di viaggio e confronta i costi orientativi. Per tariffe e orari reali verifica poi gli operatori.':'Calcula alternativas de viaje y compara costes aproximados. Consulta a los operadores para conocer tarifas y horarios reales.',
 'Da dove parti?':'¿Desde dónde sales?','Città o aeroporto':'Ciudad o aeropuerto','Inverti partenza e destinazione':'Intercambiar origen y destino','Dove vuoi arrivare?':'¿Adónde quieres llegar?','Mezzo':'Transporte','Tutti i mezzi':'Todos los medios','Aereo':'Avión','Treno':'Tren','Autobus':'Autobús','Auto':'Coche','Calcola alternative':'Calcular alternativas',
 'Le fasce sono stime orientative, non tariffe disponibili.':'Los rangos son estimaciones, no tarifas disponibles.','Filtri di ricerca':'Filtros de búsqueda','Cerca destinazione':'Buscar destino','Es. Giappone, mare, safari…':'Ej. Japón, playa, safari…','Mese':'Mes','Tutti i mesi':'Todos los meses','Continente':'Continente','Tutti':'Todos','Visto':'Visado','Qualsiasi':'Cualquiera','Senza visto':'Sin visado','Visto richiesto':'Visado obligatorio','Online / eVisa':'Online / eVisa','Da verificare':'Por verificar',
 'Tutti i Paesi':'Todos los países','↗ Condividi ROAM':'↗ Compartir ROAM','♡ Solo preferiti':'♡ Solo favoritos','✦ Sorprendimi':'✦ Sorpréndeme','Ordina':'Ordenar','Esplora le destinazioni':'Explora los destinos','Caricamento destinazioni…':'Cargando destinos…',
 'Porta ROAM con te':'Lleva ROAM contigo','Installa l’app sul telefono per ritrovare le tue destinazioni e pianificare i prossimi viaggi in modo rapido.':'Instala la app en tu móvil para acceder a tus destinos y planificar tus próximos viajes rápidamente.','Installa ROAM':'Instalar ROAM','Continua sul sito':'Continuar en el sitio','Confronta':'Comparar','selezionati':'seleccionados','Scheda destinazione':'Ficha del destino','Prima di partire':'Antes de viajar','Controlli pratici per':'Comprobaciones prácticas para','Apri Viaggiare Sicuri ↗':'Abrir Viaggiare Sicuri ↗','Documenti di viaggio ↗':'Documentos de viaje ↗','Valutazione ROAM':'Valoración ROAM','Valutazione in corso':'Valoración en curso','Cambio valuta':'Cambio de divisa','Euro ↔ valuta locale':'Euro ↔ moneda local','Non disponibile':'No disponible','Dato non disponibile':'Dato no disponible','Dato non inserito':'No introducido','Periodo non indicato':'Temporada no indicada','Confronta destinazioni':'Comparar destinos','Prezzo indicativo per persona · sola andata':'Precio orientativo por persona · solo ida','Tempo orientativo:':'Tiempo estimado:','Verifica tratte e tariffe ↗':'Consultar rutas y tarifas ↗',
 'Nessuna destinazione corrisponde ai filtri.':'Ningún destino coincide con los filtros.','Prova a modificare la ricerca.':'Prueba a cambiar la búsqueda.','Apri scheda →':'Abrir ficha →','Preferito':'Favorito','Paese':'País','Periodo migliore':'Mejor época','Visto per cittadini italiani':'Visado para ciudadanos italianos','Modalità richiesta visto':'Método de solicitud del visado','Budget giornaliero':'Presupuesto diario','Durata consigliata':'Duración recomendada','Esperienze':'Experiencias','Clima':'Clima','Completezza del dato visto':'Completitud de los datos de visado','Capitale':'Capital','Lingue':'Idiomas','Valuta':'Moneda','Fuso orario':'Zona horaria','Popolazione':'Población','Superficie':'Superficie',
 'Verifica quale documento è accettato e la sua validità residua.':'Comprueba qué documento se acepta y su vigencia restante.','Controlla requisiti di ingresso, eventuale visto e modalità di richiesta.':'Consulta los requisitos de entrada, el visado y cómo solicitarlo.','Consulta gli avvisi di sicurezza, la situazione sanitaria e le indicazioni sulla mobilità.':'Consulta las alertas de seguridad, la situación sanitaria y las indicaciones de movilidad.','Annota i contatti dell’Ambasciata o del Consolato italiano.':'Guarda los contactos de la Embajada o el Consulado italiano.','Nessuna valutazione inventata.':'Sin valoraciones inventadas.','Recupero del tasso di cambio…':'Obteniendo el tipo de cambio…','Cambio temporaneamente non disponibile. Riprova più tardi.':'Cambio temporalmente no disponible. Inténtalo más tarde.','Calcolo in corso…':'Calculando…','Inserisci sia il luogo di partenza sia la destinazione.':'Introduce el origen y el destino.','Prova con città e Paese.':'Prueba con una ciudad y un país.','Partenza e destinazione sembrano coincidere.':'El origen y el destino parecen coincidir.'
 }};
 Object.assign(translations.en,{
  'Confronta':'Compare','Confronta:':'Compare:','Seleziona':'Select','risultati':'results','Risultati':'Results',
  'DESTINAZIONI NEL DATABASE':'DESTINATIONS IN DATABASE','Paesi con il periodo migliore per visitare':'Countries with the best time to visit',
  'Paesi che richiedono il visto':'Countries requiring a visa','Da definire':'To be defined','Da verificare su fonte ufficiale':'Check official source',
  'Da verificare su Viaggiare Sicuri':'Check Viaggiare Sicuri','Visto richiesto':'Visa required','Online o all’arrivo':'Online or on arrival',
  'All’arrivo':'On arrival','UE':'EU','GEN':'JAN','FEB':'FEB','MAR':'MAR','APR':'APR','MAG':'MAY','GIU':'JUN','LUG':'JUL','AGO':'AUG','SET':'SEP','OTT':'OCT','NOV':'NOV','DIC':'DEC',
  'Europa':'Europe','Africa':'Africa','Asia':'Asia','America del Nord':'North America','America del Sud':'South America','Oceania':'Oceania','Caraibi':'Caribbean',
  'Confronta':'Compare','Confronta destinazioni':'Compare destinations','Selezionati':'Selected','Nessuna destinazione disponibile con i filtri attuali.':'No destination matches the current filters.',
  'Carburante e pedaggi esclusi.':'Fuel and tolls excluded.','Stima editoriale da completare':'Editorial estimate to be completed','Da definire in base all’itinerario':'To be defined based on the itinerary',
  'Da completare con contenuti verificati':'To be completed with verified content','Consulta il periodo migliore indicato e le fonti meteo locali':'Check the recommended season and local weather sources',
  'Presente nel database, da verificare su fonte ufficiale':'Present in the database; verify with an official source',
  'Valuta non disponibile nel database':'Currency not available in the database'
 });
 Object.assign(translations.es,{
  'Confronta':'Comparar','Confronta:':'Comparar:','Seleziona':'Seleccionar','risultati':'resultados','Risultati':'Resultados',
  'DESTINAZIONI NEL DATABASE':'DESTINOS EN LA BASE DE DATOS','Paesi con il periodo migliore per visitare':'Países con la mejor época para visitar',
  'Paesi che richiedono il visto':'Países que requieren visado','Da definire':'Por definir','Da verificare su fonte ufficiale':'Consultar fuente oficial',
  'Da verificare su Viaggiare Sicuri':'Consultar Viaggiare Sicuri','Visto richiesto':'Se requiere visado','Online o all’arrivo':'Online o a la llegada',
  'All’arrivo':'A la llegada','UE':'UE','GEN':'ENE','FEB':'FEB','MAR':'MAR','APR':'ABR','MAG':'MAY','GIU':'JUN','LUG':'JUL','AGO':'AGO','SET':'SEP','OTT':'OCT','NOV':'NOV','DIC':'DIC',
  'Europa':'Europa','Africa':'África','Asia':'Asia','America del Nord':'América del Norte','America del Sud':'América del Sur','Oceania':'Oceanía','Caraibi':'Caribe',
  'Confronta':'Comparar','Confronta destinazioni':'Comparar destinos','Selezionati':'Seleccionados','Nessuna destinazione disponibile con i filtri attuali.':'No hay destinos disponibles con los filtros actuales.',
  'Stima editoriale da completare':'Estimación editorial pendiente','Da definire in base all’itinerario':'Por definir según el itinerario',
  'Da completare con contenuti verificati':'Pendiente de contenido verificado','Consulta il periodo migliore indicato e le fonti meteo locali':'Consulta la mejor época indicada y las fuentes meteorológicas locales',
  'Presente nel database, da verificare su fonte ufficiale':'Incluido en la base de datos; verificar con una fuente oficial',
  'Valuta non disponibile nel database':'Moneda no disponible en la base de datos'
 });
 const originals=new WeakMap();
 const attrs=new WeakMap();
 const lang=localStorage.getItem('roam_language')||'it';
 function translateNode(node){
  if(node.nodeType===Node.TEXT_NODE){
   if(!originals.has(node))originals.set(node,node.nodeValue);
   const original=originals.get(node);
   const dict=translations[picker.value]||{};
   let value=dict[original]||original;
   if(picker.value!=='it'&&value===original){
    const keys=Object.keys(dict).sort((a,b)=>b.length-a.length);
    for(const key of keys){if(key&&value.includes(key))value=value.split(key).join(dict[key]);}
   }
   if(picker.value!=='it'){
    value=value.replace(/^(\d+) risultati$/,'$1 results').replace(/^(\d+) resultados$/,'$1 resultados');
    if(picker.value==='es')value=value.replace(/^(\d+) results$/,'$1 resultados');
    if(picker.value==='en')value=value.replace(/^(\d+) selezionati$/,'$1 selected');
    if(picker.value==='es')value=value.replace(/^(\d+) selezionati$/,'$1 seleccionados');
   }
   if(node.nodeValue!==value)node.nodeValue=value;
  }else if(node.nodeType===Node.ELEMENT_NODE){
   for(const name of ['placeholder','title','aria-label']){
    if(node.hasAttribute(name)){
     let map=attrs.get(node);if(!map){map={};attrs.set(node,map)}
     if(!(name in map))map[name]=node.getAttribute(name);
     const original=map[name],value=(translations[picker.value]||{})[original]||original;
     if(node.getAttribute(name)!==value)node.setAttribute(name,value);
    }
   }
   if(node.childNodes)node.childNodes.forEach(translateNode);
  }
 }
 function applyLanguage(value){
  picker.value=value;localStorage.setItem('roam_language',value);
  document.documentElement.lang=value;
  translateNode(document.body);
 }
 picker.addEventListener('change',()=>applyLanguage(picker.value));
 const observer=new MutationObserver(records=>records.forEach(record=>record.addedNodes.forEach(translateNode)));
 observer.observe(document.body,{childList:true,characterData:true,subtree:true});
 applyLanguage(['it','en','es'].includes(lang)?lang:'it');
})();
