
#
# Specifying saintmarc
#
# Thu Sep 20 17:00:15 JST 2018
#

require 'pp'
require 'execjs'


module Helpers

  def js(s)

    ExecJS
      .compile(
        File.read('../jaabro/src/jaabro.js') + "\n" +
        File.read('src/saintmarc.js'))
      .exec(s)
  end
end


RSpec.configure do |c|

  c.alias_example_to(:they)
  c.include(Helpers)
end

