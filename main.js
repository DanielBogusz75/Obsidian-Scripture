"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => ScripturePlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");

// src/bible/boeken.ts
var TALEN = ["nl", "en", "pl"];
var TAAL_INFO = {
  nl: { naam: "Nederlands", letter: "O", bijbelMap: "Bijbel", notitieMap: "Bijbelnotities/Nederlands", audioBlok: "bijbelaudio", voorbeeld: "Joh 3:16\n1 Kor 13:1-8\nGe 1:1-3,8" },
  en: { naam: "Engels", letter: "E", bijbelMap: "Bible", notitieMap: "Bijbelnotities/Engels", audioBlok: "bijbelaudio-en", voorbeeld: "John 3:16\n1 Cor 13:1-8\nGe 1:1-3,8" },
  pl: { naam: "Pools", letter: "P", bijbelMap: "Biblia", notitieMap: "Bijbelnotities/Pools", audioBlok: "bijbelaudio-pl", voorbeeld: "J 3:16\n1 Kor 13:1-8\nRdz 1:1-3,8" }
};
var DATA = {
  nl: [
    "Genesis|ge|gen",
    "Exodus|ex|exod",
    "Leviticus|le|lev",
    "Numeri|nu|num",
    "Deuteronomium|de|deut",
    "Jozua|joz",
    "Rechters|re|ri|recht|richteren",
    "Ruth|ru",
    "1 Samu\xEBl|1sa|1sam",
    "2 Samu\xEBl|2sa|2sam",
    "1 Koningen|1kon|1kn",
    "2 Koningen|2kon|2kn",
    "1 Kronieken|1kr|1kron",
    "2 Kronieken|2kr|2kron",
    "Ezra|ezr",
    "Nehemia|ne|neh",
    "Esther|es|est",
    "Job",
    "Psalmen|ps|psalm",
    "Spreuken|spr|sp",
    "Prediker|pr|pred",
    "Hooglied|hgl|hoogl",
    "Jesaja|jes",
    "Jeremia|jer",
    "Klaagliederen|klg|klaagl",
    "Ezechi\xEBl|eze|ez",
    "Dani\xEBl|da|dan",
    "Hosea|ho|hos",
    "Jo\xEBl|joe",
    "Amos|am",
    "Obadja|ob",
    "Jona|jon",
    "Micha|mi|mic",
    "Nahum|na|nah",
    "Habakuk|hab",
    "Zefanja|zef",
    "Hagga\xEF|hag",
    "Zacharia|zac|zach",
    "Maleachi|mal",
    "Matthe\xFCs|mt|mat|matt|matteus",
    "Markus|mr|mar|mrk",
    "Lukas|lu|luk",
    "Johannes|joh",
    "Handelingen|han|hand",
    "Romeinen|ro|rom",
    "1 Korinthi\xEBrs|1ko|1kor|1korinthiers",
    "2 Korinthi\xEBrs|2ko|2kor|2korinthiers",
    "Galaten|ga|gal",
    "Efezi\xEBrs|ef|efe",
    "Filippenzen|fil|filip|filipenzen",
    "Kolossenzen|kol",
    "1 Thessalonicenzen|1th|1thes",
    "2 Thessalonicenzen|2th|2thes",
    "1 Timothe\xFCs|1ti|1tim",
    "2 Timothe\xFCs|2ti|2tim",
    "Titus|tit",
    "Filemon|flm|filem",
    "Hebree\xEBn|heb",
    "Jakobus|jak",
    "1 Petrus|1pe|1petr",
    "2 Petrus|2pe|2petr",
    "1 Johannes|1jo|1joh",
    "2 Johannes|2jo|2joh",
    "3 Johannes|3jo|3joh",
    "Judas|jud",
    "Openbaring|op|opb|openb"
  ],
  en: [
    "Genesis|ge|gen",
    "Exodus|ex|exod",
    "Leviticus|le|lev",
    "Numbers|nu|num",
    "Deuteronomy|de|deut",
    "Joshua|jos|josh",
    "Judges|jg|judg",
    "Ruth|ru",
    "1 Samuel|1sa|1sam",
    "2 Samuel|2sa|2sam",
    "1 Kings|1ki|1kgs",
    "2 Kings|2ki|2kgs",
    "1 Chronicles|1ch|1chron",
    "2 Chronicles|2ch|2chron",
    "Ezra|ezr",
    "Nehemiah|ne|neh",
    "Esther|es|esth",
    "Job",
    "Psalms|ps|psa|psalm",
    "Proverbs|pr|prov",
    "Ecclesiastes|ec|eccl",
    "Song of Solomon|ca|song|sos",
    "Isaiah|isa",
    "Jeremiah|jer",
    "Lamentations|la|lam",
    "Ezekiel|eze|ezek",
    "Daniel|da|dan",
    "Hosea|ho|hos",
    "Joel|joe",
    "Amos|am",
    "Obadiah|ob|obad",
    "Jonah|jon",
    "Micah|mic",
    "Nahum|na|nah",
    "Habakkuk|hab",
    "Zephaniah|zep|zeph",
    "Haggai|hag",
    "Zechariah|zec|zech",
    "Malachi|mal",
    "Matthew|mt|matt",
    "Mark|mr|mk",
    "Luke|lu|lk",
    "John|joh|jn",
    "Acts|ac",
    "Romans|ro|rom",
    "1 Corinthians|1co|1cor",
    "2 Corinthians|2co|2cor",
    "Galatians|ga|gal",
    "Ephesians|eph",
    "Philippians|php|phil",
    "Colossians|col",
    "1 Thessalonians|1th|1thess",
    "2 Thessalonians|2th|2thess",
    "1 Timothy|1ti|1tim",
    "2 Timothy|2ti|2tim",
    "Titus|tit",
    "Philemon|phm|philem",
    "Hebrews|heb",
    "James|jas",
    "1 Peter|1pe|1pet",
    "2 Peter|2pe|2pet",
    "1 John|1jo|1jn",
    "2 John|2jo|2jn",
    "3 John|3jo|3jn",
    "Jude",
    "Revelation|re|rev"
  ],
  pl: [
    "Rodzaju|rdz",
    "Wyj\u015Bcia|wj",
    "Kap\u0142a\u0144ska|kp\u0142|kpl",
    "Liczb|lb",
    "Powt\xF3rzonego Prawa|pwt",
    "Jozuego|joz",
    "S\u0119dzi\xF3w|sdz",
    "Rut|rt",
    "1 Samuela|1sm",
    "2 Samuela|2sm",
    "1 Kr\xF3l\xF3w|1krl",
    "2 Kr\xF3l\xF3w|2krl",
    "1 Kronik|1krn",
    "2 Kronik|2krn",
    "Ezdrasza|ezd",
    "Nehemiasza|ne",
    "Estery|est",
    "Hioba|hi",
    "Psalmy|ps",
    "Przys\u0142\xF3w|prz",
    "Kaznodziei|kzn|koh",
    "Pie\u015B\u0144 nad Pie\u015Bniami|pnp|pie\u015B\u0144|piesn",
    "Izajasza|iz",
    "Jeremiasza|jer|jr",
    "Lamentacje|lm",
    "Ezechiela|ez",
    "Daniela|dn",
    "Ozeasza|oz",
    "Joela|jl",
    "Amosa|am",
    "Abdiasza|ab|abd",
    "Jonasza|jon",
    "Micheasza|mi",
    "Nahuma|na",
    "Habakuka|ha|hab",
    "Sofoniasza|so|sof",
    "Aggeusza|ag",
    "Zachariasza|za",
    "Malachiasza|ml",
    "Mateusza|mt",
    "Marka|mk",
    "\u0141ukasza|\u0142k|lk",
    "Jana|j",
    "Dzieje|dz",
    "Rzymian|rz",
    "1 Koryntian|1ko|1kor",
    "2 Koryntian|2ko|2kor",
    "Galat\xF3w|ga",
    "Efezjan|ef",
    "Filipian|flp",
    "Kolosan|kol",
    "1 Tesaloniczan|1ts",
    "2 Tesaloniczan|2ts",
    "1 Tymoteusza|1tm",
    "2 Tymoteusza|2tm",
    "Tytusa|tt",
    "Filemona|flm",
    "Hebrajczyk\xF3w|hbr",
    "Jakuba|jak|jk",
    "1 Piotra|1p",
    "2 Piotra|2p",
    "1 Jana|1j",
    "2 Jana|2j",
    "3 Jana|3j",
    "Judy|jud",
    "Objawienie|ap|obj"
  ]
};
var BOEKEN = { nl: [], en: [], pl: [] };
for (const taal of TALEN) {
  BOEKEN[taal] = DATA[taal].map((regel, index) => {
    const [naam, ...afkortingen] = regel.split("|");
    return { nummer: index + 1, naam, afkortingen };
  });
}
function normaliseer(waarde) {
  return waarde.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[\s.]/g, "");
}
var AFKORTING_INDEX = {};
for (const taal of TALEN) {
  const index = /* @__PURE__ */ new Map();
  for (const boek of BOEKEN[taal]) {
    index.set(normaliseer(boek.naam), boek);
    for (const afkorting of boek.afkortingen) index.set(normaliseer(afkorting), boek);
  }
  AFKORTING_INDEX[taal] = index;
}
function zoekBoek(invoer, taal) {
  const sleutel = normaliseer(invoer);
  const exact = AFKORTING_INDEX[taal].get(sleutel);
  if (exact) return exact;
  const kandidaten = BOEKEN[taal].filter((boek) => normaliseer(boek.naam).startsWith(sleutel));
  if (sleutel.length >= 2 && kandidaten.length === 1) return kandidaten[0];
  if (kandidaten.length > 1) throw new Error(`"${invoer}" is dubbelzinnig: ${kandidaten.map((boek) => boek.naam).join(", ")}`);
  throw new Error(`Onbekend Bijbelboek (${TAAL_INFO[taal].naam}): "${invoer}"`);
}
function parseerVerzen(spec) {
  const verzen = [];
  for (const deel of spec.split(",")) {
    const bereik = /^\s*(\d+)\s*(?:[-–]\s*(\d+))?\s*$/.exec(deel);
    if (!bereik) throw new Error(`Ongeldige versaanduiding: "${spec}"`);
    const begin = Number(bereik[1]);
    const eind = bereik[2] ? Number(bereik[2]) : begin;
    if (eind < begin) throw new Error(`Ongeldig bereik: "${deel.trim()}"`);
    if (eind - begin > 500) throw new Error(`Bereik te groot: "${deel.trim()}"`);
    for (let vers = begin; vers <= eind; vers++) if (!verzen.includes(vers)) verzen.push(vers);
  }
  return verzen;
}
function parseerVerwijzing(waarde, taal, zoekTaal = taal) {
  const tekst = waarde.trim().replace(/\s+/g, " ");
  const treffer = /^((?:[1-3]\s*)?[^\d:;,]+?)\.?\s*(\d+)(?:\s*:\s*(.+))?$/.exec(tekst);
  if (!treffer) throw new Error(`Ongeldige verwijzing: "${waarde}"`);
  const gevonden = zoekBoek(treffer[1].trim(), zoekTaal);
  const boek = BOEKEN[taal][gevonden.nummer - 1];
  const hoofdstuk = Number(treffer[2]);
  if (hoofdstuk < 1) throw new Error(`Ongeldig hoofdstuk: "${waarde}"`);
  return { taal, boek, hoofdstuk, verzen: treffer[3] ? parseerVerzen(treffer[3]) : [] };
}
function parseerVerwijzingen(waarde, taal, zoekTaal = taal) {
  return waarde.split(/\r?\n|;/).map((deel) => deel.trim()).filter(Boolean).map((deel) => parseerVerwijzing(deel, taal, zoekTaal));
}
function formatteerVerzen(verzen) {
  const delen = [];
  for (let i = 0; i < verzen.length; ) {
    let j = i;
    while (j + 1 < verzen.length && verzen[j + 1] === verzen[j] + 1) j++;
    delen.push(j > i ? `${verzen[i]}-${verzen[j]}` : String(verzen[i]));
    i = j + 1;
  }
  return delen.join(",");
}

