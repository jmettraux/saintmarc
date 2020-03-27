
#
# spec'ing saintmarc
#
# Fri Mar 27 11:51:13 JST 2020
#

require 'spec_helpers'


describe 'SaintMarcNode' do

  describe '.innerText()' do

    it 'works with plain paragraphs' do

      s =
        "Max 20% of portfolio in non-IG bonds (if any downgrades after " +
        "purchase) allowed with min Ba4/BB-/BB- rating."
      t =
        js "return SaintMarc.parse(#{s.inspect}).innerText();"

      expect(t).to eq(%{
Max 20% of portfolio in non-IG bonds (if any downgrades after purchase) allowed with min Ba4/BB-/BB- rating.
      }.strip)
    end

    it 'works with ul' do

      s = %{
* raspi
* dac
* speakers
        }.strip
      t =
        js "return SaintMarc.parse(#{s.inspect}).innerText();"

      expect(t).to eq(%{
raspi dac speakers
      }.strip)
    end
  end
end

