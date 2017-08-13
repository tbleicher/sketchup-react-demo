# sketchup-react-demo/dialog.rb

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
      :width => 600,
      :height => 400,
      :left => 100,
      :top => 100,
      :style => UI::HtmlDialog::STYLE_DIALOG
    }
    
    # create and show the UI::HtmlDialog instance
    dlg = UI::HtmlDialog.new(options);
 
    # define 'su_action' callback to be used from JavaScript
    dlg.add_action_callback("su_action") { |action_context, param1, param2|
      puts "JavaScript triggered 'su_action' with parameters #{param1} and #{param2}"
    }

    dlg.set_html html
    dlg.show
  end

end
