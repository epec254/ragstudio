require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"sphinx-rtd-theme":[function(require,module,exports){ // NOLINT
    var jQuery = (typeof(window) != 'undefined') ? window.jQuery : require('jquery');

    // Sphinx theme nav state
    function ThemeNav () {

        var nav = {
            navBar: null,
            win: null,
            winScroll: false,
            winResize: false,
            linkScroll: false,
            winPosition: 0,
            winHeight: null,
            docHeight: null,
            isRunning: null
        };

        nav.enable = function () {
            var self = this;

            jQuery(function ($) {
                self.init($);

                self.reset();
                self.win.on('hashchange', self.reset);

                // Set resize monitor
                self.win.on('resize', function () {
                    self.winResize = true;
                });
                setInterval(function () { if (self.winResize) self.onResize(); }, 25);
                self.onResize();
            });
        };

        nav.init = function ($) {
            var doc = $(document),
                self = this;

            this.navBar = $('div.wy-side-scroll:first');
            this.win = $(window);

            // Set up javascript UX bits
            $(document)
            // Shift nav in mobile when clicking the menu.
                .on('click', "[data-toggle='wy-nav-top']", function() {
                    $("[data-toggle='wy-nav-shift']").toggleClass("shift");
                    $("[data-toggle='rst-versions']").toggleClass("shift");
                })

            // Nav menu link click operations
                .on('click', ".wy-menu-vertical .current ul li a", function() {
                    var target = $(this);
                    // Close menu when you click a link.
                    $("[data-toggle='wy-nav-shift']").removeClass("shift");
                    $("[data-toggle='rst-versions']").toggleClass("shift");
                    // Handle dynamic display of l3 and l4 nav lists
                    self.toggleCurrent(target);
                    self.hashChange();
                });

                $('body').on('click', function(e) {
                    $("[data-toggle='rst-versions']").removeClass("shift-up");
                });

                $("[data-toggle='rst-versions']").click(function(e) {
                    e.stopPropagation();
                    $("[data-toggle='rst-versions']").toggleClass("shift-up");
                });

            // Make tables responsive
            $("table.docutils:not(.field-list)")
                .wrap("<div class='wy-table-responsive'></div>");

            // Add expand links to all parents of nested ul
            $('.wy-menu-vertical ul').not('.simple').siblings('a').each(function () {
                var link = $(this);
                expand = $('<span class="toctree-expand"></span>');
                expand.on('click', function (ev) {
                    self.toggleCurrent(link);
                    ev.stopPropagation();
                    return false;
                });
                link.prepend(expand);
            });


            // process anchors, but only do it this way if it's NOT a redoc page
            if (!detectIsRedocPage()) {

              $('a[href*=\\#]')
                  .not('[href="#"]')
                  .not('[href="#0"]')
                  .on('click', function (evt){
                      if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') &&
                          location.hostname === this.hostname) {
                          evt.preventDefault();
                          var hash = $(this).attr('href');
                          var $scrollingAnchor = $(hash);

                          scrollTo($scrollingAnchor);

                          if (history.pushState) {
                              history.pushState(null, null, hash);
                          } else {
                              location.hash = hash;
                          }
                      }
              });

              maybeScrollToAnchor();
              window.onhashchange = function() {
                  maybeScrollToAnchor();
              }
            }

           ///   setupSearch();

          }; // init()


        nav.reset = function () {
            // Get anchor from URL and open up nested nav
            var anchor = encodeURI(window.location.hash);
            if (anchor) {
                try {
                    var link = $('.wy-menu-vertical')
                        .find('[href="' + anchor + '"]');
                    $('.wy-menu-vertical li.toctree-l1 li.current')
                        .removeClass('current');
                    link.closest('li.toctree-l2').addClass('current');
                    link.closest('li.toctree-l3').addClass('current');
                    link.closest('li.toctree-l4').addClass('current');
                    link.closest('li.toctree-l5').addClass('current');
                }
                catch (err) {
                    console.log("Error expanding nav for anchor", err);
                }
            }
        };

        nav.onScroll = function () {
            this.winScroll = false;
            var newWinPosition = this.win.scrollTop(),
                winBottom = newWinPosition + this.winHeight,
                navPosition = this.navBar.scrollTop(),
                newNavPosition = navPosition + (newWinPosition - this.winPosition);
            if (newWinPosition < 0 || winBottom > this.docHeight) {
                return;
            }
            this.navBar.scrollTop(newNavPosition);
            this.winPosition = newWinPosition;
        };

        nav.onResize = function () {
            this.winResize = false;
            this.winHeight = this.win.height();
            this.docHeight = $(document).height();
        };

        nav.hashChange = function () {
            this.linkScroll = true;
            this.win.one('hashchange', function () {
                this.linkScroll = false;
            });
        };

        nav.toggleCurrent = function (elem) {
            var parent_li = elem.closest('li');
            parent_li.siblings('li.current').removeClass('current');
            parent_li.siblings().find('li.current').removeClass('current');
            parent_li.find('> ul li.current').removeClass('current');
            parent_li.toggleClass('current');
        }

        return nav;
    };

    module.exports.ThemeNav = ThemeNav();

    if (typeof(window) != 'undefined') {
        window.SphinxRtdTheme = { StickyNav: module.exports.ThemeNav };
    }

},{"jquery":"jquery"}]},{},["sphinx-rtd-theme"]);

