// @ts-check
import { defineConfig, createNotesQuery } from './.app/app-config.js';
import { defineTranslations } from './.app/app-translations.js';

export default defineConfig({
	title: 'picoflow.io',
	description: 'Hands-on guide to building Picoflow’s BasicFlow, step by step.',
	editThisNote: {
		url: 'https://github.com/uncenter/learn-eleventy/edit/{{branch}}/{{file}}',
	},
	notes: {
		pathPrefix: '/lesson',
	},
	sidebar: {
		links: [
			{
				url: 'https://www.picoflow.io',
				label: 'Home',
				icon: 'home',
			},
			{
				url: 'https://www.linkedin.com/company/picoflow-io',
				label: 'LinkedIn',
				icon: 'linkedin',
			},
		],
		sections: [
			{
				label: 'Lessons',
				groups: [
					{
						query: createNotesQuery({
							pattern: '^/[^/]+$',
						}),
					},
				],
			},
		],
	},
	panel: {
		incomingLinks: false,
		outgoingLinks: false,
		externalLinks: false,
	},
});

export const translations = defineTranslations({
	lang: 'en',
	partial: true,
	translations: {
		'search.popover.placeholder': 'Search for lessons by title and content.',
	},
});
