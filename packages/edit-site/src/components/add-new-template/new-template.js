/**
 * External dependencies
 */
import { filter, includes, map } from 'lodash';

/**
 * WordPress dependencies
 */
import {
	DropdownMenu,
	MenuGroup,
	MenuItem,
	NavigableMenu,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { store as editorStore } from '@wordpress/editor';
import { addQueryArgs } from '@wordpress/url';

const DEFAULT_TEMPLATE_SLUGS = [
	'front-page',
	'single-post',
	'page',
	'archive',
	'search',
	'404',
	'index',
];

export default function NewTemplate( { postType } ) {
	const { templates, defaultTemplateTypes, theme } = useSelect(
		( select ) => ( {
			templates: select( coreStore ).getEntityRecords(
				'postType',
				'wp_template',
				{ per_page: -1 }
			),
			defaultTemplateTypes: select(
				editorStore
			).__experimentalGetDefaultTemplateTypes(),
			theme: select( coreStore ).getCurrentTheme(),
		} ),
		[]
	);

	const existingTemplateSlugs = map( templates, 'slug' );

	const missingTemplates = filter(
		defaultTemplateTypes,
		( template ) =>
			includes( DEFAULT_TEMPLATE_SLUGS, template.slug ) &&
			! includes( existingTemplateSlugs, template.slug )
	);

	if ( ! missingTemplates.length ) {
		return null;
	}

	return (
		<DropdownMenu
			className="edit-site-new-template-dropdown"
			icon={ null }
			text={ postType.labels.add_new }
			label={ postType.labels.add_new_item }
			popoverProps={ {
				noArrow: false,
			} }
			toggleProps={ {
				variant: 'primary',
			} }
		>
			{ () => (
				<NavigableMenu className="edit-site-new-template-dropdown__popover">
					<MenuGroup label={ postType.labels.add_new_item }>
						{ map(
							missingTemplates,
							( { title, description, slug } ) => (
								<MenuItem
									href={ addQueryArgs( window.location.href, {
										postId:
											theme.stylesheet +
											'//' +
											slug.toString(),
										postType: 'wp_template',
									} ) }
									info={ description }
									key={ slug }
								>
									{ title }
								</MenuItem>
							)
						) }
					</MenuGroup>
				</NavigableMenu>
			) }
		</DropdownMenu>
	);
}
