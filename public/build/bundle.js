
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.43.1' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/components/Header.svelte generated by Svelte v3.43.1 */

    const file$4 = "src/components/Header.svelte";

    function create_fragment$4(ctx) {
    	let div;
    	let h1;
    	let t1;
    	let h60;
    	let t3;
    	let h61;
    	let a0;
    	let t5;
    	let a1;
    	let t7;
    	let a2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "sampath balivada";
    			t1 = space();
    			h60 = element("h6");
    			h60.textContent = "Cloud Support Associate at Amazon Web Services";
    			t3 = space();
    			h61 = element("h6");
    			a0 = element("a");
    			a0.textContent = "twitter";
    			t5 = text("    \n        ");
    			a1 = element("a");
    			a1.textContent = "linkedin";
    			t7 = text("    \n        ");
    			a2 = element("a");
    			a2.textContent = "github";
    			attr_dev(h1, "class", "svelte-ocjpw0");
    			add_location(h1, file$4, 1, 4, 25);
    			attr_dev(h60, "class", "svelte-ocjpw0");
    			add_location(h60, file$4, 2, 4, 55);
    			attr_dev(a0, "href", "https://twitter.com/sampathbalivada");
    			attr_dev(a0, "target", "_blank");
    			add_location(a0, file$4, 4, 8, 128);
    			attr_dev(a1, "href", "https://linkedin.com/in/sampathbalivada");
    			attr_dev(a1, "target", "_blank");
    			add_location(a1, file$4, 5, 8, 224);
    			attr_dev(a2, "href", "https://github.com/sampathbalivada");
    			attr_dev(a2, "target", "_blank");
    			add_location(a2, file$4, 6, 8, 325);
    			attr_dev(h61, "class", "svelte-ocjpw0");
    			add_location(h61, file$4, 3, 4, 115);
    			attr_dev(div, "class", "header svelte-ocjpw0");
    			add_location(div, file$4, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(div, t1);
    			append_dev(div, h60);
    			append_dev(div, t3);
    			append_dev(div, h61);
    			append_dev(h61, a0);
    			append_dev(h61, t5);
    			append_dev(h61, a1);
    			append_dev(h61, t7);
    			append_dev(h61, a2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/components/Footer.svelte generated by Svelte v3.43.1 */

    const file$3 = "src/components/Footer.svelte";

    function create_fragment$3(ctx) {
    	let footer;
    	let h6;
    	let t0;
    	let br0;
    	let t1;
    	let strong;
    	let t3;
    	let br1;
    	let t4;

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			h6 = element("h6");
    			t0 = text("languages, tools, frameworks and technologies I worked with: ");
    			br0 = element("br");
    			t1 = space();
    			strong = element("strong");
    			strong.textContent = "python, c, c++, java, golang, amazon redshift, dart, flutter, svelte, react, nodejs, lambda, ec2";
    			t3 = space();
    			br1 = element("br");
    			t4 = text("\n        and more, in no specific order.");
    			add_location(br0, file$3, 2, 69, 102);
    			add_location(strong, file$3, 3, 8, 116);
    			add_location(br1, file$3, 3, 124, 232);
    			attr_dev(h6, "class", "svelte-1klfmfe");
    			add_location(h6, file$3, 1, 4, 28);
    			attr_dev(footer, "class", "footer");
    			add_location(footer, file$3, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, h6);
    			append_dev(h6, t0);
    			append_dev(h6, br0);
    			append_dev(h6, t1);
    			append_dev(h6, strong);
    			append_dev(h6, t3);
    			append_dev(h6, br1);
    			append_dev(h6, t4);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/components/Ikigai.svelte generated by Svelte v3.43.1 */

    const file$2 = "src/components/Ikigai.svelte";

    function create_fragment$2(ctx) {
    	let div;
    	let p;
    	let t0;
    	let br0;
    	let t1;
    	let br1;
    	let t2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			t0 = text("building");
    			br0 = element("br");
    			t1 = text("experiences");
    			br1 = element("br");
    			t2 = text("is my ikigai");
    			add_location(br0, file$2, 1, 15, 21);
    			add_location(br1, file$2, 1, 31, 37);
    			attr_dev(p, "class", "svelte-egeznk");
    			add_location(p, file$2, 1, 4, 10);
    			attr_dev(div, "class", "svelte-egeznk");
    			add_location(div, file$2, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    			append_dev(p, t0);
    			append_dev(p, br0);
    			append_dev(p, t1);
    			append_dev(p, br1);
    			append_dev(p, t2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Ikigai', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Ikigai> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Ikigai extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Ikigai",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/components/Blog.svelte generated by Svelte v3.43.1 */

    const file$1 = "src/components/Blog.svelte";

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	child_ctx[6] = i;
    	return child_ctx;
    }

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (39:4) {:else}
    function create_else_block(ctx) {
    	let each_1_anchor;
    	let each_value_1 = /*posts*/ ctx[0].slice(0, 3);
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*posts*/ 1) {
    				each_value_1 = /*posts*/ ctx[0].slice(0, 3);
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(39:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (33:4) {#if posts.length == 0}
    function create_if_block(ctx) {
    	let each_1_anchor;
    	let each_value = [1, 2, 3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < 3; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < 3; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < 3; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(33:4) {#if posts.length == 0}",
    		ctx
    	});

    	return block;
    }

    // (40:8) {#each posts.slice(0, 3) as post, i}
    function create_each_block_1(ctx) {
    	let p;
    	let a;
    	let t0;
    	let t1_value = /*post*/ ctx[2].title.toLowerCase() + "";
    	let t1;
    	let a_href_value;
    	let t2;

    	const block = {
    		c: function create() {
    			p = element("p");
    			a = element("a");
    			t0 = text("> ");
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(a, "href", a_href_value = "https://sampath.dev/" + /*post*/ ctx[2].slug);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "class", "blog-post " + (/*i*/ ctx[6] == 0 ? 'first' : '') + " svelte-zwdstr");
    			add_location(a, file$1, 41, 16, 1071);
    			attr_dev(p, "class", "svelte-zwdstr");
    			add_location(p, file$1, 40, 12, 1051);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, a);
    			append_dev(a, t0);
    			append_dev(a, t1);
    			append_dev(p, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*posts*/ 1 && t1_value !== (t1_value = /*post*/ ctx[2].title.toLowerCase() + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*posts*/ 1 && a_href_value !== (a_href_value = "https://sampath.dev/" + /*post*/ ctx[2].slug)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(40:8) {#each posts.slice(0, 3) as post, i}",
    		ctx
    	});

    	return block;
    }

    // (34:8) {#each [1, 2, 3] as post}
    function create_each_block(ctx) {
    	let p;
    	let a;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			a = element("a");
    			a.textContent = "loading...";
    			t1 = space();
    			attr_dev(a, "href", ".");
    			attr_dev(a, "target", ".");
    			attr_dev(a, "class", "blog-post svelte-zwdstr");
    			add_location(a, file$1, 35, 16, 893);
    			attr_dev(p, "class", "svelte-zwdstr");
    			add_location(p, file$1, 34, 12, 873);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, a);
    			append_dev(p, t1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(34:8) {#each [1, 2, 3] as post}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div;
    	let p;
    	let t1;
    	let t2;
    	let a;

    	function select_block_type(ctx, dirty) {
    		if (/*posts*/ ctx[0].length == 0) return create_if_block;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			p.textContent = "latest blog posts:";
    			t1 = space();
    			if_block.c();
    			t2 = space();
    			a = element("a");
    			a.textContent = "view all blog posts";
    			attr_dev(p, "class", "subtitle svelte-zwdstr");
    			add_location(p, file$1, 31, 4, 756);
    			attr_dev(a, "href", "https://blog.sampath.dev");
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "class", "blog-link svelte-zwdstr");
    			add_location(a, file$1, 51, 4, 1350);
    			attr_dev(div, "class", "svelte-zwdstr");
    			add_location(div, file$1, 30, 0, 746);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    			append_dev(div, t1);
    			if_block.m(div, null);
    			append_dev(div, t2);
    			append_dev(div, a);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div, t2);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Blog', slots, []);
    	let posts = [];

    	fetch("https://api.hashnode.com/", {
    		method: "POST",
    		headers: { "Content-Type": "application/json" },
    		body: JSON.stringify({
    			query: `{
                        user(username: "sampathbalivada") {
                            publication {
                                posts(page: 0) {
                                    title
                                    slug
                                }
                            }
                        }
                    }`
    		})
    	}).then(res => res.json()).then(res => {
    		$$invalidate(0, posts = res.data.user.publication.posts);
    	});

    	let x = 4;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Blog> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ posts, x });

    	$$self.$inject_state = $$props => {
    		if ('posts' in $$props) $$invalidate(0, posts = $$props.posts);
    		if ('x' in $$props) x = $$props.x;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [posts];
    }

    class Blog extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Blog",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.43.1 */
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let header;
    	let t0;
    	let span;
    	let div0;
    	let ikigai;
    	let t1;
    	let div1;
    	let blog;
    	let t2;
    	let footer;
    	let current;
    	header = new Header({ $$inline: true });
    	ikigai = new Ikigai({ $$inline: true });
    	blog = new Blog({ $$inline: true });
    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(header.$$.fragment);
    			t0 = space();
    			span = element("span");
    			div0 = element("div");
    			create_component(ikigai.$$.fragment);
    			t1 = space();
    			div1 = element("div");
    			create_component(blog.$$.fragment);
    			t2 = space();
    			create_component(footer.$$.fragment);
    			attr_dev(div0, "class", "svelte-1daebil");
    			add_location(div0, file, 10, 2, 245);
    			attr_dev(div1, "class", "svelte-1daebil");
    			add_location(div1, file, 13, 2, 276);
    			attr_dev(span, "class", "svelte-1daebil");
    			add_location(span, file, 9, 1, 236);
    			attr_dev(main, "class", "svelte-1daebil");
    			add_location(main, file, 7, 0, 216);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(header, main, null);
    			append_dev(main, t0);
    			append_dev(main, span);
    			append_dev(span, div0);
    			mount_component(ikigai, div0, null);
    			append_dev(span, t1);
    			append_dev(span, div1);
    			mount_component(blog, div1, null);
    			append_dev(main, t2);
    			mount_component(footer, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(ikigai.$$.fragment, local);
    			transition_in(blog.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(ikigai.$$.fragment, local);
    			transition_out(blog.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(header);
    			destroy_component(ikigai);
    			destroy_component(blog);
    			destroy_component(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Header, Footer, Ikigai, Blog });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
