
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


var SaintMarcNode = {

  hasTextChild: function() { return (typeof this.children) === 'string'; },
  hasChildrenArray: function() { return Array.isArray(this.children); },

  lastChild: function() {

    if ( ! this.hasChildrenArray()) return undefined;
    return this.children[this.children.length - 1];
  },

  push: function(child) {

    this.children.push(child);

    return child;
  },

  toArray: function(opts) {

    var os = opts || {};

    return [
      this.tag,
      this.attributes,
      this.hasChildrenArray() ?
        this.children.map(function(c) { return c.toArray(os); }) :
        this.children ];
  },

  toHtml: function(opts) {

    var os = opts || {};

    var e = document.createElement(this.tag === 'doc' ? 'div' : this.tag);
    for (var k in this.attributes) e.setAttribute(k, this.attributes[k]);
    if (this.hasTextChild())
      e.appendChild(
        document.createTextNode('' + this.children));
    else
      this.children.forEach(
        function(c) { c.toHtml(Object.assign({}, os, { parent: e })); });
    if (os.parent) os.parent.appendChild(e);
    return e;
  },

  toPre: function(opts) {

    var os = opts || {};
    var depth = os.depth || 0;
    var out = os.out; if ( ! out) os.out = [];

    if (depth > 0) os.out.push('\n');

    var ind = ''; for (var i = 0; i < depth; i++) ind = ind + '  ';
    os.out.push(ind, this.tag);

    for (var k in this.attributes) {
      os.out.push(' ', k, ': ', JSON.stringify(this.attributes[k]));
    }

    if (this.hasTextChild())
      os.out.push(' ', JSON.stringify(this.children));
    else
      this.children.forEach(function(c) {
        c.toPre(Object.assign({}, os, { depth: depth + 1 }));
      });

    return out ? null : os.out.join('');
  },

  innerText: function(opts) {

    var os = opts || {};
    var out = os.out; if ( ! out) os.out = [];

    if (this.hasTextChild()) os.out.push(' ', this.children);
    else this.children.forEach(function(c) { c.innerText(os); });

    return out ? null : os.out.join('').slice(1);
  },

  lookup: function(tagName, opts) {

    var os = opts || {};
    var tagNames = Array.isArray(tagName) ? tagName : [ tagName ];

    if (tagNames.includes(this.tag)) return this;

    if (this.hasTextChild()) return null;
    return this.children.find(function(c) { return c.lookup(tagNames, os); });
  },

  gather: function(tagName, opts) {

    var os = opts || {};
    os.results = os.results || [];
    if ( ! os.results) os.results = [];
    var tagNames = Array.isArray(tagName) ? tagName : [ tagName ];

    if (tagNames.includes(this.tag))
      os.results.push(this);
    else if (this.hasChildrenArray())
      this.children.forEach(function(c) { c.gather(tagNames, os); });

    return os.results;
  },
}; // end SaintMarcNode

SaintMarcNode.make =
  function(tag, atts, children) {
    var r = Object.create(SaintMarcNode);
    r.tag = tag;
    r.attributes = atts;
    r.children = children || [];
    return r;
  };


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

