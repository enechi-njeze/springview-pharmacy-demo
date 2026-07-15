/* ============================================================
   SPRINGVIEW SHOP ENGINE
   Catalog is data-driven so admin.html can share it.
   Product names are clinical generics or "Springview Essentials"
   house brand. No third-party trademarks, no near-brand names.
   Blurbs are template-generated in 4 languages.
   ============================================================ */

/* department definitions: id, 4-lang label, pictogram, promo flag */
var SV_DEPTS = [
  {id:'otc',   ic:'💊', promo:true,  en:'Pain & Fever',      es:'Dolor y fiebre',   ht:'Doulè & Lafyèv',   fr:'Douleur & fièvre'},
  {id:'cold',  ic:'🤧', promo:false, en:'Cold & Allergy',    es:'Resfriado y alergia',ht:'Grip & Alèji',    fr:'Rhume & allergie'},
  {id:'dme',   ic:'🩹', promo:true,  en:'Surgical & DME',    es:'Equipo médico',    ht:'Ekipman Medikal',  fr:'Matériel médical'},
  {id:'vit',   ic:'🌿', promo:false, en:'Vitamins',          es:'Vitaminas',        ht:'Vitamin',          fr:'Vitamines'},
  {id:'baby',  ic:'🍼', promo:false, en:'Baby & Mom',        es:'Bebé y mamá',      ht:'Tibebe & Manman',  fr:'Bébé & maman'},
  {id:'skin',  ic:'🧴', promo:false, en:'Skin & First Aid',  es:'Piel y primeros auxilios',ht:'Po & Premye Swen',fr:'Peau & premiers soins'},
  {id:'diab',  ic:'🩸', promo:true,  en:'Diabetes Care',     es:'Cuidado diabético',ht:'Swen Dyabèt',      fr:'Soins du diabète'},
  {id:'oral',  ic:'🦷', promo:false, en:'Oral Care',         es:'Cuidado bucal',    ht:'Swen Bouch',       fr:'Soins bucco-dentaires'},
  {id:'home',  ic:'🏠', promo:false, en:'Home Health',       es:'Salud en casa',    ht:'Sante Lakay',      fr:'Santé à domicile'}
];

/* ============================================================
   SERVICE-AREA CONFIG (single source of truth)
   Delivery is for PRESCRIPTIONS ONLY. OTC is always pickup
   (payment happens at the counter, so OTC cannot be delivered).
   ============================================================ */
var SV_DELIVERY = {
  serviceAreaTowns: ['Newark','Orange','East Orange','Irvington','Maplewood'],
  serviceAreaZips: ['07111','07018','07017','07050','07052','07040','07079',
                    '07102','07103','07104','07105','07106','07107','07108','07112','07114']
  // ^ indicative ZIPs for the in-area towns; town-name match is primary, ZIP is a helper.
  //   Owner action: confirm exact Rx-delivery ZIPs before go-live.
};
/* is the typed town in the Rx service area? (case-insensitive, trimmed) */
function svTownInArea(town){
  if(!town) return false;
  var t=String(town).trim().toLowerCase();
  return SV_DELIVERY.serviceAreaTowns.some(function(x){ return x.toLowerCase()===t; });
}
function svZipInArea(zip){
  if(!zip) return false;
  var z=String(zip).trim().slice(0,5);
  return SV_DELIVERY.serviceAreaZips.indexOf(z)>=0;
}

/* stock states cycle for realism */
function _stock(i){ return i%9===0 ? 'out' : (i%4===0 ? 'low' : 'in'); }

/* raw product seed: [dept, en-name, size-en, price]. ~10 per dept. */
var _SEED = [
  // Pain & Fever
  ['otc','Acetaminophen 500 mg Tablets','100 caplets',8.49],
  ['otc','Ibuprofen 200 mg Tablets','100 tablets',7.99],
  ['otc','Naproxen Sodium 220 mg','80 caplets',9.49],
  ['otc','Aspirin 325 mg','100 tablets',5.99],
  ['otc','Springview Essentials Extra Strength Pain Relief','50 caplets',6.49],
  ['otc','Acetaminophen PM','60 caplets',8.99],
  ['otc','Lidocaine 4% Pain Patch','5 patches',11.99],
  ['otc','Menthol Pain Relief Gel','4 oz',7.49],
  ['otc','Children\u2019s Acetaminophen Liquid','4 fl oz',7.99],
  ['otc','Effervescent Pain & Cold Tablets','20 tablets',6.29],
  // Cold & Allergy
  ['cold','Loratadine 10 mg Tablets','30 tablets',9.99],
  ['cold','Cetirizine 10 mg Tablets','30 tablets',10.49],
  ['cold','Diphenhydramine 25 mg','48 capsules',6.99],
  ['cold','Guaifenesin Chest Congestion','20 tablets',8.49],
  ['cold','Saline Nasal Spray','1.5 fl oz',5.49],
  ['cold','Springview Essentials Daytime Cold Relief','24 caplets',7.99],
  ['cold','Nighttime Cold & Flu Liquid','8 fl oz',8.99],
  ['cold','Throat Lozenges, Honey Lemon','30 lozenges',4.49],
  ['cold','Fluticasone Allergy Nasal Spray','120 sprays',13.99],
  ['cold','Cough Suppressant DM','4 fl oz',7.29],
  // Surgical & DME
  ['dme','Adjustable Wrist Brace','One size',18.99],
  ['dme','Elastic Knee Support','Medium',22.49],
  ['dme','Aluminum Folding Cane','Adjustable',24.99],
  ['dme','Quad Cane, Small Base','Adjustable',31.99],
  ['dme','Compression Socks 15-20 mmHg','Large',16.99],
  ['dme','Ankle Support Wrap','One size',14.49],
  ['dme','Reacher Grabber, 26 in','26 inch',13.99],
  ['dme','Digital Blood Pressure Monitor','Upper arm',39.99],
  ['dme','Pill Organizer, Weekly AM/PM','7-day',9.99],
  ['dme','Bath Safety Grab Bar','16 inch',21.99],
  ['dme','Springview Essentials Rollator Walker','Standard',89.99],
  // Vitamins
  ['vit','Vitamin D3 2000 IU Softgels','120 softgels',10.99],
  ['vit','Vitamin C 1000 mg','100 tablets',9.49],
  ['vit','Vitamin B12 1000 mcg','60 tablets',8.99],
  ['vit','Daily Multivitamin, Adult','90 tablets',12.49],
  ['vit','Calcium + D3','120 tablets',11.49],
  ['vit','Fish Oil 1000 mg','90 softgels',13.99],
  ['vit','Magnesium 250 mg','100 tablets',9.99],
  ['vit','Springview Essentials Iron 65 mg','100 tablets',7.99],
  ['vit','Probiotic Daily Capsules','30 capsules',15.99],
  ['vit','Zinc 50 mg','60 tablets',6.99],
  // Baby & Mom
  ['baby','Infant Acetaminophen Drops','2 fl oz',7.49],
  ['baby','Gripe Water','4 fl oz',8.99],
  ['baby','Diaper Rash Ointment','4 oz',6.49],
  ['baby','Baby Gas Relief Drops','1 fl oz',7.99],
  ['baby','Saline Nose Drops, Infant','1 fl oz',4.99],
  ['baby','Prenatal Multivitamin','90 tablets',14.99],
  ['baby','Nipple Care Cream','1.4 oz',9.49],
  ['baby','Baby Thermometer, Digital','1 unit',12.99],
  ['baby','Electrolyte Solution, Kids','1 L',6.99],
  ['baby','Springview Essentials Baby Wipes','216 wipes',8.49],
  // Skin & First Aid
  ['skin','Adhesive Bandages, Assorted','100 count',5.49],
  ['skin','Antibiotic Ointment','1 oz',6.99],
  ['skin','Hydrocortisone 1% Cream','1 oz',5.99],
  ['skin','Gauze Pads, Sterile 4x4','25 count',6.49],
  ['skin','Medical Tape, Cloth','2 rolls',4.99],
  ['skin','Antiseptic Wipes','100 count',5.99],
  ['skin','Springview Essentials First Aid Kit','120 pieces',19.99],
  ['skin','Aloe Vera Gel','8 oz',7.49],
  ['skin','Instant Cold Pack','4 pack',8.99],
  ['skin','Elastic Bandage Wrap, 3 in','1 roll',4.49],
  // Diabetes Care
  ['diab','Blood Glucose Test Strips','50 strips',18.99],
  ['diab','Lancets, 30 Gauge','100 count',7.99],
  ['diab','Alcohol Prep Pads','200 count',4.99],
  ['diab','Sugar-Free Glucose Tablets','50 tablets',6.49],
  ['diab','Diabetic Foot Cream','4 oz',8.99],
  ['diab','Springview Essentials Glucose Meter','1 kit',24.99],
  ['diab','Ketone Test Strips','50 strips',12.99],
  ['diab','Diabetic Crew Socks','2 pairs',11.99],
  ['diab','Sharps Disposal Container','1.4 qt',9.49],
  ['diab','Continuous Glucose Sensor Adhesive Patches','20 patches',13.99],
  // Oral Care
  ['oral','Fluoride Toothpaste','5.5 oz',3.99],
  ['oral','Soft Toothbrush','2 pack',4.49],
  ['oral','Antiseptic Mouthwash','16 fl oz',6.49],
  ['oral','Dental Floss, Waxed','2 pack',3.49],
  ['oral','Denture Adhesive Cream','2 oz',7.49],
  ['oral','Springview Essentials Whitening Toothpaste','4 oz',5.99],
  ['oral','Sensitivity Relief Toothpaste','4 oz',6.99],
  ['oral','Interdental Brushes','20 count',5.49],
  ['oral','Oral Pain Relief Gel','0.42 oz',6.49],
  ['oral','Denture Cleanser Tablets','90 tablets',6.99],
  // Home Health
  ['home','Digital Thermometer','1 unit',9.99],
  ['home','Pulse Oximeter, Fingertip','1 unit',22.99],
  ['home','Heating Pad, Moist/Dry','Standard',26.99],
  ['home','Isopropyl Alcohol 70%','16 fl oz',3.49],
  ['home','Hydrogen Peroxide 3%','16 fl oz',2.49],
  ['home','Springview Essentials Nitrile Gloves','100 count',12.99],
  ['home','Reusable Hot/Cold Gel Pack','1 unit',7.99],
  ['home','Face Masks, 3-Ply','50 count',9.99],
  ['home','Disposable Underpads','30 count',15.99],
  ['home','Enema Ready-to-Use','4.5 fl oz',5.49]
];

