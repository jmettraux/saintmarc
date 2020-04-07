
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

      f.puts(File.read('spec/helpers.js'))

      f.puts(File.read(Dir['spec/jaabro*.js'].last))
      f.puts(File.read('src/saintmarc.js'))
    end

    ExecJS
      .compile(File.read('spec/source.js'))
      .exec(s)

  rescue ExecJS::ProgramError, ExecJS::RuntimeError => err

    m =
      err.backtrace[0].match(/:(\d+):(\d+)/) ||
      err.message.match(/:(\d+):(\d+)/)
    raise unless m

    l = m[1].to_i
    c = m[2].to_i

    cols = (`tput cols`.to_i rescue 80)

    lines = File.readlines('spec/source.js')
    l0 = [ 0, l - 14 ].max
    puts "[90m" + ('=' * cols)
    puts "[32m" + s + "[90m"
    puts '-' * cols
    lines[l0..l - 1].each { |l| puts l }
    puts (' ' * c) + "[97m^-- " + err.inspect
    print "[90m"
    lines[l, 14].each { |l| puts l }
    puts ('=' * cols) + "[0;0m"

    raise
  end
end


RSpec.configure do |c|

  c.alias_example_to(:they)
  c.include(Helpers)
end

