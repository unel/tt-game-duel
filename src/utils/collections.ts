export const removeElementsByIndexes = (arr: unknown[], indexes: number[]) => {
    indexes.sort((a, b) => b - a);
    
    // Удаляем элементы, начиная с конца массива
    for (const index of indexes) {
      arr.splice(index, 1);
    }
  }
