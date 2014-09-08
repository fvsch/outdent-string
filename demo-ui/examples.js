
function highlight(text) {
	text = text.replace(/</g, '&lt;')
	text = text.replace(/ /g, '<span class="space"> </span>')
	text = text.replace(/\t/g, '<span class="tab">\t</span>')
	text = text.replace(/\n/g, '<span class="eol"></span>\n')
	return text
}

function getOptionValues() {
	var form = document.querySelector('form')
	return {
		maxEmptyLines: parseInt(form.querySelector('[name=maxEmptyLines]').value, 10),
		tabWidth: parseInt(form.querySelector('[name=tabWidth]').value, 10),
		ignoreHead: parseInt(form.querySelector('[name=ignoreHead]').value, 10),
		ignoreTail: parseInt(form.querySelector('[name=ignoreTail]').value, 10),
	}
}

function updateExampleLeft(pre, text) {
	pre.innerHTML = highlight(text)
}

function updateExampleRight(pre, text, options) {
	text = removeEmptyLines(text, options.maxEmptyLines)
	text = removeExtraIndentation(text, options)
	pre.innerHTML = highlight(text)
}

function updateExamples() {
	var options = getOptionValues()
	var sources = document.querySelectorAll('.outdent-results .original pre')
	var results = document.querySelectorAll('.outdent-results .modified pre')
	for (var i = 0; i < sources.length; i++) {
		console.log(i)
		var text = sources[i].textContent
		updateExampleRight(results[i], text, options)
	}
}

function makeEditable(pre) {
	var textarea = document.createElement('textarea')
	textarea.textContent = pre.textContent
	textarea.spellcheck = false
	pre.parentElement.insertBefore(textarea, pre)

	var height = Math.max(pre.clientHeight, textarea.scrollHeight)
	textarea.style.minHeight = height + 'px'

	textarea.addEventListener('blur', function(event){
		var el = event.currentTarget
		var td = el.parentElement
		if (td.classList.contains('original')) {
			var text = el.value
			var preLeft = td.querySelector('pre')
			var preRight = td.nextElementSibling.querySelector('pre')
			var options = getOptionValues()
			updateExampleLeft(preLeft, text)
			updateExampleRight(preRight, text, options)
		}
		td.removeChild(el)
	})

	textarea.focus()
}

function buildExamples() {
	var options = getOptionValues()
	var container = document.querySelector('table')
	var examples  = document.querySelectorAll('.outdent-example')
	var rows = ''

	for (var i = 0; i < examples.length; i++) {
		var type = examples[i].dataset.type;
		var origin = examples[i].firstElementChild
		var title = '' + (i+1) + '. ' + examples[i].title

		var source = (type === 'inner' ) ? origin.textContent : origin.outerHTML
		var newText = removeEmptyLines(source, options.maxEmptyLines)
		    newText = removeExtraIndentation(newText, options)

		var original = highlight(source)
		var modified = highlight(newText)

		var cell1 = '<td colspan="2">' + title + '</td>'
		var cell2 = '<td class="original output"><pre>' + original + '</pre></td>'
		var cell3 = '<td class="modified output"><pre>' + modified + '</pre></td>'
		rows += '<tr>' + cell1 + '</tr><tr>' + cell2 + cell3 + '</tr>'
	}
	container.innerHTML = rows

	var pres = document.querySelectorAll('pre')
	for (var i = 0; i < pres.length; i++) {
		pres[i].addEventListener('click', function(event){
			makeEditable(event.currentTarget)
		})
	}
}

function init() {
	buildExamples()
	var form = document.querySelector('form')
	form.addEventListener('submit', function(e){
		e.preventDefault()
		updateExamples()
	})
}
