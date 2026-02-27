<?php

// ============================================================
// THEME SUPPORT
// ============================================================
add_action('after_setup_theme', function () {
	add_theme_support('post-thumbnails');
});
// ============================================================
// ACF OPTIONS
// ============================================================
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
// ============================================================
// CPT PLATOS
// ============================================================
add_action('init', function () {
	register_post_type('platos', [
		'labels' => [
		'name'               => 'Platos',
		'singular_name'      => 'Plato',
		'add_new'            => 'Añadir Plato',
		'add_new_item'       => 'Añadir Nuevo Plato',
		'edit_item'          => 'Editar Plato',
		'new_item'           => 'Nuevo Plato',
		'view_item'          => 'Ver Plato',
		'search_items'       => 'Buscar Platos',
		'not_found'          => 'No se encontraron platos',
		'not_found_in_trash' => 'No hay platos en la papelera',
	],
		'public'              => true,
		'show_in_rest'        => true,
		'show_in_graphql'     => true,
		'graphql_single_name' => 'plato',
		'graphql_plural_name' => 'platos',
		'menu_icon'           => 'dashicons-food',
		'menu_position'       => 5,
		'supports'            => ['title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'],
		'has_archive'         => true,
		'rewrite'             => ['slug' => 'platos'],
		'show_in_nav_menus'   => true,
	]);

	register_taxonomy('categoria_plato', ['platos'], [
		'labels' => [
			'name'              => 'Categorias de Platos',
			'singular_name'     => 'Categoria de Plato',
			'search_items'      => 'Buscar categorias',
			'all_items'         => 'Todas las categorias',
			'edit_item'         => 'Editar categoria',
			'update_item'       => 'Actualizar categoria',
			'add_new_item'      => 'Anadir nueva categoria',
			'new_item_name'     => 'Nombre de nueva categoria',
			'menu_name'         => 'Categorias',
		],
		'public'               => true,
		'hierarchical'         => true,
		'show_ui'              => true,
		'show_admin_column'    => true,
		'show_in_rest'         => true,
		'show_in_graphql'      => true,
		'graphql_single_name'  => 'categoriaPlato',
		'graphql_plural_name'  => 'categoriasPlato',
		'rewrite'              => ['slug' => 'categoria-plato'],
	]);
});
