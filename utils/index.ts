// Function to format the time as HH:MM AM/PM
function formatTime(dateString: string): string {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
  
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;  // Convert 24-hour to 12-hour format
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  }
  
  // Function to format the date as Month Day, Year (e.g., Apr 14, 2024)
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const month = date.toLocaleString('default', { month: 'short' });  // Get short month name
    const day = date.getDate();
    const year = date.getFullYear();
  
    return `${month} ${day}, ${year}`;
  }
  

  export const Utils = {
    formatTime,
    formatDate
  }
  