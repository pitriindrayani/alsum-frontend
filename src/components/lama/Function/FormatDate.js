import React from 'react';

export default function FormatDate({ props }) {
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", 
    "Aug", "Sep", "Okt", "Nov", "Des"
  ];

  const formatDate = (date) => {
    const [year, month, day] = date.split('-');
    const monthName = monthNames[parseInt(month, 10) - 1];
    return `${day} ${monthName} ${year}`;
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      {formatDate(props)}
    </div>
  );
}