/* size translations, kept simple/parametric */
function _sizeTr(en){
  var map={
    'caplets':{es:'caplets',ht:'kaplèt',fr:'comprimés'},
    'tablets':{es:'tabletas',ht:'grenn',fr:'comprimés'},
    'capsules':{es:'cápsulas',ht:'kapsil',fr:'gélules'},
    'softgels':{es:'cápsulas blandas',ht:'jèl mou',fr:'gélules molles'},
    'patches':{es:'parches',ht:'plak',fr:'patchs'},
    'sprays':{es:'aplicaciones',ht:'espre',fr:'pulvérisations'},
    'lozenges':{es:'pastillas',ht:'pastiy',fr:'pastilles'},
    'strips':{es:'tiras',ht:'tès',fr:'bandelettes'},
    'count':{es:'unidades',ht:'inite',fr:'unités'},
    'pieces':{es:'piezas',ht:'moso',fr:'pièces'},
    'wipes':{es:'toallitas',ht:'twal',fr:'lingettes'},
    'pack':{es:'paquete',ht:'pakè',fr:'paquet'},
    'pairs':{es:'pares',ht:'pè',fr:'paires'},
    'unit':{es:'unidad',ht:'inite',fr:'unité'},
    'kit':{es:'kit',ht:'twous',fr:'trousse'},
    'rolls':{es:'rollos',ht:'roulo',fr:'rouleaux'},
    'roll':{es:'rollo',ht:'roulo',fr:'rouleau'},
    'Adjustable':{es:'Ajustable',ht:'Ajistab',fr:'Réglable'},
    'One size':{es:'Talla única',ht:'Yon gwosè',fr:'Taille unique'},
    'Medium':{es:'Mediano',ht:'Mwayen',fr:'Moyen'},
    'Large':{es:'Grande',ht:'Gwo',fr:'Grand'},
    'Small':{es:'Pequeño',ht:'Piti',fr:'Petit'},
    'Standard':{es:'Estándar',ht:'Estanda',fr:'Standard'},
    'Upper arm':{es:'Brazo',ht:'Bra',fr:'Bras'},
    'inch':{es:'pulg',ht:'pous',fr:'po'}
  };
  return {
    es: en.replace(/[A-Za-z]+/g,function(w){return map[w]&&map[w].es?map[w].es:w;}),
    ht: en.replace(/[A-Za-z]+/g,function(w){return map[w]&&map[w].ht?map[w].ht:w;}),
    fr: en.replace(/[A-Za-z]+/g,function(w){return map[w]&&map[w].fr?map[w].fr:w;})
  };
}

/* generic name translator for common medical nouns (light touch) */
var _NAME_TR = {
  'Acetaminophen':{es:'Acetaminofén',ht:'Asetaminofèn',fr:'Acétaminophène'},
  'Ibuprofen':{es:'Ibuprofeno',ht:'Ibipwofèn',fr:'Ibuprofène'},
  'Aspirin':{es:'Aspirina',ht:'Aspirin',fr:'Aspirine'},
  'Tablets':{es:'Tabletas',ht:'Grenn',fr:'Comprimés'},
  'Cream':{es:'Crema',ht:'Krèm',fr:'Crème'},
  'Gel':{es:'Gel',ht:'Jèl',fr:'Gel'},
  'Softgels':{es:'Cápsulas blandas',ht:'Jèl mou',fr:'Gélules molles'},
  'Vitamin':{es:'Vitamina',ht:'Vitamin',fr:'Vitamine'},
  'Spray':{es:'Aerosol',ht:'Espre',fr:'Spray'},
  'Brace':{es:'Soporte',ht:'Sipò',fr:'Attelle'},
  'Cane':{es:'Bastón',ht:'Baton',fr:'Canne'},
  'Support':{es:'Soporte',ht:'Sipò',fr:'Support'},
  'Monitor':{es:'Monitor',ht:'Monitè',fr:'Tensiomètre'},
  'Care':{es:'Cuidado',ht:'Swen',fr:'Soins'}
};
function _nameTr(en){
  function tr(lang){
    return en.split(' ').map(function(w){
      var k=w.replace(/[^A-Za-z\u2019]/g,'');
      return _NAME_TR[k]&&_NAME_TR[k][lang]?w.replace(k,_NAME_TR[k][lang]):w;
    }).join(' ');
  }
  return {es:tr('es'),ht:tr('ht'),fr:tr('fr')};
}

/* blurb templates by language */
function _blurb(deptId,nameEn){
  var d=SV_DEPTS.filter(function(x){return x.id===deptId;})[0];
  return {
    en:'Quality '+d.en.toLowerCase()+' from Springview. Ask our pharmacist if it is right for you. Reserve for pickup at 4 Elmwood.',
    es:'Producto de calidad para '+d.es.toLowerCase()+' de Springview. Pregunte a nuestro farmacéutico si es adecuado para usted. Reserve para recoger en 4 Elmwood.',
    ht:'Pwodwi kalite pou '+d.ht.toLowerCase()+' nan Springview. Mande famasyen nou an si li bon pou ou. Rezève pou ranmase nan 4 Elmwood.',
    fr:'Produit de qualité pour '+d.fr.toLowerCase()+' de Springview. Demandez à notre pharmacien s\u2019il vous convient. Réservez pour le retrait au 4 Elmwood.'
  };
}

/* build the catalog */
var CATALOG = _SEED.map(function(row,i){
  var deptId=row[0], nameEn=row[1], sizeEn=row[2], price=row[3];
  var nameTr=_nameTr(nameEn), sizeTr=_sizeTr(sizeEn);
  var dept=SV_DEPTS.filter(function(x){return x.id===deptId;})[0];
  var seq=('0'+(_SEED.slice(0,i+1).filter(function(r){return r[0]===deptId;}).length)).slice(-2);
  return {
    id:'p-'+deptId+'-'+seq,
    dept:deptId,
    img:'p-'+deptId+'-'+seq+'.jpg',
    ic:dept.ic,
    price:price,
    stock:_stock(i),
    name:{en:nameEn,es:nameTr.es,ht:nameTr.ht,fr:nameTr.fr},
    size:{en:sizeEn,es:sizeTr.es,ht:sizeTr.ht,fr:sizeTr.fr},
    blurb:_blurb(deptId,nameEn)
  };
});

/* ============ SHOP STATE + HELPERS ============ */
function L(){ return (window.SV&&SV.lang)||'en'; }
function money(n){ return '$'+n.toFixed(2); }
function tr(o){ return o[L()]||o.en; }

var SHOP = { filters:{stock:[],dept:[]}, sort:'rel', pdpQty:1 };

/* PLP sort/filter labels localized */
var SORT_LABELS={
  rel:{en:'Sort: Relevance',es:'Orden: Relevancia',ht:'Triye: Enpòtans',fr:'Tri : Pertinence'},
  plow:{en:'Price: Low to High',es:'Precio: menor a mayor',ht:'Pri: piti a gwo',fr:'Prix : croissant'},
  phigh:{en:'Price: High to Low',es:'Precio: mayor a menor',ht:'Pri: gwo a piti',fr:'Prix : décroissant'},
  name:{en:'Name: A to Z',es:'Nombre: A a Z',ht:'Non: A a Z',fr:'Nom : A à Z'}
};
var STOCK_LABEL={
  in:{en:'In stock',es:'En stock',ht:'Disponib',fr:'En stock'},
  low:{en:'Low stock',es:'Pocas unidades',ht:'Kèk rete',fr:'Stock faible'},
  out:{en:'Out of stock',es:'Agotado',ht:'Fini',fr:'Épuisé'}
};
var FILTER_TXT={
  avail:{en:'Availability',es:'Disponibilidad',ht:'Disponiblite',fr:'Disponibilité'},
  dept:{en:'Department',es:'Departamento',ht:'Depatman',fr:'Rayon'},
  reset:{en:'Reset filters',es:'Restablecer',ht:'Reyinisyalize',fr:'Réinitialiser'},
  addcart:{en:'Add to cart',es:'Añadir al carrito',ht:'Mete nan panye',fr:'Ajouter au panier'},
  pickup:{en:'Pickup today at 4 Elmwood',es:'Recoja hoy en 4 Elmwood',ht:'Ranmase jodi a nan 4 Elmwood',fr:'Retrait aujourd\u2019hui au 4 Elmwood'},
  deliv:{en:'Pay at the counter on pickup',es:'Pague en el mostrador al recoger',ht:'Peye nan kontwa a lè ou ranmase',fr:'Payez au comptoir au retrait'},
  desc:{en:'Description',es:'Descripción',ht:'Deskripsyon',fr:'Description'},
  specs:{en:'Details & specs',es:'Detalles',ht:'Detay',fr:'Détails'},
  related:{en:'You might also need',es:'También podría necesitar',ht:'Ou ka bezwen tou',fr:'Vous pourriez aussi avoir besoin'},
  qty:{en:'Quantity',es:'Cantidad',ht:'Kantite',fr:'Quantité'},
  shopall:{en:'Shop',es:'Tienda',ht:'Boutik',fr:'Boutique'},
  home:{en:'Home',es:'Inicio',ht:'Akèy',fr:'Accueil'}
};

