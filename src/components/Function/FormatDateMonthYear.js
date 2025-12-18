import React from 'react';

export default function FormatDate({ props }) {

  const formatDate = (date) => {
    const [year, month, day] = date.split('-');
    return `${year}`;
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      {formatDate(props)}
    </div>
  );
}
