
<template>
	<private-view title="Import data">
		<template #navigation>
			<ai-navigation />
		</template>

		<div class="padding-box">
			<div class="grid">
				<div class="form">
					<div class="field">
						<div class="type-label">Nlu</div>
						<v-textarea v-model="form.nlu" />
					</div>
					<div class="field">
						<div class="type-label">Stories</div>
						<v-textarea v-model="form.stories" />
					</div>
					<div class="field">
						<div class="type-label">Domain</div>
						<v-textarea v-model="form.domain" />
					</div>
					<div class="field">
						<v-button @click="logToConsole">Import</v-button>
					</div>
				</div>

			</div>


		</div>
		<!-- Itemz: {{ items }} -->
		<!--		<v-list>-->
		<!--			<v-list-item v-for="col in collections" :key="col.collection">-->
		<!--				{{ col.collection }}-->
		<!--			</v-list-item>-->
		<!--		</v-list>-->

	</private-view>
</template>

<script  lang="ts">
import { useApi, useStores } from '@directus/extensions-sdk';

import AiNavigation from '../components/navigation.vue';

import { useCollection, useItems, useSync } from '@directus/composables';
import { ComputedRef, Ref, WritableComputedRef, computed, reactive, ref, toRefs, watch } from 'vue';
import { useAliasFields } from '@/composables/use-alias-fields';

export default {
	components: {
		AiNavigation,
	},
	inject: ['api'],
	setup() {
		const { useCollectionsStore } = useStores();
		const collectionsStore = useCollectionsStore();

		// console.log('setup');
		const collection = collectionsStore.getCollection('ai_intent');
		// eslint-disable-next-line no-console
		console.log('COLLECTION', collection);
		// const { info, primaryKeyField, fields, sortField } = useCollection('ai_story');
		// console.log('fields', fields);
		// const { aliasedFields, aliasQuery, aliasedKeys } = useAliasFields(fields, collection);
		// console.log('FIELDS', fields);
		// const fieldsWithRelationalAliased = computed(() => {
		// return Object.values(aliasedFields.value).reduce((acc, value) => {
		// return [...acc, ...value.fields];
		// }, []);
		// });

		// const fields = computed(() => {
		//   return [ref('name')]
		// })

		// const items = useItems(ref('ai_story'), {
		// fields,
		// });
		const myVariable: any = ref(['name']);

		const items = useItems(ref('ai_story'),
			{
				fields: myVariable,
				limit: ref(10),
				sort: computed(() => ['id']),
				page: ref(1),
				filter: ref({}),
				search: ref(null),
			}
			//

		)

		console.log('setup2');

		return { items }

		// const items = useItems('ai_story', {})

		// const { items } = useItems(collection, {
		//     fields: ref(['*']),
		//     limit: ref(1),
		//     sort: ref(null),
		//     search: ref(null),
		//     filter: ref(null),
		//     page: ref(1),
		// });
		// console.log(a + b);
		// try {
		// let items = useItems('ai_story', {
		//     fields: ['id'],
		// });
		//
		// console.log(items);
		//
		// } catch (error) {
		//   console.log(error);
		// }
		//
		// console.log('22222');
		// ...
	},
	// inject: ['api'],
	data() {
		return {
			form: {
				nlu: '',
				stories: '',
				domain: '',
			}
		};
	},
	mounted() {
		// log the system field, so you can see what attributes are available under it
		// remove this line when you're done.
		console.log(this.api);

		// Get a list of all available collections to use with this module
		this.api.get('/collections?limit=-1').then((res) => {
			this.collections = res.data.data;
		});
	},
	methods: {
		logToConsole: async function () {
			// console.log(this.form);
			// console.log('hello');

			// console.log('LLLLL');
			const res = await this.api.post('/ai/', {
				data: this.form,
			});
			console.log(res.data);
			// eslint-disable-next-line no-console
			// console.log(this.collections);

		},
	},
};
</script>

<style lang="scss" scoped>
@import '@/styles/mixins/form-grid';
@import '@/styles/mixins/no-wrap';

.form {
	--form-vertical-gap: 32px;
	--form-horizontal-gap: 32px;
	@include form-grid;
}

.settings {
	padding: var(--content-padding);
	padding-bottom: var(--content-padding-bottom);
}

.type-label {
	margin-bottom: 8px;

	@include no-wrap;
}

.padding-box {
	padding: var(--content-padding);
	padding-top: 0;
}

v-divider {
	margin: 48px 0;
}

.v-list {
	--v-list-item-content-font-family: var(--family-monospace);
}

.v-notice {
	margin-bottom: 36px;
}

.relational-triggers {
	--form-horizontal-gap: 12px;
	--form-vertical-gap: 24px;

	@include form-grid;

	.v-divider {
		margin-top: 48px;
		margin-bottom: 0;
	}
}
</style>

