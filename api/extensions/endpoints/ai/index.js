import { createError } from '@directus/errors';
import yaml from 'js-yaml';
import fs from 'fs';

const MyExtensionError = createError('MY_EXTENSION_ERROR', 'Something went wrong...', 500);

export default (router, { services }) => {
	const { ItemsService, FilesService } = services;

	router.get('/', (req, res, next) => {
		const recipeService = new ItemsService('ai_intent', { schema: req.schema, accountability: req.accountability });

		recipeService
			.readByQuery({ sort: ['name'], fields: ['*'] })
			.then((results) => res.json(results))
			.catch((error) => {
				console.error(error);
				return next(new MyExtensionError());
			});
	});
	router.post('/', async (req, res, next) => {
		try {
			const filesService = new FilesService({
				schema: req.schema,
				accountability: req.accountability,
			});

			console.log(process.cwd());

			const intentService = new ItemsService('ai_intent', {
				schema: req.schema,
				accountability: req.accountability
			});

			const storyService = new ItemsService('ai_story', {
				schema: req.schema,
				accountability: req.accountability
			});


			// fill intents
			const intents = await intentService.readByQuery({
				fields: ['rel_ai_question.text', 'name', 'rel_ai_answer.text'],
				limit: -1,
				sort: ['name']
			});

			const intentsList = [];
			const responses = {};

			const intentData = {
				"version": '3.1',
				"nlu": []
			};
			for (const intent of intents) {
				intentsList.push(intent.name);
				if (intent.rel_ai_answer.length) {
					responses['utter_' + intent.name] = [];
					for (const answer of intent.rel_ai_answer) {
						responses['utter_' + intent.name].push({ text: answer.text.trim() });
					}
				}
				if (intent.rel_ai_question.length) {
					intentData.nlu.push({
						"intent": intent.name,
						"examples": intent.rel_ai_question.map((q) => '- ' + q.text.trim()).join('\n') + '\n'
					});
				}
			}
			const intentYaml = yaml.dump(intentData, { lineWidth: -1 });
			fs.writeFileSync(process.cwd() + '/media/nlu.yml', intentYaml);


			const stories = await storyService.readByQuery({
				fields: ['name', 'rel_ai_story_ai_intent.intent_type', 'rel_ai_story_ai_intent.ai_intent_id.name'], limit: -1,
			}
			);
			const storyData = {
				"version": '3.1',
				"stories": []
			};

			for (const story of stories) {
				const steps = [];
				for (const intent of story.rel_ai_story_ai_intent) {
					if (intent.intent_type === 'question') {
						steps.push({ "intent": intent.ai_intent_id.name });
					} else if (intent.intent_type === 'answer') {
						steps.push({ "action": "utter_" + intent.ai_intent_id.name });
					} else if (intent.intent_type === 'question-answer') {
						steps.push({ "intent": intent.ai_intent_id.name });
						steps.push({ "action": "utter_" + intent.ai_intent_id.name });
					} else if (intent.intent_type === 'answer-question') {
						steps.push({ "action": "utter_" + intent.ai_intent_id.name });
						steps.push({ "intent": intent.ai_intent_id.name });
					}
				}
				storyData.stories.push({
					"story": story.name,
					"steps": steps
				});
				// console.log(JSON.stringify(story), '\n');
			}
			const storyYaml = yaml.dump(storyData, { lineWidth: -1 });
			fs.writeFileSync(process.cwd() + '/media/stories.yml', storyYaml);

			const domainData = {
				"version": '3.1',
				"intents": intentsList,
				"responses": responses,
				"session_config": {
					"session_expiration_time": 60,
					"carry_over_slots_to_new_session": true
				},
			};

			const domainYaml = yaml.dump(domainData, { lineWidth: -1 });
			fs.writeFileSync(process.cwd() + '/media/domain.yml', domainYaml);

			let fileIds = {};

			for (const fileName of ['domain.yml', 'nlu.yml', 'stories.yml']) {
				let stream = fs.createReadStream(process.cwd() + `/media/${fileName}`);

				// text/yaml
				fileIds[fileName] = await filesService.uploadOne(
					stream,
					{
						storage: 'local',
						title: fileName,
						filename_download: fileName,
						filename_disk: fileName,
						type: 'text/plain'
					},
				)

			}

			res.json({ success: true, files: fileIds })
		}
		catch (error) {
			console.error(error);
			return next(new MyExtensionError());
		}

	})
};