/* ============ PLP RENDER ============ */
function renderPromoChips(){
  var wrap=document.getElementById('promoChips'); if(!wrap) return;
  var chips=[
    {en:'We deliver prescriptions in the area',es:'Entregamos recetas en la zona',ht:'Nou livre preskripsyon nan zòn nan',fr:'Nous livrons les ordonnances dans la zone'},
    {en:'Surgical & DME fitted in person',es:'Equipo médico ajustado en persona',ht:'Ekipman medikal mezire an pèsòn',fr:'Matériel médical ajusté en personne'},
    {en:'Ask about discount cards',es:'Pregunte por tarjetas de descuento',ht:'Mande sou kat rabè',fr:'Demandez les cartes de réduction'}
  ];
  wrap.innerHTML=chips.map(function(c){return '<span class="promo-chip">'+tr(c)+'</span>';}).join('');
}
function renderFilterRail(){
  var rail=document.getElementById('filterRail'); if(!rail) return;
  var h='<h4>'+tr(FILTER_TXT.avail)+'</h4>';
  ['in','low','out'].forEach(function(s){
    var on=SHOP.filters.stock.indexOf(s)>=0;
    h+='<label class="filter-opt"><input type="checkbox" data-f="stock" value="'+s+'"'+(on?' checked':'')+'>'+tr(STOCK_LABEL[s])+'</label>';
  });
  h+='<h4>'+tr(FILTER_TXT.dept)+'</h4>';
  SV_DEPTS.forEach(function(d){
    var on=SHOP.filters.dept.indexOf(d.id)>=0;
    h+='<label class="filter-opt"><input type="checkbox" data-f="dept" value="'+d.id+'"'+(on?' checked':'')+'>'+d.ic+' '+tr(d)+'</label>';
  });
  h+='<button class="filter-reset" id="filterReset">'+tr(FILTER_TXT.reset)+'</button>';
  rail.innerHTML=h;
  rail.querySelectorAll('input[data-f]').forEach(function(cb){
    cb.addEventListener('change',function(){
      var f=cb.getAttribute('data-f'), v=cb.value, arr=SHOP.filters[f];
      var idx=arr.indexOf(v);
      if(cb.checked && idx<0) arr.push(v);
      if(!cb.checked && idx>=0) arr.splice(idx,1);
      renderPLP();
    });
  });
  document.getElementById('filterReset').addEventListener('click',function(){
    SHOP.filters={stock:[],dept:[]}; renderFilterRail(); renderPLP();
  });
}
function applyFilters(list){
  return list.filter(function(p){
    if(SHOP.filters.stock.length && SHOP.filters.stock.indexOf(p.stock)<0) return false;
    if(SHOP.filters.dept.length && SHOP.filters.dept.indexOf(p.dept)<0) return false;
    return true;
  });
}
function applySort(list){
  var l=list.slice();
  if(SHOP.sort==='plow') l.sort(function(a,b){return a.price-b.price;});
  else if(SHOP.sort==='phigh') l.sort(function(a,b){return b.price-a.price;});
  else if(SHOP.sort==='name') l.sort(function(a,b){return tr(a.name).localeCompare(tr(b.name));});
  return l;
}
function pcard(p){
  var badge = p.stock==='in'?'<span class="pcard-badge badge-in">'+tr(STOCK_LABEL.in)+'</span>'
            : p.stock==='low'?'<span class="pcard-badge badge-low">'+tr(STOCK_LABEL.low)+'</span>'
            : '<span class="pcard-badge badge-out">'+tr(STOCK_LABEL.out)+'</span>';
  var dept=SV_DEPTS.filter(function(d){return d.id===p.dept;})[0];
  var out=p.stock==='out';
  return '<div class="pcard" data-pid="'+p.id+'">'
    +'<div class="pcard-img"><img src="'+p.img+'" alt="'+tr(p.name)+'" onerror="this.style.display=\'none\';this.parentNode.insertAdjacentHTML(\'beforeend\',\'<span class=\\\'pcard-ph\\\'>'+p.ic+'</span>\')">'+badge+'</div>'
    +'<div class="pcard-body"><div class="pcard-dept">'+tr(dept)+'</div>'
    +'<div class="pcard-name">'+tr(p.name)+'</div>'
    +'<div class="pcard-size">'+tr(p.size)+'</div>'
    +'<div class="pcard-foot"><span class="pcard-price">'+money(p.price)+'</span>'
    +'<button class="pcard-add" data-add="'+p.id+'"'+(out?' disabled':'')+' aria-label="Add">+</button></div></div></div>';
}
function renderPLP(){
  var grid=document.getElementById('plpGrid'); if(!grid) return;
  var list=applySort(applyFilters(CATALOG));
  document.getElementById('plpCount').textContent=list.length;
  grid.innerHTML=list.map(pcard).join('');
  /* localize sort dropdown */
  var sel=document.getElementById('plpSort');
  Array.prototype.forEach.call(sel.options,function(o){ o.textContent=tr(SORT_LABELS[o.value]); });
  sel.value=SHOP.sort;
  bindCardClicks(grid);
  if(window.svRefreshReveals) window.svRefreshReveals();
}
function bindCardClicks(scope){
  scope.querySelectorAll('[data-add]').forEach(function(b){
    b.addEventListener('click',function(e){ e.stopPropagation(); cartAdd(b.getAttribute('data-add'),1); pulseCart(); });
  });
  scope.querySelectorAll('.pcard[data-pid]').forEach(function(c){
    c.addEventListener('click',function(){ location.hash='#product?p='+c.getAttribute('data-pid'); });
  });
}

/* ============ PDP RENDER ============ */
function findProduct(id){ return CATALOG.filter(function(p){return p.id===id;})[0]; }
function renderPDP(id){
  var p=findProduct(id); var host=document.getElementById('pdpContent'); if(!host) return;
  if(!p){ host.innerHTML='<p style="padding:40px 0">Product not found. <a href="#shop" style="color:var(--red)">Back to shop</a></p>'; return; }
  var dept=SV_DEPTS.filter(function(d){return d.id===p.dept;})[0];
  SHOP.pdpQty=1;
  var out=p.stock==='out';
  var related=CATALOG.filter(function(x){return x.dept===p.dept && x.id!==p.id;}).slice(0,6);
  host.innerHTML=
    '<div class="breadcrumb"><a href="#home">'+tr(FILTER_TXT.home)+'</a><span class="sep">/</span>'
      +'<a href="#shop">'+tr(FILTER_TXT.shopall)+'</a><span class="sep">/</span>'
      +'<a href="#shop" data-dept="'+p.dept+'">'+tr(dept)+'</a><span class="sep">/</span><span>'+tr(p.name)+'</span></div>'
    +'<div class="pdp"><div class="pdp-media"><div class="pdp-img" id="pdpImg">'
      +'<img src="'+p.img+'" alt="'+tr(p.name)+'" onerror="this.style.display=\'none\';this.parentNode.insertAdjacentHTML(\'beforeend\',\'<span class=\\\'pcard-ph\\\'>'+p.ic+'</span>\')">'
      +'<span class="pdp-zoomhint">🔍 '+({en:'Click to zoom',es:'Clic para ampliar',ht:'Klike pou zoum',fr:'Cliquez pour zoomer'}[L()])+'</span></div></div>'
    +'<div class="pdp-info"><div class="pdp-dept">'+tr(dept)+'</div><h1>'+tr(p.name)+'</h1>'
      +'<div class="pcard-size">'+tr(p.size)+'</div>'
      +'<div class="pdp-price">'+money(p.price)+'</div>'
      +'<div class="pdp-fulfill"><div class="row"><span class="ic">🏪</span>'+tr(FILTER_TXT.pickup)+'</div>'
        +'<div class="row"><span class="ic">💳</span>'+tr(FILTER_TXT.deliv)+'</div>'
        +'<div class="row"><span class="ic">'+(out?'⛔':'✅')+'</span>'+tr(STOCK_LABEL[p.stock])+'</div></div>'
      +'<div class="qty-row"><span class="pcard-size">'+tr(FILTER_TXT.qty)+'</span>'
        +'<div class="qty-step"><button id="qtyMinus">&minus;</button><span id="qtyVal">1</span><button id="qtyPlus">+</button></div></div>'
      +'<button class="btn btn-primary" id="pdpAdd" style="width:100%;justify-content:center"'+(out?' disabled':'')+'>'+tr(FILTER_TXT.addcart)+'</button>'
      +'<div class="pdp-accordion">'
        +'<div class="acc-item open"><button class="acc-head">'+tr(FILTER_TXT.desc)+'<span class="chev">▾</span></button><div class="acc-body"><p style="padding-top:4px">'+tr(p.blurb)+'</p></div></div>'
        +'<div class="acc-item"><button class="acc-head">'+tr(FILTER_TXT.specs)+'<span class="chev">▾</span></button><div class="acc-body"><p style="padding-top:4px">'+tr(dept)+' · '+tr(p.size)+' · SKU '+p.id.toUpperCase()+'</p></div></div>'
      +'</div></div></div>'
    +'<div class="related"><div class="sec-head" style="margin-bottom:14px"><h2 style="font-size:22px">'+tr(FILTER_TXT.related)+'</h2></div>'
      +'<div class="related-track">'+related.map(pcard).join('')+'</div></div>';

  /* wire PDP */
  document.getElementById('qtyMinus').addEventListener('click',function(){ if(SHOP.pdpQty>1){SHOP.pdpQty--;document.getElementById('qtyVal').textContent=SHOP.pdpQty;} });
  document.getElementById('qtyPlus').addEventListener('click',function(){ SHOP.pdpQty++;document.getElementById('qtyVal').textContent=SHOP.pdpQty; });
  document.getElementById('pdpAdd').addEventListener('click',function(){ cartAdd(p.id,SHOP.pdpQty); pulseCart(); openCart(); });
  document.querySelectorAll('.acc-head').forEach(function(h){ h.addEventListener('click',function(){ h.parentNode.classList.toggle('open'); }); });
  bindCardClicks(host.querySelector('.related-track'));
  host.querySelectorAll('[data-dept]').forEach(function(a){ a.addEventListener('click',function(e){ e.preventDefault(); SHOP.filters={stock:[],dept:[a.getAttribute('data-dept')]}; location.hash='#shop'; }); });

  /* lightbox zoom */
  var img=document.getElementById('pdpImg');
  img.addEventListener('click',function(){
    var lb=document.getElementById('lightbox'), li=document.getElementById('lightboxImg');
    li.src=p.img; lb.classList.add('open');
  });
  /* sticky mini-header */
  setupPdpMini(p);
}
function setupPdpMini(p){
  var mini=document.getElementById('pdpMini');
  document.getElementById('pdpMiniName').textContent=tr(p.name);
  document.getElementById('pdpMiniPrice').textContent=money(p.price);
  var mi=document.getElementById('pdpMiniImg'); mi.src=p.img; mi.onerror=function(){this.style.visibility='hidden';};
  document.getElementById('pdpMiniAdd').onclick=function(){ cartAdd(p.id,1); pulseCart(); openCart(); };
  if(SHOP._miniHandler) window.removeEventListener('scroll',SHOP._miniHandler);
  SHOP._miniHandler=function(){
    var onProduct=document.getElementById('page-product').classList.contains('active');
    if(onProduct && window.scrollY>380) mini.classList.add('show'); else mini.classList.remove('show');
  };
  window.addEventListener('scroll',SHOP._miniHandler);
}

