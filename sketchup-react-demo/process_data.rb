# sketchup-react-demo/process_data.rb

module SketchupReactDemo
  module_function
  
  def process_data(data)
    puts 'processing data ...'

    # The response is a hash object with the same keys as the props of the
    # App component in React: error, status, materials and thumbnails
    
    # Begin with an error message to flag if something goes wrong.
    response = {'error' => 'unknown action', 'status' => 'error'}
    
    begin
      
      if data['action'] == 'LOAD_MATERIALS'
        response = { 
          'materials' => self.get_material_hash,
          'status' => 'materials loaded'
        }
      end

      if data['action'] == 'LOAD_THUMBNAIL' then
        name = data['payload']
        thumbnail = self.get_thumbnail_base64(name)
        response = {
          'thumbnails' => { name => thumbnail },
          'status' => "thumbnail '#{name}' loaded"
        }
      end

      if data['action'] == 'LOAD_THUMBNAILS' then
        response = {
          'materials' => self.get_material_hash,
          'thumbnails' => self.get_thumbnails_hash,
          'status' => 'thumbnails loaded'
        }
      end
      
      if data['action'] == 'REPLACE_MATERIAL'
          replace = data['payload']['replace']
          replace_with = data['payload']['replace_with']
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
      response = {'error' => e, 'status' => 'error'}
    end
    
    return response
  end

end