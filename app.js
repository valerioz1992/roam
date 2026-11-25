const MONTHS=['GEN','FEB','MAR','APR','MAG','GIU','LUG','AGO','SET','OTT','NOV','DIC'];let countries=[],favorites=new Set(),compare=new Set(),onlyFav=false;try{const saved=JSON.parse(localStorage.getItem('roam_favs')||'[]');if(Array.isArray(saved))favorites=new Set(saved.filter(x=>typeof x==='string'))}catch(e){try{localStorage.removeItem('roam_favs')}catch(_){}favorites=new Set()}
const $=id=>document.getElementById(id), esc=s=>String(s??'—').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const get=(c,k)=>c[k]??'';const monthKeys={GEN:'GEN',FEB:'FEB',MAR:'MAR',APR:'APR',MAG:'MAG',GIU:'GIU',LUG:'LUG',AGO:'AGO',SET:'SET',OTT:'OTT',NOV:'NOV',DIC:'DIC'};
function monthMatch(c,m){return !m||String(c[m]||'').toUpperCase()==='X'}
function isNoVisa(c){return /senza visto|visa.?free|esente/i.test(c['Visto per cittadini italiani']||'')}
function isOnline(c){return /online|evisa|e-visa|e.?visa/i.test(c['Modalità richiesta visto']||'')}
function matchesTripType(country,type){if(!type)return true;const c=countries.find(x=>x.Paese===country);return Array.isArray(c?.['Tipi di viaggio'])&&c['Tipi di viaggio'].includes(type)}
function filtered(){let q=$('q').value.toLowerCase().trim(),m=$('month').value,co=$('continent').value,t=$('tripType').value;let a=countries.filter(c=>{let text=String(c.Paese||'').toLowerCase();return(!q||text.includes(q))&&monthMatch(c,m)&&(!co||c.Continente===co)&&matchesTripType(c.Paese,t)&&(!onlyFav||favorites.has(c.Paese))})
let s=$('sort').value;if(s==='az')a.sort((x,y)=>x.Paese.localeCompare(y.Paese,'it'));if(s==='za')a.sort((x,y)=>y.Paese.localeCompare(x.Paese,'it'));return a}
function displayContinent(name){const lang=document.getElementById('languagePicker')?.value||'it';if(lang==='it')return name;const maps={en:{'Africa':'Africa','Asia':'Asia','Europa':'Europe','Europe':'Europe','Nord America':'North America','America del Nord':'North America','Sud America':'South America','America del Sud':'South America','Oceania':'Oceania'},es:{'Africa':'África','Asia':'Asia','Europa':'Europa','Europe':'Europa','Nord America':'América del Norte','America del Nord':'América del Norte','Sud America':'América del Sur','America del Sud':'América del Sur','Oceania':'Oceanía'}};return maps[lang]?.[name]||name}
function displayVisa(value){const lang=document.getElementById('languagePicker')?.value||'it';if(lang==='it')return value;const map={en:{'Visto richiesto':'Visa required','Senza visto (90 giorni)':'Visa-free (90 days)','Senza visto (30 giorni)':'Visa-free (30 days)','Senza visto':'Visa-free','E-visa richiesto':'e-Visa required','Dato non inserito':'Not provided','Non richiesto per soggiorni turistici nei limiti indicati':'Not required for tourist stays within the stated limits'},es:{'Visto richiesto':'Se requiere visado','Senza visto (90 giorni)':'Sin visado (90 días)','Senza visto (30 giorni)':'Sin visado (30 días)','Senza visto':'Sin visado','E-visa richiesto':'Se requiere e-Visa','Dato non inserito':'No indicado','Non richiesto per soggiorni turistici nei limiti indicati':'No se requiere para estancias turísticas dentro de los límites indicados'}};return map[lang]?.[value]||value}
function displayCountryName(name){const lang=document.getElementById('languagePicker')?.value||'it';if(lang==='it')return name;let code=COUNTRY_CODES[name]||(String(name).toLowerCase()==='oman'?'OM':'');if(!code&&COUNTRY_FLAGS[name]){const chars=[...COUNTRY_FLAGS[name]].map(ch=>ch.codePointAt(0));if(chars.length===2&&chars.every(n=>n>=127462&&n<=127487))code=String.fromCharCode(...chars.map(n=>n-127397));}if(!code)return name;try{return new Intl.DisplayNames([lang==='es'?'es':'en'],{type:'region'}).of(code)||name}catch(e){return name}}
function render(){let arr=filtered();const lang=$('languagePicker')?.value||'it';$('count').textContent=arr.length+(lang==='es'?' resultados':lang==='en'?' results':' risultati');$('favCount').textContent=favorites.size;$('grid').innerHTML=arr.length?arr.map(c=>{let n=esc(c.Paese),shown=esc(displayCountryName(c.Paese)),fav=favorites.has(c.Paese),checked=compare.has(c.Paese);let visa=esc(displayVisa(c['Visto per cittadini italiani']||'Dato non inserito'));return `<article class="country"><div class="country-photo"><img data-country-photo="${n}" alt="${esc(PHOTO_ARTICLES[c.Paese]||c.Paese)} – ${shown}" loading="lazy"></div><div class="countrytop"><div><div class="continent">${esc(displayContinent(c.Continente))}</div><h3><span class="country-flag" aria-hidden="true">${countryFlag(c.Paese)}</span> ${shown}</h3></div><button class="heart ${fav?'on':''}" aria-label="Preferito" data-fav="${n}">${fav?'♥':'♡'}</button></div><div class="meta"><span class="chip">${esc(c['Periodo migliore']||'Periodo non indicato')}</span></div><div class="countryfoot"><span>${visa}</span><label style="display:flex;align-items:center;gap:6px"><input class="comparecheck" type="checkbox" data-compare="${n}" ${checked?'checked':''}> ${lang==='es'?'Comparar':lang==='en'?'Compare':'Confronta'}</label></div><button class="pill" style="margin-top:12px" data-detail="${n}">${lang==='es'?'Ver ficha →':lang==='en'?'Open details →':'Apri scheda →'}</button></article>`}).join(''):'<div class="empty">'+(lang==='es'?'Ningún destino coincide con los filtros.<br>Prueba a modificarlos.':lang==='en'?'No destination matches the filters.<br>Try changing your search.':'Nessuna destinazione corrisponde ai filtri.<br>Prova a modificare la ricerca.')+'</div>';$('compareCount').textContent=compare.size+(lang==='es'?' seleccionados':lang==='en'?' selected':' selezionati');$('comparebar').classList.toggle('show',compare.size>0);observeCountryPhotos()}

