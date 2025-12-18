import React from 'react';

export default function FormatDate({ props }) {
  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", 
    "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const formatDate = (date) => {
    const [year, month, day] = date.split('-');
    const monthName = monthNames[parseInt(month, 10) - 1];
    return `${monthName}`;
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      {formatDate(props)}
    </div>
  );
}
