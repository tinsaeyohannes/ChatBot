// import {formatDistanceToNow} from 'date-fns';

// export const formatDate = (date: Date) => {
//   return formatDistanceToNow(date, {addSuffix: false});
// };

import moment from 'moment';

export const formatDate = (date: Date) => {
  // Convert the date to a Moment.js object
  const momentDate = moment(date);
  // Format the date as relative time
  return momentDate.fromNow();
};
