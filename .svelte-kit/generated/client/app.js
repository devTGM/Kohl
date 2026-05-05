export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16'),
	() => import('./nodes/17'),
	() => import('./nodes/18'),
	() => import('./nodes/19')
];

export const server_loads = [];

export const dictionary = {
		"/(web)": [7,[4]],
		"/(web)/about": [8,[4]],
		"/(web)/blog": [~9,[4]],
		"/(web)/blog/[handle]": [~10,[4]],
		"/(web)/contact": [~11,[4]],
		"/(landing)/landing": [5,[2]],
		"/(landing)/landing/home": [6,[2,3]],
		"/(web)/playground": [12,[4]],
		"/(web)/privacy": [13,[4]],
		"/(web)/refund": [14,[4]],
		"/(web)/science": [15,[4]],
		"/(web)/shipping": [16,[4]],
		"/(web)/shop": [~17,[4]],
		"/(web)/shop/[slug]": [~18,[4]],
		"/(web)/terms": [19,[4]]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
	
	reroute: (() => {}),
	transport: {}
};

export const decoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.decode]));
export const encoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.encode]));

export const hash = false;

export const decode = (type, value) => decoders[type](value);

export { default as root } from '../root.js';