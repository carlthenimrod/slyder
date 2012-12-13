### slyder: jQuery slideshow with many options.
====

slyder dynamically generates a image gallery based on an element. The slideshow features many options such as transition options, render templates, HTML 5, and responsive design.


### Release info:

The current release is version 1.01. This is the inital release and more features and updates are planned.


### Examples:
----

Basic slyder usuage on an empty element, the plugin will do the rest.

	$('#element').slyder();

Add a JavaScript object to achieve additional functionality, some options are nested in objects.

	$('#element').slyder({
		autoStart: true,
		html5: false,
		render: 'default',
		speed: {

			auto: 500,
			load: 1000,
			transition: 300	
		}
	});


### Options:
----

Here is a brief rundown of all the different options with their default values.

**animationRandom**: Accepts boolean, selects random animation on slide transition.

	$('#element').slyder({
		animationRandom: true
	});

**animationType**: Accepts a string, selects animation to be used on slide transition, if no string is provided, defaults to fade animation.

	$('#element').slyder({
		animationType: false
	});

List of selectable animations:

	- 'blindsLeft'
	- 'blindsTop'
	- 'fade'
	- 'fadeBars'
	- 'slideBarsDown'
	- 'slideBarsLeft'
	- 'slideBarsUp'

**autoStart**: Accepts boolean, sets the slyder to auto transition.

$('#element').slyder({
	autoStart: true
});

**classNames**: Accepts a object, holds all of the CSS class names. Allows you to change the name of the classes for the slyder.

	$('#element').slyder({
		classNames: {
			ctn: 'custom-class-gallery'
		}
	});

List of renameable CSS class names with their default values:

	- active: 'sly-active',
	- activeThumb: 'sly-active-thumb',
	- clone: 'sly-clone',
	- ctn: 'sly-ctn',
	- ctrl: 'sly-ctrl',
	- ctrlPrev: 'sly-prev',
	- ctrlNext: 'sly-next',
	- img: 'sly-img',
	- thumbs: 'sly-thumbs',
	- txt: 'sly-txt'

**html5**: Accepts a boolean value, true creates sections/nav elements, alternatively false creates divs.

	$('#element').slyder({
		html5: true
	});

**imgClick**: Accepts a boolean value, if true, takes the anchor's rel attribute and re-directs window location on image click.

	$('#element').slyder({
		imgClick: false
	});

**imgSrc**: Accepts a boolean value, if true, sets the inital starting image to element with identical src attribute.

	$('#element').slyder({
		imgSrc: false
	});

**preloadAll**: Accepts a boolean value, determines whether to preload first image or all images.

	$('#element').slyder({
		preloadAll: false
	});

**render**: Accepts a string, contains options for different rendering templates.

	$('#element').slyder({
		render: false
	});

	List of selectable rendering options:

	- 'defaultTop',
	- 'minimal'

**resolution**: Accepts integer, sets the resolution of the image gallery, only works if responsive is also set to true.

	$('#element').slyder({
		resolution: 1.77
	});

**responsive**: Accepts boolean, sets the slyder to have a responsive height based on the width.

	$('#element').slyder({
		responsive: false
	});

**speed**: Accepts object, sets the speeds in milliseconds of the animations.

	$('#element').slyder({
		speed: {

			auto: 3000,
			load: 300,
			transition: 500
		}
	});

### Build Contents:
----
Initial build contains source code in both uncompressed and minified versions. Additionally, a CSS, image, and JavaScript folder that contains examples and reccommended default settings.


### Requests and future expansion:
----
All feedback and updates can be found on the slyder GitHub page:

https://github.com/carlthenimrod/slyder