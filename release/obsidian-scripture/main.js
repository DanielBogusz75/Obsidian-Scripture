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
var import_obsidian2 = require("obsidian");

// src/bible/epubReader.ts
var import_obsidian = require("obsidian");

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

// src/bible/aliases.ts
var BOOK_FULL_NAMES = {
  en: { genesis: 1, exodus: 2, leviticus: 3, numbers: 4, deuteronomy: 5, joshua: 6, judges: 7, ruth: 8, "1 samuel": 9, "2 samuel": 10, "1 kings": 11, "2 kings": 12, "1 chronicles": 13, "2 chronicles": 14, ezra: 15, nehemiah: 16, esther: 17, job: 18, psalms: 19, psalm: 19, proverbs: 20, ecclesiastes: 21, "song of solomon": 22, isaiah: 23, jeremiah: 24, lamentations: 25, ezekiel: 26, daniel: 27, hosea: 28, joel: 29, amos: 30, obadiah: 31, jonah: 32, micah: 33, nahum: 34, habakkuk: 35, zephaniah: 36, haggai: 37, zechariah: 38, malachi: 39, matthew: 40, mark: 41, luke: 42, john: 43, jhon: 43, acts: 44, romans: 45, "1 corinthians": 46, "2 corinthians": 47, galatians: 48, ephesians: 49, philippians: 50, colossians: 51, "1 thessalonians": 52, "2 thessalonians": 53, "1 timothy": 54, "2 timothy": 55, titus: 56, philemon: 57, hebrews: 58, james: 59, "1 peter": 60, "2 peter": 61, "1 john": 62, "2 john": 63, "3 john": 64, jude: 65, revelation: 66 },
  nl: { genesis: 1, exodus: 2, leviticus: 3, numeri: 4, deuteronomium: 5, jozua: 6, richteren: 7, ruth: 8, "1 samuel": 9, "2 samuel": 10, "1 koningen": 11, "2 koningen": 12, "1 kronieken": 13, "2 kronieken": 14, ezra: 15, nehemia: 16, esther: 17, job: 18, psalmen: 19, spreuken: 20, prediker: 21, hooglied: 22, jesaja: 23, jeremia: 24, klaagliederen: 25, ezechi\u00EBl: 26, daniel: 27, hosea: 28, jo\u00EBl: 29, amos: 30, obadja: 31, jona: 32, micha: 33, nahum: 34, habakuk: 35, zefanja: 36, hagga\u00EF: 37, zacharia: 38, maleachi: 39, matthe\u00FCs: 40, markus: 41, lukas: 42, johannes: 43, joh: 43, handelingen: 44, romeinen: 45, "1 korinthi\xEBrs": 46, "2 korinthi\xEBrs": 47, galaten: 48, efezi\u00EBrs: 49, filipenzen: 50, kolossenzen: 51, "1 thessalonicenzen": 52, "2 thessalonicenzen": 53, "1 timothe\xFCs": 54, "2 timothe\xFCs": 55, titus: 56, filemon: 57, hebree\u00EBn: 58, jakobus: 59, "1 petrus": 60, "2 petrus": 61, "1 johannes": 62, "2 johannes": 63, "3 johannes": 64, judas: 65, openbaring: 66 },
  pl: { "rodzaju": 1, "wyj\u015Bcia": 2, "kap\u0142a\u0144ska": 3, liczb: 4, "powt\xF3rzonego prawa": 5, jozuego: 6, "s\u0119dzi\xF3w": 7, rut: 8, "1 samuela": 9, "2 samuela": 10, "1 kr\xF3lewska": 11, "2 kr\xF3lewska": 12, "1 kronik": 13, "2 kronik": 14, ezdrasza: 15, nehemiasza: 16, estery: 17, hioba: 18, "psalm\xF3w": 19, "przys\u0142\xF3w": 20, kaznodziei: 21, "pie\u015B\u0144 nad pie\u015Bniami": 22, izajasza: 23, jeremiasza: 24, lamentacji: 25, ezechiela: 26, daniela: 27, ozeasza: 28, joela: 29, amosa: 30, abdiasza: 31, jonasza: 32, micheasza: 33, nahuma: 34, habakuka: 35, sofoniasza: 36, aggeusza: 37, zachariasza: 38, malachiasza: 39, mateusza: 40, marka: 41, \u0142ukasza: 42, jana: 43, dzieje: 44, rzymian: 45, "1 koryntian": 46, "2 koryntian": 47, galat\u00F3w: 48, efezjan: 49, filipian: 50, kolosan: 51, "1 tesaloniczan": 52, "2 tesaloniczan": 53, "1 tymoteusza": 54, "2 tymoteusza": 55, tytusa: 56, filemona: 57, hebrajczyk\u00F3w: 58, jakuba: 59, "1 piotra": 60, "2 piotra": 61, "1 jana": 62, "2 jana": 63, "3 jana": 64, judy: 65, objawienie: 66 }
};
var BOOK_ABBREVIATIONS = {
  en: { ge: 1, ex: 2, le: 3, nu: 4, de: 5, jos: 6, jg: 7, ru: 8, "1sa": 9, "2sa": 10, "1ki": 11, "2ki": 12, "1ch": 13, "2ch": 14, ezr: 15, ne: 16, es: 17, ps: 19, pr: 20, ec: 21, ca: 22, isa: 23, jer: 24, la: 25, eze: 26, da: 27, ho: 28, joe: 29, am: 30, ob: 31, jon: 32, mic: 33, na: 34, hab: 35, zep: 36, hag: 37, zec: 38, mal: 39, mt: 40, mr: 41, lu: 42, joh: 43, ac: 44, ro: 45, "1co": 46, "2co": 47, ga: 48, eph: 49, php: 50, col: 51, "1th": 52, "2th": 53, "1ti": 54, "2ti": 55, tit: 56, phm: 57, heb: 58, jas: 59, "1pe": 60, "2pe": 61, "1jo": 62, "2jo": 63, "3jo": 64, re: 66 },
  nl: { ge: 1, ex: 2, le: 3, nu: 4, de: 5, joz: 6, ri: 7, ru: 8, "1sa": 9, "2sa": 10, "1kon": 11, "2kon": 12, "1kr": 13, "2kr": 14, ezr: 15, ne: 16, est: 17, ps: 19, sp: 20, pred: 21, hgl: 22, jes: 23, jer: 24, kl: 25, ez: 26, da: 27, ho: 28, joe: 29, am: 30, ob: 31, jon: 32, mi: 33, na: 34, hab: 35, sef: 36, hag: 37, za: 38, mal: 39, mt: 40, mr: 41, lu: 42, joh: 43, han: 44, ro: 45, "1kor": 46, "2kor": 47, ga: 48, ef: 49, fil: 50, kol: 51, "1th": 52, "2th": 53, "1tim": 54, "2tim": 55, tit: 56, flm: 57, heb: 58, jak: 59, "1pe": 60, "2pe": 61, "1joh": 62, "2joh": 63, "3joh": 64, jud: 65, opb: 66 },
  pl: { rdz: 1, wj: 2, "kp\u0142": 3, lb: 4, pwt: 5, joz: 6, sdz: 7, rt: 8, "1sm": 9, "2sm": 10, "1krl": 11, "2krl": 12, "1krn": 13, "2krn": 14, ezd: 15, ne: 16, est: 17, hi: 18, ps: 19, prz: 20, kzn: 21, pnp: 22, iz: 23, jer: 24, lm: 25, ez: 26, dn: 27, oz: 28, jl: 29, am: 30, ab: 31, jon: 32, mi: 33, na: 34, ha: 35, so: 36, ag: 37, za: 38, ml: 39, mt: 40, mk: 41, "\u0142k": 42, j: 43, dz: 44, rz: 45, "1ko": 46, "2ko": 47, ga: 48, ef: 49, flp: 50, kol: 51, "1ts": 52, "2ts": 53, "1tm": 54, "2tm": 55, tt: 56, flm: 57, hbr: 58, jak: 59, "1p": 60, "2p": 61, "1j": 62, "2j": 63, "3j": 64, jud: 65, ap: 66 }
};
var COMMON_ABBREVIATIONS = {
  en: { gen: 1, exod: 2, lev: 3, num: 4, deut: 5, josh: 6, judg: 7, "1 sam": 9, "2 sam": 10, "1 kgs": 11, "2 kgs": 12, "1 chron": 13, "2 chron": 14, neh: 16, esth: 17, psa: 19, prov: 20, eccl: 21, song: 22, isa: 23, jer: 24, lam: 25, ezek: 26, dan: 27, hos: 28, obad: 31, mic: 33, nah: 34, zeph: 36, zech: 38, mal: 39, matt: 40, rom: 45, "1 cor": 46, "2 cor": 47, gal: 48, phil: 50, "1 thess": 52, "2 thess": 53, "1 tim": 54, "2 tim": 55, philem: 57, heb: 58, james: 59, "1 pet": 60, "2 pet": 61, rev: 66 },
  nl: { gen: 1, lev: 3, num: 4, deut: 5, joz: 6, recht: 7, "1 sam": 9, "2 sam": 10, "1 kon": 11, "2 kon": 12, "1 kron": 13, "2 kron": 14, neh: 16, spr: 20, hoogl: 22, klaagl: 25, nah: 34, zach: 38, matt: 40, marc: 41, luc: 42, hand: 44, rom: 45, "1 kor": 46, "2 kor": 47, gal: 48, filip: 50, "1 tess": 52, "2 tess": 53, "1 tim": 54, "2 tim": 55, tit: 56, filem: 57, "1 petr": 60, "2 petr": 61, "1 joh": 62, "2 joh": 63, "3 joh": 64, openb: 66 },
  pl: { koh: 21, jr: 24, abd: 31, hab: 35, sof: 36, jk: 59 }
};
var BOOK_ALIASES = {
  en: { ...BOOK_FULL_NAMES.en, ...BOOK_ABBREVIATIONS.en, ...COMMON_ABBREVIATIONS.en },
  nl: { ...BOOK_FULL_NAMES.nl, ...BOOK_ABBREVIATIONS.nl, ...COMMON_ABBREVIATIONS.nl },
  pl: { ...BOOK_FULL_NAMES.pl, ...BOOK_ABBREVIATIONS.pl, ...COMMON_ABBREVIATIONS.pl }
};
function parseReference(value, language) {
  const normalized = value.trim().replace(/\.(?=\s+\d+:)/, "").replace(/\s+/g, " ");
  const aliases = [.../* @__PURE__ */ new Set([...Object.keys(BOOK_ALIASES[language]), ...Object.keys(BOOK_ALIASES.en)])].sort((a, b) => b.length - a.length);
  const match = new RegExp(`^(${aliases.map(escapeRegExp).join("|")})\\s+(\\d+):(\\d+(?:[-,]\\d+)*)$`, "i").exec(normalized);
  if (!match) throw new Error(`Unsupported scripture reference: ${value}`);
  const normalizedBook = match[1].toLocaleLowerCase();
  const bookNumber = BOOK_ALIASES[language][normalizedBook] ?? BOOK_ALIASES.en[normalizedBook];
  const book = BOOK_NAMES[language][bookNumber] ?? BOOK_NAMES.en[bookNumber] ?? titleCase(match[1]);
  const verseParts = match[3].split(",").flatMap((part) => {
    const [start, end] = part.split("-").map(Number);
    return end ? Array.from({ length: end - start + 1 }, (_, index) => start + index) : [start];
  });
  return { book, bookNumber, chapter: Number(match[2]), verseStart: verseParts[0], verseEnd: verseParts.length > 1 ? verseParts[verseParts.length - 1] : null, verses: [...new Set(verseParts)] };
}
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
var BOOK_NAMES = Object.keys(BOOK_FULL_NAMES).reduce((languages, language) => {
  const names = {};
  for (const [alias, number] of Object.entries(BOOK_FULL_NAMES[language])) {
    if (!(number in names)) names[number] = titleCase(alias);
  }
  languages[language] = names;
  return languages;
}, {});
function titleCase(value) {
  const lowercaseWords = /* @__PURE__ */ new Set(["of"]);
  return value.split(" ").map((word, index) => index > 0 && lowercaseWords.has(word) ? word : word.charAt(0).toLocaleUpperCase() + word.slice(1)).join(" ");
}

