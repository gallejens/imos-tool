const LENGTH_INDEX = 0;
const WIDTH_INDEX = 1;
const AMOUNT_INDEX = 2;
const MATERIAL_INDEX = 3;
const ROTATION_INDEX = 4;
const LABEL_INDEX = 5;

// All these need to be same in order to merge
const UNIQUE_INDICES = [LENGTH_INDEX, WIDTH_INDEX, MATERIAL_INDEX, ROTATION_INDEX];

const ALLOWED_MERGE_CHARACTERS: [string, string][] = [
  ['L', 'R'],
  ['O', 'B'],
  ['V', 'A'],
];

type CSVRow = number | string;

export const processCSV = (csv: string[][]) => {
  if (!csv || !Array.isArray(csv)) throw new Error('Invalid CSV file');

  const rowCount = csv.length;
  if (rowCount === 0) throw new Error('CSV File is empty');

  const columnAmount = csv[0].length;
  if (csv.some(r => r.length !== columnAmount)) throw new Error('Not all rows have the same amount of columns');

  // Parse number rows to actual numbers
  const parsedCSV: CSVRow[][] = csv.map(r =>
    r.map(v => {
      const n = Number(v);
      return isNaN(n) ? v : n;
    })
  );

  const mergedRows: (CSVRow | string[])[][] = [];

  // Merge data and populate new rows
  for (let y = 0; y < parsedCSV.length; y++) {
    const row = parsedCSV[y];

    // find idx of row in newrows array that has same unique fields
    const existingRowIdx = mergedRows.findIndex(r => UNIQUE_INDICES.every(j => row[j] === r[j]));

    // if no row found what matches the unique columns then just add row
    if (existingRowIdx === -1) {
      mergedRows.push([...row]);
      continue;
    }

    const existingRow = mergedRows[existingRowIdx];

    // increase amount
    existingRow[AMOUNT_INDEX] = Number(existingRow[AMOUNT_INDEX]) + 1;

    // create new label
    const existingLabels = existingRow[LABEL_INDEX];
    if (Array.isArray(existingLabels)) {
      existingLabels.push(String(row[LABEL_INDEX]));
    } else {
      existingRow[LABEL_INDEX] = [String(existingLabels), String(row[LABEL_INDEX])];
    }
  }

  const finalRows: string[][] = [];

  // loop through newrows to create labels
  for (const row of mergedRows) {
    let labels = row[LABEL_INDEX];
    if (Array.isArray(labels)) {
      labels = concatLabels(labels);
    }

    const finalRow = [...row];
    finalRow[LABEL_INDEX] = labels;

    if (typeof finalRow[LABEL_INDEX] !== 'string') {
      throw new Error(`Label ${labels} was not a string after concat`);
    }

    // if-statement above catches errors so we can cast
    finalRows.push(finalRow as string[]);
  }

  // loop through new rows and sort by
  const sortedByMaterial: Record<string, string[][]> = {};
  for (const row of finalRows) {
    const material = row[MATERIAL_INDEX];
    const materialRows = sortedByMaterial[material] ?? [];
    sortedByMaterial[material] = [...materialRows, row];
  }

  return sortedByMaterial;
};

function concatLabels(labels: string[]) {
  const prefixes = new Set<string>();
  const names = new Set<string>();

  for (const label of labels) {
    const splitLabel = label.split('_');
    if (splitLabel.length !== 2) {
      throw new Error(`Label ${label} had none or more than one underscore`);
    }

    const [prefix, name] = splitLabel;
    prefixes.add(prefix);
    names.add(name);
  }

  const newPrefix = mergeByLastCharacter(prefixes);
  const newName = mergeByLastCharacter(names);

  return `${newPrefix}_${newName}`;
}

function mergeByLastCharacter(stringsSet: Set<string>) {
  const stringsArr = Array.from(stringsSet);
  for (let i = 0; i < stringsArr.length; i++) {
    const str = stringsArr[i];

    const splitStr = str.split(' ');
    const merger = splitStr.pop() ?? '';
    const identifier = splitStr.join(' ');

    const mergeChars = ALLOWED_MERGE_CHARACTERS.find(c => c.includes(merger));
    if (!mergeChars) continue;

    const companionChar = mergeChars[mergeChars[0] === merger ? 1 : 0];

    let foundCompanionIdx: number | undefined;
    // only search next names
    for (let j = i + 1; j < stringsArr.length; j++) {
      const searchStr = stringsArr[j];
      const searchSplitStr = searchStr.split(' ');
      const searchMerger = searchSplitStr.pop();
      const searchIdentifier = searchSplitStr.join(' ');

      if (searchIdentifier === identifier && searchMerger === companionChar) {
        foundCompanionIdx = j;
        break;
      }
    }
    if (!foundCompanionIdx) continue;

    stringsArr.splice(foundCompanionIdx, 1);
    stringsArr[i] = `${str}|${companionChar}`;
  }

  return stringsArr.join('/');
}
