require 'net/http'

module Jekyll
  class RenderTimeTag < Liquid::Tag

    def initialize(tag_name, variables, tokens)
      super
    end

    def render(context)
        @openload_id = context[@markup.strip]

        uri = URI('https://slmn.de/teamidealsubs/teamidealsubs-openload-thumbnail-proxy.php?file_id=' + @openload_id)
        response = Net::HTTP.get(uri)

        "#{response}"
    end
  end
end

Liquid::Template.register_tag('openload_thumbnail', Jekyll::RenderTimeTag)