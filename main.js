//Запись суммы словами
const UNITS = {
  'рубль': {1: 'один'},
  'рубля': {2: 'два', 3: 'три', 4: 'четыре'},
  'рублей': {0: '', 5: 'пять', 6: 'шесть', 7: 'семь', 8: 'восемь', 9: 'девять'}
};

const PENNY_UNITS = {
  'копейка': {1: 'одна'},
  'копейки': {2: 'две', 3: 'три', 4: 'четыре'},
  'копеек': {0: '', 5: 'пять', 6: 'шесть', 7: 'семь', 8: 'восемь', 9: 'девять'}
};

const TENS10_19 = {
  10: 'десять',
  11: 'одиннадцать',
  12: 'двенадцать',
  13: 'тринадцать',
  14: 'четырнадцать',
  15: 'пятнадцать',
  16: 'шестнадцать',
  17: 'семнадцать',
  18: 'восемнадцать',
  19: 'девятнадцать',
};

const TENS20_99 = {
  2: 'двадцать',
  3: 'тридцать',
  4: 'сорок',
  5: 'пятьдесят',
  6: 'шестьдесят',
  7: 'семьдесят',
  8: 'восемьдесят',
  9: 'девяносто'
};

const HUNDREDS = {
  1: 'сто',
  2: 'двести',
  3: 'триста',
  4: 'четыреста',
  5: 'пятьсот',
  6: 'шестьсот',
  7: 'семьсот',
  8: 'восемьсот',
  9: 'девятьсот'
};

const THOUSANDS1_9 = {
  'тысяча': {1: 'одна'},
  'тысячи': {2: 'две', 3: 'три', 4: 'четыре'},
  'тысяч': {0: '', 5: 'пять', 6: 'шесть', 7: 'семь', 8: 'восемь', 9: 'девять'},
};

const transformUnits = (arrUnits, number) => {
  let unit;

  for (key in arrUnits) {    
    for (numbs in arrUnits[key]) {
      if (numbs == number) {
        unit = `${arrUnits[key][numbs]} ${key}`;
      }
    }
  }
  return unit;
};

const transformTens10_19 = (arrTens10_19, number) => {
  let result;

  for (key in arrTens10_19) {
    if (key == number) {
      result = `${arrTens10_19[key]}`;
    }
  }

  return result;
};

const transformTens20_99 = (arrTens20_99, arrUnits, number) => {

  let result;

  for (key in arrTens20_99) {
    if(key == number[0]) {
      result = `${arrTens20_99[key]} ${transformUnits(arrUnits, number[1])}`;
    }
  }

  return result;
};

const transformTens = (arrTens20_99, arrTens10_19, arrUnits, number) => {
  let result;

  if(Number(number) > 9 && Number(number) < 20) {
    result = `${transformTens10_19(arrTens10_19, number)} рублей`;
  } else {
    result = transformTens20_99(arrTens20_99,arrUnits, number);
  }

  return result;
};

const transformHundreds = (arrHundreds, arrTens20_99, arrTens10_19, arrUnits, number) => {
  let result;

  for (key in arrHundreds) {
    if (key == number[0]) {
      result = `${arrHundreds[key]} `;

      let tensNumb = number[1] + number[2];

      if(number[1] == 0){
        result += transformUnits(arrUnits, number[2]);
      } else {
        result += transformTens(arrTens20_99, arrTens10_19, arrUnits, tensNumb);
      }          
    }
  }
  return result;
};