// node_modules/fflate/esm/browser.js
var u8 = Uint8Array;
var u16 = Uint16Array;
var i32 = Int32Array;
var fleb = new u8([
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  2,
  2,
  2,
  2,
  3,
  3,
  3,
  3,
  4,
  4,
  4,
  4,
  5,
  5,
  5,
  5,
  0,
  /* unused */
  0,
  0,
  /* impossible */
  0
]);
var fdeb = new u8([
  0,
  0,
  0,
  0,
  1,
  1,
  2,
  2,
  3,
  3,
  4,
  4,
  5,
  5,
  6,
  6,
  7,
  7,
  8,
  8,
  9,
  9,
  10,
  10,
  11,
  11,
  12,
  12,
  13,
  13,
  /* unused */
  0,
  0
]);
var clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
var freb = function(eb, start) {
  var b = new u16(31);
  for (var i = 0; i < 31; ++i) {
    b[i] = start += 1 << eb[i - 1];
  }
  var r = new i32(b[30]);
  for (var i = 1; i < 30; ++i) {
    for (var j = b[i]; j < b[i + 1]; ++j) {
      r[j] = j - b[i] << 5 | i;
    }
  }
  return { b, r };
};
var _a = freb(fleb, 2);
var fl = _a.b;
var revfl = _a.r;
fl[28] = 258, revfl[258] = 28;
var _b = freb(fdeb, 0);
var fd = _b.b;
var revfd = _b.r;
var rev = new u16(32768);
for (i = 0; i < 32768; ++i) {
  x = (i & 43690) >> 1 | (i & 21845) << 1;
  x = (x & 52428) >> 2 | (x & 13107) << 2;
  x = (x & 61680) >> 4 | (x & 3855) << 4;
  rev[i] = ((x & 65280) >> 8 | (x & 255) << 8) >> 1;
}
var x;
var i;
var hMap = (function(cd, mb, r) {
  var s = cd.length;
  var i = 0;
  var l = new u16(mb);
  for (; i < s; ++i) {
    if (cd[i])
      ++l[cd[i] - 1];
  }
  var le = new u16(mb);
  for (i = 1; i < mb; ++i) {
    le[i] = le[i - 1] + l[i - 1] << 1;
  }
  var co;
  if (r) {
    co = new u16(1 << mb);
    var rvb = 15 - mb;
    for (i = 0; i < s; ++i) {
      if (cd[i]) {
        var sv = i << 4 | cd[i];
        var r_1 = mb - cd[i];
        var v = le[cd[i] - 1]++ << r_1;
        for (var m = v | (1 << r_1) - 1; v <= m; ++v) {
          co[rev[v] >> rvb] = sv;
        }
      }
    }
  } else {
    co = new u16(s);
    for (i = 0; i < s; ++i) {
      if (cd[i]) {
        co[i] = rev[le[cd[i] - 1]++] >> 15 - cd[i];
      }
    }
  }
  return co;
});
var flt = new u8(288);
for (i = 0; i < 144; ++i)
  flt[i] = 8;
