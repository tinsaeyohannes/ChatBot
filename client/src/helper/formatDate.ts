import {formatDistanceToNow} from 'date-fns';

export const formatDate = (date: Date) => {
  return formatDistanceToNow(date, {addSuffix: false});
};