const transformThousands = (
  arrThousands1_9,
  arrHundreds,
  arrTens20_99,
  arrTens10_19,
  arrUnits,
  number
) => {
  let result, thousandsTensNumber, hundredsNumb, tensNumb;

  if (Number(number) > 999 && Number(number) < 10000) {
    result = `${transformUnits(arrThousands1_9, number[0])} `;

    hundredsNumb = number[1] + number[2] + number[3];
    tensNumb = number[2] + number[3];

  } else {
    thousandsTensNumber = number[0] + number[1];
    hundredsNumb = number[2] + number[3] + number[4];
    tensNumb = number[3] + number[4];

    if (Number(number) > 9999 && Number(number) < 20000) {
      result = `${transformTens10_19(arrTens10_19, thousandsTensNumber)} тысяч `;
    }
    else if (Number(number) > 19999  && Number(number) < 100000) {
      result = `${transformTens20_99(arrTens20_99, arrThousands1_9, thousandsTensNumber)} `;
    }
  }

  if (hundredsNumb == "000") {
    result += "рублей";
  } else if (tensNumb[0] == 0 && hundredsNumb[0] == 0) {
    result += transformUnits(arrUnits, tensNumb[1]);
  } else if (hundredsNumb[0] == 0) {
    result += transformTens(arrTens20_99, arrTens10_19, arrUnits, tensNumb);
  } else {
    result += `${transformHundreds(
      arrHundreds,
      arrTens20_99,
      arrTens10_19,
      arrUnits,
      hundredsNumb
    )}`;
  }
  return result;
};

const transformIntAmount = amount => {
  let result;

  if (amount >=0 && amount < 10) {
    result = transformUnits(UNITS, amount);
  }

  else if (amount > 9 && amount < 100) {
    result = transformTens(TENS20_99, TENS10_19, UNITS, amount);
  }

  else if (amount > 99 && amount < 1000) {
    result = transformHundreds(HUNDREDS, TENS20_99, TENS10_19, UNITS, amount);
  }

  else if (amount > 999 && amount < 100000) {
    result = transformThousands(THOUSANDS1_9, HUNDREDS, TENS20_99, TENS10_19, UNITS, amount);
  }

  return result;
};

const transformFractAmount = amount => {
  let result;
  if (amount == '00') {
    result = 'ноль копеек'
  }else if(amount[0] == 0) {
    result = transformUnits(PENNY_UNITS, amount[1]);
  } else if (amount[0] == 1) {
    result = `${transformTens10_19(TENS10_19, amount)} копеек`
  } else {
    result = `${transformTens20_99(TENS20_99, PENNY_UNITS, amount)}`
  }
  return result;
}

const separateInt = amount => amount.slice(0, amount.length - 3);
const separeFract = amount => amount.slice(-2);

const transformAmount = value => {
  let int = transformIntAmount(separateInt(value));
  int = int[0].toUpperCase() + int.slice(-(int.length-1))

  let fract = transformFractAmount(separeFract(value));

  let result = `${int} ${fract}`;
  return result;
};

const transformShort = value => {
  let int = `${separateInt(value)} руб. `;
  let fract = `${separeFract(value)} коп.`
  
  let result = int + fract;
  return result;
};

//Получение вводимой суммы из инпута и запись в абзац
const getElement = selector => document.querySelector(selector);

function Amount() {
  let _transform = '';

  Object.defineProperty(this, 'transform', {
    get: () => {
      return _transform;
    },
    set: value => {
      _transform = value;
    }
  });
};
const amountWord = new Amount();
const amountShort = new Amount();

const button = getElement('.button');
button.addEventListener('click', () => {
  let inputValue = getElement('.input').value.replace(/\s+/g, '');

  if (!inputValue) {
    alert('Введите сумму!');
    return;
  }

  if (isNaN(Number(inputValue.replace(/[^\d]+/g,'')))) {
    alert('Введите корректную сумму в числовом формате!');
    getElement('.input').value = '';
    return;
  }

  toFillContainer(inputValue, amountWord, '.amountWord', transformAmount);
  toFillContainer(inputValue, amountShort, '.amountShort', transformShort);

});

const toFillContainer = (inner, obj, selector, func) => {
  let container = getElement(selector);
  container.innerHTML = '';
  obj.transform = func(inner);
  container.innerHTML = obj.transform;
};