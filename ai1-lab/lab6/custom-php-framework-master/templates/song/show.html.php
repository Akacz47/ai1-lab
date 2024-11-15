<?php

/** @var \App\Model\Song $song */
/** @var \App\Service\Router $router */

$title = "{$song->getSubject()} ({$song->getId()})";
$bodyClass = 'show';

ob_start(); ?>
    <h1><?= $song->getSubject() ?></h1>
    <h3>Publication year: <?= $song->getYear() ?></h3>
    <article>
        <?= $song->getContent();?>
    </article>

    <ul class="action-list">
        <li> <a href="<?= $router->generatePath('song-index') ?>">Back to list</a></li>
        <li><a href="<?= $router->generatePath('song-edit', ['id'=> $song->getId()]) ?>">Edit</a></li>
    </ul>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
