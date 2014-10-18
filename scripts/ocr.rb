require 'yaml'
require 'json'
require 'tempfile'

entries_file = 'app/data/entries.yaml'
existing_entries = YAML.load(File.open(entries_file).read) rescue {}

def do_ocr(image_path)
  `tesseract #{image_path} stdout 2>/dev/null`.strip
end

class Post
  attr_reader :url, :photos

  def initialize(data)
    @url = data['post_url']
    @photos = (data['photos'] || []).map do |data|
      Photo.new(data)
    end
  end

  class Photo
    attr_reader :original, :alts

    def initialize(data)
      @original = Size.new(data['original_size'])
      @alts = data['alt_sizes'].map do |alt|
        Size.new(alt)
      end
    end

    OCR_MINIMUM_WIDTH = 300

    def ocr_suitable
      alts.sort_by do |a|
        a.width
      end.find do |a|
        a.width >= OCR_MINIMUM_WIDTH
      end
    end

    class Size
      attr_reader :width, :height, :url

      def initialize(data)
        @width  = data['width'].to_i
        @height = data['height'].to_i
        @url    = data['url']
      end
    end
  end
end

def mirror_url(url)
  file_path = url.sub(%r(^http://), 'cache/')

  unless File.exists?(file_path)
    system 'wget', '-nv', '--mirror', '-P', 'cache', url or abort $!
  end

  file_path
end

posts = JSON.load(STDIN.read).map do |data|
  Post.new(data)
end

data = posts.each_with_index.map do |post,i|
  STDERR.print "\r#{i+1}/#{posts.length}"

  existing_post = existing_entries.find do |p|
    p['url'] == post.url
  end

  photos = post.photos.map do |photo|
    existing = existing_post && existing_post['photos'] && existing_post['photos'].find do |p|
      p['url'] == photo.original.url
    end

    if existing and existing['text']
      existing
    else
      if suitable = photo.ocr_suitable
        text = do_ocr mirror_url(suitable.url)
      else
        text = nil
      end

      {
        'url'    => photo.original.url,
        'width'  => photo.original.width,
        'height' => photo.original.height,
        'text'   => text,
      }
    end
  end

  { 'url' => post.url, 'photos' => photos }
end

STDERR.puts

File.open(entries_file, 'w') do |io|
  io.puts YAML.dump(data)
end
