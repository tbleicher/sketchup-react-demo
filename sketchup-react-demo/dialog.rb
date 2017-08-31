# sketchup-react-demo/dialog.rb
require 'json'
require_relative 'process_data.rb'

module SketchupReactDemo
  module_function
    
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

      response = SketchupReactDemo::process_data(param)
      js_command = 'update_data(' + response.to_json + ')'
      dlg.execute_script(js_command)
    }

    dlg.set_html html
    dlg.show

    # return dlg instance for interaction at Ruby console
    return dlg
  end

end
