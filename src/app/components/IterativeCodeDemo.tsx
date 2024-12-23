"use client"
import { useState, ReactElement } from 'react';

type Matrix = number[][];

class IterativeCode {
  private rows: number;
  private cols: number;

  constructor(rows: number, cols: number) {
    this.rows = rows;
    this.cols = cols;
  }

  createMatrix(rows: number, cols: number): Matrix {
    return Array(rows).fill(null).map(() => Array(cols).fill(0));
  }

  encodeMessage(data: number[]): Matrix {
    const matrix: Matrix = this.createMatrix(this.rows + 1, this.cols + 1);

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (i * this.cols + j < data.length) {
          matrix[i][j] = data[i * this.cols + j];
        }
      }
    }

    for (let i = 0; i < this.rows; i++) {
      matrix[i][this.cols] = this.calculateParity(matrix[i].slice(0, this.cols));
    }

    for (let j = 0; j < this.cols; j++) {
      matrix[this.rows][j] = this.calculateParity(matrix.slice(0, this.rows).map(row => row[j]));
    }

    matrix[this.rows][this.cols] = this.calculateParity(matrix[this.rows].slice(0, this.cols));

    return matrix;
  }

  calculateParity(data: number[]): number {
    return data.reduce((sum, bit) => sum + bit, 0) % 2;
  }

  stringToBinary(text: string): number[] {
    const binary: number[] = [];
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const bits = charCode.toString(2).padStart(8, '0').split('').map(Number);
      binary.push(...bits);
    }
    return binary;
  }
}

type SelectedCell = [number, number] | null;

export default function IterativeCodeDemo(): ReactElement {
  const [input, setInput] = useState<string>('');
  const [encodedMatrix, setEncodedMatrix] = useState<Matrix | null>(null);
  const [selectedCell, setSelectedCell] = useState<SelectedCell>(null);

  const handleEncode = () => {
    const codec = new IterativeCode(4, 8);
    const binaryData = codec.stringToBinary(input);
    const encoded = codec.encodeMessage(binaryData);
    setEncodedMatrix(encoded);
  };

  const toggleCell = (row: number, col: number) => {
    if (encodedMatrix && row < encodedMatrix.length && col < encodedMatrix[0].length) {
      const newMatrix = encodedMatrix.map(r => [...r]);
      newMatrix[row][col] = 1 - newMatrix[row][col];
      setEncodedMatrix(newMatrix);
      setSelectedCell([row, col]);
    }
  };

  const getCellClassName = (i: number, j: number): string => {
    const isSelected = selectedCell && selectedCell[0] === i && selectedCell[1] === j;
    const isParityBit = i === (encodedMatrix?.length ?? 0) - 1 || j === (encodedMatrix?.[0]?.length ?? 0) - 1;
    const cellValue = encodedMatrix?.[i]?.[j] ?? 0;

    return [
      'border p-2 text-center w-8 h-8 cursor-pointer',
      cellValue ? 'bg-blue-200' : 'bg-gray-50',
      isSelected ? 'ring-2 ring-blue-500' : '',
      isParityBit ? 'bg-gray-100' : ''
    ].filter(Boolean).join(' ');
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h1 className="text-2xl font-bold mb-4">Багатовимірні ітеративні коди</h1>

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Введіть текст для кодування:
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-2 border rounded"
            maxLength={4}
            placeholder="Введіть до 4 символів"
          />
        </div>

        <button
          onClick={handleEncode}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Закодувати
        </button>

        {encodedMatrix && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Закодована матриця:</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <tbody>
                  {encodedMatrix.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td
                          key={j}
                          onClick={() => toggleCell(i, j)}
                          className={getCellClassName(i, j)}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              <p>* Клікніть на комірку щоб змінити біт</p>
              <p>* Сірим виділені перевірочні біти</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}