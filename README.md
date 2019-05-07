
# saintmarc

A [jaabro](https://github.com/jmettraux/jaabro)-based [Markdown](https://en.wikipedia.org/wiki/Markdown) limited parser with an HTML dumper.

## usage

Saintmarc is a Markdown parser, it's written in Javascript, so, mostly, it's meant to be run in abrowser.

### SaintMarc.parse

```javascript
SaintMarc.parse(
  'This is a <a href="http://example.com/?a=b">link</a>.\n' +
  '1 <7> 4\n' +
  '1 < 7 > 4\n')
    # =>
[ 'doc', [
  [ 'p', [
    [ 'span', 'This is a ' ],
    [ 'tag', '<a href="http://example.com/?a=b">' ],
    [ 'span', 'link' ],
    [ 'tag', '</a>' ],
    [ 'span', '.' ],
    [ 'span', "1 <7> 4\n1 < 7 > 4\n" ],
  ] ]
] ]
```

```javascript
SaintMarc.parse(
  '* abc\n' +
  '* d**e**f\n' +
  '* ghi\n')
    # =>
[ 'ul', [
  [ 'li', [
    [ 'span', 'abc' ] ] ],
  [ 'li', [
    [ 'span', 'd' ], [ 'strong', [ [ 'span', 'e' ] ] ],
    [ 'span', 'f' ] ] ],
  [ 'li', [
    [ 'span', 'ghi' ] ] ]
] ]

SaintMarc.parse(
  '0. one,\n' +
  '0. two,\n' +
  '0. thr**ee**.\n')
    # =>
[ 'ol', [
  [ 'li', [
    [ 'span', 'one,' ] ] ],
  [ 'li', [
    [ 'span', 'two,' ] ] ],
  [ 'li', [
    [ 'span', 'thr' ],
    [ 'strong', [
      [ 'span', 'ee' ] ] ], [ 'span', '.' ] ] ]
] ],
```

Et caetera...

### SaintMarc.toHtml

Saintmarc.toHtml takes a Markdown string and turns it into HTML.

```javascript
SaintMarc.parse(
  '0. one,\n' +
  '0. two,\n' +
  '0. thr**ee**.\n')
    # =>
# OL DOM Element...
```


## LICENSE

MIT, see [LICENSE.txt](LICENSE.txt)

