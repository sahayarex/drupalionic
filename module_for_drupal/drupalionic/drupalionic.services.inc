<?php

/**
 * @file
 * DrupalGap's implementation of Hooks provided by Services
 * for the definition of new service resources.
 */

 /**
  * Defines function signatures for resources available to services.
  */
function drupalionic_services_resources() {
  $resources = array(
    'drupalionic_resources' => array(
      'actions' => array(
        'get_nodes' => array(
          'help' => t('Get all nodes'),
          'file' => array(
            'type' => 'inc',
            'module' => 'drupalionic',
            'name' => 'drupalionic.resource',
          ),
          'callback' => 'drupalionic_get_nodes',
          'args' => array(
              array(
              'name'         => 'nodeData',
              'type'         => 'array',
              'description'  => t('node data.'),
              'source'       => 'data',
              'optional'     => FALSE,
            ),
          ),
          'access callback' => '_drupalionic_resource_access',
          'access callback file' => array(
            'type' => 'inc',
            'module' => 'drupalionic',
            'name' => 'drupalionic.resource',
          ),
          'access arguments' => array('access user profiles'),
          'access arguments append' => TRUE,
        ),       
        'custom_node_save' => array(
          'help' => t('Save node custom'),
          'file' => array(
            'type' => 'inc',
            'module' => 'drupalionic',
            'name' => 'drupalionic.resource',
          ),
          'callback' => 'drupalionic_custom_node_save',
          'args' => array(
              array(
              'name'         => 'nodeData',
              'type'         => 'array',
              'description'  => t('node data to save.'),
              'source'       => 'data',
              'optional'     => FALSE,
            ),
          ),
          'access callback' => '_drupalionic_resource_access',
          'access callback file' => array(
            'type' => 'inc',
            'module' => 'drupalionic',
            'name' => 'drupalionic.resource',
          ),
          'access arguments' => array('access user profiles'),
          'access arguments append' => TRUE,
        ),
        'custom_node_delete' => array(
          'help' => t('Delete node'),
          'file' => array(
            'type' => 'inc',
            'module' => 'drupalionic',
            'name' => 'drupalionic.resource',
          ),
          'callback' => 'drupalionic_custom_node_delete',
          'args' => array(
              array(
              'name'         => 'nid',
              'type'         => 'int',
              'description'  => t(' nid to pass.'),
              'source'       => array('data' => 'nid'),
              'optional'     => FALSE,
            ),
          ),
          'access callback' => '_drupalionic_resource_access',
          'access callback file' => array(
            'type' => 'inc',
            'module' => 'drupalionic',
            'name' => 'drupalionic.resource',
          ),
          'access arguments' => array('access user profiles'),
          'access arguments append' => TRUE,
        ),
      ),
    ),
  );
  return $resources;
}