/* ============ CART ============ */
function cartLoad(){ try{ return JSON.parse(localStorage.getItem('sv-cart')||'{}'); }catch(e){ return {}; } }
function cartSave(c){ try{ localStorage.setItem('sv-cart',JSON.stringify(c)); }catch(e){} }
function cartAdd(id,qty){ var c=cartLoad(); c[id]=(c[id]||0)+qty; cartSave(c); renderCart(); }
function cartSet(id,qty){ var c=cartLoad(); if(qty<=0) delete c[id]; else c[id]=qty; cartSave(c); renderCart(); }
function cartCount(){ var c=cartLoad(),n=0; for(var k in c) n+=c[k]; return n; }
function cartSubtotal(){ var c=cartLoad(),s=0; for(var k in c){ var p=findProduct(k); if(p) s+=p.price*c[k]; } return s; }
function renderCart(){
  var c=cartLoad(), items=document.getElementById('cartItems');
  var count=cartCount(), badge=document.getElementById('cartCount');
  if(badge){ badge.textContent=count; badge.classList.toggle('zero',count===0); }
  if(!items) return;
  var keys=Object.keys(c);
  if(!keys.length){
    items.innerHTML='<div class="cart-empty"><div class="em">🛒</div>'
      +({en:'Your cart is empty.',es:'Su carrito está vacío.',ht:'Panye ou vid.',fr:'Votre panier est vide.'}[L()])+'</div>';
    document.getElementById('cartCheckout').disabled=true;
  } else {
    items.innerHTML=keys.map(function(id){
      var p=findProduct(id); if(!p) return '';
      var q=c[id];
      return '<div class="cart-line"><div class="ci-img">'+p.ic+'</div>'
        +'<div class="ci-info"><div class="ci-name">'+tr(p.name)+'</div>'
        +'<div class="ci-size">'+tr(p.size)+'</div>'
        +'<div class="ci-controls"><div class="ci-qty"><button data-dec="'+id+'">&minus;</button><span>'+q+'</span><button data-inc="'+id+'">+</button></div>'
        +'<button class="ci-remove" data-rm="'+id+'">'+({en:'Remove',es:'Quitar',ht:'Retire',fr:'Retirer'}[L()])+'</button></div></div>'
        +'<div class="ci-price">'+money(p.price*q)+'</div></div>';
    }).join('');
    document.getElementById('cartCheckout').disabled=false;
    items.querySelectorAll('[data-inc]').forEach(function(b){ b.onclick=function(){ cartSet(b.getAttribute('data-inc'),(c[b.getAttribute('data-inc')]||0)+1); }; });
    items.querySelectorAll('[data-dec]').forEach(function(b){ b.onclick=function(){ cartSet(b.getAttribute('data-dec'),(c[b.getAttribute('data-dec')]||0)-1); }; });
    items.querySelectorAll('[data-rm]').forEach(function(b){ b.onclick=function(){ cartSet(b.getAttribute('data-rm'),0); }; });
  }
  document.getElementById('cartSubtotal').textContent=money(cartSubtotal());
  renderReserve();
}
function openCart(){ document.getElementById('cartDrawer').classList.add('open'); document.getElementById('cartOverlay').classList.add('open'); renderCart(); }
function closeCart(){ document.getElementById('cartDrawer').classList.remove('open'); document.getElementById('cartOverlay').classList.remove('open'); }
function pulseCart(){ var b=document.getElementById('cartBtn'); if(!b) return; b.animate([{transform:'scale(1)'},{transform:'scale(1.2)'},{transform:'scale(1)'}],{duration:260}); }

/* ============================================================
   RESERVE FOR PICKUP  (Phase-1 e-commerce bridge, OTC)
   OTC is PICKUP ONLY: payment happens at the counter, so OTC
   items are never delivered. Rx delivery lives in the refill
   flow, not here. No card capture. Submits via the same
   sv-intakes messenger the Galaxy intake uses, so it lands in
   admin Inquiries.
   ============================================================ */
var RSV = {};

/* 4-language strings for the reserve panel (HT/FR need native review before production) */
var RSV_TXT = {
  heading:{en:'Reserve these for pickup',es:'Reserve para recoger',ht:'Rezève sa yo pou ranmase',fr:'Réservez pour le retrait'},
  pickupOnly:{en:'Pickup at 4 Elmwood. Pay at the counter when you collect. We do not deliver over-the-counter items.',es:'Recoja en 4 Elmwood. Pague en el mostrador al recoger. No entregamos artículos de venta libre.',ht:'Ranmase nan 4 Elmwood. Peye nan kontwa a lè ou vin pran. Nou pa livre atik san preskripsyon.',fr:'Retrait au 4 Elmwood. Payez au comptoir au retrait. Nous ne livrons pas les articles en vente libre.'},
  nameLbl:{en:'Your name',es:'Su nombre',ht:'Non ou',fr:'Votre nom'},
  phoneLbl:{en:'Callback number',es:'Número de devolución de llamada',ht:'Nimewo pou rele w',fr:'Numéro de rappel'},
  reserveBtn:{en:'Send reservation request',es:'Enviar solicitud de reserva',ht:'Voye demann rezèvasyon',fr:'Envoyer la demande de réservation'},
  consent:{en:'By sending, you agree we may contact you about this request.',es:'Al enviar, acepta que podamos contactarle sobre esta solicitud.',ht:'Lè ou voye, ou dakò nou ka kontakte w sou demann sa a.',fr:'En envoyant, vous acceptez que nous vous contactions à ce sujet.'},
  sent:{en:'Request sent. We will call you to confirm, then set your items aside. Pay at the counter on pickup.',es:'Solicitud enviada. Le llamaremos para confirmar y apartaremos sus artículos. Pague en el mostrador al recoger.',ht:'Demann voye. N ap rele w pou konfime, epi n ap mete atik ou yo sou kote. Peye nan kontwa a lè ou vin pran.',fr:'Demande envoyée. Nous vous appellerons pour confirmer et mettrons vos articles de côté. Payez au comptoir au retrait.'},
  demoTag:{en:'Demo: this prepares a request for the pharmacy team, it does not take payment.',es:'Demo: prepara una solicitud para la farmacia, no cobra.',ht:'Demo: sa prepare yon demann pou ekip famasi a, li pa pran peman.',fr:'Démo : prépare une demande pour l\u2019équipe, sans paiement.'},
  needFields:{en:'Please add your name and a callback number.',es:'Agregue su nombre y un número.',ht:'Tanpri ajoute non ou ak yon nimewo.',fr:'Ajoutez votre nom et un numéro.'}
};

/* render the pickup-only reserve panel inside the cart foot (called from renderCart) */
function renderReserve(){
  var host=document.getElementById('rsvPanel'); if(!host) return;
  host.innerHTML=''
    +'<div class="rsv-head">'+tr(RSV_TXT.heading)+'</div>'
    +'<div class="rsv-msg ok">'+tr(RSV_TXT.pickupOnly)+'</div>'
    +'<div class="rsv-form">'
    +'<label>'+tr(RSV_TXT.nameLbl)+'<input id="rsvName" type="text" autocomplete="name"></label>'
    +'<label>'+tr(RSV_TXT.phoneLbl)+'<input id="rsvPhone" type="tel" autocomplete="tel"></label>'
    +'<div class="rsv-consent">'+tr(RSV_TXT.consent)+'</div>'
    +'<button class="rsv-send" id="rsvSend">'+tr(RSV_TXT.reserveBtn)+'</button>'
    +'<div class="rsv-demo">'+tr(RSV_TXT.demoTag)+'</div>'
    +'</div>'
    +'<div class="rsv-ok" id="rsvOk"></div>';
  var snd=document.getElementById('rsvSend');
  if(snd) snd.onclick=submitReserve;
}

