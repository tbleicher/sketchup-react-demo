## sketchup-react-demo

A simple example for the use of React.js with SketchUp's UI::HtmlDialog.

### HtmlDialog and React.js

SketchUp 2017 has introduced the new *UI::HtmlDialog* class to display a user interface based on HTML. This dialog is based on Chromium which allows the use of modern HTML5 and Javascript on Mac OS and Windows.

*React.js* is a popular library to build complex JavaScript user interfaces. It has supporting tools like [*create-react-app*](https://github.com/facebookincubator/create-react-app) which creates a basic app, including the configuration for a [webpack](https://webpack.github.io/) development server with [hot module replacement](https://webpack.github.io/docs/hot-module-replacement.html).

In the [GitHub pages](https://tbleicher.github.io/sketchup-react-demo/) of this repo I show the changes necessary to use the minimal React.js app in the HtmlDialog and expand the generated template into a small demo app to replace SketchUp materials in a model. 

![The React Demo app.](./docs/images/dialog.png)

### Requirements

You need [Node.js](https://nodejs.org) installed. With this in place you can install [create-react-app](https://github.com/facebookincubator/create-react-app) and [yarn](https://yarnpkg.com/en/) (optional, but nice):

    $ npm install -g create-react-app
    $ npm install -g yarn

### Installation

When you clone or download the repo to start with the demo app you have to install the JavaScript dependencies for the React.js app first.

    $ git clone https://github.com/tbleicher/sketchup-react-demo.git
    $ cd sketchup-react-demo/my-react-app
    $ yarn install

From here you can use the webpack dev server to run the app UI in a browser windows and start modifying the code:

    $ yarn start

Or you can build and copy the full extension to your local SketchUp 2017 Plugins directory with the included `deploy:local` script:

    $ yarn run deploy:local

Then open SketchUp and run the extension via the `Extensions - HtmlDialog Demo` menu entry (see [GitHub pages](https://tbleicher.github.io/sketchup-react-demo/) for a short description of the function).

