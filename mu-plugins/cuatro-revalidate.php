<?php
/**
 * Plugin Name: Cuatro Revalidate Hook
 * Description: Revalida Next.js cuando se publica/actualiza/elimina contenido (post y platos).
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) {
	exit;
}

if (!defined('CUATRO_NEXT_REVALIDATE_URL')) {
	define('CUATRO_NEXT_REVALIDATE_URL', 'https://www.cuatrobistro.com/api/revalidate');
}

if (!defined('CUATRO_NEXT_REVALIDATE_SECRET')) {
	define('CUATRO_NEXT_REVALIDATE_SECRET', 'REEMPLAZAR_CON_SECRET_DE_VERCEL');
}

function cuatro_send_revalidate($payload = array()) {
	$url = add_query_arg(
		array('secret' => CUATRO_NEXT_REVALIDATE_SECRET),
		CUATRO_NEXT_REVALIDATE_URL
	);

	$args = array(
		'method'   => 'POST',
		'timeout'  => 3,
		'blocking' => false,
		'headers'  => array('Content-Type' => 'application/json'),
		'body'     => wp_json_encode($payload),
	);

	wp_remote_post($url, $args);
}

function cuatro_should_skip_post($post) {
	if (!$post || !is_object($post)) return true;
	if (wp_is_post_revision($post->ID)) return true;
	if (wp_is_post_autosave($post->ID)) return true;
	return false;
}

function cuatro_get_post_uri($post_id) {
	$uri = get_page_uri($post_id);
	if (!$uri || !is_string($uri)) return '';
	return '/' . ltrim($uri, '/');
}

/**
 * Publicación inicial o cambio de estado para Blog (post).
 */
add_action('transition_post_status', function($new_status, $old_status, $post) {
	if (cuatro_should_skip_post($post)) return;
	if ($post->post_type !== 'post') return;

	// Solo nos importa cuando el post queda publicado.
	if ($new_status !== 'publish') return;

	$slug = $post->post_name;
	if (!$slug) return;

	cuatro_send_revalidate(array(
		'postType' => 'post',
		'slug'  => $slug,
		'event' => ($old_status === 'publish') ? 'updated' : 'published',
	));
}, 10, 3);

/**
 * Publicación/edición de páginas (ej: /nosotros).
 */
add_action('save_post_page', function($post_id, $post, $update) {
	if (cuatro_should_skip_post($post)) return;
	if ($post->post_status !== 'publish') return;

	$uri = cuatro_get_post_uri($post_id);
	if (!$uri) return;

	cuatro_send_revalidate(array(
		'postType' => 'page',
		'path'     => $uri,
		'slug'     => $post->post_name,
		'event'    => $update ? 'updated' : 'published',
	));
}, 10, 3);

/**
 * Publicación/edición de CPT platos.
 */
add_action('save_post_platos', function($post_id, $post, $update) {
	if (cuatro_should_skip_post($post)) return;
	if ($post->post_status !== 'publish') return;
	if (empty($post->post_name)) return;

	cuatro_send_revalidate(array(
		'postType' => 'platos',
		'slug'     => $post->post_name,
		'event'    => $update ? 'updated' : 'published',
	));
}, 10, 3);

/**
 * Cambio de slug para post o platos.
 */
add_action('post_updated', function($post_id, $post_after, $post_before) {
	if (cuatro_should_skip_post($post_after)) return;
	if (!in_array($post_after->post_type, array('post', 'platos', 'page'), true)) return;
	if ($post_after->post_status !== 'publish') return;

	$new_slug = $post_after->post_name;
	$old_slug = $post_before && isset($post_before->post_name) ? $post_before->post_name : null;
	$new_uri = $post_after->post_type === 'page' ? cuatro_get_post_uri($post_id) : null;
	$old_uri = null;

	if ($post_after->post_type === 'page' && $post_before && isset($post_before->post_name)) {
		$old_uri = '/' . ltrim($post_before->post_name, '/');
	}

	$payload = array(
		'postType' => $post_after->post_type,
		'slug'     => $new_slug,
		'event'    => 'slug_updated',
	);

	if ($old_slug && $old_slug !== $new_slug) {
		$payload['oldSlug'] = $old_slug;
	}

	if ($new_uri) {
		$payload['path'] = $new_uri;
	}

	if ($old_uri && $old_uri !== $new_uri) {
		$payload['oldPath'] = $old_uri;
	}

	cuatro_send_revalidate($payload);
}, 10, 3);

/**
 * Eliminación de post o platos.
 */
add_action('before_delete_post', function($post_id) {
	$post = get_post($post_id);
	if (cuatro_should_skip_post($post)) return;
	if (!in_array($post->post_type, array('post', 'platos', 'page'), true)) return;

	if ($post->post_status === 'publish' && !empty($post->post_name)) {
		$payload = array(
			'postType' => $post->post_type,
			'slug'     => $post->post_name,
			'event'    => 'deleted',
		);

		if ($post->post_type === 'page') {
			$uri = cuatro_get_post_uri($post_id);
			if ($uri) {
				$payload['path'] = $uri;
			}
		}

		cuatro_send_revalidate(array(
			'postType' => $payload['postType'],
			'slug'     => $payload['slug'],
			'event'    => $payload['event'],
			'path'     => isset($payload['path']) ? $payload['path'] : null,
		));
	}
}, 10, 1);