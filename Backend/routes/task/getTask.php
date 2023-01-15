<?php
/**
 * @var Auth $auth
 */
// required file
require('../../bootstrap.inc.php');

// check if user is logged in
$auth->check();

$task = new Task();
$item = $task->getTask($_GET['TAID']);

// check if task was returned
if (!$item) {
    (new Response([
        'error' => true,
        'message' => 'Task wurde nicht gefunden.'
    ]))->send(HttpCode::NOT_FOUND);
}

// check if user is allowed to get task
if ($item['created_by'] !== $_SESSION['UID']) {
    (new Response([
        'error' => true,
        'message' => 'Der User darf diesen Task nicht ansehen.'
    ]))->send(HttpCode::FORBIDDEN);
}

$item['notes'] = str_replace("\n", "<br/>", $item['notes']);
$item['deadline'] = date('c', strtotime($item['deadline']));

// if the category of the task HAS a parent category
if ($item['parent_categoryID'] !== null) {
    (new Response([
        'error' => false,
        'data' => [
            'TAID' => $item['TAID'],
            'task_name' => $item['task_name'],
            'notes' => $item['notes'],
            'deadline' => $item['deadline'],
            'categoryID' => $item['parent_categoryID'],
            'subcategoryID' => $item['categoryID'],
            'statusID' => $item['statusID'],
            'expense' => $item['expense'],
            'stress_factor' => $item['stress_factor'],
            'created_date' => $item['created_date'],
            'updated_date' => $item['updated_date']
        ]
    ]))->send(HttpCode::OKAY);
}

// if the category of the task DOESN'T HAVE a parent category
(new Response([
    'error' => false,
    'data' => $item
]))->send(HttpCode::OKAY);