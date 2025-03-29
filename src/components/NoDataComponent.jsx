import React from 'react';
import '../styles/error.css';

export function NoDataComponent() {
  return (
    <div className="error">
      <p className="firstError">Oops!😕 </p>
      <p className="secondError"> We could not find any result</p>
    </div>
  );
}
