
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
            [ 'This is our test' ]
          ] ],
          [ 'p', [
            [ 'This is another paragraph' ]
          ] ]
        ] ]
      )
    end

    it 'ignores raw HTML'

    context 'with inlines' do

      {

        #'*emphasis*' => [ 'em', [ 'emphasis' ] ],
        '_emphasis_' => [ 'em', [ 'emphasis' ] ],
        '**strong**' => [ 'strong', [ 'strong' ] ],
        '__strong__' => [ 'strong', [ 'strong' ] ],
        '~~strikethrough~~' => [ 'del', [ 'strikethrough' ] ],
        '[here](http://x.com/here)' => [ 'a', [ 'here', 'http://x.com/here' ] ],

      }.each do |k, v|

        it "reads #{k.inspect} as #{v.inspect}" do

          d = js "return SaintMarc.parse(#{k.inspect});"

          expect(d[1][0][1][0]).to eq([ v ])
        end
      end
    end

    context 'with inlines (2)' do

      {

        '**multiplication**: 1 * 3' =>
          [ 'p', [
            [ [ 'strong', [ 'multiplication' ] ], ': 1 * 3' ]
          ] ]

      }.each do |k, v|

        it "reads #{k.inspect} as #{v.inspect}" do

          d = js "return SaintMarc.parse(#{k.inspect});"

          expect(d[1][0]).to eq(v)
        end
      end
    end
  end
end

