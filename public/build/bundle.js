
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
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
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if (typeof $$scope.dirty === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
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
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
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
    function set_input_value(input, value) {
        if (value != null || input.value) {
            input.value = value;
        }
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }
    class HtmlTag {
        constructor(html, anchor = null) {
            this.e = element('div');
            this.a = anchor;
            this.u(html);
        }
        m(target, anchor = null) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(target, this.n[i], anchor);
            }
            this.t = target;
        }
        u(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        p(html) {
            this.d();
            this.u(html);
            this.m(this.t, this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    let stylesheet;
    let active = 0;
    let current_rules = {};
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        if (!current_rules[name]) {
            if (!stylesheet) {
                const style = element('style');
                document.head.appendChild(style);
                stylesheet = style.sheet;
            }
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ``}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        node.style.animation = (node.style.animation || '')
            .split(', ')
            .filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        )
            .join(', ');
        if (name && !--active)
            clear_rules();
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            let i = stylesheet.cssRules.length;
            while (i--)
                stylesheet.deleteRule(i);
            current_rules = {};
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
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
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    const seen_callbacks = new Set();
    function flush() {
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
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

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
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
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }

    const globals = (typeof window !== 'undefined' ? window : global);

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
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
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
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
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
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
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
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
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.18.1' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev("SvelteDOMSetProperty", { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe,
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    function regexparam (str, loose) {
    	if (str instanceof RegExp) return { keys:false, pattern:str };
    	var c, o, tmp, ext, keys=[], pattern='', arr = str.split('/');
    	arr[0] || arr.shift();

    	while (tmp = arr.shift()) {
    		c = tmp[0];
    		if (c === '*') {
    			keys.push('wild');
    			pattern += '/(.*)';
    		} else if (c === ':') {
    			o = tmp.indexOf('?', 1);
    			ext = tmp.indexOf('.', 1);
    			keys.push( tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length) );
    			pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)';
    			if (!!~ext) pattern += (!!~o ? '?' : '') + '\\' + tmp.substring(ext);
    		} else {
    			pattern += '/' + tmp;
    		}
    	}

    	return {
    		keys: keys,
    		pattern: new RegExp('^' + pattern + (loose ? '(?=$|\/)' : '\/?$'), 'i')
    	};
    }

    /* node_modules/svelte-spa-router/Router.svelte generated by Svelte v3.18.1 */

    const { Error: Error_1, Object: Object_1 } = globals;

    function create_fragment(ctx) {
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		return {
    			props: { params: /*componentParams*/ ctx[1] },
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		var switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const switch_instance_changes = {};
    			if (dirty & /*componentParams*/ 2) switch_instance_changes.params = /*componentParams*/ ctx[1];

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
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

    /**
     * @typedef {Object} Location
     * @property {string} location - Location (page/view), for example `/book`
     * @property {string} [querystring] - Querystring from the hash, as a string not parsed
     */
    /**
     * Returns the current location from the hash.
     *
     * @returns {Location} Location object
     * @private
     */
    function getLocation() {
    	const hashPosition = window.location.href.indexOf("#/");

    	let location = hashPosition > -1
    	? window.location.href.substr(hashPosition + 1)
    	: "/";

    	// Check if there's a querystring
    	const qsPosition = location.indexOf("?");

    	let querystring = "";

    	if (qsPosition > -1) {
    		querystring = location.substr(qsPosition + 1);
    		location = location.substr(0, qsPosition);
    	}

    	return { location, querystring };
    }

    const loc = readable(getLocation(), // eslint-disable-next-line prefer-arrow-callback
    function start(set) {
    	const update = () => {
    		set(getLocation());
    	};

    	window.addEventListener("hashchange", update, false);

    	return function stop() {
    		window.removeEventListener("hashchange", update, false);
    	};
    });

    const location = derived(loc, $loc => $loc.location);
    const querystring = derived(loc, $loc => $loc.querystring);

    function link(node) {
    	// Only apply to <a> tags
    	if (!node || !node.tagName || node.tagName.toLowerCase() != "a") {
    		throw Error("Action \"link\" can only be used with <a> tags");
    	}

    	// Destination must start with '/'
    	const href = node.getAttribute("href");

    	if (!href || href.length < 1 || href.charAt(0) != "/") {
    		throw Error("Invalid value for \"href\" attribute");
    	}

    	// Add # to every href attribute
    	node.setAttribute("href", "#" + href);
    }

    function instance($$self, $$props, $$invalidate) {
    	let $loc,
    		$$unsubscribe_loc = noop;

    	validate_store(loc, "loc");
    	component_subscribe($$self, loc, $$value => $$invalidate(4, $loc = $$value));
    	$$self.$$.on_destroy.push(() => $$unsubscribe_loc());
    	let { routes = {} } = $$props;
    	let { prefix = "" } = $$props;

    	/**
     * Container for a route: path, component
     */
    	class RouteItem {
    		/**
     * Initializes the object and creates a regular expression from the path, using regexparam.
     *
     * @param {string} path - Path to the route (must start with '/' or '*')
     * @param {SvelteComponent} component - Svelte component for the route
     */
    		constructor(path, component) {
    			if (!component || typeof component != "function" && (typeof component != "object" || component._sveltesparouter !== true)) {
    				throw Error("Invalid component object");
    			}

    			// Path must be a regular or expression, or a string starting with '/' or '*'
    			if (!path || typeof path == "string" && (path.length < 1 || path.charAt(0) != "/" && path.charAt(0) != "*") || typeof path == "object" && !(path instanceof RegExp)) {
    				throw Error("Invalid value for \"path\" argument");
    			}

    			const { pattern, keys } = regexparam(path);
    			this.path = path;

    			// Check if the component is wrapped and we have conditions
    			if (typeof component == "object" && component._sveltesparouter === true) {
    				this.component = component.route;
    				this.conditions = component.conditions || [];
    				this.userData = component.userData;
    			} else {
    				this.component = component;
    				this.conditions = [];
    				this.userData = undefined;
    			}

    			this._pattern = pattern;
    			this._keys = keys;
    		}

    		/**
     * Checks if `path` matches the current route.
     * If there's a match, will return the list of parameters from the URL (if any).
     * In case of no match, the method will return `null`.
     *
     * @param {string} path - Path to test
     * @returns {null|Object.<string, string>} List of paramters from the URL if there's a match, or `null` otherwise.
     */
    		match(path) {
    			// If there's a prefix, remove it before we run the matching
    			if (prefix && path.startsWith(prefix)) {
    				path = path.substr(prefix.length) || "/";
    			}

    			// Check if the pattern matches
    			const matches = this._pattern.exec(path);

    			if (matches === null) {
    				return null;
    			}

    			// If the input was a regular expression, this._keys would be false, so return matches as is
    			if (this._keys === false) {
    				return matches;
    			}

    			const out = {};
    			let i = 0;

    			while (i < this._keys.length) {
    				out[this._keys[i]] = matches[++i] || null;
    			}

    			return out;
    		}

    		/**
     * Dictionary with route details passed to the pre-conditions functions, as well as the `routeLoaded` and `conditionsFailed` events
     * @typedef {Object} RouteDetail
     * @property {SvelteComponent} component - Svelte component
     * @property {string} name - Name of the Svelte component
     * @property {string} location - Location path
     * @property {string} querystring - Querystring from the hash
     * @property {Object} [userData] - Custom data passed by the user
     */
    		/**
     * Executes all conditions (if any) to control whether the route can be shown. Conditions are executed in the order they are defined, and if a condition fails, the following ones aren't executed.
     * 
     * @param {RouteDetail} detail - Route detail
     * @returns {bool} Returns true if all the conditions succeeded
     */
    		checkConditions(detail) {
    			for (let i = 0; i < this.conditions.length; i++) {
    				if (!this.conditions[i](detail)) {
    					return false;
    				}
    			}

    			return true;
    		}
    	}

    	// We need an iterable: if it's not a Map, use Object.entries
    	const routesIterable = routes instanceof Map ? routes : Object.entries(routes);

    	// Set up all routes
    	const routesList = [];

    	for (const [path, route] of routesIterable) {
    		routesList.push(new RouteItem(path, route));
    	}

    	// Props for the component to render
    	let component = null;

    	let componentParams = {};

    	// Event dispatcher from Svelte
    	const dispatch = createEventDispatcher();

    	// Just like dispatch, but executes on the next iteration of the event loop
    	const dispatchNextTick = (name, detail) => {
    		// Execute this code when the current call stack is complete
    		setTimeout(
    			() => {
    				dispatch(name, detail);
    			},
    			0
    		);
    	};

    	const writable_props = ["routes", "prefix"];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("routes" in $$props) $$invalidate(2, routes = $$props.routes);
    		if ("prefix" in $$props) $$invalidate(3, prefix = $$props.prefix);
    	};

    	$$self.$capture_state = () => {
    		return {
    			routes,
    			prefix,
    			component,
    			componentParams,
    			$loc
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("routes" in $$props) $$invalidate(2, routes = $$props.routes);
    		if ("prefix" in $$props) $$invalidate(3, prefix = $$props.prefix);
    		if ("component" in $$props) $$invalidate(0, component = $$props.component);
    		if ("componentParams" in $$props) $$invalidate(1, componentParams = $$props.componentParams);
    		if ("$loc" in $$props) loc.set($loc = $$props.$loc);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*component, $loc*/ 17) {
    			// Handle hash change events
    			// Listen to changes in the $loc store and update the page
    			 {
    				// Find a route matching the location
    				$$invalidate(0, component = null);

    				let i = 0;

    				while (!component && i < routesList.length) {
    					const match = routesList[i].match($loc.location);

    					if (match) {
    						const detail = {
    							component: routesList[i].component,
    							name: routesList[i].component.name,
    							location: $loc.location,
    							querystring: $loc.querystring,
    							userData: routesList[i].userData
    						};

    						// Check if the route can be loaded - if all conditions succeed
    						if (!routesList[i].checkConditions(detail)) {
    							// Trigger an event to notify the user
    							dispatchNextTick("conditionsFailed", detail);

    							break;
    						}

    						$$invalidate(0, component = routesList[i].component);
    						$$invalidate(1, componentParams = match);
    						dispatchNextTick("routeLoaded", detail);
    					}

    					i++;
    				}
    			}
    		}
    	};

    	return [component, componentParams, routes, prefix];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { routes: 2, prefix: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get routes() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set routes(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefix() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefix(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/ImageCard.svelte generated by Svelte v3.18.1 */

    const file = "src/components/ImageCard.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (17:8) {#each imageCardData as data}
    function create_each_block(ctx) {
    	let div;
    	let h3;
    	let t0_value = /*data*/ ctx[6].title + "";
    	let t0;
    	let t1;
    	let html_tag;
    	let raw_value = /*data*/ ctx[6].content + "";
    	let t2;
    	let div_highlight_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h3 = element("h3");
    			t0 = text(t0_value);
    			t1 = space();
    			t2 = space();
    			add_location(h3, file, 18, 16, 563);
    			html_tag = new HtmlTag(raw_value, t2);
    			attr_dev(div, "class", "image-card__text-container__sub-container svelte-uavk8j");
    			attr_dev(div, "highlight", div_highlight_value = /*data*/ ctx[6].background === "highlight");
    			add_location(div, file, 17, 11, 447);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h3);
    			append_dev(h3, t0);
    			append_dev(div, t1);
    			html_tag.m(div);
    			append_dev(div, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*imageCardData*/ 16 && t0_value !== (t0_value = /*data*/ ctx[6].title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*imageCardData*/ 16 && raw_value !== (raw_value = /*data*/ ctx[6].content + "")) html_tag.p(raw_value);

    			if (dirty & /*imageCardData*/ 16 && div_highlight_value !== (div_highlight_value = /*data*/ ctx[6].background === "highlight")) {
    				attr_dev(div, "highlight", div_highlight_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(17:8) {#each imageCardData as data}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div2;
    	let div0;
    	let a;
    	let img;
    	let img_src_value;
    	let t;
    	let div1;
    	let each_value = /*imageCardData*/ ctx[4];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			a = element("a");
    			img = element("img");
    			t = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(img, "alt", /*imageAlt*/ ctx[1]);
    			if (img.src !== (img_src_value = /*imageURL*/ ctx[2])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svelte-uavk8j");
    			add_location(img, file, 12, 12, 291);
    			attr_dev(a, "href", /*url*/ ctx[3]);
    			attr_dev(a, "class", "svelte-uavk8j");
    			add_location(a, file, 11, 8, 264);
    			attr_dev(div0, "class", "image-card__img-container svelte-uavk8j");
    			add_location(div0, file, 10, 4, 216);
    			attr_dev(div1, "class", "image-card__text-container svelte-uavk8j");
    			add_location(div1, file, 15, 4, 357);
    			attr_dev(div2, "class", "image-card svelte-uavk8j");
    			attr_dev(div2, "left", /*imageLeft*/ ctx[0]);
    			attr_dev(div2, "responsive", /*responsive*/ ctx[5]);
    			add_location(div2, file, 9, 0, 157);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, a);
    			append_dev(a, img);
    			append_dev(div2, t);
    			append_dev(div2, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*imageAlt*/ 2) {
    				attr_dev(img, "alt", /*imageAlt*/ ctx[1]);
    			}

    			if (dirty & /*imageURL*/ 4 && img.src !== (img_src_value = /*imageURL*/ ctx[2])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*url*/ 8) {
    				attr_dev(a, "href", /*url*/ ctx[3]);
    			}

    			if (dirty & /*imageCardData*/ 16) {
    				each_value = /*imageCardData*/ ctx[4];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*imageLeft*/ 1) {
    				attr_dev(div2, "left", /*imageLeft*/ ctx[0]);
    			}

    			if (dirty & /*responsive*/ 32) {
    				attr_dev(div2, "responsive", /*responsive*/ ctx[5]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks, detaching);
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
    	let { imageLeft } = $$props;
    	let { imageAlt } = $$props;
    	let { imageURL } = $$props;
    	let { url } = $$props;
    	let { imageCardData } = $$props;
    	let { responsive = true } = $$props;
    	const writable_props = ["imageLeft", "imageAlt", "imageURL", "url", "imageCardData", "responsive"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ImageCard> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("imageLeft" in $$props) $$invalidate(0, imageLeft = $$props.imageLeft);
    		if ("imageAlt" in $$props) $$invalidate(1, imageAlt = $$props.imageAlt);
    		if ("imageURL" in $$props) $$invalidate(2, imageURL = $$props.imageURL);
    		if ("url" in $$props) $$invalidate(3, url = $$props.url);
    		if ("imageCardData" in $$props) $$invalidate(4, imageCardData = $$props.imageCardData);
    		if ("responsive" in $$props) $$invalidate(5, responsive = $$props.responsive);
    	};

    	$$self.$capture_state = () => {
    		return {
    			imageLeft,
    			imageAlt,
    			imageURL,
    			url,
    			imageCardData,
    			responsive
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("imageLeft" in $$props) $$invalidate(0, imageLeft = $$props.imageLeft);
    		if ("imageAlt" in $$props) $$invalidate(1, imageAlt = $$props.imageAlt);
    		if ("imageURL" in $$props) $$invalidate(2, imageURL = $$props.imageURL);
    		if ("url" in $$props) $$invalidate(3, url = $$props.url);
    		if ("imageCardData" in $$props) $$invalidate(4, imageCardData = $$props.imageCardData);
    		if ("responsive" in $$props) $$invalidate(5, responsive = $$props.responsive);
    	};

    	return [imageLeft, imageAlt, imageURL, url, imageCardData, responsive];
    }

    class ImageCard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			imageLeft: 0,
    			imageAlt: 1,
    			imageURL: 2,
    			url: 3,
    			imageCardData: 4,
    			responsive: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ImageCard",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*imageLeft*/ ctx[0] === undefined && !("imageLeft" in props)) {
    			console.warn("<ImageCard> was created without expected prop 'imageLeft'");
    		}

    		if (/*imageAlt*/ ctx[1] === undefined && !("imageAlt" in props)) {
    			console.warn("<ImageCard> was created without expected prop 'imageAlt'");
    		}

    		if (/*imageURL*/ ctx[2] === undefined && !("imageURL" in props)) {
    			console.warn("<ImageCard> was created without expected prop 'imageURL'");
    		}

    		if (/*url*/ ctx[3] === undefined && !("url" in props)) {
    			console.warn("<ImageCard> was created without expected prop 'url'");
    		}

    		if (/*imageCardData*/ ctx[4] === undefined && !("imageCardData" in props)) {
    			console.warn("<ImageCard> was created without expected prop 'imageCardData'");
    		}
    	}

    	get imageLeft() {
    		throw new Error("<ImageCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set imageLeft(value) {
    		throw new Error("<ImageCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get imageAlt() {
    		throw new Error("<ImageCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set imageAlt(value) {
    		throw new Error("<ImageCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get imageURL() {
    		throw new Error("<ImageCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set imageURL(value) {
    		throw new Error("<ImageCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<ImageCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<ImageCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get imageCardData() {
    		throw new Error("<ImageCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set imageCardData(value) {
    		throw new Error("<ImageCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get responsive() {
    		throw new Error("<ImageCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set responsive(value) {
    		throw new Error("<ImageCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Card.svelte generated by Svelte v3.18.1 */

    const file$1 = "src/components/Card.svelte";

    function create_fragment$2(ctx) {
    	let div2;
    	let div0;
    	let t0;
    	let t1;
    	let div1;
    	let div2_class_value;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t0 = text(/*title*/ ctx[0]);
    			t1 = space();
    			div1 = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div0, "class", "content-box__title svelte-zu7mtr");
    			add_location(div0, file$1, 17, 4, 290);
    			attr_dev(div1, "class", "content-box__content svelte-zu7mtr");
    			add_location(div1, file$1, 20, 4, 354);
    			attr_dev(div2, "class", div2_class_value = "content-box " + /*classList*/ ctx[1] + " svelte-zu7mtr");
    			add_location(div2, file$1, 16, 0, 248);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, t0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*title*/ 1) set_data_dev(t0, /*title*/ ctx[0]);

    			if (default_slot && default_slot.p && dirty & /*$$scope*/ 32) {
    				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[5], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null));
    			}

    			if (!current || dirty & /*classList*/ 2 && div2_class_value !== (div2_class_value = "content-box " + /*classList*/ ctx[1] + " svelte-zu7mtr")) {
    				attr_dev(div2, "class", div2_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (default_slot) default_slot.d(detaching);
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

    function instance$2($$self, $$props, $$invalidate) {
    	let { title } = $$props;
    	let { content } = $$props;
    	let { alignCenter } = $$props;
    	let { maxWidth } = $$props;
    	let classList = "";

    	if (alignCenter) {
    		classList += "content-box--center ";
    	}

    	if (maxWidth) {
    		classList += "content-box--max-width";
    	}

    	const writable_props = ["title", "content", "alignCenter", "maxWidth"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Card> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;

    	$$self.$set = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("content" in $$props) $$invalidate(2, content = $$props.content);
    		if ("alignCenter" in $$props) $$invalidate(3, alignCenter = $$props.alignCenter);
    		if ("maxWidth" in $$props) $$invalidate(4, maxWidth = $$props.maxWidth);
    		if ("$$scope" in $$props) $$invalidate(5, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => {
    		return {
    			title,
    			content,
    			alignCenter,
    			maxWidth,
    			classList
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("content" in $$props) $$invalidate(2, content = $$props.content);
    		if ("alignCenter" in $$props) $$invalidate(3, alignCenter = $$props.alignCenter);
    		if ("maxWidth" in $$props) $$invalidate(4, maxWidth = $$props.maxWidth);
    		if ("classList" in $$props) $$invalidate(1, classList = $$props.classList);
    	};

    	return [title, classList, content, alignCenter, maxWidth, $$scope, $$slots];
    }

    class Card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			title: 0,
    			content: 2,
    			alignCenter: 3,
    			maxWidth: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Card",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[0] === undefined && !("title" in props)) {
    			console.warn("<Card> was created without expected prop 'title'");
    		}

    		if (/*content*/ ctx[2] === undefined && !("content" in props)) {
    			console.warn("<Card> was created without expected prop 'content'");
    		}

    		if (/*alignCenter*/ ctx[3] === undefined && !("alignCenter" in props)) {
    			console.warn("<Card> was created without expected prop 'alignCenter'");
    		}

    		if (/*maxWidth*/ ctx[4] === undefined && !("maxWidth" in props)) {
    			console.warn("<Card> was created without expected prop 'maxWidth'");
    		}
    	}

    	get title() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get content() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set content(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get alignCenter() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set alignCenter(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get maxWidth() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set maxWidth(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/GridContainer.svelte generated by Svelte v3.18.1 */

    const file$2 = "src/components/GridContainer.svelte";

    function create_fragment$3(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "grid svelte-ver6xd");
    			add_location(div, file$2, 1, 0, 1);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot && default_slot.p && dirty & /*$$scope*/ 1) {
    				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[0], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null));
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
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

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots = {}, $$scope } = $$props;

    	$$self.$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		
    	};

    	return [$$scope, $$slots];
    }

    class GridContainer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GridContainer",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    function fade(node, { delay = 0, duration = 400, easing = identity }) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }

    /* src/routes/Home.svelte generated by Svelte v3.18.1 */
    const file$3 = "src/routes/Home.svelte";

    // (46:8) <Card title="Web Pacman">
    function create_default_slot_2(ctx) {
    	let div;
    	let p0;
    	let t1;
    	let p1;
    	let t3;
    	let p2;
    	let t4;
    	let a;
    	let t6;
    	let p3;
    	let strong;
    	let t8;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p0 = element("p");
    			p0.textContent = "For my final year project at the University of Liverpool, I built the classic\n                game, Pacman, using a HTML5 Game Engine named Phaser 3.";
    			t1 = space();
    			p1 = element("p");
    			p1.textContent = "I expanded upon the original scope of the game by implementing an original new game mode\n                which features procedurally generated Mazes and Maze Solving Algorithms.";
    			t3 = space();
    			p2 = element("p");
    			t4 = text("You can play it here: ");
    			a = element("a");
    			a.textContent = "pacman.benhawley.net";
    			t6 = space();
    			p3 = element("p");
    			strong = element("strong");
    			strong.textContent = "Note:";
    			t8 = text(" The projects focus was on the analysis of the implemented algorithms,\n                so I did not have time to optimise for mobile, so please play on PC (Sorry x).");
    			add_location(p0, file$3, 47, 16, 1730);
    			add_location(p1, file$3, 49, 16, 1903);
    			attr_dev(a, "href", "https://pacman.benhawley.net");
    			add_location(a, file$3, 51, 41, 2129);
    			add_location(p2, file$3, 51, 16, 2104);
    			add_location(strong, file$3, 52, 19, 2216);
    			add_location(p3, file$3, 52, 16, 2213);
    			add_location(div, file$3, 46, 12, 1708);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p0);
    			append_dev(div, t1);
    			append_dev(div, p1);
    			append_dev(div, t3);
    			append_dev(div, p2);
    			append_dev(p2, t4);
    			append_dev(p2, a);
    			append_dev(div, t6);
    			append_dev(div, p3);
    			append_dev(p3, strong);
    			append_dev(p3, t8);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(46:8) <Card title=\\\"Web Pacman\\\">",
    		ctx
    	});

    	return block;
    }

    // (57:8) <Card title="Alexa Skills">
    function create_default_slot_1(ctx) {
    	let div;
    	let p0;
    	let t1;
    	let p1;
    	let t3;
    	let ul;
    	let li0;
    	let t5;
    	let li1;
    	let t7;
    	let li2;
    	let t9;
    	let p2;
    	let t10;
    	let a;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p0 = element("p");
    			p0.textContent = "For work, and as a hobby, I develop apps, known as skills, for Amazon Alexa.";
    			t1 = space();
    			p1 = element("p");
    			p1.textContent = "My popular skills include:";
    			t3 = space();
    			ul = element("ul");
    			li0 = element("li");
    			li0.textContent = "Chewbacca Chat";
    			t5 = space();
    			li1 = element("li");
    			li1.textContent = "R2D2 Talk";
    			t7 = space();
    			li2 = element("li");
    			li2.textContent = "Tic Tac Toe";
    			t9 = space();
    			p2 = element("p");
    			t10 = text("You can find out more ");
    			a = element("a");
    			a.textContent = "on my Alexa page.";
    			add_location(p0, file$3, 58, 16, 2513);
    			add_location(p1, file$3, 59, 16, 2613);
    			add_location(li0, file$3, 61, 20, 2688);
    			add_location(li1, file$3, 62, 20, 2732);
    			add_location(li2, file$3, 63, 20, 2771);
    			add_location(ul, file$3, 60, 16, 2663);
    			attr_dev(a, "href", "/alexa");
    			add_location(a, file$3, 65, 41, 2855);
    			add_location(p2, file$3, 65, 16, 2830);
    			add_location(div, file$3, 57, 12, 2491);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p0);
    			append_dev(div, t1);
    			append_dev(div, p1);
    			append_dev(div, t3);
    			append_dev(div, ul);
    			append_dev(ul, li0);
    			append_dev(ul, t5);
    			append_dev(ul, li1);
    			append_dev(ul, t7);
    			append_dev(ul, li2);
    			append_dev(div, t9);
    			append_dev(div, p2);
    			append_dev(p2, t10);
    			append_dev(p2, a);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(57:8) <Card title=\\\"Alexa Skills\\\">",
    		ctx
    	});

    	return block;
    }

    // (45:4) <GridContainer>
    function create_default_slot(ctx) {
    	let t;
    	let current;

    	const card0 = new Card({
    			props: {
    				title: "Web Pacman",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const card1 = new Card({
    			props: {
    				title: "Alexa Skills",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(card0.$$.fragment);
    			t = space();
    			create_component(card1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(card0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(card1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const card0_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				card0_changes.$$scope = { dirty, ctx };
    			}

    			card0.$set(card0_changes);
    			const card1_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				card1_changes.$$scope = { dirty, ctx };
    			}

    			card1.$set(card1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card0.$$.fragment, local);
    			transition_in(card1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card0.$$.fragment, local);
    			transition_out(card1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(card0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(card1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(45:4) <GridContainer>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div;
    	let h1;
    	let t1;
    	let h2;
    	let t3;
    	let t4;
    	let div_intro;
    	let current;

    	const imagecard = new ImageCard({
    			props: {
    				url: "https://github.com/benhawley7",
    				imageAlt,
    				imageURL,
    				imageCardData: /*imageCardData*/ ctx[0]
    			},
    			$$inline: true
    		});

    	const gridcontainer = new GridContainer({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Home";
    			t1 = space();
    			h2 = element("h2");
    			h2.textContent = "About Me";
    			t3 = space();
    			create_component(imagecard.$$.fragment);
    			t4 = space();
    			create_component(gridcontainer.$$.fragment);
    			add_location(h1, file$3, 41, 4, 1515);
    			add_location(h2, file$3, 42, 4, 1533);
    			add_location(div, file$3, 40, 0, 1471);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(div, t1);
    			append_dev(div, h2);
    			append_dev(div, t3);
    			mount_component(imagecard, div, null);
    			append_dev(div, t4);
    			mount_component(gridcontainer, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const gridcontainer_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				gridcontainer_changes.$$scope = { dirty, ctx };
    			}

    			gridcontainer.$set(gridcontainer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(imagecard.$$.fragment, local);
    			transition_in(gridcontainer.$$.fragment, local);

    			if (!div_intro) {
    				add_render_callback(() => {
    					div_intro = create_in_transition(div, fade, { duration: 300 });
    					div_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(imagecard.$$.fragment, local);
    			transition_out(gridcontainer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(imagecard);
    			destroy_component(gridcontainer);
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

    const imageURL = "/assets/me-compressed.jpg";
    const imageAlt = "Picture of me in Spain.";

    function instance$4($$self) {
    	const imageCardData = [
    		{
    			title: "Pwy wyt ti?",
    			content: `
            <div>
                <p>There I am in Spain! 🌞</p>
                <p>I am a graduate of Computer Science from the University of Liverpool.</p>
                <p>Currently working as a Software Developer at <a href="https://digitaldesignlabs.com">Digital Design Labs Ltd.</a></p>
            </div>`,
    			background: "standard"
    		},
    		{
    			title: "Thingys",
    			content: `
            <div>
                <p>Some relevant links:</p>
                <ul>
                    <li><a href="https://github.com/benhawley7">GitHub</a></li>
                    <li><a href="https://www.instagram.com/benhawley/">Instagram</a></li>
                    <li><a href="https://www.linkedin.com/in/ben-hawley-5b0235121/">LinkedIn</a></li>
                </ul>
            </div>`,
    			background: "highlight"
    		}
    	];

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		
    	};

    	return [imageCardData];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    const t={up:["̍","̎","̄","̅","̿","̑","̆","̐","͒","͗","͑","̇","̈","̊","͂","̓","̈́","͊","͋","͌","̃","̂","̌","͐","̀","́","̋","̏","̒","̓","̔","̽","̉","ͣ","ͤ","ͥ","ͦ","ͧ","ͨ","ͩ","ͪ","ͫ","ͬ","ͭ","ͮ","ͯ","̾","͛","͆","̚"],middle:["̕","̛","̀","́","͘","̡","̢","̧","̨","̴","̵","̶","͏","͜","͝","͞","͟","͠","͢","̸","̷","͡","҉"],down:["̖","̗","̘","̙","̜","̝","̞","̟","̠","̤","̥","̦","̩","̪","̫","̬","̭","̮","̯","̰","̱","̲","̳","̹","̺","̻","̼","ͅ","͇","͈","͉","͍","͎","͓","͔","͕","͖","͙","͚","̣"]};t.all=[...t.up,...t.middle,...t.down],t.pattern=RegExp(`(${t.all.join("|")})`,"g");class e extends Error{constructor(t){super(t),this.message=t,this.name="ZalgoError",this.stack="";}}const n=t=>{const e=/([\uD800-\uDBFF])([\uDC00-\uDFFF])([\uD800-\uDBFF])?([\uDC00-\uDFFF])?|([0-9])?([\0-\u02FF\u0370-\u1AAF\u1B00-\u1DBF\u1E00-\u20CF\u2100-\uD7FF\uE000-\uFE1F\uFE30-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])([\u0300-\u036F\u1AB0-\u1AFF\u1DC0-\u1DFF\u20D0-\u20FF\uFE20-\uFE2F\uFE0F]+)/g,n=t.replace(e,"•").split("");let u,i=0;for(;u=e.exec(t);)u.index-=i,i+=u[0].length-1,n.splice(u.index,1,u[0]);return n},u=(t,e)=>t&&t[e],i=t=>~~(Math.random()*t),r=(r,o={up:!0,middle:!0,down:!0,size:""})=>{try{if(!r)throw new Error("no_input");if("string"!=typeof r)throw new Error("not_a_string");u(o,"up")||(o.up=!0),u(o,"middle")||(o.middle=!0),u(o,"down")||(o.down=!0),u(o,"size")||(o.size="");const e=n(r),s=e.length;let F,p="";const d=[];u(o,"up")&&d.push("up"),u(o,"middle")&&d.push("middle"),u(o,"down")&&d.push("down");for(let n=0;n<s;n++)if(!t.pattern.test(e[n]))if(e[n].length>1)p+=e[n];else{F={up:0,middle:0,down:0},F="mini"===o.size?{up:i(8),middle:i(2),down:i(8)}:"maxi"===o.size?{up:i(16)+3,middle:i(4)+1,down:i(64)+3}:{up:i(8)+1,middle:i(3),down:i(8)+1},p+=r[n];for(let e=0,n=d.length;e<n;e++){const n=d[e];let u=F[n];const r=t[n],o=r.length-1;for(;u--;)p+=r[i(o)];}}return p}catch(t){if(/(?:no_input)/i.test(t.toString()))throw new e("The zalgo function at least requires some text as input!");if(/(?:not_a_string)/i.test(t.toString()))throw new e("The zalgo function expects input of type string as first argument!");throw t}};//# sourceMappingURL=index.es.js.map

    function getSpacedMemeText(text, upperCase) {
        text = upperCase ? text.toUpperCase() : text.toLowerCase();
        return [...text].join(" ");
    }

    function getInvertedMemeText(text, upperCase) {
        return ["", ...text].reduce((acc , char) => {
            if (char.match(/[A-Za-z]/)) {
                char = upperCase ? char.toUpperCase() : char.toLowerCase();
                upperCase = !upperCase;
            }
            return acc + char;
        });
    }

    function getInsertedCowboyMemeText(text, upperCase) {
        text = upperCase ? text.toUpperCase() : text.toLowerCase();
        return ["🤠 ", ...text.split(" ").join(" 🤠 ").split(), " 🤠"].join("");
    }

    function getZalgoText(text, upperCase) {
        text = upperCase ? text.toUpperCase() : text.toLowerCase();
        return r(text);
    }

    function getMemeTextByType(text, upperCase, memeType) {
        memeType = memeType || "Inverted";
        if (memeType === "Spaced") {
            return getSpacedMemeText(text, upperCase);
        } else if (memeType === "Cowboy") {
            return getInsertedCowboyMemeText(text, upperCase);
        } else if (memeType === "Zalgo") {
            return getZalgoText(text, upperCase);
        } else {
            return getInvertedMemeText(text, upperCase);
        }
    }



    function getAvailableTypes() {
        return ["Inverted", "Spaced", "Cowboy", "Zalgo"];
    }

    var MemeText = {
        getAvailableTypes,
        getSpacedMemeText,
        getInvertedMemeText,
        getMemeTextByType
    };

    /* src/components/RadioSelector.svelte generated by Svelte v3.18.1 */
    const file$4 = "src/components/RadioSelector.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    // (56:4) {#each options as option}
    function create_each_block$1(ctx) {
    	let input;
    	let input_id_value;
    	let input_value_value;
    	let t0;
    	let label;
    	let t1_value = /*option*/ ctx[8] + "";
    	let t1;
    	let label_for_value;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			t0 = space();
    			label = element("label");
    			t1 = text(t1_value);
    			attr_dev(input, "type", "radio");
    			attr_dev(input, "id", input_id_value = /*option*/ ctx[8]);
    			attr_dev(input, "name", /*name*/ ctx[1]);
    			input.__value = input_value_value = /*option*/ ctx[8];
    			input.value = input.__value;
    			attr_dev(input, "class", "svelte-o7wxex");
    			/*$$binding_groups*/ ctx[7][0].push(input);
    			add_location(input, file$4, 56, 8, 931);
    			attr_dev(label, "class", "radio-selector__button svelte-o7wxex");
    			attr_dev(label, "for", label_for_value = /*option*/ ctx[8]);
    			add_location(label, file$4, 57, 8, 1038);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			input.checked = input.__value === /*group*/ ctx[2];
    			insert_dev(target, t0, anchor);
    			insert_dev(target, label, anchor);
    			append_dev(label, t1);

    			dispose = [
    				listen_dev(input, "change", /*input_change_handler*/ ctx[6]),
    				listen_dev(input, "change", /*onClick*/ ctx[3], false, false, false)
    			];
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*options*/ 1 && input_id_value !== (input_id_value = /*option*/ ctx[8])) {
    				attr_dev(input, "id", input_id_value);
    			}

    			if (dirty & /*name*/ 2) {
    				attr_dev(input, "name", /*name*/ ctx[1]);
    			}

    			if (dirty & /*options*/ 1 && input_value_value !== (input_value_value = /*option*/ ctx[8])) {
    				prop_dev(input, "__value", input_value_value);
    			}

    			input.value = input.__value;

    			if (dirty & /*group*/ 4) {
    				input.checked = input.__value === /*group*/ ctx[2];
    			}

    			if (dirty & /*options*/ 1 && t1_value !== (t1_value = /*option*/ ctx[8] + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*options*/ 1 && label_for_value !== (label_for_value = /*option*/ ctx[8])) {
    				attr_dev(label, "for", label_for_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			/*$$binding_groups*/ ctx[7][0].splice(/*$$binding_groups*/ ctx[7][0].indexOf(input), 1);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(label);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(56:4) {#each options as option}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div;
    	let each_value = /*options*/ ctx[0];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "radio-selector svelte-o7wxex");
    			add_location(div, file$4, 54, 0, 864);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*options, name, group, onClick*/ 15) {
    				each_value = /*options*/ ctx[0];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { options } = $$props;
    	let { name } = $$props;
    	let { selected } = $$props;
    	let group;

    	onMount(() => {
    		if (selected) {
    			$$invalidate(2, group = selected);
    		}
    	});

    	const dispatch = createEventDispatcher();

    	function onClick() {
    		$$invalidate(4, selected = group);
    		dispatch("change");
    	}

    	const writable_props = ["options", "name", "selected"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<RadioSelector> was created with unknown prop '${key}'`);
    	});

    	const $$binding_groups = [[]];

    	function input_change_handler() {
    		group = this.__value;
    		$$invalidate(2, group);
    	}

    	$$self.$set = $$props => {
    		if ("options" in $$props) $$invalidate(0, options = $$props.options);
    		if ("name" in $$props) $$invalidate(1, name = $$props.name);
    		if ("selected" in $$props) $$invalidate(4, selected = $$props.selected);
    	};

    	$$self.$capture_state = () => {
    		return { options, name, selected, group };
    	};

    	$$self.$inject_state = $$props => {
    		if ("options" in $$props) $$invalidate(0, options = $$props.options);
    		if ("name" in $$props) $$invalidate(1, name = $$props.name);
    		if ("selected" in $$props) $$invalidate(4, selected = $$props.selected);
    		if ("group" in $$props) $$invalidate(2, group = $$props.group);
    	};

    	return [
    		options,
    		name,
    		group,
    		onClick,
    		selected,
    		dispatch,
    		input_change_handler,
    		$$binding_groups
    	];
    }

    class RadioSelector extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { options: 0, name: 1, selected: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RadioSelector",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*options*/ ctx[0] === undefined && !("options" in props)) {
    			console.warn("<RadioSelector> was created without expected prop 'options'");
    		}

    		if (/*name*/ ctx[1] === undefined && !("name" in props)) {
    			console.warn("<RadioSelector> was created without expected prop 'name'");
    		}

    		if (/*selected*/ ctx[4] === undefined && !("selected" in props)) {
    			console.warn("<RadioSelector> was created without expected prop 'selected'");
    		}
    	}

    	get options() {
    		throw new Error("<RadioSelector>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<RadioSelector>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<RadioSelector>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<RadioSelector>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selected() {
    		throw new Error("<RadioSelector>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<RadioSelector>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/MemeTextGenerator.svelte generated by Svelte v3.18.1 */
    const file$5 = "src/components/MemeTextGenerator.svelte";

    // (38:0) <Card title="Lets meme some strings.">
    function create_default_slot$1(ctx) {
    	let p0;
    	let t1;
    	let updating_selected;
    	let t2;
    	let p1;
    	let t4;
    	let div;
    	let input;
    	let t5;
    	let button0;
    	let t7;
    	let p2;
    	let t9;
    	let textarea;
    	let t10;
    	let button1;
    	let current;
    	let dispose;

    	function radioselector_selected_binding(value) {
    		/*radioselector_selected_binding*/ ctx[8].call(null, value);
    	}

    	let radioselector_props = {
    		name: /*name*/ ctx[4],
    		options: /*types*/ ctx[3]
    	};

    	if (/*selected*/ ctx[0] !== void 0) {
    		radioselector_props.selected = /*selected*/ ctx[0];
    	}

    	const radioselector = new RadioSelector({
    			props: radioselector_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(radioselector, "selected", radioselector_selected_binding));
    	radioselector.$on("change", /*updateMemeText*/ ctx[6]);

    	const block = {
    		c: function create() {
    			p0 = element("p");
    			p0.textContent = "Choose your style.";
    			t1 = space();
    			create_component(radioselector.$$.fragment);
    			t2 = space();
    			p1 = element("p");
    			p1.textContent = "Type your text.";
    			t4 = space();
    			div = element("div");
    			input = element("input");
    			t5 = space();
    			button0 = element("button");
    			button0.textContent = "Flip";
    			t7 = space();
    			p2 = element("p");
    			p2.textContent = "Copy dem memes.";
    			t9 = space();
    			textarea = element("textarea");
    			t10 = space();
    			button1 = element("button");
    			button1.textContent = "Copy";
    			add_location(p0, file$5, 38, 4, 757);
    			add_location(p1, file$5, 40, 4, 883);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "meme-text-input svelte-7543un");
    			add_location(input, file$5, 42, 8, 942);
    			attr_dev(button0, "class", "button");
    			add_location(button0, file$5, 43, 8, 1044);
    			attr_dev(div, "class", "input-box svelte-7543un");
    			add_location(div, file$5, 41, 4, 910);
    			add_location(p2, file$5, 45, 4, 1114);
    			attr_dev(textarea, "class", "meme-text-output__text js-meme-output svelte-7543un");
    			textarea.value = /*memeText*/ ctx[2];
    			add_location(textarea, file$5, 46, 4, 1141);
    			attr_dev(button1, "class", "button");
    			add_location(button1, file$5, 47, 4, 1223);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p0, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(radioselector, target, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p1, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, input);
    			set_input_value(input, /*inputText*/ ctx[1]);
    			append_dev(div, t5);
    			append_dev(div, button0);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, p2, anchor);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, textarea, anchor);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, button1, anchor);
    			current = true;

    			dispose = [
    				listen_dev(input, "input", /*input_input_handler*/ ctx[9]),
    				listen_dev(input, "keyup", /*updateMemeText*/ ctx[6], false, false, false),
    				listen_dev(button0, "click", /*onFlip*/ ctx[5], false, false, false),
    				listen_dev(button1, "click", onCopy, false, false, false)
    			];
    		},
    		p: function update(ctx, dirty) {
    			const radioselector_changes = {};

    			if (!updating_selected && dirty & /*selected*/ 1) {
    				updating_selected = true;
    				radioselector_changes.selected = /*selected*/ ctx[0];
    				add_flush_callback(() => updating_selected = false);
    			}

    			radioselector.$set(radioselector_changes);

    			if (dirty & /*inputText*/ 2 && input.value !== /*inputText*/ ctx[1]) {
    				set_input_value(input, /*inputText*/ ctx[1]);
    			}

    			if (!current || dirty & /*memeText*/ 4) {
    				prop_dev(textarea, "value", /*memeText*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(radioselector.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(radioselector.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t1);
    			destroy_component(radioselector, detaching);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(p2);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(textarea);
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(button1);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(38:0) <Card title=\\\"Lets meme some strings.\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let current;

    	const card = new Card({
    			props: {
    				title: "Lets meme some strings.",
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(card.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(card, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const card_changes = {};

    			if (dirty & /*$$scope, memeText, inputText, selected*/ 1031) {
    				card_changes.$$scope = { dirty, ctx };
    			}

    			card.$set(card_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(card, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function onCopy() {
    	const memeOutput = document.querySelector(".js-meme-output");
    	memeOutput.select();
    	document.execCommand("copy");
    }

    function instance$6($$self, $$props, $$invalidate) {
    	const types = MemeText.getAvailableTypes();
    	let selected;
    	let name = "meme-text-choice";
    	let inputText = "Here is some sample text for y'all.";
    	let memeText = "";
    	let flip = false;

    	function onFlip() {
    		flip = !flip;
    		updateMemeText();
    	}

    	async function updateMemeText() {
    		$$invalidate(2, memeText = MemeText.getMemeTextByType(inputText, flip, selected));
    	}

    	updateMemeText();

    	function radioselector_selected_binding(value) {
    		selected = value;
    		$$invalidate(0, selected);
    	}

    	function input_input_handler() {
    		inputText = this.value;
    		$$invalidate(1, inputText);
    	}

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ("selected" in $$props) $$invalidate(0, selected = $$props.selected);
    		if ("name" in $$props) $$invalidate(4, name = $$props.name);
    		if ("inputText" in $$props) $$invalidate(1, inputText = $$props.inputText);
    		if ("memeText" in $$props) $$invalidate(2, memeText = $$props.memeText);
    		if ("flip" in $$props) flip = $$props.flip;
    	};

    	return [
    		selected,
    		inputText,
    		memeText,
    		types,
    		name,
    		onFlip,
    		updateMemeText,
    		flip,
    		radioselector_selected_binding,
    		input_input_handler
    	];
    }

    class MemeTextGenerator extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MemeTextGenerator",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/routes/Memes.svelte generated by Svelte v3.18.1 */
    const file$6 = "src/routes/Memes.svelte";

    function create_fragment$7(ctx) {
    	let div;
    	let h1;
    	let t1;
    	let h2;
    	let t3;
    	let p;
    	let t5;
    	let div_intro;
    	let current;
    	const memetextgenerator = new MemeTextGenerator({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Memes";
    			t1 = space();
    			h2 = element("h2");
    			h2.textContent = "Random Meme Tools";
    			t3 = space();
    			p = element("p");
    			p.textContent = "Very important page.";
    			t5 = space();
    			create_component(memetextgenerator.$$.fragment);
    			add_location(h1, file$6, 5, 4, 175);
    			add_location(h2, file$6, 6, 4, 194);
    			add_location(p, file$6, 7, 4, 225);
    			add_location(div, file$6, 4, 0, 137);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(div, t1);
    			append_dev(div, h2);
    			append_dev(div, t3);
    			append_dev(div, p);
    			append_dev(div, t5);
    			mount_component(memetextgenerator, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(memetextgenerator.$$.fragment, local);

    			if (!div_intro) {
    				add_render_callback(() => {
    					div_intro = create_in_transition(div, fade, { duration: 300 });
    					div_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(memetextgenerator.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(memetextgenerator);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    class Memes extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Memes",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src/routes/Alexa.svelte generated by Svelte v3.18.1 */
    const file$7 = "src/routes/Alexa.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (102:8) {#each skills as skill}
    function create_each_block$2(ctx) {
    	let current;

    	const imagecard = new ImageCard({
    			props: {
    				url: /*skill*/ ctx[1].url,
    				responsive: "false",
    				imageLeft: /*skill*/ ctx[1].left,
    				imageAlt: /*skill*/ ctx[1].imageAlt,
    				imageURL: /*skill*/ ctx[1].imageURL,
    				imageCardData: /*skill*/ ctx[1].textContainerData
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(imagecard.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(imagecard, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(imagecard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(imagecard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(imagecard, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(102:8) {#each skills as skill}",
    		ctx
    	});

    	return block;
    }

    // (101:4) <GridContainer>
    function create_default_slot$2(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*skills*/ ctx[0];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

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
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*skills*/ 1) {
    				each_value = /*skills*/ ctx[0];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(101:4) <GridContainer>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div;
    	let h1;
    	let t1;
    	let p;
    	let t3;
    	let div_intro;
    	let current;

    	const gridcontainer = new GridContainer({
    			props: {
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Alexa";
    			t1 = space();
    			p = element("p");
    			p.textContent = "I have developed a variety of popular Alexa Skills.";
    			t3 = space();
    			create_component(gridcontainer.$$.fragment);
    			add_location(h1, file$7, 98, 4, 3847);
    			add_location(p, file$7, 99, 4, 3866);
    			add_location(div, file$7, 97, 0, 3809);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(div, t1);
    			append_dev(div, p);
    			append_dev(div, t3);
    			mount_component(gridcontainer, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const gridcontainer_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				gridcontainer_changes.$$scope = { dirty, ctx };
    			}

    			gridcontainer.$set(gridcontainer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(gridcontainer.$$.fragment, local);

    			if (!div_intro) {
    				add_render_callback(() => {
    					div_intro = create_in_transition(div, fade, { duration: 300 });
    					div_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(gridcontainer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(gridcontainer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const ccLink = "https://www.amazon.co.uk/Ben-Hawley-Chewbacca-Chat/dp/B078NP7B4F/ref=sr_1_1?keywords=chewbacca+chat&qid=1563573777&s=digital-skills&sr=1-1";
    const tttLink = "https://www.amazon.co.uk/Ben-Hawley-Tic-Tac-Toe/dp/B07CQT19P9/ref=sr_1_4?keywords=tic+tac+toe&qid=1563719394&s=digital-skills&sr=1-4";
    const fpLink = "https://www.amazon.com/Ben-Hawley-Fortnite-Partner/dp/B07GZGLQK2";

    function instance$7($$self) {
    	const skills = [
    		{
    			left: false,
    			url: ccLink,
    			imageURL: "/assets/chewbacca-chat.png",
    			imageAlt: "Picture of Chewbacca Chat on the Alexa Skills Store.",
    			textContainerData: [
    				{
    					title: "Chewbacca Chat",
    					content: `
                <div>
                    <p>
                    Chewbacca Chat allows you to have conversation with the iconic Star Wars Wookiee.
                    </p>
                    <p>
                        Popular demand led me to implement APL Documents for Echo Show Devices,
                        which allows for exciting animations and interactions.
                    </p>
                    <p>
                        <a href=${ccLink}>Enable the Chewbacca Chat Skill here!</a>
                    </p>
                </div>`
    				}
    			]
    		},
    		{
    			left: true,
    			url: tttLink,
    			imageURL: "/assets/tic-tac-toe.jpg",
    			imageAlt: "Picture of Tic Tac Toe Board Design in APL.",
    			textContainerData: [
    				{
    					title: "Tic Tac Toe",
    					content: `
                <div>
                    <p>
                        In a second year university group project, we built a website containing
                        a number of classic games, one of my tasks was implementing the Mini-Max
                        Algorithm in JavaScript to be used as the AI in a <a href="https://fourgames.uk">
                        Tic Tac Toe and Connect Four Game.</a>
                    </p>
                    <p>
                        When I started building Alexa skills,
                        I integrated this algorithm into a voice Tic Tac Toe game. With the release
                        of Alexa Presentation Language, I created a game board which is completely interactive and
                        animated on Echo Show Devices.
                    </p>
                    <p>
                        <a href=${tttLink}>Enable the Tic Tac Toe Skill here!</a>
                    </p>
                </div>`
    				}
    			]
    		},
    		{
    			left: true,
    			imageURL: "/assets/fortnite-partner.png",
    			url: fpLink,
    			imageAlt: "Picture of Fortnite Partner on Alexa Skill Storex",
    			textContainerData: [
    				{
    					title: "Fortnite Partner",
    					content: `
                <div>
                    <p>
                        One of the more dynamic skills I have built is Fortnite Partner. This skill leverages an API to output the latest data concerning the popular game.
                    </p>
                    <p>
                        The skill allows you to:
                        <ul>
                            <li>Get the message of the day</li>
                            <li>Get weekly challenges and current items</li>
                            <li>Check if the servers are up</li>
                        </ul>
                    </p>
                    <p>
                        <a href=${fpLink}>Enable the Fortnite Partner Skill here!</a>
                    </p>
                </div>`
    				}
    			]
    		}
    	];

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		
    	};

    	return [skills];
    }

    class Alexa extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Alexa",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src/routes/NotFound.svelte generated by Svelte v3.18.1 */
    const file$8 = "src/routes/NotFound.svelte";

    function create_fragment$9(ctx) {
    	let div;
    	let h1;
    	let t1;
    	let p;
    	let a;
    	let div_intro;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Wrong page matey.";
    			t1 = space();
    			p = element("p");
    			a = element("a");
    			a.textContent = "Go home.";
    			add_location(h1, file$8, 4, 4, 103);
    			attr_dev(a, "href", "/");
    			add_location(a, file$8, 5, 7, 137);
    			add_location(p, file$8, 5, 4, 134);
    			add_location(div, file$8, 3, 0, 65);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(div, t1);
    			append_dev(div, p);
    			append_dev(p, a);
    		},
    		p: noop,
    		i: function intro(local) {
    			if (!div_intro) {
    				add_render_callback(() => {
    					div_intro = create_in_transition(div, fade, { duration: 300 });
    					div_intro.start();
    				});
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    class NotFound extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NotFound",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    // List of nodes to update
    const nodes = [];

    // Current location
    let location$1;

    // Function that updates all nodes marking the active ones
    function checkActive(el) {
        // Remove the active class from all elements
        el.node.classList.remove(el.className);

        // If the pattern matches, then set the active class
        if (el.pattern.test(location$1)) {
            el.node.classList.add(el.className);
        }
    }

    // Listen to changes in the location
    loc.subscribe((value) => {
        // Update the location
        location$1 = value.location + (value.querystring ? '?' + value.querystring : '');

        // Update all nodes
        nodes.map(checkActive);
    });

    /**
     * @typedef {Object} ActiveOptions
     * @property {string} [path] - Path expression that makes the link active when matched (must start with '/' or '*'); default is the link's href
     * @property {string} [className] - CSS class to apply to the element when active; default value is "active"
     */

    /**
     * Svelte Action for automatically adding the "active" class to elements (links, or any other DOM element) when the current location matches a certain path.
     * 
     * @param {HTMLElement} node - The target node (automatically set by Svelte)
     * @param {ActiveOptions|string} [opts] - Can be an object of type ActiveOptions, or a string representing ActiveOptions.path.
     */
    function active$1(node, opts) {
        // Check options
        if (opts && typeof opts == 'string') {
            // Interpret strings as opts.path
            opts = {
                path: opts
            };
        }
        else {
            // Ensure opts is a dictionary
            opts = opts || {};
        }

        // Path defaults to link target
        if (!opts.path && node.hasAttribute('href')) {
            opts.path = node.getAttribute('href');
            if (opts.path && opts.path.length > 1 && opts.path.charAt(0) == '#') {
                opts.path = opts.path.substring(1);
            }
        }

        // Default class name
        if (!opts.className) {
            opts.className = 'active';
        }

        // Path must start with '/' or '*'
        if (!opts.path || opts.path.length < 1 || (opts.path.charAt(0) != '/' && opts.path.charAt(0) != '*')) {
            throw Error('Invalid value for "path" argument')
        }

        // Get the regular expression
        const {pattern} = regexparam(opts.path);

        // Add the node to the list
        const el = {
            node,
            className: opts.className,
            pattern
        };
        nodes.push(el);

        // Trigger the action right away
        checkActive(el);

        return {
            // When the element is destroyed, remove it from the list
            destroy() {
                nodes.splice(nodes.indexOf(el), 1);
            }
        }
    }

    /* src/components/Header.svelte generated by Svelte v3.18.1 */
    const file$9 = "src/components/Header.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (41:12) {#each navigation as nav}
    function create_each_block_1(ctx) {
    	let div;
    	let a;
    	let t_value = /*nav*/ ctx[3].text + "";
    	let t;
    	let a_href_value;
    	let link_action;
    	let active_action;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "href", a_href_value = /*nav*/ ctx[3].route);
    			attr_dev(a, "class", "svelte-142qemm");
    			add_location(a, file$9, 42, 20, 873);
    			attr_dev(div, "class", "header__navigation__item svelte-142qemm");
    			add_location(div, file$9, 41, 16, 814);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a);
    			append_dev(a, t);

    			dispose = [
    				action_destroyer(link_action = link.call(null, a)),
    				action_destroyer(active_action = active$1.call(null, a, /*nav*/ ctx[3].route))
    			];
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(41:12) {#each navigation as nav}",
    		ctx
    	});

    	return block;
    }

    // (46:12) {#each external as nav}
    function create_each_block$3(ctx) {
    	let div;
    	let a;
    	let t0_value = /*nav*/ ctx[3].text + "";
    	let t0;
    	let a_href_value;
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(a, "href", a_href_value = /*nav*/ ctx[3].route);
    			attr_dev(a, "class", "svelte-142qemm");
    			add_location(a, file$9, 47, 20, 1094);
    			attr_dev(div, "class", "header__navigation__item svelte-142qemm");
    			add_location(div, file$9, 46, 16, 1035);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a);
    			append_dev(a, t0);
    			append_dev(div, t1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(46:12) {#each external as nav}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let header;
    	let div1;
    	let div0;
    	let t1;
    	let nav;
    	let t2;
    	let each_value_1 = /*navigation*/ ctx[0];
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = /*external*/ ctx[1];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			header = element("header");
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "BenHawley.net";
    			t1 = space();
    			nav = element("nav");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t2 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "header__title svelte-142qemm");
    			add_location(div0, file$9, 38, 8, 672);
    			attr_dev(nav, "class", "header__navigation svelte-142qemm");
    			add_location(nav, file$9, 39, 8, 727);
    			attr_dev(div1, "class", "header__content svelte-142qemm");
    			add_location(div1, file$9, 37, 4, 634);
    			attr_dev(header, "class", "header svelte-142qemm");
    			add_location(header, file$9, 36, 0, 606);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, div1);
    			append_dev(div1, div0);
    			append_dev(div1, t1);
    			append_dev(div1, nav);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(nav, null);
    			}

    			append_dev(nav, t2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(nav, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*navigation*/ 1) {
    				each_value_1 = /*navigation*/ ctx[0];
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(nav, t2);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*external*/ 2) {
    				each_value = /*external*/ ctx[1];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(nav, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self) {

    	const navigation = [
    		{ text: "Home", route: "/" },
    		{ text: "Alexa", route: "/alexa" },
    		{ text: "Memes", route: "/memes" }
    	];

    	const external = [
    		{
    			text: "Blog",
    			route: "https://medium.com/@benhawley7"
    		},
    		{
    			text: "Pacman",
    			route: "https://pacman.benhawley.net"
    		}
    	];

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		
    	};

    	return [navigation, external];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src/components/Footer.svelte generated by Svelte v3.18.1 */

    const file$a = "src/components/Footer.svelte";

    function create_fragment$b(ctx) {
    	let footer;
    	let div;
    	let t0;
    	let a;
    	let t2;

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			div = element("div");
    			t0 = text("I built this site to learn Svelte. You can see the ");
    			a = element("a");
    			a.textContent = "source code";
    			t2 = text(".");
    			attr_dev(a, "href", "https://github.com/benhawley7/benhawley.net");
    			add_location(a, file$a, 17, 59, 325);
    			attr_dev(div, "class", "footer-content svelte-1g1q133");
    			add_location(div, file$a, 16, 4, 237);
    			attr_dev(footer, "class", "svelte-1g1q133");
    			add_location(footer, file$a, 15, 0, 224);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, div);
    			append_dev(div, t0);
    			append_dev(div, a);
    			append_dev(div, t2);
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
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.18.1 */
    const file$b = "src/App.svelte";

    function create_fragment$c(ctx) {
    	let t0;
    	let main;
    	let t1;
    	let current;
    	const header = new Header({ $$inline: true });

    	const router = new Router({
    			props: { routes: /*routes*/ ctx[0] },
    			$$inline: true
    		});

    	router.$on("routeLoaded", routeLoaded);
    	const footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(header.$$.fragment);
    			t0 = space();
    			main = element("main");
    			create_component(router.$$.fragment);
    			t1 = space();
    			create_component(footer.$$.fragment);
    			attr_dev(main, "class", "svelte-1s1g07a");
    			add_location(main, file$b, 41, 0, 933);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(header, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			mount_component(router, main, null);
    			insert_dev(target, t1, anchor);
    			mount_component(footer, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(router.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(router.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(header, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(router);
    			if (detaching) detach_dev(t1);
    			destroy_component(footer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function routeLoaded(event) {
    	// eslint-disable-next-line no-console
    	console.info("Caught event routeLoaded", event.detail);
    }

    function instance$9($$self) {
    	const routes = {
    		"/": Home,
    		"/memes": Memes,
    		"/alexa": Alexa,
    		"*": NotFound
    	};

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		
    	};

    	return [routes];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$c.name
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

}());
//# sourceMappingURL=bundle.js.map
