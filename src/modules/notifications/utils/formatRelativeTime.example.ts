/**
 * Example usage of formatRelativeTime utility
 * 
 * This file demonstrates how to use the formatRelativeTime function
 * in different scenarios.
 */

import { formatRelativeTime } from './formatRelativeTime';

// Example 1: Recent notification (just now)
const now = new Date();
console.log('Just now:', formatRelativeTime(now.toISOString()));

// Example 2: 5 minutes ago
const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
console.log('5 minutes ago:', formatRelativeTime(fiveMinutesAgo.toISOString()));

// Example 3: 2 hours ago
const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
console.log('2 hours ago:', formatRelativeTime(twoHoursAgo.toISOString()));

// Example 4: 3 days ago
const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
console.log('3 days ago:', formatRelativeTime(threeDaysAgo.toISOString()));

// Example 5: 30 days ago (formatted date)
const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
console.log('30 days ago:', formatRelativeTime(thirtyDaysAgo.toISOString()));

// Example 6: Using with notification data
interface Notification {
  id: number;
  title: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

const sampleNotifications: Notification[] = [
  {
    id: 1,
    title: 'New message',
    message: 'You have a new message from John',
    created_at: new Date(Date.now() - 30 * 1000).toISOString(), // 30 seconds ago
    is_read: false,
  },
  {
    id: 2,
    title: 'Task completed',
    message: 'Your task has been completed successfully',
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
    is_read: false,
  },
  {
    id: 3,
    title: 'System update',
    message: 'System will be updated tonight',
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    is_read: true,
  },
  {
    id: 4,
    title: 'Weekly report',
    message: 'Your weekly report is ready',
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    is_read: true,
  },
  {
    id: 5,
    title: 'Account created',
    message: 'Welcome to our platform!',
    created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
    is_read: true,
  },
];

console.log('\nNotification examples:');
sampleNotifications.forEach((notification) => {
  console.log(`- ${notification.title}: ${formatRelativeTime(notification.created_at)}`);
});

// Example 7: React component usage (pseudo-code)
/*
function NotificationItem({ notification }: { notification: Notification }) {
  return (
    <div className={notification.is_read ? 'bg-white' : 'bg-blue-50'}>
      <h3>{notification.title}</h3>
      <p>{notification.message}</p>
      <span className="text-muted-foreground">
        {formatRelativeTime(notification.created_at)}
      </span>
    </div>
  );
}
*/
