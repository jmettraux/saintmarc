
#
# Specifying saintmarc
#
# Thu Sep 20 17:00:15 JST 2018
#

require 'pp'
require 'execjs'


module Helpers

  def js(s)

    File.open('spec/source.js', 'wb') do |f|
      f.puts(
        (File.read('spec/jaabro.js') rescue nil) ||
        File.read('../jaabro/src/jaabro.js'))
      f.puts(
        File.read('src/saintmarc.js'))
    end

    ExecJS
      .compile(File.read('spec/source.js'))
      .exec(s)
  end
end


RSpec.configure do |c|

  c.alias_example_to(:they)
  c.include(Helpers)
end