// Added Mon, Apr 05, 2021 to detect redoc and NOOP some
// anchor-related code that seems problematic. Also, incorporated
// the NOOP of the side-nav too (code originally in forked file custom-redoc-pages.js)
detectIsRedocPage = function () {

  checkForRedoc = document.getElementsByTagName("redoc").length;
  if (checkForRedoc) {
    //console.log("redoc detected!");
    return true;
  }

  //console.log("redoc was NOT detected");
  return false;
}


// CUSTOM JS

// feedback link
// var toField = "feedback@databricks.com";
// var subjectField = "Documentation Feedback";
// var bodyField = "I found an error on: " + document.URL;
// var feedbackUrlHref = "mailto:" + toField + "?subject=" + subjectField + "&body=" + encodeURI(bodyField)
// $('#feedbacklink').attr("href", feedbackUrlHref);

// Cross-browser clipboard copy. See: https://stackoverflow.com/a/42416105
function updateClipboard(value) {
    var tempInput = document.createElement("input");
    tempInput.style = "position: absolute; left: -1000px; top: -1000px";
    tempInput.value = value;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
}

// Copies a path provided to the clipboard, with the origin prepended.
$("[copy-path-to-clipboard-on-click]").on("click", (e) => {
    e.preventDefault();
    const attribute = e.target.attributes.getNamedItem("copy-path-to-clipboard-on-click");
    if (attribute) {
      updateClipboard(window.location.origin + attribute.value);
    }
  })

// managing embedded notebooks
$(".embedded-notebook").each(function() {
  var $container = $(this);
  var $iframe = $(this).find("iframe");

  // Currently, notebooks over a certain size are not embedded.
  // These should not be augmented with Javascript.
  if ($container.hasClass('too-large')) {
    return;
  }

  var $expandCTA = $(`<button class="expand-cta">${local_string('LOADING_NOTEBOOK')}</button>`)
  var EXPAND_TEXT = `${local_string('EXPAND_NOTEBOOK')} ▼`
  var COLLAPSE_TEXT = `${local_string('COLLAPSE_NOTEBOOK')} ▲`
  $expandCTA.on('click', () => {
    if ($container.hasClass('expanded')) {
      $container.removeClass('expanded')
      $expandCTA.text(EXPAND_TEXT)
      // Move scroll to the top of the container on collapse;
      // adjust up 200px to account for the fixed header.
      $('body, html').scrollTop($container.offset().top - 200);
    } else {
      $container.addClass('expanded')
      $expandCTA.text(COLLAPSE_TEXT)
    }
  });

  $container.append($expandCTA)

  $iframe.on("load", function() {
    var iframe = this;

    // Remove loading state
    $container.addClass("loaded");
    $expandCTA.text(EXPAND_TEXT)

    // The iframe's contents can change as assets are loading in. Give it a check periodically,
    // and update the container height if there's any difference.
    function updateIframeHeight() {
      var loadableFrame = iframe.contentWindow.document.getElementsByClassName("overallContainer")[0];

      if (loadableFrame) {
        iframe.height = "600px";
      }
    }

    setTimeout(updateIframeHeight, 0);
    setInterval(updateIframeHeight, 5000);
  });

  // Load it
  $(this).waypoint({
    offset: "100%",
    handler: function() {
      this.destroy(); // turn off the Waypoint
      $iframe.attr("src", $iframe.data("src"));
    }
  });
});

