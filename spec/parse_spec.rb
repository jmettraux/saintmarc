
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
        []
      )
    end

    it 'ignores raw HTML'
  end
end

