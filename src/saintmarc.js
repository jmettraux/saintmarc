
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

  var Parser = Jaabro.makeParser(function() {

    //
    // parse

    //function lfcr(i) { return rex(null, i, /^[\n\r]/); }
    //function il(i) { return alt(null, i, bold, under, italic, link, plain); }

    function oll(i) { return rex('oll', i, /^\d+\.[\t ]+[^\n\r]*[\n\r]/); }
    function ull(i) { return rex('oll', i, /^[-*][\t ]+[^\n\r]*[\n\r]/); }
    function pl(i) { return rex('pl', i, /^[^\n\r]+[\n\r]/); }

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

    function rewriteChildren(t) {
      return t.children
        .map(rewrite)
        .filter(function(r) { return r !== null; })
    }

    function rewrite_hr(t) { return [ 'hr' ]; }

    function rewrite_pl(t) { return t.string().trim(); }

    function rewrite_ull(t) {
      var s = t.string(); var i = Math.max(s.indexOf(' '), s.indexOf('	'));
      return s.slice(i).trim();
    }
    var rewrite_oll = rewrite_ull;

    function rewrite_p(t) { return [ 'p', rewriteChildren(t) ]; }
    function rewrite_ul(t) { return [ 'ul', rewriteChildren(t) ]; }
    function rewrite_ol(t) { return [ 'ol', rewriteChildren(t) ]; }

    function rewrite_doc(t) { return [ 'doc', rewriteChildren(t) ]; }
  });

  //
  // protected methods

  //
  // public methods

  this.parse = function(s) {

    if (typeof s !== 'string') return null;

    return Parser.parse(s);
  };

  //
  // done.

  return this;

}).apply({}); // end SaintMarc

