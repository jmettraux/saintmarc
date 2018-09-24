
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

    //function lfcr(i) { return rex(null, i, /^[\n\r]/); }
    function eol(i) { return rex(null, i, /[\n\r]|$/); }

    function doubleu(i) { return str(null, i, '__'); }
    function doublea(i) { return str(null, i, '**'); }
    function doublet(i) { return str(null, i, '~~'); }
    function u(i) { return str(null, i, '_'); }
    //function a(i) { return str(null, i, '*'); }

    function plain(i) {
      return rex('plain', i, /[^\r\n*_~\[\]()]+|\*[^*]|~[^~]|_[^_]/); }

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

    function oll(i) { return rex('oll', i, /^\d+\.[\t ]+[^\n\r]*[\n\r]/); }
      // FIXME
    function ull(i) { return rex('oll', i, /^[-*][\t ]+[^\n\r]*[\n\r]/); }
      // FIXME

    function bl(i) { return rex(null, i, /^[ \t]*[\n\r]/); } // blank line

    function hr(i) { return rex('hr', i, /^(---|\*\*\*|___)[\n\r]/); }
    function p(i) { return rep('p', i, pl, 1); }
    function ol(i) { return rep('ol', i, oll, 1); }
    function ul(i) { return rep('ul', i, ull, 1); }

    function tag(i) { return alt(null, i, bl, ul, ol, hr, p); }
    function doc(i) { return rep('doc', i, tag, 1); }

    var root = doc;

    //
    // rewrite

    // gather named children and rewrite them, concat strings
    //
    function rwcn(t, concat) {
      var a = t.subgather(null).map(rewrite);
      if (concat === false) return a;
      var r = [];
      var s = null;
      a.forEach(function(e) {
        if (typeof e !== 'string') { if (s) r.push(s); s = null; r.push(e); }
        else { if ( ! s) s = ''; s = s + e; }
      });
      if (s) r.push(s);
      return r;
    }

    function rwts(t) { return t.string(); }

    var rewrite_plain = rwts;

    var rewrite_ltext = rwts;
    var rewrite_lhref = rwts;
    function rewrite_link(t) { return [ 'a', rwcn(t, false) ]; }

    function rewrite_em(t) { return [ 'em', rwcn(t) ]; }
    function rewrite_del(t) { return [ 'del', rwcn(t) ]; }
    function rewrite_strong(t) { return [ 'strong', rwcn(t) ]; }

    function rewrite_hr(t) { return [ 'hr' ]; }

    var rewrite_pl = rwcn;

    function rewrite_ull(t) {
      var s = t.string(); var i = Math.max(s.indexOf(' '), s.indexOf('	'));
      return s.slice(i).trim();
    }
    var rewrite_oll = rewrite_ull;

    function rewrite_p(t) { return [ 'p', rwcn(t) ]; }
    function rewrite_ul(t) { return [ 'ul', rwcn(t) ]; }
    function rewrite_ol(t) { return [ 'ol', rwcn(t) ]; }

    function rewrite_doc(t) { return [ 'doc', rwcn(t) ]; }
  });

  //
  // protected methods

  //
  // public methods

  this.parse = function(s, opts) {

    if (typeof s !== 'string') return null;

    return Parser.parse(s, opts);
  };

  //
  // done.

  return this;

}).apply({}); // end SaintMarc