var i;
for (i = 144; i < 256; ++i)
  flt[i] = 9;
var i;
for (i = 256; i < 280; ++i)
  flt[i] = 7;
var i;
for (i = 280; i < 288; ++i)
  flt[i] = 8;
var i;
var fdt = new u8(32);
for (i = 0; i < 32; ++i)
  fdt[i] = 5;
var i;
var flrm = /* @__PURE__ */ hMap(flt, 9, 1);
var fdrm = /* @__PURE__ */ hMap(fdt, 5, 1);
var max = function(a) {
  var m = a[0];
  for (var i = 1; i < a.length; ++i) {
    if (a[i] > m)
      m = a[i];
  }
  return m;
};
var bits = function(d, p, m) {
  var o = p / 8 | 0;
  return (d[o] | d[o + 1] << 8) >> (p & 7) & m;
};
var bits16 = function(d, p) {
  var o = p / 8 | 0;
  return (d[o] | d[o + 1] << 8 | d[o + 2] << 16) >> (p & 7);
};
var shft = function(p) {
  return (p + 7) / 8 | 0;
};
var slc = function(v, s, e) {
  if (s == null || s < 0)
    s = 0;
  if (e == null || e > v.length)
    e = v.length;
  return new u8(v.subarray(s, e));
};
var ec = [
  "unexpected EOF",
  "invalid block type",
  "invalid length/literal",
  "invalid distance",
  "stream finished",
  "no stream handler",
  ,
  // determined by compression function
  "no callback",
  "invalid UTF-8 data",
  "extra field too long",
  "date not in range 1980-2099",
  "filename too long",
  "stream finishing",
  "invalid zip data"
  // determined by unknown compression method
];
var err = function(ind, msg, nt) {
  var e = new Error(msg || ec[ind]);
  e.code = ind;
  if (Error.captureStackTrace)
    Error.captureStackTrace(e, err);
  if (!nt)
    throw e;
  return e;
};
var inflt = function(dat, st, buf, dict) {
  var sl = dat.length, dl = dict ? dict.length : 0;
  if (!sl || st.f && !st.l)
    return buf || new u8(0);
  var noBuf = !buf;
  var resize = noBuf || st.i != 2;
  var noSt = st.i;
  if (noBuf)
    buf = new u8(sl * 3);
  var cbuf = function(l2) {
    var bl = buf.length;
    if (l2 > bl) {
      var nbuf = new u8(Math.max(bl * 2, l2));
      nbuf.set(buf);
      buf = nbuf;
    }
  };
  var final = st.f || 0, pos = st.p || 0, bt = st.b || 0, lm = st.l, dm = st.d, lbt = st.m, dbt = st.n;
  var tbts = sl * 8;
  do {
    if (!lm) {
      final = bits(dat, pos, 1);
      var type = bits(dat, pos + 1, 3);
      pos += 3;
      if (!type) {
        var s = shft(pos) + 4, l = dat[s - 4] | dat[s - 3] << 8, t = s + l;
        if (t > sl) {
          if (noSt)
            err(0);
          break;
        }
        if (resize)
          cbuf(bt + l);
        buf.set(dat.subarray(s, t), bt);
        st.b = bt += l, st.p = pos = t * 8, st.f = final;
        continue;
      } else if (type == 1)
        lm = flrm, dm = fdrm, lbt = 9, dbt = 5;
      else if (type == 2) {
        var hLit = bits(dat, pos, 31) + 257, hcLen = bits(dat, pos + 10, 15) + 4;
        var tl = hLit + bits(dat, pos + 5, 31) + 1;
        pos += 14;
        var ldt = new u8(tl);
        var clt = new u8(19);
        for (var i = 0; i < hcLen; ++i) {
          clt[clim[i]] = bits(dat, pos + i * 3, 7);
        }
        pos += hcLen * 3;
        var clb = max(clt), clbmsk = (1 << clb) - 1;
        var clm = hMap(clt, clb, 1);
        for (var i = 0; i < tl; ) {
          var r = clm[bits(dat, pos, clbmsk)];
          pos += r & 15;
          var s = r >> 4;
          if (s < 16) {
            ldt[i++] = s;
          } else {
            var c = 0, n = 0;
            if (s == 16)
              n = 3 + bits(dat, pos, 3), pos += 2, c = ldt[i - 1];
            else if (s == 17)
              n = 3 + bits(dat, pos, 7), pos += 3;
            else if (s == 18)
              n = 11 + bits(dat, pos, 127), pos += 7;
            while (n--)
              ldt[i++] = c;
          }
        }
        var lt = ldt.subarray(0, hLit), dt = ldt.subarray(hLit);
        lbt = max(lt);
        dbt = max(dt);
        lm = hMap(lt, lbt, 1);
        dm = hMap(dt, dbt, 1);
      } else
        err(1);
      if (pos > tbts) {
        if (noSt)
          err(0);
        break;
      }
    }
    if (resize)
      cbuf(bt + 131072);
    var lms = (1 << lbt) - 1, dms = (1 << dbt) - 1;
    var lpos = pos;
    for (; ; lpos = pos) {
      var c = lm[bits16(dat, pos) & lms], sym = c >> 4;
      pos += c & 15;
      if (pos > tbts) {
        if (noSt)
          err(0);
        break;
      }
      if (!c)
        err(2);
      if (sym < 256)
        buf[bt++] = sym;
      else if (sym == 256) {
        lpos = pos, lm = null;
        break;
      } else {
        var add = sym - 254;
        if (sym > 264) {
          var i = sym - 257, b = fleb[i];
          add = bits(dat, pos, (1 << b) - 1) + fl[i];
          pos += b;
        }
        var d = dm[bits16(dat, pos) & dms], dsym = d >> 4;
        if (!d)
          err(3);
        pos += d & 15;
        var dt = fd[dsym];
        if (dsym > 3) {
          var b = fdeb[dsym];
          dt += bits16(dat, pos) & (1 << b) - 1, pos += b;
        }
        if (pos > tbts) {
          if (noSt)
            err(0);
          break;
        }
        if (resize)
          cbuf(bt + 131072);
        var end = bt + add;
        if (bt < dt) {
          var shift = dl - dt, dend = Math.min(dt, end);
          if (shift + bt < 0)
            err(3);
          for (; bt < dend; ++bt)
            buf[bt] = dict[shift + bt];
        }
        for (; bt < end; ++bt)
          buf[bt] = buf[bt - dt];
      }
    }
    st.l = lm, st.p = lpos, st.b = bt, st.f = final;
    if (lm)
      final = 1, st.m = lbt, st.d = dm, st.n = dbt;
  } while (!final);
  return bt != buf.length && noBuf ? slc(buf, 0, bt) : buf.subarray(0, bt);
};
var et = /* @__PURE__ */ new u8(0);
var b2 = function(d, b) {
  return d[b] | d[b + 1] << 8;
};
var b4 = function(d, b) {
  return (d[b] | d[b + 1] << 8 | d[b + 2] << 16 | d[b + 3] << 24) >>> 0;
};
var b8 = function(d, b) {
  return b4(d, b) + b4(d, b + 4) * 4294967296;
};
function inflateSync(data, opts) {
  return inflt(data, { i: 2 }, opts && opts.out, opts && opts.dictionary);
}
var td = typeof TextDecoder != "undefined" && /* @__PURE__ */ new TextDecoder();
var tds = 0;
try {
  td.decode(et, { stream: true });
  tds = 1;
} catch (e) {
}
var dutf8 = function(d) {
  for (var r = "", i = 0; ; ) {
    var c = d[i++];
    var eb = (c > 127) + (c > 223) + (c > 239);
    if (i + eb > d.length)
      return { s: r, r: slc(d, i - 1) };
    if (!eb)
      r += String.fromCharCode(c);
    else if (eb == 3) {
      c = ((c & 15) << 18 | (d[i++] & 63) << 12 | (d[i++] & 63) << 6 | d[i++] & 63) - 65536, r += String.fromCharCode(55296 | c >> 10, 56320 | c & 1023);
    } else if (eb & 1)
      r += String.fromCharCode((c & 31) << 6 | d[i++] & 63);
    else
      r += String.fromCharCode((c & 15) << 12 | (d[i++] & 63) << 6 | d[i++] & 63);
  }
};
function strFromU8(dat, latin1) {
  if (latin1) {
    var r = "";
    for (var i = 0; i < dat.length; i += 16384)
      r += String.fromCharCode.apply(null, dat.subarray(i, i + 16384));
    return r;
  } else if (td) {
    return td.decode(dat);
  } else {
    var _a2 = dutf8(dat), s = _a2.s, r = _a2.r;
    if (r.length)
      err(8);
    return s;
  }
}
var slzh = function(d, b) {
  return b + 30 + b2(d, b + 26) + b2(d, b + 28);
};
var zh = function(d, b, z) {
  var fnl = b2(d, b + 28), efl = b2(d, b + 30), fn = strFromU8(d.subarray(b + 46, b + 46 + fnl), !(b2(d, b + 8) & 2048)), es = b + 46 + fnl;
  var _a2 = z64hs(d, es, efl, z, b4(d, b + 20), b4(d, b + 24), b4(d, b + 42)), sc = _a2[0], su = _a2[1], off = _a2[2];
  return [b2(d, b + 10), sc, su, fn, es + efl + b2(d, b + 32), off];
};
var z64hs = function(d, b, l, z, sc, su, off) {
  var nsc = sc == 4294967295, nsu = su == 4294967295, noff = off == 4294967295, e = b + l;
  var nf = nsc + nsu + noff;
  if (z && nf) {
    for (; b + 4 < e; b += 4 + b2(d, b + 2)) {
      if (b2(d, b) == 1) {
        return [
          nsc ? b8(d, b + 4 + 8 * nsu) : sc,
          nsu ? b8(d, b + 4) : su,
          noff ? b8(d, b + 4 + 8 * (nsu + nsc)) : off,
          1
        ];
      }
    }
    if (z < 2)
      err(13);
  }
  return [sc, su, off, 0];
};
function unzipSync(data, opts) {
  var files = {};
  var e = data.length - 22;
  for (; b4(data, e) != 101010256; --e) {
    if (!e || data.length - e > 65558)
      err(13);
  }
  ;
  var c = b2(data, e + 8);
  if (!c)
    return {};
  var o = b4(data, e + 16);
  var z = b4(data, e - 20) == 117853008;
  if (z) {
    var ze = b4(data, e - 12);
    z = b4(data, ze) == 101075792;
    if (z) {
      c = b4(data, ze + 32);
      o = b4(data, ze + 48);
    }
  }
  var fltr = opts && opts.filter;
  for (var i = 0; i < c; ++i) {
    var _a2 = zh(data, o, z), c_2 = _a2[0], sc = _a2[1], su = _a2[2], fn = _a2[3], no = _a2[4], off = _a2[5], b = slzh(data, off);
    o = no;
    if (!fltr || fltr({
      name: fn,
      size: sc,
      originalSize: su,
      compression: c_2
    })) {
      if (!c_2)
        files[fn] = slc(data, b, b + sc);
      else if (c_2 == 8)
        files[fn] = inflateSync(data.subarray(b, b + sc), { out: new u8(su) });
      else
        err(14, "unknown compression type " + c_2);
    }
  }
  return files;
}