//    // html:
//
//    function startab(i) { return str(null, i, '<'); }
//    function endab(i) { return str(null, i, '>'); }
//    function slash(i) { return str(null, i, '/'); }
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

    // inline:

    //function inplain(i) { return rex('inplain', i, /[^<\r\n$]+/); }
    //function inhtml(i) { return ren('inhtml', i, html); }

    //function inelt(i) { return alt('inelt', i, inhtml, inplain); }
    //function inelt(i) { return alt('inelt', i, inplain); }

    function inline(i) { return rex('inline', i, /[^\r\n$]+/); } // FIXME
    //function inline(i) { return rep('inline', i, inelt, 1); }

    // block: lists

    function ind(i) { return rex('ind', i, /[ \t]+/); }
    function linum(i) { return rex('linum', i, /\d+/); }
    function listar(i) { return rex('listar', i, /[-*]/); }

    function olli_head(i) { return seq(n, i, ind, '?', linum, dot, ws, '+'); }
    function ulli_head(i) { return seq(n, i, ind, '?', listar, ws, '+'); }

    function listli_head(i) { return alt(n, i, olli_head, ulli_head, ind); }

    function listli(i) { return seq('listli', i, listli_head, inline, eol); }

    function list(i) { return seq('list', i, listli, '+', blank_line, '?'); }

    // block: para

    function paraline(i) {
      return seq('paraline', i, listli_head, '!', inline, eol); }

    function para(i) {
      return seq('para', i, paraline, '+', blank_line, '?'); }

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

    var mk = SaintMarcNode.make;

    function rwcn(t/*, subname*/) {

      return t ? t.subgather(arguments[1]).map(rewrite) : [];
    }

    // inline

    function rewrite_inline(t) { return mk('p', {}, t.string()); }
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

      var roots = [];
      var lists = [];
      var lastlist = null;

      while (true) {

        var i = lis.pop(); if ( ! i) break;

        var h = i[0], c = i[1];

        var makeList = function() {
          var list = mk(h.indexOf('*') > -1 ? 'ul' : 'ol', {}, []);
          list._head = h;
          list.push(mk('li', {}, [ c ]));
          lists.unshift(list);
          return list; };
        var addToLi = function(/* something_or_c */) {
          var li = lastlist.lastChild();
          var el = arguments[0] || c;
          li.push(el);
          return el; };
        var addLi = function() {
          lastlist.push(mk('li', {}, [ c ])); };

        // first the two easy cases...

        if (roots.length < 1) { // add first `ul` or `ol`
          roots.push(lastlist = makeList()); continue;
        }

        if (h === lastlist._head) { // add `li` to `ul` or `ol`
          addLi(); continue;
        }

        // easy sub cases then...

        var sub = ! h.match(/[^\.]/);

        if (sub && h.length >= lastlist._head.length) { // add `p` to `li`
          addToLi(); continue;
        }

        //if (h.length >= lastlist._head.length) { // add `ul` or `ol` to `li`
        if (h.length > lastlist._head.length) { // add `ul` or `ol` to `li`
          lastlist = addToLi(makeList()); continue;
        }

        if (h.length == lastlist._head.length) { // new `ul` or `ol` showing up
          roots.push(lastlist = makeList()); continue;
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

      return roots;
    }

    // block: para

    function rewrite_paraline(t) { return mk('div', {}, t.string().trim()); }
    function rewrite_para(t) { return mk('p', {}, rwcn(t)); }

    // root

    function rewrite_doc(t) {

      var cn = rwcn(t)
        .reduce(
          function(a, c) {
            (Array.isArray(c) ? c : [ c ]).forEach(function(e) { a.push(e); });
            return a; },
          []);

      return mk( 'doc', {}, cn);
    }
  }); // end Parser

  //
  // protected methods

  //
  // public methods

  this.parse = function(s, opts) {

    if (typeof s !== 'string') return null;

    return Parser.parse(s, opts);
  };

  this.toArray = function(s, opts) {

    var t = self.parse(s, opts); return t ? t.toArray(opts) : null;
  };

  this.toHtml = function(s, opts) {

    var t = self.parse(s, opts); return t ? t.toHtml(opts) : null;
  };

  this.toPre = function(s, opts) {

    var t = self.parse(s, opts); return t ? t.toPre(opts) : null;
  };

  this.fromArray = function(a) {

    var cn = a[2]; if (Array.isArray(cn)) {
      cn = cn.map(function(c) { return self.fromArray(c); })
    }

    return SaintMarcNode.make(a[0], a[1], cn);
  };

  //
  // done.

  return this;

}).apply({}); // end SaintMarc