function travelKit(c){
 const lang=$('languagePicker')?.value||'it',en=lang==='en',es=lang==='es';
 const official=(c.Lingue||[]).filter(Boolean);
 const region=String(c.Continente||'');
 const englishCommon=/Botswana|Ghana|Kenya|Nigeria|South Africa|Uganda|Zambia|Zimbabwe|India|Pakistan|Philippines|Singapore|Malaysia|Malta|Netherlands|Sweden|Norway|Denmark|Finland|Iceland|Ireland/i.test(c.Paese);
 const frenchCommon=/Senegal|Benin|Burkina Faso|Burundi|Cameroon|Central African Republic|Chad|Comoros|Congo|Democratic Republic of the Congo|Côte d'Ivoire|Djibouti|Gabon|Guinea|Madagascar|Mali|Niger|Rwanda|Togo/i.test(c.Paese);
 const spanishCommon=/Mexico|Guatemala|Belize|Honduras|El Salvador|Nicaragua|Costa Rica|Panama|Cuba|Dominican Republic|Colombia|Venezuela|Ecuador|Peru|Bolivia|Chile|Argentina|Uruguay|Paraguay/i.test(c.Paese);
 let useful=[...official];
 if(englishCommon||region==='Europa'||region==='Europe')useful.push('English (especially in tourist areas)');
 if(frenchCommon)useful.push('French (widely used)');
 if(spanishCommon)useful.push('Spanish (widely used)');
 if(/Morocco|Algeria|Tunisia|Egypt|Jordan|Lebanon|United Arab Emirates|Oman|Saudi Arabia|Qatar/i.test(c.Paese))useful.push('Arabic; English in many tourist and business areas');
 if(/Japan|China|South Korea|Thailand|Vietnam|Cambodia|Laos/i.test(c.Paese))useful.push('English in major tourist areas; local language useful outside them');
 useful=[...new Set(useful)];
 const euEea=/Austria|Belgium|Bulgaria|Croatia|Cyprus|Czechia|Denmark|Estonia|Finland|France|Germany|Greece|Hungary|Iceland|Ireland|Italy|Latvia|Liechtenstein|Lithuania|Luxembourg|Malta|Netherlands|Norway|Poland|Portugal|Romania|Slovakia|Slovenia|Spain|Sweden/i.test(c.Paese);
 const simTitle=en?'SIM, eSIM & connectivity':es?'SIM, eSIM y conexión':'SIM, eSIM e connessione';
 const simBody=euEea?(en?'First check your Italian plan: EU/EEA roaming is generally covered by “roam like at home”, subject to fair-use limits and operator exceptions. A local SIM is usually unnecessary for a short trip.':es?'Comprueba primero tu tarifa italiana: el roaming UE/EEE suele estar incluido, sujeto a límites de uso razonable y excepciones del operador. Para viajes cortos normalmente no necesitas una SIM local.':'Controlla prima la tua offerta italiana: in UE/SEE vale in genere il “roam like at home”, con limiti di uso corretto ed eventuali eccezioni dell’operatore. Per un viaggio breve spesso non serve una SIM locale.'):(en?'For a short trip, a travel eSIM is usually the easiest option if your phone supports it: buy before departure and activate as instructed. For a longer stay, heavy data use or a local phone number, compare prepaid SIM/eSIM offers from local operators; airport kiosks may cost more.':es?'Para un viaje corto, una eSIM de viaje suele ser la opción más cómoda si tu móvil es compatible: cómprala antes y actívala según las instrucciones. Para estancias largas, mucho consumo de datos o un número local, compara SIM/eSIM prepago de operadores locales; los puestos del aeropuerto pueden ser más caros.':'Per un viaggio breve, una eSIM da viaggio è spesso la soluzione più comoda se il telefono è compatibile: acquistala prima e attivala seguendo le istruzioni. Per soggiorni lunghi, molti dati o un numero locale, confronta SIM/eSIM prepagate degli operatori locali; i chioschi in aeroporto possono costare di più.');
 const payBody=en?'Visa and Mastercard are the safest cards to carry together; acceptance can vary, especially outside cities. Keep a small amount of local cash for markets, tips and transport. Withdraw local currency from bank ATMs when possible. At card terminals/ATMs choose the local currency and decline conversion to euros (DCC), which can include a markup. Check your bank’s FX and ATM fees.':es?'Lleva Visa y Mastercard si puedes: la aceptación varía, sobre todo fuera de las ciudades. Guarda algo de efectivo local para mercados, propinas y transporte. Retira moneda local en cajeros bancarios. En los terminales/cajeros elige la moneda local y rechaza la conversión a euros (DCC), que puede incluir un recargo. Comprueba las comisiones de tu banco.':'Porta, se puoi, sia Visa sia Mastercard: l’accettazione può variare, soprattutto fuori dalle città. Tieni una piccola somma in contanti locali per mercati, mance e trasporti. Preleva valuta locale da ATM bancari. Quando il POS o ATM propone euro, scegli la valuta locale e rifiuta la conversione (DCC), che può includere un sovrapprezzo. Controlla le commissioni della tua banca.';
 const apps=en?['Google Maps – maps and offline areas','Google Translate – download the local language offline','Your airline’s app – check-in, boarding pass and flight alerts','Uber / Bolt or the locally dominant taxi app – check availability in this country','XE Currency – quick currency calculations','The official public transport app for the city/region – tickets and live schedules']:es?['Google Maps – mapas y zonas sin conexión','Google Translate – descarga el idioma local','App de tu aerolínea – check-in, tarjeta de embarque y avisos','Uber / Bolt o la app de taxi local – comprueba disponibilidad','XE Currency – conversión rápida','App oficial de transporte público – billetes y horarios']:['Google Maps – mappe e aree offline','Google Traduttore – scarica la lingua locale offline','App della compagnia aerea – check-in, carta d’imbarco e avvisi','Uber / Bolt o app taxi locale – verifica la disponibilità nel Paese','XE Currency – calcolo rapido dei cambi','App ufficiale del trasporto pubblico locale – biglietti e orari'];
 const t=en?['Official languages in the database','Languages useful to visitors (indicative, not a statistical ranking)','Cards, cash & exchange','Useful apps']:es?['Idiomas oficiales en la base de datos','Idiomas útiles para visitantes (orientativo, no es una clasificación estadística)','Tarjetas, efectivo y cambio','Apps útiles']:['Lingue ufficiali (database)','Lingue utili al viaggiatore (indicazione pratica, non classifica statistica)','Carte, contanti e cambio','App utili'];
 const escList=arr=>arr.length?arr.map(esc).join(', '):(en?'Not available in the database':es?'No disponible en la base de datos':'Non presenti nel database');
 return '<section class="travel-kit" style="margin-top:18px;padding:18px;border:1px solid var(--line);border-radius:18px;background:#fff"><div class="eyebrow">ROAM · TRAVEL KIT</div><h3 style="margin:6px 0 14px;font-size:21px">'+simTitle+'</h3><p>'+simBody+'</p><div class="detailbox"><small>'+t[0]+'</small><strong>'+escList(official)+'</strong></div><div class="detailbox" style="margin-top:9px"><small>'+t[1]+'</small><strong>'+escList(useful)+'</strong></div><h4>'+t[2]+'</h4><p>'+payBody+'</p><h4>'+t[3]+'</h4><ul style="padding-left:19px;line-height:1.7">'+apps.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul><small style="color:var(--muted)">'+(en?'Check phone eSIM compatibility, operator coverage and your bank fees before departure. Local transport and taxi apps depend on the city.':es?'Antes de salir, comprueba la compatibilidad eSIM, la cobertura y las comisiones bancarias. Las apps de transporte dependen de la ciudad.':'Prima di partire verifica compatibilità eSIM, copertura e commissioni bancarie. Le app di trasporto e taxi dipendono dalla città.')+'</small></section>';
}
function detail(c){const currencyCode=(c.Valute||[]).map(v=>v.codice).find(Boolean)||'';let fields=[['Continente',c.Continente],['Periodo migliore',c['Periodo migliore']],['Visto per cittadini italiani',c['Visto per cittadini italiani']],['Modalità richiesta visto',c['Modalità richiesta visto']],['Budget giornaliero','Stima editoriale da completare'],['Durata consigliata','Da definire in base all’itinerario'],['Esperienze','Da completare con contenuti verificati'],['Clima','Consulta il periodo migliore indicato e le fonti meteo locali'],['Completezza del dato visto',String(c['Visto per cittadini italiani']||'').trim()?'Presente nel database, da verificare su fonte ufficiale':'Dato non inserito'],['Capitale',c.Capitale],['Lingue', (c.Lingue||[]).join(', ')],['Valuta',(c.Valute||[]).map(v=>v.nome+' ('+v.codice+')').join(', ')],['Fuso orario',(c.Fuso_orario||[]).join(', ')],['Popolazione',c.Popolazione?Number(c.Popolazione).toLocaleString('it-IT'):'Dato non disponibile'],['Superficie',c.Superficie_km2?Number(c.Superficie_km2).toLocaleString('it-IT')+' km²':'Dato non disponibile']];$('detailContent').innerHTML='<div class="detail-photo"><img data-country-photo="'+esc(c.Paese)+'" alt="'+esc(PHOTO_ARTICLES[c.Paese]||c.Paese)+' – immagine rappresentativa di '+esc(c.Paese)+'"></div><div class="detailhead"><div><div class="eyebrow">Scheda destinazione</div><h2>'+esc(c.Paese)+'</h2></div><button class="close" onclick="$(\'detail\').close()">×</button></div><div class="detailgrid">'+fields.map(([k,v])=>'<div class="detailbox"><small>'+esc(k)+'</small><strong>'+esc(v||'Non disponibile')+'</strong></div>').join('')+'</div><section class="rating-panel"><div class="eyebrow">Valutazione ROAM</div><div class="rating-top"><strong>— <span>/ 5</span></strong><span class="rating-status">Valutazione in corso</span></div><p>Il punteggio sarà pubblicato quando i criteri saranno supportati da dati verificabili. Nessuna valutazione inventata.</p><div class="rating-criteria"><span>Attrattività turistica</span><span>Rapporto qualità/prezzo</span><span>Facilità di organizzazione</span><span>Sicurezza</span><span>Accessibilità</span></div><small>La sicurezza sarà valutata separatamente dagli avvisi ufficiali aggiornati.</small></section><section class="currency-panel" data-currency="'+esc(currencyCode)+'"><div class="eyebrow">Cambio valuta</div><h3>Euro ↔ valuta locale</h3><div class="currency-converter"><label for="currencyEuro">Importo in euro (€)</label><input id="currencyEuro" type="number" min="0" step="any" value="100" inputmode="decimal" oninput="convertCurrency(\'eur\')"><label for="currencyLocal">Importo in valuta locale ('+esc(currencyCode)+')</label><input id="currencyLocal" type="number" min="0" step="any" value="" inputmode="decimal" oninput="convertCurrency(\'local\')"></div><div id="currencyResult">'+(currencyCode?'Recupero del tasso di cambio…':'Valuta non disponibile nel database')+'</div><small id="currencySource">Tassi di riferimento · Frankfurter</small></section><section style="margin-top:18px;padding:16px;border:1px solid var(--line);border-radius:15px;background:#fbfcf9"><div class="eyebrow">Prima di partire</div><h3 style="margin:7px 0 10px;font-size:18px">Controlli pratici per '+esc(c.Paese)+'</h3><ul style="padding-left:19px;margin:0;color:var(--muted);font-size:13px;line-height:1.7"><li>Verifica quale documento è accettato e la sua validità residua.</li><li>Controlla requisiti di ingresso, eventuale visto e modalità di richiesta.</li><li>Consulta gli avvisi di sicurezza, la situazione sanitaria e le indicazioni sulla mobilità.</li><li>Annota i contatti dell’Ambasciata o del Consolato italiano.</li></ul><p style="margin:13px 0 0"><a href="https://www.viaggiaresicuri.it/" target="_blank" rel="noopener noreferrer" style="display:inline-block;background:var(--ink);color:white;text-decoration:none;border-radius:30px;padding:10px 14px;font-size:13px;font-weight:700">Apri Viaggiare Sicuri ↗</a> <a href="https://www.viaggiaresicuri.it/approfondimenti-insights/documentidiviaggio" target="_blank" rel="noopener noreferrer" style="display:inline-block;color:var(--teal);font-size:13px;margin:10px 0 0 8px">Documenti di viaggio ↗</a></p></section>'+travelKit(c)+'<p class="note">I dati su periodo e visto riportati sopra provengono dal database ROAM e non sono verificati in tempo reale. La sezione “Prima di partire” è una checklist: consulta le fonti ufficiali per le regole aggiornate e specifiche di '+esc(c.Paese)+'. Il portale Viaggiare Sicuri del Ministero degli Affari Esteri pubblica informazioni su requisiti di ingresso, sicurezza, salute, mobilità e contatti diplomatici.</p>';$('detail').showModal();observeCountryPhotos();if(currencyCode)loadCurrencyRate(currencyCode)}
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
const COUNTRY_FLAGS={'Italia':'🇮🇹','Giappone':'🇯🇵','Egitto':'🇪🇬','Thailandia':'🇹🇭','Francia':'🇫🇷','Spagna':'🇪🇸','USA':'🇺🇸','Australia':'🇦🇺','Nuova Zelanda':'🇳🇿','India':'🇮🇳','Cina':'🇨🇳','Brasile':'🇧🇷','Perù':'🇵🇪','Messico':'🇲🇽','Grecia':'🇬🇷','Turchia':'🇹🇷','Marocco':'🇲🇦','Sud Africa':'🇿🇦','Kenya':'🇰🇪','Tanzania':'🇹🇿','Islanda':'🇮🇸','Norvegia':'🇳🇴','Svizzera':'🇨🇭','Germania':'🇩🇪','Regno Unito':'🇬🇧','Portogallo':'🇵🇹','Paesi Bassi':'🇳🇱','Irlanda':'🇮🇪','Croazia':'🇭🇷','Capo Verde':'🇨🇻','Maldive':'🇲🇻','Indonesia':'🇮🇩','Vietnam':'🇻🇳','Cambogia':'🇰🇭','Nepal':'🇳🇵','Giordania':'🇯🇴','Emirati Arabi Uniti':'🇦🇪','Singapore':'🇸🇬','Corea del Sud':'🇰🇷','Argentina':'🇦🇷','Cile':'🇨🇱','Bolivia':'🇧🇴','Canada':'🇨🇦','Finlandia':'🇫🇮','Austria':'🇦🇹','Polonia':'🇵🇱','Cuba':'🇨🇺','Giamaica':'🇯🇲','Seychelles':'🇸🇨','Mauritius':'🇲🇺','Madagascar':'🇲🇬','Oman':'🇴🇲','Qatar':'🇶🇦','Arabia Saudita':'🇸🇦','Uzbekistan':'🇺🇿','Georgia':'🇬🇪','Armenia':'🇦🇲','Albania':'🇦🇱','Montenegro':'🇲🇪','Romania':'🇷🇴','Bulgaria':'🇧🇬','Serbia':'🇷🇸','Taiwan':'🇹🇼','Filippine':'🇵🇭','Sri Lanka':'🇱🇰','Laos':'🇱🇦','Myanmar':'🇲🇲','Pakistan':'🇵🇰','Ghana':'🇬🇭','Senegal':'🇸🇳','Namibia':'🇳🇦','Botswana':'🇧🇼','Zambia':'🇿🇲','Zimbabwe':'🇿🇼','Uganda':'🇺🇬','Ruanda':'🇷🇼','Etiopia':'🇪🇹','Tunisia':'🇹🇳','Panama':'🇵🇦','Costa Rica':'🇨🇷','Guatemala':'🇬🇹','Ecuador':'🇪🇨','Uruguay':'🇺🇾','Bahamas':'🇧🇸','Figi':'🇫🇯','Polinesia Francese':'🇵🇫'};
const COUNTRY_CODES={
'Algeria':'DZ','Angola':'AO','Benin':'BJ','Burkina Faso':'BF','Burundi':'BI','Camerun':'CM','Ciad':'TD','Comore':'KM','Congo':'CG','Congo Rep. Dem.':'CD',"Costa d'Avorio":'CI','Gibuti':'DJ','Eritrea':'ER','Gabon':'GA','Gambia':'GM','Guinea':'GN','Guinea-Bissau':'GW','Lesotho':'LS','Liberia':'LR','Libia':'LY','Malawi':'MW','Mali':'ML','Mauritania':'MR','Mozambico':'MZ','Niger':'NE','Nigeria':'NG','São Tomé e Príncipe':'ST','Sierra Leone':'SL','Somalia':'SO','Sudan del sud':'SS','Sudan':'SD','Togo':'TG',
'Afghanistan':'AF','Azerbaijan':'AZ','Bahrein':'BH','Bangladesh':'BD','Bhutan':'BT','Brunei':'BN','Corea del Nord':'KP','Iran':'IR','Iraq':'IQ','Israele':'IL','Kazakistan':'KZ','Kuwait':'KW','Kirghizistan':'KG','Libano':'LB','Malesia':'MY','Mongolia':'MN','Palestina':'PS','Siria':'SY','Tagikistan':'TJ','Timor Est':'TL','Turkmenistan':'TM','Yemen':'YE',
'Belize':'BZ','El Salvador':'SV','Haiti':'HT','Honduras':'HN','Nicaragua':'NI','Repubblica Dominicana':'DO','Trinidad e Tobago':'TT','Colombia':'CO','Guyana':'GY','Paraguay':'PY','Suriname':'SR','Venezuela':'VE',
'Andorra':'AD','Belgio':'BE','Bielorussia':'BY','Bosnia-Erzegovina':'BA','Cipro':'CY','Città del Vaticano':'VA','Danimarca':'DK','Estonia':'EE','Kosovo':'XK','Lettonia':'LV','Liechtenstein':'LI','Lituania':'LT','Lussemburgo':'LU','Macedonia del Nord':'MK','Malta':'MT','Moldavia':'MD','Principato di Monaco':'MC','Russia':'RU','San Marino':'SM','Slovacchia':'SK','Slovenia':'SI','Svezia':'SE','Ucraina':'UA','Ungheria':'HU',
'Kiribati':'KI','Isole Marshall':'MH','Micronesia':'FM','Palau':'PW','Papua Nuova Guinea':'PG','Samoa':'WS','Isole Salomone':'SB','Tonga':'TO','Vanuatu':'VU','Myanmar':'MM'
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
['q','month','continent','tripType','sort'].forEach(id=>$(id).addEventListener(id==='q'?'input':'change',render));$('grid').addEventListener('click',e=>{let f=e.target.closest('[data-fav]'),d=e.target.closest('[data-detail]');if(f)updateFav(f.dataset.fav);if(d){let c=countries.find(x=>x.Paese===d.dataset.detail);if(c)detail(c)}});$('grid').addEventListener('change',e=>{let c=e.target.closest('[data-compare]');if(c){if(c.checked){if(compare.size>=3){c.checked=false;alert('Puoi confrontare al massimo 3 Paesi.');return}compare.add(c.dataset.compare)}else compare.delete(c.dataset.compare);render()}});
$('favNav').onclick=()=>{onlyFav=!onlyFav;$('favBtn').classList.toggle('active',onlyFav);$('allBtn').classList.toggle('active',!onlyFav);render();window.scrollTo({top:document.querySelector('.filters').offsetTop-20,behavior:'smooth'})};$('favBtn').onclick=()=>{onlyFav=!onlyFav;$('favBtn').classList.toggle('active',onlyFav);$('allBtn').classList.toggle('active',!onlyFav);render()};$('allBtn').onclick=()=>{onlyFav=false;$('favBtn').classList.remove('active');$('allBtn').classList.add('active');render()};$('reset').onclick=()=>{$('q').value='';['month','continent','tripType'].forEach(id=>$(id).value='');onlyFav=false;$('favBtn').classList.remove('active');$('allBtn').classList.add('active');render()};$('clearCompare').onclick=()=>{compare.clear();render()};$('compareBtn').onclick=()=>{let chosen=countries.filter(c=>compare.has(c.Paese));let fields=['Continente','Periodo migliore','Visto per cittadini italiani','Modalità richiesta visto',...MONTHS];$('compareContent').innerHTML=`<div class="detailhead"><div><div class="eyebrow">ROAM</div><h2>Confronta destinazioni</h2></div><button class="close" onclick="$('compareDialog').close()">×</button></div><div style="overflow:auto"><table class="comparetable"><thead><tr><th>Caratteristica</th>${chosen.map(c=>`<th>${esc(c.Paese)}</th>`).join('')}</tr></thead><tbody>${fields.map(k=>`<tr><td>${esc(k)}</td>${chosen.map(c=>`<td>${esc(c[k]??'Non disponibile')}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;$('compareDialog').showModal()};

// ROAM transport estimator: geocoding + road routing, with clearly labelled heuristic fare ranges.
const routeFrom=$('routeFrom'),routeTo=$('routeTo'),routeMode=$('routeMode'),routeError=$('routeError'),routeResults=$('routeResults');
const money=n=>'€'+Math.round(n).toLocaleString('it-IT');
async function geocodePlace(q){const r=await fetch('https://geocoding-api.open-meteo.com/v1/search?name='+encodeURIComponent(q)+'&count=1&language=it&format=json');if(!r.ok)throw new Error('Servizio di ricerca località non disponibile.');const d=await r.json();if(!d.results?.length)throw new Error('Non trovo una località per “'+q+'”. Prova con città e Paese.');return d.results[0]}
function wgs84ToGcj02(lon,lat){const a=6378245.0,ee=0.00669342162296594323;if(lon<72.004||lon>137.8347||lat<0.8293||lat>55.8271)return [lon,lat];let dLat=transformLat(lon-105,lat-35),dLon=transformLon(lon-105,lat-35);const rad=lat/180*Math.PI,magic=Math.sin(rad);const magic2=1-ee*magic*magic,sqrt=Math.sqrt(magic2);dLat=dLat*180/((a*(1-ee))/(magic2*sqrt)*Math.PI);dLon=dLon*180/(a/sqrt*Math.cos(rad)*Math.PI);return [lon+dLon,lat+dLat]}
function transformLat(x,y){let r=-100+2*x+3*y+0.2*y*y+0.1*x*y+0.2*Math.sqrt(Math.abs(x));r+=(20*Math.sin(6*x*Math.PI)+20*Math.sin(2*x*Math.PI))*2/3;r+=(20*Math.sin(y*Math.PI)+40*Math.sin(y/3*Math.PI))*2/3;r+=(160*Math.sin(y/12*Math.PI)+320*Math.sin(y*Math.PI/30))*2/3;return r}
function transformLon(x,y){let r=300+x+2*y+0.1*x*x+0.1*x*y+0.1*Math.sqrt(Math.abs(x));r+=(20*Math.sin(6*x*Math.PI)+20*Math.sin(2*x*Math.PI))*2/3;r+=(20*Math.sin(x*Math.PI)+40*Math.sin(x/3*Math.PI))*2/3;r+=(150*Math.sin(x/12*Math.PI)+300*Math.sin(x/30*Math.PI))*2/3;return r}
function amapNavigationUrl(from,to){const [flon,flat]=wgs84ToGcj02(from.longitude,from.latitude),[tlon,tlat]=wgs84ToGcj02(to.longitude,to.latitude);const f=flon+','+flat+','+encodeURIComponent(from.name||'Partenza'),t=tlon+','+tlat+','+encodeURIComponent(to.name||'Destinazione');return 'https://uri.amap.com/navigation?from='+f+'&to='+t+'&mode=car&coordinate=gaode&callnative=1'}
function haversine(a,b){const rad=x=>x*Math.PI/180,R=6371,dLat=rad(b.latitude-a.latitude),dLon=rad(b.longitude-a.longitude),v=Math.sin(dLat/2)**2+Math.cos(rad(a.latitude))*Math.cos(rad(b.latitude))*Math.sin(dLon/2)**2;return 2*R*Math.asin(Math.sqrt(v))}
function makeRouteCard(name,icon,min,max,duration,detail,tag,link){return '<article class="route-result '+(tag?'best':'')+'"><div class="route-result-head"><h3>'+icon+' '+name+'</h3>'+(tag?'<span class="rating-status">'+tag+'</span>':'')+'</div><div class="route-price">'+money(min)+' – '+money(max)+'</div><p>Prezzo indicativo per persona · sola andata</p><p><strong>Tempo orientativo:</strong> '+duration+'</p><p>'+detail+'</p><a href="'+link+'" target="_blank" rel="noopener noreferrer">Verifica tratte e tariffe ↗</a></article>'}
async function openRouteSearch(){const from=routeFrom.value.trim(),to=routeTo.value.trim();routeError.textContent='';routeResults.innerHTML='';if(!from||!to){routeError.textContent='Inserisci sia il luogo di partenza sia la destinazione.';(!from?routeFrom:routeTo).focus();return}const button=$('routeSearch');button.disabled=true;button.textContent='Calcolo in corso…';try{const [a,b]=await Promise.all([geocodePlace(from),geocodePlace(to)]);const kmAir=haversine(a,b);if(kmAir<1)throw new Error('Partenza e destinazione sembrano coincidere.');const chinaRoute=a.country_code==='CN'&&b.country_code==='CN';const chinaDestination=b.country_code==='CN';const map=chinaRoute?amapNavigationUrl(a,b):chinaDestination?'https://www.amap.com/search?query='+encodeURIComponent(to):'https://www.google.com/maps/dir/?api=1&origin='+encodeURIComponent(from)+'&destination='+encodeURIComponent(to);const rr='https://www.rome2rio.com/map/'+encodeURIComponent(from)+'/'+encodeURIComponent(to);let kmRoad=kmAir*1.25,driveHours=kmRoad/85;try{const r=await fetch('https://router.project-osrm.org/route/v1/driving/'+a.longitude+','+a.latitude+';'+b.longitude+','+b.latitude+'?overview=false');if(r.ok&&!chinaRoute){const d=await r.json();if(d.routes?.[0]){kmRoad=d.routes[0].distance/1000;driveHours=d.routes[0].duration/3600}}}catch(e){}const mode=routeMode.value,cards=[];if(mode==='all'||mode==='car'){const fuel=kmRoad*0.065*1.85;cards.push(makeRouteCard('Auto','🚗',fuel+kmRoad*.04,fuel+kmRoad*.12,(driveHours*1.15).toFixed(1).replace('.',',')+'–'+(driveHours*1.4).toFixed(1).replace('.',',')+' h','Carburante stimato con consumo 6,5 l/100 km e carburante a 1,85 €/l; pedaggi e parcheggi esclusi.',false,map))}if(mode==='all'||mode==='bus'){const lo=Math.max(8,kmRoad*.045),hi=Math.max(18,kmRoad*.095);cards.push(makeRouteCard('Autobus','🚌',lo,hi,Math.ceil(kmRoad/65*10)/10+'–'+Math.ceil(kmRoad/50*10)/10+' h','Fascia modellata sulla distanza: non conferma che esista una corsa diretta.',false,rr))}if(mode==='all'||mode==='train'){const lo=Math.max(12,kmRoad*.07),hi=Math.max(25,kmRoad*.17);cards.push(makeRouteCard('Treno','🚆',lo,hi,Math.ceil(kmRoad/100*10)/10+'–'+Math.ceil(kmRoad/65*10)/10+' h','Stima generica: dipende da rete ferroviaria, cambi, anticipo e classe.',false,rr))}if(mode==='all'||mode==='plane'){const lo=Math.max(35,70+kmAir*.045),hi=Math.max(90,170+kmAir*.12);cards.push(makeRouteCard('Aereo','✈️',lo,hi,(kmAir/750+2.5).toFixed(1).replace('.',',')+'–'+(kmAir/600+3.5).toFixed(1).replace('.',',')+' h','Include un margine convenzionale per aeroporto; bagagli, transfer e disponibilità non verificati.',false,rr))}routeResults.innerHTML=cards.join('')+'<p class="route-disclaimer">Stime automatiche sperimentali basate su distanza e coefficienti medi, non su inventario di operatori. Non attestano l’esistenza di un collegamento, né includono necessariamente cambi, supplementi, pedaggi o stagionalità. Per prezzi e orari effettivi apri Rome2Rio o il servizio cartografico indicato nel collegamento. Distanza stradale da OpenStreetMap/OSRM quando disponibile; località da Open-Meteo Geocoding.</p>'}catch(error){routeError.textContent=error.message||'Non riesco a calcolare il percorso. Riprova o controlla i nomi delle località.'}finally{button.disabled=false;button.innerHTML='Calcola alternative <span>→</span>'}}
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
const isSmartphone=()=>/Android.*Mobile|iPhone|iPod|Windows Phone|Mobile/i.test(navigator.userAgent)&&!/iPad/i;
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
const installNav=document.getElementById('installNav');
if(isStandalone()||!isSmartphone()){if(installNav)installNav.hidden=true;}
else{if(installNav)installNav.hidden=false;window.addEventListener('load',()=>setTimeout(openInstallDialog,250));}


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
 'Le fasce sono stime orientative, non tariffe disponibili.':'Price ranges are estimates, not available fares.','Filtri di ricerca':'Search filters','Cerca destinazione':'Search destination','Es. Giappone':'E.g. Japan','Mese':'Month','Tutti i mesi':'All months','Continente':'Continent','Tutti':'All','Tipo di viaggio':'Trip type','Tutti i tipi':'All types','Mare':'Beach','Natura':'Nature','Safari':'Safari','Cultura e storia':'Culture and history','Avventura':'Adventure','Montagna':'Mountains','Città e vita urbana':'Cities and urban life','On the road':'Road trip','Relax':'Relax',
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
 'Le fasce sono stime orientative, non tariffe disponibili.':'Los rangos son estimaciones, no tarifas disponibles.','Filtri di ricerca':'Filtros de búsqueda','Cerca destinazione':'Buscar destino','Es. Giappone':'Ej. Japón','Mese':'Mes','Tutti i mesi':'Todos los meses','Continente':'Continente','Tutti':'Todos','Tipo di viaggio':'Tipo de viaje','Tutti i tipi':'Todos los tipos','Mare':'Playa','Natura':'Naturaleza','Safari':'Safari','Cultura e storia':'Cultura e historia','Avventura':'Aventura','Montagna':'Montaña','Città e vita urbana':'Ciudades y vida urbana','On the road':'Por carretera','Relax':'Relax',
 'Tutti i Paesi':'Todos los países','↗ Condividi ROAM':'↗ Compartir ROAM','♡ Solo preferiti':'♡ Solo favoritos','✦ Sorprendimi':'✦ Sorpréndeme','Ordina':'Ordenar','Esplora le destinazioni':'Explora los destinos','Caricamento destinazioni…':'Cargando destinos…',
 'Porta ROAM con te':'Lleva ROAM contigo','Installa l’app sul telefono per ritrovare le tue destinazioni e pianificare i prossimi viaggi in modo rapido.':'Instala la app en tu móvil para acceder a tus destinos y planificar tus próximos viajes rápidamente.','Installa ROAM':'Instalar ROAM','Continua sul sito':'Continuar en el sitio','Confronta':'Comparar','selezionati':'seleccionados','Scheda destinazione':'Ficha del destino','Prima di partire':'Antes de viajar','Controlli pratici per':'Comprobaciones prácticas para','Apri Viaggiare Sicuri ↗':'Abrir Viaggiare Sicuri ↗','Documenti di viaggio ↗':'Documentos de viaje ↗','Valutazione ROAM':'Valoración ROAM','Valutazione in corso':'Valoración en curso','Cambio valuta':'Cambio de divisa','Euro ↔ valuta locale':'Euro ↔ moneda local','Non disponibile':'No disponible','Dato non disponibile':'Dato no disponible','Dato non inserito':'No introducido','Periodo non indicato':'Temporada no indicada','Confronta destinazioni':'Comparar destinos','Prezzo indicativo per persona · sola andata':'Precio orientativo por persona · solo ida','Tempo orientativo:':'Tiempo estimado:','Verifica tratte e tariffe ↗':'Consultar rutas y tarifas ↗',
 'Nessuna destinazione corrisponde ai filtri.':'Ningún destino coincide con los filtros.','Prova a modificare la ricerca.':'Prueba a cambiar la búsqueda.','Apri scheda →':'Abrir ficha →','Preferito':'Favorito','Paese':'País','Periodo migliore':'Mejor época','Visto per cittadini italiani':'Visado para ciudadanos italianos','Modalità richiesta visto':'Método de solicitud del visado','Budget giornaliero':'Presupuesto diario','Durata consigliata':'Duración recomendada','Esperienze':'Experiencias','Clima':'Clima','Completezza del dato visto':'Completitud de los datos de visado','Capitale':'Capital','Lingue':'Idiomas','Valuta':'Moneda','Fuso orario':'Zona horaria','Popolazione':'Población','Superficie':'Superficie',
 'Verifica quale documento è accettato e la sua validità residua.':'Comprueba qué documento se acepta y su vigencia restante.','Controlla requisiti di ingresso, eventuale visto e modalità di richiesta.':'Consulta los requisitos de entrada, el visado y cómo solicitarlo.','Consulta gli avvisi di sicurezza, la situazione sanitaria e le indicazioni sulla mobilità.':'Consulta las alertas de seguridad, la situación sanitaria y las indicaciones de movilidad.','Annota i contatti dell’Ambasciata o del Consolato italiano.':'Guarda los contactos de la Embajada o el Consulado italiano.','Nessuna valutazione inventata.':'Sin valoraciones inventadas.','Recupero del tasso di cambio…':'Obteniendo el tipo de cambio…','Cambio temporaneamente non disponibile. Riprova più tardi.':'Cambio temporalmente no disponible. Inténtalo más tarde.','Calcolo in corso…':'Calculando…','Inserisci sia il luogo di partenza sia la destinazione.':'Introduce el origen y el destino.','Prova con città e Paese.':'Prueba con una ciudad y un país.','Partenza e destinazione sembrano coincidere.':'El origen y el destino parecen coincidir.'
 }};
 Object.assign(translations.en,{
  'Importo in euro (€)':'Amount in euros (€)','Importo in valuta locale':'Amount in local currency','Tasso indicativo, non include commissioni':'Indicative rate; fees not included',
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
  'Importo in euro (€)':'Importe en euros (€)','Importo in valuta locale':'Importe en moneda local','Tasso indicativo, non include commissioni':'Tipo indicativo; no incluye comisiones',
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
 Object.assign(translations.en,{'Dove posso andare con il mio budget?':'Where can I go with my budget?','Costruiamo il tuo viaggio':'Let’s build your trip','Budget massimo totale (€)':'Maximum total budget (€)','Giorni di viaggio':'Trip duration (days)','Quando vuoi partire?':'When would you like to go?','Qualsiasi mese':'Any month','Aeroporto / città di partenza':'Departure city / airport','Trova le destinazioni →':'Find destinations →','Una stima, non una promessa.':'An estimate, not a promise.','Destinazioni compatibili':'Destinations that may fit','Stima totale':'Estimated total','Salva nei preferiti':'Save to favourites','Torna a esplora':'Back to explore','Stime per persona, utili per orientarti: non sono prezzi di voli o alloggi disponibili.':'Per-person estimates to help you plan; these are not live flight or accommodation prices.','Nessuna destinazione rientra nella stima per questi parametri.':'No destination fits the estimate with these settings.','Modifica budget, durata o mese e riprova.':'Try changing your budget, duration or month.','Volo stimato':'Estimated flight','Spese giornaliere':'Daily expenses','Visto':'Visa'});
Object.assign(translations.es,{'Dove posso andare con il mio budget?':'¿Adónde puedo ir con mi presupuesto?','Costruiamo il tuo viaggio':'Construyamos tu viaje','Budget massimo totale (€)':'Presupuesto total máximo (€)','Giorni di viaggio':'Días de viaje','Quando vuoi partire?':'¿Cuándo quieres viajar?','Qualsiasi mese':'Cualquier mes','Aeroporto / città di partenza':'Ciudad / aeropuerto de salida','Trova le destinazioni →':'Buscar destinos →','Una stima, non una promessa.':'Una estimación, no una promesa.','Destinazioni compatibili':'Destinos que podrían encajar','Stima totale':'Coste estimado','Salva nei preferiti':'Guardar en favoritos','Torna a esplora':'Volver a explorar','Stime per persona, utili per orientarti: non sono prezzi di voli o alloggi disponibili.':'Estimaciones por persona para orientarte; no son precios reales de vuelos ni alojamientos.','Nessuna destinazione rientra nella stima per questi parametri.':'Ningún destino encaja con estos parámetros.','Modifica budget, durata o mese e riprova.':'Cambia el presupuesto, la duración o el mes e inténtalo de nuevo.','Volo stimato':'Vuelo estimado','Spese giornaliere':'Gastos diarios','Visto':'Visado'});
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
  document.querySelectorAll('.language-flag').forEach(button=>button.classList.toggle('active',button.dataset.language===value));
  translateNode(document.body);
  if(typeof render==='function'&&countries.length)render();
 }
 picker.addEventListener('change',()=>applyLanguage(picker.value));
 window.roamSetLanguage=applyLanguage;
 const observer=new MutationObserver(records=>records.forEach(record=>record.addedNodes.forEach(translateNode)));
 observer.observe(document.body,{childList:true,characterData:true,subtree:true});
 applyLanguage(['it','en','es'].includes(lang)?lang:'it');
})();


/* ROAM navigation: isolated, defensive handlers */
(()=>{
 const byId=id=>document.getElementById(id);
 const trigger=byId('menuTrigger'),drawer=byId('menuDrawer'),backdrop=byId('menuBackdrop');
 const showHome=()=>{
  byId('routePage')?.classList.remove('active');
  byId('diyPage')?.classList.remove('active');
  byId('budgetPage')?.classList.remove('active');
  byId('bucketPage')?.classList.remove('active');
  const home=byId('homeMain');
  if(home)home.hidden=false;
  window.scrollTo({top:0,behavior:'smooth'});
 };
 if(trigger&&drawer&&backdrop){
  const close=()=>{drawer.classList.remove('open');backdrop.classList.remove('open');drawer.setAttribute('aria-hidden','true');trigger.setAttribute('aria-expanded','false');document.body.style.overflow=''};
  const open=()=>{drawer.classList.add('open');backdrop.classList.add('open');drawer.setAttribute('aria-hidden','false');trigger.setAttribute('aria-expanded','true');document.body.style.overflow='hidden'};
  trigger.addEventListener('click',e=>{e.preventDefault();drawer.classList.contains('open')?close():open()});
  byId('menuClose')?.addEventListener('click',close);
  backdrop.addEventListener('click',close);
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
  byId('menuExplore')?.addEventListener('click',()=>{close();showHome()});
  byId('menuFavorites')?.addEventListener('click',()=>{close();showHome();byId('favBtn')?.click();byId('favNav')?.scrollIntoView({behavior:'smooth',block:'center'})});
  byId('menuRoute')?.addEventListener('click',()=>{close();const home=byId('homeMain'),page=byId('routePage');if(home&&page){byId('diyPage')?.classList.remove('active');home.hidden=true;page.classList.add('active');window.scrollTo({top:0,behavior:'smooth'})}});
  byId('routeBack')?.addEventListener('click',showHome);
  byId('openDiy')?.addEventListener('click',()=>{close();const home=byId('homeMain'),page=byId('diyPage');if(home&&page){byId('routePage')?.classList.remove('active');home.hidden=true;page.classList.add('active');window.scrollTo({top:0,behavior:'smooth'})}});
  byId('diyBack')?.addEventListener('click',showHome);
  byId('openBudget')?.addEventListener('click',()=>{close();const home=byId('homeMain'),page=byId('budgetPage');if(home&&page){byId('routePage')?.classList.remove('active');byId('diyPage')?.classList.remove('active');home.hidden=true;page.classList.add('active');window.scrollTo({top:0,behavior:'smooth'})}});
  byId('budgetBack')?.addEventListener('click',showHome);
  byId('openBucket')?.addEventListener('click',()=>{close();const home=byId('homeMain'),page=byId('bucketPage');if(home&&page){byId('routePage')?.classList.remove('active');byId('diyPage')?.classList.remove('active');byId('budgetPage')?.classList.remove('active');home.hidden=true;page.classList.add('active');window.scrollTo({top:0,behavior:'smooth'});if(window.roamRenderBucket)window.roamRenderBucket();setTimeout(()=>{window.roamBucketMap?.invalidateSize();window.roamFitBucketMap?.()},180)}});
  byId('bucketBack')?.addEventListener('click',showHome);
 }
 const form=byId('diyForm'),result=byId('diyResult'),legsBox=byId('diyLegs');
 if(form&&result&&legsBox){
  const storeKey='roam_diy_itinerary_v1';
  const safe=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const modes=[['plane','✈️ Volo'],['train','🚆 Treno'],['bus','🚌 Autobus'],['car','🚗 Auto'],['ferry','⛴️ Traghetto'],['other','＋ Altro']];
  let legs=[{mode:'plane',to:'',date:'',notes:''}];
  const load=()=>{try{const d=JSON.parse(localStorage.getItem(storeKey)||'null');if(d){if(d.origin)byId('diyOrigin').value=d.origin;if(d.startDate)byId('diyStartDate').value=d.startDate;if(Array.isArray(d.legs)&&d.legs.length)legs=d.legs.map(x=>({mode:modes.some(m=>m[0]===x.mode)?x.mode:'plane',to:x.to||'',date:x.date||'',notes:x.notes||''}));if(d.duration)byId('diyDuration').value=d.duration;if(d.budget)byId('diyBudget').value=d.budget;if(d.style)byId('diyStyle').value=d.style;if(d.company)byId('diyCompany').value=d.company;if(d.notes)byId('diyNotes').value=d.notes;}}catch(e){}};
  const save=()=>{try{localStorage.setItem(storeKey,JSON.stringify({origin:byId('diyOrigin').value,startDate:byId('diyStartDate').value,legs,duration:byId('diyDuration').value,budget:byId('diyBudget').value,style:byId('diyStyle').value,company:byId('diyCompany').value,notes:byId('diyNotes').value}))}catch(e){}};
  const render=()=>{let from=byId('diyOrigin').value.trim();legsBox.innerHTML=legs.map((leg,i)=>{const origin=from||'Inserisci il punto di partenza';const options=modes.map(([v,label])=>'<option value="'+v+'" '+(leg.mode===v?'selected':'')+'>'+label+'</option>').join('');const card='<article class="diy-leg" data-leg="'+i+'"><div class="diy-leg-top"><span class="diy-leg-title">TRATTA '+(i+1)+' · '+(modes.find(m=>m[0]===leg.mode)?.[1]||'Spostamento')+'</span>'+(legs.length>1?'<button type="button" class="diy-leg-remove" data-remove-leg="'+i+'">Rimuovi</button>':'')+'</div><div class="diy-leg-fields"><div class="field"><label>Partenza</label><div class="diy-leg-origin" data-origin-for="'+(i+1)+'">'+safe(origin)+'</div></div><div class="field"><label for="diyLegTo'+i+'">Arrivo</label><input id="diyLegTo'+i+'" data-leg-field="to" data-index="'+i+'" placeholder="Es. Tokyo, Bangkok…" value="'+safe(leg.to)+'" required></div><div class="field"><label for="diyLegMode'+i+'">Mezzo di trasporto</label><select id="diyLegMode'+i+'" data-leg-field="mode" data-index="'+i+'">'+options+'</select></div><div class="field"><label for="diyLegDate'+i+'">Data della tratta (facoltativa)</label><input id="diyLegDate'+i+'" type="date" data-leg-field="date" data-index="'+i+'" value="'+safe(leg.date)+'"></div><div class="field diy-leg-wide"><label for="diyLegNotes'+i+'">Nota (facoltativa)</label><input id="diyLegNotes'+i+'" data-leg-field="notes" data-index="'+i+'" placeholder="Es. volo diretto, scalo, pernottamento…" value="'+safe(leg.notes)+'"></div></div></article>';from=leg.to.trim()||origin;return card}).join('');byId('diyLegCount').textContent=legs.length+(legs.length===1?' tratta':' tratte')};
  load();render();
  byId('diyAddLeg')?.addEventListener('click',()=>{const last=legs[legs.length-1];if(!last.to.trim()){byId('diyLegTo'+(legs.length-1))?.focus();return}legs.push({mode:'plane',to:'',date:'',notes:''});render();save();byId('diyLegTo'+(legs.length-1))?.focus()});
  legsBox.addEventListener('input',e=>{const el=e.target;if(!el.matches('[data-leg-field]'))return;const i=Number(el.dataset.index),key=el.dataset.legField;if(legs[i]){legs[i][key]=el.value;if(key==='to'){const next=legsBox.querySelector('[data-origin-for="'+(i+1)+'"]');if(next)next.textContent=el.value.trim()||'Inserisci il punto di partenza'}save()}});
  legsBox.addEventListener('change',e=>{const el=e.target;if(!el.matches('[data-leg-field]'))return;const i=Number(el.dataset.index),key=el.dataset.legField;if(legs[i]){legs[i][key]=el.value;if(key==='mode')render();save()}});
  legsBox.addEventListener('click',e=>{const btn=e.target.closest('[data-remove-leg]');if(!btn)return;legs.splice(Number(btn.dataset.removeLeg),1);if(!legs.length)legs=[{mode:'plane',to:'',date:'',notes:''}];render();save()});
  byId('diyOrigin')?.addEventListener('input',()=>{render();save()});
  form.querySelectorAll('input,select').forEach(el=>el.addEventListener('change',save));
  form.addEventListener('submit',event=>{event.preventDefault();const origin=byId('diyOrigin').value.trim();if(!origin){byId('diyOrigin').focus();return}const missing=legs.findIndex(l=>!l.to.trim());if(missing>=0){byId('diyLegTo'+missing)?.focus();return}save();let from=origin;const rows=legs.map((l,i)=>{const mode=modes.find(m=>m[0]===l.mode)?.[1]||'Spostamento',line='<div class="diy-summary-leg"><strong>'+safe(from)+' → '+safe(l.to)+'</strong><p>'+safe(mode)+(l.date?' · '+safe(l.date):'')+(l.notes?' · '+safe(l.notes):'')+'</p></div>';from=l.to;return line}).join('');result.innerHTML='<h3>Il tuo itinerario prende forma ✨</h3><p><strong>'+safe(origin)+(byId('diyStartDate').value?' · '+safe(byId('diyStartDate').value):'')+'</strong></p>'+rows+'<p>'+safe(byId('diyDuration').value)+' · '+safe(byId('diyBudget').value)+'</p><p>'+safe(byId('diyStyle').value)+' · '+safe(byId('diyCompany').value)+'</p>'+(byId('diyNotes').value.trim()?'<p><strong>Da ricordare:</strong> '+safe(byId('diyNotes').value)+'</p>':'')+'<p class="diy-help">Itinerario salvato su questo dispositivo. Puoi tornare a modificarlo quando vuoi.</p>';result.classList.add('show')});
 }
})();
/* ROAM budget discovery: transparent regional estimates */
(()=>{
 const form=$('budgetForm'),out=$('budgetResults');if(!form||!out)return;
 const low=new Set(['Albania','Bosnia and Herzegovina','Bulgaria','Cambodia','Laos','Vietnam','Nepal','India','Indonesia','Thailand','Morocco','Tunisia','Egypt','Georgia','Armenia','Serbia','North Macedonia','Montenegro','Moldova','Uzbekistan','Kyrgyzstan','Sri Lanka','Philippines','Bolivia','Guatemala','Nicaragua','Honduras','El Salvador','Paraguay']);
 const high=new Set(['Switzerland','Norway','Iceland','Denmark','Sweden','Finland','Luxembourg','Monaco','Singapore','Japan','South Korea','Australia','New Zealand','United States','Canada','United Kingdom','Ireland','France','Netherlands','Belgium','Austria','Germany']);
 const daily=c=>low.has(c.Paese)?38:high.has(c.Paese)?105:65;
 const flight=c=>{const a=String(c.Continente||'').toLowerCase();if(/europa|europe/.test(a))return 180;if(/africa/.test(a))return 330;if(/asia/.test(a))return 520;if(/oceania/.test(a))return 900;if(/sud|south/.test(a))return 720;if(/nord|north|america/.test(a))return 650;return 500};
 const last=localStorage.getItem('roam_budget_params');if(last){try{const p=JSON.parse(last);if(p.amount)$('budgetAmount').value=p.amount;if(p.days)$('budgetDays').value=p.days;if(p.month)$('budgetMonth').value=p.month;if(p.origin)$('budgetOrigin').value=p.origin}catch(e){}}
 form.addEventListener('submit',e=>{e.preventDefault();const amount=Math.max(200,Number($('budgetAmount').value)||0),days=Math.max(2,Number($('budgetDays').value)||7),month=$('budgetMonth').value,origin=$('budgetOrigin').value.trim();localStorage.setItem('roam_budget_params',JSON.stringify({amount,days,month,origin}));
 const pool=countries.filter(c=>!month||monthMatch(c,month)).map(c=>{const f=flight(c),d=daily(c),total=Math.round((f+d*days)*1.1);return{c,f,d,total}}).filter(x=>x.total<=amount).sort((a,b)=>a.total-b.total).slice(0,12);
 const lang=$('languagePicker')?.value||'it',en=lang==='en',es=lang==='es',tr=(it,eng,esp)=>en?eng:es?esp:it;
 if(!pool.length){out.innerHTML='<div class="budget-empty"><strong>'+tr('Nessuna destinazione rientra nella stima per questi parametri.','No destination fits the estimate with these settings.','Ningún destino encaja con estos parámetros.')+'</strong><br>'+tr('Modifica budget, durata o mese e riprova.','Try changing your budget, duration or month.','Cambia el presupuesto, la duración o el mes e inténtalo de nuevo.')+'</div>';return}
 out.innerHTML='<h3>'+tr('Destinazioni compatibili','Destinations that may fit','Destinos que podrían encajar')+' · '+pool.length+'</h3>'+pool.map(({c,f,d,total})=>{const name=esc(c.Paese),saved=favorites.has(c.Paese),visa=esc(displayVisa(c['Visto per cittadini italiani']||'Dato non inserito'));return '<article class="budget-card"><div><h3>'+esc(countryFlag(c.Paese))+' '+esc(displayCountryName(c.Paese))+'</h3><p>'+esc(displayContinent(c.Continente))+' · '+esc(c['Periodo migliore']||'Periodo da verificare')+'</p><p>'+tr('Volo stimato','Estimated flight','Vuelo estimado')+': '+f+' € · '+tr('Spese giornaliere','Daily expenses','Gastos diarios')+': '+d+' €</p><p>'+tr('Visto','Visa','Visado')+': '+visa+'</p><p class="budget-disclaimer">'+tr('Stima indicativa: non è una tariffa verificata e può variare molto in base a stagione e prenotazione.','Indicative estimate, not a verified fare; actual costs vary by season and booking.','Estimación orientativa, no es una tarifa verificada; los costes reales varían según temporada y reserva.')+'</p></div><div style="text-align:right"><div class="budget-total">'+total.toLocaleString(lang==='it'?'it-IT':lang==='es'?'es-ES':'en-US')+' €</div><p>'+tr('Stima totale','Estimated total','Coste estimado')+'</p><button type="button" class="budget-save" data-budget-fav="'+name+'">'+(saved?'♥':tr('Salva nei preferiti','Save to favourites','Guardar en favoritos'))+'</button></div></article>'}).join('');
 out.querySelectorAll('[data-budget-fav]').forEach(btn=>btn.addEventListener('click',()=>{const name=btn.dataset.budgetFav;if(favorites.has(name))favorites.delete(name);else favorites.add(name);localStorage.setItem('roam_favs',JSON.stringify([...favorites]));$('favCount').textContent=favorites.size;btn.textContent=favorites.has(name)?'♥':tr('Salva nei preferiti','Save to favourites','Guardar en favoritos')}));
 });
})();

/* ROAM Bucket List: device-local visited and wishlist collections */
(()=>{
 const read=(key)=>{try{const a=JSON.parse(localStorage.getItem(key)||'[]');return new Set(Array.isArray(a)?a.filter(x=>typeof x==='string'):[])}catch(e){return new Set()}};
 let visited=read('roam_bucket_visited'),wish=read('roam_bucket_wish'),mapLayer=null,geoFeatures=null,mapStarted=false;
 const save=()=>{localStorage.setItem('roam_bucket_visited',JSON.stringify([...visited]));localStorage.setItem('roam_bucket_wish',JSON.stringify([...wish]))};
 const iso=name=>{if(COUNTRY_CODES[name])return COUNTRY_CODES[name];const flag=COUNTRY_FLAGS[name];if(flag){const chars=[...flag].map(ch=>ch.codePointAt(0));if(chars.length===2&&chars.every(n=>n>=127462&&n<=127487))return String.fromCharCode(...chars.map(n=>n-127397));}return ''};
 const codeNames=new Map(),nameIndex=new Map();
 const normName=value=>String(value||'').normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]/g,'');
 const lang=()=> $('languagePicker')?.value||'it';
 const countryLabel=name=>displayCountryName(name);
 const render=()=>{
  const total=countries.length,vc=visited.size,wc=wish.size;
  $('bucketVisitedCount').textContent=vc;$('bucketWishCount').textContent=wc;$('bucketProgress').textContent=(total?Math.round(vc/total*100):0)+'%';
  $('bucketVisitedLabel').textContent=vc+' Paesi';$('bucketWishLabel').textContent=wc+' Paesi';
  const item=(name,type)=>'<div class="bucket-item"><span>'+esc(countryFlag(name))+' '+esc(countryLabel(name))+'</span><button type="button" data-bucket-move="'+esc(name)+'" data-target="'+(type==='visited'?'wish':'visited')+'">'+(type==='visited'?'Sposta in “Da visitare”':'Segna come visitato')+'</button><button type="button" data-bucket-remove="'+esc(name)+'" data-type="'+type+'" aria-label="Rimuovi">×</button></div>';
  $('bucketWishList').innerHTML=[...wish].sort((a,b)=>a.localeCompare(b,'it')).map(n=>item(n,'wish')).join('')||'<p class="bucket-empty">La tua lista dei desideri è ancora vuota.</p>';
  $('bucketVisitedList').innerHTML=[...visited].sort((a,b)=>a.localeCompare(b,'it')).map(n=>item(n,'visited')).join('')||'<p class="bucket-empty">Il tuo viaggio è appena cominciato. Aggiungi il primo Paese!</p>';
  if(mapLayer&&geoFeatures)mapLayer.setStyle(featureStyle);
 };
 const featureCode=f=>{const p=f.properties||{};return String(p.ISO_A2||p.ISO_A2_EH||p.iso_a2||p.ISO3166_1_Alpha_2||p['ISO3166-1-Alpha-2']||'').toUpperCase()};
 const resolveFeatureName=f=>{const p=f.properties||{};return codeNames.get(featureCode(f))||nameIndex.get(normName(p.NAME_IT))||nameIndex.get(normName(p.ADMIN))||nameIndex.get(normName(p.NAME))||nameIndex.get(normName(p.NAME_LONG))||null};
 const featureStyle=f=>{const name=resolveFeatureName(f);return {color:'#c6cdd1',weight:.85,opacity:1,fillOpacity:1,fillColor:name&&visited.has(name)?'#24645a':name&&wish.has(name)?'#d5a83f':'#ffffff'}};
 const initMap=()=>{
  if(mapStarted)return;if(!window.L){$('bucketMapHelp').textContent='La mappa interattiva richiede una connessione per caricare il servizio cartografico. Puoi comunque gestire le tue liste qui sopra.';return}
  mapStarted=true;window.roamBucketMap=L.map('bucketMap',{scrollWheelZoom:false,worldCopyJump:true,zoomSnap:.25,zoomDelta:.25,minZoom:.5}).setView([20,0],1);window.roamFitBucketMap=()=>{if(!window.roamBucketMap)return;window.roamBucketMap.fitBounds([[-82,-180],[85,180]],{padding:[12,12],animate:false});};
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:6,attribution:'© OpenStreetMap'}).addTo(window.roamBucketMap);
  fetch('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson').then(r=>{if(!r.ok)throw new Error('GeoJSON non disponibile');return r.json()}).then(data=>{
   geoFeatures=data.features||[];mapLayer=L.geoJSON(data,{style:featureStyle,onEachFeature:(feature,layer)=>{const p=feature.properties||{},name=resolveFeatureName(feature);layer.bindTooltip(p.NAME_IT||p.ADMIN||p.NAME||'Paese');layer.on('click',()=>{if(name){$('bucketCountry').value=name;$('bucketMapHelp').textContent=countryLabel(name)+' selezionato. Scegli se aggiungerlo ai Paesi da visitare o a quelli visitati.'}else{$('bucketMapHelp').textContent='Questo territorio non è presente nell’elenco delle destinazioni ROAM.'}})}}).addTo(window.roamBucketMap);window.roamFitBucketMap?.();
  }).catch(()=>{$('bucketMapHelp').textContent='Non è stato possibile caricare la cartina. Le tue liste restano disponibili e salvate sul dispositivo.'});
 };
 const populate=()=>{const select=$('bucketCountry');if(!select||!countries.length)return;select.innerHTML='<option value="">Seleziona un Paese…</option>'+countries.slice().sort((a,b)=>a.Paese.localeCompare(b.Paese,'it')).map(c=>'<option value="'+esc(c.Paese)+'">'+esc(countryFlag(c.Paese))+' '+esc(countryLabel(c.Paese))+'</option>').join('');};
 const add=(type)=>{const name=$('bucketCountry').value;if(!name)return; if(type==='visited'){visited.add(name);wish.delete(name)}else{wish.add(name);visited.delete(name)}save();render();$('bucketMapHelp').textContent=countryLabel(name)+(type==='visited'?' aggiunto ai Paesi visitati.':' aggiunto alla lista dei desideri.')};
 $('bucketAddWish')?.addEventListener('click',()=>add('wish'));$('bucketAddVisited')?.addEventListener('click',()=>add('visited'));
 document.addEventListener('click',e=>{const move=e.target.closest('[data-bucket-move]'),remove=e.target.closest('[data-bucket-remove]');if(move){const n=move.dataset.bucketMove;if(move.dataset.target==='visited'){visited.add(n);wish.delete(n)}else{wish.add(n);visited.delete(n)}save();render()}if(remove){const n=remove.dataset.bucketRemove;(remove.dataset.type==='visited'?visited:wish).delete(n);save();render()}});
 const start=()=>{countries.forEach(c=>{const code=iso(c.Paese);if(code)codeNames.set(code,c.Paese);nameIndex.set(normName(c.Paese),c.Paese)});populate();render();initMap()};
 window.roamRenderBucket=start;
 if(countries.length)start();else{const check=setInterval(()=>{if(countries.length){clearInterval(check);start()}},250);setTimeout(()=>clearInterval(check),15000)}
})();


/* ROAM live flights: SerpApi Google Flights through the protected Cloudflare Worker */
(()=>{
 const WORKER='https://roam-flights-api.valerio-z-1992.workers.dev';
 const escFlight=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const CITY_AIRPORTS={'pisa':['PSA'],'firenze':['FLR'],'bologna':['BLQ'],'milano':['MXP','LIN','BGY'],'roma':['FCO','CIA'],'venezia':['VCE','TSF'],'napoli':['NAP'],'torino':['TRN'],'madrid':['MAD'],'barcellona':['BCN'],'londra':['LHR','LGW','STN','LTN','LCY'],'parigi':['CDG','ORY','BVA'],'amsterdam':['AMS'],'bruxelles':['BRU','CRL'],'berlino':['BER'],'monaco':['MUC'],'francoforte':['FRA'],'zurigo':['ZRH'],'ginevra':['GVA'],'vienna':['VIE'],'praga':['PRG'],'varsavia':['WAW'],'cracovia':['KRK'],'budapest':['BUD'],'atene':['ATH'],'lisbona':['LIS'],'porto':['OPO'],'dublino':['DUB'],'copenaghen':['CPH'],'stoccolma':['ARN','BMA'],'oslo':['OSL'],'helsinki':['HEL'],'istanbul':['IST','SAW'],'new york':['JFK','LGA','EWR'],'los angeles':['LAX'],'miami':['MIA'],'tokyo':['HND','NRT'],'bangkok':['BKK','DMK'],'singapore':['SIN'],'dubai':['DXB']};
 const resolveCity=value=>{const raw=String(value||'').replace(/[\\u200B-\\u200D\\uFEFF]/g,'').trim(),key=raw.normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase();const airport=CITY_AIRPORTS[key]||(key==='pisa'?['PSA']:null);if(airport)return airport.join(',');if(/^[a-z]{3}$/i.test(raw))return raw.toUpperCase();throw new Error('Seleziona una città presente nell’elenco: '+raw)};
 const fmtDuration=m=>{const n=Number(m);if(!Number.isFinite(n))return '';const h=Math.floor(n/60),r=n%60;return h+' h'+(r?' '+r+' min':'')};
 const flightList=data=>[...(Array.isArray(data.best_flights)?data.best_flights:[]),...(Array.isArray(data.other_flights)?data.other_flights:[])].slice(0,8);
 function renderFlightResults(target,data){
  if(data.error){target.innerHTML='<div class="flight-message">'+escFlight(data.error)+(data.details?' · '+escFlight(data.details):'')+'</div>';return}
  const items=flightList(data);
  if(!items.length){target.innerHTML='<div class="flight-message">La ricerca è stata completata, ma il provider non ha restituito voli per questa combinazione. Prova un altro aeroporto o una data diversa.</div>';return}
  const link=data.search_metadata?.google_flights_url||'https://www.google.com/travel/flights';
  target.innerHTML=items.map((item,i)=>{
   const flights=Array.isArray(item.flights)?item.flights:[];
   const airlines=[...new Set(flights.map(f=>f.airline).filter(Boolean))].join(', ')||'Compagnia non indicata';
   const first=flights[0]||{},last=flights[flights.length-1]||{};
   const depart=first.departure_airport?.time||'',arrive=last.arrival_airport?.time||'';
   const stops=flights.length?Math.max(0,flights.length-1):null;
   const stopText=stops===null?'':stops===0?'Diretto':stops+' scali';
   const price=Number(item.price);
   return '<article class="flight-card"><h4>'+escFlight(airlines)+'</h4><div class="flight-price">'+(Number.isFinite(price)?price.toLocaleString('it-IT')+' €':'Prezzo da verificare')+'</div><div class="flight-meta">'+(depart&&arrive?escFlight(depart)+' → '+escFlight(arrive)+' · ':'')+(item.total_duration?escFlight(fmtDuration(item.total_duration))+' · ':'')+escFlight(stopText)+'</div><a class="flight-link" href="'+escFlight(link)+'" target="_blank" rel="noopener noreferrer">Apri e verifica su Google Flights ↗</a></article>';
  }).join('')+'<div class="flight-message">Risultati forniti da Google Flights tramite SerpApi. Prezzi, disponibilità, bagagli e condizioni vanno verificati sul sito del venditore.</div>';
 }
 function renderExploreResults(target,data){
  const destinations=Array.isArray(data.destinations)?data.destinations:[];
  if(data.error){target.innerHTML='<div class="flight-message">'+escFlight(data.error)+'</div>';return}
  if(!destinations.length){target.innerHTML='<div class="flight-message">Non ho trovato mete con questi parametri. Prova un’altra partenza o date flessibili.</div>';return}
  const sorted=destinations.filter(d=>Number.isFinite(Number(d.flight_price))).sort((a,b)=>Number(a.flight_price)-Number(b.flight_price));
  const items=(sorted.length?sorted:destinations).slice(0,20);
  target.innerHTML='<div class="flight-explore-grid">'+items.map(d=>{
   const price=Number(d.flight_price),duration=d.flight_duration?fmtDuration(d.flight_duration):'',stops=Number.isFinite(Number(d.number_of_stops))?(Number(d.number_of_stops)===0?'Diretto':d.number_of_stops+' scali'):'';
   const href=d.link||d.serpapi_link||'https://www.google.com/travel/explore';
   return '<article class="flight-explore-card">'+(d.thumbnail?'<img loading="lazy" src="'+escFlight(d.thumbnail)+'" alt="">':'')+'<h4>'+escFlight(d.name||'Destinazione')+'</h4><div class="flight-explore-meta">'+escFlight(d.country||'')+'</div><div class="flight-explore-price">'+(Number.isFinite(price)?price.toLocaleString('it-IT')+' €':'Prezzo non indicato')+'</div><div class="flight-explore-meta">'+(duration?escFlight(duration)+' · ':'')+escFlight(stops)+(d.start_date?' · '+escFlight(d.start_date):'')+'</div><a href="'+escFlight(href)+'" target="_blank" rel="noopener noreferrer">Vedi voli e date ↗</a></article>';
  }).join('')+'</div><div class="flight-message">Mete suggerite da Google Travel Explore. Prezzi e date sono indicativi e vanno verificati prima di prenotare.</div>';
 }
 async function exploreAnywhere(button){
  const panel=button.closest('.flight-search-panel'),origin=panel?.querySelector('[name="departure_city"]'),date=panel?.querySelector('[name="outbound_date"]'),ret=panel?.querySelector('[name="return_date"]'),adults=panel?.querySelector('[name="adults"]'),target=panel?.querySelector('[data-flight-results]');
  if(!origin||!target)return;
  let departure_id;
  try{departure_id=resolveCity(origin.value)}catch(e){target.innerHTML='<div class="flight-message">'+escFlight(e.message)+'</div>';origin.focus();return}
  const values={departure_id,adults:Number(adults?.value||1)};
  if(date?.value)values.outbound_date=date.value;
  if(ret?.value){if(!values.outbound_date||ret.value<values.outbound_date){target.innerHTML='<div class="flight-message">Per indicare il ritorno, scegli prima una data di partenza valida.</div>';return}values.return_date=ret.value}
  const old=button.textContent;button.disabled=true;button.textContent='Cerco le mete più convenienti…';target.innerHTML='<div class="flight-message">Sto cercando destinazioni in tutto il mondo. Attendi qualche secondo…</div>';
  try{const response=await fetch(WORKER+'/explore',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(values)});const data=await response.json();if(!response.ok)throw new Error(data.error||'Ricerca destinazioni non disponibile');renderExploreResults(target,data)}
  catch(error){target.innerHTML='<div class="flight-message">'+escFlight(error.message||'Errore durante la ricerca delle destinazioni.')+'</div>'}
  finally{button.disabled=false;button.textContent=old||'🌍 Ovunque · trova le mete più economiche'}
 }
 async function requestFlight(values,target){
  const response=await fetch(WORKER+'/search',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(values)});
  const data=await response.json();
  if(!response.ok)throw new Error(data.error||'Il servizio voli non ha completato la ricerca.');
  renderFlightResults(target,data);
 }
 async function searchFlight(form,button,target){
  const fd=new FormData(form),trip=String(fd.get('trip_type')||'one_way'),adults=Number(fd.get('adults')||1);
  button.disabled=true;const original=button.textContent;button.textContent='Ricerca in corso…';
  target.innerHTML='<div class="flight-message">Sto interrogando Google Flights. Attendi qualche secondo…</div>';
  try{
   if(trip==='multi_city'){
    const rows=[...form.querySelectorAll('[data-multi-leg]')];
    if(!rows.length)throw new Error('Aggiungi almeno una tratta.');
    for(let i=0;i<rows.length;i++){
     const row=rows[i],departure_id=resolveCity(row.querySelector('[data-multi-from]').value),arrival_id=resolveCity(row.querySelector('[data-multi-to]').value),outbound_date=row.querySelector('[data-multi-date]').value;
     if(!departure_id.split(',').every(code=>/^[A-Z]{3}$/.test(code))||!arrival_id.split(',').every(code=>/^[A-Z]{3}$/.test(code))||departure_id===arrival_id||!/^\d{4}-\d{2}-\d{2}$/.test(outbound_date))throw new Error('Controlla città e data della tratta '+(i+1)+'.');
    }
    target.innerHTML='';
    for(let i=0;i<rows.length;i++){
     const row=rows[i],departure_id=resolveCity(row.querySelector('[data-multi-from]').value),arrival_id=resolveCity(row.querySelector('[data-multi-to]').value),outbound_date=row.querySelector('[data-multi-date]').value;
     const section=document.createElement('section');section.className='flight-leg-results';section.innerHTML='<h4>Tratta '+(i+1)+': '+escFlight(departure_id)+' → '+escFlight(arrival_id)+'</h4><div class="flight-results-inner"></div>';target.appendChild(section);
     await requestFlight({departure_id,arrival_id,outbound_date,trip_type:'one_way',adults},section.querySelector('.flight-results-inner'));
    }
   }else{
    const departure_id=resolveCity(fd.get('departure_city')),arrival_id=resolveCity(fd.get('arrival_city')),outbound_date=String(fd.get('outbound_date')||''),return_date=String(fd.get('return_date')||'');
    if(!departure_id.split(',').every(code=>/^[A-Z]{3}$/.test(code))||!arrival_id.split(',').every(code=>/^[A-Z]{3}$/.test(code))||departure_id===arrival_id)throw new Error('Inserisci due città diverse presenti nell’elenco.');
    if(!/^\d{4}-\d{2}-\d{2}$/.test(outbound_date))throw new Error('Seleziona una data di partenza valida.');
    if(trip==='round_trip'&&(!/^\d{4}-\d{2}-\d{2}$/.test(return_date)||return_date<outbound_date))throw new Error('Seleziona una data di ritorno successiva alla partenza.');
    const values={departure_id,arrival_id,outbound_date,trip_type:trip,adults};
    if(trip==='round_trip')values.return_date=return_date;
    await requestFlight(values,target);
   }
  }catch(error){target.innerHTML='<div class="flight-message">'+escFlight(error.message||'Errore di connessione al servizio voli.')+'</div>'}
  finally{button.disabled=false;button.textContent=original||'Cerca voli →'}
 }
 document.addEventListener('change',event=>{
  const select=event.target.closest('[data-trip-type]');if(!select)return;
  const form=select.closest('form'),single=form.querySelector('[data-single-flight]'),multi=form.querySelector('[data-multicity]'),ret=form.querySelector('[data-return-date]');
  const isMulti=select.value==='multi_city';single.hidden=isMulti;multi.hidden=!isMulti;ret.hidden=select.value!=='round_trip';
  single.querySelectorAll('input').forEach(input=>input.required=!isMulti&&(input.name!=='return_date'||select.value==='round_trip'));
  if(isMulti&&!form.querySelector('[data-multi-leg]'))form.querySelector('[data-multicity-legs]').insertAdjacentHTML('beforeend',multiLegMarkup());
 });
 function multiLegMarkup(){return '<div class="flight-fields" data-multi-leg><label>Città di partenza<input data-multi-from list="roam-airport-cities" placeholder="Pisa" autocomplete="off" required></label><label>Città di arrivo<input data-multi-to list="roam-airport-cities" placeholder="Madrid" autocomplete="off" required></label><label>Data<input data-multi-date type="date" required></label></div>'}
 document.addEventListener('click',event=>{
  const add=event.target.closest('[data-add-flight-leg]');if(!add)return;
  const form=add.closest('form'),box=form.querySelector('[data-multicity-legs]');box.insertAdjacentHTML('beforeend',multiLegMarkup());
 });
 document.addEventListener('click',event=>{const button=event.target.closest('[data-explore-anywhere]');if(button){event.preventDefault();exploreAnywhere(button)}});
 document.addEventListener('submit',event=>{
  const form=event.target.closest('[data-flight-search-form]');if(!form)return;
  event.preventDefault();const button=form.querySelector('button[type="submit"]'),target=form.querySelector('[data-flight-results]');
  if(button&&target)searchFlight(form,button,target);
 });
})();
