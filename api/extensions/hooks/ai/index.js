import axios from 'axios';
import yaml from 'js-yaml';
import { createError } from '@directus/errors';

const MyExtensionError = createError('MY_EXTENSION_ERROR', 'Something went wrong...', 500);
function trim(str, ch) {
	var start = 0,
		end = str.length;

	while (start < end && str[start] === ch)
		++start;

	while (end > start && str[end - 1] === ch)
		--end;

	return (start > 0 || end < str.length) ? str.substring(start, end) : str;
}

export default async ({ filter, action }, { services, database, getSchema }) => {
	const { ItemsService } = services;

	// action('items.update', async ({ collection, payload }, { schema, database, accountability }) => {
	filter('items.update', async (input, { collection }, { schema, database, accountability }) => {
		if (collection !== 'ai_yml') return input;

		const svcIntents = new ItemsService('ai_intent', {
			schema,
			accountability
			// accountability: { role: 'admin', admin: true },
		});

		const svcAnswers = new ItemsService('ai_answer', {
			schema,
			accountability
		});

		const svcQuestions = new ItemsService('ai_question', {
			schema,
			accountability
		});

		const svcStories = new ItemsService('ai_story', {
			schema,
			accountability
		});

		const svcAiStoryIntent = new ItemsService('ai_story_ai_intent', {
			schema,
			accountability
		});

		if (input.domain !== undefined) {
			let yamlData = yaml.load(input.domain);
			console.log('yamlData', yamlData);
			let pk = null;

			for (let [key, value] of Object.entries(yamlData.responses)) {
				console.log(`${key}: ${value}`);
				key = key.substring(6);

				let intents = await svcIntents.readByQuery({ filter: { name: key }, limit: 1 });

				if (intents.length > 0) {
					pk = intents[0].id;
				} else {
					pk = await svcIntents.createOne({ name: key });
				}

				for (const item of value) {
					let records = await svcAnswers.readByQuery({ filter: { text: item.text }, limit: 1 });
					if (records.length === 0) {
						await svcAnswers.createOne({ text: item.text, rel_ai_intent: pk });
					}
				}
			}
		}
		if (input.nlu !== undefined) {
			let yamlData = yaml.load(input.nlu);
			let pk = null;

			for (const item of yamlData.nlu) {
				let intents = await svcIntents.readByQuery({ filter: { name: item.intent }, limit: 1 });

				if (intents.length > 0) {
					pk = intents[0].id;
				} else {
					pk = await svcIntents.createOne({ name: item.intent });
				}

				for (let example of item.examples.split('\n')) {
					example = example.replace('-', '').trim();
					let records = await svcQuestions.readByQuery({ filter: { text: example }, limit: 1 });

					if (records.length == 0) {
						await svcQuestions.createOne({ text: example, rel_ai_intent: pk });
					}
				}
			}
		}

		if (input.stories !== undefined) {
			let yamlData = yaml.load(input.stories);
			let storyId = null;

			for (const ymlStory of yamlData.stories) {
				await svcStories.deleteByQuery({ filter: { name: ymlStory.story } });
				storyId = await svcStories.createOne({ name: ymlStory.story });

				for (const step of ymlStory.steps) {
					let name = null;
					let intentType = null;

					if (step.intent !== undefined) {
						name = step.intent;
						intentType = 'question';
					} else if (step.action !== undefined) {
						name = step.action.substring(6);
						intentType = 'answer';
					}

					const intents = await svcIntents.readByQuery({ filter: { name }, limit: 1 });
					if (intents.length == 0) {
						throw new MyExtensionError('Intent not found');
					}

					await svcAiStoryIntent.createOne({
						ai_story_id: storyId,
						ai_intent_id: intents[0].id,
						intent_type: intentType
					});
				}
			}
		}

		return input;
	});

};
