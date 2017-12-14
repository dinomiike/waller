export class Waller {
  systemMessage: string;
  rows: number;
  columns: number;
  defaultScreenCharacter: string;
  messagePaddingSize: number;

  constructor(rows: number, columns: number, message: string) {
    this.rows = rows;
    this.columns = columns;
    const defaultMessage = 'CRITICAL SYSTEM FAILURE';
    this.defaultScreenCharacter = '#';
    this.messagePaddingSize = 2;

    const hasCustomMessage = message && message.length;
    const preFormattedMessage = hasCustomMessage ? message.toUpperCase() : defaultMessage;
    const formattedMessage = this.expandMessage(preFormattedMessage);
    const minMessageBufferSize = 6;
    const maxMessageLength = this.columns - minMessageBufferSize;

    this.systemMessage = (maxMessageLength > formattedMessage.length) ? formattedMessage : formattedMessage.substring(0, maxMessageLength);
  }

  bufferBuilder(character: string, size: number, toggle?: boolean) {
    let buffer: string = '';
    let printedCharacter: string = character;
  
    while (size > 0) {
      size -= 1;
      buffer += printedCharacter;
      if (toggle) {
        printedCharacter = printedCharacter === character ? ' ' : character;
      }
    }
    return buffer;
  }

  isEven(count: number) {
    return count % 2 === 0;
  }

  isOdd(count: number) {
    return !this.isEven(count);
  }

  writeColumnsWithMessage() {
    let remainingColumns = this.columns;
    let output = '';
  
    const leftAndRightPaddingCharacters = this.messagePaddingSize * 2;
    const totalMessageLength = this.systemMessage.length + leftAndRightPaddingCharacters;
    const bufferSize = Math.floor((remainingColumns - totalMessageLength) / 2);
    let leftBufferSize = bufferSize;
    let rightBufferSize = bufferSize;

    if (this.isEven(leftBufferSize)) {
      leftBufferSize -= 1;
      rightBufferSize += 1;
    }
    
    const leftBuffer = this.bufferBuilder(this.defaultScreenCharacter, leftBufferSize, true);
    const rightBuffer = this.bufferBuilder(this.defaultScreenCharacter, rightBufferSize, true);
    const leftSideMessagePadding = this.bufferBuilder(' ', this.messagePaddingSize);
    const rightSideMessagePadding = this.bufferBuilder(' ', this.messagePaddingSize);

    output = this.format('green') + leftBuffer + this.format('reset') +
      this.format('red') + leftSideMessagePadding + this.systemMessage + rightSideMessagePadding + this.format('reset') +
      this.format('green') + rightBuffer + this.format('reset');
    return output;
  }

  writeBlockedColumns() {
    let remainingColumns = this.columns;
    const isRowLengthEven = remainingColumns % 2 === 0;
    let output = '';
    
    while (remainingColumns > 0) {
      remainingColumns -= 2;
      output += this.defaultScreenCharacter + ' ';
    }
    return isRowLengthEven ? output : output.trim();
  }

  writeRows() {
    let remainingRows = this.rows - 2;
    const middleRow = Math.floor(remainingRows / 2);
    let output = '';
    while (remainingRows > 0) {
      remainingRows -= 1;
      if (remainingRows === middleRow) {
        output += this.writeColumnsWithMessage() + '\n';
      } else {
        output += this.format('green') + this.writeBlockedColumns() + this.format('reset') + '\n';
      }
    }
    return output;
  }

  format(option: string) {
    const formatOptions: { [index: string ]: string } = {
      reset: '\x1b[0m',
      bright: '\x1b[1m',
      dim: '\x1b[2m',
      underscore: '\x1b[4m',
      blink: '\x1b[5m',
      reverse: '\x1b[7m',
      hidden: '\x1b[8m',
      black: '\x1b[30m',
      red: '\x1b[31m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      magenta: '\x1b[35m',
      cyan: '\x1b[36m',
      white: '\x1b[37m'
    };
    return formatOptions[option];
  }

  expandMessage(input: string) {
    function expandIterator(result: string, counter: number, max: number): string {
      if (counter === max) {
        return result;
      }
      return expandIterator(result += input[counter] + ' ', counter += 1, max);
    }
    return expandIterator('', 0, input.length).trim();
  }

  render() {
    return this.writeRows();
  }
}

// module.exports = Waller;
