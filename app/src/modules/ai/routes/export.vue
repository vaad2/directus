
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
				<div v-if="processing == 1">
					<v-notice type="info">Processing</v-notice>
				</div>
				<div v-else-if="processing == 2">
					<v-notice type="info">Processed</v-notice>
					<div v-for="(item, key) in files" :key="key" class="v-text-overflow name public">
						<a :href="'/assets/'+ item + '?download&access_token=' + token" target="_blank" :download="key">{{ key }}</a>
					</div>
				</div>
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
import { getToken } from '@/api';

export default {
	components: {
		AiNavigation,
	},
	inject: ['api'],
	data() {
		return {
			token: '',
			files: [],
			processing: 0,
		};
	},
	methods: {
		dataExport: async function () {
			this.processing = 1;
			this.token = getToken();

			const res = await this.api.post('/ai/');

			if (res.data.success) {
				this.files = res.data.files;
			}

			this.processing = 2;
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

