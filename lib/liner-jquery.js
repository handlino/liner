(function($) {
    Liner.get = function(selector) {
        return $.makeArray($(selector));
    }

    Liner.css = function(el, css) {
        return $(el).css(css)
    }

    Liner.width = function(el) {
        return $(el).width();
    }

    Liner.height = function(el) {
        return $(el).height();
    }

    Liner.offset = function(el) {
        return $(el).offset();
    }

    Liner.remove = function(el) {
        return $(el).remove();
    }

    Liner.createElement = function(name, attributes) {
        return $("<" + name + "></" + name + ">").attr(attributes).get(0);
    }

})(jQuery);
