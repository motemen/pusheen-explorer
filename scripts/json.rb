require 'yaml'
require 'json'

entries_file = 'app/data/entries.yaml'
entries = YAML.load(File.open(entries_file).read)

puts JSON.pretty_generate(entries)
