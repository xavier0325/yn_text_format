const three_letter_to_one_letter: Record<string, string> = {
	"GLY": "G",
	"ALA": "A",
	"LEU": "L",
	"ILE": "I",
	"VAL": "V",
	"PRO": "P",
	"PHE": "F",
	"MET": "M",
	"TRP": "W",
	"SER": "S",
	"GLN": "Q",
	"THR": "T",
	"CYS": "C",
	"ASN": "N",
	"TYR": "Y",
	"ASP": "D",
	"GLU": "E",
	"LYS": "K",
	"ARG": "R",
	"HIS": "H"
}
/** 三个字母转一个字母 */
export function threeToOne(invalue: string) {
  if (!invalue) {
    throw new Error("输入为空");
  }
  invalue = invalue.toUpperCase();
  const vArr = strToArray(invalue);
  const keys = Object.keys(three_letter_to_one_letter);
  if (!ArrInArr(vArr, keys)) {
    throw new Error("字符中有错误的字符");
  }
  let resStr = "";
  vArr.forEach(v=> {
    if (!three_letter_to_one_letter[v]) {
      throw new Error("含有不正确字符:" + v);
    }
    resStr += three_letter_to_one_letter[v];
  });
  return resStr;
}

function strInArray(str: string, arr: string[]) {
  return arr.toString().indexOf(str) > -1;
}

function strToArray(str: string) {
  var arr = new Array();
  return (arr = str.split("-"));
}

function ArrInArr(subArr: any[], Arr: any[]) {
  for (let i = 0; i < subArr.length; i++) {
    if (!strInArray(subArr[i], Arr)) {
      return false;
    }
  }
  return true;
}
