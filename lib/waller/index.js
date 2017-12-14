"use strict";
exports.__esModule = true;
var Waller = (function () {
    function Waller(rows, columns, message) {
        this.rows = rows;
        this.columns = columns;
        var defaultMessage = 'CRITICAL SYSTEM FAILURE';
        this.defaultScreenCharacter = '#';
        this.messagePaddingSize = 2;
        var hasCustomMessage = message && message.length;
        var preFormattedMessage = hasCustomMessage ? message.toUpperCase() : defaultMessage;
        var formattedMessage = this.expandMessage(preFormattedMessage);
        var minMessageBufferSize = 6;
        var maxMessageLength = this.columns - minMessageBufferSize;
        this.systemMessage = (maxMessageLength > formattedMessage.length) ? formattedMessage : formattedMessage.substring(0, maxMessageLength);
    }
    Waller.prototype.bufferBuilder = function (character, size, toggle) {
        var buffer = '';
        var printedCharacter = character;
        while (size > 0) {
            size -= 1;
            buffer += printedCharacter;
            if (toggle) {
                printedCharacter = printedCharacter === character ? ' ' : character;
            }
        }
        return buffer;
    };
    Waller.prototype.isEven = function (count) {
        return count % 2 === 0;
    };
    Waller.prototype.isOdd = function (count) {
        return !this.isEven(count);
    };
    Waller.prototype.writeColumnsWithMessage = function () {
        var remainingColumns = this.columns;
        var output = '';
        var leftAndRightPaddingCharacters = this.messagePaddingSize * 2;
        var totalMessageLength = this.systemMessage.length + leftAndRightPaddingCharacters;
        var bufferSize = Math.floor((remainingColumns - totalMessageLength) / 2);
        var leftBufferSize = bufferSize;
        var rightBufferSize = bufferSize;
        if (this.isEven(leftBufferSize)) {
            leftBufferSize -= 1;
            rightBufferSize += 1;
        }
        var leftBuffer = this.bufferBuilder(this.defaultScreenCharacter, leftBufferSize, true);
        var rightBuffer = this.bufferBuilder(this.defaultScreenCharacter, rightBufferSize, true);
        var leftSideMessagePadding = this.bufferBuilder(' ', this.messagePaddingSize);
        var rightSideMessagePadding = this.bufferBuilder(' ', this.messagePaddingSize);
        output = this.format('green') + leftBuffer + this.format('reset') +
            this.format('red') + leftSideMessagePadding + this.systemMessage + rightSideMessagePadding + this.format('reset') +
            this.format('green') + rightBuffer + this.format('reset');
        return output;
    };
    Waller.prototype.writeBlockedColumns = function () {
        var remainingColumns = this.columns;
        var isRowLengthEven = remainingColumns % 2 === 0;
        var output = '';
        while (remainingColumns > 0) {
            remainingColumns -= 2;
            output += this.defaultScreenCharacter + ' ';
        }
        return isRowLengthEven ? output : output.trim();
    };
    Waller.prototype.writeRows = function () {
        var remainingRows = this.rows - 2;
        var middleRow = Math.floor(remainingRows / 2);
        var output = '';
        while (remainingRows > 0) {
            remainingRows -= 1;
            if (remainingRows === middleRow) {
                output += this.writeColumnsWithMessage() + '\n';
            }
            else {
                output += this.format('green') + this.writeBlockedColumns() + this.format('reset') + '\n';
            }
        }
        return output;
    };
    Waller.prototype.format = function (option) {
        var formatOptions = {
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
    };
    Waller.prototype.expandMessage = function (input) {
        function expandIterator(result, counter, max) {
            if (counter === max) {
                return result;
            }
            return expandIterator(result += input[counter] + ' ', counter += 1, max);
        }
        return expandIterator('', 0, input.length).trim();
    };
    Waller.prototype.render = function () {
        return this.writeRows();
    };
    return Waller;
}());
exports.Waller = Waller;
//# sourceMappingURL=index.js.map