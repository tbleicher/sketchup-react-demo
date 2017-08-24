# sketchup-react-demo/dialog.rb
require 'json'

module SketchupReactDemo

  def process_data(data, dialog)
    puts 'processing data ...'
    js_command = "set_data({colors: ['red', 'green', 'blue']})"
    dialog.execute_script(js_command)
  end
    
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
      :width => 480,
      :height => 400,
      :left => 100,
      :top => 100,
      :style => UI::HtmlDialog::STYLE_DIALOG
    }
    
    # create and show the UI::HtmlDialog instance
    dlg = UI::HtmlDialog.new(options)
 
    # define 'su_action' callback to be used from JavaScript
    dlg.add_action_callback("su_action") { |action_context, param|
      puts "JavaScript triggered 'su_action' with parameter #{param}"
      param.each do |key, value|
        puts "#{key} : #{value}"
      end 
    }

    dlg.set_html html
    dlg.show
  end

end
