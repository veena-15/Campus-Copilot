/** @typedef {{attended:number, classes:number}} AttendanceRecord */
/** @typedef {{score:number, max:number}} AssessmentRecord */

/** @param {AttendanceRecord} row */
function attendancePercent(row) {
  if (!Number.isFinite(row.attended) || !Number.isFinite(row.classes) || row.classes <= 0) return 0;
  return Math.max(0, Math.min(100, row.attended / row.classes * 100));
}

/** @param {AttendanceRecord[]} rows */
function overallAttendance(rows) {
  const total = rows.reduce((sum, row) => sum + row.classes, 0);
  return total > 0 ? rows.reduce((sum, row) => sum + row.attended, 0) / total * 100 : 0;
}

/** Returns null when an unmet 100% target cannot be reached by attending future classes. @param {AttendanceRecord} row @param {number} target */
function classesToTarget(row, target) {
  if (row.classes <= 0 || attendancePercent(row) >= target) return 0;
  if (target >= 100) return null;
  return Math.max(0, Math.ceil((target * row.classes / 100 - row.attended) / (1 - target / 100)));
}

/** @param {AssessmentRecord[]} rows */
function averagePercent(rows) {
  const valid = rows.filter(row => Number.isFinite(row.score) && Number.isFinite(row.max) && row.max > 0 && row.score >= 0 && row.score <= row.max);
  return valid.length ? valid.reduce((sum, row) => sum + row.score / row.max * 100, 0) / valid.length : 0;
}

/** Split text into overlapping word chunks. @param {string} text @param {number} size @param {number} overlap */
function chunkText(text, size = 160, overlap = 20) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const chunks = [];
  const step = Math.max(1, size - overlap);
  for (let start = 0; start < words.length; start += step) {
    chunks.push(words.slice(start, start + size).join(' '));
  }
  return chunks;
}

module.exports = { attendancePercent, overallAttendance, classesToTarget, averagePercent, chunkText };
