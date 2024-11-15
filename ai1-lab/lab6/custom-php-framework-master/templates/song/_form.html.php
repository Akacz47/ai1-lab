<?php
/** @var $song ?\App\Model\Song */
?>

<div class="form-group">
    <label for="subject">Subject</label>
    <input type="text" id="subject" name="song[subject]" value="<?= $song ? $song->getSubject() : '' ?>">
</div>

<div class="form-group">
    <label for="year">Year</label>
    <input type="number" id="year" name="song[year]" value="<?= $song ? $song->getYear() : '' ?>">
</div>

<div class="form-group">
    <label for="content">Content</label>
    <textarea id="content" name="song[content]"><?= $song? $song->getContent() : '' ?></textarea>
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>
