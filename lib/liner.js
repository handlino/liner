(function($) {
    var Liner = window.Liner = function(params) {
        this.init(params);
        return this;
    }

    var _id = 0;
    var genId = function(prefix) {
        _id++;
        return (prefix||"liner-") + _id;
    }

    var LINES = [];

    Liner.fn = Liner.prototype = {
        "init": function(params) {
            if (!params.from || ! params.to) throw("Not enough parameters");

            this.line_from = $(params.from).get(0);
            this.line_to   = $(params.to).get(0);
            this.line_label = params.label;

            if (!this.line_from || !this.line_to) throw("Failed to find end-point elements.");

            this.container_id = genId();

            this.redraw();

            LINES.push(this);
            return this;
        },

        "_canvas_box_dimension": function() {
            if (!this.line_from || !this.line_to) return;

            var d = {};

            var a = $(this.line_from).offset();
            a.width = $(this.line_from).width();
            a.height = $(this.line_from).height();
            a.top += a.height/2;
            a.left += a.width/2;

            var b = $(this.line_to).offset();
            b.width = $(this.line_to).width();
            b.height = $(this.line_to).height();
            b.top += b.height/2;
            b.left += b.width/2;

            var w = b.left - a.left;
            var h = b.top - a.top;

            d.box_top    = d.top    = a.top;
            d.box_left   = d.left   = a.left;
            d.box_width  = d.width  = w;
            d.box_height = d.height = h;

            w = Math.abs(w);
            h = Math.abs(h);

            var x = {};

            if ( w >= h ) {
                x.top = Math.min(a.top, b.top);

                if (a.left < b.left)
                    x.left = a.left + a.width /2;
                else
                    x.left = b.left + b.width /2;

                x.width = w - (a.width + b.width) / 2;
                x.height = h;
            }
            else {
                x.left = Math.min(a.left, b.left);

                if (a.top <= b.top)
                    x.top = a.top + a.height/2;
                else
                    x.top = b.top + b.height/2;

                x.height = h - (a.height + b.height) / 2
                x.width = w;
            }

            d.box_top = x.top;
            d.box_left = x.left;
            d.box_width = x.width;
            d.box_height = x.height;

            d.width  = (d.width  > 0 ? 1 : -1) * d.box_width;
            d.height = (d.height > 0 ? 1 : -1) * d.box_height;

            if (d.box_width < 16) d.box_width = 16;
            if (d.box_height < 16) d.box_height = 16;


            return d;
        },

        "redraw": function() {
            if(!this.container_id) return;

            var id = this.container_id;

            this.canvas_id = genId("liner-canvas-");

            $("div#" + id).remove();

            var d = this._canvas_box_dimension();

            $("<div></div>")
            .attr("id", id)
            .addClass("liner")
            .appendTo("body");

            $("<canvas></canvas>")
            .attr("id", this.canvas_id)
            .addClass("liner")
            .attr({ "width": d.box_width, "height": d.box_height })
            .css({
                "position": "absolute",
                "top": d.box_top,
                "left": d.box_left
            })
            .appendTo("div#" + id);

            var c = document.getElementById( this.canvas_id );
            var ctx = c.getContext("2d")

            ctx.strokeStyle = "#ccccff";
            ctx.lineWidth = 8;
            ctx.lineCap = "round";

            ctx.beginPath();

            var p1 = {
                x: (d.width > 0) ? 8 : d.box_width - 8,
                y: (d.height > 0) ? 8 : d.box_height - 8
            };

            var p2 = {
                x: (d.width > 0) ? (d.width - 8) : 8,
                y: (d.height > 0) ? (d.height - 8) : 8
            };

            if (d.box_width == 16) p1.x = p2.x = 8;
            if (d.box_height == 16) p1.y = p2.y = 8;

            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();

            if (this.line_label) {
                // ...
            }

            return this;
        }
    };

    Liner.redraw = function() {
        $.each(
            LINES,
            function() {
                this.redraw();
            }
        );
    };

})(jQuery);

