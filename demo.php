<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>outdent.js: remove extraneous indentation from a multiline string</title>

<style>
<?php include('demo-ui/examples.css'); ?>
</style>

<script>
<?php include('outdent.js'); ?>
<?php include('demo-ui/examples.js'); ?>
</script>

</head>

<body onload="init()" class="isHighlighted">

<h1><a href="outdent.js">outdent.js</a></h1>
<p>
  Detect and remove extraneous leading whitespace from multiline strings.<br>
  Only tested in latest Firefox, Safari and Chrome (August 2014).<br>
  Fair warning: this is experimental, and might have subpar performance.
</p>

<h2>Examples</h2>

<p>
  All examples are dynamic: modify the source on the left and see results on the right.
  Use the form at the bottom to modify options passed to the function.
</p>

<form class="outdent-options">
  <!--<button type="button" class="highlight-toggle"
    onclick="document.body.classList.toggle('isHighlighted')">
    Highlight whitespace
  </button>-->
  <p>
    <label for="option-4">maxEmptyLines</label>
    <input id="option-4" name="maxEmptyLines" type="number" value="1" min="0" max="10">
  </p>
  <p>
    <label for="option-1">tabWidth</label>
    <input id="option-1" name="tabWidth" type="number" value="4" min="1" max="8">
  </p>
  <p>
    <label for="option-2">ignoreHead</label>
    <input id="option-2" name="ignoreHead" type="number" value="1" min="0" max="4">
  </p>
  <p>
    <label for="option-3">ignoreTail</label>
    <input id="option-3" name="ignoreTail" type="number" value="0" min="0" max="4">
  </p>
  <p>
    <input type="submit" value="Update examples">
  </p>
</form>

<table class="outdent-results"></table>

<div class="outdent-example" data-type="inner" title="Paste your own code…">
<div></div>
</div>

<div class="outdent-example" data-type="inner" title="textContent: [el] Test [/el]">
<p> Test </p>
</div>

<div class="outdent-example" data-type="inner" title="textContent: [el]\nTest\n[/el]">
<p>
Test
</p>
</div>

<div class="outdent-example" data-type="outer" title="outerHTML: Empty lines">
      <p>


        Test





      </p>
</div>

<div class="outdent-example" data-type="inner" title="textContent: Empty lines">
      <p>


        Test





      </p>
</div>

<div class="outdent-example" data-type="inner" title="textContent: [el]\n····Test\n[/el]">
<p>
    Test
</p>
</div>

<div class="outdent-example" data-type="outer" title="From https://bugzilla.mozilla.org/show_bug.cgi?id=1046803">
<?php include('example/test-a.html'); ?>
</div>

<div class="outdent-example" data-type="outer" title="Extract from above">
<?php include('example/test-b.html'); ?>
</div>

<div class="outdent-example" data-type="outer" title="From twitter.com">
<?php include('example/twitter.html'); ?>
</div>

<div class="outdent-example" data-type="outer" title="From alsacreations.com">
<?php include('example/alsacreations-a.html'); ?>
</div>

<div class="outdent-example" data-type="inner" title="textContent: From alsacreations.com (same as above)">
<?php include('example/alsacreations-a.html'); ?>
</div>

<div class="outdent-example" data-type="outer" title="From alsacreations.com">
<?php include('example/alsacreations-b.html'); ?>
</div>

<div class="outdent-example" data-type="outer" title="From lemonde.fr">
<?php include('example/lemonde-a.html'); ?>
</div>

<div class="outdent-example" data-type="outer" title="From lemonde.fr (extract from above)">
<?php include('example/lemonde-b.html'); ?>
</div>

</body>
</html>
