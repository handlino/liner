(function() {
    Liner.get = function(selector) {
        if (selector.nodeType) {
            return [selector];
        }

        var matched;
        if (matched = selector.match(/^#(\S+)$/) ) {
            return [ document.getElementById( matched[1] ) ];
        }

        return YAHOO.util.Selector.query(selector);
    };

    Liner.css = function(el, css) {
        // Get
        if (typeof(css) == "string") {
            return YAHOO.util.Dom.getStyle(el, css);
        }
        // Set
        for(var prop in css) {
            var val = css[prop];
            if (prop == "top" || prop == "left") {
                if ( String(val).indexOf("px") == -1 )
                    val += "px";
            }

            YAHOO.util.Dom.setStyle(el, prop, val);
        }
    }

    Liner.width = function(el) {
        var r = Liner.css(el, "width");
        r = r.replace(/px/, "");
        return Number(r);
    }

    Liner.height = function(el) {
        var r = Liner.css(el, "height");
        r = r.replace(/px/, "");
        return Number(r);
    }

    Liner.offset = function(el) {
        var r = {
            "top": YAHOO.util.Dom.getY(el),
            "left": YAHOO.util.Dom.getX(el)
        };
        return r;
    }

    Liner.remove = function(el) {
        var el = Liner.get(el)[0];
        if (el && el.parentNode)
            el.parentNode.removeChild(el);
    }

    Liner.createElement = function(name, attributes) {
        var el = document.createElement(name);
        for(var a in attributes) {
            el.setAttribute(a, attributes[a])
        }
        return el;
    }

})();
