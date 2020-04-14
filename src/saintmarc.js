
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

  push: function(child) {

    this.children.push(child);

    return child;
  },

  toArray: function(opts) {

    var os = opts || {};

    return [
      this.tag,
      this.attributes,
      this.children.map(function(c) {
        return (typeof c === 'string') ? c : c.toArray(os); }) ];
  },

  toHtml: function(opts) {

    var os = opts || {};

    var e = document.createElement(this.tag === 'doc' ? 'div' : this.tag);
    for (var k in this.attributes) e.setAttribute(k, this.attributes[k]);
    this.children.forEach(function(c) {
      e.appendChild(
        (typeof c === 'string') ?
        document.createTextNode(c) :
        c.toHtml(Object.assign({}, os, { parent: e })));
    });
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

    if (this.children.length === 1 && (typeof this.children[0] === 'string')) {
      os.out.push(' ', JSON.stringify(this.children[0]));
    }
    else {
      this.children.forEach(function(c) {
        if (typeof c === 'string') {
          os.out.push('\n', ind, '  ', JSON.stringify(c)); }
        else {
          c.toPre(Object.assign({}, os, { depth: depth + 1 })); }
      });
    }

    return out ? null : os.out.join('');
  },

  innerText: function(opts) {

    var os = opts || {};
    var out = os.out; if ( ! out) os.out = [];

    this.children.forEach(function(c) {
      if (typeof c === 'string') os.out.push(' ', c);
      else c.innerText(os);
    });

    return out ? null : os.out.join('').slice(1);
  },

  lookup: function(tagName, opts) {

    var os = opts || {};
    var tagNames = Array.isArray(tagName) ? tagName : [ tagName ];

    if (tagNames.includes(this.tag)) return this;

    return this.children.find(function(c) {
      if (typeof c === 'string') return false;
      return c.lookup(tagNames, os); });
  },

  gather: function(tagName, opts) {

    var os = opts || {};
    os.results = os.results || [];
    if ( ! os.results) os.results = [];
    var tagNames = Array.isArray(tagName) ? tagName : [ tagName ];

    if (tagNames.includes(this.tag))
      os.results.push(this);
    else if (this.hasChildrenArray())
      this.children.forEach(function(c) {
        if (typeof c === 'string') return;
        c.gather(tagNames, os); });

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


var SaintMarc = (function() {

  "use strict";

  var self = this;

  this.VERSION = '2.0.0';

  //
  // content

  var ContentParser = Jaabro.makeParser(function() {

    //
    // parse

    var n = null;

    function und(i) { return str(n, i, '_'); }
    function sta(i) { return str(n, i, '*'); }
    function und2(i) { return str(n, i, '__'); }
    function sta2(i) { return str(n, i, '**'); }
    function sba(i) { return str(n, i, '['); }
    function sbz(i) { return str(n, i, ']'); }
    function rba(i) { return str(n, i, '('); }
    function rbz(i) { return str(n, i, ')'); }
    function aba(i) { return str(n, i, '<'); }
    function abz(i) { return str(n, i, '>'); }
    function slash(i) { return str(n, i, '/'); }

    function th(i) { return str('t', i, 'h'); }
    function taba(i) { return str('t', i, '<'); }

    function htavv(i) { return rex('htavv', i, /"([^"]|\\")*"|'([^']|\\')*'/); }
    function htavq(i) { return rex(n, i, /\s*=\s*/); }
    function htak(i) { return rex('htak', i, /[a-zA-z][-a-zA-Z0-9]*/); }
    function htav(i) { return seq(n, i, htavq, htavv); }
    function htaa(i) { return rex(n, i, /\s+/); }
    function hta(i) { return seq('hta', i, htaa, htak, htav, '?'); }
    function htag(i) { return rex('htag', i, /[a-zA-Z][-a-zA-Z0-9]*/); }
      //
    function htxt(i) { return rex('htxt', i, /[^<]+/); }
    function hbody(i) { return alt('hbody', i, htxt, thtml); }
      //
    function ochtml(i) { return seq(n, i,
      aba, htag, hta, '*', abz, hbody, '*', aba, slash, htag, abz); }
    function lhtml(i) { return seq(n, i,
      aba, htag, hta, '*', abz); }
    function chtml(i) { return seq(n, i,
      aba, htag, hta, '*', slash, abz); }
    function thtml(i) { return alt('html', i, chtml, ochtml, lhtml); }

    function turl(i) { return rex('turl', i, /https?:\/\/[^\s]+/); }

    function thtm(i) { return alt(n, i, thtml, taba); }
    function tu(i) { return alt(n, i, turl, th); }
    function tuoh(i) { return alt(n, i, tu, thtm); }
    function tnuh(i) { return rex('t', i, /[^_*()[\]h<]+/); }
    function txt(i) { return alt(n, i, tnuh, tuoh); }

               // back to "piece"
               //
    function text(i) { return seq('text', i, txt, '+', piece, '?'); }

    function burl(i) { return rex('url', i, /https?:\/\/[^ )]+/); }
    function blink(i) { return seq('link', i, sba, text, sbz, rba, burl, rbz); }
    function link(i) { return alt(n, i, blink, text); }

    function undbold(i) { return seq('bold', i, und2, link, und2); }
    function stabold(i) { return seq('bold', i, sta2, link, sta2); }
    function bold(i) { return alt(n, i, stabold, undbold, link); }

    function unditalic(i) { return seq('italic', i, und, bold, und); }
    function staitalic(i) { return seq('italic', i, sta, bold, sta); }
    function italic(i) { return alt(n, i, staitalic, unditalic, bold); }

    function piece(i) { return ren('piece', i, italic); }
               //
               // entry point "piece"

    function content(i) { return rep('content', i, piece, 0); }

    var root = content;

    //
    // rewrite

    function isStr(x) {
      return typeof(x) === 'string'; }
    function reduce(o) {
      var a = arguments[1] || [];
      if (isStr(o)) {
        if (o.length > 0) a.push(isStr(a[a.length - 1]) ? a.pop() + o : o); }
      else if (Array.isArray(o)) {
        o.forEach(function(e) { reduce(e, a); }); }
      else {
        a.push(o); }
      return a; }

    var nmake = function(t, as, cn) {
      return SaintMarcNode.make(t, as, cn);
    };

    var rwcn = function(t/*, name*/) {
      return t.subgather(arguments[1]).map(rewrite); };
    var rrcn = function(t/*, name*/) {
      return reduce(rwcn(t, arguments[1])); }
    var rwt = function(t) {
      return t.string(); };

    var rewrite_t = rwt;
    var rewrite_htxt = rwt;

    var rewrite_html = function(t) {
      var tag = t.lookup('htag').string();
      var atts = {};
      t.gather('hta').forEach(function(at) {
        var k = at.lookup('htak').string();
        var v = at.lookup('htavv'); v = v ? v.string().slice(1, -1) : '';
        atts[k] = v;
      });
      var cn = [];
      t.gather('hbody').forEach(function(bt) { cn = cn.concat(rwcn(bt)); });
      return nmake(tag, atts, cn);
    };

    var rewrite_turl = function(t) {
      var h = t.string();
      return nmake('a', { href: h }, [ h ]);
    };

    var rewrite_link = function(t) {
      var tt = t.lookup('text');
      var ut = t.lookup('url');
      return nmake('a', { href: ut.string() }, rrcn(tt));
    };

    var rewrite_bold = function(t) { return nmake('b', {}, rrcn(t)); };
    var rewrite_italic = function(t) { return nmake('i', {}, rrcn(t)); };

    var rewrite_text = rrcn;
    var rewrite_piece = rrcn;
    var rewrite_content = rrcn;

  }); // end ContentParser

  var parseContent = function(s) { return ContentParser.parse(s); };

  //
  // blocks

  var determineLineType = function(line) {
    if (line.match(/^\s*#{1,6} .+/)) return 'h';
    if (line.match(/^\s*(---|\*\*\*|___)\s*$/)) return 'hr';
    if (line.match(/^\s*\d+\. .+/)) return 'li';
    if (line.match(/^\s*(\*|\+|-) .+/)) return 'li';
    if (line.match(/^<[a-z][a-zA-Z0-9]*[^>]*>/i)) return '<';
    if (line.match(/^> /)) return '>';
    if (line.match(/^\s*$/)) return '';
    return 'p';
  };

  // < mini object system >
  var omake = function(object) {
    var o = Object.create(object);
    if (typeof o.make === 'function') {
      o.make.apply(o, Array.prototype.slice.call(arguments, 1));
    }
    if (arguments[1]) o._name = arguments[1];
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
    toNode: function() {
      var a = this.toA();
      var cn = a[1]
        .reduce(
          function(acc, c) {
            acc.push(
              typeof acc[acc.length - 1] === 'string' &&
                typeof c === 'string' ?
              acc.pop() + '\n' + c :
              c);
            return acc; },
          [])
        .map(function(c) {
          return typeof c === 'string' ? parseContent(c) : c.toNode(); });
      if (Array.isArray(cn) && cn.length === 1) cn = cn[0];
      return SaintMarcNode.make(a[0], {}, cn);
    },
  });
  var HtmlBlock = odefine(Block, {
    lineType: '<',
    accept: function(line) {
      return ! this.closed; },
    push: function(line) {
      this.tag = this.tag || line.match(/^<([^ >]+)/)[1];
      var m = line.match(/^<\/([^>]+)>$/);
      this.closed = (m && m[1] === this.tag);
      this.lines.push(line); return line; },
    toNode: function() {
      return SaintMarcNode.make('div', {}, parseContent(this.lines.join('')));
    },
  });
  var JumpBlock = odefine(Block, {
    lineType: '',
  });
  var ParaBlock = odefine(Block, {
    lineType: 'p',
  });
  var HeaderBlock = odefine(Block, {
    lineType: 'h',
    accept: function(line) { return false; },
    toA: function() {
      var m = this.lines[0].match(/(#+)\s+(.+)$/);
      return [ 'h' + m[1].length, m[2] ];
    },
  });
  var HruleBlock = odefine(Block, {
    lineType: 'hr',
    accept: function(line) { return false; },
    toA: function() { return [ 'hr', [] ]; },
  });
  var QuoteBlock = odefine(Block, {
    lineType: '>',
    toA: function() {
      return [
        'blockquote',
        this.lines.map(function(l) { return l.substring(2); }) ];
    },
  });
  var ListBlock = odefine(Block, {
    lineType: 'li',
    accept: function(line) {
      var lt = determineLineType(line);
      return lt == 'li' || (lt == 'p' && line.match(/^  /));
    },
    toA: function() {
      var es = this.lines.map(function(l) {
        var e = {};
        var m = l.match(/^(\s*)(.*)$/);
        e.s = m[1];
        l = m[2];
        m = l.match(/^((\*|-|\d+\.)\s+)(.+)$/);
        if (m) {
          e.h = m[1];
          e.t = m[1].match(/\d/) ? '1.' : m[2];
          e.st = e.s + e.t;
          e.l = e.s.length + e.h.length;
          e.r = m[3] }
        else {
          e.l = e.s.length;
          e.r = l; }
        return e;
      });
//return es;
      var toLiNode = function(e) {
        return [ 'li', [ e.r ] ];
      };
      var toListNode = function(e, par) {
        var n = [ e.t.match(/\d/) ? 'ol' : 'ul', [ toLiNode(e) ] ];
        n.st = e.st;
        n.l = e.l;
        if (par) { par[1][par[1].length - 1][1].push(n); }
        else { n.root = true; }
        return n;
      };
      var node = toListNode(es.shift());
      var nodes = [ node ];
      var lookupListNode = function(e) {
        for (var i = nodes.length - 1; i > -1; i--) {
          var n = nodes[i];
          if (e.st === n.st) return n;
          if (( ! e.st) && e.l === n.l) return n;
        }
        return null;
      };
      es.forEach(function(e) {
        var n = lookupListNode(e);
        if (n) {
          if (e.st) { // add `li` to list
            n[1].push(toLiNode(e)); node = n; }
          else { // add line to `li`
            node[1][node[1].length - 1][1].push(e.r); }
        }
        else if (e.l > node.l) { // add list to list
          nodes.push(node = toListNode(e, node)); }
        else { // add a new root list
          nodes.push(node = toListNode(e)); }
      });
      var roots = nodes.filter(function(n) { return n.root; });
      return (roots.length > 1) ? [ 'div', roots ] : roots[0];
    },
    toNode: function() {
      var liToNode = function(t) {
        var isStr = function(o) { return typeof(o) === 'string'; };
        var cn = t[1]
          .reduce(
            function(ac, c) {
              if (isStr(c) && isStr(ac[ac.length - 1])) {
                ac.push(ac.pop() + '\n' + c); }
              else {
                ac.push(c); }
              return ac; },
            [])
          .reduce(
            function(ac, c) {
              if (isStr(c)) ac = ac.concat(parseContent(c));
              else ac.push(liToNode(c));
              return ac; },
            []);
        return SaintMarcNode.make(t[0], {}, cn);
      };
      return liToNode(this.toA());
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
      else if (lt === '<') k = HtmlBlock;
      else if (lt === '>') k = QuoteBlock;
      else if (lt === '') k = JumpBlock;
    if ( ! k) throw "don't know what Block to make out of '" + lt + "'";

    var b = omake(k, lt); b.push(line); return b;
  };

  var parseBlocks = function(s, opts) {

    var currentBlock = omake(ParaBlock, 'pb');
    var blocks = [ currentBlock ];

    s
      .split(/\r?\n/)
      .forEach(function(line) {
        if (currentBlock.accept(line)) {
          currentBlock.push(line); }
        else {
          blocks.push(currentBlock = blockMake(line)); }
      });

    return blocks
      .filter(function(b) {
        if (b.lineType === '') return false;
        if (b.lineType === 'p') return ! b.isEmpty();
        return true; });
  };

  var parseNodes = function(bs, opts) {

    var ns = bs.map(function(b) { return b.toNode(); });

    return (ns.length === 1) ? ns[0] : SaintMarcNode.make('div', {}, ns);
  };

  //
  // public methods

  this.parse = function(s, opts) {

    if (typeof s !== 'string') throw "input is not a string";

    opts = opts || {};

    if (opts.debug === 3) return ContentParser.parse(s, opts);

    var blocks = parseBlocks(s, opts);

    if (opts.debug === 'blocks') return blocks;

    return parseNodes(blocks, opts);
  };

  this.toPre = function(s, opts) {

    opts = opts || {};

    return self.parse(s, opts).toPre();
  };

  this.toHtml = function(s, opts) {

    opts = opts || {};

    return self.parse(s, opts).toHtml();
  };

  //
  // done.

  return this;

}).apply({}); // end SaintMarc

