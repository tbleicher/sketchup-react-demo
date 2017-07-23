# sketchup-react-template

A simple example for the use of React.js with SketchUp's UI::HtmlDialog.

SketchUp 2017 has introduced a new class to display HTML content from a Ruby script. Unlike its predecessor UI::WebDialog the new class is based on Chromium which allows the use of modern HTML5 and Javascript on Windows and Mac OS.  

## Structure of the SketchUp Extension

Before we dive into the Javascript side of things, let's set out the basic file structure for the extension:

    +- sketchup-react-demo.rb
    +- sketchup-react-demo/
    |  +- main.rb
    |  +- dialog.rb
    |  +- html/
    |  |  +- index.html
    |  |  +- static/
    |  |  |  +- css/ 
    |  |  |  +- js/
    |  |  |  +- media/
    |  |  +- [other html related files]
    |  +- [other Ruby related files]

At the top level we have a `sketchup-react-demo.rb` file which will register the extension. See [the extension example](http://ruby.sketchup.com/SketchupExtension.html) in the Sketchup Ruby API documentation for details. Next to the file we have a `sketchup-react-demo` directory with all the files related to our extension (Ruby scripts and others). By convention the names of the Ruby file and the extensioion directory should match.

All files for HTML and Javascript content of the HtmlDialog are kept in the `html` directory. We will set up our React project in a way that allows us to copy the finished app into this directory without further modifications. That way we can use the superior React development environment to create the HTML content and don't have to go back and forth between Ruby and Javascript.

### main.rb

Within the extension directory you will most likely have a file to do the initial setup of your extensions's functionality. Here you typically load other Ruby files and create entries in the SketchUp menu for your features. We load the file `dialog.rb` and create an entry in the *Extensions* menu to show the HtmlDialog window.

```ruby
# sketchup-react-demo/main.rb
$:.push(File.dirname(__FILE__))
require 'dialog.rb'

module SketchupReactDemo
  module_function
  def addMenu
    plugins = UI.menu("Extensions")
    plugins.add_item("SketchUp React Demo") { SkethupReactDemo::show_dialog }
  end
end

# create menu entry only the first time the file is loaded
if (not file_loaded?("sketchup-react-demo"))
  SketchupReactDemo::addMenu()
  file_loaded("sketchup-react-demo")
end   
```

### dialog.rb

In the `dialog.rb` file we create and show the HtmlDialog window. Some additional magic needs to happen here because SketchUp uses a temporary directory as the base for any HTML content. This will break paths to images and other files that we want to included in our dialog.

We need to set an explicit `<base href="...">` tag in the header with the full path to the directory that contains our HTML files. When we set up our React app we will add a placeholder for the base url path to the `index.html` template (see below). Then we can use Ruby to read this file as a string and substitute the `BASEURL` placeholder with the full path of our extension directory.

```ruby
# sketchup-react-demo/dialog.rb
module SketchupReactDemo
  module_function

  def show_dialog
    # load html from index.html and replace BASEURL with the current directory
    basedir = File.dirname(File.expand_path(__FILE__))
    html = File.read(File.join(basedir, "html", "index.html")).sub("BASEURL", basedir)

    # set options
    options = {
      :dialog_title => "Sketchup React Demo",
      # more options
      :style => UI::HtmlDialog::STYLE_DIALOG
    }
    
    # create and show the UI::HtmlDialog instance
    dlg = UI::HtmlDialog.new(options);
    dlg.set_html html
    dlg.show
  end
end
```

## Creating a new React.js project

### Requirements

You need [Node.js](https://nodejs.org) installed. You can find installers on the homepage. The installer also installs npm, the Node package manager on you your system. Allow the installer to add the `node` and `npm` commands to your PATH to access the new tools from the command line.

With this in place you can install [create-react-app](https://github.com/facebookincubator/create-react-app) and [yarn](https://yarnpkg.com/en/), an improved package manager for Node. This is the new canonical way to set up a new React app with all the bells and whistles. Type the following command to install the new tools:

    $ npm install -g create-react-app
    $ npm install -g yarn

> Note: On Mac OS you will have to prepend the commands with `sudo` to allow a system wide installation.

With the Node and React development tools installed we can use `create-react-app` to generate the file structure for a new React project. All Javascript development will happen here. At the end we use the features of `create-react-app` to generate an optimized bundle of files which we copy to the `html` folder of the SketchUp extension. Let's begin by creating a default React app in a new directory:

    $ create-react-app my-react-app

`my-react-app` is both the name of the new app and the folder in which all the files will be created. This command will take a while to install all Javascript dependencies for the development environment. At the end it will print a handy summary of the next commands to run:

```
Success! Created my-react-app at /path/to/your/my-react-app
Inside that directory, you can run several commands:

  yarn start
    Starts the development server.

  yarn build
    Bundles the app into static files for production.

  yarn test
    Starts the test runner.

  yarn eject
    Removes this tool and copies build dependencies, configuration
    files and scripts into the app directory.
    If you do this, you can’t go back!

We suggest that you begin by typing:

  cd my-react-app
  yarn start

Happy hacking! 
```

Follow the last two commands to change into the newly create directory and start the development server on port 3000. A new browser window with the **Welcome to React** page will open up.

![Basic React.js App](https://tbleicher.github.io/sketchup-react-demo/images/basic_react_app.png)

It may not look like much but this page has all elements of a working React *Single Page App*. Our goal is to bundle up this page into a portable format that we can copy into a Ruby extension and load into a new UI::HtmlDialog window.

### Modifying the basic app

Before we can create an app package that works from within SketchUp we need to make a few modifications to the basic app template. 

#### package.json

Open the file `package.json` in the root directory of the app in an editor and add a `homepage` key to JSON object like below: 

```json
...
"devDependencies": {
  "react-scripts": "1.0.10"
},
"homepage": "./html/",
"scripts": {
  "start": "react-scripts start",
  "build": "react-scripts build",
...
```

The value for the `homepage` setting depends on the name of directory that we chose for our HTML content (`html` in our case). We will make this the root directory of the HTML page and the bundling tool will use this setting to adjust the file paths of our bundled assets.

#### public/index.html

As mentioned above, we need to add a placeholder to the `index.html` template to substitute the path of the extension directory during runtime. The template was generated for us in the `public` folder of our project. Add the new `<base href="BASEURL/">` tag to the `<head>` section of the page, including the trailing slash (`/`).

```html
...
  <title>React App</title>
  <base href="BASEURL/">
</head>
...
```

#### src/index.js

Finally, open the file `src/index.js` and comment out the two lines related to `ServiceWorker`. There is no use for it in our context.

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
//import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
//registerServiceWorker();
```

### Create the HTML bundle

These are all the changes necessary to make the complete React app work with SketchUp's HtmlDialog. To generate the optimized Javascript and CSS bundles we run the `build` task that is part of the `react-scripts` tool. It is already set up in the `package.json` file and available via the `yarn` command. 

    yarn build

The output of the command shows you the path to the final *.js and *.css files. As you can see the file names include a hash. An updated `index.html` file has also been created in the `build` folder and it contains our placeholder for the base url. 


```
File sizes after gzip:

  47.85 KB  build/static/js/main.b4678e87.js
  288 B     build/static/css/main.cacbacc7.css

The project was built assuming it is hosted at ./html/.
You can control this with the homepage field in your package.json.

The build folder is ready to be deployed.

✨  Done in 11.04s.
```

To deploy our files we just need to copy the contents of the build folder into our `html` folder. 

    cp -r ./build/* <path-to-Plugins-folder>/sketchup-react-demo/html/

Now we can start SketchUp 2017 and open the HtmlDialog from the new menu entry in `Extensions`. The dialog should look identical to page that we got earlier from the development server. 

## Next steps

We have a working setup with React running inside the HtmlDialog window. React doesn't do much yet and we have not set up any form of interaction with SketchUp. It would also be nice to have a simple command that could deploy updated React files locally to the `Plugins` folder or create a new `*.rbz` extension bundle. 

The good news is that all these tasks are easily implemented with the tools in place and can be left as an excercise for the reader.

