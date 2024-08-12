# DomObserver

`DomObserver` is a JavaScript class that allows you to observe changes in the DOM and execute callbacks when specific elements are added. It uses the `MutationObserver` API to monitor changes and provides a convenient way to manage multiple observers and their associated callbacks.

## Features

- **Automatic DOM observation**: Automatically observe changes in the DOM and execute callbacks when new elements matching a selector are added.
- **Customizable settings**: Customize the settings for each observer. New observers are only created when their settings do not match an existing Observer's settings.
- **Efficient updates**: Efficiently update the observed elements using a caching mechanism.

## Installation

```bash
npm i domobserverjs
yarn add domobserverjs
```

## Usage

#### Import the `DomObserverController`
```javascript
import DomObserverController from 'domobserverjs';
```


#### Assign the `DomObserverController` to the `window`
```javascript
window.DomObserver = new DomObserverController;
```

#### Observing Elements
```javascript
DomObserver.observe('.my-class', (elements) => {
    elements.forEach((element) => {
        console.log('New element found!', element);
    });
});
```

You may optionally pass a 3rd argument to define any `MutationObserver` [options](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver/observe#options)

#### Custom Observer Options
```javascript
DomObserver.observe('.my-class', (elements) => {
    elements.forEach((element) => {
        console.log('New element found!', element);
    });
}, {
  childList: true,
  subtree: true,
});
```

## Default Settings

The default callback for each DOM observer is:

```javascript
(items) => console.log('DomObserver:', items);
```

The default settings for each DOM observer are:

```javascript
{
  childList: true,
  subtree: true,
};
```

## License
[MIT](https://choosealicense.com/licenses/mit/)
