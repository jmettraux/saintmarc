
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
//
// Made in Japan


var SaintMarc = (function() {

  "use strict";

  var self = this;

  this.VERSION = '0.9.0';

  var Parser = Jaabro.makeParser(function() {

    // parse

    function olline(i) {
      return rex('olline', i, /^\d+\.[\t ]+[^\n\r]*[\n\r]/); }
    function ulline(i) {
      return rex('olline', i, /^[-*][\t ]+[^\n\r]*[\n\r]/); }
    function pline(i) {
      return rex('pline', i, /^[^\n\r]*[\n\r]/); }

    function line(i) { return alt(null, i, ulline, olline, pline); }
    function doc(i) { return rep('doc', i, line, 1); }

    var root = doc;

    // rewrite

    function rewrite_line(t) {
clog(t);
      return t;
    };

    function rewrite_doc(t) {
clog(t);
      return t;
    };
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

