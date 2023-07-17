import {defineModule} from '@directus/utils';
// import AiImport from './routes/import.vue';
import AiExport from './routes/export.vue';

export default defineModule({
	id: 'ai',
	name: '$t:ai-management',
	icon: 'computer',
	color: 'var(--primary)',
	preRegisterCheck: (user) => {
		return user.role.admin_access === true;
	},
	routes: [
		{
			name: 'export-redirect',
			path: '',
			redirect: '/ai/export',
		},
		// {
		// 	name: 'Import',
		// 	path: 'import',
		// 	component: AiImport,
		// },
		{
			name: 'Export',
			path: 'export',
			component: AiExport,
		},
	]
});
