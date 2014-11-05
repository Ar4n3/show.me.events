(function ($) {
	$.fn.showEvents = function(options) {
		var settings = $.extend($.fn.showEvents.defaults, options);
		if (!options.month) { 
			$.fn.showEvents.defaults.month = $.fn.showEvents.variables.date.getMonth(); 
		} else {
			$.fn.showEvents.defaults.month = options.month-1;
		}
		if  (!options.year) { $.fn.showEvents.defaults.year = $.fn.showEvents.variables.date.getFullYear(); }

		return this.each(function() {
			var bootstrap = "<ul class='month'><li><span class='showEventsPrev'><a href='#'></a></span><span class='showDate'></span><span class='showEventsNext'><a href='#'></a></span></li></ul>";
			bootstrap += "<div class='days'><ul>";
			for (i=0; i<=6; i++) {
				bootstrap += "<li>"+$.fn.showEvents.weekdayToString(i)+"</li>";
			}
			bootstrap += "</ul></div><div class='numdays'></div>";
			$(this).append(bootstrap);
			$.fn.showEvents.loadCalendar($.fn.showEvents.eventsThisMonth(settings.month, settings.year));
			//Previous month
			$(".showEventsPrev a").on("click", function(){
				if ($.fn.showEvents.defaults.month > 0) {
					$.fn.showEvents.defaults.month = $.fn.showEvents.defaults.month-1;
				} else {
					$.fn.showEvents.defaults.month = 11;
					$.fn.showEvents.defaults.year = $.fn.showEvents.defaults.year-1;
				}
				$.fn.showEvents.loadCalendar($.fn.showEvents.eventsThisMonth(settings.month, settings.year));
				return false;
			});
			//Next month
			$(".showEventsNext a").on("click", function(){
				if ($.fn.showEvents.defaults.month < 11) {
					$.fn.showEvents.defaults.month = $.fn.showEvents.defaults.month+1;
				} else {
					$.fn.showEvents.defaults.month = 0;
					$.fn.showEvents.defaults.year = $.fn.showEvents.defaults.year+1;
				}
				$.fn.showEvents.loadCalendar($.fn.showEvents.eventsThisMonth(settings.month, settings.year));
				return false;
			});
		});
	};
	//default options
	$.fn.showEvents.defaults = {
		month: null,
		year: null,
		events: null,
		showLang: 'EN'
	};
	//handy variables
	$.fn.showEvents.variables = {
		date: new Date(),
		numdays: null,
		dayFirst: new Date(),
		dayLast: new Date(),
	}
	//handy function converts month to strings (language spanish)
	$.fn.showEvents.monthToString = function(month) {
		if ($.fn.showEvents.defaults.showLang == "ES") {
			var monthStrings = new Array("enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre");
		}
		if ($.fn.showEvents.defaults.showLang == "EN") {
			var monthStrings = new Array("january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december");
		}
		return monthStrings[month].toUpperCase();
	};
	//handy function converts weekday to strings (language spanish)
	$.fn.showEvents.weekdayToString = function(weekday) {
		if ($.fn.showEvents.defaults.showLang == "ES") {
			var weekdayStrings = new Array("lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo");
		}
		if ($.fn.showEvents.defaults.showLang == "EN") {
			var weekdayStrings = new Array("monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday");
		}
		return weekdayStrings[weekday];
	};
	//handy function returns array of events for the month showing in the calendar
	$.fn.showEvents.eventsThisMonth = function(month, year) {
		var eventsArray = $.fn.showEvents.defaults.events;
		var eventToShow = [];
		for (i = 0; i < eventsArray.length; i++) {
			if ((eventsArray[i][0].split("-")).length > 2) {
				if (eventsArray[i][0].split("-")[2] == year) {
					if (eventsArray[i][0].split("-")[1]-1 == month) {
						eventToShow.push(eventsArray[i]);
					}
				}
			} else {
				if (eventsArray[i][0].split("-")[1]-1 == month) {
					eventToShow.push(eventsArray[i]);
				}
			}
		}
		return eventToShow;
	}
	//handy function to show month and year in the navigation
	$.fn.showEvents.showDate = function () {
		var html = "<span class='biggerFont'>"+$.fn.showEvents.monthToString($.fn.showEvents.defaults.month)+"</span><br />"+$.fn.showEvents.defaults.year+" ";
		$(".showDate").html(html);
		//set some variables
		$.fn.showEvents.variables.numdays = new Date($.fn.showEvents.defaults.year, $.fn.showEvents.defaults.month+1, 0).getDate();
		$.fn.showEvents.variables.dayFirst.setFullYear($.fn.showEvents.defaults.year,$.fn.showEvents.defaults.month,1);
		$.fn.showEvents.variables.dayLast.setFullYear($.fn.showEvents.defaults.year,$.fn.showEvents.defaults.month,$.fn.showEvents.variables.numdays);
	}
	//load the calendar. Shows the month that the default variable month contains.
	$.fn.showEvents.loadCalendar = function(events) {
		$.fn.showEvents.showDate();
		$(".numdays div").remove();
		$.fn.showEvents.variables.numdays = new Date($.fn.showEvents.defaults.year, $.fn.showEvents.defaults.month+1, 0).getDate();
		var numdays = $.fn.showEvents.variables.numdays;
		var weekdayfirst = $.fn.showEvents.variables.dayFirst.getDay();
		var weekdaylast = $.fn.showEvents.variables.dayLast.getDay();
		var rowNum = numdays/7;
		for (i=0, day=1, cell = 0, row=0, rowData = ""; i<numdays; i++) {
			if (cell == 0) { rowData += "<div class='row'>"; }			
			if (weekdayfirst == 0) { weekdayfirst = 7; }
			if ((weekdayfirst == (i+1)) && (numdays>0)) {
				rowData += "<div class='calendarDay'><p>"+day+"</p>";
				for (j = 0; j < events.length; j++) {
					if (events[j][0].split("-")[0] == day) {
						rowData += "<a class='showEventsmark' href='"+j+"'><span style='display: none'>"+events[j][1]+"</span></a>";
					}
				}	
				rowData += "</div>";
				weekdayfirst++;
				day++;
			} else if(i<numdays) {
				rowData += "<div></div>";
				numdays++;
			} else {
				rowData += "";
			}
			if (cell == 6) {
				rowData += "</div>";
				cell = 0;
				row++;
			} else {
				cell++;
			}
		}
		$(".numdays").append(rowData);
		$("a[href]").on({
			//Show event tooltip
			mouseenter: function () {
				if ($.isNumeric($(this).attr("href"))) {
					if ($.fn.showEvents.defaults.showLang == "ES") {
						var smallMessage = "Haz click en la estrella para más info";
					}	
					if ($.fn.showEvents.defaults.showLang == "EN") {
						var smallMessage = "Click the star for more info";
					}
					$(".month li").append("<span class='tooltip'><p style='display:none'>"+$(this).children('span').text()+"<br/><small>"+smallMessage+"</small></p></span>");
					$(".tooltip").delay(100).animate({
						width: '56%'
					}, function(){
						$(this).children().fadeIn(100);
					});
				}
			},
			//Hide event tooltip
			mouseleave: function () {
				$(".tooltip p").fadeOut(0, function(){
					$(".tooltip").animate({
						width: '0%'
					}, function(){
						$(this).remove();
					});
				});
			},
			//Show event
			click: function() {
				if ($.isNumeric($(this).attr("href"))) {
					var title = $(this).children().text();
					var address;
					var text;
					for (j = 0; j < $.fn.showEvents.defaults.events.length; j++) {
						if (($.fn.showEvents.defaults.events[j][1] == title) && ($(this).attr("href") == j)) {
							address = $.fn.showEvents.defaults.events[j][2];
							text = $.fn.showEvents.defaults.events[j][3];
						}
					}
					$(".tooltip").hide(0, function(){
						$(this).remove();
						$(".calendario").append("<div class='boxyShow'><h1>"+title+"</h1><span class='address'>"+address+"</span><span class='text'><p>"+text+"</p></span><a href='#' class='showEventsclose' style='display: none'></a></div>");
						$(".boxyShow").children().hide();
						$(".boxyShow").animate({
							width: '100%'
						}, function(){
							$(".showEventsclose").animate({
								width: '4%',
								height: '4%'
							});
							$(".boxyShow").children().fadeIn(100);
						});
						//Close event
						$(".showEventsclose").on("click", function(){
							$(".boxyShow").children().fadeOut(100);
							$(".boxyShow").animate({
								width: '0%'
							}, function(){
								$(this).hide();
								$(this).remove();
							});
							return false;
						});
					});
				return false;
				}
			}
		});
	};
}(jQuery));