/* write a pickup reservation into sv-intakes (same shape the Galaxy intake uses) */
function submitReserve(){
  var name=(document.getElementById('rsvName')||{}).value||'';
  var phone=(document.getElementById('rsvPhone')||{}).value||'';
  if(!name.trim()||!phone.trim()){
    var okv=document.getElementById('rsvOk'); if(okv){ okv.className='rsv-ok warn show'; okv.textContent=tr(RSV_TXT.needFields); }
    return;
  }
  var c=cartLoad(), lines=[];
  for(var k in c){ var p=findProduct(k); if(p) lines.push(c[k]+' x '+ (p.name.en||tr(p.name)) ); }
  var rec={ id:'in_'+Date.now(), ts:Date.now(), type:'reserve',
            title:'OTC Reservation (pickup)', lang:L(),
            fields:[
              {k:'Name', v:name},
              {k:'Callback', v:phone},
              {k:'Fulfillment', v:'Pickup at 4 Elmwood'},
              {k:'Items', v: lines.join('; ')||'(none)'},
              {k:'Subtotal', v: money(cartSubtotal())},
              {k:'Payment', v:'At counter on pickup (no online payment, no delivery)'}
            ]};
  try{
    var list=[]; try{ list=JSON.parse(localStorage.getItem('sv-intakes')||'[]'); }catch(e){ list=[]; }
    list.unshift(rec); if(list.length>50) list=list.slice(0,50);
    localStorage.setItem('sv-intakes', JSON.stringify(list));
  }catch(e){}
  try{ console.log('[Springview reserve demo, not transmitted]', rec); }catch(e){}
  var ok=document.getElementById('rsvOk'); if(ok){ ok.className='rsv-ok ok show'; ok.textContent=tr(RSV_TXT.sent); }
}


/* ============ STORY FLIPBOOK ============ */
var STORY=[
  {yr:'1995',cap:{en:'Springview opens its doors in Irvington, family owned from day one.',es:'Springview abre sus puertas en Irvington, familiar desde el primer día.',ht:'Springview louvri pòt li nan Irvington, se fanmi depi premye jou a.',fr:'Springview ouvre ses portes à Irvington, familiale dès le premier jour.'}},
  {yr:'2004',cap:{en:'The Surgical & DME counter grows: braces, mobility, and home care under one roof.',es:'Crece el mostrador de equipo médico: soportes, movilidad y cuidado en casa.',ht:'Kontwa Ekipman Medikal la grandi: sipò, mobilite, ak swen lakay.',fr:'Le comptoir matériel médical grandit : attelles, mobilité et soins à domicile.'}},
  {yr:'2012',cap:{en:'We add pharmacist-led vaccines and start serving in four languages.',es:'Añadimos vacunas y empezamos a atender en cuatro idiomas.',ht:'Nou ajoute vaksen epi kòmanse sèvi an kat lang.',fr:'Nous ajoutons les vaccins et commençons à servir en quatre langues.'}},
  {yr:'2020',cap:{en:'Through the pandemic, a neighbor who picks up the phone and knows your name.',es:'Durante la pandemia, un vecino que contesta y sabe su nombre.',ht:'Pandan pandemi an, yon vwazen ki reponn telefòn epi konnen non ou.',fr:'Pendant la pandémie, un voisin qui répond et connaît votre nom.'}},
  {yr:'2026',cap:{en:'Thirty years in, same family, same corner, now online too.',es:'Treinta años después, la misma familia, la misma esquina, ahora también en línea.',ht:'Trant an apre, menm fanmi, menm kwen, kounye a sou entènèt tou.',fr:'Trente ans plus tard, même famille, même coin, désormais aussi en ligne.'}}
];
var storyIdx=0, flipShowingBack=false;
function renderStory(){
  var frontYr=document.getElementById('flipYr'), frontCap=document.getElementById('flipCap');
  var backYr=document.getElementById('flipYrB'), backCap=document.getElementById('flipCapB');
  if(!frontYr) return;
  var s=STORY[storyIdx];
  if(flipShowingBack){ backYr.textContent=s.yr; backCap.textContent=tr(s.cap); }
  else { frontYr.textContent=s.yr; frontCap.textContent=tr(s.cap); }
  var dots=document.getElementById('flipDots');
  dots.innerHTML=STORY.map(function(_,i){return '<span class="flip-dot'+(i===storyIdx?' active':'')+'"></span>';}).join('');
}
function flipTo(i){
  if(i<0) i=STORY.length-1; if(i>=STORY.length) i=0;
  storyIdx=i; flipShowingBack=!flipShowingBack;
  renderStory();
  document.getElementById('flip').style.transform=flipShowingBack?'rotateY(180deg)':'rotateY(0deg)';
}
function setupStory(){
  var flip=document.getElementById('flip'); if(!flip) return;
  renderStory();
  document.getElementById('flipNext').addEventListener('click',function(){ flipTo(storyIdx+1); });
  document.getElementById('flipPrev').addEventListener('click',function(){ flipTo(storyIdx-1); });
  flip.addEventListener('click',function(){ flipTo(storyIdx+1); });
}

/* ============ SAVINGS DEALS ROW ============ */
function renderDeals(){
  var track=document.getElementById('dealTrack'); if(!track) return;
  var picks=CATALOG.filter(function(p){return p.stock!=='out';}).slice(0,8);
  track.innerHTML=picks.map(function(p){
    var was=(p.price*1.25);
    return '<div class="deal-chip"><div class="dname">'+tr(p.name)+'</div>'
      +'<div class="dwas">'+money(was)+'</div><div class="dprice">'+money(p.price)+'</div></div>';
  }).join('');
}

/* ============ RX FORMS + Rx DELIVERY ============ */
/* 4-language strings for the Rx pickup/delivery choice.
   Delivery is PRESCRIPTIONS ONLY, within the service area, with NO minimum.
   HT/FR need native review before production (owner action). */
var RX_TXT = {
  pickup:{en:'Pickup at 4 Elmwood',es:'Recoger en 4 Elmwood',ht:'Ranmase nan 4 Elmwood',fr:'Retrait au 4 Elmwood'},
  delivery:{en:'Delivery (prescriptions, local area)',es:'Entrega (recetas, área local)',ht:'Livrezon (preskripsyon, zòn lokal)',fr:'Livraison (ordonnances, zone locale)'},
  delivNote:{en:'We deliver prescriptions within our local service area at no charge and with no minimum. Enter your address and we will confirm delivery is available for you.',es:'Entregamos recetas dentro de nuestra área de servicio local, sin cargo y sin mínimo. Ingrese su dirección y confirmaremos si la entrega está disponible.',ht:'Nou livre preskripsyon nan zòn sèvis lokal nou an gratis, san minimòm. Antre adrès ou epi n ap konfime si livrezon disponib pou ou.',fr:'Nous livrons les ordonnances dans notre zone de service locale, sans frais ni minimum. Saisissez votre adresse et nous confirmerons la disponibilité.'},
  inArea:{en:'Good news: your area is within our prescription delivery zone. The pharmacy will confirm the delivery day when they call.',es:'Buenas noticias: su zona está dentro de nuestra área de entrega de recetas. La farmacia confirmará el día de entrega al llamar.',ht:'Bòn nouvèl: zòn ou an nan zòn livrezon preskripsyon nou an. Famasi a ap konfime jou livrezon an lè yo rele.',fr:'Bonne nouvelle : votre secteur est dans notre zone de livraison d\u2019ordonnances. La pharmacie confirmera le jour de livraison lors de l\u2019appel.'},
  outArea:{en:'Your area may be outside our usual delivery zone. You can still send this request and the pharmacy will call to discuss options, or choose pickup at 4 Elmwood.',es:'Su zona puede estar fuera de nuestra área habitual. Aún puede enviar la solicitud y la farmacia le llamará para ver opciones, o elija recoger en 4 Elmwood.',ht:'Zòn ou an ka andeyò zòn abityèl nou an. Ou ka toujou voye demann sa a epi famasi a ap rele pou diskite opsyon, oswa chwazi ranmase nan 4 Elmwood.',fr:'Votre secteur est peut-être hors de notre zone habituelle. Vous pouvez tout de même envoyer la demande et la pharmacie vous appellera pour en discuter, ou choisir le retrait au 4 Elmwood.'},
  needAddr:{en:'Please add your delivery street, town, and ZIP so we can check availability.',es:'Agregue su calle, ciudad y código postal para verificar disponibilidad.',ht:'Tanpri ajoute lari, vil, ak kòd postal ou pou nou ka verifye disponiblite.',fr:'Ajoutez votre rue, ville et code postal pour vérifier la disponibilité.'}
};

/* populate a pickup/delivery <select> and toggle its delivery sub-panel */
function rxSyncMethodLabels(){
  ['rfMethod','tfMethod'].forEach(function(id){
    var sel=document.getElementById(id); if(!sel) return;
    Array.prototype.forEach.call(sel.options,function(o){
      if(o.value==='pickup') o.textContent=tr(RX_TXT.pickup);
      else if(o.value==='delivery') o.textContent=tr(RX_TXT.delivery);
    });
  });
  // refresh any visible note/area text for the current language
  var rn=document.getElementById('rfDelivNote'); if(rn) rn.textContent=tr(RX_TXT.delivNote);
  var tn=document.getElementById('tfDelivNote'); if(tn) tn.textContent=tr(RX_TXT.delivNote);
  rxAreaCheck('rf'); rxAreaCheck('tf');
}

/* show/hide the delivery sub-panel for one form prefix (rf|tf) */
function rxToggleDeliv(pfx){
  var sel=document.getElementById(pfx+'Method');
  var panel=document.getElementById(pfx+'Deliv');
  if(!sel||!panel) return;
  var isDeliv=sel.value==='delivery';
  panel.hidden=!isDeliv;
  if(isDeliv){ var n=document.getElementById(pfx+'DelivNote'); if(n) n.textContent=tr(RX_TXT.delivNote); rxAreaCheck(pfx); }
}

