import { removeDuplicates, sortNumbers, sumPositiveNumbers, groupByParity } from '../arrayUtils.js';
import * as fc from 'fast-check';

describe('Array Utilities', () => {
  describe('removeDuplicates', () => {
    test('should remove duplicate elements from an array', () => {
      expect(removeDuplicates([1, 2, 2, 3, 4, 4, 5])).toEqual([1, 2, 3, 4, 5]);
      expect(removeDuplicates(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c']);
      expect(removeDuplicates([true, false, true])).toEqual([true, false]);
    });

    test('should return an empty array when given an empty array', () => {
      expect(removeDuplicates([])).toEqual([]);
    });

    test('property: result should not contain duplicates', () => {
      fc.assert(
        fc.property(fc.array(fc.integer()), (arr) => {
          const result = removeDuplicates(arr);
          const uniqueResult = [...new Set(result)];
          return result.length === uniqueResult.length;
        })
      );
    });

    test('property: all elements in result should be in original array', () => {
      fc.assert(
        fc.property(fc.array(fc.integer()), (arr) => {
          const result = removeDuplicates(arr);
          return result.every(item => arr.includes(item));
        })
      );
    });
  });


  describe('sortNumbers', () => {
    test('should sort numbers in ascending order', () => {
      expect(sortNumbers([5, 3, 1, 4, 2])).toEqual([1, 2, 3, 4, 5]);
      expect(sortNumbers([-3, 10, 0, -5, 7])).toEqual([-5, -3, 0, 7, 10]);
    });

    test('should return an empty array when given an empty array', () => {
      expect(sortNumbers([])).toEqual([]);
    });

    test('should not modify the original array', () => {
      const original = [5, 3, 1, 4, 2];
      sortNumbers(original);
      expect(original).toEqual([5, 3, 1, 4, 2]);
    });

    test('property: result should be sorted in ascending order', () => {
      fc.assert(
        fc.property(fc.array(fc.integer()), (arr) => {
          const result = sortNumbers(arr);
          for (let i = 1; i < result.length; i++) {
            if (result[i] < result[i - 1]) return false;
          }
          return true;
        })
      );
    });

    test('property: result should contain the same elements as the input', () => {
      fc.assert(
        fc.property(fc.array(fc.integer()), (arr) => {
          const result = sortNumbers(arr);
          return (
            result.length === arr.length &&
            [...result].sort().join() === [...arr].sort().join()
          );
        })
      );
    });
  });


  describe('sumPositiveNumbers', () => {
    test('should sum only positive numbers in the array', () => {
      expect(sumPositiveNumbers([1, -2, 3, 4, -5])).toBe(8);
      expect(sumPositiveNumbers([-1, -2, -3])).toBe(0);
      expect(sumPositiveNumbers([5, 10, 15])).toBe(30);
    });

    test('should return 0 for an empty array', () => {
      expect(sumPositiveNumbers([])).toBe(0);
    });

    test('property: result should be non-negative', () => {
      fc.assert(
        fc.property(fc.array(fc.integer()), (arr) => {
          return sumPositiveNumbers(arr) >= 0;
        })
      );
    });

    test('property: result should equal sum of positive numbers', () => {
      fc.assert(
        fc.property(fc.array(fc.integer()), (arr) => {
          const manualSum = arr.filter(n => n > 0).reduce((sum, n) => sum + n, 0);
          return sumPositiveNumbers(arr) === manualSum;
        })
      );
    });
  });

  describe('groupByParity', () => {
    test('should group numbers by parity', () => {
      expect(groupByParity([1, 2, 3, 4, 5])).toEqual({
        even: [2, 4],
        odd: [1, 3, 5]
      });
      expect(groupByParity([2, 4, 6])).toEqual({
        even: [2, 4, 6],
        odd: []
      });
      expect(groupByParity([1, 3, 5])).toEqual({
        even: [],
        odd: [1, 3, 5]
      });
    });

    test('should return empty groups for an empty array', () => {
      expect(groupByParity([])).toEqual({ even: [], odd: [] });
    });

    test('property: all even numbers should be in even group', () => {
      fc.assert(
        fc.property(fc.array(fc.integer()), (arr) => {
          const result = groupByParity(arr);
          return result.even.every(n => n % 2 === 0);
        })
      );
    });

    test('property: all odd numbers should be in odd group', () => {
      fc.assert(
        fc.property(fc.array(fc.integer()), (arr) => {
          const result = groupByParity(arr);
          return result.odd.every(n => n % 2 !== 0);
        })
      );
    });

    test('property: sum of lengths of both groups should equal original array length', () => {
      fc.assert(
        fc.property(fc.array(fc.integer()), (arr) => {
          const result = groupByParity(arr);
          return result.even.length + result.odd.length === arr.length;
        })
      );
    });
  });


  describe('findCommonElements', () => {
    test('should find common elements between two arrays', () => {
      expect(findCommonElements([1, 2, 3, 4], [3, 4, 5, 6])).toEqual([3, 4]);
      expect(findCommonElements([1, 2, 3], [4, 5, 6])).toEqual([]);
      expect(findCommonElements(['a', 'b', 'c'], ['b', 'c', 'd'])).toEqual(['b', 'c']);
    });

    test('should return an empty array when either input is empty', () => {
      expect(findCommonElements([], [1, 2, 3])).toEqual([]);
      expect(findCommonElements([1, 2, 3], [])).toEqual([]);
      expect(findCommonElements([], [])).toEqual([]);
    });

    test('property: common elements should be in both arrays', () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer()),
          fc.array(fc.integer()),
          (arr1, arr2) => {
            const common = findCommonElements(arr1, arr2);
            return common.every(item => arr1.includes(item) && arr2.includes(item));
          }
        )
      );
    });

    test('property: result should not contain duplicates', () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer()),
          fc.array(fc.integer()),
          (arr1, arr2) => {
            const common = findCommonElements(arr1, arr2);
            return common.length === new Set(common).size;
          }
        )
      );
    });
  });
});