const STATIC_FOLDER = $('script[src*=custom\\.js]').attr('src').replace('/js/custom.js', '');

// clipboard stuff
$('.highlight').each(function() {
    var btn = '<button class="clippy" aria-label="Copy sample to clipboard">' +
        `<img src="${STATIC_FOLDER}/clippy.svg" alt="Copy to clipboard">${local_string('COPY')}</button>`;
    $(this).prepend(btn);
});

var clippy = new Clipboard('.clippy', {
    target: function(trigger) {
        return trigger.nextSibling;
    }
});

clippy.on("success", function(e) {
    var $clippy = $(e.trigger);
    $clippy.addClass("copied").find("span").text("Copied!");
    e.clearSelection();
    setTimeout(function(){
        $clippy.removeClass("copied").find("span").text(local_string('COPY'));
    }, 1000);
});

function maybeScrollToAnchor() {
    scrollTo($(location.hash));
    return true;
}

function scrollTo($scrollingAnchor) {
    if ($scrollingAnchor.length) {
        var elScrollTop = $scrollingAnchor.hasClass('section')
            ? $scrollingAnchor.find(':header').position().top
            : $scrollingAnchor.position().top;

        $('html, body').animate({
            scrollTop: elScrollTop
        }, 10);
    }
}

$(document).ready(function () {

    // set up the right nav, but ONLY if it's NOT a redoc page
    if (detectIsRedocPage()) {
      return;
    }

    function makeNavItem(heading) {
        var $a = $(heading).find('a');
        var $link = $('<a></a>').attr('href', $a.last().attr('href')).text(heading.textContent.trim());
        return $('<li class="affix-container__item"></li>')
            .append($link);
    }



    //build nav menu
    var $headings = $('.js-page-container h2');

    if ($headings.length > 1) {
        //desktop nav
        var $nav = $('<nav class="affix-container affix-container--desktop js-affix"><div class="affix-container--ltr">' +
            `<h3 class="affix-container__desktop-title">${local_string('IN_THIS_ARTICLE')}</h3><ul></ul></div></nav>`);
        var $ul = $nav.find('ul');

        $headings.each(function () {
            var $li = makeNavItem(this);
            $ul.append($li);
            this.navLink = $li;//keep the appropriate na item
        });

        $('.js-page-container').append($nav);

        //mobile nav
        var $section = $('h1').nextAll('.section').first();
        if ($section.length) {
            var $nav_m = $(`<div class="affix-container--mobile"><strong class="affix-container__title">${local_string('IN_THIS_ARTICLE')}</strong><ul></ul></div>`);
            var $ul_m = $nav_m.find('ul');
            $headings.each(function () {
                var $li = makeNavItem(this);
                $ul_m.append($li);
            });
            $nav_m.insertBefore($section);
        }
    }

    //nav menu selection
    if ($headings.length > 1) {
        function findDisplayedH2Item() {
            var headerHeight = 220;
            for (var i = $headings.length - 1; i >= 0; i--) {
                if ($headings[i].getBoundingClientRect().top <= headerHeight) {
                    return $headings[i];
                }
            }
            return $headings[0];
        }

        var animationFrame = 0;
        function scheduleUpdate() {
            cancelAnimationFrame(animationFrame);
            animationFrame = requestAnimationFrame(updateH2Selection);
        }

        function updateH2Selection() {
            const selectedHeading = findDisplayedH2Item();
            selectH2ItemInSideOutline(selectedHeading);
        }

        function selectH2ItemInSideOutline(heading) {
            if (heading === null) {
                return;
            }

            const current = $('.js-affix .selected');
            if (current[0] !== heading.navLink[0]) {
                current.removeClass('selected');
                heading.navLink.addClass('selected');
            }
        }

        window.addEventListener('scroll', () => {
			scheduleUpdate();
		}, { passive: true });

		// listen for manual content updates
		window.addEventListener('content-update', () => {
			scheduleUpdate();
		});

		scheduleUpdate();
    }

    const BASE_ICON_URL = `${STATIC_FOLDER}/icons`
    const CLOUD_KEY_TO_ICON_URL = {
        ["aws"]: `${BASE_ICON_URL}/aws.svg`,
        ["azure"]: `${BASE_ICON_URL}/azure.svg`,
        ["gcp"]: `${BASE_ICON_URL}/gcp.svg`,
    }

    function formatSelectionOrOption (state) {
        const iconUrl = CLOUD_KEY_TO_ICON_URL[state.id];
        const $state = $(
            `<span><img class="cloud-provider__icon" src="${iconUrl}" aria-hidden="true"/> <span class="cloud-provider__selected-text">${state.text}</span></span>`           
        );

        return $state;
    };

    // cloud provider selector
    $("#cloud-provider-selector").select2({
        templateSelection: formatSelectionOrOption,
        templateResult: formatSelectionOrOption,
        minimumResultsForSearch: Infinity // Removes the default search field added to the select
    });

    $("#select2-cloud-provider-selector-container").attr("aria-label", "View docs for selected cloud provider")

    const initial_cloud = $("#cloud-provider-selector").val();

    $("#cloud-provider-selector").on('change', function(){
        if (this.value != initial_cloud) {
            const selectedOption = $(this).find(":selected").text();
            $(this).next(".holder").text(selectedOption);

            const selectedCloudKey = this.value;
            // Let's reset the select box to the initial value, as the page will not be refreshed on the back button
            // We need to trigger "change" event, as it is needed for the option customization code.
            $(this).val(initial_cloud).trigger("change");

            const pathName = window.location.pathname
            const languageSegments = ['ja', 'en', 'pt'];
            const segments = pathName.split('/'); // Split the pathname into segments
            const filteredSegments = segments.filter(segment => !languageSegments.includes(segment)); // Remove language segments
            const updatedPathname = filteredSegments.join('/'); // Join the filtered segments back into a pathname

            switch (selectedCloudKey) {
                case "aws":
                    window.location.href = 'https://docs.databricks.com' + pathName;
                    break;
                case "gcp":
                    window.location.href = 'https://docs.gcp.databricks.com' + updatedPathname;
                    break;
                case "azure":
                    // msft urls don't include the extension
                    window.location.href = 'https://learn.microsoft.com/azure/databricks' + updatedPathname.replace(/.[^.]*$|$/, '');
                    break;
                default:
                    console.warn(`Unexpected cloud selected: ${selectedCloudKey}`)
            }
        }
    });

    const GLOBE_ICON_URL = `${BASE_ICON_URL}/globe.png`;

    function formatLngSelectionOrOption(state) {
        const selectedOption = $("#lng-selector").val(); // Get the currently selected option

        // Check if the current state matches the selected option
        if (state.id === selectedOption) {
            const iconUrl = GLOBE_ICON_URL;
            const $state = $(
            `<span><img class="lng__icon" src="${iconUrl}" aria-hidden="true"/> <span class="lng__selected-text">${state.text}</span></span>`
            );
            return $state;
        } else {
            const $state = $(`<span>${state.text}</span>`);
            return $state;
        }
    }

    function setLanguageCookie() {
        var cookieValue = $("html").attr("lang")
        var expires = "expires=Fri, 31 Dec 9999 23:59:59 GMT"; // 'Infinite' expiration date
        var cookie = "lang=" + cookieValue + "; " + expires + "; path=/; domain=.docs.databricks.com";
        document.cookie = cookie;
    }

    var $lng_selector = $('#lng-selector');

    //Find the correct initial language.
    var found  = false
    $lng_selector.children().each(function(idx, option){
        var value = option.getAttribute('value');

        //Remove the prefix that navigates to the site root.
        for (var url = value; url.startsWith('../'); url = url.substr(3));

        //See if the current location ends with that option value. It will start with the language code.
        var loc = window.location.protocol + '//' + window.location.host + window.location.pathname;
        if (!loc.endsWith('.html')) {
            //In this case, the current page is index.html.
            if (!loc.endsWith('/')) {
                loc += '/'
            }
            loc += 'index.html'
        }
        if(loc.endsWith(url)) {
            $lng_selector[0].value = value
            //Notice that we find the initial value and break early by returning false.
            found = true;
            return false;
        }
    })

    //If we don't have the correct initial language, let's remove the selector. It may happen if the site is not localized.
    if (!found) {
        $lng_selector.remove()
    } else {
        $("#lng-selector").select2({
            templateSelection: formatLngSelectionOrOption,
            templateResult: formatLngSelectionOrOption,
            minimumResultsForSearch: Infinity
        });
        $("#select2-lng-selector-container").attr("aria-label", "View docs for selected language");

        const initial_lng = $("#lng-selector").val();
        $("#lng-selector").on('change', function(){
            if (this.value != initial_lng) {
                setLanguageCookie();
                const new_value = this.value;
                // Let's reset the select box to the initial value, as the page will not be refreshed on the back button
                // We need to trigger "change" event, as it is needed for the option customization code.
                $(this).val(initial_lng).trigger("change");
                window.location = new_value;
            }
        });
        setLanguageCookie();
    }
});