/* run the service-area check for one form prefix and paint the feedback */
function rxAreaCheck(pfx){
  var sel=document.getElementById(pfx+'Method'); if(!sel||sel.value!=='delivery') return;
  var area=document.getElementById(pfx+'Area'); if(!area) return;
  var town=(document.getElementById(pfx+'Town')||{}).value||'';
  var zip=(document.getElementById(pfx+'Zip')||{}).value||'';
  if(!town.trim() && !zip.trim()){ area.hidden=true; return; }
  var inArea = svTownInArea(town) || svZipInArea(zip);
  area.hidden=false;
  area.className='rx-area '+(inArea?'in':'out');
  area.textContent=tr(inArea?RX_TXT.inArea:RX_TXT.outArea);
}

/* write a refill/transfer request into sv-intakes (same shape Galaxy + reserve use) */
function rxWriteIntake(which){
  var pfx = which==='refill' ? 'rf' : 'tf';
  var g=function(id){ return (document.getElementById(id)||{}).value||''; };
  var method=(document.getElementById(pfx+'Method')||{}).value||'pickup';
  var isDeliv=method==='delivery';
  var fields=[];
  if(which==='refill'){
    fields.push({k:'Rx number', v:g('rfRx')||'(not provided)'});
    fields.push({k:'Name', v:g('rfName')||'(not provided)'});
    fields.push({k:'Contact', v:g('rfContact')||'(not provided)'});
  } else {
    fields.push({k:'Name', v:g('tfName')||'(not provided)'});
    fields.push({k:'Contact', v:g('tfContact')||'(not provided)'});
    fields.push({k:'Current pharmacy', v:g('tfPharm')||'(not provided)'});
    fields.push({k:'Medication(s)', v:g('tfMeds')||'(not provided)'});
  }
  if(isDeliv){
    var town=g(pfx+'Town'), zip=g(pfx+'Zip');
    var inArea = svTownInArea(town) || svZipInArea(zip);
    fields.push({k:'Fulfillment', v:'Prescription delivery (no minimum)'});
    fields.push({k:'Delivery address', v:[g(pfx+'Street'),town,zip].filter(Boolean).join(', ')||'(not provided)'});
    fields.push({k:'Service area', v: inArea ? 'In area (confirmed by town/ZIP)' : 'Outside usual zone, pharmacy to confirm'});
  } else {
    fields.push({k:'Fulfillment', v:'Pickup at 4 Elmwood'});
  }
  var rec={ id:'in_'+Date.now(), ts:Date.now(),
            type: which==='refill'?'refill':'transfer',
            title: which==='refill'?'Prescription refill':'Prescription transfer',
            lang:L(), fields:fields };
  try{
    var list=[]; try{ list=JSON.parse(localStorage.getItem('sv-intakes')||'[]'); }catch(e){ list=[]; }
    list.unshift(rec); if(list.length>50) list=list.slice(0,50);
    localStorage.setItem('sv-intakes', JSON.stringify(list));
  }catch(e){}
  try{ console.log('[Springview '+which+' demo, not transmitted]', rec); }catch(e){}
}

function setupForms(){
  rxSyncMethodLabels();
  ['rf','tf'].forEach(function(pfx){
    var sel=document.getElementById(pfx+'Method');
    if(sel) sel.addEventListener('change',function(){ rxToggleDeliv(pfx); });
    ['Town','Zip'].forEach(function(f){
      var el=document.getElementById(pfx+f);
      if(el) el.addEventListener('input',function(){ rxAreaCheck(pfx); });
    });
    rxToggleDeliv(pfx);
  });
  document.querySelectorAll('[data-form]').forEach(function(btn){
    btn.addEventListener('click',function(){
      var which=btn.getAttribute('data-form');
      // If delivery chosen but no address, nudge and stop.
      var pfx = which==='refill'?'rf':'tf';
      var sel=document.getElementById(pfx+'Method');
      if(sel && sel.value==='delivery'){
        var town=(document.getElementById(pfx+'Town')||{}).value||'';
        var zip=(document.getElementById(pfx+'Zip')||{}).value||'';
        var street=(document.getElementById(pfx+'Street')||{}).value||'';
        if(!street.trim() || (!town.trim() && !zip.trim())){
          var area=document.getElementById(pfx+'Area');
          if(area){ area.hidden=false; area.className='rx-area out'; area.textContent=tr(RX_TXT.needAddr); }
          return;
        }
      }
      rxWriteIntake(which);
      var ok=document.getElementById(which==='refill'?'okRefill':'okTransfer');
      if(ok){ ok.classList.add('show'); ok.scrollIntoView({behavior:'smooth',block:'nearest'}); }
    });
  });
}

/* ============ CART UI WIRING ============ */
function setupCartUI(){
  var cb=document.getElementById('cartBtn'); if(cb) cb.addEventListener('click',openCart);
  var cc=document.getElementById('cartClose'); if(cc) cc.addEventListener('click',closeCart);
  var co=document.getElementById('cartOverlay'); if(co) co.addEventListener('click',closeCart);
  var chk=document.getElementById('cartCheckout');
  if(chk) chk.addEventListener('click',function(){
    var panel=document.getElementById('rsvPanel');
    if(panel){ panel.classList.add('show'); renderReserve(); panel.scrollIntoView({behavior:'smooth',block:'nearest'}); }
    var hon=document.getElementById('checkoutHonesty'); if(hon) hon.classList.add('show');
  });
  var lb=document.getElementById('lightbox');
  if(lb) lb.addEventListener('click',function(){ lb.classList.remove('open'); });
  var sortSel=document.getElementById('plpSort');
  if(sortSel) sortSel.addEventListener('change',function(){ SHOP.sort=sortSel.value; renderPLP(); });
}

/* ============ SHOP INIT + ROUTE HOOK ============ */
function initShop(){
  renderPromoChips(); renderFilterRail(); renderPLP();
  renderDeals(); setupStory(); setupForms(); setupCartUI();
  renderCart();
  /* re-render language-sensitive shop bits when language cycles */
  new MutationObserver(function(){
    renderPromoChips(); renderFilterRail(); renderPLP(); renderDeals(); renderStory(); renderCart();
    rxSyncMethodLabels();
    var id=(location.hash||'').split('?')[0].replace('#','');
    if(id==='product'){ var pid=(location.hash.split('p=')[1]||''); if(pid) renderPDP(pid); }
  }).observe(document.documentElement,{attributes:true,attributeFilter:['data-lang']});
}
/* PDP routing: intercept #product?p=ID */
function shopRouteHook(){
  var hash=location.hash||'';
  if(hash.indexOf('#product')===0){
    var pid=(hash.split('p=')[1]||'').split('&')[0];
    renderPDP(pid);
  }
}
window.addEventListener('hashchange',shopRouteHook);
window.addEventListener('DOMContentLoaded',function(){ initShop(); shopRouteHook(); });

/* ============================================================
   GUIDED TOUR (senior-friendly: spotlight, big card, Back button,
   restart-teaching final stop). Covers new cart + Health surfaces.
   ============================================================ */
