<?php
// required file
require('../../bootstrap.inc.php');

// check if user is logged in
$auth->check();

$category = new Category();

$items = $category->getCategoriesByUser($_SESSION['UID']);

// check if categories were returned
if (!$items) {
    (new Response([
        'error' => true,
        'message' => 'Keine Kategorien gefunden.'
    ]))->send(HttpCode::NOT_FOUND);
}

foreach($items as $key => $mainCategory) {
    // if subcategory
    if($mainCategory['parent_categoryID']) {
        continue;
    }
    $categoryID = $mainCategory['CAID'];
    foreach($items as $key2 => $subcategory) {
        // if not subcategory of main category
        if($subcategory['parent_categoryID'] != $categoryID) {
            continue;
        }
        // add subcategories number of tasks to main category
        $mainCategory['numberOfTasks'] += $subcategory['numberOfTasks'];
        $mainCategory['numberOfFinished'] += $subcategory['numberOfFinished'];
    }
    $items[$key] = $mainCategory;
}

// if everything was successful
(new Response([
    'error' => false,
    'data' => $items
]))->send(HttpCode::OKAY);