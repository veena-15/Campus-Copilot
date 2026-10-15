/* eslint @typescript-eslint/no-require-imports: off */
const test = require('node:test');
const assert = require('node:assert/strict');
const { attendancePercent, overallAttendance, classesToTarget, averagePercent, chunkText } = require('../lib/calculations.cjs');

test('attendance calculations handle empty classes and weighted totals', () => {
  assert.equal(attendancePercent({ attended: 0, classes: 0 }), 0);
  assert.equal(attendancePercent({ attended: 3, classes: 4 }), 75);
  assert.equal(overallAttendance([{ attended: 2, classes: 2 }, { attended: 0, classes: 8 }]), 20);
  assert.equal(overallAttendance([]), 0);
});
test('class estimate uses future attended classes and flags impossible 100 percent target', () => {
  assert.equal(classesToTarget({ attended: 6, classes: 10 }, 75), 6);
  assert.equal(classesToTarget({ attended: 8, classes: 10 }, 75), 0);
  assert.equal(classesToTarget({ attended: 9, classes: 10 }, 100), null);
});
test('assessment averages normalize each score to its own maximum', () => {
  assert.equal(averagePercent([{ score: 8, max: 10 }, { score: 90, max: 100 }]), 85);
  assert.equal(averagePercent([{ score: 5, max: 0 }]), 0);
});
test('document chunking creates overlapping chunks and handles empty text', () => {
  assert.deepEqual(chunkText(''), []);
  const chunks = chunkText(Array.from({ length: 12 }, (_, i) => `w${i}`).join(' '), 5, 2);
  assert.equal(chunks[0], 'w0 w1 w2 w3 w4');
  assert.equal(chunks[1], 'w3 w4 w5 w6 w7');
});
