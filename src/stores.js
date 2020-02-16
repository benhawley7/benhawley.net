import { writable } from 'svelte/store';

export const chartsReady = writable(0);
export const mapsReady = writable(0);