(function($) {
    Liner.get = function(selector) {
        return $.makeArray($(selector));
    }

    Liner.css = function(el, css) {
        // Get
        if (typeof(css) == "string") {
            return YAHOO.util.Dom.getStyle(el, css);
        }
        // Set
        for(var prop in css) {
            var val = css[prop];
            YAHOO.util.Dom.setStyle(el, prop, css[prop]);
        }
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