// src/bible/daisy.ts
var PAD_SCHEIDING = /\/+$/;
var DaisyLezer = class {
  constructor(opslag, map, letter) {
    this.opslag = opslag;
    this.map = map;
    this.letter = letter;
    this.bronnen = /* @__PURE__ */ new Map();
    this.hoofdstukken = /* @__PURE__ */ new Map();
  }
  wis() {
    this.bronnen.clear();
    this.hoofdstukken.clear();
    this.zipCache = void 0;
  }
  async hoofdstuk(boek, nummer) {
    const sleutel = `${this.map()}|${boek}|${nummer}`;
    const bekend = this.hoofdstukken.get(sleutel);
    if (bekend) return bekend;
    const bron = await this.bron(boek);
    const naam = bestandsnaam(nummer);
    let xml;
    let smil;
    try {
      [xml, smil] = await Promise.all([bron.lees(`${naam}.xml`), bron.lees(`${naam}.smil`)]);
    } catch {
      throw new Error(`Hoofdstuk ${nummer} bestaat niet in dit Bijbelboek`);
    }
    const resultaat = parseerHoofdstuk(nummer, xml, smil);
    this.hoofdstukken.set(sleutel, resultaat);
    return resultaat;
  }
  async audio(boek, bestand) {
    return (await this.bron(boek)).leesBinair(bestand);
  }
  async bron(boek) {
    const bekend = this.bronnen.get(boek);
    if (bekend) return bekend;
    const map = this.map().replace(PAD_SCHEIDING, "");
    const inhoud = await this.opslag.lijst(map).catch(() => {
      throw new Error(`De Bijbelmap "${map}" is niet gevonden. Stel de juiste map in bij de instellingen.`);
    });
    const voorvoegsel = `nwt_${String(boek).padStart(2, "0")}_`;
    const basis = (pad) => pad.split("/").pop() ?? pad;
    const eind = `_${this.letter}.daisy`;
    const uitgepakt = inhoud.mappen.find((pad) => basis(pad).startsWith(voorvoegsel) && basis(pad).endsWith(eind));
    let bron;
    if (uitgepakt) {
      bron = {
        lees: (bestand) => this.opslag.leesTekst(`${uitgepakt}/${bestand}`),
        leesBinair: (bestand) => this.opslag.leesBinair(`${uitgepakt}/${bestand}`)
      };
    } else {
      const zip = inhoud.bestanden.find((pad) => basis(pad).startsWith(voorvoegsel) && basis(pad).endsWith(`${eind}.zip`));
      if (!zip) throw new Error(`Geen DAISY-bestand gevonden voor boek ${boek} in "${map}"`);
      bron = {
        lees: async (bestand) => new TextDecoder("utf-8").decode(await this.uitZip(zip, bestand)),
        leesBinair: (bestand) => this.uitZip(zip, bestand)
      };
    }
    this.bronnen.set(boek, bron);
    return bron;
  }
  async uitZip(zip, bestand) {
    if (this.zipCache?.pad !== zip) this.zipCache = { pad: zip, data: await this.opslag.leesBinair(zip) };
    const uitgepakt = unzipSync(this.zipCache.data, { filter: (item) => item.name === bestand });
    const data = uitgepakt[bestand];
    if (!data) throw new Error(`"${bestand}" ontbreekt in ${zip}`);
    return data;
  }
};
function bestandsnaam(hoofdstuk) {
  return String(hoofdstuk).padStart(4, "0");
}
function tijd(waarde) {
  const delen = waarde.split(":").map(Number);
  return delen.reduce((totaal, deel) => totaal * 60 + deel, 0);
}
function decodeer(tekst) {
  return tekst.replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16))).replace(/&#(\d+);/g, (_, getal) => String.fromCodePoint(Number(getal))).replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&");
}
var HEBREEUWSE_REGEL = /^[\u0590-\u05FF]+\s*(\[[^\]]*\])?$/;
function schoonTekst(html) {
  const regels = decodeer(html.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "")).split(/\r?\n/);
  return regels.map((regel) => regel.replace(/\s+/g, " ").trim()).filter((regel) => regel && !HEBREEUWSE_REGEL.test(regel)).join(" ");
}
function parseerHoofdstuk(nummer, xml, smil) {
  const fragmenten = /* @__PURE__ */ new Map();
  const volgorde = [];
  const par = /src="[^"#]*#([^"]+)"[^>]*\/>\s*<audio\s+src="([^"]+)"\s+clipBegin="([^"]+)"\s+clipEnd="([^"]+)"/g;
  for (const treffer of smil.matchAll(par)) {
    fragmenten.set(treffer[1], { bestand: treffer[2], begin: tijd(treffer[3]), einde: tijd(treffer[4]) });
    volgorde.push(treffer[1]);
  }
  const lichaam = xml.slice(xml.indexOf("<bodymatter>"));
  const verzen = [];
  let hoofdstukNummer;
  for (const span of lichaam.matchAll(/<span\s+id="([^"]+)"[^>]*>([\s\S]*?)<\/span>/g)) {
    const id = span[1];
    if (!fragmenten.has(id)) continue;
    const tekst = schoonTekst(span[2]);
    let vorige = verzen[verzen.length - 1]?.nummer ?? 0;
    const markeringen = [...tekst.matchAll(/(?:^|\s)(\d+):(\d+)(?=\s|$)/g)].filter((markering) => {
      const vers = Number(markering[2]);
      if (hoofdstukNummer !== void 0 && Number(markering[1]) !== hoofdstukNummer || vers <= vorige) return false;
      vorige = vers;
      return true;
    });
    const voorloop = (markeringen.length ? tekst.slice(0, markeringen[0].index) : tekst).trim();
    const laatste = verzen[verzen.length - 1];
    if (voorloop && laatste) {
      laatste.tekst = `${laatste.tekst} ${voorloop}`.trim();
      if (!laatste.spans.includes(id)) laatste.spans.push(id);
    }
    markeringen.forEach((markering, index) => {
      hoofdstukNummer ?? (hoofdstukNummer = Number(markering[1]));
      const start = (markering.index ?? 0) + markering[0].length;
      const eind = markeringen[index + 1]?.index ?? tekst.length;
      let vers = tekst.slice(start, eind).trim();
      if (!verzen.length) vers = vers.replace(new RegExp(`^${hoofdstukNummer}\\s+(?=\\D)`), "");
      verzen.push({ nummer: Number(markering[2]), tekst: vers, spans: [id] });
    });
  }
  const spans = volgorde.filter((id) => fragmenten.has(id)).map((id) => ({ id, fragment: fragmenten.get(id) }));
  return { nummer, verzen, spans };
}
function zoekVerzen(hoofdstuk, gevraagd) {
  if (!gevraagd.length) return hoofdstuk.verzen;
  return gevraagd.map((nummer) => {
    const vers = hoofdstuk.verzen.find((kandidaat) => kandidaat.nummer === nummer);
    if (!vers) throw new Error(`Vers ${nummer} bestaat niet in hoofdstuk ${hoofdstuk.nummer}`);
    return vers;
  });
}
function audioFragmenten(hoofdstuk, verzen) {
  const ids = new Set(verzen.flatMap((vers) => vers.spans));
  const fragmenten = [];
  for (const { id, fragment } of hoofdstuk.spans) {
    if (!ids.has(id)) continue;
    const vorige = fragmenten[fragmenten.length - 1];
    if (vorige && vorige.bestand === fragment.bestand && Math.abs(vorige.einde - fragment.begin) < 0.05) vorige.einde = fragment.einde;
    else fragmenten.push({ ...fragment });
  }
  return fragmenten;
}
var DAISY_NAAM = /^nwt_\d{2}_[^_]+_([A-Za-z])\.daisy(?:\.zip)?$/;
var OVERSLAAN = /* @__PURE__ */ new Set(["node_modules", "release"]);
async function vindDaisyMappen(opslag, wortels, maxDiepte = 4) {
  const telling = /* @__PURE__ */ new Map();
  const bezocht = /* @__PURE__ */ new Set();
  const basis = (pad) => pad.split("/").pop() ?? pad;
  async function loop(map, diepte) {
    if (bezocht.has(map)) return;
    bezocht.add(map);
    const inhoud = await opslag.lijst(map).catch(() => void 0);
    if (!inhoud) return;
    const mappen = inhoud.mappen.filter((pad) => !DAISY_NAAM.test(basis(pad)));
    for (const pad of [...inhoud.bestanden, ...inhoud.mappen]) {
      const treffer = DAISY_NAAM.exec(basis(pad));
      if (!treffer) continue;
      const letter = treffer[1].toUpperCase();
      const perMap = telling.get(letter) ?? /* @__PURE__ */ new Map();
      perMap.set(map, (perMap.get(map) ?? 0) + 1);
      telling.set(letter, perMap);
    }
    if (diepte >= maxDiepte) return;
    for (const pad of mappen) {
      const naam = basis(pad);
      if (!naam.startsWith(".") && !OVERSLAAN.has(naam)) await loop(pad, diepte + 1);
    }
  }
  for (const wortel of wortels) await loop(wortel, 0);
  const resultaat = /* @__PURE__ */ new Map();
  for (const [letter, perMap] of telling) {
    const beste = [...perMap.entries()].sort((a, b) => b[1] - a[1])[0];
    resultaat.set(letter, beste[0]);
  }
  return resultaat;
}

