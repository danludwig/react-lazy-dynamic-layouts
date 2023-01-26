import '@testing-library/react';
import buildMapFromArray from './buildMapFromArray';

describe('buildMapFromArray', () => {
    describe('given an array of objects with a number key', () => {
        type TestShape = {
            id: number;
            components: number[];
        };
        const testArray: TestShape[] = [
            {
                id: 0,
                components: [1, 2, 3],
            },
            {
                id: 1,
                components: [4],
            },
        ];

        it('returns a map of objects keyed by the number', () => {
            type ResultShape = { [k: number]: TestShape };
            const result: ResultShape = buildMapFromArray<number, TestShape>(
                testArray,
                (x) => x.id
            );
            expect(result[0]).toStrictEqual(testArray[0]);
            expect(result[1]).toStrictEqual(testArray[1]);
        });
    });

    describe('given an array of objects with a text key', () => {
        type TestShape = {
            name: string;
            type: string;
            initialValue: string;
        };
        const testArray: TestShape[] = [
            {
                name: 'show_image',
                type: 'string',
                initialValue: 'hide',
            },
            {
                name: 'location',
                type: 'string',
                initialValue: 'ny',
            },
        ];

        it('returns a map of objects keyed by the text', () => {
            type ResultShape = { [k: string]: TestShape };
            const result: ResultShape = buildMapFromArray<string, TestShape>(
                testArray,
                (x) => x.name
            );
            expect(result['show_image']).toStrictEqual(testArray[0]);
            expect(result['location']).toStrictEqual(testArray[1]);
        });
    });
});
