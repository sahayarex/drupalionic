<?php
/**
 * Get nodes from database and return them.
 *
 * @param int $nodeData
 *   Its an array with values for nodes.
 *
 * @return array
 *   We return nodes.
 */
function drupalionic_get_nodes($nodeData) {
  $nodes = array();
  //If user wants only one node they can pass nid to get the node.
  if($nodeData['nid']) {
    $node = node_load($nodeData['nid']);
    $nodes['nodes'][$node->nid] = array(
      'nid' => $node->nid,
      'title' => $node->title,
      'body' => $node->body['und'][0]['value'],
      //You can add you custom fields in this array.
    );
    return $nodes;
  } 

  //If you want nodes of a content type, then you have to pass type parameter.
  if($nodeData['type']) {
    $query = db_select('node', 'n');
    $query->fields('n',array('nid'));
    $query->condition('n.type', $nodeData["type"]);
    $query->orderBy('n.nid', 'DESC');
    $result = $query->execute();
    foreach($result as $key => $record) {
      $node = node_load($record->nid);
      $nodes['nodes'][$node->nid] = array(
        'nid' => $node->nid,
        'title' => $node->title,
        'body' => $node->body['und'][0]['value'],
        //You can add you custom fields in this array.
      );
      $images = array();
      if(count($node->field_di_image['und']) > 0) {
        foreach ($node->field_di_image['und'] as $key => $image) {
          $images[]['image'] = file_create_url($image['uri']);
        }
      }
      if($images) {
        $nodes['nodes'][$node->nid]['images'] = $images;
      }
    }
  }
  return $nodes;
}

/**
 * Gets an array of data for the creation of new node.
 *
 * @param int $data
 *   Its an array with values for new node, using these valuse we create new node.
 *
 * @return array
 *   We return the nid of newly created node.
 */
function drupalionic_custom_node_save($nodeData) {
  variable_set('my-custom-data', $nodeData);
  //Creation of a new node
  $node = new stdClass();
  $node->title = $nodeData['title'];
  $node->type = $nodeData['type'];
  $node->language = LANGUAGE_NONE;
  $node->uid = $nodeData['uid'];
  //custom fields of the node
  $node->body['und'][0]['value'] = $nodeData['body'];
  if($nodeData['photos']) {
    $node->field_di_image['und'] = $nodeData['photos'];
  }

  $node = node_submit($node);
  node_save($node);
  return array('nid' => $node->nid);
}

/**
 * Deletes the node of the given node id.
 *
 * @param int $nid
 *   Its an integer used to delete the node.
 *
 * @return boolean
 *   Status of node delete
 */
function drupalionic_custom_node_delete($nid) {
  return node_delete($nid);
}

/**
 * Determines whether the current user can access a drupalgap resource.
 *
 * @param string $op
 *   String indicating which operation to check access for.
 * @param array $args
 *   Array arguments passed through from the original request.
 *
 * @return boolean
 *   Boolean indicating whether or not the user has access to the resource.
 *
 * @see node_access()
 */
function _drupalionic_resource_access($op = 'view', $args = array()) {
  return TRUE;
}
