<?php

if (function_exists('acf_add_options_page')) {
	// Página principal de opciones con nombres GraphQL únicos.
	acf_add_options_page(array(
		'page_title'         => 'Opciones del Tema',
		'menu_title'         => 'Opciones del Tema',
		'menu_slug'          => 'opciones-tema',
		'capability'         => 'edit_posts',
		'icon_url'           => 'dashicons-admin-generic',
		'position'           => 60,
		'redirect'           => false,
		'show_in_graphql'    => true,
		'graphql_field_name' => 'themeOptions',
		'graphql_type_name'  => 'ThemeOptionsPage',
	));

	// Subpágina opcional con identidad GraphQL diferente.
	acf_add_options_sub_page(array(
		'page_title'         => 'Configuración General',
		'menu_title'         => 'General',
		'menu_slug'          => 'configuracion-general',
		'parent_slug'        => 'opciones-tema',
		'show_in_graphql'    => true,
		'graphql_field_name' => 'generalSettings',
		'graphql_type_name'  => 'GeneralSettingsPage',
	));
}