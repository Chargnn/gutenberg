<?php
/**
 * Temporary compatibility shims for features present in Gutenberg.
 *
 * @package gutenberg
 */

if ( ! function_exists( 'build_comment_query_vars_from_block' ) ) {
	/**
	 * Helper function that constructs a comment query vars array from the passed block properties.
	 *
	 * It's used with the Comment Query Loop inner blocks.
	 *
	 * @param WP_Block $block Block instance.
	 *
	 * @return array Returns the comment query parameters to use with the WP_Comment_Query constructor.
	 */
	function build_comment_query_vars_from_block( $block ) {

		$comment_args = array(
			'orderby'                   => 'comment_date_gmt',
			'status'                    => 'approve',
			'no_found_rows'             => false,
			'update_comment_meta_cache' => false, // We lazy-load comment meta for performance.
		);

		if ( ! empty( $block->context['postId'] ) ) {
			$comment_args['post_id'] = (int) $block->context['postId'];
		}

		if ( get_option( 'thread_comments' ) ) {
			$comment_args['hierarchical'] = 'threaded';
		} else {
			$comment_args['hierarchical'] = false;
		}

		// With the fallback option enabled. By default the render won't coincide with the editor.
		if ( get_option( 'comment_order' ) ) {
			$comment_args['order'] = get_option( 'comment_order' );
		}

		$per_page = ! empty( $block->context['comments/perPage'] ) ? (int) $block->context['comments/perPage'] : 0;
		if ( 0 === $per_page && get_option( 'page_comments' ) ) {
			$per_page = (int) get_query_var( 'comments_per_page' );
			if ( 0 === $per_page ) {
				$per_page = (int) get_option( 'comments_per_page' );
			}
		}
		if ( $per_page > 0 ) {
			$comment_args['number'] = $per_page;
			$page                   = (int) get_query_var( 'cpage' );

			if ( $page ) {
				$comment_args['offset'] = ( $page - 1 ) * $per_page;
			} elseif ( 'oldest' === get_option( 'default_comments_page' ) ) {
				$comment_args['offset'] = 0;
			}
		}

		$order = ! empty( $block->context['comments/order'] ) ? $block->context['comments/order'] : null;
		if ( $order ) {
			$comment_args['order'] = $order;
		}

		return $comment_args;
	}
}
