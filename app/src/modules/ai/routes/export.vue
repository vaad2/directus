
<template>
	<private-view title="Export data">
		<template #navigation>
			<ai-navigation />
		</template>
		<template #title-outer:prepend>
			<v-button class="header-icon" rounded icon exact disabled>
				<v-icon name="list_alt" />
			</v-button>
		</template>

		<template #actions>

		</template>

		<div class="padding-box">
			<div class="grid">
				<div class="form">
					<div class="field">
						<v-button @click="dataExport">Export</v-button>
					</div>
				</div>
			</div>
		</div>
	</private-view>
</template>

<script lang="ts">
import AiNavigation from '../components/navigation.vue';

export default {
	components: {
		AiNavigation,
	},
	inject: ['api'],
	setup() {
		// const api = useApi();
		//

		// api.get('some').then((res) => {

		// 	// eslint-disable-next-line no-console
		// 	console.log("RES", res);
		// });

		// const { useCollectionsStore } = useStores();
		// const collectionsStore = useCollectionsStore();

		// // console.log('setup');
		// const collection = collectionsStore.getCollection('ai_intent');
		// // eslint-disable-next-line no-console
		// console.log('COLLECTION', collection);
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
		// const myVariable: any = ref(['name']);

		// const items = useItems(ref('ai_story'),
		// 	{
		// 		fields: myVariable,
		// 		limit: ref(10),
		// 		sort: computed(() => ['id']),
		// 		page: ref(1),
		// 		filter: ref({}),
		// 		search: ref(null),
		// 	}
		// 	//

		// )

		// console.log('setup2');

		return {  }

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
			collections: null,
			myVariable: null,
			fields: [
				{
					name: 'nlu', label: 'NLU', type: 'text', required: true, placeholder: 'NLU', hint: 'NLU', default: '123',
					meta: {
						hidden: false,
					}
				},
			],
			form: {
				nlu: ''
			}
		};
	},
	mounted() {
		// log the system field, so you can see what attributes are available under it
		// remove this line when you're done.

		// Get a list of all available collections to use with this module
		// this.api.get('/collections?limit=-1').then((res) => {
			// this.collections = res.data.data;
		// });
	},
	methods: {
		dataExport: async function () {
			const res = await this.api.post('/ai/', {
				data: {},
			});

			// eslint-disable-next-line no-console
			console.log(res.data);
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

