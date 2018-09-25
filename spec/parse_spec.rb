
#
# spec'ing saintmarc
#
# Thu Sep 20 17:02:59 JST 2018
#

require 'spec_helpers'


describe 'SaintMarc' do

  describe '.parse()' do

    it 'returns null if it cannot parse' do

      expect(js %{
        return SaintMarc.parse(null);
      }).to eq(
        nil
      )
    end

    it 'parses a markdown string and returns a tree' do

      expect(js %q{
        return SaintMarc.parse(
          'This is our test\n' +
          '\n' +
          'This is another paragraph\n');
      }).to eq(
        [ 'doc', [
          [ 'p', [
            [ 'span', 'This is our test' ]
          ] ],
          [ 'p', [
            [ 'span', 'This is another paragraph' ]
          ] ],
        ] ]
      )
    end

    it 'ignores basic raw HTML' do

      expect(js %q{
        return SaintMarc.parse(
          'This is our <strong>test</strong>.\n' +
          'It sucks,<br>it very much sucks<br/>\n');
      }).to eq(
        [ 'doc', [
          [ 'p', [
            [ 'span', 'This is our ' ],
            [ 'tag', '<strong>' ],
            [ 'span', 'test' ],
            [ 'tag', '</strong>' ],
            [ 'span', '.' ],
            [ 'span', 'It sucks,' ],
            [ 'tag', '<br>' ],
            [ 'span', 'it very much sucks' ],
            [ 'tag', '<br/>' ],
          ] ]
        ] ]
      )
    end

    it 'ignores raw HTML'

    context 'with inlines' do

      {

        #'*emphasis*' => [ 'em', [ 'emphasis' ] ],
        '_emphasis_' => [ 'em', [ [ 'span', 'emphasis' ] ] ],
        '**strong**' => [ 'strong', [ [ 'span', 'strong' ] ] ],
        '__strong__' => [ 'strong', [ [ 'span', 'strong' ] ] ],
        '~~strikethrough~~' => [ 'del', [ [ 'span', 'strikethrough' ] ] ],
        '[here](http://x.com/here)' => [ 'a', [ 'here', 'http://x.com/here' ] ],

      }.each do |k, v|

        it "reads #{k.inspect} as #{v.inspect}" do

          d = js "return SaintMarc.parse(#{k.inspect});"

          expect(d[1][0][1][0]).to eq(v)
        end
      end
    end

    context 'with inlines (2)' do

      {

        '**multiplication**: 1 * 3' =>
          [ 'p', [
            [ 'strong', [ [ 'span', 'multiplication' ] ] ],
            [ 'span', ': 1 * 3' ]
          ] ],
        "* point **1**\n" =>
          [ 'ul', [
            [ 'li', [
              [ 'span', 'point ' ], [ 'strong', [ [ 'span', '1' ] ] ]
            ] ],
          ] ],
        "12. point **12**" =>
          [ 'ol', [
            [ 'li', [
              [ 'span', 'point ' ], [ 'strong', [ [ 'span', '12' ] ] ]
            ] ],
          ] ],
        %{
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
consequat.
        }.strip =>
          [ 'p', [
            [ 'span',
"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod" ],
            [ 'span',
"tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam," ],
            [ 'span',
"quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo" ],
            [ 'span',
"consequat." ]
          ] ],
        %{
* abc
* d**e**f
* ghi
        }.strip =>
          [ 'ul', [
            [ 'li', [
              [ 'span', 'abc' ] ] ],
            [ 'li', [
              [ 'span', 'd' ], [ 'strong', [ [ 'span', 'e' ] ] ],
              [ 'span', 'f' ] ] ],
            [ 'li', [
              [ 'span', 'ghi' ] ] ]
          ] ],
        %{
0. one,
0. two,
0. thr**ee**.
        }.strip =>
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
        '**strong** and _emphatic_' =>
          [ 'p', [
            [ 'strong', [ [ 'span', 'strong' ] ] ],
            [ 'span', ' and ' ],
            [ 'em', [ [ 'span', 'emphatic' ] ] ]
          ] ],

      }.each do |k, v|

        it "parses \"#{k[0, 40].gsub(/\n/, '')}...\"" do

          d = js "return SaintMarc.parse(#{k.inspect});"

          expect(d[1][0]).to eq(v)
        end
      end
    end
  end
end

