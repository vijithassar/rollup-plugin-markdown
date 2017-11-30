import factory from '../source/markdown.js';
import * as assert from 'assert';

const instance = factory();

const lines = (markdown) => {
    const transformation = instance.transform(markdown, 'test');
    const clean = transformation.code.split('\n').filter(item => !! item);
    return clean;
};

describe('rollup-plugin-markdown', () => {
    it('provides a factory', () => {
        assert.equal(typeof factory, 'function');
    });
    it('returns an instance', () => {
        assert.equal(typeof instance, 'object');
    });
    it('has the required methods', () => {
        assert.equal(typeof instance.transform, 'function');
    });
    it('extracts code blocks from Markdown', () => {
        const markdown = '# heading\ntext\n```js\ncode()\n```';
        const expected = 'code()';
        const processed = lines(markdown);
        assert.equal(processed, expected);
    });
    it('ignores code with languages other than JavaScript specified', () => {
        const markdown = '# heading\ntext\n```bash\na()\n```\ntext\n```js\nb()\n```';
        const expected = 'b()';
        const processed = lines(markdown).join('\n');
        assert.equal(processed, expected);
    });
    it('ignores code without a language annotation after opening fence', () => {
        const markdown = '# heading\ntext\n```\na()\n```\ntext\n```javascript\nb()\n```';
        const expected = 'b()';
        const processed = lines(markdown).join('\n');
        assert.equal(processed, expected);
    });
    it('captures code with js as the language annotation', () => {
        const markdown = '# heading\ntext\n```js\nb()\n```';
        const expected = 'b()';
        const processed = lines(markdown).pop();
        assert.equal(processed, expected);
    });
    it('captures code with javascript as the language annotation', () => {
        const markdown = '# heading\ntext\n```javascript\nb()\n```';
        const expected = 'b()';
        const processed = lines(markdown).pop();
        assert.equal(processed, expected);
    });
    it('ignores code without a language annotation after opening fence', () => {
        const markdown = '# heading\ntext\n```\na()\n```\ntext\n```javascript\nb()\n```';
        const expected = 'b()';
        const processed = lines(markdown).pop();
        assert.equal(processed, expected);
    });
    it('captures multiple code blocks', () => {
        const markdown = '# heading\ntext\n```js\ncode()\n```\nmore text\n```\nmore_code()\n```';
        const expected = ['code()', 'more_code()'];
        const processed = lines(markdown);
        expected.forEach((line, index) => {
            assert.equal(processed[index], line);
        });
    });
    it('preserves code comments', () => {
        const markdown = '# heading\ntext\n```js\n// comment\n\ncode()\n```';
        const expected = ['// comment', 'code()'];
        const processed = lines(markdown);
        expected.forEach((line, index) => {
            assert.equal(processed[index], line);
        });
    });
    it('leaves non-Markdown code untouched', () => {
        const input = 'console.log("hello world");';
        const expected = 'console.log("hello world");';
        const processed = lines(input).pop();
        assert.equal(processed, expected);
    });
});