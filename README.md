### slyder: jQuery slideshow with many options.
====

slyder dynamically generates a image gallery based on an element. The slideshow features many options such as transition options, render templates, HTML 5, and responsive design.


### Release info:

The current release is version 1.02. This is the inital release and more features and updates are planned.


### Examples:
----

Basic slyder usuage on an empty element, the plugin will do the rest.

	$('#element').slyder();

Add a JavaScript object to achieve additional functionality.

	$('#element').slyder({
		autoStart: true,
		html5: false,
		render: 'default'
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

**class Options**: Accepts a string, holds CSS class names. Allows you to change the name of the classes for the slyder.

	$('#element').slyder({
		classActive: 'sly-active',
		classActiveThumb: 'sly-active-thumb',
		classClone: 'sly-clone',
		classCtn: 'sly-ctn',
		classCtrl: 'sly-ctrl',
		classPrev: 'sly-prev',
		classNext: 'sly-next',
		classImg: 'sly-img',
		classThumbs: 'sly-thumbs',
		classTxt: 'sly-txt'
	});

List of renameable CSS class names with their default values:

	- classActive: 'sly-active'
	- classActiveThumb: 'sly-active-thumb'
	- classClone: 'sly-clone'
	- classCtn: 'sly-ctn'
	- classCtrl: 'sly-ctrl'
	- classPrev: 'sly-prev'
	- classNext: 'sly-next'
	- classImg: 'sly-img'
	- classThumbs: 'sly-thumbs'
	- classTxt: 'sly-txt'

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

**Speed Options**: Accepts a number, sets the speeds in milliseconds for the animations.

	$('#element').slyder({
		speedAuto: 3000,
		speedLoad: 300,
		speedTransition: 500
	});

List of adjustable speeds:

	- speedAuto: 3000
	- speedLoad: 300
	- speedTransition: 500

### Build Contents:
----
Initial build contains source code in both uncompressed and minified versions. Additionally, a CSS, image, and JavaScript folder that contains examples and reccommended default settings.


### Requests and future expansion:
----
All feedback and updates can be found on the slyder GitHub page:

https://github.com/carlthenimrod/slyder