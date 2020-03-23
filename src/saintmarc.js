
// Copyright (c) 2018-2020, John Mettraux, jmettraux@gmail.com
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

  this.VERSION = '1.0.0';

  // the parser itself

  var Parser = Jaabro.makeParser(function() {

    //
    // parse

//    function eol(i) { return rex(null, i, /[\n\r]|$/); }
//
//    function doubleu(i) { return str(null, i, '__'); }
//    function doublea(i) { return str(null, i, '**'); }
//    function doublet(i) { return str(null, i, '~~'); }
//    function u(i) { return str(null, i, '_'); }
//    //function a(i) { return str(null, i, '*'); }
//
//    //function plain(i) {
//    //  return rex(
//    //    'plain',
//    //    i,
//    //    ///(<[^\/a-zA-Z]+|\*[^*]|~[^~]|[^\r\n<*_~[])+/
//    //    /[^\r\n<*_~[]+/
//    //  ); }
//    function text(i) { return rex('text', i, /[^\r\n<*_~[]+/); }
//
//    function startab(i) { return str(null, i, '<'); }
//    function endab(i) { return str(null, i, '>'); }
//    function slash(i) { return str(null, i, '/'); }
//
//    function startb(i) { return str(null, i, '['); }
//    function endb(i) { return str(null, i, ']'); }
//    function startp(i) { return str(null, i, '('); }
//    function endp(i) { return str(null, i, ')'); }
//
//    function ltext(i) { return rex('ltext', i, /[^\]]+/); }
//    function lhref(i) { return rex('lhref', i, /[^)]+/); }
//    function link(i) {
//      return seq('link', i, startb, ltext, endb, startp, lhref, endp); }
//
//    function del(i) { return seq('del', i, doublet, il, '+', doublet); }
//
//    function uem(i) { return seq(null, i, u, il, '+', u); }
//    //function aem(i) { return seq(null, i, a, il, '+', a); }
//    //function em(i) { return alt('em', i, aem, uem); }
//    function em(i) { return alt('em', i, uem); }
//
//    function ustrong(i) { return seq(null, i, doubleu, il, '+', doubleu); }
//    function astrong(i) { return seq(null, i, doublea, il, '+', doublea); }
//    function strong(i) { return alt('strong', i, astrong, ustrong); }
//
//    function htavv(i) { return rex('htavv', i, /"([^"]|\\")*"|'([^']|\\')*'/); }
//    function htavq(i) { return rex(null, i, /\s*=\s*/); }
//    function htak(i) { return rex('htak', i, /[a-zA-z][-a-zA-Z0-9]*/); }
//    function htav(i) { return seq(null, i, htavq, htavv); }
//    function htaa(i) { return rex(null, i, /\s+/); }
//    function hta(i) { return seq('hta', i, htaa, htak, htav, '?'); }
//
//    function htag(i) { return rex('htag', i, /[a-zA-Z][-a-zA-Z0-9]*/); }
//
//    function htxt(i) { return rex('htxt', i, /[^<]+/); }
//
//    function hbody(i) { return alt('hbody', i, htxt, html); }
//
//    function ochtml(i) {
//      return seq(
//        null, i,
//        startab, htag, hta, '*', endab,
//        hbody, '*',
//        startab, slash, htag, endab); }
//    function lhtml(i) {
//      return seq(
//        null, i,
//        startab, htag, hta, '*', endab); }
//    function chtml(i) {
//      return seq(
//        null, i,
//        startab, htag, hta, '*', slash, endab); }
//
//    function html(i) { return alt('html', i, chtml, ochtml, lhtml); }
//
//    function il(i) {
//      return alt(null, i, html, strong, em, del, link, text); }
//    function pl(i) {
//      return seq('pl', i, il, '+', eol); }
//
//    function olh(i) { return rex(null, i, /\d+\.[\t ]+/); }
//    function oll(i) { return seq('oll', i, olh, pl, eol); }
//    function ulh(i) { return rex(null, i, /[-*][\t ]+/); }
//    function ull(i) { return seq('ull', i, ulh, pl, eol); }
//
//    function bline(i) { return rex(null, i, /[ \t]*[\n\r]/); } // blank line
//
//    function hr(i) { return rex('hr', i, /(---|\*\*\*|___)[\n\r]/); }
//    function p(i) { return rep('p', i, pl, 1); }
//    function ol(i) { return rep('ol', i, oll, 1); }
//    function ul(i) { return rep('ul', i, ull, 1); }
//
//    function block(i) { return alt(null, i, html, bline, ul, ol, hr, p); }

    // commons

    var n = null;

    function eol(i) { return rex(n, i, /\r?\n|$/); }

    function dot(i) { return str(n, i, '.'); }
    function ws(i) { return rex(n, i, /[ \t]/); }
    function ulistar(i) { return rex(n, i, /[-*]/); }

    // line: content

    function content(i) { return rex('content', i, /[^\r\n$]+/); } // FIXME

    // block: lists

    function ind(i) { return rex('ind', i, /[ \t]+/); }
    function linum(i) { return rex('linum', i, /\d+/); }

    function olli_head(i) { return seq(n, i, ind, '?', linum, dot, ws, '+'); }
    function ulli_head(i) { return seq(n, i, ind, '?', ulistar, ws, '+'); }

    function olli(i) { return seq('olli', i, olli_head, content, eol); }
    function ulli(i) { return seq('ulli', i, ulli_head, content, eol); }
    function indli(i) { return seq('indli', i, ind, content, eol); }

    function oli(i) { return alt(n, i, olli, indli); }
    function uli(i) { return alt(n, i, ulli, indli); }

    function olist(i) { return rep('olist', i, oli, 1); }
    function ulist(i) { return rep('ulist', i, uli, 1); }

    function list(i) { return alt(n, i, olist, ulist); }

    // block: para

    function list_head(i) { return alt(n, i, ind, olli_head, ulli_head); }

    function paraline(i) {
      return seq('paraline', i, list_head, '!', content, eol); }

    function para(i) {
      return seq('para', i, paraline, '+', blank_line); }

    function blank_line(i) {
      return rex(n, i, /[\s\t]*(\r?\n|$)/); }

    // root

    function block(i) {
      return alt(
        n, i,
        list, para); } // TODO
        //html, list, bq, hr, p); }

    function doc(i) { return rep('doc', i, block, 1); }

    var root = doc;

    //
    // rewrite

    function rwcn(t) { return t ? t.subgather(null).map(rewrite) : []; }
//    function rwcn(t) {
//      if ( ! t) return [];
//      var a = [];
//      var pe = null;
//      t.subgather(null).forEach(function(ct) {
//        var ce = rewrite(ct);
////clog(pe, ce);
//        var ce2 = ce[0] === 'span' && Object.keys(ce[1]).length < 1 && ce[2];
//        //a.push(ce);
//        if (pe && ce2) {
//          //pe[2] = pe[2] + ce2;
//          pe[2] = [ pe[2][0] + ce2[0] ];
//        }
//        else {
//          pe = ce2 ? ce : null;
//          a.push(ce);
//        }
//      });
//      return a;
//    }
//      // gather named children and rewrite them


////    function rewrite_del(t) { return [ 'del', {}, rwcn(t) ]; }
//    function rewrite_em(t) { return [ 'em', {}, rwcn(t) ]; }
//    function rewrite_strong(t) { return [ 'strong', {}, rwcn(t) ]; }
//
//    function rewrite_hr(t) { return [ 'hr', {}, [] ]; }
//
//    function rewrite_htxt(t) { return t.string(); }
//
//    function rewrite_hbodies(t) {
//
//      var es = t.gather('hbody')
//        .map(function(tt) { return rewrite(tt.sublookup(null)); });
//
//      var hes = []; var tes = [];
//      es.forEach(
//        function(e) { (((typeof e) === 'string') ? tes : hes).push(e); });
//
//      if (tes.every(function(te) { return te.trim().length < 1; })) return hes;
//      return es;
//    }
//
//    function rewrite_hats(t) {
//      return t.gather('hta')
//        .reduce(
//          function(r, a) {
//            var v = t.lookup('htavv');
//            if (v) { v = v.string(); v = v.substring(1, v.length - 1); }
//            else { v = true; }
//            r[t.lookup('htak').string()] = v;
//            return r; },
//          {});
//    }
//
//    function rewrite_html(t) {
//      return [
//        t.lookup('htag').string(), rewrite_hats(t), rewrite_hbodies(t) ];
//    }
//
//    function rewrite_link(t) {
//      return [
//        'a',
//        { href: t.lookup('lhref').string() },
//        [ t.lookup('ltext').string() ] ]; }
//
//    var rewrite_ull = rwcn;
//    var rewrite_oll = rwcn;
//
//    function rewrite_text(t) { return [ 'span', {}, [ t.string() ] ] }
//
//    var rewrite_pl = rwcn;
//
//    var flatten = function(a) {
//      var r = []; a.forEach(function(e) { r = r.concat(e); }); return r;
//    };
//
//    function rewrite_p(t) { return [ 'p', {}, flatten(rwcn(t)) ]; }
//
//    function rewrite_ol(t) {
//      return [
//        'ol', {}, rwcn(t).map(function(c) { return [ 'li', {}, c ]; }) ]; }
//    function rewrite_ul(t) {
//      return [
//        'ul', {}, rwcn(t).map(function(c) { return [ 'li', {}, c ]; }) ]; }

    // line: content

    function rewrite_content(t) { return [ 'span', {}, t.string() ]; } // FIXME

    // block: lists

    function rewrite_ulli(t) { return [ 'li', {}, rwcn(t) ]; }

    function rewrite_ulist(t) { return [ 'ul', {}, rwcn(t) ]; }

    // block: para

    function rewrite_paraline(t) { return [ 'span', {}, t.string().trim() ]; }
    function rewrite_para(t) { return [ 'p', {}, rwcn(t) ]; }

    // root

    function rewrite_doc(t) { return [ 'doc', {}, rwcn(t) ]; }
  }); // end Parser

  //
  // protected methods

  var toh = function(t, opts) {

    var os = opts || {};

    var t0 = t[0]; if (t0 === 'doc') t0 = 'div';

    var tc = '', cn = t[2];
    if (typeof cn === 'string') { tc = cn; cn = []; }

    var e =
      os.parent ?
      H.create(opts.parent, t0, t[1], tc) :
      H.create(t0, t[1], tc);
    cn.forEach(function(ct) {
      os.parent = e; toh(ct, os); });

    return e;
  };

  //
  // public methods

  this.parse = function(s, opts) {

    if (typeof s !== 'string') return null;

    return Parser.parse(s, opts);
  };

  this.toHtml = function(s, opts) {

    var t = self.parse(s, opts); return t ? toh(t, opts) : null;
  };

  //
  // done.

  return this;

}).apply({}); // end SaintMarc