// src/bible/epubReader.ts
var EpubReader = class {
  constructor(app) {
    this.app = app;
    this.books = /* @__PURE__ */ new Map();
  }
  async fetch(referenceText, language, epubPath) {
    const reference = parseReference(referenceText, language);
    const files = await this.open(epubPath);
    const navigation = this.decode(files[`OEBPS/biblechapternav${reference.bookNumber}.xhtml`]);
    const navigationDocument = new DOMParser().parseFromString(navigation, "application/xhtml+xml");
    const chapterLink = [...navigationDocument.querySelectorAll("a")].find((link) => link.textContent?.trim() === String(reference.chapter));
    if (!chapterLink) throw new Error(`Chapter not found in ${epubPath}: ${referenceText}`);
    const chapterPath = resolvePath("OEBPS/biblechapternav", chapterLink.getAttribute("href") ?? "", files);
    const chapterDocument = new DOMParser().parseFromString(this.decode(files[chapterPath]), "application/xhtml+xml");
    const footnotes = [];
    const verses = reference.verses.map((verseNumber) => {
      const verseId = `chapter${reference.chapter}_verse${verseNumber}`;
      const verse = chapterDocument.getElementById(verseId);
      if (!verse) throw new Error(`Verse not found in ${epubPath}: ${referenceText}`);
      const text = [];
      let node = verse.nextSibling;
      while (node) {
        if (node.nodeType === Node.ELEMENT_NODE && node.id?.startsWith(`chapter${reference.chapter}_verse`)) break;
        text.push(nodeToText(node, chapterDocument, footnotes));
        node = node.nextSibling;
      }
      const verseText = cleanVerseText(text.join(" "), verseNumber);
      return { verseNumber, text: verseText };
    });
    return { text: verses.map((verse) => `${verse.verseNumber} ${verse.text}`).join(" "), verseTexts: verses.map((verse) => verse.text), footnotes, location: `${chapterPath}#chapter${reference.chapter}_verse${reference.verses[0]}`, book: reference.book, chapter: reference.chapter, verses: reference.verses };
  }
  async open(epubPath) {
    let archive = this.books.get(epubPath);
    if (!archive) {
      const file = this.app.vault.getAbstractFileByPath(epubPath);
      if (!(file instanceof import_obsidian.TFile) || file.extension.toLowerCase() !== "epub") throw new Error(`EPUB file not found in the vault: ${epubPath}`);
      archive = this.app.vault.readBinary(file).then((bytes) => unzipSync(new Uint8Array(bytes)));
      this.books.set(epubPath, archive);
    }
    return archive;
  }
  decode(bytes) {
    if (!bytes) throw new Error("EPUB content file is missing");
    return new TextDecoder("utf-8").decode(bytes);
  }
};
function cleanVerseText(value, verseNumber) {
  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized.replace(/^\d+(?:\s+\d+)*\s+/, "").trim();
}
function nodeToText(node, document2, footnotes) {
  if (node.nodeType !== Node.ELEMENT_NODE) return node.textContent ?? "";
  const element = node;
  const children = [...element.childNodes].map((child) => nodeToText(child, document2, footnotes)).join("");
  const href = element.getAttribute("href") ?? "";
  if (/^https?:\/\//i.test(href)) return `[${children}](${href})`;
  if (href.startsWith("#")) {
    const target = document2.getElementById(href.slice(1));
    if (target?.getAttribute("epub:type") === "footnote") {
      const content = (target.textContent ?? "").replace(/\s+/g, " ").trim();
      let index = footnotes.indexOf(content);
      if (index < 0) {
        footnotes.push(content);
        index = footnotes.length - 1;
      }
      return `[^${index + 1}]`;
    }
  }
  return children;
}
function resolvePath(_base, href, files) {
  const path = href.split("#")[0];
  if (files[`OEBPS/${path}`]) return `OEBPS/${path}`;
  const match = Object.keys(files).find((name) => name.endsWith(`/${path}`));
  if (!match) throw new Error(`EPUB chapter file is missing: ${path}`);
  return match;
}

// main.ts
var LANGUAGE_LABELS = { en: "English", nl: "Dutch", pl: "Polish" };
var DEFAULT_SETTINGS = {
  translations: [
    { name: "Dutch", language: "nl", path: "bibles/nwt_O.epub" },
    { name: "English", language: "en", path: "bibles/nwt_E.epub" },
    { name: "Polish", language: "pl", path: "" }
  ],
  notesFolder: "Bible"
};
var ScripturePlugin = class extends import_obsidian2.Plugin {
  async onload() {
    this.settings = mergeSettings(await this.loadData());
    this.reader = new EpubReader(this.app);
    this.addSettingTab(new ScriptureSettingTab(this.app, this));
    this.addCommand({
      id: "scripture-search",
      name: "Scripture Search",
      callback: () => new BibleLookupModal(this.app, this, this.app.workspace.activeEditor?.editor).open()
    });
  }
  /*
   * Bible references are intentionally command-only. Obsidian owns wiki-link
   * rendering, so automatic link interception is avoided here.
   */
  async decorateBibleLinks(element, _context) {
    this.repairBibleElements(element);
    this.convertRawBibleText(element);
    const textNodes = [];
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    let node;
    while (node = walker.nextNode()) {
      if (!node.parentElement?.closest("a, .internal-embed")) textNodes.push(node);
    }
    for (const textNode of textNodes) {
      const pattern = /(!?)\[\[(bible\d*:[^\]|]+)(?:\|([^\]]+))?\]\]|(!?)\[([^\]]+)\]\((#?bible\d*:[^)]+)\)/gi;
      if (!pattern.test(textNode.nodeValue ?? "")) continue;
      pattern.lastIndex = 0;
      const fragment = document.createDocumentFragment();
      let lastIndex = 0;
      for (const match of textNode.nodeValue.matchAll(pattern)) {
        fragment.append(textNode.nodeValue.slice(lastIndex, match.index));
        const isEmbed = Boolean(match[1] || match[4]);
        const target = match[2] ?? match[6];
        if (isEmbed) {
          const inline = document.createElement("span");
          inline.addClass("obsidian-scripture-inline");
          inline.setText("Loading verse...");
          fragment.append(inline);
          void this.loadVerse(inline, target, true);
        } else {
          const link = document.createElement("a");
          link.textContent = match[3] ?? match[5] ?? target.replace(/^#?bible\d*:/i, "");
          link.setAttribute("href", "#");
          link.setAttribute("data-bible-href", target);
          fragment.append(link);
        }
        lastIndex = match.index + match[0].length;
      }
      fragment.append(textNode.nodeValue.slice(lastIndex));
      textNode.replaceWith(fragment);
    }
    for (const link of Array.from(element.querySelectorAll('a[data-bible-href], a.internal-link, a[href^="bible"], a[href^="#bible"]'))) {
      const bibleHref = link.dataset.bibleHref ?? link.getAttribute("data-href") ?? link.getAttribute("href")?.replace(/^#/, "") ?? "";
      const parsed = parseBibleLink(bibleHref);
      if (!parsed) continue;
      const controlledLink = link.dataset.bibleControlled === "true" ? link : this.replaceBibleLink(link, bibleHref);
      let popup;
      const show = async () => {
        if (popup) return;
        popup = document.createElement("div");
        popup.addClass("obsidian-scripture-preview");
        document.body.appendChild(popup);
        const rect = controlledLink.getBoundingClientRect();
        popup.style.left = `${Math.max(8, Math.min(rect.left, window.innerWidth - 420))}px`;
        popup.style.top = `${rect.bottom + 6}px`;
        await this.loadVerse(popup, bibleHref, false);
      };
      const hide = () => {
        popup?.remove();
        popup = void 0;
      };
      this.registerDomEvent(controlledLink, "mouseenter", () => void show());
      this.registerDomEvent(controlledLink, "mouseleave", () => window.setTimeout(hide, 250));
      this.registerDomEvent(controlledLink, "click", (event) => {
        event.preventDefault();
        void show();
      });
    }
    for (const embed of Array.from(element.querySelectorAll(".internal-embed"))) {
      const bibleHref = embed.dataset.bibleHref ?? embed.getAttribute("src") ?? embed.getAttribute("href") ?? embed.textContent ?? "";
      if (!parseBibleLink(bibleHref)) continue;
      const inline = document.createElement("span");
      inline.addClass("obsidian-scripture-inline");
      inline.setText("Loading verse...");
      embed.replaceWith(inline);
      void this.loadVerse(inline, bibleHref, true);
    }
  }
  convertRawBibleText(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    let node;
    while (node = walker.nextNode()) {
      if (node.parentElement?.closest("a, .internal-embed, .cm-editor")) continue;
      if (/!?\[[^\]]+\]\((?:#?bible\d*):[^)]+\)/i.test(node.nodeValue ?? "") || /(?:^|\n)\s*(?:#?bible\d*):.+\s*$/im.test(node.nodeValue ?? "")) nodes.push(node);
    }
    for (const textNode of nodes) {
      const pattern = /(!?)\[([^\]]+)\]\(((?:#?bible\d*):[^)]+)\)|(^|\n)(\s*)((?:#?bible\d*):.+?)(?=\n|$)/gi;
      const value = textNode.nodeValue ?? "";
      const fragment = document.createDocumentFragment();
      let lastIndex = 0;
      for (const match of value.matchAll(pattern)) {
        fragment.append(value.slice(lastIndex, match.index));
        const target = match[3] ?? match[6];
        const label = match[2] ?? target.replace(/^#?bible\d*:/i, "");
        if (match[1] || match[4] !== void 0) {
          const inline = document.createElement("span");
          inline.addClass("obsidian-scripture-inline");
          inline.setText("Loading verse...");
          fragment.append(inline);
          void this.loadVerse(inline, target, true);
        } else {
          const link = document.createElement("a");
          link.textContent = label;
          link.setAttribute("href", "#");
          link.dataset.bibleHref = target;
          fragment.append(link);
        }
        lastIndex = match.index + match[0].length;
      }
      fragment.append(value.slice(lastIndex));
      textNode.replaceWith(fragment);
    }
  }
  repairBibleElements(root) {
    const candidates = [root, ...Array.from(root.querySelectorAll("a, .internal-link, .internal-embed"))];
    for (const candidate of candidates) {
      if (candidate.dataset.bibleRepaired === "true") continue;
      const href = candidate.dataset.bibleHref ?? candidate.getAttribute("data-href") ?? candidate.getAttribute("href") ?? candidate.getAttribute("src") ?? "";
      const text = candidate.textContent?.trim() ?? "";
      const bibleHref = parseBibleLink(href) ? href : extractBibleTarget(text);
      if (!bibleHref) continue;
      candidate.dataset.bibleRepaired = "true";
      if (candidate.matches(".internal-embed")) {
        const inline = document.createElement("span");
        inline.addClass("obsidian-scripture-inline");
        inline.setText("Loading verse...");
        candidate.replaceWith(inline);
        void this.loadVerse(inline, bibleHref, true);
      } else if (candidate instanceof HTMLAnchorElement) {
        this.replaceBibleLink(candidate, bibleHref);
      } else if (candidate.matches(".internal-link")) {
        const link = document.createElement("a");
        link.textContent = text.replace(/^.*?bible\d*:/i, "").replace(/".*$/, "").trim();
        link.setAttribute("href", "#");
        link.dataset.bibleHref = bibleHref;
        link.dataset.bibleControlled = "true";
        link.addClass("obsidian-scripture-link");
        candidate.replaceWith(link);
      }
    }
  }
  replaceBibleLink(link, bibleHref) {
    const replacement = document.createElement("a");
    replacement.textContent = link.textContent || bibleHref.replace(/^bible\d*:/i, "");
    replacement.setAttribute("href", "#");
    replacement.setAttribute("data-bible-href", bibleHref);
    replacement.dataset.bibleControlled = "true";
    replacement.addClass("obsidian-scripture-link");
    replacement.setAttr("title", "Hover or Alt-click to show the verse");
    link.replaceWith(replacement);
    return replacement;
  }
  async fetchBibleText(reference, language, biblePath) {
    return this.reader.fetch(reference, language, biblePath);
  }
  async loadVerse(container, href, inline) {
    const parsed = parseBibleLink(href);
    if (!parsed) return;
    try {
      const translation = this.settings.translations[parsed.translation];
      const biblePath = await this.findConfiguredBible(translation.path);
      if (!biblePath) throw new Error(`No EPUB file found for ${translation.name}`);
      const result = await this.fetchBibleText(parsed.reference, translation.language, biblePath);
      container.setText(inline ? result.text : `${translation.name}: ${result.text}`);
    } catch (error) {
      container.setText(`Scripture lookup failed: ${String(error)}`);
    }
  }
  async findConfiguredBible(configuredPath) {
    const path = configuredPath.trim().replace(/^\/+/, "");
    const file = this.app.vault.getAbstractFileByPath(path);
    if (file instanceof import_obsidian2.TFile && file.extension.toLowerCase() === "epub") return file.path;
    return this.app.vault.getFiles().find((candidate) => candidate.extension.toLowerCase() === "epub" && (!path || candidate.path.startsWith(`${path}/`)))?.path;
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
};
var BibleLookupModal = class extends import_obsidian2.Modal {
  constructor(app, plugin, editor) {
    super(app);
    this.plugin = plugin;
    this.editor = editor;
    this.results = [];
  }
  onOpen() {
    this.titleEl.setText("Scripture Search");
    const controls = this.contentEl.createDiv("obsidian-scripture-lookup-controls");
    this.input = controls.createEl("textarea", { placeholder: "Genesis 4:4,7,10" });
    this.input.addClass("obsidian-scripture-reference-input");
    this.translationSelect = controls.createEl("select");
    this.plugin.settings.translations.forEach((translation, index) => this.translationSelect.add(new Option(translation.name, String(index))));
    this.translationSelect.value = "0";
    const lookupButton = controls.createEl("button", { text: "Look up" });
    lookupButton.addEventListener("click", () => void this.lookup());
    this.input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") void this.lookup();
    });
    this.resultEl = this.contentEl.createEl("pre");
    this.resultEl.addClass("obsidian-scripture-lookup-result");
    this.input.focus();
  }
  async lookup() {
    const references = this.input.value.split(/\r?\n|;/).map((value) => value.trim()).filter(Boolean);
    if (!references.length) return;
    this.resultEl.setText("Loading EPUB text...");
    try {
      const defaultTranslation = Number(this.translationSelect.value);
      this.results = [];
      for (const value of references) {
        const parsed = parseBibleLink(`bible:${value}`);
        const translationIndex = parsed?.translation === 0 && !/^(english|dutch|polish|en|nl|pl)\s+/i.test(value) ? defaultTranslation : parsed?.translation ?? defaultTranslation;
        const reference = parsed?.reference ?? value;
        const translation = this.plugin.settings.translations[translationIndex];
        const path = await this.plugin.findConfiguredBible(translation.path);
        if (!path) throw new Error(`No EPUB file found for ${translation.name}`);
        const result = await this.plugin.fetchBibleText(reference, translation.language, path);
        this.results.push({ reference: value, ...result, path, translation: translation.name });
      }
      this.resultEl.setText(this.results.map((result) => result.text).join("\n\n"));
      this.contentEl.querySelectorAll(".obsidian-scripture-lookup-actions").forEach((actions2) => actions2.remove());
      const actions = this.contentEl.createDiv("obsidian-scripture-lookup-actions");
      if (this.editor) {
        const insertButton = actions.createEl("button", { text: "Insert" });
        insertButton.addClass("mod-cta");
        insertButton.addEventListener("click", () => this.insertText());
        const referenceButton = actions.createEl("button", { text: "Reference" });
        referenceButton.addClass("mod-cta");
        referenceButton.addEventListener("click", () => void this.insertReference());
      }
      const noteButton = actions.createEl("button", { text: "Note" });
      noteButton.addClass("mod-cta");
      noteButton.addEventListener("click", () => void this.createNote());
    } catch (error) {
      this.results = [];
      this.resultEl.setText(`Scripture lookup failed: ${String(error)}`);
    }
  }
  insertText() {
    if (!this.results.length || !this.editor) return;
    this.editor.replaceSelection(this.results.map(formatInsertedResult).join("\n\n"));
    this.close();
  }
  flattenNoteResults() {
    return this.results.flatMap((result) => splitNoteResults(result));
  }
  notePath(noteResult) {
    const folder = `${this.plugin.settings.notesFolder.trim().replace(/^\/+|\/+$/g, "")}/${noteResult.translation}`;
    const safeReference = `${noteResult.book} ${noteResult.chapter}.${formatVerseFilename(noteResult.verses)}`;
    return `${folder}/${safeReference}.md`;
  }
  noteContent(noteResult) {
    const reference = noteResult.reference.replace(/^(english|dutch|polish|en|nl|pl)\s+/i, "");
    const firstVerse = noteResult.verses[0];
    const lastVerse = noteResult.verses[noteResult.verses.length - 1];
    const endVerse = noteResult.verses.length > 1 ? `Eindvers: ${lastVerse}
` : "";
    const noteText = noteResult.verses.map((verse, index) => `(${verse}) ${noteResult.verseTexts[index] ?? ""}`).join(" ");
    return `---
Type: Bijbel
Bijbelboek: ${noteResult.book}
Hoofdstuk: ${noteResult.chapter}
Vers: ${firstVerse}
${endVerse}Aliases: ${reference}
Taal: ${noteResult.translation}
---
${noteText}${formatFootnotes(noteResult.footnotes)}
`;
  }
  async ensureNote(noteResult) {
    const filePath = this.notePath(noteResult);
    await this.ensureFolder(filePath.slice(0, filePath.lastIndexOf("/")));
    const existing = this.app.vault.getAbstractFileByPath(filePath);
    const existed = existing instanceof import_obsidian2.TFile;
    if (!existed) await this.app.vault.create(filePath, this.noteContent(noteResult));
    return { filePath, existed };
  }
  async createNote() {
    try {
      let created = 0;
      let alreadyExisting = 0;
      for (const noteResult of this.flattenNoteResults()) {
        const { existed } = await this.ensureNote(noteResult);
        if (existed) alreadyExisting++;
        else created++;
      }
      if (!created) new import_obsidian2.Notice("Note already exists");
      else if (alreadyExisting) new import_obsidian2.Notice(`Created ${created} Bible note${created === 1 ? "" : "s"}; ${alreadyExisting} already exist${alreadyExisting === 1 ? "s" : ""}`);
      else new import_obsidian2.Notice(`Created ${created} Bible note${created === 1 ? "" : "s"}`);
      this.close();
    } catch (error) {
      this.resultEl.setText(`Could not create note: ${String(error)}`);
    }
  }
  async insertReference() {
    if (!this.editor) return;
    try {
      let previousBook;
      const links = [];
      for (const noteResult of this.flattenNoteResults()) {
        await this.ensureNote(noteResult);
        const verse = noteResult.verses[0];
        const target = `${noteResult.book} ${noteResult.chapter}.${verse}`;
        const isNewBook = noteResult.book !== previousBook;
        const alias = isNewBook ? `${noteResult.book} ${noteResult.chapter}:${verse}` : String(verse);
        links.push(`[[${target}|${alias}]]`);
        previousBook = noteResult.book;
      }
      this.editor.replaceSelection(links.join(" "));
      this.close();
    } catch (error) {
      this.resultEl.setText(`Could not insert reference: ${String(error)}`);
    }
  }
  async ensureFolder(folder) {
    const parts = folder.split("/");
    let current = "";
    for (const part of parts) {
      current = current ? `${current}/${part}` : part;
      if (!this.app.vault.getAbstractFileByPath(current)) await this.app.vault.createFolder(current);
    }
  }
};
function splitNoteResults(result) {
  return result.verses.map((verse, index) => ({ ...result, reference: `${result.book} ${result.chapter}:${verse}`, verses: [verse], verseTexts: [result.verseTexts[index] ?? ""], text: `${verse} ${result.verseTexts[index] ?? ""}` }));
}
function formatVerseFilename(verses) {
  if (verses.length > 1 && verses.every((verse, index) => verse === verses[0] + index)) return `${verses[0]}-${verses[verses.length - 1]}`;
  return verses.join(",");
}
function formatInsertedResult(result) {
  const groups = [];
  let current = [];
  let previousVerse;
  for (const [index, verse] of result.verses.entries()) {
    if (previousVerse !== void 0 && verse < previousVerse) {
      if (current.length) groups.push(current);
      current = [];
    }
    if (previousVerse !== void 0 && verse > previousVerse + 1) current.push("\u2026");
    const verseText = (result.verseTexts[index] ?? "").replace(/\[\^\d+\]/g, "").replace(/\s+/g, " ").trim();
    current.push(`(${verse}) ${verseText}`);
    previousVerse = verse;
  }
  if (current.length) groups.push(current);
  return groups.map((group) => `### ${result.book} ${result.chapter}
${group.join(" ")}`).join("\n\n");
}
function formatFootnotes(footnotes) {
  return footnotes.length ? `
---
${footnotes.map((footnote, index) => `[^${index + 1}]: ${footnote}`).join("\n")}` : "";
}
var ScriptureSettingTab = class extends import_obsidian2.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    this.containerEl.empty();
    this.containerEl.createEl("p", { text: "Set a vault-relative EPUB file path or folder for each translation. A blank path searches the whole vault." });
    new import_obsidian2.Setting(this.containerEl).setName("Bible notes folder").setDesc("Base folder; notes are created inside a language subfolder").addText((text) => text.setValue(this.plugin.settings.notesFolder).onChange(async (value) => {
      this.plugin.settings.notesFolder = value.trim() || "Bible";
      await this.plugin.saveSettings();
    }));
    new import_obsidian2.Setting(this.containerEl).setName("Bible tools").setDesc("Search scripture to insert text or create a Bible verse note from the active EPUB").addButton((button) => button.setButtonText("Scripture Search").onClick(() => new BibleLookupModal(this.app, this.plugin, this.app.workspace.activeEditor?.editor).open()));
    const bibleFiles = this.app.vault.getFiles().filter((file) => file.extension.toLowerCase() === "epub").sort((left, right) => left.path.localeCompare(right.path));
    this.plugin.settings.translations.forEach((translation) => {
      new import_obsidian2.Setting(this.containerEl).setName(translation.name).setDesc(`Language: ${LANGUAGE_LABELS[translation.language]}`).setHeading();
      new import_obsidian2.Setting(this.containerEl).setName("Choose Bible file").addDropdown((dropdown) => {
        dropdown.addOption("", "Search whole vault");
        for (const file of bibleFiles) dropdown.addOption(file.path, file.path);
        dropdown.setValue(translation.path);
        dropdown.onChange(async (value) => {
          translation.path = value;
          await this.plugin.saveSettings();
        });
      });
      new import_obsidian2.Setting(this.containerEl).setName("Bible file or folder").setDesc("Vault-relative path").addText((text) => text.setValue(translation.path).onChange(async (value) => {
        translation.path = value;
        await this.plugin.saveSettings();
      }));
    });
  }
};
function parseBibleLink(href) {
  try {
    const prefix = /bible(\d*):(?:\/\/)?/i.exec(href.replace(/^#/, ""));
    if (!prefix) return null;
    const value = decodeURIComponent(href.slice((prefix.index ?? 0) + prefix[0].length).replace(/\+/g, " "));
    const suffix = /(?:\?|\s+)translation=(\d+)\s*$/i.exec(value);
    const referenceValue = (suffix ? value.slice(0, suffix.index) : value).trim();
    const prefixTranslation = prefix[1] ? Number(prefix[1]) - 1 : 0;
    const languagePrefix = /^(english|dutch|polish|en|nl|pl)\s+/i.exec(referenceValue);
    const languageTranslation = languagePrefix ? { english: 0, en: 0, dutch: 1, nl: 1, polish: 2, pl: 2 }[languagePrefix[1].toLowerCase()] : void 0;
    const reference = (languagePrefix ? referenceValue.slice(languagePrefix[0].length) : referenceValue).trim();
    const translation = suffix ? Number(suffix[1]) : languageTranslation ?? prefixTranslation;
    return { reference, translation: Number.isInteger(translation) && translation >= 0 && translation < 3 ? translation : 0 };
  } catch {
    return null;
  }
}
function extractBibleTarget(value) {
  const match = /(?:#?bible\d*:[^)|\]]+)/i.exec(value);
  return match?.[0]?.trim() ?? null;
}
function mergeSettings(data) {
  const translations = Array.isArray(data?.translations) ? data.translations : [];
  const saved = DEFAULT_SETTINGS.translations.map((defaultTranslation, index) => ({ ...defaultTranslation, path: translations[index]?.path ?? defaultTranslation.path }));
  return { translations: saved.map((setting) => {
    if (setting.path.toLowerCase().endsWith(".pdf")) setting.path = setting.path.replace(/\.pdf$/i, ".epub");
    return setting;
  }), notesFolder: data?.notesFolder?.trim() || "Bible" };
}
