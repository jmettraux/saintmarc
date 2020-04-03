
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

  make: function(tag, atts, children) {
    var r = Object.create(SaintMarcNode);
    r.tag = tag;
    r.attributes = atts;
    r.children = children || [];
    return r;
  },
}; // end SaintMarcNode

//SaintMarcNode.make =
//  function(tag, atts, children) {
//    var r = Object.create(SaintMarcNode);
//    r.tag = tag;
//    r.attributes = atts;
//    r.children = children || [];
//    return r;
//  };


var SaintMarc = (function() {

  "use strict";

  var self = this;

  this.VERSION = '2.0.0';

  //
  // blocks

  var determineLineType = function(line) {
    if (line.match(/^\s*#{0,6} .+/)) return 'h';
    if (line.match(/^\s*(---|\*\*\*|___)\s*$/)) return 'hr';
    if (line.match(/^\s*\d+\. .+/)) return 'li';
    if (line.match(/^\s*(\*|\+|-) .+/)) return 'li';
    if (line.match(/^\s*$/)) return '';
    return 'p';
  };

  // < mini object system >
  var omake = function(object) {
    var o = Object.create(object);
    if (typeof o.make === 'function') {
      o.make.apply(o, Array.prototype.slice.call(arguments, 1));
    }
    return o;
  };
  var odefine = function(object, properties) {
    return Object.assign(
      Object.create(object || {}),
      (typeof properties === 'function') ? props(object) : properties);
  };
  // < / mini object system >

  var Block = odefine(null, {
    make: function() {
      this.lines = []; },
    isEmpty: function() {
      return this.lines.length < 1; },
    accept: function(line) {
      return determineLineType(line) === this.lineType; },
    push: function(line) {
      this.lines.push(line); return line; },
    toA: function() {
      return [ this.lineType, this.lines ]; },
  });
  var HeaderBlock = odefine(Block, {
    lineType: 'h',
  });
  var HruleBlock = odefine(Block, {
    lineType: 'hr',
  });
  var ListBlock = odefine(Block, {
    lineType: 'li',
  });
  var ParaBlock = odefine(Block, {
    lineType: 'p',
    accept: function(line) {
      var lt = determineLineType(line);
      return lt === 'p';
    },
  });

  //
  // protected methods

  var blockMake = function(line) {

    var lt =
      determineLineType(line);
    var k;
      if (lt === 'h') k = HeaderBlock;
      else if (lt === 'hr') k = HruleBlock;
      else if (lt === 'li') k = ListBlock;
      else if (lt === 'p') k = ParaBlock;
    if ( ! k) throw "don't know what Block to make out of '" + lt + "'";

    var b = omake(k); b.push(line); return b;
  };

  var parseBlocks = function(s, opts) {

    var currentBlock = omake(ParaBlock);
    var blocks = [ currentBlock ];

    s.split(/\r?\n/).forEach(function(line) {
      if (currentBlock.accept(line)) { currentBlock.push(line); }
      else { blocks.push(currentBlock = blockMake(line)); }
    });

    return blocks
      .filter(function(b) { return b.lineType !== 'p' || ! b.isEmpty(); });
  };

  var parseNodes = function(t, opts) {
  };

  //
  // public methods

  this.parse = function(s, opts) {

    if (typeof s !== 'string') throw "input is not a string";

    var blocks = parseBlocks(s, opts);

    if (opts.debug === 'blocks') return blocks;

    return parseNodes(blocks, opts);
  };

  //
  // done.

  return this;

}).apply({}); // end SaintMarc

