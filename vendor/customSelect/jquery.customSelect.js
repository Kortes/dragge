/**
 * Plugin for customize default selects
 * @author Anton Vahmin (html.ru@gmail.com)
 * @copyright Clever Site Studio (http://clever-site.ru)
 * @version 1.0.3
 */

(function($) {

	var re_dataAttr = /^data\-(.+)$/;

	// Paste data attributes from element to array
	function paste_data_from_element(data, to) {
		if (data instanceof jQuery) data = copy_data_from_element(data.get(0));
		if (!(to instanceof jQuery)) to = $(to);

		for (var key in data) {
			to.attr(key, data[key]);
		}
	}

	// Copy data attributes from array or DOM element
	function copy_data_from_element(from) {
		if (from instanceof jQuery) {
			from = from.get(0);
		}

		var args = {};
		$.each(from.attributes, function(index, attr) {
			if (re_dataAttr.test(attr.nodeName)) {
				args[attr.nodeName] = attr.nodeValue;
			}
		});
		return args;
	}

	$.fn.extend({

		customSelect: function(options) {

			var defaults = {
				element: 'div',
				maxRows: false,
				template: false,
				closeOthers: true,
				copyClasses: true,
				copyData: true,
				callbacks: {
					initDefaultOption: false,
					selectOption: false,
					afterSelectOption: false,
					clickText: false
				}
			};

			options = $.extend(defaults, options);

			return this.each(function() {

				if (!jQuery().jScrollPane) {
					if (console) {
						if (console.error) {
							console.error('jQuery plugin "jScrollPane" not installed');
						} else {
							console.log('jQuery plugin "jScrollPane" not installed');
						}
					}
					return false;
				}

				var disabled = false;
				var containerClass = 'customSelectContainer';

				var currentSelect = $(this);
				var id = currentSelect.attr('id');
				var containerId = '';
				if (id && id.length > 0) {
					id = ' id="'+id+'"';
					containerId = ' id="'+id+'Container"';
				}
				var name = currentSelect.attr('name');
				var selected = {
					text: false,
					value: currentSelect.val()
				};

				var selectOptions = [];
				var selectOptionsDOM = [];
				currentSelect.find('option').each(function() {
					if ($(this).is(':selected')) {
						selected.text = $(this).text();
					}

					selectOptions[selectOptions.length] = {
						text: $(this).text(),
						value: $(this).attr('value'),
						data: (options.copyData) ? copy_data_from_element(this) : []
					};
				});
				if (currentSelect.attr('disabled')) {
					containerClass += ' customSelectContainer_state_disabled';
					disabled = true;
				}
				var customSelectContainer = $('<'+options.element+' class="'+containerClass+'"'+containerId+' />');
				var customSelectInput = $('<input type="hidden" name="'+name+'" value="'+selected.value+'"'+id+' class="customSelectValue" />');
				var customSelectText = $('<'+options.element+' class="customSelectText" />');
				var customSelectLeft = $('<'+options.element+' class="customSelectLeft" />');
				var customSelectRight = $('<'+options.element+' class="customSelectRight" />');
				var customSelectBack = $('<'+options.element+' class="customSelectBack" />');
				var customSelectArrow = $('<'+options.element+' class="customSelectArrow" />');
				var customSelectOptions = $('<'+options.element+' class="customSelectOptions" />');
				var customSelectScroll = $('<'+options.element+' class="customSelectScroll" />');
				for (var i in selectOptions) {
					var option = $('<'+options.element+' class="customSelectOption" rel="'+selectOptions[i].value+'">'+selectOptions[i].text+'</'+options.element+'>');
					selectOptionsDOM.push(option[0]);
					paste_data_from_element(selectOptions[i].data, option[0]);
				}
				if (selectOptions.length < 1) {
					return false;
				}

                // Copy original classes from select to new div
                if (options.copyClasses) {
                    currentSelect.each(function() {
                        var classesLists = this.className.split(/\s+/);

                        $.each(classesLists, function (i, name) {
                            customSelectContainer.addClass(name);
                        });
                    });
                }

                // Copy original data attributes from select to new div
                if (options.copyData) {
					paste_data_from_element(currentSelect, customSelectContainer);
				}

				currentSelect.replaceWith(customSelectContainer);
				customSelectContainer.append(customSelectInput);
				customSelectContainer.append(customSelectText);
				customSelectText.append(customSelectLeft);
				customSelectLeft.append(customSelectRight);
				customSelectRight.append(customSelectBack);
				customSelectBack.append(customSelectArrow);
				var textElement;
				if (options.template) {
					textElement = $(options.template);
					customSelectArrow.append(textElement);
				} else {
					textElement = customSelectArrow;
				}
				textElement.text(selected.text);
				customSelectContainer.append(customSelectOptions);

                // Try get select width. if select invisible with == 0
                // then try get origin select width
                var container_width = customSelectContainer.width();
                if (container_width === 0) {
                    container_width = currentSelect.width();
                }

				customSelectOptions.css('width', container_width+'px');
				customSelectOptions.append(customSelectScroll);
				for (i in selectOptionsDOM) {
					customSelectScroll.append(selectOptionsDOM[i]);
				}

				// Semen: Добавил проверку disable в селекте
				if (disabled === false) {
					$(customSelectText).bind('click', function() {
						if (options.callbacks.clickText) {
							options.callbacks.clickText($(this));
						}
						if (customSelectOptions.is(':visible')) {
							customSelectOptions.hide();
						} else {
							if (options.closeOthers) {
								$('.customSelectOptions').hide();
							}
							customSelectOptions.show();
						}
					});

					$(selectOptionsDOM).bind('click', function() {
						if (options.callbacks.selectOption) {
							options.callbacks.selectOption.call(customSelectContainer, $(this), textElement);
						}

						customSelectInput.val($(this).attr('rel'));
						textElement.text($(this).text());
						customSelectOptions.hide();
						customSelectInput.change();

						if (options.callbacks.afterSelectOption) {
							options.callbacks.afterSelectOption.call(customSelectContainer, $(this), textElement);
						}
					});
				}


				$(selectOptionsDOM).bind('mouseover', function() {
					$(this).addClass('hover');
				});
				$(selectOptionsDOM).bind('mouseleave', function() {
					$(this).removeClass('hover');
				});
				if (options.maxRows !== false && selectOptions.length > options.maxRows) {
					customSelectScroll.css('height', (customSelectScroll.children(':first-child').height() * options.maxRows)+'px');

					customSelectScroll.jScrollPane();
				}
				customSelectOptions.hide();
				$(document).click(function() {
					customSelectOptions.hide();
				});
				customSelectContainer.click(function(event){
					event.stopPropagation();
				});
				$(document).keyup(function(event){
					if (event.keyCode == 27) {
						customSelectOptions.hide();
					}
				});

				if (options.callbacks.initDefaultOption) {
					options.callbacks.initDefaultOption.call(customSelectContainer, textElement);
				}
			});
		}
	});

})(jQuery);
