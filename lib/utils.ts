import bcrypt from 'bcryptjs';
import { type ClassValue, clsx } from 'clsx';
import { formatDistanceToNowStrict, parse } from 'date-fns';
import { locale } from 'moment';
// import locale from 'date-fns/locale/en-US';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function saltAndHashPassword(password: any) {
  const saltRounds = 10; // Adjust the cost factor according to your security requirements
  const salt = bcrypt.genSaltSync(saltRounds); // Synchronously generate a salt
  const hash = bcrypt.hashSync(password, salt); // Synchronously hash the password
  return hash; // Return the hash directly as a string
}
export function isBase64Image(imageData: string) {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
  return base64Regex.test(imageData);
}

export function isBase64PDF(pdfData: string) {
  const base64Regex = /^data:application\/pdf;base64,/;
  return base64Regex.test(pdfData);
}

interface BreadcrumbItem {
  name: string;
  path: string;
}

function generateBreadcrumbItems(pathname: string): BreadcrumbItem[] {
  const pathSegments = pathname.split('/').filter(Boolean); // Remove empty segments
  return pathSegments.map((segment, index) => ({
    name: capitalizeFirstLetter(segment), // Optionally capitalize names
    path: `/${pathSegments.slice(1, index + 1).join('/')}`,
  }));
}

function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export { generateBreadcrumbItems };

export function dateToUTCDate(date: Date) {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    )
  );
}

const formatDistanceLocale = {
  lessThanXSeconds: ' just now',
  xSeconds: ' just now',
  halfAMinute: ' just now',
  lessThanXMinutes: '{{count}}m',
  xMinutes: '{{count}}m',
  aboutXHours: '{{count}}h',
  xHours: '{{count}}h',
  xDays: '{{count}}d',
  aboutXWeeks: '{{count}}w',
  xWeeks: '{{count}}w',
  aboutXMonths: '{{count}}m',
  xMonths: '{{count}}m',
  aboutXYears: '{{count}}y',
  xYears: '{{count}}y',
  overXYears: '{{count}}y',
  almostXYears: '{{count}}y',
};

function formatDistance(token: string, count: number, options?: any): string {
  options = options || {};

  const result = formatDistanceLocale[
    token as keyof typeof formatDistanceLocale
  ].replace('{{count}}', count.toString());

  if (options.addSuffix) {
    if (options.comparison > 0) {
      return 'in ' + result;
    } else {
      if (result === 'just now') return result;
      return result + ' ago';
    }
  }

  return result;
}
export function formatTimeToNow(date: Date): string {
  return formatDistanceToNowStrict(date, {
    addSuffix: true,
    locale: {
      ...locale,
      formatDistance,
    },
  });
}
export function convertToAscii(inputString: string) {
  // remove non ascii characters
  const asciiString = inputString.replace(/[^\x00-\x7f]/g, '');
  return asciiString;
}

export const adjustScheduleToCurrentWeek = (
  lessons: { title: string; day: string; start: string; end: string }[]
): { title: string; day: string; start: Date; end: Date }[] => {
  return lessons.map((lesson) => {
    const data = getCurrentWeekSchedule(lesson.start, lesson.end, lesson.day);

    return {
      title: lesson.title,
      day: lesson.day,
      start: data.startDate,
      end: data.endDate,
    };
  });
};
export function timeToInt(time: string) {
  return parseFloat(time.replace(':', '.'));
}
export function stringToTime(timeString: string) {
  return parse(timeString, 'HH:mm', new Date());
}

// Function to convert time string into hours and minutes
export const parseTime = (time: string): { hours: number; minutes: number } => {
  const [hours, minutes] = time.split(':').map(Number);
  return { hours, minutes };
};

export function getCurrentWeekSchedule(
  startTime: string,
  endTime: string,
  workingDay: string
): { startDate: Date; endDate: Date } {
  // Map day names to their numeric day of the week (Sunday = 0, Monday = 1, etc.)
  const daysOfWeek: string[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const targetDayIndex: number = daysOfWeek.indexOf(workingDay);

  if (targetDayIndex === -1) {
    throw new Error(
      "Invalid working day provided. Please provide a valid day of the week, like 'Monday'."
    );
  }

  // Parse start and end times
  const start = parseTime(startTime);
  const end = parseTime(endTime);

  // Get the current date and find the start of the week (Sunday)
  const today = new Date();
  const currentDayIndex = today.getDay();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - currentDayIndex);

  // Calculate the date for the target working day within the current week
  const targetDate = new Date(startOfWeek);
  targetDate.setDate(startOfWeek.getDate() + targetDayIndex);

  // Set the start and end dates to the target working day with the specified times
  const startDate = new Date(targetDate);
  startDate.setHours(start.hours, start.minutes, 0, 0);

  const endDate = new Date(targetDate);
  endDate.setHours(end.hours, end.minutes, 0, 0);

  return { startDate, endDate };
}
