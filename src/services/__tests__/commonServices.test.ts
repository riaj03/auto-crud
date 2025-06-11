import * as fs from 'fs';
import * as commonServices from '../commonServices'; // Import all for spying on mkdirSyncRecursive

// Mock the fs module
jest.mock('fs');

// Typed mocks for fs functions
const mockReadFileSynchronously = fs.readFileSync as jest.Mock;
const mockPathExists = fs.existsSync as jest.Mock;
const mockMakeDirectory = fs.mkdirSync as jest.Mock;
const mockWriteFileAsync = fs.writeFile as jest.Mock;

describe('commonServices', () => {
  describe('lowerCaseFirstLetter (actually upperCaseFirstLetter)', () => {
    it('should make the first letter uppercase for a given string', () => {
      expect(commonServices.lowerCaseFirstLetter('test')).toBe('Test');
      expect(commonServices.lowerCaseFirstLetter('anotherTest')).toBe('AnotherTest');
    });

    it('should work with single character strings', () => {
      expect(commonServices.lowerCaseFirstLetter('a')).toBe('A');
      expect(commonServices.lowerCaseFirstLetter('Z')).toBe('Z');
    });

    it('should return empty string for empty input', () => {
      expect(commonServices.lowerCaseFirstLetter('')).toBe('');
    });
  });

  describe('fileRead', () => {
    const originalPlatform = process.platform;

    afterEach(() => {
      Object.defineProperty(process, 'platform', {
        value: originalPlatform,
      });
      mockReadFileSynchronously.mockReset();
    });

    it('should read file content and return it', () => {
      mockReadFileSynchronously.mockReturnValue('file content');
      const content = commonServices.fileRead('dummy.txt');
      expect(content).toBe('file content');
      expect(mockReadFileSynchronously).toHaveBeenCalledWith('dummy.txt', 'utf8');
    });

    it('should replace \\r characters on Windows', () => {
      Object.defineProperty(process, 'platform', { value: 'win32' });
      mockReadFileSynchronously.mockReturnValue('content\r\nwith\r\rwindows\rlines');
      const content = commonServices.fileRead('dummy.txt');
      expect(content).toBe('content\nwith\n\nwindows\nlines');
    });

    it('should not replace \\r characters on non-Windows', () => {
      Object.defineProperty(process, 'platform', { value: 'linux' });
      mockReadFileSynchronously.mockReturnValue('content\r\nwith\r\nlinux\rlines');
      const content = commonServices.fileRead('dummy.txt');
      expect(content).toBe('content\r\nwith\r\nlinux\rlines');
    });
  });

  describe('mkdirSyncRecursive', () => {
    beforeEach(() => {
      mockPathExists.mockReset();
      mockMakeDirectory.mockReset();
    });

    it('should create a single directory if it does not exist', () => {
      mockPathExists.mockReturnValue(false);
      commonServices.mkdirSyncRecursive('testdir');
      expect(mockPathExists).toHaveBeenCalledWith('testdir');
      expect(mockMakeDirectory).toHaveBeenCalledWith('testdir');
      expect(mockMakeDirectory).toHaveBeenCalledTimes(1);
    });

    it('should create nested directories path/to/create', () => {
      // specific mockImplementation for existsSync
      mockPathExists.mockImplementation((pathValue: string) => {
        if (pathValue === 'path') return true; // 'path' exists
        if (pathValue === 'path/to') return false; // 'path/to' does not exist
        if (pathValue === 'path/to/create') return false; // 'path/to/create' does not exist
        return false; // Default for any other paths
      });

      commonServices.mkdirSyncRecursive('path/to/create');

      expect(mockPathExists).toHaveBeenCalledWith('path');
      expect(mockPathExists).toHaveBeenCalledWith('path/to');
      expect(mockPathExists).toHaveBeenCalledWith('path/to/create');

      expect(mockMakeDirectory).toHaveBeenCalledTimes(2);
      expect(mockMakeDirectory).toHaveBeenCalledWith('path/to');
      expect(mockMakeDirectory).toHaveBeenCalledWith('path/to/create');
    });

    it('should create nested directories a/b/c when none exist', () => {
      mockPathExists.mockReturnValue(false);

      commonServices.mkdirSyncRecursive('a/b/c');

      expect(mockPathExists).toHaveBeenCalledWith('a');
      expect(mockPathExists).toHaveBeenCalledWith('a/b');
      expect(mockPathExists).toHaveBeenCalledWith('a/b/c');

      expect(mockMakeDirectory).toHaveBeenCalledTimes(3);
      expect(mockMakeDirectory).toHaveBeenCalledWith('a');
      expect(mockMakeDirectory).toHaveBeenCalledWith('a/b');
      expect(mockMakeDirectory).toHaveBeenCalledWith('a/b/c');
    });


    it('should not call mkdirSync if directory exists', () => {
      mockPathExists.mockReturnValue(true);
      commonServices.mkdirSyncRecursive('existingdir');
      expect(mockPathExists).toHaveBeenCalledWith('existingdir');
      expect(mockMakeDirectory).not.toHaveBeenCalled();
    });

    it('should handle paths ending with a slash', () => {
        mockPathExists.mockReturnValue(false);
        commonServices.mkdirSyncRecursive('testdir/');
        expect(mockPathExists).toHaveBeenCalledWith('testdir');
        expect(mockMakeDirectory).toHaveBeenCalledWith('testdir');
    });

     it('should not attempt to create empty segment if path starts with slash (absolute path)', () => {
        mockPathExists.mockImplementation((pathValue: string) => pathValue !== '/abs/path');
        commonServices.mkdirSyncRecursive('/abs/path');
        // Segment '' should not be processed by existsSync or mkdirSync
        expect(mockPathExists).not.toHaveBeenCalledWith('');
        expect(mockMakeDirectory).not.toHaveBeenCalledWith('');
        expect(mockPathExists).toHaveBeenCalledWith('/abs');
        expect(mockPathExists).toHaveBeenCalledWith('/abs/path');
        expect(mockMakeDirectory).toHaveBeenCalledWith('/abs/path'); // Assuming /abs exists or is handled
    });
  });

  describe('writeCodeFile', () => {
    let mkdirRecursiveSpy: jest.SpyInstance;
    let consoleLogSpy: jest.SpyInstance;
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
      // Spy on the exported mkdirSyncRecursive and mock its implementation for these tests
      mkdirRecursiveSpy = jest.spyOn(commonServices, 'mkdirSyncRecursive').mockImplementation(() => {});
      consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockWriteFileAsync.mockReset();
    });

    afterEach(() => { // Changed from afterAll to afterEach for better test isolation
      mkdirRecursiveSpy.mockRestore();
      consoleLogSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });

    it('should call mkdirSyncRecursive and writeFile with correct parameters, then log success', () => {
      commonServices.writeCodeFile('output/dir', 'myFile', 'ts', 'const x = 10;');

      expect(mkdirRecursiveSpy).toHaveBeenCalledTimes(1);
      expect(mkdirRecursiveSpy).toHaveBeenCalledWith('output/dir');

      expect(mockWriteFileAsync).toHaveBeenCalledTimes(1);
      expect(mockWriteFileAsync).toHaveBeenCalledWith(
        'output/dir/myFile.ts',
        'const x = 10;',
        expect.any(Function) // The callback
      );

      // Simulate successful writeFile by invoking the callback
      const callback = mockWriteFileAsync.mock.calls[0][2];
      callback(null); // null for no error

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith('myFile File constructed successfully!');
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should log error if writeFile fails', () => {
      const writeError = new Error('Disk full');
      mockWriteFileAsync.mockImplementation((path, data, cb) => {
        cb(writeError); // Simulate error
      });

      commonServices.writeCodeFile('output/another', 'errFile', 'js', 'let y = 20;');

      expect(mkdirRecursiveSpy).toHaveBeenCalledWith('output/another');
      expect(mockWriteFileAsync).toHaveBeenCalledWith(
        'output/another/errFile.js',
        'let y = 20;',
        expect.any(Function)
      );

      expect(consoleLogSpy).toHaveBeenCalledTimes(1); // As per current implementation, error is logged via console.log
      expect(consoleLogSpy).toHaveBeenCalledWith('Error: ', writeError);
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should log error with console.error if mkdirSyncRecursive throws', () => {
      const mkdirError = new Error('Permission denied');
      mkdirRecursiveSpy.mockImplementation(() => {
        throw mkdirError;
      });

      commonServices.writeCodeFile('forbidden/dir', 'topSecret', 'ts', '// secret content');

      expect(mkdirRecursiveSpy).toHaveBeenCalledWith('forbidden/dir');
      expect(mockWriteFileAsync).not.toHaveBeenCalled(); // writeFile should not be called if mkdir fails

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(mkdirError);
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });
  });
});
