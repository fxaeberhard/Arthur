/**
 * 
 * @author Francois-Xavier Aeberhard <fx@red-agent.com>
 */
YUI.add("art", function(Y) {
    var Art = Y.namespace("Art");

    Art.Piano = Y.Base.create("piano", Y.Widget, [], {
        NOTES: [{name: "do", key: "86"},
            {name: "re", key: "66"},
            {name: "mi", key: "78"},
            {name: "fa", key: "77"},
            {name: "sol", key: "188"},
            {name: "la", key: "190"},
            {name: "si", key: "189"},
            {name: "dod", key: "71"},
            {name: "red", key: "72"},
            {name: "fad", key: "75"},
            {name: "sold", key: "76"},
            {name: "lad", key: "222"}],
        bindUI: function() {
            var doc = Y.one("doc"),
                bb = this.get("boundingBox"),
                cb = this.get("contentBox");

            bb.setStyle("display", "none");
            this.sounds = {};

            Y.Array.each(this.NOTES, function(i) {
                cb.append("<div class='note " + i.name + "' style='display:none'></div>");

                doc.on("key", function() {
                    console.log("Piano key down: " + i.name);

                    bb.show(true);
                    bb.one("." + i.name).show();

                    this.handler && this.handler.cancel();
                    this.handler = Y.later(2000, this, function() {
                        bb.hide(true);
                    });
                    if (!this.sounds[i.name]) {
                        this.sounds[i.name] = new Audio("sound/piano/" + i.name + ".mp3");
                        this.sounds[i.name].play();
                    }
                }, "down:" + i.key, this);

                doc.on("key", function() {
                    console.log("Piano key up: " + i.name);
                    bb.one("." + i.name).hide();

                    if (this.sounds[i.name].currentTime < 0.2) {
                        var toStop = this.sounds[i.name];
                        Y.later(200 - this.sounds[i.name].currentTime * 100, this, function() {
                            toStop.pause();
                        });
                        this.sounds[i.name] = null;
                    } else {
                        this.sounds[i.name].pause();
                        this.sounds[i.name] = null;
                    }
                }, "up:" + i.key, this);
            }, this);
        }
    });

    /* */
    Art.drawer = function(p) {
        var mousePos, ps;

        function Particle(l) {
            this.location = l.get();
            this.lifespan = 255.0;
        }
        Particle.prototype = {
            run: function() {
                this.update();
                this.display();
            },
            update: function() {
                this.lifespan -= 1.0;
            },
            display: function() {
                p.stroke(253, 255, 165, this.lifespan);
                p.fill(253, 255, 165, this.lifespan);
                p.ellipse(this.location.x, this.location.y, 8, 8);
            },
            isDead: function() {
                return this.lifespan < 0.0;
            }
        };
        var ParticleSystem = function() {
            this.particles = new p.ArrayList();
            this.lastMousePos;
        };
        ParticleSystem.prototype = {
            addParticle: function() {
                if (!mousePos)
                    return;

                if (this.lastPos) {
                    var pos, diff = mousePos.get(),
                        dist = this.lastPos.dist(mousePos);

                    diff.sub(this.lastPos);

                    for (var i = 0; i < dist; i += 5) {
                        pos = diff.get();
                        pos.mult(i / dist);
                        pos.add(this.lastPos);
                        this.particles.add(new Particle(pos));
                    }
                }
                this.lastPos = mousePos;
                this.particles.add(new Particle(mousePos));
            },
            run: function() {
                for (var i = this.particles.size() - 1; i >= 0; i--) {
                    var p = this.particles.get(i);
                    p.run();
                    if (p.isDead()) {
                        this.particles.remove(i);
                    }
                }
            }
        };

        var syncSize = function() {
            p.size(Y.DOM.winWidth(), Y.DOM.winHeight());
        };
        Y.on("windowresize", syncSize);

        p.setup = function() {
            syncSize();
            p.size(2000, 1000);
            //p.frameRate(60);
            ps = new ParticleSystem();
        };

        p.draw = function() {
            p.background(0);
            ps.addParticle();
            ps.run();
        };

//    p.mouseMoved = function() {
//        mousePos =  new p.PVector(p.mouseX, p.mouseY);
//    };
        document.onmousemove = function(e) {
            mousePos = new p.PVector(e.clientX, e.clientY);
            return true;
        };
    }

    var particle = (function($p) {
        var Particle = (function() {
            function Particle() {
                var $this_1 = this;
                function $superCstr() {
                    $p.extendClassChain($this_1);
                }
                $this_1.location = null;
                $this_1.velocity = null;
                $this_1.acceleration = null;
                $this_1.lifespan = 0;
                function run$0() {
                    $this_1.$self.update();
                    $this_1.$self.display();
                }
                $p.addMethod($this_1, 'run', run$0, false);
                function update$0() {
                    $this_1.velocity.add($this_1.acceleration);
                    $this_1.location.add($this_1.velocity);
                    $this_1.lifespan -= 1.0;
                }
                $p.addMethod($this_1, 'update', update$0, false);
                function display$0() {
                    $p.stroke(255, $this_1.lifespan);
                    $p.fill(255, $this_1.lifespan);
                    $p.ellipse($this_1.location.x, $this_1.location.y, 8, 8);
                }
                $p.addMethod($this_1, 'display', display$0, false);
                function isDead$0() {
                    if ($this_1.lifespan < 0.0) {
                        return true;
                    } else {
                        return false;
                    }
                }
                $p.addMethod($this_1, 'isDead', isDead$0, false);
                function $constr_1(l) {
                    $superCstr();

                    $this_1.acceleration = new $p.PVector(0, 0.05);
                    $this_1.velocity = new $p.PVector($p.random(-1, 1), $p.random(-2, 0));
                    $this_1.location = l.get();
                    $this_1.lifespan = 255.0;
                }

                function $constr() {
                    if (arguments.length === 1) {
                        $constr_1.apply($this_1, arguments);
                    } else
                        $superCstr();
                }
                $constr.apply(null, arguments);
            }
            return Particle;
        })();
        $p.Particle = Particle;
        var ParticleSystem = (function() {
            function ParticleSystem() {
                var $this_1 = this;
                function $superCstr() {
                    $p.extendClassChain($this_1)
                }
                $this_1.particles = null;
                $this_1.origin = null;
                function addParticle$0() {
                    $this_1.particles.add(new Particle($this_1.origin));
                }
                $p.addMethod($this_1, 'addParticle', addParticle$0, false);
                function run$0() {
                    for (var i = $this_1.particles.size() - 1; i >= 0; i--) {
                        var p = $this_1.particles.get(i);
                        p.run();
                        if (p.isDead()) {
                            $this_1.particles.remove(i);
                        }
                    }
                }
                $p.addMethod($this_1, 'run', run$0, false);
                function $constr_1(location) {
                    $superCstr();

                    $this_1.origin = location.get();
                    $this_1.particles = new $p.ArrayList();
                }

                function $constr() {
                    if (arguments.length === 1) {
                        $constr_1.apply($this_1, arguments);
                    } else
                        $superCstr();
                }
                $constr.apply(null, arguments);
            }
            return ParticleSystem;
        })();
        $p.ParticleSystem = ParticleSystem;

        var ps = null;

        function setup() {
            $p.size(640, 360);
            ps = new ParticleSystem(new $p.PVector($p.width / 2, 50));
        }
        $p.setup = setup;
        setup = setup.bind($p);

        function draw() {
            $p.background(0);
            ps.addParticle();
            ps.run();
        }
        $p.draw = draw;
        draw = draw.bind($p);
    });

    var tracker = (function($p) {
        var radius = 50.0;
        var X = 0, Y = 0;
        var nX = 0, nY = 0;
        var delay = 16;

        function setup() {
            $p.size(200, 200);
            $p.strokeWeight(10);
            $p.frameRate(15);
            X = $p.width / 2;
            Y = $p.width / 2;
            nX = X;
            nY = Y;
        }
        $p.setup = setup;
        setup = setup.bind($p);

        function draw() {
            radius = radius + $p.sin($p.frameCount / 4);

            X += (nX - X) / delay;
            Y += (nY - Y) / delay;

            $p.background(100);
            $p.fill(0, 121, 184);
            $p.stroke(255);
            $p.ellipse(X, Y, radius, radius);
        }
        $p.draw = draw;
        draw = draw.bind($p);

        function mouseMoved() {
            nX = $p.mouseX;
            nY = $p.mouseY;
        }
        $p.mouseMoved = mouseMoved;
        mouseMoved = mouseMoved.bind($p);

    });
    function clock(processing) {
        // Override draw function, by default it will be called 60 times per second
        processing.draw = function() {
            // determine center and max clock arm length
            var centerX = processing.width / 2, centerY = processing.height / 2;
            var maxArmLength = Math.min(centerX, centerY);

            function drawArm(position, lengthScale, weight) {
                processing.strokeWeight(weight);
                processing.line(centerX, centerY,
                    centerX + Math.sin(position * 2 * Math.PI) * lengthScale * maxArmLength,
                    centerY - Math.cos(position * 2 * Math.PI) * lengthScale * maxArmLength);
            }

            // erase background
            processing.background(224);

            var now = new Date();

            // Moving hours arm by small increments
            var hoursPosition = (now.getHours() % 12 + now.getMinutes() / 60) / 12;
            drawArm(hoursPosition, 0.5, 5);

            // Moving minutes arm by small increments
            var minutesPosition = (now.getMinutes() + now.getSeconds() / 60) / 60;
            drawArm(minutesPosition, 0.80, 3);

            // Moving hour arm by second increments
            var secondsPosition = now.getSeconds() / 60;
            drawArm(secondsPosition, 0.90, 1);
        };
    }
}, "0.1", {
    requires: ["widget", "base", "transition"]
});