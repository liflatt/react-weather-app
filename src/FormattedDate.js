import React from "react";

export default function FormattedDate({ date }) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayName = days[date.getDay()];

  let hours = date.getHours();
  let minutes = date.getMinutes();
  // Add leading zeros if needed
  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return (
    <span>
      {dayName} {hours}:{minutes}
    </span>
  );
}