var TOUR_STEPS=[
  {sel:'.brand', route:'#home', pos:'auto', title:{en:'Welcome to Springview',es:'Bienvenido a Springview',ht:'Byenveni nan Springview',fr:'Bienvenue chez Springview'},
   body:{en:'This is your neighborhood pharmacy, online. We will walk you through everything in a few short, clearly marked steps. Use Back any time; you will not get lost.',es:'Esta es su farmacia del vecindario, en linea. Le guiaremos por todo en unos pasos cortos y claros. Use Atras cuando quiera; no se perdera.',ht:'Sa se famasi katye ou, sou entenet. N ap gide ou nan tout bagay nan kek etap kout ki make kle. Sevi ak Retounen nenpot le; ou p ap pedi.',fr:'Voici votre pharmacie de quartier, en ligne. Nous vous guidons pas a pas, clairement. Utilisez Retour a tout moment; vous ne vous perdrez pas.'}},
  {sel:'#langMini', route:'#home', title:{en:'Your language, anywhere',es:'Su idioma, en todo el sitio',ht:'Lang ou, tout kote',fr:'Votre langue, partout'},
   body:{en:'Tap the globe to switch between English, Espanol, Kreyol Ayisyen, and Francais. Every page, form, and message changes with you.',es:'Toque el globo para cambiar entre English, Espanol, Kreyol Ayisyen y Francais. Cada pagina, formulario y mensaje cambia con usted.',ht:'Peze glob la pou chanje ant English, Espanol, Kreyol Ayisyen, ak Francais. Chak paj, fom, ak mesaj chanje ave w.',fr:'Touchez le globe pour passer entre English, Espanol, Kreyol Ayisyen et Francais. Chaque page, formulaire et message vous suit.'}},
  {sel:'#themeBtn', route:'#home', title:{en:'Day or night',es:'Dia o noche',ht:'Lajounen oswa lannwit',fr:'Jour ou nuit'},
   body:{en:'Prefer a darker screen at night? Tap here for a comfortable dark mode. Your choice is remembered next time you visit.',es:'Prefiere una pantalla mas oscura de noche? Toque aqui para el modo oscuro. Recordamos su eleccion para la proxima vez.',ht:'Ou pito yon ekran ki pi fonse lannwit? Peze la a pou yon mod fonse. N ap sonje chwa ou pwochen fwa.',fr:'Vous preferez un ecran plus sombre le soir? Touchez ici pour le mode sombre. Votre choix est memorise.'}},
  {sel:'.quick-in', route:'#home', title:{en:'Quick actions',es:'Acciones rapidas',ht:'Aksyon rapid',fr:'Actions rapides'},
   body:{en:'The fastest things people need are always right here at the top: refill, transfer, book a vaccine, and more. One tap, on every page.',es:'Lo que la gente mas necesita esta siempre aqui arriba: resurtir, transferir, reservar una vacuna y mas. Un toque, en cada pagina.',ht:'Sa moun bezwen pi vit yo toujou la anle: ranpli, transfere, rezeve yon vaksen, ak plis. Yon sel tap, sou chak paj.',fr:'Ce dont on a le plus besoin est toujours ici en haut: renouveler, transferer, reserver un vaccin, et plus. Un geste, sur chaque page.'}},
  {sel:'.hero-cta', route:'#home', title:{en:'Refill in seconds',es:'Resurta en segundos',ht:'Ranpli nan segonn',fr:'Renouvelez en secondes'},
   body:{en:'Start a prescription refill right from the front page. No account, no password: just your Rx number and how to reach you.',es:'Comience un resurtido desde la pagina principal. Sin cuenta ni contrasena: solo su numero de receta y como contactarle.',ht:'Komanse yon ranpli preskripsyon direk sou paj devan an. San kont, san modpas: annik nimewo Rx ou ak kijan pou jwenn ou.',fr:'Lancez un renouvellement depuis la page d accueil. Sans compte ni mot de passe: juste votre numero d ordonnance et vos coordonnees.'}},
  {sel:'.trust', route:'#home', title:{en:'What we do',es:'Lo que hacemos',ht:'Sa nou fe',fr:'Ce que nous faisons'},
   body:{en:'Prescriptions, Surgical and DME (braces, mobility, wound care), vaccines, and service in four languages. The "and Surgical" side is what sets us apart.',es:'Recetas, equipo medico (soportes, movilidad, cuidado de heridas), vacunas y servicio en cuatro idiomas. El lado "and Surgical" nos distingue.',ht:'Preskripsyon, ekipman medikal (sipo, mobilite, swen blesi), vaksen, ak sevis nan kat lang. Kote "and Surgical" la se sa ki fe nou diferan.',fr:'Ordonnances, materiel medical (attelles, mobilite, soin des plaies), vaccins et service en quatre langues. Le cote "and Surgical" nous distingue.'}},
  {sel:'#page-shop', route:'#shop', title:{en:'The shop',es:'La tienda',ht:'Boutik la',fr:'La boutique'},
   body:{en:'Browse everyday health products and Surgical and DME. Prices and stock are shown up front, with no surprises.',es:'Explore productos de salud y equipo medico. Precios y existencias visibles, sin sorpresas.',ht:'Gade pwodwi sante chak jou ak ekipman medikal. Pri ak stok paret devan, san sipriz.',fr:'Parcourez les produits de sante et le materiel medical. Prix et stock affiches d emblee, sans surprise.'}},
  {sel:'#filterRail', route:'#shop', title:{en:'Find it fast',es:'Encuentrelo rapido',ht:'Jwenn li vit',fr:'Trouvez vite'},
   body:{en:'Narrow the list by what is in stock and by department. On a phone, these filters sit neatly at the top of the shop.',es:'Filtre la lista por lo disponible y por departamento. En el telefono, estos filtros estan arriba de la tienda.',ht:'Redwi lis la pa sa ki nan stok ak pa depatman. Sou yon telefon, filte sa yo chita byen anle boutik la.',fr:'Affinez la liste par disponibilite et par rayon. Sur telephone, ces filtres se placent en haut de la boutique.'}},
  {sel:'#plpSort', route:'#shop', title:{en:'Sort your way',es:'Ordene a su manera',ht:'Klase jan ou vle',fr:'Triez a votre facon'},
   body:{en:'Order items by relevance, price, or name. The count next to it always shows how many products match.',es:'Ordene por relevancia, precio o nombre. El numero al lado muestra cuantos productos coinciden.',ht:'Klase atik pa enpotans, pri, oswa non. Kantite ki akote a toujou montre konbyen pwodwi ki koresponn.',fr:'Classez par pertinence, prix ou nom. Le compteur a cote indique combien de produits correspondent.'}},
  {sel:'#plpGrid', route:'#shop', title:{en:'Tap any product',es:'Toque un producto',ht:'Peze nenpot pwodwi',fr:'Touchez un produit'},
   body:{en:'Open a product to see a larger photo you can zoom, the price, pickup details, and specs. Add it to your cart when ready.',es:'Abra un producto para ver una foto ampliable, el precio, los detalles de recogida y las especificaciones. Agreguelo al carrito cuando quiera.',ht:'Louvri yon pwodwi pou we yon pi gwo foto ou ka zoome, pri a, detay ranmasaj, ak detay. Ajoute l nan panye le ou pare.',fr:'Ouvrez un produit pour voir une photo agrandissable, le prix, les details de retrait et les caracteristiques. Ajoutez-le au panier quand vous voulez.'}},
  {sel:'#cartBtn', route:'#shop', title:{en:'Your cart',es:'Su carrito',ht:'Panye ou',fr:'Votre panier'},
   body:{en:'Items you add collect here, and stay saved even if you leave and come back later. Online payment is coming soon; for now you can reserve and pay at the counter.',es:'Los articulos que agrega se guardan aqui, incluso si vuelve mas tarde. El pago en linea llega pronto; por ahora reserve y pague en el mostrador.',ht:'Atik ou ajoute yo rasanble la, epi yo rete sove menm si ou tounen pita. Peman sou entenet ap vini; pou kounye a ou ka rezeve epi peye nan kontwa a.',fr:'Les articles ajoutes se regroupent ici et restent enregistres meme si vous revenez plus tard. Le paiement en ligne arrive bientot; pour l instant, reservez et payez au comptoir.'}},
  {sel:'#page-rx', route:'#rx', title:{en:'Refills and transfers',es:'Resurtidos y transferencias',ht:'Ranpli ak transfe',fr:'Renouvellements et transferts'},
   body:{en:'Refill a prescription or move one from another pharmacy. Both are simple guest forms: no login needed. We confirm on screen right away.',es:'Resurta una receta o traiga una de otra farmacia. Ambos son formularios simples, sin iniciar sesion. Confirmamos en pantalla al instante.',ht:'Ranpli yon preskripsyon oswa deplase youn soti nan yon lot famasi. Toude se fom senp, san koneksyon. Nou konfime sou ekran an touswit.',fr:'Renouvelez une ordonnance ou transferez-en une d une autre pharmacie. Deux formulaires simples, sans connexion. Confirmation a l ecran aussitot.'}},
  {sel:'#page-book', route:'#book', title:{en:'Book an appointment',es:'Reserve una cita',ht:'Pran yon randevou',fr:'Prenez rendez-vous'},
   body:{en:'Pick a time for a vaccine or a pharmacist consult on a real, live calendar. Choose a slot that works and you are booked.',es:'Elija una hora para una vacuna o una consulta con el farmaceutico en un calendario real y en vivo. Elija un horario y queda reservado.',ht:'Chwazi yon le pou yon vaksen oswa yon konsiltasyon ak famasyen an sou yon vre kalandriye an direk. Chwazi yon plas epi ou rezeve.',fr:'Choisissez un creneau pour un vaccin ou une consultation avec le pharmacien sur un vrai calendrier en direct. Selectionnez un horaire et c est reserve.'}},
  {sel:'#page-health', route:'#health', title:{en:'Health Corner',es:'Rincon de salud',ht:'Kwen Sante',fr:'Coin sante'},
   body:{en:'Short, plain-language articles from your pharmacist on flu season, blood pressure, vitamin D, and more, written in all four languages.',es:'Articulos breves y claros del farmaceutico sobre la gripe, la presion, la vitamina D y mas, en cuatro idiomas.',ht:'Atik kout ak senp nan men famasyen ou sou sezon grip, tansyon, vitamin D, ak plis, ekri nan kat lang.',fr:'De courts articles clairs du pharmacien sur la grippe, la tension, la vitamine D et plus, rediges dans les quatre langues.'}},
  {sel:'#page-savings', route:'#savings', title:{en:'Save on prescriptions',es:'Ahorre en recetas',ht:'Ekonomize sou preskripsyon',fr:'Economisez sur les ordonnances'},
   body:{en:'We honor common discount cards at the counter. This page explains, honestly, how each one works and when it helps most.',es:'Aceptamos tarjetas de descuento comunes en el mostrador. Esta pagina explica, con honestidad, como funciona cada una.',ht:'Nou aksepte kat rabe komen nan kontwa a. Paj sa a eksplike, onetman, kijan chak youn mache ak kile li ede plis.',fr:'Nous acceptons les cartes de reduction courantes au comptoir. Cette page explique honnetement le fonctionnement de chacune.'}},
  {sel:'#page-story', route:'#story', title:{en:'Our story',es:'Nuestra historia',ht:'Istwa nou',fr:'Notre histoire'},
   body:{en:'Turn the pages to see how Springview grew from 1995 to today, family-run the whole way. Meet the pharmacist who knows your name.',es:'Pase las paginas para ver como crecio Springview desde 1995, siempre familiar. Conozca al farmaceutico que sabe su nombre.',ht:'Vire paj yo pou we kijan Springview grandi depi 1995, an fanmi tout wout la. Rankontre famasyen ki konnen non ou.',fr:'Tournez les pages pour voir l evolution de Springview depuis 1995, toujours familiale. Rencontrez le pharmacien qui connait votre nom.'}},
  {sel:'#page-contact', route:'#contact', title:{en:'Find and reach us',es:'Encuentrenos',ht:'Jwenn nou',fr:'Nous joindre'},
   body:{en:'Address, phone, fax, and a map are all here. Hours are marked "pending confirmation" until the owner locks them in, so nothing misleads you.',es:'Direccion, telefono, fax y un mapa estan aqui. El horario dice "por confirmar" hasta que el dueno lo fije, para no confundirle.',ht:'Adres, telefon, faks, ak yon kat jeyografik tout la. Le yo make "ap tann konfimasyon" jiskaske met la fikse yo, pou anyen pa twonpe ou.',fr:'Adresse, telephone, fax et une carte sont ici. Les horaires indiquent "a confirmer" tant que le proprietaire ne les a pas fixes, pour ne pas vous induire en erreur.'}},
  {sel:'#waFab', route:'#home', pos:'left', title:{en:'WhatsApp us',es:'Escribanos por WhatsApp',ht:'WhatsApp nou',fr:'WhatsApp'},
   body:{en:'Prefer WhatsApp? Tap the green button any time to message the pharmacy directly from your phone.',es:'Prefiere WhatsApp? Toque el boton verde para escribir a la farmacia directamente desde su telefono.',ht:'Ou pito WhatsApp? Peze bouton vet la nenpot le pou ekri famasi a direk depi telefon ou.',fr:'Vous preferez WhatsApp? Touchez le bouton vert pour ecrire a la pharmacie depuis votre telephone.'}},
  {sel:'#ccFab', route:'#home', pos:'left', title:{en:'Meet Galaxy',es:'Conozca a Galaxy',ht:'Rankontre Galaxy',fr:'Voici Galaxy'},
   body:{en:'Galaxy is our assistant. Ask about hours, refills, savings, or directions any time, in your language. For medical questions, Galaxy connects you straight to the pharmacist.',es:'Galaxy es nuestro asistente. Pregunte por horarios, resurtidos, ahorros o como llegar, en su idioma. Para preguntas medicas, Galaxy le conecta con el farmaceutico.',ht:'Galaxy se asistan nou. Mande sou le, ranpli, ekonomi, oswa direksyon nenpot le, nan lang ou. Pou kesyon medikal, Galaxy konekte ou direk ak famasyen an.',fr:'Galaxy est notre assistant. Posez vos questions sur les horaires, renouvellements, economies ou l itineraire, dans votre langue. Pour le medical, Galaxy vous met en lien direct avec le pharmacien.'}},
  {sel:'#tourLaunch', route:'#home', pos:'auto', title:{en:'That is the full tour',es:'Ese es el recorrido completo',ht:'Se tout vizit la sa',fr:'Voila toute la visite'},
   body:{en:'You can restart this tour any time from this button in the bottom-left corner. Welcome to Springview: we are glad you are here.',es:'Puede reiniciar este recorrido cuando quiera con este boton abajo a la izquierda. Bienvenido a Springview: nos alegra tenerle aqui.',ht:'Ou ka rekomanse vizit sa a nenpot le ak bouton sa a anba agoch. Byenveni nan Springview: nou kontan ou la.',fr:'Vous pouvez relancer cette visite a tout moment avec ce bouton en bas a gauche. Bienvenue chez Springview: ravis de vous accueillir.'}}
];
var tourIdx=0;
function tourText(o){ return o[L()]||o.en; }
function positionTour(){
  var step=TOUR_STEPS[tourIdx];
  var el=document.querySelector(step.sel);
  var spot=document.getElementById('tourSpot'), card=document.getElementById('tourCard');
  var vw=window.innerWidth, vh=window.innerHeight, mobile=vw<=640;
  if(!el){ spot.style.opacity='0'; card.style.left='50%'; card.style.top='50%'; card.style.transform='translate(-50%,-50%)'; return; }
  var r=el.getBoundingClientRect();
  // if target is off-screen, scroll it into view then re-run
  if((r.top<60 || r.bottom>vh-60) && typeof el.scrollIntoView==='function'){
    try{ el.scrollIntoView({block:'center', behavior:(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)?'auto':'smooth'}); }catch(e){ el.scrollIntoView(); }
    setTimeout(positionTour, 340);
    return;
  }
  var pad=8;
  spot.style.opacity='1';
  spot.style.left=(r.left-pad)+'px'; spot.style.top=(r.top-pad)+'px';
  spot.style.width=(r.width+pad*2)+'px'; spot.style.height=(r.height+pad*2)+'px';
  card.style.transform='none';
  var cw=card.offsetWidth||Math.min(340,vw-24), ch=card.offsetHeight||210, gap=14;
  var left, top;
  if(mobile){
    // center horizontally; place card in whichever half has more room, avoiding the spotlight
    left=Math.max(12, Math.min((vw-cw)/2, vw-cw-12));
    var below=vh-r.bottom, above=r.top;
    if(step.pos==='left' || (r.top>vh*0.55)){ top=Math.max(12, r.top-ch-gap); }   // target low: card above
    else if(below>ch+gap+10){ top=r.bottom+gap; }                                   // room below
    else if(above>ch+gap+10){ top=r.top-ch-gap; }                                   // room above
    else { top=Math.max(12,(vh-ch)/2); }                                            // fallback center
  } else {
    left=r.left; top=r.bottom+gap;
    if(step.pos==='left'){ left=Math.max(12, r.left-cw+r.width); top=r.top-ch-gap; }
    if(top+ch>vh-10) top=Math.max(10,r.top-ch-gap);
    if(left+cw>vw-10) left=vw-cw-10;
    if(left<10) left=10;
  }
  card.style.left=left+'px'; card.style.top=top+'px';
}
function renderTour(){
  var step=TOUR_STEPS[tourIdx];
  if(step.route && location.hash!==step.route){ location.hash=step.route; }
  document.getElementById('tourStepLbl').textContent=(tourIdx+1)+' / '+TOUR_STEPS.length;
  document.getElementById('tourTitle').textContent=tourText(step.title);
  document.getElementById('tourText').textContent=tourText(step.body);
  var last=tourIdx===TOUR_STEPS.length-1;
  var nextLbl={en:last?'Finish':'Next',es:last?'Terminar':'Siguiente',ht:last?'Fini':'Pwochen',fr:last?'Terminer':'Suivant'};
  document.getElementById('tourNext').textContent=nextLbl[L()]||nextLbl.en;
  document.getElementById('tourBack').style.visibility=tourIdx===0?'hidden':'visible';
  var pct=Math.round(((tourIdx+1)/TOUR_STEPS.length)*100);
  document.getElementById('tourDots').innerHTML='<span class="t-prog"><span class="t-prog-fill" style="width:'+pct+'%"></span></span>';
  setTimeout(positionTour,140);
}
function startTour(){ tourIdx=0; document.getElementById('tourOverlay').classList.add('on'); renderTour(); }
function endTour(){ document.getElementById('tourOverlay').classList.remove('on'); }
function setupTour(){
  var launch=document.getElementById('tourLaunch'); if(!launch) return;
  launch.addEventListener('click',startTour);
  document.getElementById('tourSkip').addEventListener('click',endTour);
  document.getElementById('tourScrim').addEventListener('click',endTour);
  document.getElementById('tourNext').addEventListener('click',function(){
    if(tourIdx>=TOUR_STEPS.length-1){ endTour(); } else { tourIdx++; renderTour(); }
  });
  document.getElementById('tourBack').addEventListener('click',function(){ if(tourIdx>0){ tourIdx--; renderTour(); } });
  window.addEventListener('resize',function(){ if(document.getElementById('tourOverlay').classList.contains('on')) positionTour(); });
}
window.addEventListener('DOMContentLoaded',setupTour);

