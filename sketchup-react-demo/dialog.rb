# sketchup-react-demo/dialog.rb
require 'json'

module SketchupReactDemo
  module_function
  
  def process_data(data, dialog)
    puts 'processing data ...'
    begin
      response = {'error' => 'unknown action', 'status' => 'error'}

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

    rescue => e
      puts e
      response = {'error' => e, 'status' => 'error'}
    end
    
    js_command = 'update_data(' + response.to_json + ')'
    dialog.execute_script(js_command)
  end
    
  def show_dialog
    
    # load html from index.html and replace BASEURL with the current directory
    basedir = File.dirname(File.expand_path(__FILE__))
    html = File.read(File.join(basedir, 'html', 'index.html')).sub("BASEURL", basedir)

    # set options
    options = {
      :dialog_title => "Sketchup React Demo",
      :scrollable => true,
      :resizable => true,
      :width => 750,
      :height => 500,
      :left => 100,
      :top => 100,
      :style => UI::HtmlDialog::STYLE_DIALOG
    }
    
    # create and show the UI::HtmlDialog instance
    dlg = UI::HtmlDialog.new(options)
 
    # define 'su_action' callback to be used from JavaScript
    dlg.add_action_callback("su_action") { |action_context, param|
      puts "\nJavaScript triggered 'su_action' with parameter #{param}"
      param.each do |key, value|
        puts "#{key} : #{value}"
      end 
      SketchupReactDemo::process_data(param, dlg)
    }

    dlg.set_html html
    dlg.show

    # return dlg instance for interaction at Ruby console
    return dlg
  end

end
