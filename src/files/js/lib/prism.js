import Prism from 'prismjs';
import 'prismjs/components/prism-scss';
// import 'prismjs/components/prism-php';
import 'prismjs/plugins/line-numbers/prism-line-numbers';
import 'prismjs/plugins/line-highlight/prism-line-highlight';
import 'prismjs/plugins/toolbar/prism-toolbar';
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard';
import 'prismjs/plugins/normalize-whitespace/prism-normalize-whitespace';

Prism.plugins.NormalizeWhitespace.setDefaults({
	'remove-trailing': true,
	'remove-indent': true,
	'left-trim': true,
	'right-trim': true,
	'remove-initial-line-feed': true,
	'indent': 0,
	'tabs-to-spaces': 0,
	// 'break-lines': 80,
	'spaces-to-tabs': 0
});