
(function ($) {
	
	var SkillX = function($e, param) {
		var self = this;
				self.$e = $e;
				self.param = param;
				
		function generateID(salt) {
			var date = new Date();
			var day = date.getDate();
			var month = date.getMonth() + 1;
			var year = date.getFullYear();
			var hours = date.getHours();
			var minutes = date.getMinutes();
			var seconds = date.getSeconds();
			
			var string = "";
			var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
			for (var i = 0; i < 5; i++) {
				string += chars.charAt(Math.floor(Math.random() * chars.length));
			}
			
			var base = btoa(	(salt+year+month+day+hours+minutes+seconds+string)	);
					base = base.replace('=','');
			
			return base.substring(0,5);
		}
		
		function generateFilter(ID) {
			var svg = "";
					svg += '<svg class="skillx-goo" xmlns="http://www.w3.org/2000/svg" version="1.1">';
					svg += '<defs>';
					svg += '<filter id="skillx_goo_'+ID+'">';
					svg += '<feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />';
					svg += '<feColorMatrix in="blur" mode="matrix" ';
					svg += ' values=" ';
					svg += '1 0 0 0 0  ';
					svg += '0 1 0 0 0  ';
					svg += '0 0 1 0 0  ';
					svg += '0 0 0 18 -8" ';
					svg += ' result="skillx_goo_'+ID+'" />';
					svg += '<feBlend in="SourceGraphic" in2="skillx_goo_'+ID+'" />';
					svg += '</filter>';
					svg += '</defs>';
					svg += '</svg>';
			
			return svg;
		}
		
		function draw() {
			var _id = $e.attr('id');
					_id = (typeof _id !== 'undefined' && _id) ? _id : 'SKILLX';
			var ID = generateID(_id);
			
			self.$e.find('.skillx').remove();
			var elementWidth = self.$e.outerWidth();
			var elementHeight = self.$e.outerHeight();
			var wrapperSize = elementWidth;
			if(elementWidth > elementHeight) { wrapperSize = elementHeight; }
			
			$wrapper = $('<div />', { 'class' : 'skillx standby', 'id' : 'skillx_'+ID });
			$wrapper.html(generateFilter(ID));
			$wrapper.appendTo(self.$e);
			$wrapper.css({
				'filter' : 'url(#skillx_goo_'+ID+')',
				'width' : wrapperSize+'px',
				'height' : wrapperSize+'px'
			});
			
			var onItemClick = self.param.hasOwnProperty('onItemClick') ? self.param['onItemClick'] : $.noop();
			var maxPoints = self.param.hasOwnProperty('maxPoints') ? Number(self.param['maxPoints']) : 5;
			var showValueAs = self.param.hasOwnProperty('showValueAs') ? self.param['showValueAs'].toLowerCase() : 'percentage';
			var sortOpt = self.param.hasOwnProperty('sort') ? self.param['sort'] : { 'enable' : true, 'column' : 'value', 'order' : 'desc' };
			var flatEdge = self.param.hasOwnProperty('flatEdge') ? self.param['flatEdge'] : false;
			var items = (self.param && self.param.hasOwnProperty('items')) ? self.param['items'] : null;
			if(items && items.length) {
				var sortEnable = (sortOpt && sortOpt.hasOwnProperty('enable')) ? sortOpt.enable : true;
				if(sortEnable) {
					var sortColumn = (sortOpt && sortOpt.hasOwnProperty('column')) ? sortOpt.column : 'value';
					var sortOrder = (sortOpt && sortOpt.hasOwnProperty('order')) ? sortOpt.order.toLowerCase() : 'desc';
					
					items.sort(function(a, b){
						if(a[sortColumn] < b[sortColumn]) return ((sortOrder == 'asc') ? -1 : 1);
						if(a[sortColumn] > b[sortColumn]) return ((sortOrder == 'asc') ? 1 : -1);
						return 0;
					});
				}
				
				var maxItemWidth = wrapperSize / 2;
				var minItemWidth = maxItemWidth / maxPoints;
				var itemHeight = minItemWidth * 0.1;
						itemHeight = (itemHeight < 20) ? 20 : itemHeight;
				var itemWidth = minItemWidth;
						itemWidth = (itemWidth < 20) ? 20 : itemWidth;
				var angle = 360 / items.length;
				
				var $center = $('<div />', { 'class' : 'skillx-center' });
						$center.css({
							'width' : itemHeight+'px',
							'height' : itemHeight+'px'
						});
						$center.appendTo($wrapper);
				
				for(var i = 0; i < items.length; i++) {
					var item = items[i];
					var itemTheta = i * angle;
							if(items.length == 2 && i == 0) itemTheta = 60;
							if(items.length == 2 && i == 1) itemTheta = 120;
					var itemName = item['name'];
					var itemValue = Number(item['value']);
					var itemTextColor = (item.hasOwnProperty('textColor') && item['textColor']) ? item['textColor'].toLowerCase() : '#FFF';
					var itemBgColor = (item.hasOwnProperty('bgColor') && item['bgColor']) ? item['bgColor'].toLowerCase() : 'hsla('+itemTheta+',100%, 50%, 1)';
					var itemClass = (item.hasOwnProperty('class') && item['class']) ? item['class'] : null;
					var itemAttr = (item.hasOwnProperty('attr') && item['attr']) ? item['attr'] : null;
					var itemData = (item.hasOwnProperty('data') && item['data']) ? item['data'] : null;
					var itemWidth = itemValue * minItemWidth;
					var displayValue = (showValueAs == 'percentage') ? Math.round((itemValue / maxPoints)*100)+'%' : (itemValue + '/' + maxPoints);
					
					var $item = $('<div />', { 'class' : 'skillx-item' });
							$item.css({
								'width' : itemWidth+'px',
								'height' : itemHeight+'px',
								'background-color' : itemBgColor,
								'color' : itemTextColor,
								'transform' : 'translateY(-50%)'
							});
							$item.html('<span>'+ itemName + ' <strong> ' + displayValue + '</strong></span>');
							$item.attr('data-theta', itemTheta);
							$item.attr('data-label', (itemName+' ('+displayValue+')'));
							
							if(itemClass) $item.addClass(itemClass);
							
							if(itemAttr) {
								$.each(itemAttr,function(k,v) {
									$item.attr(k,v);
								});
							}
							
							if(itemData) {
								$.each(itemData,function(k,v) {
									$item.attr('data-'+(k.toLowerCase()),v);
								});
							}
							
							var data = (itemData) ? Object.assign({}, item, itemData) : item;
									data.maxPoints = maxPoints;
									data.width = itemWidth;
									data.height = itemHeight;
									data.theta = itemTheta;
									data.displayValue = displayValue;
							$item.data('data',data);
							
							if(flatEdge) $item.addClass('flat-edge');
							$item.appendTo($wrapper);
					
							$item.off('click').on('click',function(e) {
								var data = $(this).data('data');
								var arg = Object.assign({}, e, data);
								onItemClick(arg);
							});
							
							$item.off('mouseover').on('mouseover',function() {
								self.$e.find('.skillx-item').css('opacity','0.25');
								$(this).css('opacity','1');
							}).off('mouseleave').on('mouseleave',function() {
								self.$e.find('.skillx-item').css('opacity','1');
							});
				}
				
				var $scrollParent = getScrollParent(self.$e);
				if($scrollParent.length) $scrollParent.on('scroll',debounce(display,125));
				
				display();
			}
		}
		
		function display() {
			setTimeout(function() {
				var $scrollParent = getScrollParent(self.$e);
				var sTop = $scrollParent.scrollTop();
				
				var sY = $scrollParent.scrollTop() + ($scrollParent.outerHeight() / 2);
				var eY = self.$e.position().top + (self.$e.outerHeight() / 2);
				var d = Math.round((eY - sY)*100)/100;
				
				if(d <= 100) {
					var t = 0;
					self.$e.find('.skillx-item').each(function() {
						var $item = $(this);
						setTimeout(function() {
							var theta = $item.attr('data-theta');
							$item.css('transform', 'translateY(-50%) rotateZ('+theta+'deg)');
						}, (t*125));
						t++;
					});
				} else {
					var t = 0;
					self.$e.find('.skillx-item').each(function() {
						var $item = $(this);
						setTimeout(function() {
							var theta = $item.attr('data-theta');
							$item.css('transform', 'translateY(-50%)');
						}, (t*125));
						t++;
					});
				}
			}, 62.5);
		}
		
		function getScrollParent($elem) {
			var i = $elem.css("position"),
					s = "absolute" === i,
					n = /(auto|scroll|hidden)/;
					o = $elem.parents().filter(function() {
							var e = $(this);
							return s && "static" === e.css("position") ? !1 : n.test(e.css("overflow") + e.css("overflow-y") + e.css("overflow-x"))
					}).eq(0);
			return "fixed" !== i && o.length ? o : $(this[0].ownerDocument || document)
		};
		
		function debounce(func, wait, immediate) {
			var timeout;
			return function() {
				var context = this, args = arguments;
				var later = function() {
					timeout = null;
					if (!immediate) func.apply(context, args);
				};
				var callNow = immediate && !timeout;
				clearTimeout(timeout);
				timeout = setTimeout(later, wait);
				if (callNow) func.apply(context, args);
			};
		};
		
		function writeStyle() {
			var $style = $(document).find('style#skillx_style').eq(0);
			if(!$style.length) {
				$style = $('<style />', { 'type' : 'text/css', 'id' : 'skillx_style' });
				$style.append('.skillx {');
				$style.append('width: 100%;');
				$style.append('height: 100%;');
				$style.append('position: relative;');
				$style.append('margin: 0 auto;');
				$style.append('}');
				$style.append('.skillx .skillx-center {');
				$style.append('width: 50px;');
				$style.append('height: 50px;');
				$style.append('position: absolute;');
				$style.append('top: 50%;');
				$style.append('left: 50%;');
				$style.append('transform: translate(-50%,-50%);');
				$style.append('z-index: 3;');
				$style.append('background-color: #FFF;');
				$style.append('border-radius: 100%;');
				$style.append('}');
				$style.append('.skillx .skillx-item {');
				$style.append('width: 50%;');
				$style.append('height: 10%;');
				$style.append('position: absolute;');
				$style.append('top: 50%;');
				$style.append('right: 50%;');
				$style.append('transition: all 250ms ease-in-out;');
				$style.append('transform-origin: right center;');
				$style.append('z-index: 1;');
				$style.append('border: 1px solid transparent;');
				$style.append('border-radius: 100% 0 0 100%;');
				$style.append('overflow: hidden;');
				$style.append('cursor: pointer;');
				$style.append('}');
				$style.append('.skillx .skillx-item.flat-edge {');
				$style.append('border-radius: 0 0 0 0');
				$style.append('}');
				$style.append('.skillx .skillx-item:hover { z-index: 2; width: 50% !important; }');
				$style.append('.skillx .skillx-item span {');
				$style.append('display: inline-block;');
				$style.append('margin-right: 20px;');
				$style.append('padding-right: 10px;');
				$style.append('float: right;');
				$style.append('}');
				$style.appendTo(	$('head')	);
			}
		}
		
		function init() {
			if(typeof self.param === 'string' && $.trim(self.param) == 'redraw') {
				self.param = $e.data('data');
				setTimeout(draw,250);
			} else {
				writeStyle();		
				setTimeout(draw,250);
				
				$(window).resize(function() {
					setTimeout(draw,250);
				});
				
				$e.data('data',self.param);
			}
			
			return self;
		}
		
		return init();
	};
	
	$.fn.skillx = function(param) {
		return this.each(function() {
			var p = (typeof param !== 'undefined' && param) ? param : null;
			return new SkillX(	$(this), p	);
		});
	};
	
})(jQuery);




