/* ============================================================
   ANIMATION CONTROLLER: scroll reveals, WhatsApp tooltip,
   Galaxy nudge. Fully reduced-motion aware.
   ============================================================ */
(function(){
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function tagReveals(){
    // add .reveal to major content blocks that are not already tagged
    var sels = ['.trust-item','.sec > h2','.sec > .sec-intro','.pcard','.dept-head',
                '.article-card','.savings-card','.deal-card','.pharmacist-card',
                '.surg-callout','.info-panel','.hours-card','.privacy-body > *',
                '.rx-form','.flip-wrap'];
    sels.forEach(function(s){
      document.querySelectorAll(s).forEach(function(el){
        if(!el.classList.contains('reveal')) el.classList.add('reveal');
      });
    });
    // stagger children within grids
    document.querySelectorAll('.trust').forEach(function(g){
      Array.prototype.slice.call(g.children).forEach(function(c,i){ c.classList.add('d'+((i%4)+1)); });
    });
  }

  var io=null;
  function observeReveals(){
    if(reduce){ document.querySelectorAll('.reveal').forEach(function(el){el.classList.add('in');}); return; }
    if(!('IntersectionObserver' in window)){ document.querySelectorAll('.reveal').forEach(function(el){el.classList.add('in');}); return; }
    if(io) io.disconnect();
    io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    },{threshold:.12,rootMargin:'0px 0px -8% 0px'});
    document.querySelectorAll('.reveal:not(.in)').forEach(function(el){ io.observe(el); });
  }

  // re-tag + re-observe whenever the visible page changes (hash routing) or shop re-renders
  function refreshReveals(){ tagReveals(); observeReveals(); }

  window.addEventListener('DOMContentLoaded',function(){
    refreshReveals();

    // WhatsApp tooltip: show once, a moment after load
    var tip=document.getElementById('waTip');
    if(tip && !reduce){ setTimeout(function(){ tip.classList.add('show'); }, 2600); }

    // Galaxy FAB attention nudge once, only if user hasn't opened it
    var fab=document.getElementById('ccFab');
    if(fab && !reduce){
      var nudged=false;
      var t=setTimeout(function(){ if(!nudged){ fab.classList.add('nudge'); } }, 1500);
      fab.addEventListener('click',function(){ nudged=true; clearTimeout(t); fab.classList.remove('nudge'); });
    }
  });

  // hook hashchange to re-reveal newly shown page content
  window.addEventListener('hashchange',function(){ setTimeout(refreshReveals,60); });

  // safety net: if anything is still hidden after 4s (observer missed it, JS race, etc), show it
  setTimeout(function(){
    document.querySelectorAll('.reveal:not(.in)').forEach(function(el){
      var r=el.getBoundingClientRect();
      if(r.top < window.innerHeight && r.bottom > 0){ el.classList.add('in'); }
    });
  }, 4000);

  // expose for shop re-renders (PLP rebuild adds new cards)
  window.svRefreshReveals = refreshReveals;
})();