$(document).ready(function () {
    var languageNames = {
        'text': '',
        'default':'',
        'sql': 'SQL',
        'dotnet': '.NET',
        'xml': 'XML',
        'json': 'JSON',
        'http': 'HTTP',
        'md': 'Markdown',
        'yaml':'YAML',
        'ini':'ini'
    };
    function formatLanguageName(lang) {
        return languageNames.hasOwnProperty(lang) ? languageNames[lang] : lang.replace(/^\w/, s => s.toUpperCase());
    }
    var reLanguageParam = /language-\w+/;
    function getSelectedLanguage() {
        var params = window.location.hash.substr(1).split('&');
        for (var i = 0; i < params.length; i++) {
            var m = params[i].match(reLanguageParam);
            if (m) {
                return m[0];
            }
        }
        return null;
    }
    function setSelectedLanguage(selected) {
        var params = window.location.hash.substr(1).split('&').filter(function(v){return !!v.length});
        var replaced = false;
        for (var i = 0; i < params.length; i++) {
            var m = params[i].match(reLanguageParam);
            if (m) {
                replaced = true;
                params[i] = selected;
            }
        }
        if (!replaced) {
            params.push(selected);
        }
        var hash = '#' + params.join('&');
        window.history.replaceState(window.history.state, '' , hash);
    }
    function getLanguageId(language) {
        return 'language-' + language;
    }
    function buildHeader(elem, index) {
        var lang = elem.hasAttribute('lang')
            ? elem.getAttribute('lang')
            : elem.classList[1].substr(10);
        var title = formatLanguageName(lang);
        var langId = getLanguageId(lang);
        var targetId = index + '-' + langId;
        var ownId = index + '-anchor-' + langId;
        var header = $('<li class="clt-tabs-item" role="tab" data-lang="' + langId + '" data-tab-id="' + targetId + '" data-id="' + ownId + '">' +
            '<a class="clt-tabs-item__href" aria-controls="' + targetId + '" href="#' + targetId + '" id="' + ownId + '">' + title + '</a></li>');
        header.find('.clt-tabs-item__href').click(onTabClick);
        return header;
    }
    function onTabClick(e) {
        var selected = $(this).parent().attr('data-lang');
        updateTabsSelection(selected);
        setSelectedLanguage(selected);
        e.preventDefault();
        e.stopImmediatePropagation();
    }
    function onKeyDown(e) {
        var update = false;
        var selected = this.querySelector('.clt-tabs-item--selected');
        var index = Array.prototype.indexOf.call(this.childNodes, selected);
        switch (e.keyCode) {
            case 37: // left/up
            case 38: {
                if (index === 0) {
                    index = this.childNodes.length - 1;
                } else {
                    index--;
                }
                update = true;
                break;
            }
            case 39: { // right
                if (index >= this.childNodes.length - 1) {
                    index = 0;
                } else {
                    index++;
                }
                update = true;
                break;
            }
            case 36: { // home
                index = 0;
                update = true;
                break;
            }
            case 35: { // home
                index = this.childElementCount - 1;
                update = true;
                break;
            }
        }
        if (update) {
            var lang = this.childNodes[index].getAttribute('data-lang');
            updateTabsSelection(lang);
            setSelectedLanguage(lang);
            $(this.childNodes[index]).find('.clt-tabs-item__href').focus();
            e.preventDefault();
            e.stopImmediatePropagation();
        }
    }
    function buildTabs(tab, index) {
        var literal = Array.prototype.indexOf.call(tab.classList, 'js-code-language-tabs--literal') > 0
            ? ' clt-tabs--literal'
            : '';
        var $tabs = $('<div class="clt-tabs' + literal +'"><ul class="clt-tabs__items" role="tablist" aria-label="Code block">' +
            '</ul><div class="clt-tabs__content"></div></div>');
        var $headers = $tabs.find('.clt-tabs__items');
        var $content = $tabs.find('.clt-tabs__content');

        while (tab.children.length) {
            var child = tab.children[0];
            var $li = buildHeader(child, index);
            child.classList.add('clt-tabs-content');
            child.setAttribute('id', $li.attr('data-tab-id'));
            child.setAttribute('data-lang', $li.attr('data-lang'));
            child.setAttribute('aria-controlled-by', $li.attr('data-id'));
            child.setAttribute('role', 'tabpanel');
            $headers.append($li);
            $content.append(child);
        }

        $headers.keydown(onKeyDown);
        tab.parentElement.replaceChild($tabs[0], tab);
    }
    function markSelected($header, $content) {
        $header.addClass('clt-tabs-item--selected')
                        .find('.clt-tabs-item__href')
                        .attr({'aria-selected': true, 'tabindex': 0});
        $content.addClass('clt-tabs-content--selected');
        $content.attr({'aria-hidden': false});
    }
    function markUnselected($headers, $contents) {
        $headers.removeClass('clt-tabs-item--selected')
                .find('.clt-tabs-item__href')
                .attr({'aria-selected': false, 'tabindex': -1});
        $contents.removeClass('clt-tabs-content--selected');
        $contents.attr({'aria-hidden': true});
    }
    function updateTabSelection(tab, selected){
        var $headers = $(tab).find('.clt-tabs-item');
        var $contents = $(tab).find('.clt-tabs-content');
        markUnselected($headers, $contents);
        if (selected) {
            var $header = $headers.filter('[data-lang="' + selected + '"]');
            var $content = $contents.filter('[data-lang="' + selected + '"]');
            if ($header.length) {
                markSelected($header, $content);
            } else {
                markSelected($headers.first(), $contents.first());
            }
        } else {
            markSelected($headers.first(), $contents.first());
        }
    }
    function updateTabsSelection(selected) {
        selected = selected || getSelectedLanguage();
        $('.clt-tabs').each(function () {
            updateTabSelection(this, selected);
        });
    }
    function getCodeBlockLangFromClass(codeBlock) {
        var reLang = /highlight-([^\s]+)/
        var m = codeBlock.className.match(reLang);
        if (m) {
            return formatLanguageName(m[1]);
        } else {
            return '';
        }
    }
    function enhanceCodeBlocks() {
        $('.highlight').filter(function() {
            return !$(this).closest('.js-code-language-tabs--literal').length;
        }).each(function() {
            var lang = $(this).closest('.js-code-language-tabs').length ? '' : getCodeBlockLangFromClass(this.parentElement);
            $(this).prepend('<div class="highlight-header"><span class="highlight-header__lang">' + lang + '</span></div>');
        });
    }
    enhanceCodeBlocks();
    $('.js-code-language-tabs').each(function (index) {
        buildTabs(this, index);
    });
    updateTabsSelection();
});

$(document).ready(function () {
    var keyboard = true;
    var clsNoOutline = 'no-outline';
    window.addEventListener('keydown', function(e) {
        if (e.code === 'Tab' && !e.ctrlKey && !e.altKey) {
            if (!keyboard) {
                keyboard = true;
                document.body.classList.remove(clsNoOutline);
            }
        }
    });
    window.addEventListener('mousedown', function(e) {
        if (keyboard) {
            keyboard = false;
            document.body.classList.add(clsNoOutline);
        }
    });
});

$(document).ready(function () {
    $('.js-tutorial-steps a').attr('target', '_blank');
});


$(document).ready(function () {
    $('a.external').attr('target', '_blank');
});

$(document).ready(function() {
    $('body').css('visibility','visible');
});