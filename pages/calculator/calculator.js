Page({
  data: {
    buttons: [
      {
        id: 'clear',
        bClass: 'symbol',
        text: 'AC',
        touchstart: false,
        touchend: false
      },
      {
        id: 'pn',
        bClass: 'symbol',
        text: '+/-',
        touchstart: false,
        touchend: false
      },
      {
        id: 'percent',
        bClass: 'symbol',
        text: '%',
        touchstart: false,
        touchend: false
      },
      {
        id: 'divisor',
        bClass: 'operator',
        text: '÷',
        touchstart: false,
        touchend: false
      },
      {
        id: 'seven',
        bClass: 'number',
        text: '7',
        touchstart: false,
        touchend: false
      },
      {
        id: 'eight',
        bClass: 'number',
        text: '8',
        touchstart: false,
        touchend: false
      },
      {
        id: 'nine',
        bClass: 'number',
        text: '9',
        touchstart: false,
        touchend: false
      },
      {
        id: 'multiplication',
        bClass: 'operator',
        text: '×',
        touchstart: false,
        touchend: false
      },
      {
        id: 'four',
        bClass: 'number',
        text: '4',
        touchstart: false,
        touchend: false
      },
      {
        id: 'five',
        bClass: 'number',
        text: '5',
        touchstart: false,
        touchend: false
      },
      {
        id: 'six',
        bClass: 'number',
        text: '6',
        touchstart: false,
        touchend: false
      },
      {
        id: 'minus',
        bClass: 'operator',
        text: '-',
        touchstart: false,
        touchend: false
      },
      {
        id: 'one',
        bClass: 'number',
        text: '1',
        touchstart: false,
        touchend: false
      },
      {
        id: 'two',
        bClass: 'number',
        text: '2',
        touchstart: false,
        touchend: false
      },
      {
        id: 'three',
        bClass: 'number',
        text: '3',
        touchstart: false,
        touchend: false
      },
      {
        id: 'plus',
        bClass: 'operator',
        text: '+',
        touchstart: false,
        touchend: false
      },
      {
        id: 'zero',
        bClass: 'number',
        text: '0',
        touchstart: false,
        touchend: false
      },
      {
        id: 'point',
        bClass: 'number',
        text: '.',
        touchstart: false,
        touchend: false
      },
      {
        id: 'equal',
        bClass: 'equal',
        text: '=',
        touchstart: false,
        touchend: false
      }
    ],
    show: {
      showNumber: '0',
      fontSize: 25,
    },
    showNumberArr: ['0'],
    numArr1: ['0'],
    numArr2: ['0'],
    numArr3: ['0'],
    operator1: '',
    operator2: '',
    btnOperatorChecked: ''
  },
  //点击0~9按钮或者.按钮或者%按钮
  numberButton(index) {
    // 注意<>括号中的内容为点击的内容
    const d = this.data;
    if (d.operator1 === '') {
      // 例：55<5>
      d.showNumberArr = d.numArr1
    } else if (d.operator1 !== '' && d.operator2 === '') {
      // 例：100+<5> or 100÷<5>
      d.showNumberArr = d.numArr2
    } else {
      // 例：+2×<5>; 9-6÷<3>
      d.showNumberArr = d.numArr3
    }
    if (index === 17) {
      // .按钮
      !d.showNumberArr.includes('.') && d.showNumberArr.push('.')
    } else if (index === 1) {
      // +/-按钮
      d.showNumberArr[0] === '-' ? d.showNumberArr.shift() : d.showNumberArr.unshift('-')
    } else if (index === 2) {
      // %按钮
      const nShowNumber = Number(d.showNumberArr.join(''))
      const nShowNumber2 = nShowNumber / 100
      const showNumber2Arr = String(nShowNumber2).split('')
      d.showNumberArr.splice(0, d.showNumberArr.length)
      for (let item of showNumber2Arr) {
        d.showNumberArr.push(item)
      }
    } else {
      if (d.showNumberArr[0] === '0' && d.showNumberArr.length === 1) {
        d.showNumberArr[0] = d.buttons[index].text
      } else {
        d.showNumberArr.push(d.buttons[index].text)
      }
    }
    this.showResult()
  },
  operatorButton(index) {
    // 注意<>括号中的内容为点击的内容
    // +、-、×、÷按钮
    const d = this.data;
    if (d.operator1 === '') {
      // 例：1<+>
      d.operator1 = d.buttons[index].id
    } else if (d.operator1 !== '' && d.operator2 === '') {
      if (d.btnOperatorChecked !== '') {
        // 例：9-<+> or 9+<×>
        d.operator1 = d.buttons[index].id
      } else {
        // 例：9-1<+> or 9+8<×> or 9×8<×>，
        // 其中9-1<+>和9×8<×>按下后，马上计算前面的9-1，9×8 而9+8<×>不计算
        d.operator2 = d.buttons[index].id
        if (this.operatorLevel1() >= this.operatorLevel2()) {
          this.equal1()
          d.operator1 = d.operator2
          d.operator2 = ''
          d.showNumberArr = d.numArr1

          this.showResult()
        }
      }
    } else {
      if (d.btnOperatorChecked !== '') {
        // 例：9-1×<+> or 9+8×<÷>
        d.operator2 = d.buttons[index].id
        if (this.operatorLevel1() === this.operatorLevel2()) {
          this.equal1()
          d.operator1 = d.operator2
          d.operator2 = ''
          d.showNumberArr = d.numArr1

          this.showResult()
        }
      } else {
        // 例：9-2×3<+> or 9+8×2<÷>
        // 9-2×3<+> ==> 9-6<+> ==> 3<+>; 9+8×2<÷> ==> 9+16<÷>; 无论哪种，都先计算后面的
        this.equal2()
        d.operator2 = d.buttons[index].id
        if (this.operatorLevel1() === this.operatorLevel2()) {
          this.equal1()
          d.operator1 = d.operator2
          d.operator2 = ''
          d.showNumberArr = d.numArr1
        } else {
          d.showNumberArr = d.numArr2
        }

        this.showResult()
      }
    }
  },
  equalButton() {
    // =按钮
    const d = this.data;
    if (d.operator1 === '') {
    } else if (d.operator1 !== '' && d.operator2 === '') {
      // 6 - 3 (=); 6 + 3 (=); 6 × 3 (=); 6 ÷ 3 (=);
      d.btnOperatorChecked !== '' && (d.numArr2 = [...d.numArr1]) // 特殊情况: 6 + <=> ==> 6 + 6 <=> or 6 × <=>  ==> 6 × 6 <=>
      this.equal1()
      d.showNumberArr = d.numArr1;

      this.showResult()
    } else {
      // 6 - 3 ÷ 1 (=);
      d.btnOperatorChecked !== '' && (d.numArr3 = [...d.numArr2]) // 特殊情况: 6 - 3 ÷ <=>  ==> 6 - 3 ÷ 3 <=>
      this.equal2()
      this.equal1()
      d.showNumberArr = d.numArr1;

      this.showResult()
    }
  },
  equal1() {
    const d = this.data;
    const nNumArr1 = Number(d.numArr1.join(''))
    const nNumArr2 = Number(d.numArr2.join(''))
    let result
    if (d.operator1 === 'multiplication') {
      result = nNumArr1 * nNumArr2
    } else if (d.operator1 === 'divisor') {
      result = nNumArr1 / nNumArr2
    } else if (d.operator1 === 'plus') {
      result = nNumArr1 + nNumArr2
    } else if (d.operator1 === 'minus') {
      result = nNumArr1 - nNumArr2
    }
    d.numArr1 = String(result).split('')
    d.operator1 = ''
    d.numArr2 = ['0']
  },
  equal2() {
    const d = this.data;
    // 计算numArr2与numArr3 ；如2+3×5×，计算的是后面的3×5,并将值放入numArr2，其他numArr3=['0'], operator2=''
    const nNumArr2 = Number(d.numArr2.join(''))
    const nNumArr3 = Number(d.numArr3.join(''))
    let result
    if (d.operator2 === 'multiplication') {
      result = nNumArr2 * nNumArr3
    } else if (d.operator2 === 'divisor') {
      result = nNumArr2 / nNumArr3
    }
    d.numArr2 = String(result).split('')
    d.operator2 = ''
    d.numArr3 = ['0']
  },
  operatorLevel1: function () {
    const d = this.data;
    if (d.operator1 === '') {
      return 0
    } else {
      return (d.operator1 === 'plus' || d.operator1 === 'minus') ? 1 : 2
    }
  },
  operatorLevel2: function () {
    const d = this.data;
    if (d.operator2 === '') {
      return 0
    } else {
      return (d.operator2 === 'plus' || d.operator2 === 'minus') ? 1 : 2
    }
  },
  showNumberLength: function () {
    let fontArr = [...this.data.showNumberArr]
    fontArr[0] === '-' && fontArr.shift()
    fontArr.includes('.') && fontArr.splice(fontArr.indexOf('.'), 1)
    return fontArr.length
  },
  showResult() {
    //渲染结果
    const d = this.data;
    if (this.showNumberLength() < 9) {
      d.show.showNumber = d.showNumberArr.join('')
    } else {
      //显示指数
      const num = new Number(d.showNumberArr.join('')).toExponential(1)
      const str = String(num)
      d.show.showNumber = str
    }
    
    this.setData({
      show: d.show
    })
  },
  btntouchstart(e) {
    const index = e.currentTarget.dataset.index;
    const buttons = this.data.buttons
    buttons[index].touchstart = true
    buttons[index].touchend = false
    this.setData({
      buttons
    })
  },
  btntouchend(e) {
    const index = e.currentTarget.dataset.index;
    const buttons = this.data.buttons
    for (let item of buttons) {
      item.touchend = false
    }
    buttons[index].touchstart = false
    buttons[index].touchend = true
    this.setData({
      buttons
    })
    /* ——————————————————————计算逻辑—————————————————————— */

    if (index === 18) {
      this.equalButton(index)
    } else if ([3, 7, 11, 15].includes(index)) {
      this.operatorButton(index)
    } else if (index === 0) {
      // this.data.btnOperatorChecked = ''
      this.data.showNumberArr = ['0']
      this.data.numArr1 = ['0']
      this.data.numArr2 = ['0']
      this.data.numArr3 = ['0']
      this.data.operator1 = ''
      this.data.operator2 = ''
      this.showResult()
    } else if ([1, 2].includes(index)) {
      this.numberButton(index)
    } else if (index === 17) {
      this.numberButton(index)
    } else {
      (this.showNumberLength() < 8 || this.data.btnOperatorChecked !== '') && this.numberButton(index)
    }
    if ([3, 7, 11, 15].includes(index)) {
      this.data.btnOperatorChecked = this.data.buttons[index].btnId
    } else {
      this.data.btnOperatorChecked = ''
    }
  }

})
