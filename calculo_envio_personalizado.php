<?php 
/*
Plugin Name: Calculo envio personalizado
Plugin URI: http://rewweb.cl
Description: Calculo envio personalizado regiones/comunas de Chile. woocommerce
Version: 1.0.0
Author: Rewweb
Author URI: http://rewweb.cl
*/


/**
 * verificar si woocommerce esta activado
 */
$active_plugins = apply_filters( 'active_plugins', get_option( 'active_plugins' ) );
if ( in_array( 'woocommerce/woocommerce.php', $active_plugins) ) {

 add_filter( 'woocommerce_shipping_methods', 'agregar_calculo_envio_personalizado_method' );
 function agregar_calculo_envio_personalizado_method( $methods ) {
   $methods[] = 'WC_calculo_envio_personalizado';
   return $methods;
 }

 add_action( 'woocommerce_shipping_init', 'calculo_envio_personalizado_init' );
 function calculo_envio_personalizado_init(){
   require_once 'class-calculo_envio_personalizado.php';

 }

    function cargar_js(){
      wp_register_script('calculo-envio-personalizado', plugins_url('/calculo_envio_personalizado.js', __FILE__), array('jquery'),'1.0.3', true); 

      $js_dir = array( 'jsUrl' => plugins_url('', __FILE__));
      wp_localize_script( 'calculo-envio-personalizado', 'jsVars', $js_dir );

      wp_enqueue_script('calculo-envio-personalizado');  
      }
  
    add_action('wp_enqueue_scripts', 'cargar_js');

  function paises($paises){
    $paises = array();
    $paises["CL"] = 'Chile';
    return $paises;
  }

  function cambio_campos_checkout( $fields ) {

    $fields['billing']['billing_city']['placeholder'] = 'Selecciona una Comuna';
    $fields['billing']['billing_city']['label'] = 'Comuna';

    return $fields;
  }

  add_filter('woocommerce_checkout_fields' , 'cambio_campos_checkout');
  add_filter('woocommerce_countries', 'paises',10,1);

  add_filter( 'woocommerce_shipping_calculator_enable_city', '__return_true' );
  add_filter( 'woocommerce_shipping_calculator_enable_postcode', '__return_false' );
}