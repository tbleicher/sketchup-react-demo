## Connecting Ruby and JavaScript

With the basic React app running in the HtmlDialog window we need to establish communication from the dialog to our Ruby code and vice versa.

### Sending Data to Ruby

To set up a callback function in Ruby we can use the `add_action_callback` method of the HtmlDialog instance following the [API documentation](http://ruby.sketchup.com/UI/HtmlDialog.html#add_action_callback-instance_method) example: 

```ruby
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
```

This code defines the `su_action` function on the global `sketchup` object in JavaScript. On the Ruby side this method expects one argument (`param`) and expects it to be a hash. Just for testing it will print the (key, value) pairs out to the Ruby console. 

We can use this function directly from the JavaScript console:

1. Copy the new dialog.rb file in the extension directory.
2. Open SketchUp.
3. Open the Ruby console window.
4. Open the Demo dialog window.
5. Right-click in the dialog and select `Inspect Element` from the context menu.
6. Switch to the Console tab of the web dev tools window.
7. Type `sketchup` at the console prompt.

![The 'sketchup' JavaScript object](https://tbleicher.github.io/sketchup-react-demo/images/js_console.png) 

The console will show `Object {}` with a triangular marker to the left. Click on the marker to expand the list of properties. In the list you will see our `su_action` function. To try out the function type the following command in the JavasScript console:

```javascript
sketchup.su_action( {message: 'Hello World'} )
``` 

With this function we call our `su_action` funciton with an object as argument. The object has one property called `message` with the value 'Hello World'. If everything is set up correctly you will see the following output in the Ruby console:

![Data received in the Ruby console.](https://tbleicher.github.io/sketchup-react-demo/images/ruby_console.png) 



