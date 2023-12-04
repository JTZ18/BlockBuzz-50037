export const formatTimestamp = (timestamp: string): string => {
  const postDate = new Date(timestamp);
  const currentDate = new Date();
  
  // Get the difference in days
  const diffInDays = Math.floor(
    (currentDate.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Format to hours and minutes, e.g., '10:30am'
  const formatHoursMinutes = (date: Date): string => {
    let hours = date.getHours();
    let minutes: number | string = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // If 0, make it 12
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutes}${ampm}`;
  }

  if (diffInDays === 0) {
    // If the post was made today
    return `Today ${formatHoursMinutes(postDate)}`;
  } else if (diffInDays === 1) {
    // If the post was made yesterday
    return `Yesterday ${formatHoursMinutes(postDate)}`;
  } else {
    // If the post was made more than a day ago, show full date
    return `${postDate.getDate()}/${postDate.getMonth() + 1}/${postDate.getFullYear()} ${formatHoursMinutes(postDate)}`;
  }
}

// Example usage:
// const readableDate = formatTimestamp("2023-06-15T10:30:00.000Z");
// console.log(readableDate); // Expected output: '15/6/2023 10:30am'
