
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
    function blank_line(i) { return rex(n, i, /[\s\t]*(\r?\n|$)/); }

    function dot(i) { return str(n, i, '.'); }
    function ws(i) { return rex(n, i, /[ \t]/); }

    // html:

    function startab(i) { return str(null, i, '<'); }
    function endab(i) { return str(null, i, '>'); }
    function slash(i) { return str(null, i, '/'); }

    function htavv(i) { return rex('htavv', i, /"([^"]|\\")*"|'([^']|\\')*'/); }
    function htavq(i) { return rex(null, i, /\s*=\s*/); }
    function htak(i) { return rex('htak', i, /[a-zA-z][-a-zA-Z0-9]*/); }
    function htav(i) { return seq(null, i, htavq, htavv); }
    function htaa(i) { return rex(null, i, /\s+/); }
    function hta(i) { return seq('hta', i, htaa, htak, htav, '?'); }

    function htag(i) { return rex('htag', i, /[a-zA-Z][-a-zA-Z0-9]*/); }

    function htxt(i) { return rex('htxt', i, /[^<]+/); }

    function hbody(i) { return alt('hbody', i, htxt, html); }

    function ochtml(i) {
      return seq(
        null, i,
        startab, htag, hta, '*', endab,
        hbody, '*',
        startab, slash, htag, endab); }
    function lhtml(i) {
      return seq(
        null, i,
        startab, htag, hta, '*', endab); }
    function chtml(i) {
      return seq(
        null, i,
        startab, htag, hta, '*', slash, endab); }

    function html(i) { return alt('html', i, chtml, ochtml, lhtml); }

    // inline:

    function inplain(i) { return rex('inplain', i, /[^\r\n$]+/); }
    function inhtml(i) { return ren('inhtml', i, html); }

    function inelt(i) { return alt('inelt', i, inhtml, inplain); }

    //function inline(i) { return rex('inline', i, /[^\r\n$]+/); } // FIXME
    function inline(i) { return rep('inline', i, inelt, 1); }

    // block: lists

    function ind(i) { return rex('ind', i, /[ \t]+/); }
    function linum(i) { return rex('linum', i, /\d+/); }
    function listar(i) { return rex('listar', i, /[-*]/); }

    function olli_head(i) { return seq(n, i, ind, '?', linum, dot, ws, '+'); }
    function ulli_head(i) { return seq(n, i, ind, '?', listar, ws, '+'); }

    function listli_head(i) { return alt(n, i, olli_head, ulli_head, ind); }

    function listli(i) { return seq('listli', i, listli_head, inline, eol); }

    function list(i) { return seq('list', i, listli, '+'); }

    // block: para

    function paraline(i) {
      return seq('paraline', i, listli_head, '!', inline, eol); }

    function para(i) {
      return seq('para', i, paraline, '+', blank_line); }

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

    function rwcn(t/*, subname*/) {

      return t ? t.subgather(arguments[1]).map(rewrite) : [];
    }

    // inline

    function rewrite_inline(t) { return [ 'p', {}, t.string() ]; }
      // FIXME

    // block: lists

    function rewrite_list(t) {

      var lis = [];
        // << [ head, content ]

      // first pass, determine indentation and type for each list item

      t.subgather('listli').forEach(function(tt) {

        var i = tt.lookup('ind'); i = i ? i.string() : '';
        var h = tt.lookup('linum') || tt.lookup('listar');

        if (h) {
          h = i + (h.string().match(/^\d/) ? '1' : '*');
        }
        else {
          var p = lis.find(function(e) {
            return e[0].length + 1 === i.length; });
          //h = p ? p[0].replace(/[^ ]/g, ' ') : null;
//if ( ! h) throw ("loose list item");
          h = p ? p[0].replace(/[^ ]/g, ' ') : i;
        }

        lis.unshift([ h.replace(/ /g, '.'), rewrite(tt.lookup('inline')) ]);
      });

//clog(lis.map(function(li) { return JSON.stringify(li); }).join('\n'));
        // sample content for `lis`:
        //
      // - min thing
      // - credit rating
      //   oh well
      //   - max 20%
      //     * alpha
      //       bravo
        //
      // [["     ", ["p", {}, "bravo"]],
      //  ["    *", ["p", {}, "alpha"]],
      //  ["  *", ["p", {}, "max 20%"]],
      //  [" ", ["p", {}, "oh well"]],
      //  ["*", ["p", {}, "credit rating"]],
      //  ["*", ["p", {}, "min thing"]]]]]

      // second pass, gather list items into lists

      var root = null;
      var lists = [];
      var lastlist = null;

      while (true) {

        var i = lis.pop(); if ( ! i) break;

        var h = i[0], c = i[1];

        var makeList = function() {
          var list = [ h.indexOf('*') > -1 ? 'ul' : 'ol', {}, [] ];
          list._head = h;
          list[2].push([ 'li', {}, [ c ] ]);
          lists.unshift(list);
          return list; };
        var addToLi = function(/* something_or_c */) {
          var cn = lastlist[2];
          var li = cn[cn.length - 1];
          var el = arguments[0] || c;
          li[2].push(el);
          return el; };
        var addLi = function() {
          lastlist[2].push([ 'li', {}, [ c ] ]); };

        // first the two easy cases...

        if ( ! root) { // add first `ul` or `ol`
          lastlist = root = makeList(); continue;
        }

        if (h === lastlist._head) { // add `li` to `ul` or `ol`
          addLi(); continue;
        }

        // easy sub cases then...

        var sub = ! h.match(/[^\.]/);

        if (sub && h.length >= lastlist._head.length) { // add `p` to `li`
          addToLi(); continue;
        }

        if (h.length >= lastlist._head.length) { // add `ul` or `ol` to `li`
          lastlist = addToLi(makeList()); continue;
        }

        // add to list upstream, so find it...

        var list = null;
        for (var j = 0, l = lists.length; j < l; j++) {
          list = lists[j];
          if (list._head.length > h.length) continue;
          if (sub && list._head.length === h.length) break;
          //list = null; // reset... NO, stay with the root list...
        }

        lastlist = list;

        if (sub) addToLi();
        else addLi();
      }

      return root;
    }

    // block: para

    function rewrite_paraline(t) { return [ 'div', {}, t.string().trim() ]; }
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

