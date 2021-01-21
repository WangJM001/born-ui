import type { ReactText } from 'react';

export default function get(entity: any, path: ReactText | ReactText[]) {
  let tempPath: ReactText[] = [''];
  if (typeof path === 'string') {
    if (path.includes('.')) {
      tempPath = path.split('.');
    } else {
      tempPath = [path];
    }
  }
  if (Array.isArray(path)) {
    tempPath = path;
  }
  let current = entity;

  for (let i = 0; i < tempPath.length; i += 1) {
    if (current === null || current === undefined) {
      return undefined;
    }

    current = current[tempPath[i]];
  }

  return current;
}