// main.ts
function standaardInstellingen() {
  const talen = {};
  for (const taal of TALEN) talen[taal] = { bijbelMap: TAAL_INFO[taal].bijbelMap, notitieMap: TAAL_INFO[taal].notitieMap };
  return { talen, zoekMap: "", laatsteTaal: "nl", laatsteZoekTaal: "" };
}
function laadInstellingen(data) {
  const instellingen = standaardInstellingen();
  if (!data) return instellingen;
  if (typeof data.bijbelMap === "string" && data.bijbelMap.trim()) instellingen.talen.nl.bijbelMap = data.bijbelMap.trim();
  if (typeof data.notitieMap === "string" && data.notitieMap.trim()) instellingen.talen.nl.notitieMap = data.notitieMap.trim();
  for (const taal of TALEN) {
    const opgeslagen = data.talen?.[taal];
    if (typeof opgeslagen?.bijbelMap === "string" && opgeslagen.bijbelMap.trim()) instellingen.talen[taal].bijbelMap = opgeslagen.bijbelMap.trim();
    if (typeof opgeslagen?.notitieMap === "string" && opgeslagen.notitieMap.trim()) instellingen.talen[taal].notitieMap = opgeslagen.notitieMap.trim();
  }
  if (typeof data.zoekMap === "string") instellingen.zoekMap = data.zoekMap.trim();
  if (TALEN.includes(data.laatsteTaal)) instellingen.laatsteTaal = data.laatsteTaal;
  if (TALEN.includes(data.laatsteZoekTaal)) instellingen.laatsteZoekTaal = data.laatsteZoekTaal;
  return instellingen;
}
var ScripturePlugin = class extends import_obsidian.Plugin {
  constructor() {
    super(...arguments);
    this.lezers = {};
    this.speler = new AudioSpeler(this);
  }
  async onload() {
    this.settings = laadInstellingen(await this.loadData());
    const adapter = this.app.vault.adapter;
    const fs = window.require?.("fs/promises");
    const extern = (pad) => Boolean(fs) && /^([a-zA-Z]:[\\/]|\/)/.test(pad);
    this.extern = extern;
    const opslag = {
      lijst: async (map) => {
        if (extern(map)) {
          const items = await fs.readdir(map, { withFileTypes: true });
          return {
            bestanden: items.filter((item) => item.isFile()).map((item) => `${map}/${item.name}`),
            mappen: items.filter((item) => item.isDirectory()).map((item) => `${map}/${item.name}`)
          };
        }
        const inhoud = await adapter.list(map);
        return { bestanden: inhoud.files, mappen: inhoud.folders };
      },
      leesTekst: (pad) => extern(pad) ? fs.readFile(pad, "utf8") : adapter.read(pad),
      leesBinair: async (pad) => new Uint8Array(extern(pad) ? await fs.readFile(pad) : await adapter.readBinary(pad))
    };
    this.opslag = opslag;
    for (const taal of TALEN) {
      const bijbelMap = () => {
        const map = this.settings.talen[taal].bijbelMap.trim() || TAAL_INFO[taal].bijbelMap;
        return extern(map) ? map : (0, import_obsidian.normalizePath)(map);
      };
      this.lezers[taal] = new DaisyLezer(opslag, bijbelMap, TAAL_INFO[taal].letter);
    }
    this.addSettingTab(new ScriptuurInstellingenTab(this.app, this));
    this.addCommand({
      id: "bijbeltekst",
      name: "Bijbeltekst opzoeken",
      callback: () => new BijbelModal(this.app, this, this.app.workspace.activeEditor?.editor).open()
    });
    for (const taal of TALEN) this.registerMarkdownCodeBlockProcessor(TAAL_INFO[taal].audioBlok, (bron, element) => this.toonAudioKnoppen(bron, element, taal));
  }
  onunload() {
    this.speler.stop();
  }
  async slaInstellingenOp() {
    await this.saveData(this.settings);
    for (const taal of TALEN) this.lezers[taal].wis();
  }
  async zoek(passage) {
    const hoofdstuk = await this.lezers[passage.taal].hoofdstuk(passage.boek.nummer, passage.hoofdstuk);
    const verzen = zoekVerzen(hoofdstuk, passage.verzen);
    return { passage: { ...passage, verzen: verzen.map((vers) => vers.nummer) }, verzen, fragmenten: audioFragmenten(hoofdstuk, verzen) };
  }
  async zoekAlles(invoer, taal, zoekTaal = taal) {
    const passages = parseerVerwijzingen(invoer, taal, zoekTaal);
    if (!passages.length) throw new Error("Vul een verwijzing in, bijvoorbeeld Joh 3:16");
    const resultaten = [];
    for (const passage of passages) resultaten.push(await this.zoek(passage));
    return resultaten;
  }
  laadAudio(taal, boek, bestand) {
    return this.lezers[taal].audio(boek, bestand);
  }
  // Zoekt in de kluis, de zoekmap en de mappen naast de ingestelde absolute paden naar DAISY-bestanden.
  async herkenPaden() {
    const wortels = [""];
    const voeg = (pad) => {
      const schoon = pad.trim().replace(/\/+$/, "");
      if (schoon && !wortels.includes(schoon)) wortels.push(schoon);
    };
    voeg(this.settings.zoekMap);
    for (const taal of TALEN) {
      const map = this.settings.talen[taal].bijbelMap.trim();
      if (this.extern(map) && map.lastIndexOf("/") > 0) voeg(map.slice(0, map.lastIndexOf("/")));
    }
    const gevonden = await vindDaisyMappen(this.opslag, wortels);
    const herkend = [];
    for (const taal of TALEN) {
      const map = gevonden.get(TAAL_INFO[taal].letter);
      if (!map) continue;
      this.settings.talen[taal].bijbelMap = map;
      herkend.push(taal);
    }
    await this.slaInstellingenOp();
    return herkend;
  }
  // Maakt per vers een notitie aan als die nog niet bestaat. Geeft het aantal nieuwe notities terug.
  async maakNotities(resultaten) {
    let nieuw = 0;
    let bestaand = 0;
    for (const resultaat of resultaten) {
      for (const vers of resultaat.verzen) {
        const pad = this.notitiePad(resultaat.passage, vers.nummer);
        if (this.app.vault.getAbstractFileByPath(pad) instanceof import_obsidian.TFile) {
          bestaand++;
          continue;
        }
        await this.maakMap(pad.slice(0, pad.lastIndexOf("/")));
        await this.app.vault.create(pad, notitieInhoud(resultaat.passage, vers));
        nieuw++;
      }
    }
    return { nieuw, bestaand };
  }
  notitieNaam(passage, vers) {
    return `${passage.boek.naam} ${passage.hoofdstuk}.${vers}`;
  }
  // Pad zonder .md; links gebruiken het hele pad omdat dezelfde boeknaam in meerdere talen voorkomt (bijv. Job).
  notitieLinkDoel(passage, vers) {
    const map = this.settings.talen[passage.taal].notitieMap.trim() || TAAL_INFO[passage.taal].notitieMap;
    return (0, import_obsidian.normalizePath)(`${map}/${this.notitieNaam(passage, vers)}`);
  }
  notitiePad(passage, vers) {
    return `${this.notitieLinkDoel(passage, vers)}.md`;
  }
  async maakMap(map) {
    let huidig = "";
    for (const deel of map.split("/").filter(Boolean)) {
      huidig = huidig ? `${huidig}/${deel}` : deel;
      if (!this.app.vault.getAbstractFileByPath(huidig)) await this.app.vault.createFolder(huidig);
    }
  }
  toonAudioKnoppen(bron, element, taal) {
    const container = element.createDiv("scriptuur-audio");
    const regels = bron.split(/\r?\n/).map((regel) => regel.trim()).filter(Boolean);
    for (const regel of regels) {
      const knop = container.createEl("button", { cls: "scriptuur-audio-knop", text: `\u{1F50A} ${regel}` });
      knop.addEventListener("click", async () => {
        try {
          await this.speler.speel(knop, taal, regel);
        } catch (fout) {
          new import_obsidian.Notice(foutTekst(fout));
        }
      });
    }
  }
};
function foutTekst(fout) {
  return fout instanceof Error ? fout.message : String(fout);
}
function notitieInhoud(passage, vers) {
  const verwijzing = `${passage.boek.naam} ${passage.hoofdstuk}:${vers.nummer}`;
  return `---
Type: Bijbel
Bijbelboek: ${passage.boek.naam}
Hoofdstuk: ${passage.hoofdstuk}
Vers: ${vers.nummer}
Aliases: ${verwijzing}
Taal: ${TAAL_INFO[passage.taal].naam}
---
${vers.tekst}
`;
}
function schrijfUit(resultaat, metKop) {
  const { passage, verzen } = resultaat;
  const delen = [];
  verzen.forEach((vers, index) => {
    if (index > 0 && vers.nummer > verzen[index - 1].nummer + 1) delen.push("\u2026");
    delen.push(`(${vers.nummer}) ${vers.tekst}`);
  });
  const tekst = delen.join(" ");
  return metKop ? `### ${passage.boek.naam} ${passage.hoofdstuk}
${tekst}` : tekst;
}
function lopendeTekst(resultaat) {
  const { verzen } = resultaat;
  if (verzen.length === 1) return verzen[0].tekst;
  return schrijfUit(resultaat, false);
}
function verwijzingTekst(passage) {
  return `${passage.boek.naam} ${passage.hoofdstuk}:${formatteerVerzen(passage.verzen)}`;
}
function maakLinks(plugin, resultaten) {
  let vorige;
  const links = [];
  for (const resultaat of resultaten) {
    for (const vers of resultaat.verzen) {
      const voorvoegsel = `${resultaat.passage.boek.naam} ${resultaat.passage.hoofdstuk}`;
      const alias = voorvoegsel === vorige ? String(vers.nummer) : `${voorvoegsel}:${vers.nummer}`;
      links.push(`[[${plugin.notitieLinkDoel(resultaat.passage, vers.nummer)}|${alias}]]`);
      vorige = voorvoegsel;
    }
  }
  return links.join(" ");
}
var BijbelModal = class extends import_obsidian.Modal {
  constructor(app, plugin, editor) {
    super(app);
    this.plugin = plugin;
    this.editor = editor;
  }
  onOpen() {
    this.titleEl.setText("Bijbeltekst");
    const bediening = this.contentEl.createDiv("scriptuur-bediening");
    bediening.createEl("small", { text: "Weergavetaal (tekst en notities)" });
    this.taalKeuze = bediening.createEl("select", { cls: "dropdown" });
    for (const taal of TALEN) this.taalKeuze.add(new Option(TAAL_INFO[taal].naam, taal));
    this.taalKeuze.value = this.plugin.settings.laatsteTaal;
    bediening.createEl("small", { text: "Zoektaal (taal van de boeknaam in je invoer)" });
    this.zoekTaalKeuze = bediening.createEl("select", { cls: "dropdown" });
    this.zoekTaalKeuze.add(new Option("Zelfde als weergavetaal", ""));
    for (const taal of TALEN) this.zoekTaalKeuze.add(new Option(TAAL_INFO[taal].naam, taal));
    this.zoekTaalKeuze.value = this.plugin.settings.laatsteZoekTaal;
    this.invoer = bediening.createEl("textarea", { cls: "scriptuur-invoer" });
    const werkBij = () => this.invoer.setAttribute("placeholder", TAAL_INFO[this.zoekTaal()].voorbeeld);
    this.taalKeuze.addEventListener("change", () => {
      this.plugin.settings.laatsteTaal = this.taal();
      void this.plugin.slaInstellingenOp();
      werkBij();
    });
    this.zoekTaalKeuze.addEventListener("change", () => {
      this.plugin.settings.laatsteZoekTaal = this.zoekTaalKeuze.value;
      void this.plugin.slaInstellingenOp();
      werkBij();
    });
    werkBij();
    this.invoer.addEventListener("keydown", (gebeurtenis) => {
      if (gebeurtenis.key === "Enter" && (gebeurtenis.ctrlKey || gebeurtenis.metaKey)) void this.toonVoorbeeld();
    });
    bediening.createEl("small", { text: "E\xE9n verwijzing per regel (of gescheiden door ;). Zonder vers wordt het hele hoofdstuk gebruikt." });
    const voorbeeldKnop = bediening.createEl("button", { text: "Voorbeeld" });
    voorbeeldKnop.addEventListener("click", () => void this.toonVoorbeeld());
    this.uitvoer = this.contentEl.createEl("pre", { cls: "scriptuur-voorbeeld" });
    const acties = this.contentEl.createDiv("scriptuur-acties");
    const heeftEditor = Boolean(this.editor);
    if (heeftEditor) {
      this.actie(acties, "Invoegen", () => this.invoegen());
      this.verwijzingMetTekst = this.actie(acties, "Verwijzen", () => this.verwijzen(), "Tekst uitschrijven");
      this.audioMetTekst = this.actie(acties, "Audio invoer", () => this.audioInvoer(), "Tekst uitschrijven");
    }
    this.actie(acties, "Notitie", () => this.notitie());
    this.invoer.focus();
  }
  taal() {
    return this.taalKeuze.value;
  }
  zoekTaal() {
    return this.zoekTaalKeuze.value || this.taalKeuze.value;
  }
  actie(houder, titel, uitvoeren, vinkje) {
    const rij = houder.createDiv("scriptuur-actie");
    const knop = rij.createEl("button", { text: titel, cls: "mod-cta" });
    knop.addEventListener("click", async () => {
      try {
        await uitvoeren();
      } catch (fout) {
        this.uitvoer.setText(foutTekst(fout));
      }
    });
    if (!vinkje) return void 0;
    const label = rij.createEl("label", { cls: "scriptuur-vinkje" });
    const selectie = label.createEl("input", { type: "checkbox" });
    label.createSpan({ text: vinkje });
    return selectie;
  }
  async toonVoorbeeld() {
    try {
      this.uitvoer.setText("Laden...");
      const resultaten = await this.plugin.zoekAlles(this.invoer.value, this.taal(), this.zoekTaal());
      this.uitvoer.setText(resultaten.map((resultaat) => schrijfUit(resultaat, true)).join("\n\n"));
    } catch (fout) {
      this.uitvoer.setText(foutTekst(fout));
    }
  }
  async verwerk() {
    const resultaten = await this.plugin.zoekAlles(this.invoer.value, this.taal(), this.zoekTaal());
    const { nieuw } = await this.plugin.maakNotities(resultaten);
    if (nieuw) new import_obsidian.Notice(`${nieuw} ${nieuw === 1 ? "notitie" : "notities"} aangemaakt`);
    return resultaten;
  }
  plaats(tekst) {
    this.editor?.replaceSelection(tekst);
    this.close();
  }
  async invoegen() {
    const resultaten = await this.verwerk();
    this.plaats(resultaten.map((resultaat) => schrijfUit(resultaat, true)).join("\n\n"));
  }
  async verwijzen() {
    const resultaten = await this.verwerk();
    if (!this.verwijzingMetTekst?.checked) return this.plaats(maakLinks(this.plugin, resultaten));
    const blokken = resultaten.map((resultaat) => `${lopendeTekst(resultaat)} \u2014 ${maakLinks(this.plugin, [resultaat])}`);
    this.plaats(blokken.join("\n\n"));
  }
  async notitie() {
    const resultaten = await this.plugin.zoekAlles(this.invoer.value, this.taal(), this.zoekTaal());
    const { nieuw, bestaand } = await this.plugin.maakNotities(resultaten);
    if (!nieuw) new import_obsidian.Notice(bestaand === 1 ? "De notitie bestaat al" : "De notities bestaan al");
    else if (bestaand) new import_obsidian.Notice(`${nieuw} aangemaakt; ${bestaand} bestonden al`);
    else new import_obsidian.Notice(`${nieuw} ${nieuw === 1 ? "notitie" : "notities"} aangemaakt`);
    this.close();
  }
  async audioInvoer() {
    const resultaten = await this.verwerk();
    const metTekst = Boolean(this.audioMetTekst?.checked);
    const blokken = resultaten.map((resultaat) => {
      const knop = `\`\`\`${TAAL_INFO[resultaat.passage.taal].audioBlok}
${verwijzingTekst(resultaat.passage)}
\`\`\``;
      return metTekst ? `${schrijfUit(resultaat, true)}

${knop}` : knop;
    });
    this.plaats(blokken.join("\n\n"));
  }
};
var AudioSpeler = class {
  constructor(plugin) {
    this.plugin = plugin;
    this.bronUrls = /* @__PURE__ */ new Map();
    this.ronde = 0;
  }
  stop() {
    this.ronde++;
    this.beeindig?.();
    this.beeindig = void 0;
    if (this.audio) {
      this.audio.pause();
      this.audio.src = "";
      this.audio = void 0;
    }
    if (this.knop) {
      this.knop.removeClass("is-actief");
      this.knop.setText(this.knop.dataset.label ?? this.knop.getText());
      this.knop = void 0;
    }
    for (const url of this.bronUrls.values()) URL.revokeObjectURL(url);
    this.bronUrls.clear();
  }
  async speel(knop, taal, verwijzing) {
    const wasActief = this.knop === knop;
    this.stop();
    if (wasActief) return;
    const label = knop.getText();
    knop.dataset.label = label;
    this.knop = knop;
    knop.addClass("is-actief");
    knop.setText(`\u23F3 ${verwijzing}`);
    const ronde = this.ronde;
    try {
      const resultaat = await this.plugin.zoek(parseerVerwijzing(verwijzing, taal));
      const boek = resultaat.passage.boek.nummer;
      for (let i = 0; i < resultaat.fragmenten.length; i++) {
        if (ronde !== this.ronde) return;
        const fragment = resultaat.fragmenten[i];
        const url = await this.url(taal, boek, fragment.bestand);
        if (ronde !== this.ronde) return;
        if (i === 0) knop.setText(`\u23F9 ${verwijzing}`);
        await this.afspelen(url, fragment, ronde);
      }
    } finally {
      if (ronde === this.ronde) this.stop();
    }
  }
  async url(taal, boek, bestand) {
    const sleutel = `${taal}/${boek}/${bestand}`;
    const bekend = this.bronUrls.get(sleutel);
    if (bekend) return bekend;
    const data = await this.plugin.laadAudio(taal, boek, bestand);
    const url = URL.createObjectURL(new Blob([data], { type: "audio/mpeg" }));
    this.bronUrls.set(sleutel, url);
    return url;
  }
  afspelen(url, fragment, ronde) {
    return new Promise((klaar, fout) => {
      const audio = new Audio(url);
      this.audio = audio;
      const einde = () => {
        this.beeindig = void 0;
        audio.removeEventListener("timeupdate", controle);
        audio.pause();
        klaar();
      };
      this.beeindig = einde;
      const controle = () => {
        if (ronde !== this.ronde || audio.currentTime >= fragment.einde - 0.03) einde();
      };
      audio.addEventListener("timeupdate", controle);
      audio.addEventListener("ended", einde);
      audio.addEventListener("error", () => fout(new Error("De audio kan niet worden afgespeeld")));
      audio.addEventListener("loadedmetadata", () => {
        audio.currentTime = fragment.begin;
        audio.play().catch(fout);
      });
    });
  }
};
var ScriptuurInstellingenTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    this.containerEl.empty();
    new import_obsidian.Setting(this.containerEl).setName("Paden automatisch herkennen").setDesc("Zoekt in de kluis (en in de zoekmap hieronder) naar DAISY-bestanden en stelt per taal de Bijbelmap in. Mappen naast een al ingesteld absoluut pad worden ook doorzocht.").addButton(
      (knop) => knop.setButtonText("Herkennen").setCta().onClick(async () => {
        knop.setDisabled(true);
        try {
          const herkend = await this.plugin.herkenPaden();
          const gemist = TALEN.filter((taal) => !herkend.includes(taal)).map((taal) => TAAL_INFO[taal].naam);
          new import_obsidian.Notice(herkend.length ? `Herkend: ${herkend.map((taal) => TAAL_INFO[taal].naam).join(", ")}${gemist.length ? `. Niet gevonden: ${gemist.join(", ")}` : ""}` : "Geen DAISY-bestanden gevonden. Vul een zoekmap in en probeer opnieuw.");
          this.display();
        } catch (fout) {
          new import_obsidian.Notice(foutTekst(fout));
        } finally {
          knop.setDisabled(false);
        }
      })
    );
    new import_obsidian.Setting(this.containerEl).setName("Zoekmap (optioneel)").setDesc("Extra map om in te zoeken, relatief aan de kluis of een absoluut pad, bijvoorbeeld /home/daniel/Programming/Obsidian-Scripture.").addText(
      (tekst) => tekst.setValue(this.plugin.settings.zoekMap).onChange(async (waarde) => {
        this.plugin.settings.zoekMap = waarde.trim();
        await this.plugin.slaInstellingenOp();
      })
    );
    for (const taal of TALEN) {
      const info = TAAL_INFO[taal];
      new import_obsidian.Setting(this.containerEl).setName(info.naam).setHeading();
      new import_obsidian.Setting(this.containerEl).setName("Bijbelmap (DAISY)").setDesc(`Map met de ${info.naam.toLowerCase()}e DAISY-bestanden (nwt_01_Ge_${info.letter}.daisy.zip of een uitgepakte map). Relatief aan de kluis, of een absoluut pad.`).addText(
        (tekst) => tekst.setValue(this.plugin.settings.talen[taal].bijbelMap).onChange(async (waarde) => {
          this.plugin.settings.talen[taal].bijbelMap = waarde.trim() || info.bijbelMap;
          await this.plugin.slaInstellingenOp();
        })
      );
      new import_obsidian.Setting(this.containerEl).setName("Notitiemap").setDesc("Map waarin de Bijbelnotities (\xE9\xE9n per vers) worden aangemaakt.").addText(
        (tekst) => tekst.setValue(this.plugin.settings.talen[taal].notitieMap).onChange(async (waarde) => {
          this.plugin.settings.talen[taal].notitieMap = waarde.trim() || info.notitieMap;
          await this.plugin.slaInstellingenOp();
        })
      );
    }
    new import_obsidian.Setting(this.containerEl).setName("Bijbeltekst opzoeken").addButton((knop) => knop.setButtonText("Openen").onClick(() => new BijbelModal(this.app, this.plugin, this.app.workspace.activeEditor?.editor).open()));
  }
};
