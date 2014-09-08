
// String.prototype.repeat polyfill 
if (!String.prototype.repeat) {
	String.prototype.repeat = function repeat(times) {
	  return new Array(times + 1).join(this);
	}
}

/**
	Returns num if between min and max (integers),
	or the boundary which was closer to num.
*/
function minmax(num, min, max) {
	return Math.max(min, Math.min(max, Math.floor(num)))
}

/**
	Remove empty lines from text.
	Depends on: String.prototype.repeat(), minmax()
	@param {string} text - Multiline string to process
	@param {number} maxEmptyLines - Maximum consecutive empty lines to allow
*/
function removeEmptyLines(text, maxEmptyLines) {

	if (typeof text !== 'string') {
		throw new TypeError('Param `text` must be a string, was: ' + typeof text)
	}
	if (typeof maxEmptyLines !== 'number') {
		throw new TypeError('Param `maxEmptyLines` must be a number, was: ' + typeof maxEmptyLines)
	}

	var MAX = minmax(maxEmptyLines, 0, 50)

	// Center of string: N empty lines = N+1 '\n'
	var re_center = '([ \t]*\n){NUM,}'
	re_center = re_center.replace('NUM', MAX + 2)
	re_center = new RegExp(re_center, 'g')
	text = text.replace(re_center, '\n'.repeat(MAX + 1))

	// Boundaries of string: N empty lines = N '\n' + boundary
	var re_startend = '(^|[ \t]*\n)([ \t]*\n){NUM,}([ \t]*(\n|$))'
	re_startend = re_startend.replace('NUM', MAX)
	re_startend = new RegExp(re_startend, 'g')
	text = text.replace(re_startend, '\n'.repeat(MAX))

	return text
}

/**
	Validate the key:value pairs in `options` using type
	checks, filter methods and default values from `defaults`.

	Each property of `defaults` should be an object where:
	- the key is the option name;
	- the `value` property (required) is the default value;
	- the `type` property (optional) is a valid JS type and is
	  inferred from `value` if omitted;
	- the `filter` property (optional) is a function taking one
	  value and returning a modified form of this value.

	@param {object} defaults - Template for the returned object,
	@param {object} options - Values to use if valid, and possibly filter.
	@returns {object}
*/
function mergeOptions(defaults, options) {
	var validated  = {}
	for (var prop in defaults) {
		var value = defaults[prop].value
		var type  = defaults[prop].type || typeof value
		if (prop in options && typeof options[prop] === type) {
			value = options[prop]
			if (defaults[prop].filter) {
				value = defaults[prop].filter(value)
			}
		}
		validated[prop] = value
	}
	return validated
}

/**
	Tries to detect and remove extraneous leading whitespace
	from a multiline string. Made for strings of code, especially
	the results of element.innerHTML, element.outerHTML, and
	element.textContent.
	Depends on: mergeOptions(), minmax() String.prototype.repeat()

	@param {string} text - Text to process
	@param {{
		ignoreHead:number,
		ignoreTail:number,
		tabToSpaces:number
	}} options - Optional parameters
	@returns {string}
*/
function removeExtraIndentation(text, options) {
	if (typeof text !== 'string') {
		throw new TypeError('Param `text` must be a string, was: ' + typeof text)
	}
	if (typeof options !== 'object') {
		options = {}
	}

	var LINE_SPLITTER_RE = /^.*(\r\n|\n|$)/gm
	var TAB_WEIGHT = 3
	var TYPE_SPACES = 'spaces'
	var TYPE_TABS = 'tabs'

	// Option configuration
	var defaults = {
		ignoreHead: {
			value: 1,
			filter: function(x) { return minmax(x, 0, 4) }
		},
		ignoreTail: {
			value: 0,
			filter: function(x) { return minmax(x, 0, 4) }
		},
		tabWidth: {
			value: 4,
			filter: function(x) { return minmax(x, 1, 8) }
		},
	}

	// Merging options
	options = mergeOptions(defaults, options)
	var softTab = new Array(options.tabWidth + 1).join(' ')

	// Whitespace-mangling utils
	var getWhitespaceInfo = function(str) {
		var result = {
			empty: (str.length === 0),
			hasMixed: false,
			dominantType: TYPE_SPACES
		}
		if (!result.empty) {
			var spaces = (str.match(/ /g) || []).length
			var tabs = (str.match(/\t/g) || []).length
			if (tabs > 0 && spaces > 0) {
				result.hasMixed = true
			}
			if (tabs * TAB_WEIGHT > spaces) {
				result.dominantType = TYPE_TABS
			}
		}
		return result
	}
	var unmixWhitespace = function(str, targetType) {
		if (targetType === TYPE_SPACES && str.indexOf('\t') !== -1) {
			str = str.replace(/\t/g, softTab)
		}
		if (targetType === TYPE_TABS && str.indexOf(' ') !== -1) {
			var total = str.replace(/\t/g, softTab).length
			var numTabs = Math.round(total / options.tabWidth)		
			str = new Array( numTabs + 1 ).join('\t')
		}
		return str
	}

	// Remove empty lines
	if (typeof options.maxEmptyLines === 'number') {
		text = removeEmptyLines(text, options.maxEmptyLines)
	}

	// Split lines and isolate leading whitespace
	var leading = []
	var content = []
	text.match(LINE_SPLITTER_RE)
	.forEach(function(line) {
		// We sometimes get an extraneous empty string match
		// Note that even an empty line should be '\n'
		if (line.length > 0) {
			var lineLeading = line.split(/[^ \t]/, 1)[0]
			var lineContent = line.slice(lineLeading.length)
			leading.push(lineLeading)
			content.push(lineContent)
		}
	})

	// Analyse whitespace
	var wsInfo = getWhitespaceInfo( leading.join('') )
	
	// No leading whitespace to work on
	if (wsInfo.empty) {
		return text
	}
	// Determine the indent we can remove, and chop it off
	else {
		var newText = ''
		var numLines = leading.length
		var indentLengths = []
		var removable

		// First pass: test for removable leading whitespace
		leading.forEach(function(value, index, arr) {
			if (wsInfo.hasMixed) {
				arr[index] = unmixWhitespace(value, wsInfo.dominantType)
			}
			if (
				(index >= options.ignoreHead) &&
				(index < numLines - options.ignoreTail) &&
				(content[index].trim() !== '')
			) {
				indentLengths.push(value.length)
			}
		})
		removable = Math.min.apply(undefined, indentLengths) || 0

		// Second pass: make final string
		leading.forEach(function(value, index, arr) {
			newText += leading[index].slice(removable) + content[index]
		})

		return newText
	}
}
