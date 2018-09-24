
// Copyright (c) 2018-2018, John Mettraux, jmettraux@gmail.com
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

// Made in Japan


var SaintMarc = (function() {

  "use strict";

  var self = this;

  this.VERSION = '0.9.0';

  // the parser itself

  var Parser = Jaabro.makeParser(function() {

    //
    // parse

    function eol(i) { return rex(null, i, /[\n\r]|$/); }

    function doubleu(i) { return str(null, i, '__'); }
    function doublea(i) { return str(null, i, '**'); }
    function doublet(i) { return str(null, i, '~~'); }
    function u(i) { return str(null, i, '_'); }
    //function a(i) { return str(null, i, '*'); }

    function plain(i) {
      return rex('plain', i, /(\*[^*]|_[^_]|~[^~]|[^\r\n*_~\[\]()])+/); }

    function startb(i) { return str(null, i, '['); }
    function endb(i) { return str(null, i, ']'); }
    function startp(i) { return str(null, i, '('); }
    function endp(i) { return str(null, i, ')'); }

    function ltext(i) { return rex('ltext', i, /[^\]]+/); }
    function lhref(i) { return rex('lhref', i, /[^)]+/); }
    function link(i) {
      return seq('link', i, startb, ltext, endb, startp, lhref, endp); }

    function del(i) { return seq('del', i, doublet, il, '+', doublet); }

    function uem(i) { return seq(null, i, u, il, '+', u); }
    //function aem(i) { return seq(null, i, a, il, '+', a); }
    //function em(i) { return alt('em', i, aem, uem); }
    function em(i) { return alt('em', i, uem); }

    function ustrong(i) { return seq(null, i, doubleu, il, '+', doubleu); }
    function astrong(i) { return seq(null, i, doublea, il, '+', doublea); }
    function strong(i) { return alt('strong', i, astrong, ustrong); }

    function il(i) { return alt(null, i, strong, em, del, link, plain); }
      // InLine

    function pl(i) { return seq('pl', i, il, '+', eol); }

    function olh(i) { return rex(null, i, /\d+\.[\t ]+/); }
    function oll(i) { return seq('oll', i, olh, il, '+', eol); }
    function ulh(i) { return rex(null, i, /[-*][\t ]+/); }
    function ull(i) { return seq('ull', i, ulh, il, '+', eol); }

    function bl(i) { return rex(null, i, /[ \t]*[\n\r]/); } // blank line

    function hr(i) { return rex('hr', i, /(---|\*\*\*|___)[\n\r]/); }
    function p(i) { return rep('p', i, pl, 1); }
    function ol(i) { return rep('ol', i, oll, 1); }
    function ul(i) { return rep('ul', i, ull, 1); }

    function tag(i) { return alt(null, i, bl, ul, ol, hr, p); }
    function doc(i) { return rep('doc', i, tag, 1); }

    var root = doc;

    //
    // rewrite

    // gather named children and rewrite them
    function rwcn(t) { return t.subgather(null).map(rewrite); }

    function rwts(t) { return t.string(); }

    function rewrite_plain(t) { return [ 'span', t.string() ] }

    var rewrite_ltext = rwts;
    var rewrite_lhref = rwts;
    function rewrite_link(t) { return [ 'a', rwcn(t) ]; }

    function rewrite_em(t) { return [ 'em', rwcn(t) ]; }
    function rewrite_del(t) { return [ 'del', rwcn(t) ]; }
    function rewrite_strong(t) { return [ 'strong', rwcn(t) ]; }

    function rewrite_hr(t) { return [ 'hr' ]; }

    var rewrite_pl = rwcn;
    var rewrite_ull = rwcn;
    var rewrite_oll = rwcn;

    var flatten = function(a) {
      var r = []; a.forEach(function(e) { r = r.concat(e); }); return r;
    };

    function rewrite_p(t) { return [ 'p', flatten(rwcn(t)) ]; }
    function rewrite_ul(t) { return [ 'ul', flatten(rwcn(t)) ]; }
    function rewrite_ol(t) { return [ 'ol', flatten(rwcn(t)) ]; }

    function rewrite_doc(t) { return [ 'doc', rwcn(t) ]; }
  });

  //
  // protected methods

  var _c = function(parentElt, tag, atts, text) {
    var ss = tag.split('.');
    var t = ss.shift(); if (t === '') t = 'div';
    var e = document.createElement(t);
    for (var k in (atts || {})) { e.setAttribute(k, atts[k]); }
    e.className = ss.map(function(c) { return 'saintmarc' + c; }).join(' ');
    e.textContent = text || '';
    if (parentElt) parentElt.appendChild(e);
    return e;
  };

  var r = {};
  r.doc = function(t, opts) {
    var e = _c(null, '.-doc');
    opts.parent = e; t[1].forEach(function(c) { render(c, opts); });
    return e;
  };
  r.p = function(t, opts) {
clog(t);
    var e = _c(opts.parent, 'p');
clog(t[1]);
    opts.parent = e; t[1].forEach(function(c) { render(c, opts); });
    return e;
  };

  var render = function(t, opts) {
    opts = opts || {};
    if (typeof t === 'string') return _c(opts.parent, 'span.-text', {}, t);
    var f = r[ t[0]]; if ( ! f) throw "no renderer for \"" + t[0] + "\"";
    return f(t, opts);
  };

  //
  // public methods

  this.parse = function(s, opts) {

    if (typeof s !== 'string') return null;

    return Parser.parse(s, opts);
  };

  this.toHtml = function(s, opts) {

    var t = self.parse(s, opts);
    if ( ! t) return null;

    //return self['render_' + t[0]](t, opts);
    return render(t, opts);
  };

  //
  // done.

  return this;

}).apply({}); // end SaintMarc

