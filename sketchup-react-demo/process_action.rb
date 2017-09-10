# sketchup-react-demo/process_data.rb

module SketchupReactDemo
  module_function
  
  def log_response(response)
    puts 'Response data:'
    response.each { |key, value| 
      if key == 'materials' || key == 'thumbnails'
        puts "  #{key} : [object]"
      else
        puts "  #{key} : #{value}"
      end
    }
  end

  # collect response data for action
  #
  # The response is a hash object with the same keys as the props of the
  # App component in React: error, status, materials and thumbnails
  def process_action(action)
    puts 'processing action ...'
  
    # Begin with an error message to flag if something goes wrong.
    response = {'error' => 'unknown action type', 'status' => 'ERROR'}
    
    begin
      
      if action['type'] == 'LOAD_MATERIALS'
        response = { 
          'materials' => self.get_material_hash,
          'status' => 'materials loaded'
        }
      end

      if action['type'] == 'LOAD_THUMBNAIL' then
        name = action['payload']
        thumbnail = self.get_thumbnail_base64(name)
        response = {
          'thumbnails' => { name => thumbnail },
          'status' => "thumbnail '#{name}' loaded"
        }
      end

      if action['type'] == 'LOAD_THUMBNAILS' then
        response = {
          'thumbnails' => self.get_thumbnails_hash,
          'status' => 'thumbnails loaded'
        }
      end
      
      if action['type'] == 'REPLACE_MATERIAL'
          replace = action['payload']['replace']
          replace_with = action['payload']['replace_with']
          self.replace_material(replace, replace_with)
          
          response = {
            'materials' => self.get_material_hash,
            'status' => "replaced '#{replace}' with '#{replace_with}'"
          }
      end
    
    # in case of an exception replace the existing error message with
    # the exception's error message 
    rescue => e
      puts e
      response = {'error' => e, 'status' => 'ERROR'}
    end
    
    self.log_response(response)
    return response
  end

end