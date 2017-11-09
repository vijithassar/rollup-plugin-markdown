import MagicString from 'magic-string';
import { createFilter } from 'rollup-pluginutils';

// export a function that can take configuration options
const markdown = (options = {}) => {

    // include or exclude files
    const filter = createFilter(options.include, options.exclude);

    // disable sourcemaps if you want for some reason
    const sourcemap = options.sourceMap !== false && options.sourcemap !== false;

    const plugin = {

        name: 'markdown',

        // transform source code
        transform: (code, id) => {

            // exit without transforming if the filter prohibits this id
            if (! filter(id)) {
                return null;
            }

            // load source code string into MagicString for transformation
            const magicstring = new MagicString(code);

            // spit input code string along newlines
            const lines = code.split('\n');

            // if it doesn't look like a valid Markdown document containing
            // a reasonable number of code blocks, exit immediately and
            // return the input
            const fences = lines.filter(item => item.slice(0, 3) === '```');
            const even_fences = fences.length % 2 === 0;
            const has_fences = fences.length > 0;
            if (! even_fences || ! has_fences) {
                const self = {code: code};
                if (sourcemap) {
                    self.map = magicstring.generateMap({hires: true});
                }
                return self;
            }

            // track whether we're inside a code block
            let code_block = false;
            let position = 0;
            // determine which lines to include in the output
            const line_data = lines
                .map(string => {
                    const start = position;
                    const end = position + string.length;
                    position = end + 1;
                    const backticks = string.slice(0, 3) === '```';
                    // every time a set of backticks is detected,
                    // toggle the code block
                    if (backticks) {
                        code_block = ! code_block;
                    }
                    const line = {
                        line: string,
                        start: start,
                        end: end,
                        include: code_block && ! backticks
                    };
                    return line;
                });

            // remove excluded lines
            line_data.forEach(line => {
                if (line.include === false) {
                    magicstring.remove(line.start, line.end);
                }
            });

            const result = {
                code: magicstring.toString()
            };

            // attach sourcemap
            if (sourcemap) {
                result.map = magicstring.generateMap({hires: true});
            }

            return result;

        }

    };

    return plugin;

};

export default markdown;