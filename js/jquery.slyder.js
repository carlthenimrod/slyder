;(function($, win, doc, undefined){

	var slyder = {

		init: function(options, elem){

			var that = this;

			//mix in the passed-in options with the default options
			that.config = $.extend({}, that.defaults, options);

			//save the element reference, both as a jQuery
			//reference and a normal reference
			that.elem  = elem;
			that.$elem = $(elem);

			//store linkList
			that.linkList = that.$elem.find('a');

			//empty/hide $elem
			that.$elem.empty().hide();

			//build the DOM's initial structure
			$.when(that.build()).then(function(){

				//if autoStart is enabled, start auto
				if(that.config.autoStart) that.autoStart = win.setInterval(function(){ that.auto() }, that.config.speed.auto);

				//create events
				that.events();

			}, function(){

				//alert error if gallery fails to load
				alert('Error: Gallery failed to load.');
			});

			//return that so that we can chain and use the bridge with less code.
			return that;
		},

		defaults: {

			animationRandom: true,
			animationType: false,
			autoStart: true,

			classNames: {

				active: 'sly-active',
				activeThumb: 'sly-active-thumb',
				clone: 'sly-clone',
				ctn: 'sly-ctn',
				ctrl: 'sly-ctrl',
				ctrlPrev: 'sly-prev',
				ctrlNext: 'sly-next',
				img: 'sly-img',
				thumbs: 'sly-thumbs',
				txt: 'sly-txt'
			},

			html5: true,

			imgClick: false,
			imgSrc: false,

			render: false,
			resolution: 1.777,
			responsive: false,

			speed: {

				auto: 3000,
				load: 300,
				transition: 500
			}
		},

		build: function(){

			var that = this,
				dfd = $.Deferred();

			//when done rendering
			$.when(that.render()).then(function(){

				//show $elem, set settings, then hide
				that.$elem.show(); that.settings(); that.$elem.hide();				
				
				//fade in $elem
				that.$elem.fadeIn(that.config.speed.load, function(){

					dfd.resolve();
				});

			}, function(){

				dfd.reject();
			});

			return dfd.promise();
		},

		settings: function(){

			this.config.imgWidth = this.modules.img.width();
			this.config.imgHeight = (this.config.responsive) ? this.config.imgWidth / this.config.resolution : this.modules.img.height();

			this.modules.img.find('img').css({

				'height': this.config.imgHeight,
				'width': this.config.imgWidth
			});

			if(this.config.responsive){

				this.eventResponsiveResize();
			}

			if(this.modules.thumbs){

				this.config.thumbsWidth = this.modules.thumbs.width();
				this.config.thumbsListWidth = this.modules.thumbs.find('ul').width();
			}
		},

		events: function(){

			var that = this;

			that.modules.img.on('click', function(e){

				that.eventImgClick();
				
				e.preventDefault();
			});

			if(that.config.responsive){

				$(win).on('resize', function(){
					
					that.eventResponsiveResize();
				});
			}							

			if(that.modules.thumbs){

				that.modules.thumbs.on('click', 'li a', function(e){

					that.eventThumbClick($(this));

					e.preventDefault();
				});

				that.modules.thumbs.on('mousemove', function(e){

					that.eventThumbMouseMove(this, e.pageX - $(this).offset().left);

					e.preventDefault();
				});
			}

			if(that.modules.ctrlPrev){

				that.modules.ctrlPrev.on('click', function(e){

					that.prevThumb();

					e.preventDefault();			
				});		
			}

			if(that.modules.ctrlNext){
				
				that.modules.ctrlNext.on('click', function(e){

					that.nextThumb();

					e.preventDefault();
				});				
			}				
		},

		eventImgClick: function(){

			if(this.config.imgClick === 'link'){

				//go to rel attrib
				win.location = this.modules.activeThumb.find('img').attr('rel');
			}
		},

		eventResponsiveResize: function(){

			this.config.imgWidth = this.modules.img.width();
			this.config.imgHeight = this.config.imgWidth / this.config.resolution;

			this.modules.img.find('img').css({

				'height': this.config.imgHeight,
				'width': this.config.imgWidth
			});			

			if(this.config.responsive){

				this.modules.img.height(this.config.imgHeight);

				if(this.modules.ctrlPrev){

					this.modules.ctrlPrev.height(this.config.imgHeight);
				}

				if(this.modules.ctrlNext){

					this.modules.ctrlNext.height(this.config.imgHeight);
				}
			}
		},

		eventThumbClick: function(link){

			this.modules.activeThumb = link;

			this.modules.thumbs.find('a').removeClass(this.config.classNames.activeThumb);

			this.modules.activeThumb.addClass(this.config.classNames.activeThumb);

			this.transition();
		},

		eventThumbMouseMove: function(ctn, relX){

			var that = this,
				ul = that.modules.thumbs.find('ul'), 
				leftOver, marginRight, percent, move;

			//find last margin right
			marginRight = parseInt($(ul).find('li').last().css('margin-right'), 10);

			//find left over space
			leftOver = this.config.thumbsListWidth - that.config.thumbsWidth;

			//if margin right, remove last margin off of left over
			if(marginRight){

				leftOver = leftOver - marginRight;
			}

			//find percent, limit to 3 decimal points
			percent = (relX / that.config.thumbsWidth).toFixed(3);

			//find out how many pixels to move
			move = (percent * leftOver).toFixed(3);

			//move list
			ul.css({ 'left' : '-' + move + 'px' });
		},

		prevThumb: function(){

			var previous

			if(this.modules.thumbs){

				previous = this.utils.findPrevious(this.modules.thumbs, this.modules.activeThumb);

				this.modules.activeThumb = previous;

				this.modules.thumbs.find('a').removeClass(this.config.classNames.activeThumb);

				this.modules.activeThumb.addClass(this.config.classNames.activeThumb);
			}
			else{

				previous = this.utils.findPreviousImage(this.modules.active, this.linkList);

				this.modules.activeThumb = previous;
			}		
			
			this.transition();
		},

		nextThumb: function(){

			var next;

			if(this.modules.thumbs){

				next = this.utils.findNext(this.modules.thumbs, this.modules.activeThumb);

				this.modules.activeThumb = next;

				this.modules.thumbs.find('a').removeClass(this.config.classNames.activeThumb);

				this.modules.activeThumb.addClass(this.config.classNames.activeThumb);
			}
			else{

				next = this.utils.findNextImage(this.modules.active, this.linkList);

				this.modules.activeThumb = next;
			}
			
			this.transition();
		},	

		auto: function(){

			this.nextThumb();
		},		

		render: function(){

			var that = this,
				modules = [],
				dfd = $.Deferred();

			//create modules object
			that.modules = {};

			//add necessary modules
			modules.push(that.renderContainer());

			if(that.config.render === 'minimal'){

				modules.push(that.renderControls());
				modules.push(that.renderImage());
			}
			else if(that.config.render === 'defaultTop'){

				modules.push(that.renderThumbs());
				modules.push(that.renderText());
				modules.push(that.renderControls());
				modules.push(that.renderImage());
			}
			else{

				modules.push(that.renderControls());
				modules.push(that.renderImage());
				modules.push(that.renderText());
				modules.push(that.renderThumbs());
			}

			//when modules loaded
			$.when.apply(that, modules).then(function(){

				//module successfully loaded
				dfd.resolve();

			}, function(){

				//reject, modules failed to load
				dfd.reject();
			});

			return dfd.promise();
		},

		renderContainer: function(){

			if(this.config.html5){

				this.modules.ctn = $('<section>');
			}
			else{

				this.modules.ctn = $('<div>');
			}

			this.modules.ctn.attr({

				'class': this.config.classNames.ctn
			});

			this.$elem.append(this.modules.ctn);
		},

		renderControls: function(){

			if(this.config.html5){

				this.modules.ctrl = $('<section>');
			}
			else{

				this.modules.ctrl = $('<div>');
			}

			this.modules.ctrl.attr({

				'class': this.config.classNames.ctrl
			});

			this.modules.ctrlPrev = $('<div>', {

				'class': this.config.classNames.ctrlPrev
			});

			this.modules.ctrlNext = $('<div>', {

				'class': this.config.classNames.ctrlNext
			});

			this.modules.ctrl.append(this.modules.ctrlPrev);
			this.modules.ctrl.append(this.modules.ctrlNext);

			this.modules.ctn.append(this.modules.ctrl);
		},

		renderImage: function(){

			var that = this, 
				dfd = $.Deferred(),
				img, 
				src;

			if(that.config.html5){

				that.modules.img = $('<section>');
			}
			else{

				that.modules.img = $('<div>');
			}

			that.modules.img.attr({

				'class': that.config.classNames.img
			});

			that.modules.ctn.append(that.modules.img);

			//get src for image, if imgSrc isn't set, get first img
			src = (that.config.imgSrc) ? that.config.imgSrc : $(that.linkList[0]).attr('href');

			//preload image
			that.utils.preload(src).done(function(){

				img = $('<img/>', {

					'class': that.config.classNames.active,
					'src': src
				});

				//set active module
				that.modules.active = img;

				that.modules.img.append(img);

				dfd.resolve();
			});			

			return dfd.promise();
		},

		renderText: function(){

			var link, text;

			//retrieve link
			link = this.utils.findLink(this.config.imgSrc, this.linkList);

			//store title attr
			text = $(link).attr('title');

			if(this.config.html5){

				this.modules.txt = $('<section>');
			}
			else{

				this.modules.txt = $('<div>');
			}

			this.modules.txt.attr({

				'alt': text,
				'class': this.config.classNames.txt,
				'title': text
			}).html(text);

			this.modules.ctn.append(this.modules.txt);
		},

		renderThumbs: function(){

			var that = this, 
				dfd = $.Deferred(), 
				ul, 
				li, 
				src = [], 
				active;
			
			if(that.config.html5){

				that.modules.thumbs = $('<nav>');
			}
			else{

				that.modules.thumbs = $('<div>');
			}

			that.modules.thumbs.attr({

				'class': that.config.classNames.thumbs
			});

			that.modules.ctn.append(that.modules.thumbs);

			ul = $('<ul>');

			(function(){

				var i, l;

				for(i = 0, l = that.linkList.length; i < l; ++i){

					li = $('<li>');

					li.append(that.linkList[i]);

					ul.append(li);

					//add to src array for preloading
					src.push($(that.linkList[i]).find('img').attr('src'));
				}
			})();

			that.utils.preload(src).done(function(){

				that.modules.thumbs.append(ul);

				//set list width
				that.utils.setListWidth(ul);

				//find active thumb
				active = (that.config.imgSrc) ? that.utils.findLink(that.config.imgSrc, that.linkList) : that.linkList[0];

				//set active thumb module
				that.modules.activeThumb = $(active);

				//add active class
				$(active).addClass(that.config.classNames.activeThumb);

				dfd.resolve();
			});

			return dfd.promise();
		},

		transition: function(){

			var that = this,
				activeSrc = that.modules.active.attr('src'),
				newSrc = that.modules.activeThumb.attr('href'),
				title = that.modules.activeThumb.attr('title'),
				timeout,
				img;

			//if the activeSrc is not equal to the newSrc, proceed
			if(activeSrc !== newSrc){

				//if autoStart is enabled, clear it
				if(that.config.autoStart) win.clearInterval(that.autoStart);

				if(that.modules.txt) that.modules.txt.html(title);

				//if not animating
				if((!that.animating) || (that.animating.state() !== 'pending')){

					that.utils.preload(newSrc).done(function(){

						//clone active img, to maintain width/height css properties
						img = that.modules.active.clone(); 

						//reset src
						img.attr({

							'src' : newSrc
						});

						//remove active class
						img.removeClass(that.config.classNames.active);

						//append image to image module
						that.modules.img.append(img);

						//set next image
						that.modules.next = img;

						//perform animation
						$.when(that.animation()).done(function(){
							
							that.modules.active.remove();

							that.modules.next.addClass(that.config.classNames.active);

							that.modules.active = that.modules.next;

							//if autoStart is enabled, start auto
							if(that.config.autoStart) that.autoStart = win.setInterval(function(){ that.auto() }, that.config.speed.auto);

							that.transition();
						});			
					});	
				}
			}
		},

		animation: function(){

			var animationFunction,
				animate;

			this.animating = $.Deferred();

			if(this.config.animationRandom){

				//store all functions in array
				animationFunctions = [

					this.animationBlindsLeft,
					this.animationBlindsTop,
					this.animationFade,
					this.animationFadeBars,
					this.animationSlideBarsDown,
					this.animationSlideBarsLeft,
					this.animationSlideBarsUp
				];

				//pick random animation
				animate = animationFunctions[Math.floor( Math.random() * animationFunctions.length )];

				//while animation is duplicate, select another random
				while(animate === this.currentAnimation){

					animate = animationFunctions[Math.floor( Math.random() * animationFunctions.length )];
				}

				//set current animation
				this.currentAnimation = animate;

				//call animation
				animate.call(this);
			}
			else{

				switch(this.config.animationType){

					case 'blindsLeft' :
						this.animationBlindsLeft();
						break;

					case 'blindsTop' :
						this.animationBlindsTop();
						break;

					case 'fade' :
						this.animationFade();
						break;

					case 'fadeBars' :
						this.animationFadeBars();
						break;

					case 'slideBarsDown' :
						this.animationSlideBarsDown();
						break;

					case 'slideBarsLeft' :
						this.animationSlideBarsLeft();
						break;

					case 'slideBarsUp' :
						this.animationSlideBarsUp();
						break;				

					default :
						this.animationFade();
						break;
				}
			}

			return this.animating.promise();
		},

		animationBlindsLeft: function()
		{
			var that = this,
				total = 10,
				widthBox = Math.ceil(this.config.imgWidth / total),
				heightBox = this.config.imgHeight,
				leftMove = '+=' + widthBox,
				left,
				leftImg,
				i;

			for(i = 0; i < total; ++i){

				left = widthBox * i;
				leftImg = -(widthBox * i);

				var clone = $('<div/>', {

					'class': this.config.classNames.clone
				}).append(this.modules.active.clone());

				clone.css({
					left: left, 
					top: 0, 
					height: heightBox,
					width: widthBox
				});

				clone.find('img').css({
					left: leftImg,
					top: 0
				});

				clone.appendTo(this.modules.img);

				delay = i * this.config.speed.transition / total;

				if(i === total - 1){
					clone.delay(delay).animate({left: leftMove, width: 0}, this.config.speed.transition, function(){

						$(this).remove();

						that.animating.resolve();
					});
				}
				else{
					clone.delay(delay).animate({left: leftMove, width: 0}, this.config.speed.transition, function(){				

						$(this).remove();
					});
				}
			}

			this.modules.active.remove();
		},

		animationBlindsTop: function()
		{

			var that = this,
				total = 15,
				widthBox = Math.ceil(this.config.imgWidth),
				heightBox = Math.ceil(this.config.imgHeight / total),
				topMove = '+=' + heightBox,
				top,
				topImg,
				i;

			for(i = 0; i < total; ++i){

				top = heightBox * i;
				topImg = -(heightBox * i);

				var clone = $('<div/>', {

					'class': this.config.classNames.clone
				}).append(this.modules.active.clone());

				clone.css({
					left: 0, 
					top: top, 
					height: heightBox,
					width: widthBox
				});

				clone.find('img').css({
					left: 0,
					top: topImg
				});

				clone.appendTo(this.modules.img);

				delay = i * this.config.speed.transition / total;

				if(i === total - 1){
					clone.delay(delay).animate({top: topMove, height: 0}, this.config.speed.transition, function(){

						$(this).remove();

						that.animating.resolve();
					});
				}
				else{
					clone.delay(delay).animate({top: topMove, height: 0}, this.config.speed.transition, function(){				

						$(this).remove();
					});
				}
			}

			this.modules.active.remove();
		},	

		animationFade: function(){

			var that = this;

			that.modules.active.fadeOut(that.config.speed.transition, function(){

				that.animating.resolve();
			});
		},

		animationFadeBars: function()
		{
			var that = this,
				total = 10,
				widthBox = Math.ceil(this.config.imgWidth / total),
				heightBox = this.config.imgHeight,
				left,
				leftImg,
				i;

			for(i = 0; i < total; ++i){

				left = widthBox * i;
				leftImg = -(widthBox * i);

				var clone = $('<div/>', {

					'class': this.config.classNames.clone
				}).append(this.modules.active.clone());

				clone.css({
					left: left, 
					top: 0, 
					height: heightBox,
					width: widthBox
				});

				clone.find('img').css({
					left: leftImg,
					top: 0
				});

				clone.appendTo(this.modules.img);

				delay = i * this.config.speed.transition / total;

				if(i === total - 1){

					clone.delay(delay).fadeOut(this.config.speed.transition, function(){

						$(this).remove();

						that.animating.resolve();
					});
				}
				else{

					clone.delay(delay).fadeOut(this.config.speed.transition, function(){

						$(this).remove();
					});
				}
			}

			this.modules.active.remove();
		},

		animationSlideBarsDown: function()
		{
			var that = this,
				total = 10,
				widthBox = Math.ceil(this.config.imgWidth / total),
				heightBox = this.config.imgHeight,
				left,
				leftImg,
				i;

			for(i = 0; i < total; ++i){

				left = widthBox * i;
				leftImg = -(widthBox * i);

				var clone = $('<div/>', {

					'class': this.config.classNames.clone
				}).append(this.modules.active.clone());

				clone.css({
					left: left, 
					top: 0, 
					height: heightBox,
					width: widthBox
				});

				clone.find('img').css({
					left: leftImg,
					top: 0
				});

				clone.appendTo(this.modules.img);

				delay = i * this.config.speed.transition / total;

				if(i === total - 1){
					clone.delay(delay).animate({top: heightBox, opacity: 0.5}, this.config.speed.transition, function(){

						$(this).remove();

						that.animating.resolve();
					});
				}
				else{
					clone.delay(delay).animate({top: heightBox, opacity: 0.5}, this.config.speed.transition, function(){				

						$(this).remove();
					});
				}
			}

			this.modules.active.remove();
		},

		animationSlideBarsLeft: function()
		{

			var that = this,
				total = 30,
				widthBox = Math.ceil(this.config.imgWidth),
				heightBox = Math.ceil(this.config.imgHeight / total),
				top,
				topImg,
				i;

			for(i = 0; i < total; ++i){

				top = heightBox * i;
				topImg = -(heightBox * i);

				var clone = $('<div/>', {

					'class': this.config.classNames.clone
				}).append(this.modules.active.clone());

				clone.css({
					left: 0, 
					top: top, 
					height: heightBox,
					width: widthBox
				});

				clone.find('img').css({
					left: 0,
					top: topImg
				});

				clone.appendTo(this.modules.img);

				delay = i * this.config.speed.transition / total;

				if(i === total - 1){
					clone.delay(delay).animate({left: '-' + widthBox, opacity: 0}, this.config.speed.transition, function(){

						$(this).remove();

						that.animating.resolve();
					});
				}
				else{
					clone.delay(delay).animate({left: '-' + widthBox, opacity: 0}, this.config.speed.transition, function(){				

						$(this).remove();
					});
				}
			}

			this.modules.active.remove();
		},	

		animationSlideBarsUp: function()
		{
			var that = this,
				total = 5,
				widthBox = Math.ceil(this.config.imgWidth / total),
				heightBox = this.config.imgHeight,
				delay = 0,
				clone,
				left,
				leftImg,
				i;

			for(i = 0; i < total; ++i){

				delay = i * that.config.speed.transition / total;

				left = widthBox * i;
				leftImg = -(widthBox * i);

				clone = $('<div/>', {

					'class': that.config.classNames.clone
				}).append(that.modules.active.clone());

				clone.css({
					left: left, 
					top: 0, 
					height: heightBox,
					width: widthBox
				});

				clone.find('img').css({
					left: leftImg,
					top: 0
				});

				clone.appendTo(that.modules.img);

				if(i === total - 1){

					clone.delay(delay).animate({top: '-' + heightBox, opacity: 0.5}, that.config.speed.transition, function(){

						$(this).remove();

						that.animating.resolve();
					});
				}
				else{

					clone.delay(delay).animate({top: '-' + heightBox, opacity: 0.5}, that.config.speed.transition, function(){				

						$(this).remove();
					});
				}
			}

			this.modules.active.remove();
		},


		//utility functions
		utils: {

			findLink: function(href, linkList){

				var i, l;

				//if href is false, find first link's href
				if(!href){

					href = $(linkList[0]).attr('href');
				}

				//for each element in linkList
				for(i = 0, l = linkList.length; i < l; ++i){

					//if href matches current links href
					if(href === $(linkList[i]).attr('href')){

						//return link
						return linkList[i];
					}
				}
			},

			findLinkWithImage: function(src, linkList){

				var i, l, href;

				//if src is false, find first link's href
				if(!src){

					href = $(linkList[0]).attr('href');
				}

				//for each element in linkList
				for(i = 0, l = linkList.length; i < l; ++i){

					//if href matches current links href
					if(src === $(linkList[i]).attr('href')){

						//return link
						return linkList[i];
					}
				}
			},

			findNext: function(thumbs, active){

				var next = active.parent().next().find('a');

				//if no next, find first
				if(!next.length) next = thumbs.find('a').eq(0);

				return next;
			},

			findNextImage: function(active, linkList){

				var i, l;

				//for each element in linkList
				for(i = 0, l = linkList.length; i < l; ++i){

					//if href matches current links href
					if(active.attr('src') === $(linkList[i]).attr('href')){

						//if last, return first
						if(l === (i + 1)){

							return $(linkList[0]);
						}
						//else return next
						else{

							return $(linkList[i + 1]);
						}
					}
				}
			},

			findPrevious: function(thumbs, active){

				var previous = active.parent().prev().find('a');

				//if no previous, find last
				if(!previous.length) previous = thumbs.find('a').last();

				return previous;
			},

			findPreviousImage: function(active, linkList){

				var i, l;

				//for each element in linkList
				for(i = 0, l = linkList.length; i < l; ++i){

					//if href matches current links href
					if(active.attr('src') === $(linkList[i]).attr('href')){

						//if first, return last
						if(i === 0){

							return $(linkList[l - 1]);
						}
						//else return previous
						else{

							return $(linkList[i - 1]);
						}
					}
				}
			},

			preload: function(srcs){

				var dfd = $.Deferred(),
					promises = [],
					img,
					l,
					p;

				if (!$.isArray(srcs)) {
					srcs = [srcs];
				}

				l = srcs.length;

				for (var i = 0; i < l; i++) {
					p = $.Deferred();
					img = $("<img />");

					img.load(p.resolve);
					img.error(p.resolve);

					promises.push(p);

					img.get(0).src = srcs[i];
				}

				$.when.apply(this, promises).done(dfd.resolve);

				return dfd.promise();
			},

			setListWidth: function(ul){

				var i, l, 
					$ul = $(ul),
					li = $ul.find('li'),
					w = 0;


				//for each list item
				for(i = 0, l = li.length; i < l; ++i){

					//find and store outerWidth
					w = w + $(li[i]).outerWidth(true);
				}

				$ul.css('width', w);
			}
		}						
	};

	// Object.create support test, and fallback for browsers without it
	if (typeof Object.create !== 'function'){

		Object.create = function (o){

			function F() {}

			F.prototype = o;

			return new F();
		};
	}

	// Create a plugin based on a defined object
	$.plugin = function(name, object){

		$.fn[name] = function(options){

			return this.each(function(){

				if (!$.data(this, name)){

					$.data( this, name, Object.create(object).init(options, this));
				}
			});
		};
	};

	// Usage:
	$.plugin('slyder', slyder);

})(jQuery, window, document);