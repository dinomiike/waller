import { Waller } from '../src';
import { expect } from 'chai';
import 'mocha';

const defaultRows = 20;
const defaultColumns = 100;
const defaultMessage = 'C R I T I C A L   S Y S T E M   F A I L U R E';
const genericMessage = 'hi';
const formatCodeRed = '\x1b[31m';
const formatCodeGreen = '\x1b[32m';
const formatCodeBlue = '\x1b[34m';
const formatCodeReset = '\x1b[0m';
const formatCodeBright = '\x1b[1m';
let reusableWaller: Waller = null;

describe('Waller class', () => {
  describe('Initialization', () => {
    it('should initialize with a default message', () => {
      const emptyMessage = '';
      const waller = new Waller(defaultRows, defaultColumns, emptyMessage);
      expect(waller.systemMessage).to.equal(defaultMessage);
    });

    it('should set the system message one is provided', () => {
      const customMessage = 'brontosaurus bazooka barrage';
      const expandedCustomMessage = 'B R O N T O S A U R U S   B A Z O O K A   B A R R A G E';
      const waller = new Waller(defaultRows, defaultColumns, customMessage);
      expect(waller.systemMessage).to.equal(expandedCustomMessage);
    });

    it('should trim a custom message if longer than columns in terminal', () => {
      const customColumnSize = 10;
      const customMessage = 'brontosaurus bazooka barrage';
      const trimmedCustomMessage = 'B R O ';
      let waller = new Waller(defaultRows, customColumnSize, customMessage);
      expect(waller.systemMessage).to.equal(trimmedCustomMessage);
    });
  });

  describe('Buffer method', () => {
    it('should allow customized characters for the buffer display', () => {
      let waller = new Waller(defaultRows, defaultColumns, genericMessage);
      let bufferCharacter = '*';
      let bufferSize = 5;
      let bufferResult = '*****';
      expect(waller.bufferBuilder(bufferCharacter, bufferSize)).to.equal(bufferResult);

      waller = new Waller(defaultRows, defaultColumns, genericMessage);
      bufferCharacter = '~';
      bufferSize = 10;
      bufferResult = '~~~~~~~~~~';
      expect(waller.bufferBuilder(bufferCharacter, bufferSize)).to.equal(bufferResult);
    });

    it('should generate a buffer of alternating characters and spaces if toggle is enabled', () => {
      const waller = new Waller(defaultRows, defaultColumns, genericMessage);
      const bufferCharacter = '^';
      const bufferSize = 10;
      const bufferResult = '^ ^ ^ ^ ^ ';
      expect(waller.bufferBuilder(bufferCharacter, bufferSize, true)).to.equal(bufferResult);
    });

    it('should generate a buffer of alternating characters even if the buffer size is odd', () => {
      const waller = new Waller(defaultRows, defaultColumns, genericMessage);
      const bufferCharacter = '%';
      const bufferSize = 15;
      const bufferResult = '% % % % % % % %';
      expect(waller.bufferBuilder(bufferCharacter, bufferSize, true)).to.equal(bufferResult);
    });
  });

  describe('Expand method', () => {
    it('should insert one space between each letter of a given message', () => {
      const customMessage = 'hi';
      const expandedCustomMessage = 'h i';
      const waller = new Waller(defaultRows, defaultColumns, customMessage);
      expect(waller.expandMessage(customMessage)).to.equal(expandedCustomMessage);
    });
  });

  describe('Format method', () => {
    it('should return the correct format settings', () => {
      const waller = new Waller(defaultRows, defaultColumns, genericMessage);
      expect(waller.format('red')).to.equal(formatCodeRed);
      expect(waller.format('green')).to.equal(formatCodeGreen);
      expect(waller.format('blue')).to.equal(formatCodeBlue);
      expect(waller.format('reset')).to.equal(formatCodeReset);
      expect(waller.format('bright')).to.equal(formatCodeBright);
    });

    it('should return undefined if no option is provided', () => {
      const waller = new Waller(defaultRows, defaultColumns, genericMessage);
      expect(waller.format('')).to.be.undefined;
    });
  });

  describe('Helper methods', () => {
    beforeEach(() => {
      reusableWaller = new Waller(defaultRows, defaultColumns, genericMessage);
    });

    it('should properly evaluate even numbers as even or not', () => {
      expect(reusableWaller.isEven(4)).to.be.true;
      expect(reusableWaller.isEven(9)).to.be.false;
    });

    it('should properly evaluate odd numbers as odd or not', () => {
      expect(reusableWaller.isOdd(5)).to.be.true;
      expect(reusableWaller.isOdd(300)).to.be.false;
    });
  });
});
