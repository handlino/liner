(function() {
    var _id = 0;
    var genId = function(prefix) {
        _id++;
        return (prefix||"liner-") + _id;
    }

    var Liner = window.Liner = function(params) {
        this.init(params);
        return this;
    };

    function drawArrow(ctx, size, fillStyle) {
        ctx.fillStyle = fillStyle;
        ctx.beginPath();
        ctx.moveTo(0, -1 * size);
        ctx.lineTo(size * 10/25, size/5);
        ctx.lineTo(0, 0);
        ctx.lineTo(-1 * size * 10/25, size/5);
        ctx.closePath();
        ctx.fill();
    }


    var LINES = [];
    Liner.fn = Liner.prototype = {
        "init": function(params) {
            if (!params.from || ! params.to) throw("Not enough parameters");

            this.line_from = Liner.get(params.from)[0];
            this.line_to   = Liner.get(params.to)[0];
            this.line_label = params.label;

            if (!this.line_from || !this.line_to) throw("Failed to find end-point elements.");

            this.container_id = genId();

            // XXX: might not be good to just change their z-index.
            // Liner.css(this.line_from, { "z-index": 10 });
            // Liner.css(this.line_to, { "z-index": 10 });

            this.terminal_distance = params.terminalDistance || 8;
            this.line_width = params.lineWidth || 8;
            this.terminal_outside = (params.terminalPosition == "outside");

            this.arrow = params.arrow || false;
            this.arrowSize = params.arrowSize || 10;
            this.arrowColor = params.arrowColor || "#f00";

            LINES.push(this);

            this.redraw();
            return this;
        },

        "_canvas_box_dimension": function() {
            if (!this.line_from || !this.line_to) return;

            var d = {};

            var a = Liner.offset(this.line_from);
            a.width  = Liner.width(this.line_from);
            a.height = Liner.height(this.line_from);
            a.top += a.height/2;
            a.left += a.width/2;

            var b = Liner.offset(this.line_to);
            b.width = Liner.width(this.line_to);
            b.height = Liner.height(this.line_to);
            b.top += b.height/2;
            b.left += b.width/2;

            var w = b.left - a.left;
            var h = b.top - a.top;

            d.box_top    = d.top    = a.top;
            d.box_left   = d.left   = a.left;
            d.box_width  = d.width  = w;
            d.box_height = d.height = h;

            var x = {};

            if (this.terminal_outside) {
                w = Math.abs(w);
                h = Math.abs(h);

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

            } else {
                x.top = Math.min(a.top, b.top);
                x.left = Math.min(a.left, b.left);
                x.width = Math.abs(b.left - a.left);
                x.height = Math.abs(b.top - a.top);
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

            var label_el;
            var container_el = document.getElementById(id);
            if(container_el && container_el.nodeName) {
                label_el = container_el.nextSibling;
                if (label_el && label_el.className == "label") {
                    Liner.remove(label_el);
                }
                Liner.remove(container_el);
            }

            var d = this._canvas_box_dimension();

            container_el = Liner.createElement("div", {
                "id": id,
                "class": "liner"
            });
            Liner.css(container_el, {
                "position": "absolute",
                "top": d.box_top,
                "left": d.box_left
            });
            document.body.appendChild(container_el);

            var canvas_el = Liner.createElement("canvas", {
                "id": this.canvas_id,
                "class": "liner",
                "width": d.box_width,
                "height": d.box_height
            });
            container_el.appendChild( canvas_el );

            if ( !canvas_el.getContext && G_vmlCanvasManager ) {
                canvas_el = G_vmlCanvasManager.initElement(canvas_el);
            }

            var ctx = canvas_el.getContext("2d")

            ctx.strokeStyle = "#50a0eb";
            ctx.lineWidth = this.line_width;
            ctx.lineCap = "round";

            var p1 = {
                x: (d.width > 0) ? this.terminal_distance : (d.box_width - this.terminal_distance ),
                y: (d.height > 0) ? this.terminal_distance : (d.box_height - this.terminal_distance )
            };

            var p2 = {
                x: (d.width > 0) ? (d.width - this.terminal_distance) : this.terminal_distance,
                y: (d.height > 0) ? (d.height - this.terminal_distance) : this.terminal_distance
            };

            if (d.box_width == 16) p1.x = p2.x = 8;
            if (d.box_height == 16) p1.y = p2.y = 8;

            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();

            if (this.arrow) {

                var m = {
                    "x": (p1.x+p2.x)/2,
                    "y": (p1.y+p2.y)/2
                };
                var dx = p2.x-p1.x;
                var dy = p2.y-p1.y;
                var r;

                if(d.width > 0) {
                    r = Math.acos( -1*dy / Math.sqrt( dx*dx + dy*dy ) );
                }
                else {
                    r = Math.PI + Math.acos( dy / Math.sqrt( dx*dx + dy*dy ) );
                }

                ctx.translate(m.x,m.y);
                ctx.rotate(r);
                drawArrow(ctx, this.arrowSize, this.arrowColor);
                ctx.translate(-1*m.x,-1*m.y);
                ctx.rotate(-1*r);
            }

            if (this.line_label) {
                label_el = Liner.createElement("div", {"class": "label"});
                label_el.appendChild(
                    document.createTextNode(this.line_label)
                );

                container_el.parentNode.insertBefore(
                    label_el,
                    container_el.nextSibling
                );
                
                Liner.css(label_el, {
                    "position": "absolute",
                    "top": d.box_top + d.box_height/2,
                    "left": d.box_left + d.box_width/2
                });

                container_el.insertBefore( label_el, container_el.childNodes[0] );
            }

            return this;
        }
    };

    Liner.redraw = function() {
        for(var i = 0, l = LINES.length; i < l; i++) {
            LINES[i].redraw();
        }
    };

})();


